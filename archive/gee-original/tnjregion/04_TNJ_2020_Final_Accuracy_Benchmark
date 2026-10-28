
 // =============================================================
 // STAGE 04 - THANJAVUR 2020
 // FROZEN CHENNAI GAUSSIAN MLC ACCURACY BENCHMARK
 //
 // 112 independently reviewed reference points
 // No retraining, fusion, or automatic reference labels
 // =============================================================

 var ROOT = 'projects/assignment-482806/assets/';

 var REFERENCE_ASSET =
   ROOT + 'tnj_2020_reference_112_final_v1';

 var MAP_ASSET =
   ROOT + 'thanjavur_mlc_transfer_2020_frozen_chennai';

 var ROI_ASSET =
   ROOT + 'tnj_city_trace_pilot_roi_2020';

 var CRS = 'EPSG:32644';
 var SCALE = 30;

 var IDS = [1, 2, 3, 4, 5];

 var NAMES = [
   'Built-up',
   'Vegetation',
   'Water',
   'Agricultural/Open',
   'Barren/Fallow'
 ];

 // =============================================================
 // 1. LOAD DATA AND VERIFY REFERENCE LABELS
 // =============================================================

 var roi = ee.FeatureCollection(ROI_ASSET).geometry();

 var reference =
   ee.FeatureCollection(REFERENCE_ASSET);

 var mapped = ee.Image(MAP_ASSET)
   .select('mapped_class');

 print('========== FINAL REFERENCE QA ==========');

 print('Reference features - expect 112:');
 print(reference.size());

 print('Unique point IDs - expect 112:');
 print(
   reference.aggregate_count_distinct('point_id')
 );

 print('Reference class distribution:');
 print(
   reference.aggregate_histogram('reference_class')
 );

 var invalid = reference.filter(
   ee.Filter.or(
     ee.Filter.lt('reference_class', 1),
     ee.Filter.gt('reference_class', 5),
     ee.Filter.notNull(['reference_class']).not()
   )
 );

 print('Invalid or missing labels - expect 0:');
 print(invalid.size());

 // =============================================================
 // 2. EXTRACT FROZEN MLC PREDICTIONS AT REFERENCE POINTS
 // =============================================================

 var checked = mapped.sampleRegions({
   collection: reference,
   properties: [
     'point_id',
     'reference_class',
     'confidence'
   ],
   scale: SCALE,
   projection: ee.Projection(CRS),
   geometries: true,
   tileScale: 8
 });

 print('Mapped validation points - expect 112:');
 print(checked.size());

 print('Unique mapped point IDs - expect 112:');
 print(
   checked.aggregate_count_distinct('point_id')
 );

 print('Mapped-class histogram:');
 print(
   checked.aggregate_histogram('mapped_class')
 );

 // Expected:
 // 1 = 25
 // 2 = 12
 // 3 = 25
 // 4 = 25
 // 5 = 25

 // =============================================================
 // 3. CONFUSION MATRIX
 // =============================================================

 var cm = checked.errorMatrix(
   'reference_class',
   'mapped_class',
   IDS
 );

 print('========== CONFUSION MATRIX ==========');

 print('Rows = Actual reference');
 print('Columns = Predicted Gaussian MLC');

 print(cm);

 print('Unweighted sample overall accuracy:');
 print(cm.accuracy());

 print('Sample producer accuracies:');
 print(cm.producersAccuracy());

 print('Sample user accuracies:');
 print(cm.consumersAccuracy());

 print('Sample kappa (supplementary only):');
 print(cm.kappa());

 // =============================================================
 // 4. CALCULATE MAPPED CLASS AREAS
 // =============================================================

 var grouped = ee.Image.pixelArea()
   .rename('area_m2')
   .updateMask(mapped.mask())
   .addBands(mapped)
   .reduceRegion({
     reducer: ee.Reducer.sum().group({
       groupField: 1,
       groupName: 'mapped_class'
     }),
     geometry: roi,
     crs: CRS,
     scale: SCALE,
     tileScale: 8,
     maxPixels: 1e8
   });

 var groups = ee.List(grouped.get('groups'));

 var areaById = ee.Dictionary.fromLists(

   groups.map(function(g) {
     return ee.Number(
       ee.Dictionary(g).get('mapped_class')
     ).format('%d');
   }),

   groups.map(function(g) {
     return ee.Dictionary(g).get('sum');
   })
 );

 var totalArea = ee.Number(
   groups.iterate(function(g, acc) {
     return ee.Number(acc).add(
       ee.Number(ee.Dictionary(g).get('sum'))
     );
   }, 0)
 );

 print('Valid classified area (km2):');
 print(totalArea.divide(1e6));

 print('Vector ROI area (km2):');
 print(roi.area(1).divide(1e6));

 function mappedArea(id) {
   return ee.Number(
     areaById.get(ee.Number(id).format('%d'), 0)
   );
 }

 function mappedWeight(id) {
   return mappedArea(id).divide(totalArea);
 }

 // =============================================================
 // 5. HELPER FUNCTIONS FOR STRATIFIED ESTIMATION
 // =============================================================

 function nPred(id) {
   return checked.filter(
     ee.Filter.eq('mapped_class', id)
   ).size();
 }

 function cell(actualId, predId) {
   return ee.Number(cm.array().get([
     ee.Number(actualId).subtract(1),
     ee.Number(predId).subtract(1)
   ]));
 }

 function userAccuracy(id) {
   var n = nPred(id);

   return ee.Number(
     ee.Algorithms.If(
       n.gt(0),
       cell(id, id).divide(n),
       0
     )
   );
 }

 function estimatedReferenceShare(referenceId) {

   return ee.Number(
     ee.List.sequence(1, 5).iterate(
       function(predId, acc) {

         var n = nPred(predId);

         var proportion = ee.Number(
           ee.Algorithms.If(
             n.gt(0),
             cell(referenceId, predId).divide(n),
             0
           )
         );

         return ee.Number(acc).add(
           mappedWeight(predId)
             .multiply(proportion)
         );

       }, 0
     )
   );
 }

 // =============================================================
 // 6. AREA-ADJUSTED ACCURACY TABLE
 // =============================================================

 var classRows = ee.FeatureCollection(
   ee.List.sequence(1, 5).map(function(classId) {

     classId = ee.Number(classId);

     var n = nPred(classId);

     var w = mappedWeight(classId);

     var ua = userAccuracy(classId);

     var refShare =
       estimatedReferenceShare(classId);

     var correctAreaShare = w.multiply(ua);

     var pa = ee.Number(
       ee.Algorithms.If(
         refShare.gt(0),
         correctAreaShare.divide(refShare),
         -1
       )
     );

     // Approximate stratified OA variance contribution.
     // Does not correct for spatial autocorrelation.

     var varianceContribution = ee.Number(
       ee.Algorithms.If(
         n.gt(1),
         w.pow(2)
           .multiply(ua)
           .multiply(
             ee.Number(1).subtract(ua)
           )
           .divide(n.subtract(1)),
         0
       )
     );

     return ee.Feature(null, {

       class_id: classId,

       class_name:
         ee.List(NAMES).get(classId.subtract(1)),

       mapped_area_km2:
         mappedArea(classId).divide(1e6),

       mapped_area_weight: w,

       validation_points: n,

       correct_points:
         cell(classId, classId),

       user_accuracy: ua,

       producer_accuracy_area_adjusted: pa,

       estimated_reference_area_km2:
         refShare.multiply(totalArea).divide(1e6),

       weighted_correct_contribution:
         correctAreaShare,

       oa_variance_contribution:
         varianceContribution

     });

   })
 );

 // =============================================================
 // 7. FINAL AREA-ADJUSTED OVERALL ACCURACY
 // =============================================================

 var adjustedOA = ee.Number(
   classRows.aggregate_sum(
     'weighted_correct_contribution'
   )
 );

 var approximateSE = ee.Number(
   classRows.aggregate_sum(
     'oa_variance_contribution'
   )
 ).sqrt();

 var lower = adjustedOA
   .subtract(approximateSE.multiply(1.96))
   .max(0);

 var upper = adjustedOA
   .add(approximateSE.multiply(1.96))
   .min(1);

 print('==========================================');
 print('FINAL THANJAVUR GENERALISATION BENCHMARK');
 print('==========================================');

 print('Class-wise weighted accuracy table:');
 print(classRows);

 print('AREA-ADJUSTED OVERALL ACCURACY (%):');
 print(adjustedOA.multiply(100));

 print('Approximate standard error:');
 print(approximateSE);

 print('Approximate 95% CI lower (%):');
 print(lower.multiply(100));

 print('Approximate 95% CI upper (%):');
 print(upper.multiply(100));

 print(
   'Confidence interval is approximate; it does not ' +
   'account for spatial autocorrelation or reference ' +
   'interpretation uncertainty.'
 );

 // =============================================================
 // 8. EXPORT RESULTS
 // =============================================================

 Export.table.toDrive({
   collection: classRows,
   description:
     'TNJ_2020_112_MLC_CLASS_ACCURACY_V1',
   fileNamePrefix:
     'tnj_2020_112_mlc_accuracy_by_class_v1',
   fileFormat: 'CSV'
 });

 // =============================================================
 // 9. MAP DISPLAY
 // =============================================================

 Map.layers().reset();

 Map.setOptions('SATELLITE');

 Map.centerObject(roi, 12);

 Map.addLayer(
   mapped,
   {
     min: 1,
     max: 5,
     palette: [
       'e31a1c',
       '33a02c',
       '1f78b4',
       'ffb000',
       'b15928'
     ]
   },
   'Frozen Chennai MLC - Thanjavur 2020',
   true
 );

 Map.addLayer(
   ee.FeatureCollection(ROI_ASSET).style({
     color: 'ffffff',
     fillColor: '00000000',
     width: 2
   }),
   {},
   'Thanjavur Pilot ROI',
   true
 );

 print('==========================================');
 print('QA CHECK REQUIRED BEFORE REPORTING');
 print('==========================================');

 print('Expected 112 valid independent references.');
 print('Expected 112 mapped samples.');
 print('Expected 25/12/25/25/25 mapped strata.');
 print('Do not report results if any QA check fails.');

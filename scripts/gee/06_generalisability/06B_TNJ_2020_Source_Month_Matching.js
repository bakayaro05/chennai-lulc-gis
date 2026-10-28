
 // ================================================================
 // EXPERIMENT B V3
 // SOURCE-MONTH MATCHED FROZEN GAUSSIAN MLC
 //
 // Chennai 2020 -> Thanjavur 2020
 // No model retraining or changes to reference labels.
 //
 // FIX:
 // Apply calendar filter BEFORE preprocessing.
 // Preserve original Landsat system:time_start.
 // ================================================================

 var ROOT = 'projects/assignment-482806/assets/';

 var ROI_ASSET =
   ROOT + 'tnj_city_trace_pilot_roi_2020';

 var TRAIN_ASSET =
   ROOT + 'chennai_training_2020_final';

 var BASELINE_ASSET =
   ROOT + 'thanjavur_mlc_transfer_2020_frozen_chennai';

 var REFERENCE_ASSET =
   ROOT + 'tnj_2020_reference_112_final_v1';

 var OUTPUT_ASSET =
   ROOT + 'tnj_2020_experiment_B_source_months_v3';

 var CRS = 'EPSG:32644';
 var SCALE = 30;

 var BANDS = [
   'blue', 'green', 'red',
   'nir', 'swir1', 'swir2',
   'NDVI', 'NDWI', 'NDBI'
 ];

 var RAW = [
   'blue', 'green', 'red',
   'nir', 'swir1', 'swir2'
 ];

 var roiFC = ee.FeatureCollection(ROI_ASSET);
 var roi = roiFC.geometry();

 var training = ee.FeatureCollection(TRAIN_ASSET);
 var reference = ee.FeatureCollection(REFERENCE_ASSET);

 var baseline = ee.Image(BASELINE_ASSET)
   .select('mapped_class');

 // ================================================================
 // 1. LOAD ORIGINAL LANDSAT COLLECTION
 // Keep original timestamps before calendar filtering.
 // ================================================================

 var original = ee.ImageCollection(
   'LANDSAT/LC08/C02/T1_L2'
 )
 .filterBounds(roi)
 .filterDate('2020-01-01', '2021-01-01');

 // Source-matched months:
 // January-May, July-August, December.
 //
 // Selection predefined from Chennai observation coverage,
 // not by tuning Thanjavur validation accuracy.

 var monthFilter = ee.Filter.or(
   ee.Filter.calendarRange(1, 5, 'month'),
   ee.Filter.calendarRange(7, 8, 'month'),
   ee.Filter.calendarRange(12, 12, 'month')
 );

 // IMPORTANT FIX:
 // Filter before applying the preprocessing function.

 var selectedRaw = original.filter(monthFilter);

 // ================================================================
 // 2. LANDSAT PREPROCESSING
 // ================================================================

 function preprocess(im) {

   var qa = im.select('QA_PIXEL');

   var clear = qa.bitwiseAnd(1).eq(0)
     .and(qa.bitwiseAnd(1 << 1).eq(0))
     .and(qa.bitwiseAnd(1 << 2).eq(0))
     .and(qa.bitwiseAnd(1 << 3).eq(0))
     .and(qa.bitwiseAnd(1 << 4).eq(0))
     .and(qa.bitwiseAnd(1 << 5).eq(0))
     .and(im.select('QA_RADSAT').eq(0));

   return im.select(
     [
       'SR_B2', 'SR_B3', 'SR_B4',
       'SR_B5', 'SR_B6', 'SR_B7'
     ],
     RAW
   )
   .multiply(0.0000275)
   .add(-0.2)
   .updateMask(clear)
   .toFloat()
   .copyProperties(im, ['system:time_start']);
 }

 // ================================================================
 // 3. NINE-BAND PREDICTOR STACK
 // ================================================================

 function addIndices(im) {

   var nir = im.select('nir');
   var red = im.select('red');
   var green = im.select('green');
   var swir = im.select('swir1');

   return im.addBands([

     nir.subtract(red)
       .divide(nir.add(red))
       .rename('NDVI'),

     green.subtract(nir)
       .divide(green.add(nir))
       .rename('NDWI'),

     swir.subtract(nir)
       .divide(swir.add(nir))
       .rename('NDBI')

   ]).select(BANDS);
 }

 var selected = selectedRaw.map(preprocess);

 var stack = addIndices(
   selected.median()
 ).clip(roi);

 // ================================================================
 // 4. RECONSTRUCT FROZEN CHENNAI GAUSSIAN PARAMETERS
 // ================================================================

 function buildModel(k) {

   var fc = training.filter(
     ee.Filter.eq('class_id', k)
   );

   var mu = ee.Array([
     BANDS.map(function(b) {
       return fc.aggregate_mean(b);
     })
   ]).transpose();

   var cov = ee.Array(
     fc.makeArray(BANDS, 'v')
       .reduceColumns({
         reducer: ee.Reducer.covariance()
           .setOutputs(['covariance']),
         selectors: ['v']
       }).get('covariance')
   );

   var regularized = cov.add(
     ee.Array.identity(9).multiply(1e-6)
   );

   return {
     k: k,
     mu: mu,
     inv: regularized.matrixInverse(),
     logDet: regularized
       .matrixDeterminant()
       .max(1e-300)
       .log()
   };
 }

 // ================================================================
 // 5. GAUSSIAN LOG-LIKELIHOOD
 // ================================================================

 function logScore(image, model) {

   var x = image.toArray().toArray(1);

   var d = x.subtract(
     ee.Image.constant(model.mu)
   );

   var q = d.arrayTranspose()
     .matrixMultiply(
       ee.Image.constant(model.inv)
     )
     .matrixMultiply(d)
     .arrayGet([0, 0]);

   return q.multiply(-0.5)
     .subtract(
       ee.Image.constant(model.logDet)
         .multiply(0.5)
     )
     .rename('score_' + model.k);
 }

 // ================================================================
 // 6. APPLY FROZEN MLC
 // ================================================================

 var scores = [];

 for (var k = 1; k <= 5; k++) {

   scores.push(
     logScore(stack, buildModel(k))
   );
 }

 var candidate = ee.Image.cat(scores)
   .toArray()
   .arrayArgmax()
   .arrayGet([0])
   .add(1)
   .toByte()
   .rename('experiment_B_class')
   .clip(roi);

 // ================================================================
 // 7. COMPARE ORIGINAL AND EXPERIMENT B PREDICTIONS
 // Preserve original baseline mapped strata.
 // ================================================================

 var checked = ee.Image.cat([

   baseline.unmask(0)
     .rename('baseline_class'),

   candidate.unmask(0)
     .rename('candidate_class')

 ]).sampleRegions({

   collection: reference,

   properties: [
     'point_id',
     'reference_class'
   ],

   scale: SCALE,
   projection: ee.Projection(CRS),
   geometries: false,
   tileScale: 8

 }).map(function(f) {

   var truth = ee.Number(
     f.get('reference_class')
   );

   var b = ee.Number(
     f.get('baseline_class')
   );

   var c = ee.Number(
     f.get('candidate_class')
   );

   return f.set({

     baseline_correct: ee.Number(
       ee.Algorithms.If(truth.eq(b), 1, 0)
     ),

     candidate_correct: ee.Number(
       ee.Algorithms.If(truth.eq(c), 1, 0)
     )

   });
 });

 // ================================================================
 // 8. BASELINE CLASS AREA WEIGHTS
 // ================================================================

 var areaGroups = ee.List(

   ee.Image.pixelArea()
     .rename('m2')
     .addBands(baseline)
     .reduceRegion({

       reducer: ee.Reducer.sum().group({
         groupField: 1,
         groupName: 'class_id'
       }),

       geometry: roi,
       crs: CRS,
       scale: SCALE,
       maxPixels: 1e9,
       tileScale: 8

     }).get('groups')

 );

 var areaDict = ee.Dictionary.fromLists(

   areaGroups.map(function(g) {
     return ee.Number(
       ee.Dictionary(g).get('class_id')
     ).format('%d');
   }),

   areaGroups.map(function(g) {
     return ee.Dictionary(g).get('sum');
   })

 );

 var totalArea = ee.Number(
   areaGroups.iterate(function(g, total) {

     return ee.Number(total).add(
       ee.Number(
         ee.Dictionary(g).get('sum')
       )
     );

   }, 0)
 );

 // ================================================================
 // 9. AREA-ADJUSTED ACCURACY
 // ================================================================

 var rows = ee.FeatureCollection(
   ee.List.sequence(1, 5).map(function(id) {

     id = ee.Number(id);

     var f = checked.filter(
       ee.Filter.eq('baseline_class', id)
     );

     var n = f.size();

     var baseCorrect = f.filter(
       ee.Filter.eq('baseline_correct', 1)
     ).size();

     var newCorrect = f.filter(
       ee.Filter.eq('candidate_correct', 1)
     ).size();

     var w = ee.Number(
       areaDict.get(id.format('%d'), 0)
     ).divide(totalArea);

     return ee.Feature(null, {

       baseline_stratum: id,
       n: n,
       area_weight: w,

       baseline_correct: baseCorrect,
       B_correct: newCorrect,

       baseline_contribution:
         w.multiply(
           ee.Number(baseCorrect).divide(n)
         ),

       B_contribution:
         w.multiply(
           ee.Number(newCorrect).divide(n)
         )

     });

   })
 );

 var baselineOA = ee.Number(
   rows.aggregate_sum('baseline_contribution')
 );

 var BOA = ee.Number(
   rows.aggregate_sum('B_contribution')
 );

 // ================================================================
 // 10. EXPERIMENT B CLASSIFIED AREA
 // ================================================================

 var bArea = ee.Image.pixelArea()
   .rename('m2')
   .updateMask(candidate.mask())
   .reduceRegion({
     reducer: ee.Reducer.sum(),
     geometry: roi,
     crs: CRS,
     scale: SCALE,
     maxPixels: 1e9,
     tileScale: 8
   }).get('m2');

 // ================================================================
 // 11. QUALITY ASSURANCE AND RESULTS
 // ================================================================

 print('====================================');
 print('EXPERIMENT B V3 - NO RETRAINING');
 print('====================================');

 print('All 2020 Landsat scenes - expect 64:');
 print(original.size());

 print('Selected scenes - Jan-May, Jul-Aug, Dec:');
 print(selectedRaw.size());

 print('Matched reference points - expect 112:');
 print(checked.size());

 print('Baseline strata - expect 25/12/25/25/25:');
 print(
   checked.aggregate_histogram('baseline_class')
 );

 print('Unclassified candidate validation points:');
 print(
   checked.filter(
     ee.Filter.eq('candidate_class', 0)
   ).size()
 );

 print('BASELINE ACCURACY % - EXPECT 23.1854:');
 print(baselineOA.multiply(100));

 print('EXPERIMENT B ACCURACY %:');
 print(BOA.multiply(100));

 print('B MINUS BASELINE - PERCENTAGE POINTS:');
 print(
   BOA.subtract(baselineOA)
     .multiply(100)
 );

 print('Experiment B classified area km2:');
 print(
   ee.Number(bArea).divide(1e6)
 );

 print('Baseline-weighted accuracy contributions:');
 print(rows);

 print('EXPERIMENT B CONFUSION MATRIX:');

 print(
   checked.errorMatrix(
     'reference_class',
     'candidate_class',
     [0, 1, 2, 3, 4, 5]
   )
 );

 // ================================================================
 // 12. MAP DISPLAY
 // ================================================================

 Map.layers().reset();

 Map.setOptions('SATELLITE');
 Map.centerObject(roiFC, 12);

 var palette = [
   'e31a1c',
   '33a02c',
   '1f78b4',
   'ffb000',
   'b15928'
 ];

 Map.addLayer(
   baseline,
   {
     min: 1,
     max: 5,
     palette: palette
   },
   'A - Frozen Baseline',
   false
 );

 Map.addLayer(
   candidate,
   {
     min: 1,
     max: 5,
     palette: palette
   },
   'B - Source Month Matching',
   true
 );

 Map.addLayer(
   roiFC.style({
     color: 'ffffff',
     fillColor: '00000000',
     width: 2
   }),
   {},
   'Thanjavur Pilot ROI',
   true
 );

 // ================================================================
 // 13. EXPORT
 // ================================================================

 Export.table.toDrive({

   collection: rows,

   description: 'TNJ2020_B_V3_ACCURACY',

   fileNamePrefix: 'TNJ2020_B_V3_ACCURACY',

   fileFormat: 'CSV'

 });

 Export.image.toAsset({

   image: candidate,

   description: 'TNJ2020_B_V3_MAP',

   assetId: OUTPUT_ASSET,

   region: roi,

   crs: CRS,
   scale: SCALE,
   maxPixels: 1e9,

   pyramidingPolicy: {
     '.default': 'mode'
   }

 });

 print('====================================');
 print('EXPERIMENT B V3 FINISHED');
 print('====================================');

 print('No Gaussian model retraining.');
 print('No changes to original baseline assets.');

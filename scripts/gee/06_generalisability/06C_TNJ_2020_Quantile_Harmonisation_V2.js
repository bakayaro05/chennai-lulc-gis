
 // ================================================================
 // EXPERIMENT C V2 - UNSUPERVISED QUANTILE ALIGNMENT
 // Chennai -> Thanjavur, 2020
 //
 // NO TARGET TRAINING
 // NO GAUSSIAN RETRAINING
 // NO CHANGE TO BASELINE OR REFERENCE ASSETS
 //
 // 90 m quantile estimation, 30 m classification
 // ================================================================

 var ROOT = 'projects/assignment-482806/assets/';
 var CRS = 'EPSG:32644';
 var SCALE = 30;

 var SOURCE_ROI = ee.FeatureCollection(
   ROOT + 'chennai_admin_study_area_clean'
 ).geometry();

 var TARGET_FC = ee.FeatureCollection(
   ROOT + 'tnj_city_trace_pilot_roi_2020'
 );

 var TARGET_ROI = TARGET_FC.geometry();

 var TRAIN = ee.FeatureCollection(
   ROOT + 'chennai_training_2020_final'
 );

 var REF = ee.FeatureCollection(
   ROOT + 'tnj_2020_reference_112_final_v1'
 );

 var BASE = ee.Image(
   ROOT + 'thanjavur_mlc_transfer_2020_frozen_chennai'
 ).select('mapped_class');

 var RAW = [
   'blue', 'green', 'red',
   'nir', 'swir1', 'swir2'
 ];

 var BANDS = [
   'blue', 'green', 'red',
   'nir', 'swir1', 'swir2',
   'NDVI', 'NDWI', 'NDBI'
 ];

 var OUTPUT = ROOT +
   'tnj_2020_experiment_C_quantile_align_v2';

 // ================================================================
 // 1. PREPROCESS LANDSAT
 // ================================================================

 function preprocess(im) {

   var qa = im.select('QA_PIXEL');

   var good = qa.bitwiseAnd(1).eq(0)
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
   .toFloat()
   .updateMask(good)
   .copyProperties(im, ['system:time_start']);
 }

 function getSix(roi) {

   return ee.ImageCollection(
     'LANDSAT/LC08/C02/T1_L2'
   )
   .filterBounds(roi)
   .filterDate('2020-01-01', '2021-01-01')
   .map(preprocess)
   .median()
   .select(RAW)
   .clip(roi);
 }

 // ================================================================
 // 2. CALCULATE THE SAME ORIGINAL INDICES
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

 // ================================================================
 // 3. GENERATE SOURCE AND TARGET COMPOSITES
 // ================================================================

 var sixSource = getSix(SOURCE_ROI);
 var sixTarget = getSix(TARGET_ROI);

 // ================================================================
 // 4. CALCULATE QUANTILES AT 90 M
 //
 // Only TWO spatial reductions:
 // One Chennai, one Thanjavur.
 // Neither uses Thanjavur reference labels.
 // ================================================================

 var perc = ee.Reducer.percentile([25, 50, 75]);

 var qs = ee.Dictionary(
   sixSource.reduceRegion({
     reducer: perc,
     geometry: SOURCE_ROI,
     crs: CRS,
     scale: 90,
     maxPixels: 1e8,
     tileScale: 8
   })
 );

 var qt = ee.Dictionary(
   sixTarget.reduceRegion({
     reducer: perc,
     geometry: TARGET_ROI,
     crs: CRS,
     scale: 90,
     maxPixels: 1e8,
     tileScale: 8
   })
 );

 // ================================================================
 // 5. FIXED BOUNDED AFFINE ADJUSTMENT
 //
 // Gain restricted to 0.85 - 1.15.
 // Offset restricted to -0.03 - +0.03.
 //
 // These are predefined experimental bounds,
 // not optimised using validation accuracy.
 // ================================================================

 var fixedBands = [];
 var adjustFeatures = [];

 for (var i = 0; i < RAW.length; i++) {

   var band = RAW[i];

   var s25 = ee.Number(
     qs.get(band + '_p25')
   );

   var s50 = ee.Number(
     qs.get(band + '_p50')
   );

   var s75 = ee.Number(
     qs.get(band + '_p75')
   );

   var t25 = ee.Number(
     qt.get(band + '_p25')
   );

   var t50 = ee.Number(
     qt.get(band + '_p50')
   );

   var t75 = ee.Number(
     qt.get(band + '_p75')
   );

   var gain = s75.subtract(s25)
     .divide(
       t75.subtract(t25).max(0.0001)
     )
     .max(0.85)
     .min(1.15);

   var offset = s50.subtract(
     gain.multiply(t50)
   )
   .max(-0.03)
   .min(0.03);

   fixedBands.push(
     sixTarget.select(band)
       .multiply(gain)
       .add(offset)
       .rename(band)
   );

   adjustFeatures.push(
     ee.Feature(null, {
       band: band,

       source_p25: s25,
       source_median: s50,
       source_p75: s75,

       target_p25: t25,
       target_median: t50,
       target_p75: t75,

       gain: gain,
       offset: offset
     })
   );
 }

 var adjustTable = ee.FeatureCollection(
   adjustFeatures
 );

 // Recalculate indices from adjusted reflectance.
 var predictors = addIndices(
   ee.Image.cat(fixedBands)
 ).clip(TARGET_ROI);

 // ================================================================
 // 6. RECONSTRUCT FROZEN GAUSSIAN MLC
 // ================================================================

 function frozenModel(k) {

   var fc = TRAIN.filter(
     ee.Filter.eq('class_id', k)
   );

   var mean = ee.Array([
     BANDS.map(function(b) {
       return fc.aggregate_mean(b);
     })
   ]).transpose();

   var covariance = ee.Array(
     fc.makeArray(BANDS, 'v')
       .reduceColumns({
         reducer: ee.Reducer.covariance()
           .setOutputs(['covariance']),
         selectors: ['v']
       }).get('covariance')
   );

   var reg = covariance.add(
     ee.Array.identity(9).multiply(1e-6)
   );

   return {
     id: k,
     mean: mean,
     inverse: reg.matrixInverse(),
     logDet: reg.matrixDeterminant()
       .max(1e-300)
       .log()
   };
 }

 // ================================================================
 // 7. GAUSSIAN LIKELIHOOD SCORE
 // ================================================================

 function gaussianScore(im, model) {

   var delta = im.toArray()
     .toArray(1)
     .subtract(
       ee.Image.constant(model.mean)
     );

   var quadratic = delta.arrayTranspose()
     .matrixMultiply(
       ee.Image.constant(model.inverse)
     )
     .matrixMultiply(delta)
     .arrayGet([0, 0]);

   return quadratic.multiply(-0.5)
     .subtract(
       ee.Image.constant(model.logDet)
         .multiply(0.5)
     )
     .rename('score_' + model.id);
 }

 // ================================================================
 // 8. CLASSIFY WITH THE UNCHANGED MODEL
 // ================================================================

 var scores = [];

 for (var k = 1; k <= 5; k++) {

   scores.push(
     gaussianScore(
       predictors,
       frozenModel(k)
     )
   );
 }

 var C = ee.Image.cat(scores)
   .toArray()
   .arrayArgmax()
   .arrayGet([0])
   .add(1)
   .rename('experiment_C_class')
   .toByte()
   .clip(TARGET_ROI);

 // ================================================================
 // 9. BASELINE-STRATIFIED VALIDATION
 //
 // Critical:
 // Original points were stratified by BASELINE.
 // Preserve original strata and area weights.
 // ================================================================

 var checked = ee.Image.cat([

   BASE.unmask(0)
     .rename('baseline_class'),

   C.unmask(0)
     .rename('candidate_class')

 ]).sampleRegions({

   collection: REF,

   properties: [
     'point_id',
     'reference_class'
   ],

   projection: ee.Projection(CRS),
   scale: SCALE,
   geometries: false,
   tileScale: 8

 }).map(function(f) {

   var truth = ee.Number(
     f.get('reference_class')
   );

   var basePred = ee.Number(
     f.get('baseline_class')
   );

   var candidatePred = ee.Number(
     f.get('candidate_class')
   );

   return f.set({

     base_correct: ee.Number(
       ee.Algorithms.If(
         truth.eq(basePred), 1, 0
       )
     ),

     C_correct: ee.Number(
       ee.Algorithms.If(
         truth.eq(candidatePred), 1, 0
       )
     )

   });
 });

 // ================================================================
 // 10. ORIGINAL BASELINE AREA WEIGHTS
 // ================================================================

 var areaGroups = ee.List(

   ee.Image.pixelArea()
     .rename('area_m2')
     .addBands(BASE)
     .reduceRegion({

       reducer: ee.Reducer.sum().group({
         groupField: 1,
         groupName: 'class_id'
       }),

       geometry: TARGET_ROI,
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
   areaGroups.iterate(function(g, acc) {

     return ee.Number(acc).add(
       ee.Number(
         ee.Dictionary(g).get('sum')
       )
     );

   }, 0)
 );

 // ================================================================
 // 11. WEIGHTED ACCURACY TABLE
 // ================================================================

 var strata = ee.FeatureCollection(

   ee.List.sequence(1, 5).map(function(id) {

     id = ee.Number(id);

     var records = checked.filter(
       ee.Filter.eq('baseline_class', id)
     );

     var n = records.size();

     var b = records.filter(
       ee.Filter.eq('base_correct', 1)
     ).size();

     var c = records.filter(
       ee.Filter.eq('C_correct', 1)
     ).size();

     var w = ee.Number(
       areaDict.get(id.format('%d'), 0)
     ).divide(totalArea);

     return ee.Feature(null, {

       baseline_stratum: id,
       n: n,
       area_weight: w,

       base_correct: b,
       C_correct: c,

       base_contribution:
         w.multiply(
           ee.Number(b).divide(n)
         ),

       C_contribution:
         w.multiply(
           ee.Number(c).divide(n)
         )

     });

   })
 );

 var baseOA = ee.Number(
   strata.aggregate_sum(
     'base_contribution'
   )
 );

 var COA = ee.Number(
   strata.aggregate_sum(
     'C_contribution'
   )
 );

 // ================================================================
 // 12. CLASSIFIED AREA
 // ================================================================

 var classifiedArea = ee.Image.pixelArea()
   .rename('area_m2')
   .updateMask(C.mask())
   .reduceRegion({

     reducer: ee.Reducer.sum(),
     geometry: TARGET_ROI,
     crs: CRS,
     scale: SCALE,
     maxPixels: 1e9,
     tileScale: 8

   }).get('area_m2');

 // ================================================================
 // 13. RESULTS
 // ================================================================

 print('====================================');
 print('EXPERIMENT C V2 - QUANTILE ALIGNMENT');
 print('====================================');

 print('Six-band adjustment parameters:');
 print(adjustTable);

 print('Validation points - expected 112:');
 print(checked.size());

 print('Baseline mapped strata:');
 print(
   checked.aggregate_histogram(
     'baseline_class'
   )
 );

 print('Missing candidate predictions:');
 print(
   checked.filter(
     ee.Filter.eq('candidate_class', 0)
   ).size()
 );

 print('BASELINE ACCURACY % - expected 23.1854:');
 print(baseOA.multiply(100));

 print('EXPERIMENT C ACCURACY %:');
 print(COA.multiply(100));

 print('C MINUS BASELINE - PERCENTAGE POINTS:');
 print(
   COA.subtract(baseOA)
     .multiply(100)
 );

 print('Valid C classified area km2:');
 print(
   ee.Number(classifiedArea).divide(1e6)
 );

 print('EXPERIMENT C CONFUSION MATRIX:');

 print(
   checked.errorMatrix(
     'reference_class',
     'candidate_class',
     [0, 1, 2, 3, 4, 5]
   )
 );

 print('BASELINE STRATUM ACCURACY CONTRIBUTIONS:');
 print(strata);

 // ================================================================
 // 14. MAP DISPLAY
 // ================================================================

 Map.layers().reset();
 Map.setOptions('SATELLITE');
 Map.centerObject(TARGET_FC, 12);

 var palette = [
   'e31a1c',
   '33a02c',
   '1f78b4',
   'ffb000',
   'b15928'
 ];

 Map.addLayer(
   BASE,
   {
     min: 1,
     max: 5,
     palette: palette
   },
   'A - Frozen Baseline',
   false
 );

 Map.addLayer(
   C,
   {
     min: 1,
     max: 5,
     palette: palette
   },
   'C - Unsupervised Harmonisation',
   true
 );

 Map.addLayer(
   TARGET_FC.style({
     color: 'ffffff',
     fillColor: '00000000',
     width: 2
   }),
   {},
   'Thanjavur City Pilot ROI',
   true
 );

 // ================================================================
 // 15. EXPORT RESULTS
 // ================================================================

 Export.table.toDrive({

   collection: adjustTable,

   description:
     'TNJ2020_C_V2_ADJUSTMENT_PARAMS',

   fileNamePrefix:
     'TNJ2020_C_V2_ADJUSTMENT_PARAMS',

   fileFormat: 'CSV'

 });

 Export.table.toDrive({

   collection: strata,

   description:
     'TNJ2020_C_V2_ACCURACY',

   fileNamePrefix:
     'TNJ2020_C_V2_ACCURACY',

   fileFormat: 'CSV'

 });

 Export.image.toAsset({

   image: C,

   description:
     'TNJ2020_C_V2_MAP',

   assetId: OUTPUT,

   region: TARGET_ROI,
   crs: CRS,
   scale: SCALE,
   maxPixels: 1e9,

   pyramidingPolicy: {
     '.default': 'mode'
   }

 });

 print('====================================');
 print('EXPERIMENT C V2 READY');
 print('====================================');

 print('No model retraining.');
 print('No reference labels used for normalisation.');
 print('Frozen baseline preserved.');
 print('Results are exploratory.');

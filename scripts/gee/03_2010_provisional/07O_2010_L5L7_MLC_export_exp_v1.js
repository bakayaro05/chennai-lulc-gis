
 // ============================================================
 // CHENNAI LULC — STAGE 07O
 // EXPORT EXPERIMENTAL 2010 LANDSAT 5 + 7 GAUSSIAN MLC
 //
 // SAME method and manual reference locations as Stage 07N.
 // Both output asset names are NEW; previous assets untouched.
 // The 300-point validation set is NOT used for model fitting.
 // ============================================================

 // 1. CONFIGURATION
 var ROOT = 'projects/assignment-482806/assets/';
 var CRS = 'EPSG:32644';
 var GRID = [30, 0, 399060, 0, -30, 1463250];
 var SCALE = 30;
 var REG = 1e-6;

 var BANDS = [
   'blue', 'green', 'red', 'nir', 'swir1', 'swir2',
   'NDVI', 'NDWI', 'NDBI'
 ];

 var CLASS_IDS = [1, 2, 3, 4, 5];

 var INPUT_STACK =
   ROOT + 'chennai_predictor_stack_2010_L5L7_exp_v1';

 var INPUT_TRAINING =
   ROOT + 'chennai_training_2010_manual_final_v1';

 var OUTPUT_TRAINING =
   ROOT + 'chennai_training_2010_L5L7_manual_exp_v1';

 var OUTPUT_RASTER =
   ROOT + 'chennai_mlc_lulc_2010_L5L7_manual_exp_v1';

 // 2. LOAD LOCKED GEOMETRY AND SAVED INPUTS

 var roi = ee.FeatureCollection(
   ROOT + 'chennai_admin_study_area_clean'
 ).geometry();

 var stack = ee.Image(INPUT_STACK).select(BANDS);

 var originalTraining =
   ee.FeatureCollection(INPUT_TRAINING);

 var projection = ee.Projection(CRS, GRID);

 // 3. RE-EXTRACT ALL NINE NEW VALUES
 // AT THE SAME 600 HISTORICAL TRAINING LOCATIONS
 //
 // Copy ONLY reference metadata.
 // Do not copy the original L5 spectral values.

 var newTraining = stack.sampleRegions({
   collection: originalTraining,
   properties: [
     'class_id',
     'class_name',
     'site_id',
     'grid_key',
     'label_status',
     'source_method',
     'target_year'
   ],
   projection: projection,
   scale: SCALE,
   geometries: true,
   tileScale: 8
 }).map(function(feature) {

   return ee.Feature(feature).set({

     predictor_version: 'L5L7_2010_EXP_V1',

     source_reference_asset: INPUT_TRAINING,

     source_predictor_asset: INPUT_STACK,

     sample_method:
       'SAME_600_MANUAL_LOCATIONS_RESAMPLED'

   });

 });

 // 4. BASIC INPUT QA

 print('========================================');
 print('STAGE 07O — EXPERIMENTAL L5 + L7 MLC EXPORT');
 print('========================================');

 print('Locked ROI area (km2):');
 print(
   roi.area(
     1,
     ee.Projection(CRS)
   ).divide(1e6)
 );

 print('Predictor projection:');
 print(stack.projection());

 print('Predictor bands:');
 print(stack.bandNames());

 print('Original training count (expected 600):');
 print(originalTraining.size());

 print('Resampled training count (expected 600):');
 print(newTraining.size());

 print('New training class distribution:');
 print('Expected: 120 points in every class.');
 print(newTraining.aggregate_histogram('class_id'));

 print('New training site count (expected 28):');
 print(newTraining.aggregate_count_distinct('site_id'));

 print('New training unique pixel keys (expected 600):');
 print(newTraining.aggregate_count_distinct('grid_key'));

 print('Example newly sampled training point:');
 print(newTraining.first());

 // 5. CLASS-SPECIFIC MULTIVARIATE GAUSSIAN PARAMETERS

 function fitClass(classID) {

   var fc = newTraining.filter(
     ee.Filter.eq('class_id', classID)
   );

   var means = BANDS.map(function(b) {
     return fc.aggregate_mean(b);
   });

   var mean = ee.Array([means]).transpose();

   var vectors = fc.makeArray(
     BANDS,
     'gaussian_input'
   );

   var covarianceResult = vectors.reduceColumns({
     reducer: ee.Reducer.covariance()
       .setOutputs(['covariance']),
     selectors: ['gaussian_input']
   });

   var rawCovariance = ee.Array(
     covarianceResult.get('covariance')
   );

   var covariance = rawCovariance.add(
     ee.Array.identity(BANDS.length)
       .multiply(REG)
   );

   return ee.Dictionary({

     class_id: classID,

     sample_count: fc.size(),

     mean: mean,

     inverse: covariance.matrixInverse(),

     determinant: covariance.matrixDeterminant()

   });

 }

 var fitted = CLASS_IDS.map(fitClass);

 // 6. GAUSSIAN PARAMETER QA

 var parameterQA = ee.FeatureCollection(
   CLASS_IDS.map(function(k) {

     var p = ee.Dictionary(fitted[k - 1]);

     var determinant = ee.Number(
       p.get('determinant')
     );

     return ee.Feature(null, {

       class_id: k,

       sample_count: p.get('sample_count'),

       regularized_determinant: determinant,

       determinant_positive: determinant.gt(0)

     });

   })
 );

 print('========================================');
 print('GAUSSIAN PARAMETER QA');
 print('========================================');

 print('All five classes must have 120 samples');
 print('and positive covariance determinants.');

 print(parameterQA);

 // 7. GAUSSIAN LOG-LIKELIHOOD AT EVERY 2010 PIXEL

 var pixelColumn = stack
   .toArray()
   .toArray(1);

 function gaussianScore(parameters, bandName) {

   var p = ee.Dictionary(parameters);

   var meanImage = ee.Image.constant(
     ee.Array(p.get('mean'))
   );

   var inverseImage = ee.Image.constant(
     ee.Array(p.get('inverse'))
   );

   var logDetImage = ee.Image.constant(
     ee.Number(p.get('determinant'))
       .max(1e-300)
       .log()
   );

   var diff = pixelColumn.subtract(meanImage);

   var mahalanobisSq = diff
     .arrayTranspose()
     .matrixMultiply(inverseImage)
     .matrixMultiply(diff)
     .arrayGet([0, 0]);

   return mahalanobisSq
     .multiply(-0.5)
     .subtract(
       logDetImage.multiply(0.5)
     )
     .rename(bandName);

 }

 // 8. COMBINE ALL FIVE CLASS SCORES

 var scores = CLASS_IDS.map(function(k) {

   return gaussianScore(
     fitted[k - 1],
     'score_' + k
   );

 });

 var classified = ee.Image.cat(scores)
   .toArray()
   .arrayArgmax()
   .arrayGet([0])
   .add(1)
   .rename('classification')
   .toInt8()
   .clip(roi);

 // 9. OPTIONAL MAP PREVIEW

 Map.layers().reset();

 Map.centerObject(roi, 10);

 Map.addLayer(
   stack,
   {
     bands: ['red', 'green', 'blue'],
     min: 0.02,
     max: 0.30
   },
   '2010 L5+L7 RGB',
   true
 );

 Map.addLayer(
   classified,
   {
     min: 1,
     max: 5,
     palette: [
       'ff0000',
       '008000',
       '0000ff',
       'ffff00',
       'd2b48c'
     ]
   },
   '2010 L5+L7 MLC — EXPERIMENTAL',
   false
 );

 // 10. EXPORT RE-SAMPLED TRAINING TABLE

 Export.table.toAsset({

   collection: newTraining,

   description:
     'Chennai_2010_L5L7_training_manual_exp_v1',

   assetId: OUTPUT_TRAINING

 });

 // 11. EXPORT EXPERIMENTAL CLASSIFICATION RASTER

 Export.image.toAsset({

   image: classified,

   description:
     'Chennai_2010_L5L7_Gaussian_MLC_exp_v1',

   assetId: OUTPUT_RASTER,

   region: roi,

   crs: CRS,

   crsTransform: GRID,

   maxPixels: 1e10,

   pyramidingPolicy: {
     '.default': 'mode'
   }

 });

 // 12. FINAL STATUS

 print('========================================');
 print('TWO NEW EXPORT TASKS CREATED');
 print('========================================');

 print('New training asset:');
 print(OUTPUT_TRAINING);

 print('New classification raster:');
 print(OUTPUT_RASTER);

 print('Training and validation geometries unchanged.');
 print('All manual labels unchanged.');

 print('Gaussian MLC: nine bands.');
 print('Covariance regularization: 1e-6.');
 print('Class priors: equal.');

 print('Original L5-only assets untouched.');

 print('This model is EXPERIMENTAL.');
 print('Stage 07N development validation OA: 69.33%.');
 print('Class 5 correctly classified: 20/60.');

 print('Fresh independent validation not yet performed.');

 print('========================================');
 print('END STAGE 07O');
 print('========================================');

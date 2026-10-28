
 // ============================================================
 // CHENNAI LULC — STAGE 07N
 // 2010 LANDSAT 5+7 NINE-BAND GAUSSIAN MLC TEST
 // READ ONLY: NO EXPORTS OR MODIFICATION OF SAVED ASSETS
 // ============================================================

 // 1. LOCKED INPUTS
 var ROOT = 'projects/assignment-482806/assets/';
 var CRS = 'EPSG:32644';
 var SCALE = 30;
 var REG = 1e-6;

 var BANDS = [
   'blue', 'green', 'red', 'nir', 'swir1', 'swir2',
   'NDVI', 'NDWI', 'NDBI'
 ];

 var CLASS_IDS = [1, 2, 3, 4, 5];

 var roi = ee.FeatureCollection(
   ROOT + 'chennai_admin_study_area_clean'
 ).geometry();

 var oldStack = ee.Image(
   ROOT + 'chennai_predictor_stack_2010'
 ).select(BANDS);

 var newStack = ee.Image(
   ROOT + 'chennai_predictor_stack_2010_L5L7_exp_v1'
 ).select(BANDS);

 var originalTraining = ee.FeatureCollection(
   ROOT + 'chennai_training_2010_manual_final_v1'
 );

 var validation = ee.FeatureCollection(
   ROOT + 'chennai_validation_2010_final'
 );

 var projection = newStack.projection();

 // 2. RESAMPLE THE SAME 600 HISTORICAL TRAINING LOCATIONS
 //
 // Copy ONLY reference metadata.
 // Do not retain old Landsat 5 predictor band properties.

 var newTraining = newStack.sampleRegions({
   collection: originalTraining,
   properties: [
     'class_id', 'class_name', 'site_id', 'grid_key'
   ],
   projection: projection,
   scale: SCALE,
   geometries: false,
   tileScale: 8
 });

 print('==============================================');
 print('07N — 2010 L5+L7 MLC CONTROLLED EXPERIMENT');
 print('==============================================');

 print('New predictor stack asset:');
 print(ROOT + 'chennai_predictor_stack_2010_L5L7_exp_v1');

 print('New stack projection:');
 print(projection);

 print('New predictor band names:');
 print(newStack.bandNames());

 print('Original training points (expected 600):');
 print(originalTraining.size());

 print('New valid spectral samples (expected 600):');
 print(newTraining.size());

 print('New training samples by class (120 each expected):');
 print(newTraining.aggregate_histogram('class_id'));

 print('Distinct source sites (expected 28):');
 print(newTraining.aggregate_count_distinct('site_id'));

 print('Distinct training pixel keys (expected 600):');
 print(newTraining.aggregate_count_distinct('grid_key'));

 print('Reserved validation points (expected 300):');
 print(validation.size());

 // 3. CHECK SPECTRAL DIFFERENCES AT THE SAME LOCATIONS

 var changeRows = CLASS_IDS.map(function(k) {

   var oldClass = originalTraining.filter(
     ee.Filter.eq('class_id', k)
   );

   var newClass = newTraining.filter(
     ee.Filter.eq('class_id', k)
   );

   return ee.Feature(null, {

     class_id: k,

     count_old: oldClass.size(),
     count_new: newClass.size(),

     L5_NDVI_mean:
       oldClass.aggregate_mean('NDVI'),

     L5L7_NDVI_mean:
       newClass.aggregate_mean('NDVI'),

     L5_NDWI_mean:
       oldClass.aggregate_mean('NDWI'),

     L5L7_NDWI_mean:
       newClass.aggregate_mean('NDWI'),

     L5_NDBI_mean:
       oldClass.aggregate_mean('NDBI'),

     L5L7_NDBI_mean:
       newClass.aggregate_mean('NDBI')

   });

 });

 print('==============================================');
 print('ORIGINAL L5 VS NEW L5+L7 CLASS STATISTICS');
 print('==============================================');

 print(
   ee.FeatureCollection(changeRows).sort('class_id')
 );

 // 4. ESTIMATE MULTIVARIATE GAUSSIAN PARAMETERS
 //
 // Same methodology as 07G:
 // - 9-band class means
 // - 9x9 sample covariance
 // - 1e-6 diagonal regularization
 // - equal class priors

 function fitClass(k) {

   var sub = newTraining.filter(
     ee.Filter.eq('class_id', k)
   );

   var means = BANDS.map(function(b) {
     return sub.aggregate_mean(b);
   });

   var mean = ee.Array([
     means
   ]).transpose();

   var arrayFC = sub.makeArray(
     BANDS,
     'spectral_array'
   );

   var covarianceResult = arrayFC.reduceColumns({

     reducer: ee.Reducer.covariance()
       .setOutputs(['covariance']),

     selectors: ['spectral_array']

   });

   var rawCovariance = ee.Array(
     covarianceResult.get('covariance')
   );

   var regularized = rawCovariance.add(
     ee.Array.identity(BANDS.length).multiply(REG)
   );

   return ee.Dictionary({

     class_id: k,

     n: sub.size(),

     mean: mean,

     determinant:
       regularized.matrixDeterminant(),

     inverse:
       regularized.matrixInverse()

   });

 }

 var fitted = CLASS_IDS.map(fitClass);

 // 5. PARAMETER QUALITY ASSURANCE

 var parameterQA = ee.FeatureCollection(
   CLASS_IDS.map(function(k) {

     var params = ee.Dictionary(fitted[k - 1]);

     var det = ee.Number(
       params.get('determinant')
     );

     return ee.Feature(null, {

       class_id: k,

       training_count: params.get('n'),

       regularized_determinant: det,

       determinant_positive: det.gt(0)

     });

   })
 );

 print('==============================================');
 print('GAUSSIAN MLC PARAMETER QA');
 print('==============================================');

 print(parameterQA);

 // 6. GAUSSIAN LOG-LIKELIHOOD CLASSIFIER
 //
 // g(x) = -0.5 ln|Sigma|
 //        -0.5 (x-mu)' Sigma^-1 (x-mu)

 var predictorColumn = newStack
   .toArray()
   .toArray(1);

 function gaussianScore(params, bandName) {

   params = ee.Dictionary(params);

   var mean = ee.Image.constant(
     ee.Array(params.get('mean'))
   );

   var inverse = ee.Image.constant(
     ee.Array(params.get('inverse'))
   );

   var logDeterminant = ee.Image.constant(
     ee.Number(params.get('determinant'))
       .max(1e-300)
       .log()
   );

   var difference = predictorColumn.subtract(
     mean
   );

   var mahalanobis = difference
     .arrayTranspose()
     .matrixMultiply(inverse)
     .matrixMultiply(difference)
     .arrayGet([0, 0]);

   return mahalanobis
     .multiply(-0.5)
     .subtract(
       logDeterminant.multiply(0.5)
     )
     .rename(bandName);

 }

 // 7. COMBINE FIVE GAUSSIAN CLASS SCORES

 var scoreImages = CLASS_IDS.map(function(k) {

   return gaussianScore(
     fitted[k - 1],
     'score_' + k
   );

 });

 var candidate2010 = ee.Image.cat(scoreImages)
   .toArray()
   .arrayArgmax()
   .arrayGet([0])
   .add(1)
   .rename('classification')
   .toInt8()
   .clip(roi);

 // 8. TRAINING RESUBSTITUTION DIAGNOSTICS
 //
 // Not an independent assessment.

 var trainingPredictions = candidate2010.sampleRegions({

   collection: originalTraining,

   properties: ['class_id'],

   projection: projection,

   scale: SCALE,

   geometries: false,

   tileScale: 8

 });

 var trainingCM = trainingPredictions.errorMatrix(
   'class_id',
   'classification',
   CLASS_IDS
 );

 print('==============================================');
 print('TRAINING RESUBSTITUTION DIAGNOSTICS');
 print('==============================================');

 print('Training predictions (expected 600):');
 print(trainingPredictions.size());

 print('Training confusion matrix:');
 print(trainingCM);

 print('Training accuracy (%):');
 print(
   ee.Number(trainingCM.accuracy())
     .multiply(100)
 );

 print('Original L5-only training accuracy was 86.00%.');

 // 9. VALIDATE EXPERIMENTAL CLASSIFIER
 //
 // Same 300 reserved reference points.
 // No labels changed or transferred.

 var predictions = candidate2010.sampleRegions({

   collection: validation,

   properties: ['class_id'],

   projection: projection,

   scale: SCALE,

   geometries: false,

   tileScale: 8

 });

 var cm = predictions.errorMatrix(
   'class_id',
   'classification',
   CLASS_IDS
 );

 print('==============================================');
 print('L5+L7 EXPERIMENTAL 2010 VALIDATION');
 print('==============================================');

 print('Validation predictions (expected 300):');
 print(predictions.size());

 print('Missing validation predictions (expected 0):');
 print(
   validation.size().subtract(predictions.size())
 );

 print('Predicted class distribution:');
 print(
   predictions.aggregate_histogram('classification')
 );

 print('Confusion matrix:');
 print('Rows = reference; columns = prediction.');
 print('Class order = 1, 2, 3, 4, 5.');

 print(cm);

 print('Overall accuracy (%):');
 print(
   ee.Number(cm.accuracy()).multiply(100)
 );

 print('Kappa:');
 print(cm.kappa());

 print('Producer accuracies:');
 print(cm.producersAccuracy());

 print('User accuracies:');
 print(cm.consumersAccuracy());

 // 10. SPECIFICALLY CHECK VACANT/OPEN LAND
 //
 // Class 5: vacant, unused open land.
 // Green patches and scattered vegetation are allowed.
 //
 // Class 4: agricultural or agriculturally identifiable.

 var vacant = predictions.filter(
   ee.Filter.eq('class_id', 5)
 );

 print('==============================================');
 print('VACANT / OPEN LAND — CLASS 5 AUDIT');
 print('==============================================');

 print('Reference Class 5 points (expected 60):');
 print(vacant.size());

 print('Correctly predicted as Vacant/Open:');

 print(
   vacant.filter(
     ee.Filter.eq('classification', 5)
   ).size()
 );

 print('Incorrectly predicted as Agricultural:');

 print(
   vacant.filter(
     ee.Filter.eq('classification', 4)
   ).size()
 );

 print('Complete Class 5 prediction distribution:');

 print(
   vacant.aggregate_histogram('classification')
 );

 // 11. PREVIOUS BASELINE FOR COMPARISON

 print('==============================================');
 print('BASELINE COMPARISON');
 print('==============================================');

 print('Original Landsat 5-only MLC:');

 print('Independent validation OA = 59.3333%.');
 print('Kappa = 0.4917.');

 print('Vacant/Open correctly classified = 21/60.');
 print('Vacant/Open -> Agricultural errors = 20/60.');

 print('New experiment = Landsat 5 + Landsat 7.');
 print('Same 600 reference locations and original class labels.');
 print('Same Gaussian MLC formulation.');
 print('No automatic label transfer.');

 print('IMPORTANT: Landsat 5 and 7 reflectance');
 print('were merged without additional sensor harmonization.');

 print('Validation set has already been used for diagnostics.');
 print('Treat this comparison as an exploratory assessment.');

 // 12. OPTIONAL MAP PREVIEW — DISABLED BY DEFAULT

 Map.centerObject(roi, 10);

 Map.addLayer(
   candidate2010,
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
   '2010 L5+L7 GAUSSIAN MLC — EXPERIMENTAL',
   false
 );

 // 13. FINAL STATUS

 print('==============================================');
 print('STAGE 07N — DIAGNOSTIC COMPLETE');
 print('==============================================');

 print('No new training asset exported.');
 print('No classification raster exported.');
 print('Original 2010 MLC unchanged.');
 print('Original L5-only predictor unchanged.');
 print('L5+L7 experimental predictor unchanged.');
 print('All validation and training labels unchanged.');

 print('==============================================');
 print('END STAGE 07N');
 print('==============================================');

 // ============================================================
 // END
 // ============================================================

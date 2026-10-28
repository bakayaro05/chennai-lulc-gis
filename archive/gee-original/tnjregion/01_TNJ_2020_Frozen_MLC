
 // ==========================================================
 // SCRIPT 01 - FROZEN CHENNAI GAUSSIAN MLC
 // Apply Chennai 2020 model to Thanjavur City, 2020
 // NO THANJAVUR TRAINING
 // ==========================================================

 var ROOT = 'projects/assignment-482806/assets/';
 var ROI_ASSET = ROOT + 'tnj_city_trace_pilot_roi_2020';
 var TRAIN_ASSET = ROOT + 'chennai_training_2020_final';
 var VALID_ASSET = ROOT + 'chennai_validation_2020_final';
 var OUT_ASSET = ROOT +
   'thanjavur_mlc_transfer_2020_frozen_chennai';

 var CRS = 'EPSG:32644';
 var SCALE = 30;
 var REG = 1e-6;

 var BANDS = [
   'blue', 'green', 'red', 'nir',
   'swir1', 'swir2', 'NDVI', 'NDWI', 'NDBI'
 ];

 var COLORS = [
   'e31a1c', '33a02c', '1f78b4',
   'ffb000', 'b15928'
 ];

 // 1. LOAD CITY ROI
 var city = ee.FeatureCollection(ROI_ASSET);
 var roi = city.geometry();

 print('CITY ROI feature count - expect 1:');
 print(city.size());

 print('City ROI area, km2:');
 print(roi.area(1).divide(1e6));

 // 2. LANDSAT 8 PREPROCESSING
 function preprocess(image) {

   var qa = image.select('QA_PIXEL');
   var sat = image.select('QA_RADSAT');

   var clear = qa.bitwiseAnd(1 << 0).eq(0)
     .and(qa.bitwiseAnd(1 << 1).eq(0))
     .and(qa.bitwiseAnd(1 << 2).eq(0))
     .and(qa.bitwiseAnd(1 << 3).eq(0))
     .and(qa.bitwiseAnd(1 << 4).eq(0))
     .and(qa.bitwiseAnd(1 << 5).eq(0))
     .and(sat.eq(0));

   return image.select(
     [
       'SR_B2', 'SR_B3', 'SR_B4',
       'SR_B5', 'SR_B6', 'SR_B7'
     ],
     [
       'blue', 'green', 'red',
       'nir', 'swir1', 'swir2'
     ]
   )
   .multiply(0.0000275)
   .add(-0.2)
   .updateMask(clear);
 }

 // 3. ADD INDICES
 function addIndices(im) {

   var green = im.select('green');
   var red = im.select('red');
   var nir = im.select('nir');
   var swir1 = im.select('swir1');

   return im.addBands([
     nir.subtract(red)
       .divide(nir.add(red))
       .rename('NDVI'),

     green.subtract(nir)
       .divide(green.add(nir))
       .rename('NDWI'),

     swir1.subtract(nir)
       .divide(swir1.add(nir))
       .rename('NDBI')
   ]);
 }

 // 4. TARGET-YEAR LANDSAT COMPOSITE
 var collection = ee.ImageCollection(
   'LANDSAT/LC08/C02/T1_L2'
 )
 .filterBounds(roi)
 .filterDate('2020-01-01', '2021-01-01')
 .map(preprocess);

 var stack = addIndices(collection.median())
   .select(BANDS)
   .clip(roi);

 print('Thanjavur 2020 Landsat scene count:');
 print(collection.size());

 print('Predictor bands:');
 print(stack.bandNames());

 // 5. FROZEN CHENNAI TRAINING
 var training = ee.FeatureCollection(TRAIN_ASSET);

 print('Chennai training counts:');
 print(training.aggregate_histogram('class_id'));

 // 6. GAUSSIAN PARAMETERS FROM CHENNAI ONLY
 function buildModel(classId) {

   var fc = training.filter(
     ee.Filter.eq('class_id', classId)
   );

   var means = ee.Array([
     BANDS.map(function(b) {
       return fc.aggregate_mean(b);
     })
   ]).transpose();

   var vectors = fc.makeArray(
     BANDS, 'mlc_vector'
   );

   var covariance = ee.Array(
     vectors.reduceColumns({
       reducer: ee.Reducer.covariance()
         .setOutputs(['covariance']),
       selectors: ['mlc_vector']
     }).get('covariance')
   );

   var regularized = covariance.add(
     ee.Array.identity(9).multiply(REG)
   );

   return {
     classId: classId,
     count: fc.size(),
     mean: means,
     inverse: regularized.matrixInverse(),
     logDet: regularized
       .matrixDeterminant()
       .max(1e-300)
       .log()
   };
 }

 var models = [
   buildModel(1),
   buildModel(2),
   buildModel(3),
   buildModel(4),
   buildModel(5)
 ];

 print('Model training count by class - expect 120 each:');
 print(ee.List(models.map(function(m) {
   return m.count;
 })));

 // 7. FULL GAUSSIAN LOG-LIKELIHOOD
 function gaussianScore(image, model) {

   var x = image.toArray().toArray(1);

   var d = x.subtract(
     ee.Image.constant(model.mean)
   );

   var q = d.arrayTranspose()
     .matrixMultiply(
       ee.Image.constant(model.inverse)
     )
     .matrixMultiply(d)
     .arrayGet([0, 0]);

   // Equal priors; common Gaussian constant omitted
   return q.multiply(-0.5)
     .subtract(
       ee.Image.constant(model.logDet)
         .multiply(0.5)
     )
     .rename('score_' + model.classId);
 }

 // 8. SOURCE-DOMAIN PARITY CHECK
 // No validation data is used to fit the model.
 function scoreFeature(feature, model) {

   var vals = ee.List(BANDS).map(function(b) {
     return ee.Number(
       feature.get(ee.String(b))
     );
   });

   var x = ee.Array(vals).reshape([9, 1]);
   var d = x.subtract(model.mean);

   var q = d.transpose()
     .matrixMultiply(model.inverse)
     .matrixMultiply(d)
     .get([0, 0]);

   return ee.Number(q).multiply(-0.5)
     .subtract(
       ee.Number(model.logDet).multiply(0.5)
     );
 }

 var validation = ee.FeatureCollection(VALID_ASSET)
   .filter(ee.Filter.notNull(BANDS));

 print('Valid Chennai reference pixels - expect 300:');
 print(validation.size());

 var parity = validation.map(function(f) {

   var values = ee.Array(
     models.map(function(m) {
       return scoreFeature(f, m);
     })
   );

   var predicted = ee.Number(
     ee.List(values.argmax()).get(0)
   ).add(1);

   return f.set('mapped_class', predicted);
 });

 var cm = parity.errorMatrix(
   'class_id', 'mapped_class',
   [1, 2, 3, 4, 5]
 );

 print('CHENNAI SOURCE PARITY MATRIX');
 print(cm);

 print('CHENNAI SOURCE OVERALL ACCURACY');
 print(cm.accuracy());

 print('Expected historical OA approximately 0.863333.');
 print('Stop if source parity does not match.');

 // 9. CLASSIFY THANJAVUR
 var scoreImages = ee.Image.cat(
   gaussianScore(stack, models[0]),
   gaussianScore(stack, models[1]),
   gaussianScore(stack, models[2]),
   gaussianScore(stack, models[3]),
   gaussianScore(stack, models[4])
 );

 var classified = scoreImages
   .toArray()
   .arrayArgmax()
   .arrayGet([0])
   .add(1)
   .rename('mapped_class')
   .toByte()
   .clip(roi);

 // 10. MAP DISPLAY
 Map.layers().reset();
 Map.setOptions('SATELLITE');
 Map.centerObject(roi, 12);

 Map.addLayer(
   stack,
   {
     bands: ['red', 'green', 'blue'],
     min: 0.02,
     max: 0.30
   },
   '2020 Landsat RGB',
   false
 );

 Map.addLayer(
   classified,
   {
     min: 1,
     max: 5,
     palette: COLORS
   },
   'Transferred Gaussian MLC',
   true
 );

 Map.addLayer(
   city.style({
     color: 'ffff00',
     fillColor: '00000000',
     width: 2
   }),
   {},
   'Thanjavur City ROI',
   true
 );

 // 11. EXPORT TO GEE ASSET
 Export.image.toAsset({
   image: classified,
   description: 'TNJ_2020_FROZEN_CHENNAI_MLC',
   assetId: OUT_ASSET,
   region: roi,
   crs: CRS,
   scale: SCALE,
   maxPixels: 1e13,
   pyramidingPolicy: {
     '.default': 'mode'
   }
 });

 print('Check source parity and target ROI.');
 print('Then start image export in Tasks.');
 print('After completion, run Script 02.');
s
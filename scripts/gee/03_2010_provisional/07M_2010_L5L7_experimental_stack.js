
 // ============================================================
 // CHENNAI LULC — STAGE 07M
 // 2010 LANDSAT 5 + 7 EXPERIMENTAL NINE-BAND STACK
 //
 // Source: Landsat Collection 2 Tier 1 Level 2 SR
 // Period: Full year, 2010
 // Method: Cloud-masked median reflectance composite
 // Indices: Calculated AFTER the annual median
 //
 // IMPORTANT:
 // Original 2010 predictor and MLC raster remain untouched.
 // This stage creates an experimental predictor asset only.
 // No classifier trained. No validation points used.
 // ============================================================

 // 1. CONFIGURATION

 var ROOT = 'projects/assignment-482806/assets/';

 var OUTPUT_ASSET =
   ROOT + 'chennai_predictor_stack_2010_L5L7_exp_v1';

 var roi = ee.FeatureCollection(
   ROOT + 'chennai_admin_study_area_clean'
 ).geometry();

 var oldStack = ee.Image(
   ROOT + 'chennai_predictor_stack_2010'
 );

 var trainingPoints = ee.FeatureCollection(
   ROOT + 'chennai_training_2010_manual_final_v1'
 );

 var CRS = 'EPSG:32644';
 var SCALE = 30;

 // Exact grid from the saved 2010 classification raster.
 var GRID_TRANSFORM = [
   30, 0, 399060,
   0, -30, 1463250
 ];

 var grid = ee.Projection(CRS, GRID_TRANSFORM);

 var RAW = [
   'blue', 'green', 'red',
   'nir', 'swir1', 'swir2'
 ];

 var ALL = RAW.concat([
   'NDVI', 'NDWI', 'NDBI'
 ]);

 var SR_BANDS = [
   'SR_B1', 'SR_B2', 'SR_B3',
   'SR_B4', 'SR_B5', 'SR_B7'
 ];

 // 2. SHARED LANDSAT 5 AND LANDSAT 7 PREPROCESSING

 function preprocess(image) {

   var qa = image.select('QA_PIXEL');
   var sat = image.select('QA_RADSAT');

   var clear = qa.bitwiseAnd(1 << 0).eq(0)
     .and(qa.bitwiseAnd(1 << 1).eq(0))
     .and(qa.bitwiseAnd(1 << 3).eq(0))
     .and(qa.bitwiseAnd(1 << 4).eq(0))
     .and(qa.bitwiseAnd(1 << 5).eq(0))
     .and(sat.eq(0))
     .and(sat.bitwiseAnd(1 << 9).eq(0));

   // Bit 9 of QA_RADSAT = dropped detector pixel.
   // This explicitly protects against L7 SLC-off gaps.
   // sat.eq(0) also excludes those pixels.

   var optical = image
     .select(SR_BANDS, RAW)
     .multiply(0.0000275)
     .add(-0.2);

   return optical
     .updateMask(clear)
     .copyProperties(
       image,
       [
         'system:time_start',
         'LANDSAT_PRODUCT_ID',
         'SPACECRAFT_ID'
       ]
     );
 }

 // 3. ACQUIRE BOTH COLLECTIONS

 var l5 = ee.ImageCollection(
   'LANDSAT/LT05/C02/T1_L2'
 )
   .filterBounds(roi)
   .filterDate('2010-01-01', '2011-01-01')
   .map(preprocess);

 var l7 = ee.ImageCollection(
   'LANDSAT/LE07/C02/T1_L2'
 )
   .filterBounds(roi)
   .filterDate('2010-01-01', '2011-01-01')
   .map(preprocess);

 var combined = l5.merge(l7);

 // 4. BUILD MEDIAN REFLECTANCE COMPOSITES

 var rebuiltL5 = l5.median().clip(roi);

 var combinedSR = combined.median().clip(roi);

 // 5. RECOMPUTE NINE-BAND PREDICTOR STACKS

 function addIndices(image) {

   var nir = image.select('nir');
   var red = image.select('red');
   var green = image.select('green');
   var swir1 = image.select('swir1');

   var ndvi = nir.subtract(red)
     .divide(nir.add(red))
     .rename('NDVI');

   var ndwi = green.subtract(nir)
     .divide(green.add(nir))
     .rename('NDWI');

   var ndbi = swir1.subtract(nir)
     .divide(swir1.add(nir))
     .rename('NDBI');

   // Explicit arithmetic matches original Stage 2B.

   return image
     .addBands([ndvi, ndwi, ndbi])
     .select(ALL);
 }

 var rebuiltL5Stack = addIndices(rebuiltL5);

 var experimentalStack = addIndices(combinedSR)
   .toFloat()
   .clip(roi);

 // 6. CHECK WHETHER ORIGINAL L5 PROCESSING REPRODUCES

 var differenceImage = rebuiltL5Stack
   .subtract(oldStack.select(ALL))
   .abs()
   .reduce(ee.Reducer.max())
   .rename('maximum_difference');

 var comparison = differenceImage.sampleRegions({
   collection: trainingPoints,
   properties: ['class_id', 'site_id'],
   projection: grid,
   geometries: false,
   tileScale: 8
 });

 // 7. COUNT VALID OBSERVATIONS

 var countL5 = l5.select('red')
   .count()
   .unmask(0)
   .clip(roi);

 var countL7 = l7.select('red')
   .count()
   .unmask(0)
   .clip(roi);

 var countCombined = combined.select('red')
   .count()
   .unmask(0)
   .clip(roi);

 var countStats = ee.Image.cat([
   countL5.rename('L5_mean'),
   countL7.rename('L7_mean'),
   countCombined.rename('Combined_mean')
 ]).reduceRegion({
   reducer: ee.Reducer.mean(),
   geometry: roi,
   crs: CRS,
   scale: SCALE,
   maxPixels: 1e9,
   tileScale: 8
 });

 // 8. PRINT QUALITY ASSURANCE

 print('========================================');
 print('STAGE 07M — L5 + L7 EXPERIMENTAL STACK');
 print('========================================');

 print('Landsat 5 scenes (expected 7):');
 print(l5.size());

 print('Landsat 7 scenes (expected 8):');
 print(l7.size());

 print('Total scenes (expected 15):');
 print(combined.size());

 print('Nine-band predictor order:');
 print(experimentalStack.bandNames());

 print('Locked ROI area (km2):');
 print(
   roi.area(1, ee.Projection(CRS))
     .divide(1e6)
 );

 print('L5 / L7 / Combined mean observation counts:');
 print(countStats);

 print('========================================');
 print('ORIGINAL L5 REPRODUCIBILITY CHECK');
 print('========================================');

 print('Training points checked (expected 600):');
 print(comparison.size());

 print('Maximum absolute difference statistics:');
 print(
   comparison.aggregate_stats(
     'maximum_difference'
   )
 );

 print('Points with difference > 0.00001 (expected 0):');

 print(
   comparison.filter(
     ee.Filter.gt('maximum_difference', 0.00001)
   ).size()
 );

 print('If the count above is nonzero,');
 print('do not run the export task.');

 // 9. MAP COMPARISON

 Map.layers().reset();

 Map.setOptions('SATELLITE');

 Map.centerObject(roi, 10);

 Map.addLayer(
   oldStack,
   {
     bands: ['red', 'green', 'blue'],
     min: 0.02,
     max: 0.30
   },
   '2010 L5 ORIGINAL RGB',
   true
 );

 Map.addLayer(
   experimentalStack,
   {
     bands: ['red', 'green', 'blue'],
     min: 0.02,
     max: 0.30
   },
   '2010 L5 + L7 EXPERIMENTAL RGB',
   false
 );

 Map.addLayer(
   countCombined,
   {
     min: 0,
     max: 12,
     palette: [
       'ffffff',
       'ffff99',
       '78c679',
       '006837'
     ]
   },
   'L5 + L7 CLEAR OBSERVATIONS',
   false
 );

 // 10. CREATE NEW EXPERIMENTAL EXPORT

 Export.image.toAsset({

   image: experimentalStack,

   description:
     'Chennai_2010_L5L7_predictor_exp_v1',

   assetId: OUTPUT_ASSET,

   region: roi,

   crs: CRS,

   crsTransform: GRID_TRANSFORM,

   maxPixels: 1e10,

   pyramidingPolicy: {
     '.default': 'mean'
   }

 });

 print('========================================');
 print('STAGE 07M EXPORT TASK CREATED');
 print('========================================');

 print('New asset path:');
 print(OUTPUT_ASSET);

 print('Original Landsat 5 predictor unchanged.');
 print('Original 2010 MLC raster unchanged.');
 print('Training labels unchanged.');
 print('Validation points unchanged.');

 print('No classification has been performed.');

 print('========================================');
 print('END STAGE 07M');
 print('========================================');

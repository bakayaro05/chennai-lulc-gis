
 // ================================================================
 // STAGE 05A.2 V3 - MONTHLY SPECTRAL EXTRACTION (READ ONLY)
 // Chennai and Thanjavur, Landsat 8, January-December 2020
 // FIX: no synthetic image is merged into Landsat collections.
 // ================================================================

 var ROOT = 'projects/assignment-482806/assets/';
 var CRS = 'EPSG:32644';
 var SCALE = 30;
 var MISSING = -9999;

 var REFLECTANCE = [
   'blue', 'green', 'red',
   'nir', 'swir1', 'swir2'
 ];

 var chennaiROI = ee.FeatureCollection(
   ROOT + 'chennai_admin_study_area_clean'
 ).geometry();

 var tnjROI = ee.FeatureCollection(
   ROOT + 'tnj_city_trace_pilot_roi_2020'
 ).geometry();

 var chennaiTraining = ee.FeatureCollection(
   ROOT + 'chennai_training_2020_final'
 );

 var tnjReference = ee.FeatureCollection(
   ROOT + 'tnj_2020_reference_112_final_v1'
 );

 // ================================================================
 // 1. LANDSAT 8 PREPROCESSING
 // Identical scaling and cloud mask to frozen 2020 baseline.
 // ================================================================

 function preprocess(image) {

   var qa = image.select('QA_PIXEL');
   var saturation = image.select('QA_RADSAT');

   var clear = qa.bitwiseAnd(1 << 0).eq(0)
     .and(qa.bitwiseAnd(1 << 1).eq(0))
     .and(qa.bitwiseAnd(1 << 2).eq(0))
     .and(qa.bitwiseAnd(1 << 3).eq(0))
     .and(qa.bitwiseAnd(1 << 4).eq(0))
     .and(qa.bitwiseAnd(1 << 5).eq(0))
     .and(saturation.eq(0));

   return image.select(
       [
         'SR_B2', 'SR_B3', 'SR_B4',
         'SR_B5', 'SR_B6', 'SR_B7'
       ],
       REFLECTANCE
     )
     .multiply(0.0000275)
     .add(-0.2)
     .toFloat()
     .updateMask(clear)
     .copyProperties(image, ['system:time_start']);
 }

 function landsat(roi) {

   return ee.ImageCollection(
     'LANDSAT/LC08/C02/T1_L2'
   )
   .filterBounds(roi)
   .filterDate('2020-01-01', '2021-01-01')
   .map(preprocess);
 }

 // ================================================================
 // 2. EMPTY-MONTH HANDLING
 //
 // Important:
 // This fallback is NOT merged into an ImageCollection.
 // It is used only when the month contains no scenes.
 // ================================================================

 var EMPTY_SIX = ee.Image.constant([
   0, 0, 0, 0, 0, 0
 ])
 .rename(REFLECTANCE)
 .toFloat()
 .updateMask(ee.Image.constant(0))
 .toFloat();

 var ZERO_COUNT = ee.Image.constant(0)
   .rename('red')
   .toFloat();

 // ================================================================
 // 3. MONTHLY SPECTRAL STACK
 //
 // Each month produces:
 //   NDVI
 //   NDWI
 //   NDBI
 //   Clear observation count
 //
 // 12 months x 4 bands = 48 bands.
 // ================================================================

 function makeMonthlyStack(collection) {

   var out = [];

   for (var month = 1; month <= 12; month++) {

     var start = ee.Date.fromYMD(
       2020, month, 1
     );

     var subset = collection.filterDate(
       start,
       start.advance(1, 'month')
     );

     // Crucial fix:
     // Use a conditional instead of merging the
     // fallback image into the Landsat collection.

     var median = ee.Image(
       ee.Algorithms.If(
         subset.size().gt(0),
         subset.median()
           .select(REFLECTANCE)
           .toFloat(),
         EMPTY_SIX
       )
     ).select(REFLECTANCE);

     var observations = ee.Image(
       ee.Algorithms.If(
         subset.size().gt(0),
         subset.select('red')
           .count()
           .toFloat(),
         ZERO_COUNT
       )
     );

     var nir = median.select('nir');
     var red = median.select('red');
     var green = median.select('green');
     var swir1 = median.select('swir1');

     var prefix =
       'm' + (month < 10 ? '0' : '') + month;

     // Calculate indices AFTER monthly band median.
     // This matches the original index procedure.

     var ndvi = nir.subtract(red)
       .divide(nir.add(red));

     var ndwi = green.subtract(nir)
       .divide(green.add(nir));

     var ndbi = swir1.subtract(nir)
       .divide(swir1.add(nir));

     out.push(
       ndvi.rename(prefix + '_NDVI')
         .toFloat()
         .unmask(MISSING, false)
     );

     out.push(
       ndwi.rename(prefix + '_NDWI')
         .toFloat()
         .unmask(MISSING, false)
     );

     out.push(
       ndbi.rename(prefix + '_NDBI')
         .toFloat()
         .unmask(MISSING, false)
     );

     out.push(
       observations
         .rename(prefix + '_clear_count')
         .toFloat()
         .unmask(0, false)
     );
   }

   return ee.Image.cat(out).toFloat();
 }

 // ================================================================
 // 4. CHENNAI AND THANJAVUR COLLECTIONS
 // ================================================================

 var chennaiScenes = landsat(chennaiROI);
 var tnjScenes = landsat(tnjROI);

 var chennaiMonthly = makeMonthlyStack(
   chennaiScenes
 );

 var tnjMonthly = makeMonthlyStack(
   tnjScenes
 );

 // ================================================================
 // 5. PREPARE REFERENCE LOCATIONS
 //
 // Chennai: original source training labels.
 // Thanjavur: independently interpreted labels.
 //
 // These labels are used for DIAGNOSIS ONLY.
 // ================================================================

 var sourcePoints = chennaiTraining.map(
   function(f) {

     return f.set({
       point_id:
         ee.String('CH_').cat(
           ee.String(f.get('system:index'))
         ),

       diagnostic_class:
         f.get('class_id'),

       site:
         'Chennai'
     });
   }
 );

 var targetPoints = tnjReference.map(
   function(f) {

     return f.set({
       diagnostic_class:
         f.get('reference_class'),

       site:
         'Thanjavur'
     });
   }
 );

 // ================================================================
 // 6. EXTRACT CHENNAI MONTHLY VALUES
 // ================================================================

 var sourceSamples = chennaiMonthly.sampleRegions({

   collection: sourcePoints,

   properties: [
     'point_id',
     'diagnostic_class',
     'site'
   ],

   projection: ee.Projection(CRS),

   scale: SCALE,

   geometries: false,

   tileScale: 8
 });

 // ================================================================
 // 7. EXTRACT THANJAVUR MONTHLY VALUES
 // ================================================================

 var targetSamples = tnjMonthly.sampleRegions({

   collection: targetPoints,

   properties: [
     'point_id',
     'diagnostic_class',
     'site'
   ],

   projection: ee.Projection(CRS),

   scale: SCALE,

   geometries: false,

   tileScale: 8
 });

 // ================================================================
 // 8. LIGHTWEIGHT QUALITY ASSURANCE
 //
 // Do not force large computations in the console.
 // ================================================================

 print('====================================');
 print('STAGE 05A.2 V3 - SAFE EXTRACTION');
 print('====================================');

 print('Chennai scene count (previously 21):');
 print(chennaiScenes.size());

 print('Thanjavur scene count (previously 64):');
 print(tnjScenes.size());

 print('Input Chennai point count (expected 600):');
 print(sourcePoints.size());

 print('Input Thanjavur point count (expected 112):');
 print(targetPoints.size());

 print('Chennai monthly bands (expected 48):');
 print(chennaiMonthly.bandNames().size());

 print('Thanjavur monthly bands (expected 48):');
 print(tnjMonthly.bandNames().size());

 print('Missing index values use -9999.');
 print('No clear data in a month means count = 0.');
 print('No Gaussian MLC parameters changed.');

 // ================================================================
 // 9. EXPORT CHENNAI MONTHLY SPECTRAL DATA
 // ================================================================

 Export.table.toDrive({

   collection: sourceSamples,

   description:
     'TNJ05A2_V3_CHENNAI_2020_MONTHLY_POINTS',

   fileNamePrefix:
     'TNJ05A2_V3_CHENNAI_2020_MONTHLY_POINTS',

   fileFormat: 'CSV'
 });

 // ================================================================
 // 10. EXPORT THANJAVUR MONTHLY SPECTRAL DATA
 // ================================================================

 Export.table.toDrive({

   collection: targetSamples,

   description:
     'TNJ05A2_V3_THANJAVUR_2020_MONTHLY_POINTS',

   fileNamePrefix:
     'TNJ05A2_V3_THANJAVUR_2020_MONTHLY_POINTS',

   fileFormat: 'CSV'
 });

 // ================================================================
 // 11. END
 // ================================================================

 print('====================================');
 print('STAGE 05A.2 V3 READY');
 print('====================================');

 print('Run the two NEW export tasks separately.');
 print('Verify exported CSV row counts.');
 print('Do not run exports from V2.');
 print('No baseline assets have been changed.');

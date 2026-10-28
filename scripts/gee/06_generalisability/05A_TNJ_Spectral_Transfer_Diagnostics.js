
 // ===========================================================
 // STAGE 05A - READ-ONLY TRANSFER FAILURE DIAGNOSTIC
 // Chennai 2020 -> Thanjavur 2020 Gaussian MLC
 // No fitting, no altered predictions, no label changes.
 // ===========================================================

 var ROOT = 'projects/assignment-482806/assets/';

 var ROI_ASSET =
   ROOT + 'tnj_city_trace_pilot_roi_2020';

 var MAP_ASSET =
   ROOT + 'thanjavur_mlc_transfer_2020_frozen_chennai';

 var TRAIN_ASSET =
   ROOT + 'chennai_training_2020_final';

 var REF_ASSET =
   ROOT + 'tnj_2020_reference_112_final_v1';

 var CRS = 'EPSG:32644';
 var SCALE = 30;

 var BANDS = [
   'blue', 'green', 'red', 'nir',
   'swir1', 'swir2', 'NDVI', 'NDWI', 'NDBI'
 ];

 var CLASS_NAMES = [
   'Built-up',
   'Vegetation',
   'Water',
   'Agricultural/Open',
   'Barren/Fallow'
 ];

 var roi = ee.FeatureCollection(ROI_ASSET).geometry();

 var mapped = ee.Image(MAP_ASSET)
   .select('mapped_class');

 var training = ee.FeatureCollection(TRAIN_ASSET);

 var reference = ee.FeatureCollection(REF_ASSET);

 // ===========================================================
 // A. BASELINE PARITY CHECK
 // ===========================================================

 var checked = mapped.sampleRegions({
   collection: reference,
   properties: ['point_id', 'reference_class'],
   projection: ee.Projection(CRS),
   scale: SCALE,
   geometries: true,
   tileScale: 8
 });

 var cm = checked.errorMatrix(
   'reference_class',
   'mapped_class',
   [1, 2, 3, 4, 5]
 );

 print('BASELINE REFERENCE COUNT (112):');
 print(reference.size());

 print('BASELINE MATCHED COUNT (112):');
 print(checked.size());

 print('INVALID REFERENCE LABEL COUNT (0):');

 print(
   reference.filter(
     ee.Filter.inList(
       'reference_class',
       [1, 2, 3, 4, 5]
     ).not()
   ).size()
 );

 print('FROZEN CONFUSION MATRIX:');
 print('Rows = actual, columns = predicted');
 print(cm);

 print('RAW SAMPLE ACCURACY (%):');
 print(cm.accuracy().multiply(100));

 // ===========================================================
 // B. REPRODUCE AREA-ADJUSTED ACCURACY
 // ===========================================================

 var areaGroups = ee.List(
   ee.Image.pixelArea()
     .rename('area_m2')
     .addBands(mapped)
     .reduceRegion({
       reducer: ee.Reducer.sum().group({
         groupField: 1,
         groupName: 'mapped_class'
       }),
       geometry: roi,
       crs: CRS,
       scale: SCALE,
       maxPixels: 1e9,
       tileScale: 8
     })
     .get('groups')
 );

 var areaDict = ee.Dictionary.fromLists(

   areaGroups.map(function(g) {
     return ee.Number(
       ee.Dictionary(g).get('mapped_class')
     ).format('%d');
   }),

   areaGroups.map(function(g) {
     return ee.Dictionary(g).get('sum');
   })
 );

 var totalArea = ee.Number(
   areaGroups.iterate(function(g, sum) {
     return ee.Number(sum).add(
       ee.Number(
         ee.Dictionary(g).get('sum')
       )
     );
   }, 0)
 );

 var weightedOA = ee.Number(
   ee.List.sequence(1, 5).iterate(
     function(id, sum) {

       id = ee.Number(id);

       var subset = checked.filter(
         ee.Filter.eq('mapped_class', id)
       );

       var n = subset.size();

       var correct = subset.filter(
         ee.Filter.eq('reference_class', id)
       ).size();

       var weight = ee.Number(
         areaDict.get(id.format('%d'), 0)
       ).divide(totalArea);

       return ee.Number(sum).add(
         weight.multiply(
           ee.Number(correct).divide(n)
         )
       );

     }, 0
   )
 );

 print('AREA-ADJUSTED OA (%) - EXPECT ~23.1854:');
 print(weightedOA.multiply(100));

 print('BASELINE REPRODUCTION WITHIN 0.02 PP:');

 print(
   weightedOA.multiply(100)
     .subtract(23.185410990752946)
     .abs()
     .lt(0.02)
 );

 // ===========================================================
 // C. RECREATE IDENTICAL 2020 LANDSAT PREDICTORS
 // ===========================================================

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

 function indices(im) {

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

   ]);
 }

 var scenes = ee.ImageCollection(
   'LANDSAT/LC08/C02/T1_L2'
 )
 .filterBounds(roi)
 .filterDate('2020-01-01', '2021-01-01')
 .map(preprocess);

 var targetStack = indices(scenes.median())
   .select(BANDS)
   .clip(roi);

 // ===========================================================
 // D. CLEAR-OBSERVATION QUALITY
 // ===========================================================

 var clearCount = scenes
   .select('red')
   .count()
   .rename('clear_count');

 var clearQA = clearCount.reduceRegion({
   reducer: ee.Reducer.percentile([10, 50, 90]),
   geometry: roi,
   crs: CRS,
   scale: SCALE,
   maxPixels: 1e8,
   tileScale: 8
 });

 print('THANJAVUR LANDSAT SCENES - EXPECT 64:');
 print(scenes.size());

 print('CLEAR OBSERVATIONS PER PIXEL:');
 print('P10, P50 and P90:');
 print(clearQA);

 print('SOURCE CHENNAI TRAINING BY CLASS:');
 print(training.aggregate_histogram('class_id'));

 // ===========================================================
 // E. EXTRACT SPECTRAL VALUES AT REFERENCE LOCATIONS
 //
 // Used for post-hoc diagnosis ONLY.
 // Not for model fitting or adaptation.
 // ===========================================================

 var targetReferenceSpectra =
   targetStack.sampleRegions({
     collection: reference,
     properties: [
       'point_id',
       'reference_class'
     ],
     projection: ee.Projection(CRS),
     scale: SCALE,
     geometries: false,
     tileScale: 8
   })
   .filter(ee.Filter.notNull(BANDS));

 print('TARGET SPECTRAL RECORDS - EXPECT 112:');
 print(targetReferenceSpectra.size());

 print('REFERENCE SPECTRA BY CLASS:');

 print(
   targetReferenceSpectra.aggregate_histogram(
     'reference_class'
   )
 );

 // ===========================================================
 // F. SUMMARY STATISTICS HELPER
 // ===========================================================

 var reducer = ee.Reducer.mean().combine({
   reducer2: ee.Reducer.stdDev(),
   sharedInputs: true
 });

 function bandStats(fc, band) {

   return ee.Dictionary(
     fc.reduceColumns({
       reducer: reducer,
       selectors: [band]
     })
   );
 }

 // ===========================================================
 // G. CLASS-CONDITIONAL SPECTRAL SHIFT
 //
 // 5 classes * 9 bands = 45 rows
 // ===========================================================

 var rows = [];

 for (var cls = 1; cls <= 5; cls++) {

   (function(classId) {

     var src = training.filter(
       ee.Filter.eq('class_id', classId)
     );

     var tgt = targetReferenceSpectra.filter(
       ee.Filter.eq('reference_class', classId)
     );

     for (var k = 0; k < BANDS.length; k++) {

       (function(band) {

         var s = bandStats(src, band);
         var t = bandStats(tgt, band);

         var srcMean = ee.Number(s.get('mean'));
         var srcSd = ee.Number(s.get('stdDev'));

         var tgtMean = ee.Number(t.get('mean'));
         var tgtSd = ee.Number(t.get('stdDev'));

         rows.push(
           ee.Feature(null, {

             class_id: classId,

             class_name:
               CLASS_NAMES[classId - 1],

             band: band,

             chennai_training_n: src.size(),

             thanjavur_reference_n: tgt.size(),

             chennai_mean: srcMean,

             chennai_sd: srcSd,

             thanjavur_reference_mean: tgtMean,

             thanjavur_reference_sd: tgtSd,

             mean_shift_target_minus_source:
               tgtMean.subtract(srcMean),

             shift_in_chennai_sd_units:
               tgtMean.subtract(srcMean)
                 .divide(srcSd.max(1e-8)),

             interpretation:
               'POST_HOC_DIAGNOSTIC_ONLY_NOT_CALIBRATION'

           })
         );

       })(BANDS[k]);
     }

   })(cls);
 }

 var signatureTable = ee.FeatureCollection(rows);

 print('=======================================');
 print('CLASS-CONDITIONAL SPECTRAL DIAGNOSTICS');
 print('=======================================');

 print('ALL CLASS SIGNATURES - 45 ROWS:');
 print(signatureTable);

 print('BUILT-UP SPECTRAL COMPARISON:');

 print(
   signatureTable.filter(
     ee.Filter.eq('class_id', 1)
   )
 );

 // ===========================================================
 // H. UNLABELLED SOURCE/TARGET DISTRIBUTION COMPARISON
 //
 // This is a pooled comparison.
 // It can be affected by different class proportions.
 // It is NOT proof of radiometric mismatch.
 // ===========================================================

 var unlabeledTarget = targetStack.sample({
   region: roi,
   projection: ee.Projection(CRS),
   scale: SCALE,
   numPixels: 2500,
   seed: 20261027,
   geometries: false,
   tileScale: 8
 });

 var pooledRows = [];

 for (var j = 0; j < BANDS.length; j++) {

   (function(band) {

     var sourceStats = bandStats(training, band);

     var targetStats = bandStats(
       unlabeledTarget,
       band
     );

     pooledRows.push(
       ee.Feature(null, {

         band: band,

         source_balanced_training_mean:
           sourceStats.get('mean'),

         target_unlabeled_sample_mean:
           targetStats.get('mean'),

         source_balanced_training_sd:
           sourceStats.get('stdDev'),

         target_unlabeled_sample_sd:
           targetStats.get('stdDev'),

         note:
           'POOLED_MIXTURE_DIFFERENCE_NOT_RADIOMETRIC_PROOF'

       })
     );

   })(BANDS[j]);
 }

 var pooledTable = ee.FeatureCollection(pooledRows);

 print('UNLABELLED TARGET PIXELS SAMPLED:');
 print(unlabeledTarget.size());

 print('POOLED NINE-BAND COMPARISON:');
 print(pooledTable);

 // ===========================================================
 // I. RESEARCH BASELINE MANIFEST
 // ===========================================================

 var baselineManifest = ee.FeatureCollection([
   ee.Feature(null, {

     benchmark:
       'A_FROZEN_GAUSSIAN_MLC_CHENNAI_TO_TNJ_2020',

     source_model:
       'chennai_training_2020_final',

     target_prediction:
       MAP_ASSET,

     reference_asset:
       REF_ASSET,

     roi_asset:
       ROI_ASSET,

     source_2020_OA_pct:
       86.33333333333333,

     reference_sample_n:
       reference.size(),

     target_sample_unweighted_OA_pct:
       cm.accuracy().multiply(100),

     target_area_weighted_OA_pct:
       weightedOA.multiply(100),

     target_classified_area_km2:
       totalArea.divide(1e6),

     boundary_status:
       'SCREENSHOT_TRACE_APPROXIMATE',

     reference_status:
       'MANUAL_2020_S2_112_POINTS',

     version:
       'LOCKED_2026_10_27',

     validation_not_for_tuning:
       true

   })
 ]);

 // ===========================================================
 // J. EXPORT DIAGNOSTIC REPORTS
 //
 // These are CSV reports only.
 // None of the frozen GEE assets is overwritten.
 // ===========================================================

 Export.table.toDrive({
   collection: baselineManifest,
   description:
     'TNJ2020_FROZEN_BASELINE_MANIFEST',
   fileNamePrefix:
     'TNJ2020_FROZEN_BASELINE_MANIFEST',
   fileFormat: 'CSV'
 });

 Export.table.toDrive({
   collection: signatureTable,
   description:
     'TNJ2020_STAGE5A_CLASS_SIGNATURE_SHIFTS',
   fileNamePrefix:
     'TNJ2020_STAGE5A_CLASS_SIGNATURE_SHIFTS',
   fileFormat: 'CSV'
 });

 Export.table.toDrive({
   collection: pooledTable,
   description:
     'TNJ2020_STAGE5A_UNLABELED_POOLED_STATS',
   fileNamePrefix:
     'TNJ2020_STAGE5A_UNLABELED_POOLED_STATS',
   fileFormat: 'CSV'
 });

 print('=======================================');
 print('STAGE 05A - DIAGNOSTICS COMPLETE');
 print('=======================================');

 print('No classifier or reference assets modified.');
 print('Inspect source-target class signatures.');
 print('Do not use the 112 labels to tune adaptation.');

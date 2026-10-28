
 // ============================================================
 // CHENNAI LULC - STAGE 08G-15
 // 2010 GAIA + GHSL + TEMPORAL FUSION
 //
 // ORIGINAL vs ADD-ONLY vs TWO-WAY FUSION
 //
 // READ ONLY. NO EXPORTS OR ASSET MODIFICATIONS.
 // ============================================================

 var ROOT = 'projects/assignment-482806/assets/';

 var roi = ee.FeatureCollection(
   ROOT + 'chennai_admin_study_area_clean'
 ).geometry();

 var old10 = ee.Image(
   ROOT + 'chennai_mlc_lulc_2010_L5L7_manual_exp_v1'
 ).select(0).rename('original2010');

 var fused15 = ee.Image(
   ROOT + 'chennai_08g10_2015_temporal_fusion_candidate_v1'
 ).select(0).rename('fused2015');

 var valid10 = ee.FeatureCollection(
   ROOT + 'chennai_validation_2010_final'
 );

 var CRS = 'EPSG:32644';

 var GRID = [30, 0, 399060, 0, -30, 1463250];

 var ORDER = [1, 2, 3, 4, 5];

 var COLORS = [
   'ff0000',
   '008000',
   '0000ff',
   'ffff00',
   'd2b48c'
 ];

 // ============================================================
 // 1. HISTORICAL 2010 SUPPORTING DATASETS
 // ============================================================

 // GAIA: values 9 to 34 mean impervious by 2010.

 var gaiaYear = ee.Image(
   'Tsinghua/FROM-GLC/GAIA/v10'
 ).select('change_year_index').unmask(0);

 var gaiaBy2010 = gaiaYear.gte(9)
   .and(gaiaYear.lte(34));

 // GHSL 2010:
 // built_surface = square metres of built surface
 // within each 100 m grid cell.
 //
 // Use GHSL as classification-supporting evidence.
 // Do not calculate a separate GHSL time series.
 //
 // >0 means some built surface is mapped in that
 // 100 m cell; it does NOT establish the class of
 // every 30 m pixel within the cell.

 var ghsl2010 = ee.Image(
   'JRC/GHSL/P2023A/GHS_BUILT_S/2010'
 ).select('built_surface').unmask(0);

 var ghslPresent = ghsl2010.gt(0);
 var ghslAbsent = ghsl2010.eq(0);

 // ============================================================
 // 2. EXISTING LAND-COVER MASKS
 // ============================================================

 var originalBU = old10.eq(1);

 var originalOpen = old10.eq(4)
   .or(old10.eq(5));

 var laterBU = fused15.eq(1);

 var laterOpen = fused15.eq(4)
   .or(fused15.eq(5));

 // ============================================================
 // 3. BUILT-UP PROMOTION
 // ============================================================

 // Promote 2010 class 4/5 to class 1 ONLY when:
 //
 // 1. GAIA shows impervious by 2010
 // 2. GHSL 2010 reports some built surface
 // 3. 2015 fusion identifies Built-up
 //
 // These are three supporting indicators.
 // They are not independent ground truth.

 var promote = originalOpen
   .and(gaiaBy2010)
   .and(ghslPresent)
   .and(laterBU);

 // ============================================================
 // 4. POTENTIAL BUILT-UP DEMOTION
 // ============================================================

 // This tests the possibility that 2010 has
 // OVERCLASSIFIED some Built-up surfaces.
 //
 // Demote only when:
 //
 // 1. Original 2010 class is Built-up
 // 2. GAIA does NOT show impervious by 2010
 // 3. GHSL reports zero built surface
 // 4. 2015 fusion labels the location class 4 or 5
 //
 // Reassignment uses the later class 4/5 as a
 // provisional label, not proven 2010 ground truth.

 var demote = originalBU
   .and(gaiaBy2010.not())
   .and(ghslAbsent)
   .and(laterOpen);

 // ============================================================
 // 5. CONSTRUCT BOTH EXPERIMENTS
 // ============================================================

 // Candidate A: Adds Built-up only.

 var addOnly = old10.where(promote, 1)
   .rename('addOnly')
   .toByte();

 // Candidate B: Promotes selected class 4/5 pixels
 // and demotes selected original Built-up pixels.

 var twoWay = addOnly.where(demote, fused15)
   .rename('twoWay')
   .toByte();

 // ============================================================
 // 6. PAIRED VALIDATION
 // ============================================================

 var paired = old10.addBands([
   addOnly,
   twoWay
 ]).sampleRegions({

   collection: valid10,

   properties: ['class_id'],

   projection: old10.projection(),

   tileScale: 8,

   geometries: false

 }).map(function(f) {

   var ref = ee.Number(f.get('class_id'));

   var old = ee.Number(f.get('original2010'));

   var a = ee.Number(f.get('addOnly'));

   var b = ee.Number(f.get('twoWay'));

   return f.set({

     add_delta:
       a.eq(ref).subtract(old.eq(ref)),

     two_delta:
       b.eq(ref).subtract(old.eq(ref)),

     add_changed:
       a.neq(old),

     two_changed:
       b.neq(old)

   });

 });

 var cmOld = paired.errorMatrix(
   'class_id',
   'original2010',
   ORDER
 );

 var cmAdd = paired.errorMatrix(
   'class_id',
   'addOnly',
   ORDER
 );

 var cmTwo = paired.errorMatrix(
   'class_id',
   'twoWay',
   ORDER
 );

 var truthBU = paired.filter(
   ee.Filter.eq('class_id', 1)
 );

 var truthOther = paired.filter(
   ee.Filter.neq('class_id', 1)
 );

 function metrics(pred, matrix) {

   return ee.Dictionary({

     OA: matrix.accuracy(),

     BU_recall:
       matrix.producersAccuracy().get([0, 0]),

     BU_TP:
       truthBU.filter(
         ee.Filter.eq(pred, 1)
       ).size(),

     BU_FP:
       truthOther.filter(
         ee.Filter.eq(pred, 1)
       ).size()

   });

 }

 // ============================================================
 // 7. CITYWIDE AREA MEASUREMENT
 // ============================================================

 var common = old10.mask()
   .and(fused15.mask());

 function km2(mask, name) {

   return ee.Image.pixelArea()
     .divide(1e6)
     .updateMask(mask)
     .updateMask(common)
     .rename(name);

 }

 var areaResults = ee.Image.cat([

   km2(
     originalBU,
     'original_2010_BU_km2'
   ),

   km2(
     addOnly.eq(1),
     'addOnly_2010_BU_km2'
   ),

   km2(
     twoWay.eq(1),
     'twoWay_2010_BU_km2'
   ),

   km2(
     promote,
     'promotion_km2'
   ),

   km2(
     promote.and(old10.eq(4)),
     'promotion_from_class4_km2'
   ),

   km2(
     promote.and(old10.eq(5)),
     'promotion_from_class5_km2'
   ),

   km2(
     demote,
     'demotion_km2'
   ),

   km2(
     demote.and(fused15.eq(4)),
     'demotion_to_class4_km2'
   ),

   km2(
     demote.and(fused15.eq(5)),
     'demotion_to_class5_km2'
   ),

   km2(
     laterBU,
     'retained_2015_BU_km2'
   ),

   km2(
     common,
     'common_valid_area_km2'
   )

 ]).reduceRegion({

   reducer: ee.Reducer.sum(),

   geometry: roi,

   crs: CRS,

   crsTransform: GRID,

   maxPixels: 1e8,

   tileScale: 8

 });

 // ============================================================
 // 8. CONSOLE RESULTS
 // ============================================================

 print('===================================================');
 print('STAGE 08G-15 | 2010 GAIA + GHSL FUSION COMPARISON');
 print('===================================================');

 print('Source: 2010 L5/L7 manual experimental v1');

 print('GAIA cutoff: impervious by 2010 (index 9..34)');

 print('GHSL: built_surface > 0 in 2010 100m cell');

 print('2015 fusion used as temporal support, not truth');

 print('2010 original projection:');
 print(old10.projection());

 print('GHSL input band:');
 print(ghsl2010.bandNames());

 print('Validation count (expected 300):');
 print(paired.size());

 print('Validation class balance:');
 print(paired.aggregate_histogram('class_id'));

 print('ORIGINAL 2010 CONFUSION MATRIX:');
 print(cmOld);

 print('ADDITIONS-ONLY CONFUSION MATRIX:');
 print(cmAdd);

 print('TWO-WAY CONFUSION MATRIX:');
 print(cmTwo);

 print('METRICS - ORIGINAL:');
 print(metrics('original2010', cmOld));

 print('METRICS - ADDITIONS-ONLY:');
 print(metrics('addOnly', cmAdd));

 print('METRICS - TWO-WAY:');
 print(metrics('twoWay', cmTwo));

 print('PAIRED CHANGES FROM ORIGINAL:');

 print(ee.Dictionary({

   add_corrected: paired.filter(
     ee.Filter.eq('add_delta', 1)
   ).size(),

   add_worsened: paired.filter(
     ee.Filter.eq('add_delta', -1)
   ).size(),

   add_changed: paired.filter(
     ee.Filter.eq('add_changed', 1)
   ).size(),

   two_corrected: paired.filter(
     ee.Filter.eq('two_delta', 1)
   ).size(),

   two_worsened: paired.filter(
     ee.Filter.eq('two_delta', -1)
   ).size(),

   two_changed: paired.filter(
     ee.Filter.eq('two_changed', 1)
   ).size()

 }));

 print('CITYWIDE MAPPED AREA SUMMARY (km2):');
 print(areaResults);

 print('AREA CHANGES:');

 print(ee.Dictionary({

   addOnly_delta:
     ee.Number(
       areaResults.get('addOnly_2010_BU_km2')
     ).subtract(
       ee.Number(
         areaResults.get('original_2010_BU_km2')
       )
     ),

   twoWay_delta:
     ee.Number(
       areaResults.get('twoWay_2010_BU_km2')
     ).subtract(
       ee.Number(
         areaResults.get('original_2010_BU_km2')
       )
     ),

   twoWay_to_2015_difference:
     ee.Number(
       areaResults.get('retained_2015_BU_km2')
     ).subtract(
       ee.Number(
         areaResults.get('twoWay_2010_BU_km2')
       )
     )

 }));

 print('Validation reused; all results exploratory.');
 print('GAIA/GHSL not ground truth.');
 print('2015 fusion itself incorporates 2020 evidence.');
 print('NO EXPORTS. ORIGINAL ASSETS UNCHANGED.');

 // ============================================================
 // 9. MAP DISPLAY
 // ============================================================

 Map.layers().reset();

 Map.setOptions('SATELLITE');

 Map.addLayer(
   old10,
   {min: 1, max: 5, palette: COLORS},
   '2010 ORIGINAL L5L7 MLC',
   true
 );

 Map.addLayer(
   addOnly,
   {min: 1, max: 5, palette: COLORS},
   '2010 ADD-ONLY FUSION',
   false
 );

 Map.addLayer(
   twoWay,
   {min: 1, max: 5, palette: COLORS},
   '2010 TWO-WAY FUSION',
   false
 );

 Map.addLayer(
   fused15,
   {min: 1, max: 5, palette: COLORS},
   '2015 TEMPORAL REFERENCE',
   false
 );

 Map.addLayer(
   promote.selfMask(),
   {palette: ['00ffff']},
   '2010 PROMOTED TO BUILT-UP',
   false
 );

 Map.addLayer(
   demote.selfMask(),
   {palette: ['ff00ff']},
   '2010 POTENTIAL BUILT-UP OVERCLASSIFICATION',
   false
 );

 Map.centerObject(roi, 10);

 // ============================================================
 // END STAGE 08G-15
 // ============================================================

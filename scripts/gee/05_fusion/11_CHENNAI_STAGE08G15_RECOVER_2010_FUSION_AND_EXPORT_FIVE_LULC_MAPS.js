
 // ===================================================================
 // STAGE 11 - RECOVER ORIGINAL 2010 TWO-WAY FUSION + EXPORT LULC MAPS
 // Source: archived Stage 08G-15 (rules preserved exactly).
 // Reported series: 2010 ORIGINAL + 2015, 2020, 2025 FUSION.
 // Additional SENSITIVITY map: 2010 TWO-WAY FUSION (not official).
 // NO classifier retraining and NO overwriting existing assets.
 // ===================================================================

 var ROOT = 'projects/assignment-482806/assets/';
 var FOLDER = 'Chennai_Fusion_LULC_Maps_2020_Project';
 var CRS = 'EPSG:32644';
 var GRID = [30, 0, 399060, 0, -30, 1463250];
 var CLASS_IDS = [1, 2, 3, 4, 5];
 var NAMES = ['Built-up', 'Vegetation', 'Water',
              'Agricultural/Open', 'Barren/Fallow'];

 // The archived 08G-15 palette (five classes).
 var COLORS = ['ff0000', '008000', '0000ff', 'ffff00', 'd2b48c'];

 var EXPORT_COLOURED_GEOTIFFS = true;
 var SHOW_PNG_LINKS = false;

 var roiFC = ee.FeatureCollection(
   ROOT + 'chennai_admin_study_area_clean'
 );

 var roi = roiFC.geometry();
 var exportRegion = roi.bounds(1);

 // ===================================================================
 // 1. ORIGINAL 2010 INPUT, ORIGINAL FUSED 2015 INPUT
 //
 // IMPORTANT: confirmed 2010 L5/L7 source, NOT the earlier
 // incorrect chennai_mlc_lulc_2010 asset.
 // ===================================================================

 var old10 = ee.Image(
   ROOT + 'chennai_mlc_lulc_2010_L5L7_manual_exp_v1'
 ).select(0).rename('original2010');

 var fused15 = ee.Image(
   ROOT + 'chennai_08g10_2015_temporal_fusion_candidate_v1'
 ).select(0).rename('fused2015');

 var fused20 = ee.Image(
   ROOT + 'chennai_08g10_2020_gaia_wc_fusion_candidate_v1'
 ).select(0).rename('fused2020');

 var fused25 = ee.Image(
   ROOT + 'chennai_08g10_2025_gaia_dw_fusion_candidate_v1'
 ).select(0).rename('fused2025');

 var valid10 = ee.FeatureCollection(
   ROOT + 'chennai_validation_2010_final'
 );

 // ===================================================================
 // 2. EXACT 08G-15 EVIDENCE AND RULES (UNCHANGED)
 // ===================================================================

 var gaiaYear = ee.Image(
   'Tsinghua/FROM-GLC/GAIA/v10'
 ).select('change_year_index').unmask(0);

 var gaiaBy2010 = gaiaYear.gte(9)
   .and(gaiaYear.lte(34));

 var ghsl2010 = ee.Image(
   'JRC/GHSL/P2023A/GHS_BUILT_S/2010'
 ).select('built_surface').unmask(0);

 var ghslPresent = ghsl2010.gt(0);
 var ghslAbsent = ghsl2010.eq(0);

 var originalBU = old10.eq(1);
 var originalOpen = old10.eq(4).or(old10.eq(5));

 var laterBU = fused15.eq(1);
 var laterOpen = fused15.eq(4).or(fused15.eq(5));

 // Promotion: original class 4/5 -> Built-up.
 var promote = originalOpen
   .and(gaiaBy2010)
   .and(ghslPresent)
   .and(laterBU);

 // Demotion: original Built-up -> later class 4/5.
 var demote = originalBU
   .and(gaiaBy2010.not())
   .and(ghslAbsent)
   .and(laterOpen);

 // Preserve original Stage 08G-15 operations.
 var addOnly = old10.where(promote, 1)
   .rename('addOnly')
   .toByte();

 var twoWay = addOnly.where(demote, fused15)
   .rename('twoWay')
   .toByte();

 // ===================================================================
 // 3. REPRODUCE ORIGINAL 2010 PAIRED VALIDATION
 // ===================================================================

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

   var actual = ee.Number(f.get('class_id'));
   var a = ee.Number(f.get('original2010'));
   var b = ee.Number(f.get('addOnly'));
   var c = ee.Number(f.get('twoWay'));

   return f.set({
     add_delta: b.eq(actual).subtract(a.eq(actual)),
     two_delta: c.eq(actual).subtract(a.eq(actual)),
     add_changed: b.neq(a),
     two_changed: c.neq(a)
   });

 });

 var cmOld = paired.errorMatrix(
   'class_id',
   'original2010',
   CLASS_IDS
 );

 var cmAdd = paired.errorMatrix(
   'class_id',
   'addOnly',
   CLASS_IDS
 );

 var cmTwo = paired.errorMatrix(
   'class_id',
   'twoWay',
   CLASS_IDS
 );

 // Original 08G-15 common-mask area method.
 var common = old10.mask().and(fused15.mask());

 function km2(mask, name) {
   return ee.Image.pixelArea()
     .divide(1e6)
     .updateMask(mask)
     .updateMask(common)
     .rename(name);
 }

 var auditArea = ee.Image.cat([

   km2(old10.eq(1), 'baseline2010_BU_km2'),
   km2(addOnly.eq(1), 'add_only_BU_km2'),
   km2(twoWay.eq(1), 'two_way_BU_km2'),

   km2(promote, 'promoted_km2'),
   km2(
     promote.and(old10.eq(4)),
     'promoted_from_4_km2'
   ),
   km2(
     promote.and(old10.eq(5)),
     'promoted_from_5_km2'
   ),

   km2(demote, 'demoted_km2'),
   km2(
     demote.and(fused15.eq(4)),
     'demoted_to_4_km2'
   ),
   km2(
     demote.and(fused15.eq(5)),
     'demoted_to_5_km2'
   )

 ]).reduceRegion({
   reducer: ee.Reducer.sum(),
   geometry: roi,
   crs: CRS,
   crsTransform: GRID,
   maxPixels: 1e8,
   tileScale: 8
 });

 // ===================================================================
 // 4. REPRODUCIBILITY CHECKS
 // ===================================================================

 print('=========== 2010 TWO-WAY RECONSTRUCTION QA ===========');

 print('2010 source projection:');
 print(old10.projection());

 print('Original validation points (expected 300):');
 print(paired.size());

 print('Reference class counts (expected 60 each):');
 print(paired.aggregate_histogram('class_id'));

 print('Original 2010 OA (%) - expected 69.333333:');
 print(cmOld.accuracy().multiply(100));

 print('2010 add-only OA (%) - expected 69.666667:');
 print(cmAdd.accuracy().multiply(100));

 print('2010 two-way OA (%) - expected 71.333333:');
 print(cmTwo.accuracy().multiply(100));

 print('2010 two-way confusion matrix:');
 print(cmTwo);

 print('2010 area audit - expected two_way_BU_km2 approx 304.72:');
 print(auditArea);

 print('Corrected / worsened points - expected 7 / 1:');
 print(ee.Dictionary({
   corrected: paired.filter(
     ee.Filter.eq('two_delta', 1)
   ).size(),

   worsened: paired.filter(
     ee.Filter.eq('two_delta', -1)
   ).size()
 }));

 print('STOP if archived results are not reproduced.');

 // ===================================================================
 // 5. FIVE MAPS - REPORTED SERIES + 2010 SENSITIVITY ALTERNATIVE
 // ===================================================================

 var MAPS = [

   {
     tag: '2010_ORIGINAL_PROVISIONAL',
     year: 2010,
     status: 'OFFICIAL_REPORTED_2010_BASELINE_NOT_FUSED',
     source:
       ROOT + 'chennai_mlc_lulc_2010_L5L7_manual_exp_v1',
     image: old10
   },

   {
     tag: '2010_TWO_WAY_SENSITIVITY',
     year: 2010,
     status: 'EXPLORATORY_2010_FUSION_NOT_OFFICIAL_SERIES',
     source: 'RECONSTRUCTED_FROM_STAGE_08G15',
     image: twoWay
   },

   {
     tag: '2015_TEMPORAL_FUSION',
     year: 2015,
     status: 'RETAINED_FUSION_CANDIDATE',
     source:
       ROOT + 'chennai_08g10_2015_temporal_fusion_candidate_v1',
     image: fused15
   },

   {
     tag: '2020_GAIA_WORLDCOVER_FUSION',
     year: 2020,
     status: 'RETAINED_FUSION_CANDIDATE',
     source:
       ROOT + 'chennai_08g10_2020_gaia_wc_fusion_candidate_v1',
     image: fused20
   },

   {
     tag: '2025_GAIA_DYNAMICWORLD_FUSION',
     year: 2025,
     status: 'RETAINED_FUSION_CANDIDATE',
     source:
       ROOT + 'chennai_08g10_2025_gaia_dw_fusion_candidate_v1',
     image: fused25
   }

 ];

 // ===================================================================
 // 6. EXPORT CATEGORICAL AND COLOURED MAPS
 // ===================================================================

 var rows = [];

 Map.layers().reset();
 Map.setOptions('SATELLITE');
 Map.centerObject(roiFC, 10);

 for (var i = 0; i < MAPS.length; i++) {

   var item = MAPS[i];

   var classified = item.image
     .select(0)
     .rename('lulc_class')
     .clip(roi)
     .toByte();

   var fileBase = 'CHENNAI_' + item.tag;

   // A. Genuine categorical GeoTIFF.
   // Classes 1-5, with 0 reserved for NoData.

   var codes = classified
     .unmask(0, false)
     .toByte();

   Export.image.toDrive({

     image: codes,

     description:
       fileBase + '_CLASS_CODES_30M',

     folder: FOLDER,

     fileNamePrefix:
       fileBase + '_CLASS_CODES_30M',

     region: exportRegion,

     crs: CRS,
     crsTransform: GRID,

     maxPixels: 1e9,

     fileFormat: 'GeoTIFF',

     formatOptions: {
       cloudOptimized: true,
       noData: 0
     }

   });

   // B. Coloured GeoTIFF for the report and PPT.

   var colored = classified.visualize({
     min: 1,
     max: 5,
     palette: COLORS
   }).unmask(255, false).toByte();

   if (EXPORT_COLOURED_GEOTIFFS) {

     Export.image.toDrive({

       image: colored,

       description:
         fileBase + '_RGB_LULC_MAP',

       folder: FOLDER,

       fileNamePrefix:
         fileBase + '_RGB_LULC_MAP',

       region: exportRegion,

       crs: CRS,
       crsTransform: GRID,

       maxPixels: 1e9,

       fileFormat: 'GeoTIFF',

       formatOptions: {
         cloudOptimized: true
       }

     });

   }

   // C. Add map layer.

   Map.addLayer(

     classified,

     {
       min: 1,
       max: 5,
       palette: COLORS
     },

     item.tag,

     i === 1

   );

   // D. Optional PNG links.

   if (SHOW_PNG_LINKS) {

     print('Optional PNG for ' + item.tag + ':');

     print(
       classified.visualize({
         min: 1,
         max: 5,
         palette: COLORS
       }).getThumbURL({
         region: exportRegion,
         dimensions: 1400,
         crs: CRS,
         format: 'png'
       })
     );

   }

   // =================================================================
   // 7. CLASS-AREA SUMMARY ON LOCKED 30 M GRID
   // =================================================================

   var grouped = ee.List(

     ee.Image.pixelArea()
       .rename('area_m2')
       .addBands(classified)
       .reduceRegion({

         reducer: ee.Reducer.sum().group({
           groupField: 1,
           groupName: 'class_id'
         }),

         geometry: roi,
         crs: CRS,
         crsTransform: GRID,

         maxPixels: 1e8,
         tileScale: 8

       }).get('groups')

   );

   var areaDict = ee.Dictionary.fromLists(

     grouped.map(function(g) {
       return ee.Number(
         ee.Dictionary(g).get('class_id')
       ).format('%d');
     }),

     grouped.map(function(g) {
       return ee.Dictionary(g).get('sum');
     })

   );

   var totalArea = ee.Number(

     grouped.iterate(function(g, total) {

       return ee.Number(total).add(
         ee.Number(
           ee.Dictionary(g).get('sum')
         )
       );

     }, 0)

   );

   for (var j = 0; j < CLASS_IDS.length; j++) {

     var id = CLASS_IDS[j];
     var a = ee.Number(
       areaDict.get(String(id), 0)
     );

     rows.push(

       ee.Feature(null, {

         map_id: item.tag,

         year: item.year,

         status: item.status,

         source_asset_or_rule: item.source,

         class_id: id,

         class_name: NAMES[j],

         color: '#' + COLORS[j],

         class_area_km2:
           a.divide(1e6),

         percent_of_mapped_area:
           a.divide(totalArea).multiply(100),

         total_mapped_area_km2:
           totalArea.divide(1e6)

       })

     );

   }

 }

 // ===================================================================
 // 8. EXPORT CLASS-AREA MANIFEST CSV
 // ===================================================================

 var summary = ee.FeatureCollection(rows);

 Export.table.toDrive({

   collection: summary,

   description:
     'CHENNAI_FUSION_FIVE_MAPS_CLASS_AREA_MANIFEST',

   folder: FOLDER,

   fileNamePrefix:
     'CHENNAI_FUSION_FIVE_MAPS_CLASS_AREA_MANIFEST',

   fileFormat: 'CSV'

 });

 // ===================================================================
 // 9. SAVE NEW 2010 TWO-WAY FUSION AS AN EARTH ENGINE ASSET
 // ===================================================================

 var saved2010Asset =
   ROOT + 'chennai_08g15_2010_two_way_fusion_sensitivity_v1';

 Export.image.toAsset({

   image: twoWay
     .rename('lulc_class')
     .clip(roi)
     .toByte(),

   description:
     'CHENNAI_2010_08G15_TWO_WAY_SENSITIVITY_ASSET',

   assetId: saved2010Asset,

   region: exportRegion,

   crs: CRS,
   crsTransform: GRID,

   maxPixels: 1e9,

   pyramidingPolicy: {
     '.default': 'mode'
   }

 });

 // ===================================================================
 // 10. FINAL EXPORT SUMMARY
 // ===================================================================

 print('=========== EXPORT TASKS PREPARED ===========');

 print('Drive folder:');
 print(FOLDER);

 print('Categorical GeoTIFFs: 5');

 print('Coloured GeoTIFFs:');
 print(EXPORT_COLOURED_GEOTIFFS ? 5 : 0);

 print('Area-manifest CSV: 1');

 print('2010 two-way Earth Engine asset: 1');

 print('TOTAL TASKS:');
 print(5 + (EXPORT_COLOURED_GEOTIFFS ? 5 : 0) + 2);

 print('2010 two-way asset ID:');
 print(saved2010Asset);

 print('2010 two-way is a sensitivity alternative, not official 2010.');

 print('Existing source assets will not be overwritten.');

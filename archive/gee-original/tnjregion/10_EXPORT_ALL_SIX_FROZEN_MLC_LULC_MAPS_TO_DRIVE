
 // ================================================================
 // STAGE 10 - EXPORT ALL SIX GAUSSIAN MLC LULC MAPS
 // Chennai Generalisability Benchmark - 2020
 //
 // Thanjavur A - Original Frozen MLC
 // Thanjavur B - Seasonal Matching
 // Thanjavur C - Spectral Harmonisation
 // Cuddalore   - Frozen MLC
 // Nagapattinam - Frozen MLC
 // Thoothukudi - Frozen MLC
 //
 // NO retraining. NO reclassification.
 // All data read from existing Earth Engine Assets.
 // ================================================================

 var ROOT = 'projects/assignment-482806/assets/';

 var DRIVE_FOLDER =
   'Chennai_Gaussian_MLC_Generalisability_Maps_2020';

 var CRS = 'EPSG:32644';
 var SCALE = 30;

 // Change to false if you don't need coloured GeoTIFFs.
 var MAKE_RGB_TIFFS = true;

 // Set false if generating PNG links causes errors.
 var MAKE_PNG_LINKS = true;

 // Export the 112 manually interpreted Thanjavur points.
 var EXPORT_TNJ_MANUAL_REFERENCES = true;

 // ================================================================
 // 1. FIXED FIVE-CLASS LEGEND
 // ================================================================

 var CLASSES = [
   {id:1, name:'Built-up', color:'e31a1c'},
   {id:2, name:'Vegetation', color:'33a02c'},
   {id:3, name:'Water', color:'1f78b4'},
   {id:4, name:'Agricultural/Open', color:'ffb000'},
   {id:5, name:'Barren/Fallow', color:'b15928'}
 ];

 var PALETTE = CLASSES.map(function(x) {
   return x.color;
 });

 // ================================================================
 // 2. THANJAVUR PILOT ROI
 // ================================================================

 var tnjROI = ee.FeatureCollection(
   ROOT + 'tnj_city_trace_pilot_roi_2020'
 ).geometry();

 // ================================================================
 // 3. ALL SIX EXISTING CLASSIFICATION ASSETS
 // ================================================================

 var ITEMS = [

   {
     tag: 'TNJ_A',
     site: 'Thanjavur',
     experiment: 'A_direct_frozen_transfer',

     asset: ROOT +
       'thanjavur_mlc_transfer_2020_frozen_chennai',

     band: 'mapped_class',

     roi: tnjROI,

     roi_note:
       'Screenshot-traced Thanjavur pilot polygon; not official boundary'
   },

   {
     tag: 'TNJ_B',
     site: 'Thanjavur',
     experiment: 'B_source_month_matched',

     asset: ROOT +
       'tnj_2020_experiment_B_source_months_v3',

     band: 'experiment_B_class',

     roi: tnjROI,

     roi_note:
       'Same Thanjavur pilot polygon'
   },

   {
     tag: 'TNJ_C',
     site: 'Thanjavur',
     experiment: 'C_unsupervised_quantile_aligned',

     asset: ROOT +
       'tnj_2020_experiment_C_quantile_align_v2',

     band: 'experiment_C_class',

     roi: tnjROI,

     roi_note:
       'Same Thanjavur pilot polygon'
   },

   {
     tag: 'CUDDALORE',
     site: 'Cuddalore',

     experiment:
       'frozen_direct_transfer_proxy_screen',

     asset: ROOT +
       'tn_2020_spectrally_selected_city_frozen_mlc_v1',

     band: 'mlc_class',

     roi: ee.Geometry.Point([
       79.770000, 11.740000
     ]).buffer(3000),

     roi_note:
       '3 km circular pilot; not official municipal boundary'
   },

   {
     tag: 'NAGAPATTINAM',
     site: 'Nagapattinam',

     experiment:
       'frozen_direct_transfer_proxy_screen',

     asset: ROOT +
       'tn_2020_nagapattinam_frozen_mlc_v1',

     band: 'mlc_class',

     roi: ee.Geometry.Point([
       79.843130, 10.763769
     ]).buffer(3000),

     roi_note:
       '3 km circular pilot; not official municipal boundary'
   },

   {
     tag: 'THOOTHUKUDI',
     site: 'Thoothukudi',

     experiment:
       'frozen_direct_transfer_proxy_screen',

     asset: ROOT +
       'tn_2020_thoothukudi_frozen_mlc_v1',

     band: 'mlc_class',

     roi: ee.Geometry.Point([
       78.134835, 8.764166
     ]).buffer(3000),

     roi_note:
       '3 km circular pilot; not official municipal boundary'
   }

 ];

 // ================================================================
 // 4. PREPARE RESULTS COLLECTIONS
 // ================================================================

 var areaRows = [];
 var roiRows = [];

 Map.layers().reset();
 Map.setOptions('SATELLITE');
 Map.centerObject(tnjROI, 12);

 // ================================================================
 // 5. PROCESS AND EXPORT EACH EXISTING MAP
 // ================================================================

 for (var i = 0; i < ITEMS.length; i++) {

   var cfg = ITEMS[i];

   var original = ee.Image(cfg.asset)
     .select([cfg.band], ['lulc_class'])
     .clip(cfg.roi)
     .toByte();

   var stem = 'MLC2020_' + cfg.tag;

   // ============================================================
   // EXPORT A: ORIGINAL CLASS CODES
   //
   // 1 = Built-up
   // 2 = Vegetation
   // 3 = Water
   // 4 = Agricultural/Open
   // 5 = Barren/Fallow
   // 0 = NoData
   // ============================================================

   var codes = original
     .unmask(0, false)
     .toByte();

   Export.image.toDrive({

     image: codes,

     description:
       stem + '_CLASS_CODES_30M',

     folder: DRIVE_FOLDER,

     fileNamePrefix:
       stem + '_CLASS_CODES_30M',

     region: cfg.roi.bounds(1),

     crs: CRS,
     scale: SCALE,

     maxPixels: 1e8,

     fileFormat: 'GeoTIFF',

     formatOptions: {
       cloudOptimized: true,
       noData: 0
     }

   });

   // ============================================================
   // EXPORT B: COLOURED RGB LULC MAP
   //
   // Intended for PPT, Word, PDF and visualisation.
   // Not for statistical class-area calculations.
   // ============================================================

   var color = original.visualize({

     min: 1,
     max: 5,
     palette: PALETTE

   })
   .unmask(255, false)
   .toByte();

   if (MAKE_RGB_TIFFS) {

     Export.image.toDrive({

       image: color,

       description:
         stem + '_COLOR_MAP_RGB_30M',

       folder: DRIVE_FOLDER,

       fileNamePrefix:
         stem + '_COLOR_MAP_RGB_30M',

       region: cfg.roi.bounds(1),

       crs: CRS,
       scale: SCALE,

       maxPixels: 1e8,

       fileFormat: 'GeoTIFF',

       formatOptions: {
         cloudOptimized: true
       }

     });

   }

   // ============================================================
   // 6. DISPLAY CLASSIFICATION ON MAP
   // ============================================================

   Map.addLayer(

     original,

     {
       min: 1,
       max: 5,
       palette: PALETTE
     },

     stem + ' | Five-Class LULC',

     i === 0

   );

   // ============================================================
   // 7. CALCULATE CLASS AREAS
   // ============================================================

   var groupResult = ee.Dictionary(

     ee.Image.pixelArea()
       .rename('area_m2')
       .addBands(original)
       .reduceRegion({

         reducer: ee.Reducer.sum().group({

           groupField: 1,
           groupName: 'class_id'

         }),

         geometry: cfg.roi,

         crs: CRS,
         scale: SCALE,

         maxPixels: 1e8,
         tileScale: 8

       })

   );

   var grouped = ee.List(
     groupResult.get('groups')
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

   var total = ee.Number(

     grouped.iterate(function(g, sum) {

       return ee.Number(sum).add(

         ee.Number(
           ee.Dictionary(g).get('sum')
         )

       );

     }, 0)

   );

   // ============================================================
   // 8. RECORD AREA FOR ALL FIVE CLASSES
   // ============================================================

   for (var j = 0; j < CLASSES.length; j++) {

     var entry = CLASSES[j];

     var classArea = ee.Number(

       areaDict.get(
         String(entry.id), 0
       )

     );

     areaRows.push(

       ee.Feature(null, {

         output_tag: cfg.tag,

         site: cfg.site,

         experiment: cfg.experiment,

         year: 2020,

         asset_id: cfg.asset,

         source_band: cfg.band,

         spatial_resolution_m: SCALE,

         crs: CRS,

         roi_description: cfg.roi_note,

         class_id: entry.id,

         class_name: entry.name,

         hex_color: '#' + entry.color,

         class_area_km2:
           classArea.divide(1e6),

         class_area_pct_of_valid:
           classArea.divide(total)
             .multiply(100),

         all_valid_classified_area_km2:
           total.divide(1e6)

       })

     );

   }

   // ============================================================
   // 9. RECORD ROI GEOMETRY
   // ============================================================

   roiRows.push(

     ee.Feature(cfg.roi, {

       output_tag: cfg.tag,

       site: cfg.site,

       experiment: cfg.experiment,

       year: 2020,

       asset_id: cfg.asset,

       roi_description: cfg.roi_note

     })

   );

   // ============================================================
   // 10. OPTIONAL DIRECT PNG PREVIEW LINK
   //
   // These links appear in the console.
   // Open each link and save its PNG image.
   // ============================================================

   if (MAKE_PNG_LINKS) {

     print(
       'SAVE PNG PREVIEW: ' + stem
     );

     print(

       color.getThumbURL({

         region: cfg.roi.bounds(1),

         dimensions: 1400,

         crs: CRS,

         format: 'png'

       })

     );

   }

 }

 // ================================================================
 // 11. BUILD EXPORT TABLES
 // ================================================================

 var summary = ee.FeatureCollection(areaRows);

 var footprints = ee.FeatureCollection(roiRows);

 // ================================================================
 // 12. EXPORT CLASS AREA + ASSET MANIFEST CSV
 // ================================================================

 Export.table.toDrive({

   collection: summary,

   description:
     'MLC2020_ALL_SIX_MAP_CLASS_AREAS_AND_MANIFEST',

   folder: DRIVE_FOLDER,

   fileNamePrefix:
     'MLC2020_ALL_SIX_MAP_CLASS_AREAS_AND_MANIFEST',

   fileFormat: 'CSV',

   selectors: [

     'output_tag',

     'site',

     'experiment',

     'year',

     'asset_id',

     'source_band',

     'spatial_resolution_m',

     'crs',

     'roi_description',

     'class_id',

     'class_name',

     'hex_color',

     'class_area_km2',

     'class_area_pct_of_valid',

     'all_valid_classified_area_km2'

   ]

 });

 // ================================================================
 // 13. EXPORT ALL SIX ROI GEOMETRIES
 // ================================================================

 Export.table.toDrive({

   collection: footprints,

   description:
     'MLC2020_ALL_SIX_PILOT_ROI_GEOMETRIES',

   folder: DRIVE_FOLDER,

   fileNamePrefix:
     'MLC2020_ALL_SIX_PILOT_ROI_GEOMETRIES',

   fileFormat: 'GeoJSON'

 });

 // ================================================================
 // 14. EXPORT 112 THANJAVUR REFERENCE POINTS
 // ================================================================

 if (EXPORT_TNJ_MANUAL_REFERENCES) {

   Export.table.toDrive({

     collection: ee.FeatureCollection(

       ROOT + 'tnj_2020_reference_112_final_v1'

     ),

     description:
       'MLC2020_TNJ_MANUAL_REFERENCE_112_POINTS',

     folder: DRIVE_FOLDER,

     fileNamePrefix:
       'MLC2020_TNJ_MANUAL_REFERENCE_112_POINTS',

     fileFormat: 'GeoJSON'

   });

 }

 // ================================================================
 // 15. FINAL CONSOLE OUTPUT
 // ================================================================

 print('==========================================');
 print('STAGE 10 - ALL SIX LULC EXPORTS READY');
 print('==========================================');

 print('Google Drive output folder:');
 print(DRIVE_FOLDER);

 print('Categorical GeoTIFFs: 6');

 print(
   'Coloured RGB GeoTIFFs: ' +
   (MAKE_RGB_TIFFS ? 6 : 0)
 );

 print('Class-area / asset manifest CSV: 1');

 print('Pilot ROI GeoJSON: 1');

 print(
   'Reference point GeoJSON: ' +
   (EXPORT_TNJ_MANUAL_REFERENCES ? 1 : 0)
 );

 print('Total export tasks:');

 print(
   6 +
   (MAKE_RGB_TIFFS ? 6 : 0) +
   2 +
   (EXPORT_TNJ_MANUAL_REFERENCES ? 1 : 0)
 );

 print('Five-class legend:');

 print(CLASSES);

 print('Expected classified areas (km2):');

 print('Thanjavur A: 26.9913');
 print('Thanjavur B: 26.9913');
 print('Thanjavur C: 26.9913');

 print('Cuddalore: 27.8265');

 print('Nagapattinam: 27.8239');

 print('Thoothukudi: 27.8197');

 print('Class area results:');

 print(summary);

 print('==========================================');
 print('IMPORTANT');
 print('==========================================');

 print('The original MLC maps were not modified.');

 print('No training or classification was performed.');

 print('Coastal-city proxy agreement is NOT true accuracy.');

 print('All outputs use the 2020 data.');

 print('Open the Tasks tab and start the exports.');

 print('EXPORT SCRIPT FINISHED.');


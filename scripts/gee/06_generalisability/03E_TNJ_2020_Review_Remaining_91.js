
 // ============================================================
 // STAGE 03E - THANJAVUR 2020 REFERENCE REVIEW
 // FIXED VERSION - ES5 COMPATIBLE
 //
 // 112 selected points, 21 existing human labels.
 // Chennai MLC predictions remain hidden.
 // ============================================================

 var ROOT = 'projects/assignment-482806/assets/';

 var INPUT_ASSET =
   ROOT + 'tnj_2020_blind_subsample_112_v2';

 var ROI_ASSET =
   ROOT + 'tnj_city_trace_pilot_roi_2020';

 var FINAL_ASSET =
   ROOT + 'tnj_2020_reference_112_final_v1';

 var EXPECTED = 112;

 // To resume a saved checkpoint, change INPUT_ASSET
 // to that checkpoint's exact asset ID.

 var roi = ee.FeatureCollection(ROI_ASSET).geometry();
 var context = roi.buffer(1500);

 // ============================================================
 // 1. HISTORICAL SENTINEL-2 IMAGERY
 // ============================================================

 function maskS2(image) {
   var scl = image.select('SCL');

   var clear = scl.neq(0).and(scl.neq(1))
     .and(scl.neq(3)).and(scl.neq(8))
     .and(scl.neq(9)).and(scl.neq(10))
     .and(scl.neq(11));

   return image
     .select(['B2', 'B3', 'B4', 'B8', 'B11'])
     .multiply(0.0001)
     .updateMask(clear)
     .copyProperties(image, ['system:time_start']);
 }

 var s2 = ee.ImageCollection(
   'COPERNICUS/S2_SR_HARMONIZED'
 )
 .filterBounds(context)
 .filterDate('2020-01-01', '2021-01-01')
 .filter(
   ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 85)
 )
 .map(maskS2);

 function seasonal(start, end) {
   return s2.filterDate(start, end)
     .median()
     .clip(context);
 }

 var annual = s2.median().clip(context);

 var visRGB = {
   bands: ['B4', 'B3', 'B2'],
   min: 0,
   max: 0.30,
   gamma: 1.2
 };

 var visFalse = {
   bands: ['B8', 'B4', 'B3'],
   min: 0,
   max: 0.35,
   gamma: 1.1
 };

 // ============================================================
 // 2. MAP
 // ============================================================

 var map = ui.Map();

 map.setOptions('TERRAIN');

 // Basemap is context only, not 2020 evidence.

 map.addLayer(
   annual, visRGB,
   'Sentinel-2 2020 RGB', true
 );

 map.addLayer(
   seasonal('2020-01-01', '2020-05-01'),
   visRGB, '2020 Jan-Apr RGB', false
 );

 map.addLayer(
   seasonal('2020-05-01', '2020-09-01'),
   visRGB, '2020 May-Aug RGB', false
 );

 map.addLayer(
   seasonal('2020-09-01', '2021-01-01'),
   visRGB, '2020 Sep-Dec RGB', false
 );

 map.addLayer(
   annual, visFalse,
   '2020 False Colour', false
 );

 map.addLayer(
   ee.FeatureCollection(ROI_ASSET).style({
     color: 'ffffff',
     fillColor: '00000000',
     width: 2
   }),
   {},
   'Pilot ROI', true
 );

 var marker = ui.Map.Layer(
   ee.FeatureCollection([]),
   {},
   'CURRENT POINT',
   true
 );

 map.layers().add(marker);
 map.centerObject(roi, 12);

 // ============================================================
 // 3. CLASSES
 // ============================================================

 var CLASS_NAMES = [
   'Not labelled',
   '1 - Built-up',
   '2 - Vegetation',
   '3 - Water',
   '4 - Agricultural/Open',
   '5 - Barren/Fallow',
   'Uncertain'
 ];

 function valid(code) {
   return code >= 1 && code <= 5;
 }

 function nameForCode(code) {
   if (valid(code)) {
     return CLASS_NAMES[code];
   }
   if (code === -9) {
     return 'Uncertain';
   }
   return 'Not labelled';
 }

 function codeForName(name) {
   if (name === 'Uncertain') {
     return -9;
   }
   if (name === 'Not labelled') {
     return -1;
   }
   return parseInt(name.split(' ')[0], 10);
 }

 // ============================================================
 // 4. REVIEW STATE
 // ============================================================

 var points = [];
 var decisions = {};
 var active = 0;
 var ready = false;

 var panel = ui.Panel({
   style: {
     width: '380px',
     padding: '12px'
   }
 });

 var progress = ui.Label(
   'Loading 112 reference points...'
 );

 var pointInfo = ui.Label('');
 var status = ui.Label('');

 var classSelect = ui.Select({
   items: CLASS_NAMES,
   value: 'Not labelled'
 });

 var confidenceSelect = ui.Select({
   items: ['High', 'Medium', 'Low'],
   value: 'High'
 });

 var notes = ui.Textbox({
   placeholder: 'Evidence / ambiguity notes'
 });

 // ============================================================
 // 5. COUNTS
 // ============================================================

 function counts() {
   var finished = 0;
   var uncertain = 0;

   for (var i = 0; i < points.length; i++) {
     var d = decisions[points[i].id];

     if (d && valid(d.reference_class)) {
       finished++;
     }

     if (d && d.reference_class === -9) {
       uncertain++;
     }
   }

   return {
     complete: finished,
     remaining: points.length - finished,
     uncertain: uncertain
   };
 }

 // ============================================================
 // 6. DISPLAY SELECTED POINT
 // ============================================================

 function showPoint(index) {

   if (!ready || points.length === 0) {
     return;
   }

   active = Math.max(
     0,
     Math.min(index, points.length - 1)
   );

   var p = points[active];
   var d = decisions[p.id];

   classSelect.setValue(
     nameForCode(d.reference_class),
     false
   );

   confidenceSelect.setValue(
     d.confidence || 'High',
     false
   );

   notes.setValue(
     d.notes || '',
     false
   );

   var c = counts();

   progress.setValue(
     'Point ' + (active + 1) + '/' +
     points.length +
     ' | Labelled: ' + c.complete +
     ' | Remaining: ' + c.remaining +
     ' | Uncertain: ' + c.uncertain
   );

   pointInfo.setValue(
     'Point ID ' + p.id +
     ' | ' + p.lat.toFixed(6) +
     ', ' + p.lon.toFixed(6)
   );

   map.setCenter(p.lon, p.lat, 17);

   marker.setEeObject(
     ee.FeatureCollection([
       ee.Feature(
         ee.Geometry.Point([p.lon, p.lat])
       )
     ]).style({
       color: 'ff00ff',
       pointSize: 12,
       pointShape: 'circle',
       width: 3
     })
   );

   status.setValue(
     valid(d.reference_class)
       ? 'Saved human label restored.'
       : 'Use 2020 imagery to label this point.'
   );
 }

 // ============================================================
 // 7. SAVE CURRENT SELECTION
 // ============================================================

 function saveCurrent() {

   if (!ready || !points.length) {
     return;
   }

   var p = points[active];

   decisions[p.id] = {
     reference_class:
       codeForName(classSelect.getValue()),

     confidence:
       confidenceSelect.getValue(),

     notes:
       notes.getValue() || ''
   };
 }

 // ============================================================
 // 8. ES5-SAFE FIRST UNREVIEWED SEARCH
 // ============================================================
 //
 // FIX:
 // Replaces unsupported Array.findIndex().
 // ============================================================

 function firstUnreviewedIndex() {

   for (var i = 0; i < points.length; i++) {

     if (!valid(
       decisions[points[i].id].reference_class
     )) {
       return i;
     }
   }

   return -1;
 }

 function nextUnreviewed() {

   if (!ready) {
     return;
   }

   for (
     var offset = 1;
     offset <= points.length;
     offset++
   ) {

     var i = (active + offset) % points.length;

     if (!valid(
       decisions[points[i].id].reference_class
     )) {
       showPoint(i);
       return;
     }
   }

   status.setValue(
     'All 112 points have valid human labels.'
   );
 }

 // ============================================================
 // 9. BUILD REVIEW FEATURE COLLECTION
 // ============================================================

 function makeCollection() {

   var collection = [];

   for (var i = 0; i < points.length; i++) {

     var p = points[i];
     var d = decisions[p.id];

     collection.push(
       ee.Feature(
         ee.Geometry.Point([p.lon, p.lat]),
         {
           point_id: p.id,

           reference_class:
             d.reference_class,

           confidence:
             d.confidence || '',

           evidence_notes:
             d.notes || '',

           reference_year: 2020,

           review_status:
             valid(d.reference_class)
               ? 'MANUAL_COMPLETE'
               : 'TO_REVIEW',

           review_method:
             'human_2020_visual_interpretation',

           sampling_design:
             'mapped_class_random_stratified_112'
         }
       )
     );
   }

   return ee.FeatureCollection(collection);
 }

 // ============================================================
 // 10. CHECKPOINT TO EARTH ENGINE ASSET
 // ============================================================

 function saveCheckpoint() {

   saveCurrent();

   if (!ready) {
     return;
   }

   var n = counts().complete;

   var unique = String(Date.now());

   var asset =
     ROOT + 'tnj_2020_ref112_checkpoint_' + unique;

   Export.table.toAsset({
     collection: makeCollection(),

     description:
       'TNJ_REF112_CHECKPOINT_' +
       n + '_' + unique,

     assetId: asset
   });

   print('SAVE THIS CHECKPOINT ASSET ID:');
   print(asset);

   status.setValue(
     'Checkpoint task created. Open Tasks, ' +
     'start it and confirm completion. ' +
     'Save the asset ID.'
   );
 }

 // ============================================================
 // 11. OPTIONAL GOOGLE DRIVE BACKUP
 // ============================================================

 function saveDriveBackup() {

   saveCurrent();

   if (!ready) {
     return;
   }

   Export.table.toDrive({
     collection: makeCollection(),

     description:
       'TNJ_REF112_BACKUP_' +
       counts().complete + '_' +
       String(Date.now()),

     fileFormat: 'GeoJSON'
   });

   status.setValue(
     'Drive backup task created. Start it in Tasks.'
   );
 }

 // ============================================================
 // 12. FINAL EXPORT
 // ============================================================

 function exportFinal() {

   saveCurrent();

   if (!ready) {
     return;
   }

   var c = counts();

   if (c.complete !== EXPECTED) {

     status.setValue(
       'Final export blocked: ' +
       c.remaining +
       ' points still need valid independent labels.'
     );

     return;
   }

   Export.table.toAsset({
     collection: makeCollection(),

     description:
       'TNJ_2020_REFERENCE_112_FINAL_V1',

     assetId: FINAL_ASSET
   });

   print('FINAL REFERENCE ASSET ID:');
   print(FINAL_ASSET);

   status.setValue(
     'Final export task created. Start it in Tasks.'
   );
 }

 // ============================================================
 // 13. REVIEW PANEL
 // ============================================================

 panel.add(
   ui.Label(
     'Thanjavur Stage 03E - 2020',
     {
       fontWeight: 'bold',
       fontSize: '18px'
     }
   )
 );

 panel.add(
   ui.Label(
     'Independent reference labelling. ' +
     'Previously reviewed labels load automatically. ' +
     'Chennai MLC predictions are not displayed.'
   )
 );

 panel.add(
   ui.Label(
     'Use 2020 Sentinel-2 imagery as historical ' +
     'evidence, not the modern basemap.',
     {color: 'b45309'}
   )
 );

 panel.add(progress);
 panel.add(pointInfo);

 panel.add(ui.Label('Actual reference class'));
 panel.add(classSelect);

 panel.add(ui.Label('Interpretation confidence'));
 panel.add(confidenceSelect);

 panel.add(ui.Label('Evidence notes'));
 panel.add(notes);

 panel.add(
   ui.Button('SAVE LABEL + NEXT', function() {

     saveCurrent();

     if (active < points.length - 1) {
       showPoint(active + 1);
     } else {
       nextUnreviewed();
     }
   })
 );

 panel.add(
   ui.Button('PREVIOUS', function() {
     saveCurrent();
     showPoint(active - 1);
   })
 );

 panel.add(
   ui.Button('NEXT UNREVIEWED', function() {
     saveCurrent();
     nextUnreviewed();
   })
 );

 panel.add(
   ui.Label(
     'Save checkpoints regularly. Changes remain ' +
     'in memory until the export task completes.',
     {color: 'b45309'}
   )
 );

 panel.add(
   ui.Button(
     'SAVE CHECKPOINT TO GEE ASSET',
     saveCheckpoint
   )
 );

 panel.add(
   ui.Button(
     'BACKUP TO GOOGLE DRIVE',
     saveDriveBackup
   )
 );

 panel.add(
   ui.Button(
     'EXPORT FINAL 112 REFERENCES',
     exportFinal
   )
 );

 panel.add(status);

 ui.root.widgets().reset([
   ui.SplitPanel({
     firstPanel: panel,
     secondPanel: map,
     orientation: 'horizontal',
     wipe: false,
     style: {stretch: 'both'}
   })
 ]);

 // ============================================================
 // 14. LOAD PREVIOUSLY SAVED REFERENCE POINTS
 // ============================================================

 var frozen = ee.FeatureCollection(
   INPUT_ASSET
 ).sort('point_id');

 print('Reference point count (expected 112):');
 print(frozen.size());

 print('Saved human label distribution:');
 print(
   frozen.aggregate_histogram('reference_class')
 );

 print('2020 Sentinel-2 source image count:');
 print(s2.size());

 frozen.evaluate(function(result, error) {

   if (error || !result || !result.features) {

     status.setValue(
       'Could not load reference asset: ' +
       String(error)
     );

     return;
   }

   points = [];
   decisions = {};

   for (
     var i = 0;
     i < result.features.length;
     i++
   ) {

     var f = result.features[i];

     var id = String(
       f.properties.point_id
     );

     var c = Number(
       f.properties.reference_class
     );

     if (!valid(c) && c !== -9) {
       c = -1;
     }

     decisions[id] = {
       reference_class: c,

       confidence:
         f.properties.confidence || 'High',

       notes:
         f.properties.evidence_notes || ''
     };

     points.push({
       id: id,
       lon: f.geometry.coordinates[0],
       lat: f.geometry.coordinates[1]
     });
   }

   if (points.length !== EXPECTED) {

     status.setValue(
       'Wrong count: ' + points.length +
       '. Expected 112. Stop and inspect the asset.'
     );

     return;
   }

   ready = true;

   var c = counts();

   print('RESTORED MANUAL LABELS:');
   print(c.complete);

   print('POINTS REMAINING:');
   print(c.remaining);

   // Corrected: ES5-compatible first-unreviewed search.

   var firstMissing = firstUnreviewedIndex();

   showPoint(
     firstMissing >= 0 ? firstMissing : 0
   );
 });

 // ============================================================
 // END STAGE 03E - FIXED
 // ============================================================

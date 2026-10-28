
 // ================================================================
 // STAGE 03B - BLIND 2020 REFERENCE LABEL REVIEWER
 // Thanjavur City | 252 previously frozen locations
 //
 // Use historical 2020 Sentinel-2 imagery.
 // NOT the current Google Maps satellite basemap.
 //
 // No transferred MLC raster is displayed here.
 // ================================================================

 var ROOT = 'projects/assignment-482806/assets/';

 var POINTS_ASSET =
   ROOT + 'tnj_2020_blind_reference_points_v1';

 var FINAL_ASSET =
   ROOT + 'thanjavur_reference_2020_independently_labelled';

 var ROI = ee.FeatureCollection(
   ROOT + 'tnj_city_trace_pilot_roi_2020'
 ).geometry();

 // ================================================================
 // RESTART / RESUME
 // ================================================================
 //
 // Paste a previously printed RESUME_LABELS object below
 // if you need to continue a review in a later session.
 //
 // Leave {} for a fresh review.
 //
 // Labels are not automatically saved in the browser.
 // ================================================================

 var RESUME_LABELS = {};

 // ================================================================
 // 1. CLASS DEFINITIONS
 // ================================================================

 var names = [
   'Not labelled',
   '1 - Built-up',
   '2 - Vegetation (non-crop)',
   '3 - Water',
   '4 - Agricultural/Open',
   '5 - Barren/Fallow',
   'Uncertain - review later'
 ];

 var values = {
   'Not labelled': -1,
   '1 - Built-up': 1,
   '2 - Vegetation (non-crop)': 2,
   '3 - Water': 3,
   '4 - Agricultural/Open': 4,
   '5 - Barren/Fallow': 5,
   'Uncertain - review later': -9
 };

 function labelFromValue(code) {

   for (var i = 0; i < names.length; i++) {

     if (values[names[i]] === code) {
       return names[i];
     }
   }

   return 'Not labelled';
 }

 // ================================================================
 // 2. 2020 SENTINEL-2 REFERENCE IMAGERY
 // ================================================================

 var context = ROI.buffer(1500);

 function maskS2(image) {

   var scl = image.select('SCL');

   var clean = scl.neq(0)
     .and(scl.neq(1))
     .and(scl.neq(3))
     .and(scl.neq(8))
     .and(scl.neq(9))
     .and(scl.neq(10))
     .and(scl.neq(11));

   return image.select([
     'B2', 'B3', 'B4', 'B8', 'B11'
   ])
   .updateMask(clean)
   .multiply(0.0001)
   .copyProperties(image, [
     'system:time_start'
   ]);
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

 function season(start, end) {

   return s2
     .filterDate(start, end)
     .median()
     .clip(context);
 }

 var annual = s2.median().clip(context);

 var janApr = season(
   '2020-01-01', '2020-05-01'
 );

 var mayAug = season(
   '2020-05-01', '2020-09-01'
 );

 var sepDec = season(
   '2020-09-01', '2021-01-01'
 );

 var ndvi = annual
   .normalizedDifference(['B8', 'B4'])
   .rename('NDVI');

 var rgb = {
   bands: ['B4', 'B3', 'B2'],
   min: 0.0,
   max: 0.30,
   gamma: 1.2
 };

 var falseColor = {
   bands: ['B8', 'B4', 'B3'],
   min: 0.0,
   max: 0.35,
   gamma: 1.1
 };

 // ================================================================
 // 3. REFERENCE MAP
 // ================================================================

 var reviewMap = ui.Map();

 // Background only - not dated validation evidence.
 reviewMap.setOptions('TERRAIN');

 reviewMap.centerObject(ROI, 12);

 reviewMap.addLayer(
   annual, rgb,
   '2020 S2 annual RGB', true
 );

 reviewMap.addLayer(
   janApr, rgb,
   '2020 Jan-Apr RGB', false
 );

 reviewMap.addLayer(
   mayAug, rgb,
   '2020 May-Aug RGB', false
 );

 reviewMap.addLayer(
   sepDec, rgb,
   '2020 Sep-Dec RGB', false
 );

 reviewMap.addLayer(
   annual, falseColor,
   '2020 S2 false-colour', false
 );

 reviewMap.addLayer(
   ndvi,
   {
     min: -0.1,
     max: 0.9,
     palette: [
       '9e7652',
       'f3e9a2',
       '1f8a43'
     ]
   },
   '2020 S2 NDVI - support only',
   false
 );

 reviewMap.addLayer(
   ee.FeatureCollection(
     ROOT + 'tnj_city_trace_pilot_roi_2020'
   ).style({
     color: 'ffffff',
     fillColor: '00000000',
     width: 2
   }),
   {},
   'Thanjavur pilot boundary',
   true
 );

 var marker = ui.Map.Layer(
   ee.FeatureCollection([]),
   {},
   'CURRENT REFERENCE LOCATION',
   true
 );

 reviewMap.layers().add(marker);

 // ================================================================
 // 4. REVIEW STATE
 // ================================================================

 var points = [];
 var decisions = {};

 var active = 0;
 var changing = false;

 Object.keys(RESUME_LABELS).forEach(function(id) {
   decisions[id] = RESUME_LABELS[id];
 });

 // ================================================================
 // 5. INTERFACE WIDGETS
 // ================================================================

 var title = ui.Label(
   '2020 Thanjavur blind reference review',
   {
     fontWeight: 'bold',
     fontSize: '17px'
   }
 );

 var instructions = ui.Label(
   'Review the 2020 Sentinel-2 imagery, ' +
   'switch between seasons, and assign an ' +
   'independent land-cover class. Never inspect ' +
   'the MLC prediction during labelling.',
   {
     whiteSpace: 'pre-wrap'
   }
 );

 var progress = ui.Label(
   'Loading reference locations...'
 );

 var locationText = ui.Label('');

 var classChoice = ui.Select({
   items: names,
   value: 'Not labelled'
 });

 var confidenceChoice = ui.Select({
   items: [
     'High',
     'Medium',
     'Low'
   ],
   value: 'High'
 });

 var notes = ui.Textbox({
   placeholder: 'Evidence / ambiguity notes (optional)'
 });

 var status = ui.Label('');

 // ================================================================
 // 6. PROGRESS COUNTS
 // ================================================================

 function countDone() {

   var done = 0;
   var uncertain = 0;

   points.forEach(function(p) {

     if (
       decisions[p.id] &&
       decisions[p.id].reference_class > 0
     ) {
       done++;
     }

     if (
       decisions[p.id] &&
       decisions[p.id].reference_class === -9
     ) {
       uncertain++;
     }
   });

   return {
     done: done,
     uncertain: uncertain
   };
 }

 // ================================================================
 // 7. SHOW CURRENT LOCATION
 // ================================================================

 function show(index) {

   if (!points.length) {
     return;
   }

   active = Math.max(
     0,
     Math.min(index, points.length - 1)
   );

   var p = points[active];

   var d = decisions[p.id] || {
     reference_class: -1,
     confidence: 'High',
     notes: ''
   };

   changing = true;

   classChoice.setValue(
     labelFromValue(d.reference_class),
     false
   );

   confidenceChoice.setValue(
     d.confidence || 'High',
     false
   );

   notes.setValue(
     d.notes || '',
     false
   );

   changing = false;

   var counts = countDone();

   progress.setValue(
     'Point ' + (active + 1) +
     '/' + points.length +
     ' | Valid labels: ' + counts.done +
     ' | Uncertain: ' + counts.uncertain
   );

   locationText.setValue(
     p.id + ' | ' +
     p.lat.toFixed(6) + ', ' +
     p.lon.toFixed(6)
   );

   reviewMap.setCenter(
     p.lon,
     p.lat,
     17
   );

   marker.setEeObject(
     ee.FeatureCollection([
       ee.Feature(
         ee.Geometry.Point([
           p.lon, p.lat
         ])
       )
     ]).style({
       color: 'ff00ff',
       pointSize: 12,
       pointShape: 'circle',
       width: 3
     })
   );

   status.setValue(
     'Inspect annual and seasonal 2020 imagery.'
   );
 }

 // ================================================================
 // 8. STORE THE CURRENT DECISION
 // ================================================================

 function saveCurrent() {

   if (!points.length) {
     return;
   }

   var p = points[active];

   var code = values[
     classChoice.getValue()
   ];

   decisions[p.id] = {
     reference_class: code,
     confidence:
       confidenceChoice.getValue(),
     notes:
       notes.getValue() || ''
   };
 }

 // ================================================================
 // 9. FIND NEXT UNREVIEWED LOCATION
 // ================================================================

 function nextUnreviewed() {

   if (!points.length) {
     return;
   }

   for (
     var j = active + 1;
     j < points.length;
     j++
   ) {

     if (
       !decisions[points[j].id] ||
       decisions[points[j].id]
         .reference_class < 1
     ) {

       show(j);
       return;
     }
   }

   for (
     var k = 0;
     k <= active;
     k++
   ) {

     if (
       !decisions[points[k].id] ||
       decisions[points[k].id]
         .reference_class < 1
     ) {

       show(k);
       return;
     }
   }

   status.setValue(
     'Every location has a valid class label.'
   );
 }

 // ================================================================
 // 10. NAVIGATION BUTTONS
 // ================================================================

 var saveNext = ui.Button({
   label: 'SAVE LABEL + NEXT',
   onClick: function() {
     saveCurrent();
     show(active + 1);
   }
 });

 var prev = ui.Button({
   label: 'Previous',
   onClick: function() {
     saveCurrent();
     show(active - 1);
   }
 });

 var jump = ui.Button({
   label: 'Next unlabelled / uncertain',
   onClick: function() {
     saveCurrent();
     nextUnreviewed();
   }
 });

 // ================================================================
 // 11. CHECKPOINT - COPY TO CONSOLE
 // ================================================================

 var checkpoint = ui.Button({
   label: 'PRINT RESUME CHECKPOINT',

   onClick: function() {

     saveCurrent();

     print(
       'COPY THE RESUME_LABELS OBJECT BELOW ' +
       'INTO THIS SCRIPT:'
     );

     print(
       'var RESUME_LABELS = ' +
       JSON.stringify(decisions) +
       ';'
     );

     status.setValue(
       'Checkpoint printed. Copy it ' +
       'to a safe text file.'
     );
   }
 });

 // ================================================================
 // 12. BUILD LABELLED FEATURE COLLECTION
 // ================================================================

 function buildExportCollection() {

   return ee.FeatureCollection(
     points.map(function(p) {

       var d = decisions[p.id] || {
         reference_class: -1,
         confidence: '',
         notes: ''
       };

       return ee.Feature(
         ee.Geometry.Point([
           p.lon,
           p.lat
         ]),
         {
           point_id: p.id,
           reference_class:
             d.reference_class,
           confidence:
             d.confidence || '',
           evidence_notes:
             d.notes || '',
           reference_year: 2020,
           source:
             'Sentinel-2 SR 2020 visually interpreted',
           sampling_design:
             'mapped_class_stratified'
         }
       );
     })
   );
 }

 // ================================================================
 // 13. EXPORT PROGRESS TO GOOGLE DRIVE
 // ================================================================

 var exportCheckpoint = ui.Button({
   label: 'EXPORT PROGRESS TO DRIVE (GeoJSON)',

   onClick: function() {

     saveCurrent();

     if (!points.length) {
       return;
     }

     var counts = countDone();

     Export.table.toDrive({
       collection: buildExportCollection(),
       description:
         'TNJ_2020_REFERENCE_PROGRESS_' +
         counts.done,
       fileNamePrefix:
         'tnj_2020_reference_progress_' +
         counts.done,
       fileFormat: 'GeoJSON'
     });

     status.setValue(
       'Checkpoint task created. ' +
       'Open Tasks and click Run.'
     );
   }
 });

 // ================================================================
 // 14. FINAL ASSET EXPORT
 // ================================================================

 var exportFinal = ui.Button({
   label: 'EXPORT FINAL TO GEE ASSET',

   onClick: function() {

     saveCurrent();

     if (!points.length) {
       return;
     }

     var counts = countDone();

     if (counts.done !== points.length) {

       status.setValue(
         'STOP: ' +
         counts.done +
         '/' +
         points.length +
         ' valid classes. Resolve all ' +
         'uncertain/unreviewed points first.'
       );

       return;
     }

     Export.table.toAsset({
       collection: buildExportCollection(),
       description:
         'TNJ_2020_INDEPENDENT_VALIDATION_FINAL',
       assetId: FINAL_ASSET
     });

     status.setValue(
       'Final export task created. ' +
       'Open Tasks and click Run.'
     );
   }
 });

 // ================================================================
 // 15. BUILD REVIEW PANEL
 // ================================================================

 var panel = ui.Panel({
   style: {
     width: '370px',
     padding: '12px'
   }
 });

 panel.add(title);
 panel.add(instructions);

 panel.add(ui.Label(
   'Only 2020 imagery is valid as direct ' +
   'temporal evidence.',
   {
     color: 'b45309',
     fontWeight: 'bold'
   }
 ));

 panel.add(progress);
 panel.add(locationText);

 panel.add(ui.Label('Reference class:'));
 panel.add(classChoice);

 panel.add(ui.Label(
   'Confidence in visual interpretation:'
 ));
 panel.add(confidenceChoice);

 panel.add(ui.Label('Short evidence note:'));
 panel.add(notes);

 panel.add(saveNext);
 panel.add(prev);
 panel.add(jump);

 panel.add(ui.Label(
   'SAVE FREQUENTLY: labels are not ' +
   'automatically stored.',
   {
     color: 'a51d1d'
   }
 ));

 panel.add(checkpoint);
 panel.add(exportCheckpoint);
 panel.add(exportFinal);
 panel.add(status);

 // ================================================================
 // 16. DISPLAY SPLIT-PANEL INTERFACE
 // ================================================================

 var split = ui.SplitPanel({
   firstPanel: panel,
   secondPanel: reviewMap,
   orientation: 'horizontal',
   wipe: false,
   style: {
     stretch: 'both'
   }
 });

 ui.root.widgets().reset([
   split
 ]);

 // ================================================================
 // 17. LOAD FROZEN BLIND REFERENCE POINTS
 // ================================================================

 var frozen = ee.FeatureCollection(
   POINTS_ASSET
 ).sort('point_id');

 print('Frozen reference point count:');
 print(frozen.size());

 print('2020 Sentinel-2 scene count:');
 print(s2.size());

 frozen.evaluate(function(result, error) {

   if (error) {

     status.setValue(
       'Could not load reference asset: ' +
       error
     );

     return;
   }

   points = result.features.map(
     function(f) {

       return {
         id: String(
           f.properties.point_id
         ),
         lon:
           f.geometry.coordinates[0],
         lat:
           f.geometry.coordinates[1]
       };
     }
   );

   if (points.length !== 252) {

     status.setValue(
       'WARNING: expected 252 points, ' +
       'found ' + points.length
     );
   }

   show(0);
 });

 // ================================================================
 // END STAGE 03B
 // ================================================================

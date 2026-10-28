
 // ==============================================================
 // STAGE 03A: FREEZE BLIND THANJAVUR 2020 REFERENCE LOCATIONS
 // No model training, no ground-truth labels inferred.
 // Run once; finish export before Stage 03B.
 // ==============================================================

 var ROOT = 'projects/assignment-482806/assets/';

 var ROI = ee.FeatureCollection(
   ROOT + 'tnj_city_trace_pilot_roi_2020'
 ).geometry();

 var MAP = ee.Image(
   ROOT + 'thanjavur_mlc_transfer_2020_frozen_chennai'
 ).select('mapped_class');

 var OUTPUT =
   ROOT + 'tnj_2020_blind_reference_points_v1';

 var sample = MAP.stratifiedSample({
   numPoints: 60,
   classBand: 'mapped_class',
   region: ROI,
   scale: 30,
   projection: ee.Projection('EPSG:32644'),
   seed: 84,
   geometries: true,
   tileScale: 8
 });

 print(
   'Sampling design: stratified by mapped class, ' +
   '60 requested/class.'
 );

 print('Mapped-class counts (diagnostic only):');
 print(sample.aggregate_histogram('mapped_class'));

 var BLIND = sample.map(function(f) {

   return ee.Feature(f.geometry(), {
     point_id: ee.String('TNJ20_')
       .cat(ee.String(f.get('system:index'))),
     reference_class: -1,
     reference_year: 2020,
     sampling_design: 'mapped_class_stratified',
     label_status: 'unreviewed'
   });

 }).sort('point_id');

 print('Reference point count, expected 252:');
 print(BLIND.size());

 print('First blinded point:');
 print(BLIND.first());

 Map.setOptions('SATELLITE');
 Map.centerObject(ROI, 12);

 Map.addLayer(
   ee.FeatureCollection(
     ROOT + 'tnj_city_trace_pilot_roi_2020'
   ).style({
     color: 'ffffff',
     fillColor: '00000000',
     width: 2
   }),
   {},
   'Pilot ROI',
   true
 );

 Map.addLayer(
   BLIND.style({
     color: 'ffff00',
     pointSize: 3
   }),
   {},
   'Blind reference locations',
   true
 );

 Export.table.toAsset({
   collection: BLIND,
   description: 'TNJ_2020_BLIND_REFERENCE_POINTS_V1',
   assetId: OUTPUT
 });

 print('Start the export in Tasks.');
 print('Wait for it to finish before Stage 03B.');
 print('Saved output asset: ' + OUTPUT);

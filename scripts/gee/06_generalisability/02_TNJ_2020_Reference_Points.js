
 // =====================================================
 // SCRIPT 02 - THANJAVUR REFERENCE SAMPLING
 // Run after Script 01 export has completed
 // =====================================================

 var ROOT = 'projects/assignment-482806/assets/';

 var ROI = ROOT + 'tnj_city_trace_pilot_roi_2020';
 var MAP_ASSET = ROOT +
   'thanjavur_mlc_transfer_2020_frozen_chennai';

 var roi = ee.FeatureCollection(ROI).geometry();
 var classified = ee.Image(MAP_ASSET)
   .select('mapped_class');

 var CRS = 'EPSG:32644';

 // Stratified sampling by predicted class
 var samples = classified.stratifiedSample({
   numPoints: 60,
   classBand: 'mapped_class',
   region: roi,
   scale: 30,
   projection: ee.Projection(CRS),
   seed: 84,
   geometries: true,
   tileScale: 8
 });

 print('Predicted class sampling distribution:');
 print(samples.aggregate_histogram('mapped_class'));

 // Remove mapped classes before reference interpretation
 var referencePoints = samples.map(function(f) {
   return ee.Feature(f.geometry(), {
     point_id: f.get('system:index'),
     reference_class: -1
   });
 });

 print('Reference point count (up to 300):');
 print(referencePoints.size());

 Map.setOptions('SATELLITE');
 Map.centerObject(roi, 12);

 Map.addLayer(
   classified,
   {
     min: 1,
     max: 5,
     palette: [
       'e31a1c', '33a02c', '1f78b4',
       'ffb000', 'b15928'
     ]
   },
   'Prediction - hide during labelling',
   false
 );

 Map.addLayer(
   referencePoints.style({
     color: 'ffffff',
     pointSize: 4
   }),
   {},
   'Reference Locations'
 );

 Export.table.toDrive({
   collection: referencePoints,
   description: 'TNJ_2020_REFERENCE_LOCATIONS',
   fileNamePrefix: 'tnj_2020_reference_locations',
   fileFormat: 'GeoJSON'
 });

 print('Export reference points.');
 print('Independently label reference_class using 2020 evidence.');
 print('1 Built-up');
 print('2 Vegetation');
 print('3 Water');
 print('4 Agricultural/Open');
 print('5 Barren/Fallow');

 print('Then upload labelled GeoJSON as:');
 print(
   ROOT + 'thanjavur_reference_2020_independently_labelled'
 );

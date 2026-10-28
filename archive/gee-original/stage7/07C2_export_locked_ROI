
// ============================================================
// CHENNAI LULC — 07C2
// EXPORT LOCKED CHENNAI ROI TO GOOGLE EARTH
// ============================================================

var ROOT = 'projects/assignment-482806/assets/';

var roiFC = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
);

print('LOCKED CHENNAI ROI AREA (km2):');
print(roiFC.geometry().area(1).divide(1e6));

print('ROI FEATURE COUNT:');
print(roiFC.size());

Map.layers().reset();
Map.setOptions('SATELLITE');
Map.centerObject(roiFC, 10);

Map.addLayer(
  roiFC.style({
    color: 'FF0000',
    fillColor: '00000000',
    width: 3
  }),
  {},
  'LOCKED CHENNAI ROI',
  true
);

Export.table.toDrive({
  collection: roiFC,
  description: 'Chennai_Locked_ROI_2010_Training',
  fileNamePrefix: 'Chennai_Locked_ROI_2010_Training',
  fileFormat: 'KML'
});

print('Export task created.');
print('Open Tasks and run the KML export.');

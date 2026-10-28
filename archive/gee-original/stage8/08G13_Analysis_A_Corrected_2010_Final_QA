
 // ==================================================================
 // CHENNAI LULC | STAGE 08G-13
 // ANALYSIS A - CORRECTED 2010 VERSION AND FINAL READ-ONLY QA
 // 2010: archived L5/L7 manual experimental v1 (provisional)
 // 2015-2025: existing 08G10 fused classification candidates
 // No reclassification, no exports, no original asset edits.
 // ==================================================================

 var ROOT = 'projects/assignment-482806/assets/';
 var ROI = ee.FeatureCollection(ROOT + 'chennai_admin_study_area_clean').geometry();
 var CRS = 'EPSG:32644';
 var GRID = [30, 0, 399060, 0, -30, 1463250];
 var CLASSES = [1, 2, 3, 4, 5];
 var NAMES = ['Built-up','Vegetation','Water','Agricultural/Open','Barren/Fallow'];
 var PALETTE = ['ff0000','008000','0000ff','ffff00','d2b48c'];

 var a2010 = ee.Image(ROOT + 'chennai_mlc_lulc_2010_L5L7_manual_exp_v1')
   .select(0).rename('LULC_2010');
 var a2015 = ee.Image(ROOT + 'chennai_08g10_2015_temporal_fusion_candidate_v1')
   .select(0).rename('LULC_2015');
 var a2020 = ee.Image(ROOT + 'chennai_08g10_2020_gaia_wc_fusion_candidate_v1')
   .select(0).rename('LULC_2020');
 var a2025 = ee.Image(ROOT + 'chennai_08g10_2025_gaia_dw_fusion_candidate_v1')
   .select(0).rename('LULC_2025');

 var YEARS = [2010, 2015, 2020, 2025];
 var IMAGES = [a2010, a2015, a2020, a2025];

 // Single area reduction for all maps and classes.
 var bands = [];
 YEARS.forEach(function(y, i) {
   var im = IMAGES[i];
   CLASSES.forEach(function(c) {
     bands.push(ee.Image.pixelArea().divide(1e6)
       .updateMask(im.eq(c)).rename('Y' + y + '_C' + c));
   });
   bands.push(ee.Image.pixelArea().divide(1e6)
     .updateMask(im.mask()).rename('Y' + y + '_valid'));
 });

 var areaDict = ee.Image.cat(bands).reduceRegion({
   reducer: ee.Reducer.sum(), geometry: ROI,
   crs: CRS, crsTransform: GRID, maxPixels: 1e8, tileScale: 8
 });

 var table = ee.FeatureCollection(YEARS.map(function(y) {
   return ee.Feature(null, {
     year: y,
     builtup_km2: areaDict.get('Y' + y + '_C1'),
     vegetation_km2: areaDict.get('Y' + y + '_C2'),
     water_km2: areaDict.get('Y' + y + '_C3'),
     agricultural_open_km2: areaDict.get('Y' + y + '_C4'),
     barren_fallow_km2: areaDict.get('Y' + y + '_C5'),
     valid_area_km2: areaDict.get('Y' + y + '_valid')
   });
 }));

 function bu(year) { return ee.Number(areaDict.get('Y' + year + '_C1')); }

 // Confusion matrix for the 2010 candidate on its archived 300 points.
 var validation2010 = ee.FeatureCollection(ROOT + 'chennai_validation_2010_final');
 var sampled2010 = a2010.sampleRegions({
   collection: validation2010,
   properties: ['class_id'],
   projection: a2010.projection(),
   tileScale: 8,
   geometries: false
 });
 var cm2010 = sampled2010.errorMatrix('class_id', 'LULC_2010', CLASSES);
 var buTruth = sampled2010.filter(ee.Filter.eq('class_id', 1));
 var nonBUTruth = sampled2010.filter(ee.Filter.neq('class_id', 1));

 // Area-weighted pixel transitions on matching valid footprint.
 function pairSummary(first, second, fromYear, toYear) {
   var mask = first.mask().and(second.mask());
   var transition = first.multiply(10).add(second)
     .toInt16().rename('transition_code');
   var input = ee.Image.pixelArea().divide(1e6)
     .rename('area_km2')
     .addBands(transition)
     .updateMask(mask);
   var grouped = input.reduceRegion({
     reducer: ee.Reducer.sum().group({
       groupField: 1, groupName: 'transition_code'
     }),
     geometry: ROI,
     crs: CRS, crsTransform: GRID, maxPixels: 1e8, tileScale: 8
   });
   print('TRANSITION ' + fromYear + ' -> ' + toYear +
     ' (code = 10*FROM + TO; km2):');
   print(grouped);
 }

 print('====================================================');
 print('STAGE 08G-13 | ANALYSIS A 2010 VERSION CORRECTED');
 print('====================================================');
 print('2010 is L5L7 manual experimental v1, not chennai_mlc_lulc_2010.');
 print('2010 provenance: provisional classification; validation OA ~69.33%.');
 print('Class names (1-5):'); print(NAMES);
 print('ALL YEARS PROJECTIONS:');
 YEARS.forEach(function(y, i) { print('Year ' + y + ':'); print(IMAGES[i].projection()); });
 print('ALL-CLASS AREA TABLE (km2):'); print(table.sort('year'));
 print('BUILT-UP AREAS (km2):');
 print(ee.Dictionary({y2010:bu(2010), y2015:bu(2015),
   y2020:bu(2020), y2025:bu(2025)}));
 print('BUILT-UP CHANGES (km2):');
 print(ee.Dictionary({
   change_2010_2015: bu(2015).subtract(bu(2010)),
   change_2015_2020: bu(2020).subtract(bu(2015)),
   change_2020_2025: bu(2025).subtract(bu(2020)),
   change_2010_2025: bu(2025).subtract(bu(2010))
 }));
 print('2010 VALIDATION POINTS (expected 300):'); print(sampled2010.size());
 print('2010 VALIDATION CONFUSION MATRIX:'); print(cm2010);
 print('2010 VALIDATION METRICS:');
 print(ee.Dictionary({
   OA: cm2010.accuracy(),
   builtup_recall: cm2010.producersAccuracy().get([0,0]),
   builtup_TP: buTruth.filter(ee.Filter.eq('LULC_2010',1)).size(),
   builtup_FP: nonBUTruth.filter(ee.Filter.eq('LULC_2010',1)).size()
 }));

 pairSummary(a2010, a2015, 2010, 2015);
 pairSummary(a2015, a2020, 2015, 2020);
 pairSummary(a2020, a2025, 2020, 2025);

 print('LIMITATIONS: 2010 lower validation accuracy; 2015-2025 mixed fusion sources.');
 print('Analysis B GHSL has a different built-up SURFACE definition.');
 print('2005 five-class LULC classification is not included here.');
 print('NO ORIGINAL ASSETS MODIFIED, NO EXPORTS.');

 print(ui.Chart.feature.byFeature(table.sort('year'), 'year', ['builtup_km2'])
   .setChartType('LineChart')
   .setOptions({title:'Analysis A — Corrected 2010 to 2025 Built-up area',
     hAxis:{title:'Year'}, vAxis:{title:'Mapped Built-up class (km2)'},
     pointSize:6,lineWidth:2,legend:{position:'none'}}));

 Map.layers().reset();
 Map.setOptions('SATELLITE');
 YEARS.forEach(function(y, i) {
   Map.addLayer(IMAGES[i], {min:1,max:5,palette:PALETTE},
     y + ' Analysis A LULC', y === 2015);
 });
 Map.centerObject(ROI, 10);
 // END STAGE 08G-13

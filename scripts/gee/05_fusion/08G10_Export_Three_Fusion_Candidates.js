
 // =============================================================
 // CHENNAI LULC - STAGE 08G-10
 // FREEZE THREE EXPERIMENTAL FUSION CLASSIFICATIONS
 //
 // 2015: GAIA2015 + WSF2015 + corrected 2020
 // 2020: GAIA2018 + WorldCover2020
 // 2025: GAIA2018 + Dynamic World2025
 //
 // Exports NEW assets only. Originals remain unchanged.
 // =============================================================

 var ROOT = 'projects/assignment-482806/assets/';

 var roi = ee.FeatureCollection(
   ROOT + 'chennai_admin_study_area_clean'
 ).geometry();

 var CRS = 'EPSG:32644';

 var GRID = [
   30, 0, 399060,
   0, -30, 1463250
 ];

 var FRACTION = 0.67;

 var old15 = ee.Image(
   ROOT + 'chennai_mlc_lulc_2015'
 ).select(0);

 var old20 = ee.Image(
   ROOT + 'chennai_mlc_lulc_2020'
 ).select(0);

 var old25 = ee.Image(
   ROOT + 'chennai_mlc_lulc_2025_from_original_tif'
 ).select(0);

 var gaia = ee.Image(
   'Tsinghua/FROM-GLC/GAIA/v10'
 ).select('change_year_index').unmask(0);

 var gaia15 = gaia.gte(4).and(gaia.lte(34));
 var gaia18 = gaia.gte(1).and(gaia.lte(34));

 function openBarren(image) {
   return image.eq(4).or(image.eq(5));
 }

 function fraction30(mask) {
   return mask.toFloat()
     .reduceResolution({
       reducer: ee.Reducer.mean(),
       maxPixels: 1024
     })
     .reproject({
       crs: CRS,
       crsTransform: GRID
     });
 }

 // =============================================================
 // 1. RECONSTRUCT APPROVED EXPERIMENTAL 2020 FUSION
 // =============================================================

 var worldCover = ee.ImageCollection(
   'ESA/WorldCover/v100'
 ).first().select('Map');

 var wcFraction = fraction30(
   worldCover.eq(50)
 );

 var promote20 = openBarren(old20)
   .and(gaia18)
   .and(wcFraction.gte(FRACTION));

 var fused20 = old20.where(promote20, 1)
   .rename('LULC')
   .toByte()
   .clip(roi)
   .set({
     year: 2020,
     method: 'experimental_gaia2018_worldcover2020_fusion'
   });

 // =============================================================
 // 2. RECONSTRUCT 2015 TEMPORAL FUSION
 // =============================================================

 // Reproduce Stage 08G-9 WSF processing.

 var wsf10 = ee.Image(
   'DLR/WSF/WSF2015/v1'
 ).select(0).unmask(0).eq(255);

 var wsfFraction = fraction30(wsf10);

 var promote15 = openBarren(old15)
   .and(gaia15)
   .and(wsfFraction.gte(FRACTION))
   .and(fused20.eq(1));

 var fused15 = old15.where(promote15, 1)
   .rename('LULC')
   .toByte()
   .clip(roi)
   .set({
     year: 2015,
     method: 'experimental_gaia2015_wsf2015_temporal_fusion'
   });

 // =============================================================
 // 3. RECONSTRUCT 2025 GAIA + DYNAMIC WORLD FUSION
 // =============================================================

 var dw = ee.ImageCollection(
   'GOOGLE/DYNAMICWORLD/V1'
 )
 .filterBounds(roi)
 .filterDate('2025-01-01', '2026-01-01')
 .select('built');

 var tenMetreGrid = ee.Projection(CRS).atScale(10);

 var dwCount = dw.count()
   .setDefaultProjection(tenMetreGrid);

 var dwMedian = dw.median()
   .setDefaultProjection(tenMetreGrid);

 var strongFraction = fraction30(
   dwMedian.gte(0.65)
     .and(dwCount.gte(6))
     .unmask(0)
 );

 var promote25 = openBarren(old25)
   .and(gaia18)
   .and(strongFraction.gte(0.67));

 var fused25 = old25.where(promote25, 1)
   .rename('LULC')
   .toByte()
   .clip(roi)
   .set({
     year: 2025,
     method: 'experimental_gaia2018_dynamicworld2025_fusion'
   });

 // =============================================================
 // 4. CONSOLE CHECKPOINT
 // =============================================================

 print('==========================================');
 print('STAGE 08G-10 | EXPERIMENTAL MAP EXPORTS');
 print('==========================================');

 print('Expected 2015 Built-up: 292.2426 km2');
 print('Expected 2020 Built-up: 296.7395 km2');
 print('Expected 2025 Built-up: 342.6019 km2');

 print('Dynamic World scene count - expected 79:');
 print(dw.size());

 print('2015 candidate projection:');
 print(fused15.projection());

 print('2020 candidate projection:');
 print(fused20.projection());

 print('2025 candidate projection:');
 print(fused25.projection());

 print('Original assets remain unchanged.');
 print('Three new CANDIDATE asset tasks prepared.');
 print('The maps are experimental, not final validated maps.');

 // =============================================================
 // 5. OPTIONAL MAP PREVIEW
 // =============================================================

 var palette = [
   'ff0000',
   '008000',
   '0000ff',
   'ffff00',
   'd2b48c'
 ];

 Map.layers().reset();
 Map.setOptions('SATELLITE');

 Map.addLayer(
   fused15,
   {min: 1, max: 5, palette: palette},
   '2015 TEMPORAL FUSION',
   false
 );

 Map.addLayer(
   fused20,
   {min: 1, max: 5, palette: palette},
   '2020 GAIA + WORLDCOVER',
   false
 );

 Map.addLayer(
   fused25,
   {min: 1, max: 5, palette: palette},
   '2025 GAIA + DYNAMIC WORLD',
   false
 );

 Map.centerObject(roi, 10);

 // =============================================================
 // 6. EXPORT EXPERIMENTAL 2015 CLASSIFICATION
 // =============================================================

 Export.image.toAsset({
   image: fused15,

   description:
     'Chennai_08G10_2015_temporal_fusion_CANDIDATE_v1',

   assetId:
     ROOT + 'chennai_08g10_2015_temporal_fusion_candidate_v1',

   region: roi,
   crs: CRS,
   crsTransform: GRID,
   maxPixels: 1e9,

   pyramidingPolicy: {
     '.default': 'mode'
   }
 });

 // =============================================================
 // 7. EXPORT EXPERIMENTAL 2020 CLASSIFICATION
 // =============================================================

 Export.image.toAsset({
   image: fused20,

   description:
     'Chennai_08G10_2020_gaia_wc_fusion_CANDIDATE_v1',

   assetId:
     ROOT + 'chennai_08g10_2020_gaia_wc_fusion_candidate_v1',

   region: roi,
   crs: CRS,
   crsTransform: GRID,
   maxPixels: 1e9,

   pyramidingPolicy: {
     '.default': 'mode'
   }
 });

 // =============================================================
 // 8. EXPORT EXPERIMENTAL 2025 CLASSIFICATION
 // =============================================================

 Export.image.toAsset({
   image: fused25,

   description:
     'Chennai_08G10_2025_gaia_dw_fusion_CANDIDATE_v1',

   assetId:
     ROOT + 'chennai_08g10_2025_gaia_dw_fusion_candidate_v1',

   region: roi,
   crs: CRS,
   crsTransform: GRID,
   maxPixels: 1e9,

   pyramidingPolicy: {
     '.default': 'mode'
   }
 });

 // =============================================================
 // END STAGE 08G-10
 // =============================================================

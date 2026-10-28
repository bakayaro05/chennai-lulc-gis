
 // ================================================================
 // CHENNAI LULC | STAGE 08G-9
 // 2015 TEMPORAL-CONSISTENCY FUSION WITH CORRECTED 2020 MAP
 // Diagnostic candidate only. No asset modifications or exports.
 // ================================================================

 var ROOT = 'projects/assignment-482806/assets/';
 var roi = ee.FeatureCollection(
   ROOT + 'chennai_admin_study_area_clean'
 ).geometry();

 var original15 = ee.Image(ROOT + 'chennai_mlc_lulc_2015')
   .select(0).rename('original15');
 var original20 = ee.Image(ROOT + 'chennai_mlc_lulc_2020')
   .select(0).rename('original20');
 var validation15 = ee.FeatureCollection(
   ROOT + 'chennai_validation_2015_final'
 );

 var CRS = 'EPSG:32644';
 var GRID = [30, 0, 399060, 0, -30, 1463250];
 var FRACTION = 0.67;
 var colors = ['ff0000','008000','0000ff','ffff00','d2b48c'];

 // 1. Historical impervious coverage (GAIA).

 var gaia = ee.Image('Tsinghua/FROM-GLC/GAIA/v10')
   .select('change_year_index').unmask(0);

 var impervious2015 = gaia.gte(4).and(gaia.lte(34));
 var impervious2018 = gaia.gte(1).and(gaia.lte(34));

 // 2. WSF2015 settlement fraction at 30 m.
 // Select first band because the user's dataset exposes "WSF".

 var wsf10 = ee.Image('DLR/WSF/WSF2015/v1')
   .select(0).unmask(0).eq(255).toFloat();

 var wsfFraction = wsf10.reduceResolution({
   reducer: ee.Reducer.mean(),
   maxPixels: 1024
 }).reproject({
   crs: CRS,
   crsTransform: GRID
 });

 var wsfSupported = wsfFraction.gte(FRACTION);

 // 3. Reconstruct the previous successful
 //    GAIA2018 + WorldCover2020 fusion.

 var wc10 = ee.ImageCollection('ESA/WorldCover/v100')
   .first().select('Map').eq(50).toFloat();

 var wcFraction = wc10.reduceResolution({
   reducer: ee.Reducer.mean(),
   maxPixels: 1024
 }).reproject({
   crs: CRS,
   crsTransform: GRID
 });

 var suspect20 = original20.eq(4).or(original20.eq(5));

 var promote20 = suspect20.and(impervious2018)
   .and(wcFraction.gte(FRACTION));

 var corrected20 = original20.where(promote20, 1)
   .rename('corrected20').toByte();

 // 4. 2015 correction:
 //    GAIA2015 AND WSF2015 AND corrected 2020 Built-up.
 //
 // Original 2015 Built-up is retained. Only original
 // classes 4 and 5 are eligible for promotion.

 var suspect15 = original15.eq(4).or(original15.eq(5));

 var broad2015 = suspect15
   .and(impervious2015)
   .and(wsfSupported);

 var temporalPromote = broad2015.and(corrected20.eq(1));

 var candidate15 = original15.where(temporalPromote, 1)
   .rename('candidate15').toByte();

 // 5. Paired validation on the original 300 points.

 var paired = original15.addBands(candidate15)
   .sampleRegions({
     collection: validation15,
     properties: ['class_id'],
     projection: original15.projection(),
     tileScale: 8,
     geometries: false
   })
   .map(function(f) {

     var actual = ee.Number(f.get('class_id'));
     var oldClass = ee.Number(f.get('original15'));
     var newClass = ee.Number(f.get('candidate15'));

     return f.set({
       delta: newClass.eq(actual)
         .subtract(oldClass.eq(actual)),
       changed: oldClass.neq(newClass)
     });

   });

 var CLASSES = [1, 2, 3, 4, 5];

 var oldCM = paired.errorMatrix(
   'class_id', 'original15', CLASSES
 );

 var newCM = paired.errorMatrix(
   'class_id', 'candidate15', CLASSES
 );

 var truthBU = paired.filter(
   ee.Filter.eq('class_id', 1)
 );

 var truthOther = paired.filter(
   ee.Filter.neq('class_id', 1)
 );

 // 6. One area calculation on the original 30 m grid.

 var common = original15.mask().and(original20.mask());

 function km2(condition, name) {
   return ee.Image.pixelArea().divide(1e6)
     .updateMask(condition)
     .updateMask(common)
     .rename(name);
 }

 var allAreas = ee.Image.cat([

   km2(
     original15.eq(1),
     'original2015_BU_km2'
   ),

   km2(
     candidate15.eq(1),
     'temporal2015_BU_km2'
   ),

   km2(
     corrected20.eq(1),
     'corrected2020_BU_km2'
   ),

   km2(
     broad2015,
     'broad_GAIA_WSF_2015_additions_km2'
   ),

   km2(
     temporalPromote,
     'supported_2015_additions_km2'
   ),

   km2(
     broad2015.and(corrected20.neq(1)),
     '2015_additions_rejected_by_2020_km2'
   ),

   km2(
     temporalPromote.and(original15.eq(4)),
     '2015_added_from_class4_km2'
   ),

   km2(
     temporalPromote.and(original15.eq(5)),
     '2015_added_from_class5_km2'
   ),

   km2(
     original15.eq(1).and(corrected20.neq(1)),
     'original2015_BU_not_BU2020_km2'
   ),

   km2(
     candidate15.eq(1).and(corrected20.neq(1)),
     'candidate2015_BU_not_BU2020_km2'
   )

 ]);

 var areas = allAreas.reduceRegion({
   reducer: ee.Reducer.sum(),
   geometry: roi,
   crs: CRS,
   crsTransform: GRID,
   maxPixels: 1e8,
   tileScale: 8
 });

 // 7. Console checkpoints.

 print('============================================');
 print('STAGE 08G-9 | 2015 TEMPORAL-CONSISTENCY FUSION');
 print('============================================');

 print('GAIA2015 + WSF2015 + corrected 2020 Built-up');

 print('Validation count (expect 300):');
 print(paired.size());

 print('Original 2015 confusion matrix:');
 print(oldCM);

 print('Temporally supported 2015 confusion matrix:');
 print(newCM);

 print('OVERALL ACCURACY:');
 print(ee.Dictionary({
   original: oldCM.accuracy(),
   candidate: newCM.accuracy()
 }));

 print('BUILT-UP RECALL:');
 print(ee.Dictionary({
   original: oldCM.producersAccuracy().get([0,0]),
   candidate: newCM.producersAccuracy().get([0,0])
 }));

 print('BUILT-UP TRUE/FALSE POSITIVES:');
 print(ee.Dictionary({

   originalTP: truthBU.filter(
     ee.Filter.eq('original15', 1)
   ).size(),

   candidateTP: truthBU.filter(
     ee.Filter.eq('candidate15', 1)
   ).size(),

   originalFP: truthOther.filter(
     ee.Filter.eq('original15', 1)
   ).size(),

   candidateFP: truthOther.filter(
     ee.Filter.eq('candidate15', 1)
   ).size()

 }));

 print('PAIRED CHANGES:');
 print(ee.Dictionary({

   gains: paired.filter(
     ee.Filter.eq('delta', 1)
   ).size(),

   regressions: paired.filter(
     ee.Filter.eq('delta', -1)
   ).size(),

   changed: paired.filter(
     ee.Filter.eq('changed', 1)
   ).size()

 }));

 print('CITYWIDE AREAS (km2):');
 print(areas);

 print('Provisional 2010 Built-up = approximately 279.82 km2');
 print('2025 experimental Built-up = approximately 342.60 km2');
 print('2025 validation is still pending.');

 print('Temporal consistency is a modeling assumption.');
 print('NO ORIGINAL ASSETS MODIFIED. NO EXPORTS.');

 // 8. Map preview.

 Map.layers().reset();
 Map.setOptions('SATELLITE');

 Map.addLayer(
   original15,
   {min:1, max:5, palette:colors},
   '2015 ORIGINAL',
   true
 );

 Map.addLayer(
   candidate15,
   {min:1, max:5, palette:colors},
   '2015 TEMPORAL CANDIDATE',
   false
 );

 Map.addLayer(
   corrected20,
   {min:1, max:5, palette:colors},
   '2020 FUSION RECREATED',
   false
 );

 Map.addLayer(
   temporalPromote.selfMask(),
   {palette:['00ffff']},
   '2015 SUPPORTED ADDITIONS',
   false
 );

 Map.addLayer(
   broad2015.and(corrected20.neq(1)).selfMask(),
   {palette:['ff00ff']},
   '2015 BROAD ADDITIONS NOT SUPPORTED BY 2020',
   false
 );

 Map.centerObject(roi, 10);

 // END STAGE 08G-9

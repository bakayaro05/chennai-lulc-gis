
 // ============================================================
 // CHENNAI LULC — STAGE 07L
 // 2010 LANDSAT 7 COVERAGE FEASIBILITY (READ-ONLY)
 //
 // Existing baseline: 2010 Landsat 5 full-year composite.
 // Question: Does Landsat 7 add usable clear observations?
 // No composites, models, labels or assets are changed.
 // ============================================================

 var ROOT = 'projects/assignment-482806/assets/';
 var roi = ee.FeatureCollection(
   ROOT + 'chennai_admin_study_area_clean'
 ).geometry();

 var START = '2010-01-01';
 var END = '2011-01-01';
 var CRS = 'EPSG:32644';
 var SCALE = 30;

 // ------------------------------------------------------------
 // 1. FULL-YEAR LANDSAT SCENE INVENTORY
 // ------------------------------------------------------------

 var l5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
   .filterBounds(roi)
   .filterDate(START, END);

 var l7 = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2')
   .filterBounds(roi)
   .filterDate(START, END);

 // ------------------------------------------------------------
 // 2. APPLY ORIGINAL QA MASK RULES
 // ------------------------------------------------------------
 // QA_PIXEL: exclude fill, dilated cloud,
 // cloud, cloud shadow and snow.
 //
 // QA_RADSAT: exclude radiometrically saturated pixels.
 //
 // Landsat 7 SLC-off gaps are excluded as fill/invalid data.
 // ------------------------------------------------------------

 function clearObservation(image) {

   var qa = image.select('QA_PIXEL');
   var sat = image.select('QA_RADSAT');

   var clear = qa.bitwiseAnd(1 << 0).eq(0)
     .and(qa.bitwiseAnd(1 << 1).eq(0))
     .and(qa.bitwiseAnd(1 << 3).eq(0))
     .and(qa.bitwiseAnd(1 << 4).eq(0))
     .and(qa.bitwiseAnd(1 << 5).eq(0))
     .and(sat.eq(0))
     .and(image.select('SR_B1').mask());

   return ee.Image.constant(1)
     .rename('clear')
     .updateMask(clear)
     .copyProperties(image, ['system:time_start']);
 }

 var l5Flags = l5.map(clearObservation);
 var l7Flags = l7.map(clearObservation);

 // ------------------------------------------------------------
 // 3. CLEAR OBSERVATION COUNT IMAGES
 // ------------------------------------------------------------

 var nL5 = l5Flags.count()
   .unmask(0).clip(roi)
   .rename('L5_clear_count')
   .toFloat();

 var nL7 = l7Flags.count()
   .unmask(0).clip(roi)
   .rename('L7_clear_count')
   .toFloat();

 var nBoth = l5Flags.merge(l7Flags)
   .count()
   .unmask(0)
   .clip(roi)
   .rename('Combined_clear_count')
   .toFloat();

 var added = nBoth.subtract(nL5)
   .rename('Added_clear_count');

 // ------------------------------------------------------------
 // 4. COVERAGE STATISTICS
 // ------------------------------------------------------------

 var measurements = ee.Image.cat([

   nL5,
   nL7,
   nBoth,
   added,

   nL5.gte(3)
     .rename('L5_fraction_3plus')
     .toFloat(),

   nBoth.gte(3)
     .rename('Combined_fraction_3plus')
     .toFloat(),

   nL5.lte(1)
     .rename('L5_fraction_0or1')
     .toFloat(),

   nBoth.lte(1)
     .rename('Combined_fraction_0or1')
     .toFloat(),

   added.gt(0)
     .rename('Fraction_improved_by_L7')
     .toFloat()

 ]);

 var means = measurements.reduceRegion({

   reducer: ee.Reducer.mean(),

   geometry: roi,

   crs: CRS,

   scale: SCALE,

   maxPixels: 1e8,

   tileScale: 8

 });

 // ------------------------------------------------------------
 // 5. CLEAR OBSERVATION PERCENTILES
 // ------------------------------------------------------------

 var distribution = ee.Image.cat([
   nL5,
   nL7,
   nBoth,
   added
 ]).reduceRegion({

   reducer: ee.Reducer.percentile([
     10, 25, 50, 75, 90
   ]),

   geometry: roi,

   crs: CRS,

   scale: SCALE,

   maxPixels: 1e8,

   tileScale: 8

 });

 // ------------------------------------------------------------
 // 6. CONSOLE OUTPUT
 // ------------------------------------------------------------

 print('========================================');
 print('07L — 2010 L5 + L7 CLEAR COVERAGE AUDIT');
 print('========================================');

 print('Date window:');
 print(START + ' to ' + END);

 print('Landsat 5 scenes (previous inventory: 7):');
 print(l5.size());

 print('Landsat 7 scenes:');
 print(l7.size());

 print('Locked ROI area km2 (EPSG:32644):');
 print(
   roi.area(1, ee.Projection(CRS))
     .divide(1e6)
 );

 print('========================================');
 print('ROI-WIDE MEAN OBSERVATIONS / COVERAGE');
 print('========================================');

 print(means);

 print('Fraction fields run from 0 to 1.');
 print('Multiply by 100 to obtain percentages.');

 print('========================================');
 print('CLEAR OBSERVATION PERCENTILES');
 print('========================================');

 print(distribution);

 print('========================================');
 print('STAGE 07L STATUS');
 print('========================================');

 print('Landsat 7 has SLC-off gaps in 2010.');
 print('This tests observation availability only.');
 print('It does not establish radiometric compatibility.');
 print('No predictor composite replaced.');
 print('No labels or validation points used.');
 print('No classifier retrained.');
 print('No assets exported.');
 print('END STAGE 07L');

 // ------------------------------------------------------------
 // 7. MAP PREVIEW
 // ------------------------------------------------------------

 Map.layers().reset();
 Map.centerObject(roi, 10);

 Map.addLayer(
   nL5,
   {
     min: 0,
     max: 8,
     palette: [
       'ffffff', 'ffff99', '78c679', '006837'
     ]
   },
   '2010 Landsat 5 clear observations',
   true
 );

 Map.addLayer(
   nBoth,
   {
     min: 0,
     max: 12,
     palette: [
       'ffffff', 'ffff99', '78c679', '006837'
     ]
   },
   '2010 Landsat 5 + 7 clear observations',
   false
 );

 Map.addLayer(
   added,
   {
     min: 0,
     max: 6,
     palette: [
       'ffffff', 'fed976', 'fd8d3c', 'bd0026'
     ]
   },
   'Additional observations from Landsat 7',
   false
 );

 // ============================================================
 // END STAGE 07L
 // ============================================================

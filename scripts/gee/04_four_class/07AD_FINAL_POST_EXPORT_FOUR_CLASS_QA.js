
 // =============================================================
 // CHENNAI LULC — STAGE 07AD
 // FINAL POST-EXPORT QA — 2010, 2015, 2020, 2025
 //
 // READ ONLY — NO EXPORTS OR ASSET MODIFICATIONS
 // =============================================================

var ROOT = 'projects/assignment-482806/assets/';
var CRS = 'EPSG:32644';
var TX = [30, 0, 399060, 0, -30, 1463250];

var ROI = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
).geometry();

var specs = [
  {
    year: 2010,
    source: 'chennai_mlc_lulc_2010_L5L7_manual_exp_v1',
    exported: 'chennai_lulc4_2010_L5L7_provisional_v1'
  },
  {
    year: 2015,
    source: 'chennai_mlc_lulc_2015',
    exported: 'chennai_lulc4_2015_v1'
  },
  {
    year: 2020,
    source: 'chennai_mlc_lulc_2020',
    exported: 'chennai_lulc4_2020_v1'
  },
  {
    year: 2025,
    source: 'chennai_mlc_lulc_2025_from_original_tif',
    exported: 'chennai_lulc4_2025_v1'
  }
];

// =============================================================
// 1. FIXED-GRID AREA REDUCTION
// =============================================================

function sumSqKm(image) {

  return ee.Image.pixelArea()
    .divide(1e6)
    .multiply(image)
    .rename('area_km2')
    .reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: ROI,
      crs: CRS,
      crsTransform: TX,
      maxPixels: 1e9,
      tileScale: 8
    })
    .get('area_km2');

}

function classAreas(image) {

  return ee.Image.pixelArea()
    .divide(1e6)
    .rename('area_km2')
    .addBands(image.rename('code'))
    .reduceRegion({
      reducer: ee.Reducer.sum().group({
        groupField: 1,
        groupName: 'code'
      }),
      geometry: ROI,
      crs: CRS,
      crsTransform: TX,
      maxPixels: 1e9,
      tileScale: 8
    })
    .get('groups');

}

// =============================================================
// 2. VERIFY EACH EXPORTED CLASSIFICATION
// =============================================================

var maps = {};

print('=================================================');
print('STAGE 07AD — POST-EXPORT FOUR-CLASS VERIFICATION');
print('=================================================');

print('Expected CRS: EPSG:32644');
print('Expected resolution: 30 m');
print('Expected grid origin: 399060, 1463250');
print('Original Class 5 merged into Class 4.');

specs.forEach(function(spec) {

  // Original five-class classification.

  var raw = ee.Image(ROOT + spec.source)
    .select([0], ['classification']);

  var five = raw
    .updateMask(
      raw.gte(1).and(raw.lte(5))
    )
    .clip(ROI);

  // Expected four-class result.

  var expected = five.remap(
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 4]
  )
  .rename('classification')
  .toByte();

  // Actual exported four-class asset.

  var saved = ee.Image(ROOT + spec.exported)
    .select([0], ['classification'])
    .clip(ROI);

  maps[spec.year] = saved;

  // Compare both pixel values and masks.
  // Zero is used only to represent masked pixels
  // during comparison.

  var mismatch = expected.unmask(0)
    .neq(saved.unmask(0))
    .rename('mismatch');

  // No valid classified pixel should have codes
  // outside the range 1–4.

  var invalid = saved
    .lt(1)
    .or(saved.gt(4))
    .unmask(0)
    .rename('invalid');

  print('-------------------------------------------------');
  print('YEAR ' + spec.year);

  print('Exported asset: ' + ROOT + spec.exported);

  print('Saved image projection:');
  print(saved.projection());

  print('Saved class areas (km2; expected classes 1–4):');
  print(classAreas(saved));

  print('Saved total valid raster area (km2):');
  print(sumSqKm(saved.mask().rename('mask')));

  print(
    'Pixel/mask mismatch area (km2; EXPECT 0):'
  );
  print(sumSqKm(mismatch));

  print(
    'Area with invalid class codes (km2; EXPECT 0):'
  );
  print(sumSqKm(invalid));

});

// =============================================================
// 3. VERIFY ADJACENT-YEAR TRANSITIONS
// =============================================================

function printTransition(fromYear, toYear) {

  var transition = maps[fromYear]
    .multiply(10)
    .add(maps[toYear])
    .rename('transition');

  print('-------------------------------------------------');

  print(
    'FOUR-CLASS TRANSITION ' +
    fromYear + ' -> ' + toYear
  );

  print(
    'Transition areas in km2 (10 * FROM + TO):'
  );

  print(classAreas(transition));

  print(
    'Built-up -> Agricultural/Unused Open, code 14 (km2):'
  );

  print(sumSqKm(transition.eq(14)));

}

printTransition(2010, 2015);
printTransition(2015, 2020);
printTransition(2020, 2025);

// =============================================================
// 4. MAP VISUALIZATION
// =============================================================

Map.layers().reset();
Map.setOptions('SATELLITE');
Map.centerObject(ROI, 10);

var palette = [
  'e53935', // Built-up
  '2e7d32', // Vegetation
  '1976d2', // Water
  'd8b365'  // Agricultural + Vacant/Unused Open
];

[2010, 2015, 2020, 2025].forEach(function(year) {

  Map.addLayer(
    maps[year],
    {
      min: 1,
      max: 4,
      palette: palette
    },
    year + ' EXPORTED FOUR-CLASS' +
      (year === 2010 ? ' (PROVISIONAL)' : ''),
    year === 2025,
    0.8
  );

});

// =============================================================
// 5. FINAL QA INSTRUCTIONS
// =============================================================

print('=================================================');
print('QA PASS CONDITIONS:');
print('All four mismatch areas = 0 km2.');
print('All four invalid-code areas = 0 km2.');
print('CRS and grid transform are identical.');
print('Each raster covers approximately 529.7711 km2.');
print('2010–2015 mapped urban loss remains uncertain.');
print('No assets modified. No exports created.');
print('END STAGE 07AD');
print('=================================================');

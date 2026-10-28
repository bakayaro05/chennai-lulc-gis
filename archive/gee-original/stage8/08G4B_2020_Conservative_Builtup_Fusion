
// =====================================================================
// CHENNAI LULC — STAGE 08G-4B
// 2020 CONSERVATIVE BUILT-UP FUSION (NO RANDOM FOREST)
//
// Hypothesis: some existing Class 4 / Class 5 pixels are truly urban.
// Make a conservative correction ONLY if two distinct reference
// products agree: GAIA (impervious by 2015) AND ESA WorldCover 2020
// (at least 67% of the corresponding 30 m pixel marked Built-up).
//
// Experimental diagnostic only. Original 2020 map remains unchanged.
// No exports, no retraining, no manual points.
// =====================================================================

var ROOT = 'projects/assignment-482806/assets/';
var ROI = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
).geometry();

var baseline = ee.Image(
  ROOT + 'chennai_mlc_lulc_2020'
).select(0).rename('baseline');

var validation = ee.FeatureCollection(
  ROOT + 'chennai_validation_2020_final'
);

var GRID = [30, 0, 399060, 0, -30, 1463250];
var CRS = 'EPSG:32644';
var WORLD_COVER_MIN_FRACTION = 0.67;

// -----------------------------------------------------------
// 1. GAIA HISTORICAL IMPERVIOUS MAP
// -----------------------------------------------------------

var gaia = ee.Image('Tsinghua/FROM-GLC/GAIA/v10')
  .select('change_year_index').unmask(0);

var gaiaOld = gaia.gte(4).and(gaia.lte(34));

// -----------------------------------------------------------
// 2. ESA WORLDCOVER 2020 — BUILT-UP FRACTION AT 30 M
// -----------------------------------------------------------

// WorldCover 2020: Map class 50 = Built-up.
var worldCover = ee.ImageCollection('ESA/WorldCover/v100')
  .first().select('Map');

// Spatial aggregation of the original 10 m binary
// Built-up indicator to the original analytical 30 m grid.

var wcBuiltFraction = worldCover.eq(50)
  .toFloat().rename('WC_built_10m')
  .reduceResolution({
    reducer: ee.Reducer.mean(),
    maxPixels: 1024
  })
  .reproject({
    crs: CRS,
    crsTransform: GRID
  })
  .rename('WC_built_fraction_30m');

var wcHighBU = wcBuiltFraction.gte(
  WORLD_COVER_MIN_FRACTION
);

// -----------------------------------------------------------
// 3. TARGETED CORRECTION, NO BUILT-UP AREA TARGET
// -----------------------------------------------------------

var isSuspect = baseline.eq(4).or(baseline.eq(5));

var twoSourceSupport = gaiaOld.and(wcHighBU);

var promote = isSuspect.and(twoSourceSupport);

// Only Class 4 or 5 pixels can become Class 1.
// Other classes and locations remain unchanged.

var fusion = baseline.where(promote, 1)
  .rename('candidate').toByte().clip(ROI);

// -----------------------------------------------------------
// 4. ORIGINAL 300-POINT VALIDATION COMPARISON
// -----------------------------------------------------------

var paired = baseline.addBands(fusion).sampleRegions({
  collection: validation,
  properties: ['class_id'],
  projection: baseline.projection(),
  tileScale: 8,
  geometries: false
}).map(function(f) {

  var truth = ee.Number(f.get('class_id'));
  var oldP = ee.Number(f.get('baseline'));
  var newP = ee.Number(f.get('candidate'));

  return f.set({
    delta: newP.eq(truth).subtract(oldP.eq(truth)),
    changed: newP.neq(oldP)
  });

});

var order = [1, 2, 3, 4, 5];

var cmOriginal = paired.errorMatrix(
  'class_id', 'baseline', order
);

var cmFusion = paired.errorMatrix(
  'class_id', 'candidate', order
);

var BU = paired.filter(
  ee.Filter.eq('class_id', 1)
);

var nonBU = paired.filter(
  ee.Filter.neq('class_id', 1)
);

// -----------------------------------------------------------
// 5. CITYWIDE AREA IN ONE REDUCTION
// -----------------------------------------------------------

function area(mask, name) {

  return ee.Image.pixelArea().divide(1e6)
    .updateMask(mask)
    .updateMask(baseline.mask())
    .rename(name);

}

var areaStack = ee.Image.cat([

  area(
    baseline.eq(1),
    'original_BU_km2'
  ),

  area(
    fusion.eq(1),
    'fusion_BU_km2'
  ),

  area(
    promote,
    'total_new_BU_km2'
  ),

  area(
    promote.and(baseline.eq(4)),
    'added_from_class4_km2'
  ),

  area(
    promote.and(baseline.eq(5)),
    'added_from_class5_km2'
  ),

  area(
    gaiaOld.and(isSuspect),
    'all_GAIA_old_vs_open_barren_km2'
  ),

  area(
    twoSourceSupport.and(isSuspect),
    'WC_GAIA_agreement_in_open_barren_km2'
  )

]);

var areas = areaStack.reduceRegion({

  reducer: ee.Reducer.sum(),
  geometry: ROI,
  crs: CRS,
  crsTransform: GRID,
  maxPixels: 1e8,
  tileScale: 8

});

// -----------------------------------------------------------
// 6. CONSOLE OUTPUT
// -----------------------------------------------------------

print('==============================================');
print('STAGE 08G-4B | 2020 CONSERVATIVE BUILT-UP FUSION');
print('==============================================');

print('NOT a Random Forest. NOT independent validation.');

print('GAIA historical cutoff: impervious by 2015.');

print('WorldCover minimum Built-up fraction:');
print(WORLD_COVER_MIN_FRACTION);

print('Original projection:');
print(baseline.projection());

print('WorldCover bands:');
print(worldCover.bandNames());

print('WorldCover projection:');
print(worldCover.projection());

print('Validation count (expected 300):');
print(paired.size());

print('Original MLC confusion matrix:');
print(cmOriginal);

print('New fusion confusion matrix:');
print(cmFusion);

print('Overall accuracy:');
print(ee.Dictionary({
  original: cmOriginal.accuracy(),
  fusion: cmFusion.accuracy()
}));

print('Built-up recall:');
print(ee.Dictionary({
  original: cmOriginal.producersAccuracy().get([0,0]),
  fusion: cmFusion.producersAccuracy().get([0,0])
}));

print('Built-up true positives:');
print(ee.Dictionary({

  original: BU.filter(
    ee.Filter.eq('baseline', 1)
  ).size(),

  fusion: BU.filter(
    ee.Filter.eq('candidate', 1)
  ).size()

}));

print('Built-up false positives:');
print(ee.Dictionary({

  original: nonBU.filter(
    ee.Filter.eq('baseline', 1)
  ).size(),

  fusion: nonBU.filter(
    ee.Filter.eq('candidate', 1)
  ).size()

}));

print('Validation prediction changes:');
print(ee.Dictionary({

  improved: paired.filter(
    ee.Filter.eq('delta', 1)
  ).size(),

  worsened: paired.filter(
    ee.Filter.eq('delta', -1)
  ).size(),

  changed: paired.filter(
    ee.Filter.eq('changed', 1)
  ).size()

}));

print('==============================================');
print('CITYWIDE AREA SUMMARY (km2)');
print('==============================================');
print(areas);

print('No original assets modified.');
print('No new raster exported.');
print('GAIA and WorldCover are NOT ground truth.');

// -----------------------------------------------------------
// 7. MAP VISUALIZATION
// -----------------------------------------------------------

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
  baseline,
  {min: 1, max: 5, palette: palette},
  '2020 ORIGINAL MLC',
  true
);

Map.addLayer(
  fusion,
  {min: 1, max: 5, palette: palette},
  '2020 CONSERVATIVE FUSION',
  false
);

Map.addLayer(
  promote.selfMask(),
  {palette: ['00ffff']},
  'BU CORRECTIONS: GAIA + WORLDCOVER',
  false
);

Map.addLayer(
  wcBuiltFraction,
  {
    min: 0,
    max: 1,
    palette: ['ffffff', 'ff0000']
  },
  'WORLDCOVER BUILT-UP FRACTION AT 30m',
  false
);

Map.centerObject(ROI, 10);

// ============================================================
// END STAGE 08G-4B
// ============================================================

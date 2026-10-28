
// ============================================================
// CHENNAI LULC — STAGE 08G-8
// AUTOMATED 2025 GAIA + DYNAMIC WORLD PAIRED VALIDATION
//
// Reconstruct a NEW balanced 300-pixel assessment sample from
// the original, separately labelled 2025 VALIDATION POLYGONS.
//
// This is NOT the archived exact 2025 300-point sample.
//
// READ ONLY: no exports, no retraining, no original edits.
// ============================================================

var ROOT = 'projects/assignment-482806/assets/';

var roi = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
).geometry();

var baseline = ee.Image(
  ROOT + 'chennai_mlc_lulc_2025_from_original_tif'
).select(0).rename('baseline');

var validationPolygons = ee.FeatureCollection(
  ROOT + 'chennai_validation_polygons_2025_master'
);

var trainingPolygons = ee.FeatureCollection(
  ROOT + 'chennai_training_polygons_2025_master'
);

var GRID = [30, 0, 399060, 0, -30, 1463250];
var CRS = 'EPSG:32644';
var referenceGrid = baseline.projection();

// ============================================================
// 1. EXACT STAGE 08G-7 CORRECTION RULE
// ============================================================

var GAIA = ee.Image(
  'Tsinghua/FROM-GLC/GAIA/v10'
).select('change_year_index').unmask(0);

var gaiaBy2018 = GAIA.gte(1).and(GAIA.lte(34));

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

function fraction30(mask, name) {

  return mask.toFloat().reduceResolution({
    reducer: ee.Reducer.mean(),
    maxPixels: 1024
  })
  .reproject({
    crs: CRS,
    crsTransform: GRID
  })
  .rename(name);
}

var dwStrong = fraction30(
  dwMedian.gte(0.65)
    .and(dwCount.gte(6))
    .unmask(0),
  'strongBuiltFraction30'
).gte(0.67);

var openBarren = baseline.eq(4).or(baseline.eq(5));

var promote = openBarren
  .and(gaiaBy2018)
  .and(dwStrong);

var fusion = baseline.where(promote, 1)
  .rename('fusion').toByte();

// ============================================================
// 2. REUSE ORIGINAL 2025 VALIDATION POLYGONS
// ============================================================

// Rasterize reference class labels from the existing
// independently prepared validation polygons.

var reference = validationPolygons.reduceToImage({
  properties: ['class_id'],
  reducer: ee.Reducer.first()
})
.rename('class_id')
.toByte();

// ============================================================
// 3. EXCLUDE ORIGINAL TRAINING POLYGONS
// ============================================================

// Apply a conservative 30 m buffer around training
// polygons to avoid sampling immediately adjacent pixels.

var bufferedTraining = trainingPolygons.map(function(f) {

  return ee.Feature(
    f.geometry().buffer(30)
  );

});

var trainExclusion = ee.Image.constant(0)
  .toByte()
  .paint(bufferedTraining, 1);

var eligible = baseline.mask()
  .and(fusion.mask())
  .and(trainExclusion.eq(0));

// ============================================================
// 4. CREATE NEW BALANCED PAIRED ASSESSMENT
// ============================================================

// Fixed seed 84.
// Sample exactly the same pixels for both maps.
// Target 60 points per class, total 300.

var assessment = reference
  .updateMask(eligible)
  .addBands([baseline, fusion])
  .stratifiedSample({

    numPoints: 0,

    classBand: 'class_id',

    region: roi,

    projection: referenceGrid,

    classValues: [1, 2, 3, 4, 5],

    classPoints: [60, 60, 60, 60, 60],

    seed: 84,

    dropNulls: true,

    geometries: false,

    tileScale: 8

  })
  .map(function(f) {

    var truth = ee.Number(f.get('class_id'));
    var old = ee.Number(f.get('baseline'));
    var next = ee.Number(f.get('fusion'));

    return f.set({

      delta: next.eq(truth)
        .subtract(old.eq(truth)),

      changed: next.neq(old)

    });

  });

// ============================================================
// 5. CONFUSION MATRICES
// ============================================================

var classOrder = [1, 2, 3, 4, 5];

var oldCM = assessment.errorMatrix(
  'class_id',
  'baseline',
  classOrder
);

var fusionCM = assessment.errorMatrix(
  'class_id',
  'fusion',
  classOrder
);

var bu = assessment.filter(
  ee.Filter.eq('class_id', 1)
);

var nonBu = assessment.filter(
  ee.Filter.neq('class_id', 1)
);

// ============================================================
// 6. CONSOLE RESULTS
// ============================================================

print('============================================');
print('STAGE 08G-8 | AUTOMATED 2025 PAIRED VALIDATION');
print('============================================');

print('REFERENCE: original 2025 validation polygons');

print('2025 VALIDATION POLYGON COUNT:');
print(validationPolygons.size());

print('VALIDATION POLYGON CLASS LABELS:');
print(validationPolygons.aggregate_histogram('class_id'));

print('TRAINING POLYGON COUNT:');
print(trainingPolygons.size());

print('DW 2025 scene count (previously 79):');
print(dw.size());

print('NEW PAIRED SAMPLE SIZE (target 300):');
print(assessment.size());

print('NEW SAMPLE BALANCE (target 60/class):');
print(
  assessment.aggregate_histogram('class_id')
);

print('2025 ORIGINAL confusion matrix - NEW sample:');
print(oldCM);

print('2025 GAIA + DW confusion matrix - SAME sample:');
print(fusionCM);

print('OVERALL ACCURACY:');
print(ee.Dictionary({

  original: oldCM.accuracy(),

  fusion: fusionCM.accuracy()

}));

print('BUILT-UP RECALL:');
print(ee.Dictionary({

  original: oldCM.producersAccuracy().get([0, 0]),

  fusion: fusionCM.producersAccuracy().get([0, 0])

}));

print('BUILT-UP TRUE / FALSE POSITIVES:');

print(ee.Dictionary({

  old_TP: bu.filter(
    ee.Filter.eq('baseline', 1)
  ).size(),

  fusion_TP: bu.filter(
    ee.Filter.eq('fusion', 1)
  ).size(),

  old_FP: nonBu.filter(
    ee.Filter.eq('baseline', 1)
  ).size(),

  fusion_FP: nonBu.filter(
    ee.Filter.eq('fusion', 1)
  ).size()

}));

print('PAIRED CORRECTIONS / REGRESSIONS:');

print(ee.Dictionary({

  newly_correct: assessment.filter(
    ee.Filter.eq('delta', 1)
  ).size(),

  newly_wrong: assessment.filter(
    ee.Filter.eq('delta', -1)
  ).size(),

  changed: assessment.filter(
    ee.Filter.eq('changed', 1)
  ).size()

}));

print('============================================');
print('IMPORTANT VALIDATION NOTES');
print('============================================');

print('Archived 2025 original MLC OA = 251/300 = 83.67%');

print('This is a NEW assessment sample, NOT the archived set.');

print('Compare original and fusion on this SAME sample only.');

print('Previous Stage 08G-7 fused Built-up area:');
print('342.60191861855833 km2');

print('If balance is below 60/class, do not adopt result.');

print('NO EXPORTS. ORIGINAL ASSETS UNCHANGED.');

// ============================================================
// 7. MAP DISPLAY
// ============================================================

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
  '2025 ORIGINAL MLC',
  true
);

Map.addLayer(
  fusion,
  {min: 1, max: 5, palette: palette},
  '2025 GAIA + DW FUSION',
  false
);

Map.addLayer(
  promote.selfMask(),
  {palette: ['00ffff']},
  '2025 NEW BUILT-UP',
  false
);

Map.centerObject(roi, 10);

// ============================================================
// END STAGE 08G-8
// ============================================================


// ============================================================
// CHENNAI LULC — STAGE 07H
// 2010 MANUAL GAUSSIAN MLC — INDEPENDENT VALIDATION
//
// VERSION: 2010_MANUAL_V1
//
// INPUTS:
// chennai_mlc_lulc_2010_manual_v1
// chennai_validation_2010_final
// chennai_admin_study_area_clean
// chennai_predictor_stack_2010
//
// AUDIT ONLY — NO EXPORTS
// No training changes, no validation-guided tuning.
// ============================================================

// ------------------------------------------------------------
// 1. CONFIGURATION
// ------------------------------------------------------------

var ROOT = 'projects/assignment-482806/assets/';

var CRS = 'EPSG:32644';
var SCALE = 30;

var CLASS_ORDER = [1, 2, 3, 4, 5];

var CLASS_NAMES = [
  'Built-up',
  'Vegetation',
  'Water',
  'Agricultural/Open',
  'Barren/Fallow'
];

var projection = ee.Projection(CRS).atScale(SCALE);

// ------------------------------------------------------------
// 2. LOAD SAVED ASSETS
// ------------------------------------------------------------

var roi = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
).geometry();

var classified = ee.Image(
  ROOT + 'chennai_mlc_lulc_2010_manual_v1'
).select('classification');

var validation = ee.FeatureCollection(
  ROOT + 'chennai_validation_2010_final'
);

var stack2010 = ee.Image(
  ROOT + 'chennai_predictor_stack_2010'
);

// ------------------------------------------------------------
// 3. CHECK CLASSIFICATION AND VALIDATION ASSETS
// ------------------------------------------------------------

print('========================================');
print('STAGE 07H — INDEPENDENT 2010 VALIDATION');
print('========================================');

print('Classification raster:');
print(ROOT + 'chennai_mlc_lulc_2010_manual_v1');

print('Raster band names:');
print(classified.bandNames());

print('Raster projection:');
print(classified.projection());

print('Independent validation asset:');
print(ROOT + 'chennai_validation_2010_final');

print('Validation point count (expected 300):');
print(validation.size());

print('Validation counts by class (expected 60 each):');
print(validation.aggregate_histogram('class_id'));

print('Class ID order:');
print(CLASS_ORDER);

print('Class names:');
print(CLASS_NAMES);

// Verify ROI using locked analytical CRS.

print('Locked ROI area in EPSG:32644 (expected 529.450838 km2):');

print(
  roi.area(
    1,
    ee.Projection(CRS)
  ).divide(1e6)
);

// ------------------------------------------------------------
// 4. SAMPLE SAVED CLASSIFICATION AT VALIDATION POINTS
// ------------------------------------------------------------

var validationPredictions = classified.sampleRegions({

  collection: validation,

  properties: ['class_id'],

  projection: projection,

  scale: SCALE,

  geometries: true,

  tileScale: 8

});

// ------------------------------------------------------------
// 5. VALIDATION COVERAGE CHECKS
// ------------------------------------------------------------

print('========================================');
print('VALIDATION SAMPLE COVERAGE');
print('========================================');

print('Total reserved validation points:');
print(validation.size());

print('Points with valid classification predictions:');
print(validationPredictions.size());

print('Validation points missing predictions:');
print(
  validation.size().subtract(
    validationPredictions.size()
  )
);

print('Validation coverage percentage:');
print(
  ee.Number(validationPredictions.size())
    .divide(validation.size())
    .multiply(100)
);

print('Actual validation classes sampled:');
print(
  validationPredictions.aggregate_histogram('class_id')
);

print('Predicted class distribution at validation points:');
print(
  validationPredictions.aggregate_histogram(
    'classification'
  )
);

print('Example validation prediction:');
print(validationPredictions.first());

// ------------------------------------------------------------
// 6. CONFUSION MATRIX
// ------------------------------------------------------------
//
// Rows    = reference (actual) classes
// Columns = classification (predicted) classes
//
// Order: 1, 2, 3, 4, 5
//
// Do not treat a partial validation sample as
// the final 300-point accuracy result.
// ------------------------------------------------------------

var confusionMatrix = validationPredictions.errorMatrix(

  'class_id',

  'classification',

  CLASS_ORDER

);

print('========================================');
print('CONFUSION MATRIX');
print('========================================');

print('Rows = reference classes');
print('Columns = predicted classes');

print('Class order: 1, 2, 3, 4, 5');

print(confusionMatrix);

// ------------------------------------------------------------
// 7. OVERALL ACCURACY
// ------------------------------------------------------------

print('========================================');
print('OVERALL ACCURACY');
print('========================================');

print('Overall accuracy (fraction):');
print(confusionMatrix.accuracy());

print('Overall accuracy (%):');
print(
  ee.Number(confusionMatrix.accuracy())
    .multiply(100)
);

// ------------------------------------------------------------
// 8. KAPPA COEFFICIENT
// ------------------------------------------------------------

print('========================================');
print('KAPPA COEFFICIENT');
print('========================================');

print(confusionMatrix.kappa());

// ------------------------------------------------------------
// 9. CLASS-SPECIFIC ACCURACY
// ------------------------------------------------------------
//
// Producer's accuracy:
// Correctly classified reference samples /
// all reference samples for that class.
//
// User's accuracy:
// Correctly classified predictions /
// all predictions assigned to that class.
// ------------------------------------------------------------

print('========================================');
print('CLASS-SPECIFIC ACCURACY');
print('========================================');

print('Class order:');
print(CLASS_NAMES);

print('Producer accuracy (classes 1–5):');
print(confusionMatrix.producersAccuracy());

print('User accuracy (classes 1–5):');
print(confusionMatrix.consumersAccuracy());

// ------------------------------------------------------------
// 10. MAP DISPLAY
// ------------------------------------------------------------

Map.layers().reset();

Map.setOptions('TERRAIN');

Map.centerObject(roi, 10);

Map.addLayer(
  stack2010,
  {
    bands: ['red', 'green', 'blue'],
    min: 0.02,
    max: 0.30
  },
  '2010 LANDSAT TRUE COLOUR',
  false
);

Map.addLayer(
  classified,
  {
    min: 1,
    max: 5,
    palette: [
      'ff0000',
      '008000',
      '0000ff',
      'ffff00',
      'd2b48c'
    ]
  },
  '2010 MANUAL GAUSSIAN MLC',
  true
);

Map.addLayer(
  validation.style({
    color: 'FFFFFF',
    pointSize: 3
  }),
  {},
  '300 INDEPENDENT VALIDATION POINTS',
  false
);

// ------------------------------------------------------------
// 11. FINAL STATUS
// ------------------------------------------------------------

print('========================================');
print('STAGE 07H — VALIDATION COMPLETED');
print('========================================');

print('Method: Independent 300-point validation.');

print('No classifier retrained.');

print('No validation labels changed.');

print('No validation-based tuning performed.');

print('No assets exported.');

print('Interpret overall accuracy only if all 300 points');
print('have valid predictions and class labels are correct.');

print('========================================');
print('END STAGE 07H');
print('========================================');

// ============================================================
// END STAGE 07H
// ============================================================


// ============================================================
// CHENNAI LULC — STAGE 07G
// 2010 MANUAL-TRAINED GAUSSIAN MLC
//
// VERSION: 2010_MANUAL_V1
//
// INPUT:
// chennai_training_2010_manual_final_v1
// chennai_predictor_stack_2010
// chennai_admin_study_area_clean
//
// OUTPUT:
// chennai_mlc_lulc_2010_manual_v1
//
// METHOD:
// Actual multivariate Gaussian Maximum Likelihood
// 9 predictor bands
// Class-specific means and covariance matrices
// Diagonal regularization = 1e-6
// Equal class priors
//
// No automatic label transfer.
// No training label changes.
// No validation-based tuning.
// Area statistics and validation follow raster export.
// ============================================================


// ------------------------------------------------------------
// 1. CONFIGURATION
// ------------------------------------------------------------

var ROOT = 'projects/assignment-482806/assets/';

var CRS = 'EPSG:32644';
var SCALE = 30;

var REGULARIZATION = 1e-6;
var N_BANDS = 9;

var BANDS = [
  'blue',
  'green',
  'red',
  'nir',
  'swir1',
  'swir2',
  'NDVI',
  'NDWI',
  'NDBI'
];

var CLASS_IDS = [1, 2, 3, 4, 5];

var OUTPUT_ASSET =
  ROOT + 'chennai_mlc_lulc_2010_manual_v1';


// ------------------------------------------------------------
// 2. LOAD LOCKED PROJECT ASSETS
// ------------------------------------------------------------

var roi = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
).geometry();

var training = ee.FeatureCollection(
  ROOT + 'chennai_training_2010_manual_final_v1'
);

var stack2010 = ee.Image(
  ROOT + 'chennai_predictor_stack_2010'
).select(BANDS).clip(roi);


// ------------------------------------------------------------
// 3. TRAINING QA
// ------------------------------------------------------------

print('========================================');
print('STAGE 07G — 2010 GAUSSIAN MLC');
print('========================================');

print('Training asset:');
print(ROOT + 'chennai_training_2010_manual_final_v1');

print('Training count (expected 600):');
print(training.size());

print('Training counts by class (expected 120 each):');
print(training.aggregate_histogram('class_id'));

print('Number of unique training sites (expected 28):');
print(training.aggregate_count_distinct('site_id'));

print('Unique pixel grid locations (expected 600):');
print(training.aggregate_count_distinct('grid_key'));

print('Predictor band order:');
print(stack2010.bandNames());

print('Study area (vector km2):');
print(roi.area(1).divide(1e6));


// ------------------------------------------------------------
// 4. ESTIMATE PARAMETERS FOR EACH CLASS
// ------------------------------------------------------------
//
// Each class has:
// - Mean vector: 9 x 1
// - Covariance matrix: 9 x 9
// - Regularized covariance: Sigma + 1e-6 I
// - Covariance determinant
// - Inverse covariance
//
// This follows the locked 2020 Gaussian MLC approach.
// ------------------------------------------------------------

function buildClassParameters(classID) {

  var classSamples = training.filter(
    ee.Filter.eq('class_id', classID)
  );

  // Calculate all nine class means.

  var meanValues = BANDS.map(function(bandName) {

    return classSamples.aggregate_mean(bandName);

  });

  // Create 9 x 1 mean column vector.

  var meanVector = ee.Array([
    meanValues
  ]).transpose();

  // Convert feature properties into 9-element arrays.

  var arraySamples = classSamples.makeArray(
    BANDS,
    'mlc_predictor_array'
  );

  // Sample covariance matrix.

  var covarianceResult = arraySamples.reduceColumns({
    reducer: ee.Reducer.covariance()
      .setOutputs(['covariance']),
    selectors: ['mlc_predictor_array']
  });

  var rawCovariance = ee.Array(
    covarianceResult.get('covariance')
  );

  // Apply diagonal covariance regularization.

  var identity = ee.Array.identity(N_BANDS);

  var covariance = rawCovariance.add(
    identity.multiply(REGULARIZATION)
  );

  // Calculate determinants and inverse.

  var rawDeterminant =
    rawCovariance.matrixDeterminant();

  var determinant =
    covariance.matrixDeterminant();

  var inverse =
    covariance.matrixInverse();

  return ee.Dictionary({

    class_id: classID,

    sample_count: classSamples.size(),

    mean: meanVector,

    covariance: covariance,

    inverse: inverse,

    raw_determinant: rawDeterminant,

    determinant: determinant

  });

}


// ------------------------------------------------------------
// 5. BUILD THE FIVE CLASS PARAMETER SETS
// ------------------------------------------------------------

var classParameters = [
  buildClassParameters(1),
  buildClassParameters(2),
  buildClassParameters(3),
  buildClassParameters(4),
  buildClassParameters(5)
];


// ------------------------------------------------------------
// 6. COVARIANCE QA
// ------------------------------------------------------------
//
// Regularized determinants should be finite and positive.
//
// This section checks parameter calculation before
// trusting the MLC export.
// ------------------------------------------------------------

var parameterQA = ee.FeatureCollection(
  CLASS_IDS.map(function(classID) {

    var p = ee.Dictionary(
      classParameters[classID - 1]
    );

    var determinant = ee.Number(
      p.get('determinant')
    );

    return ee.Feature(null, {

      class_id: classID,

      sample_count: p.get('sample_count'),

      raw_determinant: p.get('raw_determinant'),

      regularized_determinant:
        determinant,

      determinant_positive:
        determinant.gt(0)

    });

  })
);

print('========================================');
print('GAUSSIAN MLC PARAMETER QA');
print('========================================');

print('Class covariance determinant checks:');
print(parameterQA);

print('All regularized determinants should be positive.');


// ------------------------------------------------------------
// 7. BUILD THE PREDICTOR COLUMN ARRAY IMAGE
// ------------------------------------------------------------
//
// Pixel predictor vector:
// x = [blue, green, red, nir, swir1,
//      swir2, NDVI, NDWI, NDBI]'
// Shape = 9 x 1
// ------------------------------------------------------------

var predictorColumn = stack2010
  .toArray()
  .toArray(1);


// ------------------------------------------------------------
// 8. GAUSSIAN LOG-LIKELIHOOD FUNCTION
// ------------------------------------------------------------
//
// g_c(x) =
// -0.5 * ln(|Sigma_c|)
// -0.5 * (x - mu_c)' Sigma_c^-1 (x - mu_c)
//
// The common normalizing constant is omitted.
// Equal class priors are assumed.
//
// The highest score determines the assigned class.
// ------------------------------------------------------------

function makeGaussianScore(params, outputBand) {

  params = ee.Dictionary(params);

  var mean = ee.Array(
    params.get('mean')
  );

  var inverse = ee.Array(
    params.get('inverse')
  );

  var determinant = ee.Number(
    params.get('determinant')
  ).max(1e-300);

  // Convert parameters into constant array images.

  var meanImage = ee.Image.constant(mean);

  var inverseImage = ee.Image.constant(inverse);

  // Difference from the class mean.

  var difference = predictorColumn.subtract(
    meanImage
  );

  // Squared Mahalanobis distance.

  var distanceSquared = difference
    .arrayTranspose()
    .matrixMultiply(inverseImage)
    .matrixMultiply(difference)
    .arrayGet([0, 0]);

  // Covariance-volume penalty.

  var logDeterminant = ee.Image.constant(
    determinant.log()
  );

  // Full class-specific Gaussian discriminant.

  var score = distanceSquared
    .multiply(-0.5)
    .add(
      logDeterminant.multiply(-0.5)
    )
    .rename(outputBand);

  return score;

}


// ------------------------------------------------------------
// 9. CREATE ALL FIVE CLASS SCORES
// ------------------------------------------------------------

var score1 = makeGaussianScore(
  classParameters[0],
  'score_1'
);

var score2 = makeGaussianScore(
  classParameters[1],
  'score_2'
);

var score3 = makeGaussianScore(
  classParameters[2],
  'score_3'
);

var score4 = makeGaussianScore(
  classParameters[3],
  'score_4'
);

var score5 = makeGaussianScore(
  classParameters[4],
  'score_5'
);


// ------------------------------------------------------------
// 10. COMBINE THE GAUSSIAN SCORES
// ------------------------------------------------------------

var scoreStack = ee.Image.cat([
  score1,
  score2,
  score3,
  score4,
  score5
]);


// ------------------------------------------------------------
// 11. MAXIMUM LIKELIHOOD CLASSIFICATION
// ------------------------------------------------------------
//
// arrayArgmax() chooses the highest score.
//
// Array indices 0-4 are converted to class IDs 1-5.
//
// Output class codes:
//
// 1 Built-up
// 2 Vegetation
// 3 Water
// 4 Agricultural/Open
// 5 Barren/Fallow
// ------------------------------------------------------------

var classified2010 = scoreStack
  .toArray()
  .arrayArgmax()
  .arrayGet([0])
  .add(1)
  .rename('classification')
  .toInt8()
  .clip(roi);


// ------------------------------------------------------------
// 12. MAP VISUALIZATION
// ------------------------------------------------------------

Map.layers().reset();

Map.setOptions('TERRAIN');

Map.centerObject(roi, 10);

// Original 2010 Landsat composite.

Map.addLayer(
  stack2010,
  {
    bands: ['red', 'green', 'blue'],
    min: 0.02,
    max: 0.30
  },
  '2010 LANDSAT TRUE COLOUR',
  true
);

// Gaussian MLC output.
//
// Initially OFF to avoid unnecessary interactive
// computation while preparing the export.

Map.addLayer(
  classified2010,
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
  false
);

// Optional training point display.

Map.addLayer(
  training.style({
    color: 'FFFFFF',
    pointSize: 2
  }),
  {},
  '600 TRAINING PIXELS',
  false
);


// ------------------------------------------------------------
// 13. CREATE CLASSIFICATION EXPORT TASK
// ------------------------------------------------------------
//
// No old raster is overwritten.
//
// Important:
// Confirm training counts = 600, 120/class,
// and all regularized determinants are positive.
//
// Then start the export in GEE Tasks.
// ------------------------------------------------------------

Export.image.toAsset({

  image: classified2010,

  description:
    'Chennai_2010_manual_Gaussian_MLC_v1',

  assetId: OUTPUT_ASSET,

  region: roi,

  crs: CRS,

  scale: SCALE,

  maxPixels: 1e10,

  pyramidingPolicy: {
    '.default': 'mode'
  }

});


// ------------------------------------------------------------
// 14. STATUS
// ------------------------------------------------------------

print('========================================');
print('STAGE 07G — CLASSIFICATION TASK CREATED');
print('========================================');

print('Output raster asset:');
print(OUTPUT_ASSET);

print('Method: 9-band actual Gaussian MLC.');

print('Training: 600 balanced manual-reference points.');

print('Class priors: equal.');

print('Covariance regularization: 1e-6.');

print('No automated temporal label transfer.');

print('Validation accuracy not yet calculated.');

print('Area statistics not yet calculated.');

print('Previous V2C raster and training are untouched.');

print('========================================');
print('END STAGE 07G');
print('========================================');

// ============================================================
// END
// ============================================================

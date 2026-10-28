
// ============================================================
// CHENNAI LULC — STAGE 07H2
// SITE-HELD-OUT SPATIAL CROSS-VALIDATION
// VERSION 2 — COVARIANCE OUTPUT FIXED
//
// Method: Actual 9-band Gaussian Maximum Likelihood
// 5 folds, whole training sites held out
// No independent validation points used
// No model exports or training modifications
//
// FIX:
// ee.Reducer.covariance().setOutputs(['covariance'])
// ============================================================


// ------------------------------------------------------------
// 1. LOCKED PROJECT SETTINGS
// ------------------------------------------------------------

var ROOT = 'projects/assignment-482806/assets/';

var CRS = 'EPSG:32644';
var SCALE = 30;

var REG = 1e-6;
var NBANDS = 9;

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

var CLASS_ORDER = [1, 2, 3, 4, 5];

var projection = ee.Projection(CRS).atScale(SCALE);


// ------------------------------------------------------------
// 2. LOAD EXISTING MANUAL TRAINING ASSET
// ------------------------------------------------------------

var training = ee.FeatureCollection(
  ROOT + 'chennai_training_2010_manual_final_v1'
);

var stack = ee.Image(
  ROOT + 'chennai_predictor_stack_2010'
).select(BANDS);

var roi = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
).geometry();


// ------------------------------------------------------------
// 3. ASSIGN WHOLE SITES TO FIVE FOLDS
// ------------------------------------------------------------
//
// Each site belongs entirely to one fold.
// Pixels from the same site never appear in both
// fitting and testing within that fold.
//
// Classes with 6 sites:
// first and sixth sites share fold 0.
//
// Classes with 5 sites:
// one site in each fold.
// ------------------------------------------------------------

var GROUPS = [
  {prefix: 'BU', count: 6},
  {prefix: 'VG', count: 6},
  {prefix: 'WT', count: 5},
  {prefix: 'AG', count: 6},
  {prefix: 'B',  count: 5}
];

var foldMapping = {};

GROUPS.forEach(function(g) {

  for (var i = 1; i <= g.count; i++) {

    var suffix = ('0' + i).slice(-2);

    var siteID =
      g.prefix + '2010_' + suffix;

    foldMapping[siteID] = (i - 1) % 5;

  }

});

var foldLookup = ee.Dictionary(foldMapping);

var tagged = training.map(function(f) {

  f = ee.Feature(f);

  return f.set(
    'cv_fold',
    foldLookup.get(f.get('site_id'))
  );

});


// ------------------------------------------------------------
// 4. GAUSSIAN PARAMETER ESTIMATION
// ------------------------------------------------------------
//
// This section now matches the working
// covariance reducer naming used in Stage 07G.
//
// For each class:
//  - 9-dimensional mean vector
//  - 9x9 sample covariance matrix
//  - diagonal regularization 1e-6
//  - covariance determinant
//  - inverse covariance
// ------------------------------------------------------------

function parametersForClass(trainFC, classID) {

  var sub = trainFC.filter(
    ee.Filter.eq('class_id', classID)
  );

  // Nine class means.

  var meanValues = BANDS.map(function(b) {

    return sub.aggregate_mean(b);

  });

  // 9 x 1 mean vector.

  var meanArray = ee.Array([
    meanValues
  ]).transpose();

  // Convert predictor properties to array.

  var arrayFC = sub.makeArray(
    BANDS,
    'predictor_array_cv'
  );

  // CORRECTED COVARIANCE REDUCER.
  // Explicitly name the output "covariance".

  var covarianceResult = arrayFC.reduceColumns({

    reducer: ee.Reducer.covariance()
      .setOutputs(['covariance']),

    selectors: ['predictor_array_cv']

  });

  var rawCovariance = ee.Array(
    covarianceResult.get('covariance')
  );

  // Same regularization as Stage 07G.

  var regularizedCovariance =
    rawCovariance.add(
      ee.Array.identity(NBANDS)
        .multiply(REG)
    );

  var determinant =
    regularizedCovariance.matrixDeterminant();

  var inverse =
    regularizedCovariance.matrixInverse();

  return ee.Dictionary({

    class_id: classID,

    sample_count: sub.size(),

    mean: meanArray,

    inverse: inverse,

    determinant: determinant

  });

}


// ------------------------------------------------------------
// 5. GAUSSIAN LOG-LIKELIHOOD
// ------------------------------------------------------------
//
// score =
// -0.5 * log(determinant)
// -0.5 * Mahalanobis distance squared
//
// Equal prior probabilities.
// The shared Gaussian normalizing constant
// is omitted because it does not affect argmax.
// ------------------------------------------------------------

function gaussianScore(
  predictorColumn,
  params,
  outputBand
) {

  params = ee.Dictionary(params);

  var meanImage = ee.Image.constant(
    ee.Array(params.get('mean'))
  );

  var inverseImage = ee.Image.constant(
    ee.Array(params.get('inverse'))
  );

  var determinant = ee.Number(
    params.get('determinant')
  ).max(1e-300);

  var difference =
    predictorColumn.subtract(meanImage);

  var distanceSquared = difference
    .arrayTranspose()
    .matrixMultiply(inverseImage)
    .matrixMultiply(difference)
    .arrayGet([0, 0]);

  var logDeterminant =
    ee.Image.constant(determinant.log());

  var score = distanceSquared
    .multiply(-0.5)
    .subtract(
      logDeterminant.multiply(0.5)
    )
    .rename(outputBand);

  return score;

}


// ------------------------------------------------------------
// 6. CLASSIFIER BUILDER FOR EACH FOLD
// ------------------------------------------------------------

var predictorColumn = stack
  .toArray()
  .toArray(1);

function classifyFold(fitFC) {

  var scores = CLASS_ORDER.map(function(k) {

    var parameters = parametersForClass(
      fitFC,
      k
    );

    return gaussianScore(
      predictorColumn,
      parameters,
      'score_' + k
    );

  });

  return ee.Image.cat(scores)
    .toArray()
    .arrayArgmax()
    .arrayGet([0])
    .add(1)
    .rename('cv_prediction')
    .toInt8();

}


// ------------------------------------------------------------
// 7. EXECUTE FIVE SITE-HELD-OUT FOLDS
// ------------------------------------------------------------

var foldPredictions = [];
var foldSummaryRows = [];

for (var fold = 0; fold < 5; fold++) {

  var testFC = tagged.filter(
    ee.Filter.eq('cv_fold', fold)
  );

  var fitFC = tagged.filter(
    ee.Filter.neq('cv_fold', fold)
  );

  // Fit using other sites only.

  var cvImage = classifyFold(fitFC);

  // Predict at held-out site locations.

  var predictions = cvImage.sampleRegions({

    collection: testFC,

    properties: [
      'class_id',
      'site_id',
      'cv_fold'
    ],

    projection: projection,

    scale: SCALE,

    geometries: true,

    tileScale: 8

  });

  // Mark correct / incorrect predictions.

  predictions = predictions.map(function(f) {

    f = ee.Feature(f);

    var actual = ee.Number(
      f.get('class_id')
    );

    var predicted = ee.Number(
      f.get('cv_prediction')
    );

    return f.set(
      'correct',
      ee.Number(actual.eq(predicted)).int()
    );

  });

  foldPredictions.push(predictions);

  // Fold-level confusion matrix.

  var cm = predictions.errorMatrix(
    'class_id',
    'cv_prediction',
    CLASS_ORDER
  );

  foldSummaryRows.push(
    ee.Feature(null, {

      fold: fold,

      training_count: fitFC.size(),

      heldout_count: testFC.size(),

      predicted_count: predictions.size(),

      accuracy_percent:
        ee.Number(cm.accuracy()).multiply(100),

      kappa: cm.kappa()

    })
  );

}


// ------------------------------------------------------------
// 8. COMBINE FOLD RESULTS
// ------------------------------------------------------------

var allPredictions = ee.FeatureCollection(
  foldPredictions
).flatten();

var foldSummary = ee.FeatureCollection(
  foldSummaryRows
);

var overallMatrix = allPredictions.errorMatrix(
  'class_id',
  'cv_prediction',
  CLASS_ORDER
);


// ------------------------------------------------------------
// 9. GLOBAL DIAGNOSTICS
// ------------------------------------------------------------

print('========================================');
print('07H2 — 2010 SITE-HELD-OUT SPATIAL CV');
print('VERSION 2 — COVARIANCE FIXED');
print('========================================');

print('Original training count (expected 600):');
print(training.size());

print('Training counts by class:');
print(training.aggregate_histogram('class_id'));

print('Distinct source sites (expected 28):');
print(training.aggregate_count_distinct('site_id'));

print('Samples by assigned fold:');
print(tagged.aggregate_histogram('cv_fold'));

print('Held-out predictions (expected 600):');
print(allPredictions.size());


// ------------------------------------------------------------
// 10. FOLD-BY-FOLD PERFORMANCE
// ------------------------------------------------------------

print('========================================');
print('FIVE-FOLD RESULTS');
print('========================================');

print('Fold performance:');
print(foldSummary.sort('fold'));


// ------------------------------------------------------------
// 11. COMBINED HELD-OUT ACCURACY
// ------------------------------------------------------------

print('========================================');
print('COMBINED HELD-OUT PERFORMANCE');
print('========================================');

print('Confusion matrix:');
print(overallMatrix);

print('Overall held-out accuracy (%):');
print(
  ee.Number(overallMatrix.accuracy())
    .multiply(100)
);

print('Held-out Kappa:');
print(overallMatrix.kappa());

print('Producer accuracy:');
print(overallMatrix.producersAccuracy());

print('User accuracy:');
print(overallMatrix.consumersAccuracy());


// ------------------------------------------------------------
// 12. PER-SITE HELD-OUT PERFORMANCE
// ------------------------------------------------------------

var siteIDs = ee.List(
  tagged.aggregate_array('site_id')
).distinct().sort();

var siteResults = ee.FeatureCollection(
  siteIDs.map(function(id) {

    var sub = allPredictions.filter(
      ee.Filter.eq('site_id', id)
    );

    var correctCount = sub.filter(
      ee.Filter.eq('correct', 1)
    ).size();

    var totalCount = sub.size();

    return ee.Feature(null, {

      site_id: id,

      class_id: sub.first().get('class_id'),

      heldout_fold: sub.first().get('cv_fold'),

      total: totalCount,

      correct: correctCount,

      errors: totalCount.subtract(correctCount),

      accuracy_percent:
        ee.Number(correctCount)
          .divide(
            ee.Number(totalCount).max(1)
          )
          .multiply(100)

    });

  })
);

print('========================================');
print('SITE-HELD-OUT ACCURACY BY SITE');
print('========================================');

print(
  siteResults.sort('accuracy_percent')
);


// ------------------------------------------------------------
// 13. GENERALIZATION BY CLASS
// ------------------------------------------------------------

var classResults = ee.FeatureCollection(
  CLASS_ORDER.map(function(k) {

    var sub = allPredictions.filter(
      ee.Filter.eq('class_id', k)
    );

    var correctCount = sub.filter(
      ee.Filter.eq('correct', 1)
    ).size();

    return ee.Feature(null, {

      class_id: k,

      heldout_samples: sub.size(),

      correct_samples: correctCount,

      producer_accuracy_percent:
        ee.Number(correctCount)
          .divide(
            ee.Number(sub.size()).max(1)
          )
          .multiply(100)

    });

  })
);

print('========================================');
print('HELD-OUT GENERALIZATION BY CLASS');
print('========================================');

print(classResults);


// ------------------------------------------------------------
// 14. MAP — LIGHTWEIGHT REFERENCE DISPLAY
// ------------------------------------------------------------
//
// No cross-validation error layer is displayed
// automatically, reducing unnecessary computation.
// All numeric CV results are printed above.
// ------------------------------------------------------------

Map.layers().reset();

Map.setOptions('TERRAIN');
Map.centerObject(roi, 10);

Map.addLayer(
  stack,
  {
    bands: ['red', 'green', 'blue'],
    min: 0.02,
    max: 0.30
  },
  '2010 LANDSAT TRUE COLOUR',
  true
);

Map.addLayer(
  training.style({
    color: '00FFFF',
    pointSize: 2
  }),
  {},
  '600 TRAINING SAMPLES',
  false
);


// ------------------------------------------------------------
// 15. FINAL STATUS
// ------------------------------------------------------------

print('========================================');
print('07H2 — AUDIT ONLY');
print('========================================');

print('Corrected covariance dictionary output.');

print('No independent validation points used.');

print('No previous training labels changed.');

print('No training assets exported.');

print('No classification raster overwritten.');

print('========================================');
print('END OF STAGE 07H2');
print('========================================');

// ============================================================
// END STAGE 07H2 — VERSION 2
// ============================================================

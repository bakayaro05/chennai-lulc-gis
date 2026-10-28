
// ============================================================
// CHENNAI LULC — STAGE 07P
// LANDSAT 5+7 GAUSSIAN MLC — SITE-HELD-OUT VALIDATION
//
// READ-ONLY / NO EXPORTS / NO LABEL MODIFICATION
// 5 folds; all points from each site stay in one fold.
// Same fold assignment as Stage 07H2 (Landsat 5 only).
// Includes an integrity check of the exported L5+L7 raster.
// ============================================================

// 1. CONFIGURATION AND SAVED ASSETS

var ROOT = 'projects/assignment-482806/assets/';

var BANDS = [
  'blue', 'green', 'red', 'nir', 'swir1', 'swir2',
  'NDVI', 'NDWI', 'NDBI'
];

var CLASSES = [1, 2, 3, 4, 5];
var REGULARIZATION = 1e-6;
var SCALE = 30;

var train = ee.FeatureCollection(
  ROOT + 'chennai_training_2010_L5L7_manual_exp_v1'
);

var stack = ee.Image(
  ROOT + 'chennai_predictor_stack_2010_L5L7_exp_v1'
).select(BANDS);

var savedRaster = ee.Image(
  ROOT + 'chennai_mlc_lulc_2010_L5L7_manual_exp_v1'
).select('classification');

var reservedValidation = ee.FeatureCollection(
  ROOT + 'chennai_validation_2010_final'
);

var roi = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
).geometry();

var projection = stack.select('blue').projection();

print('===============================================');
print('STAGE 07P — L5+L7 SITE-HELD-OUT GAUSSIAN MLC');
print('===============================================');

print('Exported training pixels (expected 600):');
print(train.size());

print('Training counts (expected 120 per class):');
print(train.aggregate_histogram('class_id'));

print('Distinct training sites (expected 28):');
print(train.aggregate_count_distinct('site_id'));

print('Unique pixel keys (expected 600):');
print(train.aggregate_count_distinct('grid_key'));

print('Saved nine-band image projection:');
print(projection);

print('Nine-band order:');
print(stack.bandNames());


// ------------------------------------------------------------
// 2. ASSIGN SAME SITE GROUPS AS STAGE 07H2
// ------------------------------------------------------------
//
// For six-site classes, sites 01 and 06 go to fold 0.
// Five-site classes put one site into each fold.
// ------------------------------------------------------------

var GROUPS = [
  {prefix: 'BU', count: 6},
  {prefix: 'VG', count: 6},
  {prefix: 'WT', count: 5},
  {prefix: 'AG', count: 6},
  {prefix: 'B',  count: 5}
];

var siteFoldMap = {};

GROUPS.forEach(function(group) {

  for (var i = 1; i <= group.count; i++) {

    var siteID = group.prefix +
      '2010_' + ('0' + i).slice(-2);

    siteFoldMap[siteID] = (i - 1) % 5;

  }

});

var lookup = ee.Dictionary(siteFoldMap);

var tagged = train.map(function(f) {

  return ee.Feature(f).set(
    'cv_fold',
    lookup.get(f.get('site_id'))
  );

});

print('Fold membership (expected 168,108,108,108,108):');
print(tagged.aggregate_histogram('cv_fold'));

print('Unassigned fold values (expected 0):');
print(
  tagged.size().subtract(
    tagged.filter(
      ee.Filter.notNull(['cv_fold'])
    ).size()
  )
);


// ------------------------------------------------------------
// 3. ESTIMATE CLASS GAUSSIANS FROM FITTING SITES ONLY
// ------------------------------------------------------------

function gaussianParameters(fitFC, classID) {

  var subset = fitFC.filter(
    ee.Filter.eq('class_id', classID)
  );

  var meanValues = BANDS.map(function(b) {
    return subset.aggregate_mean(b);
  });

  var meanColumn = ee.Array([
    meanValues
  ]).transpose();

  var withArray = subset.makeArray(
    BANDS,
    'cv_input_array'
  );

  var covarianceResult = withArray.reduceColumns({

    reducer: ee.Reducer.covariance()
      .setOutputs(['covariance']),

    selectors: ['cv_input_array']

  });

  var covariance = ee.Array(
    covarianceResult.get('covariance')
  ).add(
    ee.Array.identity(BANDS.length)
      .multiply(REGULARIZATION)
  );

  return ee.Dictionary({

    class_id: classID,

    count: subset.size(),

    mean: meanColumn,

    determinant: covariance.matrixDeterminant(),

    inverse: covariance.matrixInverse()

  });

}


// ------------------------------------------------------------
// 4. SAME GAUSSIAN MLC FORMULA AS STAGES 07G AND 07N
// ------------------------------------------------------------

var pixelColumn = stack
  .toArray()
  .toArray(1);

function gaussianLogScore(parameters, name) {

  var p = ee.Dictionary(parameters);

  var mu = ee.Image.constant(
    ee.Array(p.get('mean'))
  );

  var inv = ee.Image.constant(
    ee.Array(p.get('inverse'))
  );

  var determinant = ee.Number(
    p.get('determinant')
  ).max(1e-300);

  var difference = pixelColumn.subtract(mu);

  var distanceSquared = difference
    .arrayTranspose()
    .matrixMultiply(inv)
    .matrixMultiply(difference)
    .arrayGet([0, 0]);

  return distanceSquared
    .multiply(-0.5)
    .subtract(
      ee.Image.constant(
        determinant.log()
      ).multiply(0.5)
    )
    .rename(name);

}

function classifyFold(foldParameters) {

  var scores = CLASSES.map(function(k) {

    return gaussianLogScore(
      foldParameters[k - 1],
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
// 5. EXECUTE FIVE FOLDS WITH ENTIRE SITES HELD OUT
// ------------------------------------------------------------

var predictionsList = [];
var foldRows = [];
var parameterRows = [];

for (var fold = 0; fold < 5; fold++) {

  var fitFC = tagged.filter(
    ee.Filter.neq('cv_fold', fold)
  );

  var testFC = tagged.filter(
    ee.Filter.eq('cv_fold', fold)
  );

  // Fit once per class using the other sites.

  var foldParameters = CLASSES.map(function(k) {
    return gaussianParameters(fitFC, k);
  });

  // Covariance QA for every fold and class.

  CLASSES.forEach(function(k) {

    var p = ee.Dictionary(
      foldParameters[k - 1]
    );

    var det = ee.Number(
      p.get('determinant')
    );

    parameterRows.push(
      ee.Feature(null, {

        fold: fold,

        class_id: k,

        fitting_count: p.get('count'),

        regularized_determinant: det,

        determinant_positive: det.gt(0)

      })
    );

  });

  var foldMap = classifyFold(foldParameters);

  // Predict only the sites excluded from model fitting.

  var predictions = foldMap.sampleRegions({

    collection: testFC,

    properties: [
      'class_id',
      'site_id',
      'cv_fold',
      'grid_key'
    ],

    projection: projection,

    scale: SCALE,

    geometries: false,

    tileScale: 8

  }).map(function(f) {

    var reference = ee.Number(
      f.get('class_id')
    );

    var predicted = ee.Number(
      f.get('cv_prediction')
    );

    return ee.Feature(f).set({

      correct: ee.Number(
        reference.eq(predicted)
      ).int(),

      transition: reference.format('%d')
        .cat('_to_')
        .cat(predicted.format('%d'))

    });

  });

  predictionsList.push(predictions);

  var matrix = predictions.errorMatrix(
    'class_id',
    'cv_prediction',
    CLASSES
  );

  foldRows.push(
    ee.Feature(null, {

      fold: fold,

      fitting_count: fitFC.size(),

      heldout_count: testFC.size(),

      predicted_count: predictions.size(),

      accuracy_percent:
        ee.Number(matrix.accuracy()).multiply(100),

      kappa: matrix.kappa()

    })
  );

}

var allPredictions = ee.FeatureCollection(
  predictionsList
).flatten();

var foldSummary = ee.FeatureCollection(
  foldRows
);

var covarianceQA = ee.FeatureCollection(
  parameterRows
);

var combinedMatrix = allPredictions.errorMatrix(
  'class_id',
  'cv_prediction',
  CLASSES
);


// ------------------------------------------------------------
// 6. GLOBAL FOLD AND PARAMETER QA
// ------------------------------------------------------------

print('===============================================');
print('FOLD AND COVARIANCE QA');
print('===============================================');

print('Held-out predictions (expected 600):');
print(allPredictions.size());

print('Unique held-out grid keys (expected 600):');
print(
  allPredictions.aggregate_count_distinct('grid_key')
);

print('Covariance checks (25 rows, positive = 1):');
print(covarianceQA.sort('fold'));

print('Non-positive covariance determinants (expected 0):');
print(
  covarianceQA.filter(
    ee.Filter.eq('determinant_positive', 0)
  ).size()
);

print('Fold-by-fold summary:');
print(foldSummary.sort('fold'));


// ------------------------------------------------------------
// 7. COMBINED CROSS-VALIDATION ACCURACY
// ------------------------------------------------------------

print('===============================================');
print('L5+L7 COMBINED SITE-HELD-OUT ACCURACY');
print('===============================================');

print('Confusion matrix:');
print('Rows = reference, columns = predicted, order 1-5.');

print(combinedMatrix);

print('Overall site-held-out accuracy (%):');
print(
  ee.Number(combinedMatrix.accuracy())
    .multiply(100)
);

print('Kappa:');
print(combinedMatrix.kappa());

print('Producer accuracies:');
print(combinedMatrix.producersAccuracy());

print('User accuracies:');
print(combinedMatrix.consumersAccuracy());


// ------------------------------------------------------------
// 8. CLASS-WISE AND SITE-WISE ACCURACY
// ------------------------------------------------------------

var classSummary = ee.FeatureCollection(
  CLASSES.map(function(k) {

    var subset = allPredictions.filter(
      ee.Filter.eq('class_id', k)
    );

    var correct = subset.filter(
      ee.Filter.eq('correct', 1)
    ).size();

    return ee.Feature(null, {

      class_id: k,

      heldout_count: subset.size(),

      correct: correct,

      producer_accuracy_percent:
        ee.Number(correct)
          .divide(
            ee.Number(subset.size()).max(1)
          )
          .multiply(100)

    });

  })
);

var siteIDs = ee.List(
  tagged.aggregate_array('site_id')
).distinct().sort();

var siteSummary = ee.FeatureCollection(
  siteIDs.map(function(id) {

    var subset = allPredictions.filter(
      ee.Filter.eq('site_id', id)
    );

    var correct = subset.filter(
      ee.Filter.eq('correct', 1)
    ).size();

    var total = subset.size();

    return ee.Feature(null, {

      site_id: id,

      class_id: subset.first().get('class_id'),

      fold: subset.first().get('cv_fold'),

      heldout_count: total,

      correct: correct,

      accuracy_percent:
        ee.Number(correct)
          .divide(
            ee.Number(total).max(1)
          )
          .multiply(100)

    });

  })
);

print('===============================================');
print('L5+L7 HELD-OUT ACCURACY BY CLASS');
print('===============================================');

print(classSummary.sort('class_id'));

print('===============================================');
print('L5+L7 HELD-OUT ACCURACY BY SITE');
print('===============================================');

print(siteSummary.sort('accuracy_percent'));


// ------------------------------------------------------------
// 9. AGRICULTURAL VS VACANT/OPEN CONFUSION
// ------------------------------------------------------------
//
// Class 4 = agricultural or agriculturally identifiable
// Class 5 = unused vacant/open, green patches permitted
// ------------------------------------------------------------

var vacant = allPredictions.filter(
  ee.Filter.eq('class_id', 5)
);

var agriculture = allPredictions.filter(
  ee.Filter.eq('class_id', 4)
);

print('===============================================');
print('CRITICAL CLASS 4 / CLASS 5 GENERALIZATION');
print('===============================================');

print('Held-out Vacant/Open total (expected 120):');
print(vacant.size());

print('Class 5 correctly predicted as Vacant/Open:');
print(
  vacant.filter(
    ee.Filter.eq('cv_prediction', 5)
  ).size()
);

print('Class 5 misclassified as Agricultural:');
print(
  vacant.filter(
    ee.Filter.eq('cv_prediction', 4)
  ).size()
);

print('Held-out Agricultural total (expected 120):');
print(agriculture.size());

print('Class 4 correctly predicted as Agricultural:');
print(
  agriculture.filter(
    ee.Filter.eq('cv_prediction', 4)
  ).size()
);

print('Class 4 misclassified as Vacant/Open:');
print(
  agriculture.filter(
    ee.Filter.eq('cv_prediction', 5)
  ).size()
);

print('Complete held-out error transitions:');
print(
  allPredictions.filter(
    ee.Filter.eq('correct', 0)
  ).aggregate_histogram('transition')
);


// ------------------------------------------------------------
// 10. VERIFY SAVED RASTER AGAINST STAGE 07N
// ------------------------------------------------------------
//
// Checks whether the exported raster reproduces
// the already-observed 300-point validation result.
//
// This is NOT a fresh independent assessment.
// These points are NOT used in cross-validation fitting.
// ------------------------------------------------------------

var savedVal = savedRaster.sampleRegions({

  collection: reservedValidation,

  properties: ['class_id'],

  projection: projection,

  scale: SCALE,

  geometries: false,

  tileScale: 8

});

var savedCM = savedVal.errorMatrix(
  'class_id',
  'classification',
  CLASSES
);

print('===============================================');
print('EXPORTED RASTER INTEGRITY CHECK');
print('===============================================');

print('Saved raster validation predictions (expected 300):');
print(savedVal.size());

print('Saved raster confusion matrix (should match 07N):');
print(savedCM);

print('Saved raster accuracy (expected 69.3333%):');
print(
  ee.Number(savedCM.accuracy())
    .multiply(100)
);

print('Saved raster kappa (expected 0.616667):');
print(savedCM.kappa());


// ------------------------------------------------------------
// 11. BASELINE COMPARISON AND STATUS
// ------------------------------------------------------------

print('===============================================');
print('ORIGINAL L5-ONLY SITE-HELD-OUT BENCHMARK');
print('===============================================');

print('L5-only CV overall accuracy: 64.6667%.');
print('L5-only CV kappa: 0.558333.');

print('L5-only CV Class 1: 85.83%.');
print('L5-only CV Class 2: 51.67%.');
print('L5-only CV Class 3: 90.00%.');
print('L5-only CV Class 4: 48.33%.');
print('L5-only CV Class 5: 47.50%.');

print('Compare with L5+L7 CV results above.');

print('No reference labels modified.');
print('No independent validation data used for CV fitting.');
print('No classification or training asset exported.');
print('No existing assets overwritten.');

print('===============================================');
print('END STAGE 07P');
print('===============================================');

// ============================================================
// END
// ============================================================

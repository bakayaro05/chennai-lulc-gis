// ======================================================
// CHENNAI MULTI-TEMPORAL LULC PROJECT
// SCRIPT 04J
//
// 2015 ACTUAL GAUSSIAN MAXIMUM LIKELIHOOD
// CLASSIFICATION
// ======================================================
//
// MANUAL GAUSSIAN MLC:
//
// class mean vector
// sample covariance matrix
// diagonal regularization = 1e-6
// covariance determinant
// covariance inverse
// Gaussian log likelihood
// equal priors
//
// ======================================================


// ======================================================
// 1. SETTINGS
// ======================================================

var CRS =
  'EPSG:32644';

var SCALE =
  30;

var REGULARIZATION =
  1e-6;

var CLASS_COUNT =
  5;

var PRIOR =
  1 / CLASS_COUNT;


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


var D =
  BANDS.length;


// ======================================================
// 2. ASSETS
// ======================================================

var ROI_ASSET =
  'projects/assignment-482806/assets/chennai_admin_study_area_clean';


var TRAINING_ASSET =
  'projects/assignment-482806/assets/chennai_training_2015_final';


var VALIDATION_ASSET =
  'projects/assignment-482806/assets/chennai_validation_2015_final';


var CLASSIFICATION_ASSET =
  'projects/assignment-482806/assets/chennai_mlc_lulc_2015';


// ======================================================
// 3. LOAD DATA
// ======================================================

var roi =
  ee.FeatureCollection(
    ROI_ASSET
  )
  .geometry();


var finalTraining2015 =
  ee.FeatureCollection(
    TRAINING_ASSET
  );


var finalValidation2015 =
  ee.FeatureCollection(
    VALIDATION_ASSET
  );


// ======================================================
// 4. ASSET QA
// ======================================================

print('========================================');
print('2015 MLC INPUT QA');
print('========================================');

print(
  'Training count:',
  finalTraining2015.size()
);

print(
  'Training by class:',
  finalTraining2015.aggregate_histogram(
    'class_name'
  )
);

print(
  'Validation count:',
  finalValidation2015.size()
);

print(
  'Validation by class:',
  finalValidation2015.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 5. LANDSAT 8 PREPROCESSING
// ======================================================

function preprocessL8(image) {

  var qa =
    image.select('QA_PIXEL');

  var radsat =
    image.select('QA_RADSAT');


  var mask =
    qa.bitwiseAnd(1 << 0).eq(0)
      .and(qa.bitwiseAnd(1 << 1).eq(0))
      .and(qa.bitwiseAnd(1 << 2).eq(0))
      .and(qa.bitwiseAnd(1 << 3).eq(0))
      .and(qa.bitwiseAnd(1 << 4).eq(0))
      .and(qa.bitwiseAnd(1 << 5).eq(0))
      .and(radsat.eq(0));


  var optical =
    image.select(
      [
        'SR_B2',
        'SR_B3',
        'SR_B4',
        'SR_B5',
        'SR_B6',
        'SR_B7'
      ],
      [
        'blue',
        'green',
        'red',
        'nir',
        'swir1',
        'swir2'
      ]
    )
    .multiply(0.0000275)
    .add(-0.2);


  return optical.updateMask(mask);
}


// ======================================================
// 6. INDICES
// ======================================================

function addIndices(image) {

  var green =
    image.select('green');

  var red =
    image.select('red');

  var nir =
    image.select('nir');

  var swir1 =
    image.select('swir1');


  var ndvi =
    nir.subtract(red)
      .divide(nir.add(red))
      .rename('NDVI');


  var ndwi =
    green.subtract(nir)
      .divide(green.add(nir))
      .rename('NDWI');


  var ndbi =
    swir1.subtract(nir)
      .divide(swir1.add(nir))
      .rename('NDBI');


  return image.addBands([
    ndvi,
    ndwi,
    ndbi
  ]);
}


// ======================================================
// 7. BUILD 2015 STACK
// ======================================================

var landsat2015 =
  ee.ImageCollection(
    'LANDSAT/LC08/C02/T1_L2'
  )
  .filterBounds(roi)
  .filterDate(
    '2015-01-01',
    '2016-01-01'
  )
  .map(preprocessL8);


var stack2015 =
  addIndices(
    landsat2015
      .median()
      .clip(roi)
  )
  .select(BANDS)
  .clip(roi);


print(
  '2015 Landsat scene count:',
  landsat2015.size()
);

print(
  'Predictor bands:',
  stack2015.bandNames()
);


// ======================================================
// 8. BUILD CLASS PARAMETERS
// ======================================================

function buildClassParameters(
  classId,
  className
) {

  var samples =
    finalTraining2015.filter(
      ee.Filter.eq(
        'class_id',
        classId
      )
    );


  var n =
    ee.Number(
      samples.size()
    );


  // ----------------------------------------------------
  // Mean vector
  // ----------------------------------------------------

  var meansJS = [];


  BANDS.forEach(
    function(band) {

      meansJS.push(
        samples.aggregate_mean(
          band
        )
      );

    }
  );


  var means =
    ee.List(
      meansJS
    );


  // ----------------------------------------------------
  // Sample covariance matrix
  // denominator = n - 1
  // ----------------------------------------------------

  var rows = [];


  for (
    var i = 0;
    i < D;
    i++
  ) {

    var row = [];


    for (
      var j = 0;
      j < D;
      j++
    ) {

      var bandI =
        BANDS[i];

      var bandJ =
        BANDS[j];


      var meanI =
        ee.Number(
          means.get(i)
        );

      var meanJ =
        ee.Number(
          means.get(j)
        );


      var products =
        samples.map(
          function(feature) {

            var xi =
              ee.Number(
                feature.get(
                  bandI
                )
              );


            var xj =
              ee.Number(
                feature.get(
                  bandJ
                )
              );


            return feature.set(

              '_cov_product',

              xi
                .subtract(meanI)
                .multiply(
                  xj.subtract(
                    meanJ
                  )
                )

            );

          }
        );


      var covariance =
        ee.Number(
          products.aggregate_sum(
            '_cov_product'
          )
        )
        .divide(
          n.subtract(1)
        );


      // diagonal regularization

      if (i === j) {

        covariance =
          covariance.add(
            REGULARIZATION
          );

      }


      row.push(
        covariance
      );

    }


    rows.push(
      row
    );

  }


  var covarianceMatrix =
    ee.Array(
      rows
    );


  var determinant =
    ee.Number(
      covarianceMatrix
        .matrixDeterminant()
    );


  var inverse =
    covarianceMatrix
      .matrixInverse();


  return {

    classId:
      classId,

    className:
      className,

    sampleCount:
      n,

    means:
      means,

    covariance:
      covarianceMatrix,

    determinant:
      determinant,

    inverse:
      inverse

  };

}


// ======================================================
// 9. CLASS PARAMETERS
// ======================================================

var p1 =
  buildClassParameters(
    1,
    'Built-up'
  );


var p2 =
  buildClassParameters(
    2,
    'Vegetation'
  );


var p3 =
  buildClassParameters(
    3,
    'Water'
  );


var p4 =
  buildClassParameters(
    4,
    'Agricultural/Open'
  );


var p5 =
  buildClassParameters(
    5,
    'Barren/Fallow'
  );


var PARAMETERS = [
  p1,
  p2,
  p3,
  p4,
  p5
];


// ======================================================
// 10. COVARIANCE QA
// ======================================================

print('========================================');
print('2015 COVARIANCE QA');
print('========================================');


PARAMETERS.forEach(
  function(p) {

    print(
      p.className + ' n:',
      p.sampleCount
    );

    print(
      p.className + ' determinant:',
      p.determinant
    );

    print(
      p.className + ' covariance:',
      p.covariance
    );

  }
);


// ======================================================
// 11. GAUSSIAN LOG LIKELIHOOD
// ======================================================

function gaussianLogLikelihood(
  image,
  params
) {

  var quadratic =
    ee.Image.constant(0);


  var differences =
    [];


  for (
    var i = 0;
    i < D;
    i++
  ) {

    differences.push(

      image
        .select(
          BANDS[i]
        )
        .subtract(
          ee.Number(
            params.means.get(i)
          )
        )

    );

  }


  // d' * Sigma^-1 * d

  for (
    var r = 0;
    r < D;
    r++
  ) {

    for (
      var c = 0;
      c < D;
      c++
    ) {

      var inverseElement =
        ee.Number(
          params.inverse.get(
            [r, c]
          )
        );


      quadratic =
        quadratic.add(

          differences[r]
            .multiply(
              differences[c]
            )
            .multiply(
              inverseElement
            )

        );

    }

  }


  var constantTerm =
    ee.Number(D)
      .multiply(
        Math.log(
          2 * Math.PI
        )
      );


  var logDet =
    params.determinant.log();


  var logPrior =
    ee.Number(PRIOR).log();


  var likelihood =
    quadratic
      .add(logDet)
      .add(constantTerm)
      .multiply(-0.5)
      .add(logPrior)
      .rename(
        'LL_' + params.classId
      );


  return likelihood;

}


// ======================================================
// 12. CALCULATE FIVE CLASS LIKELIHOODS
// ======================================================

var ll1 =
  gaussianLogLikelihood(
    stack2015,
    p1
  );


var ll2 =
  gaussianLogLikelihood(
    stack2015,
    p2
  );


var ll3 =
  gaussianLogLikelihood(
    stack2015,
    p3
  );


var ll4 =
  gaussianLogLikelihood(
    stack2015,
    p4
  );


var ll5 =
  gaussianLogLikelihood(
    stack2015,
    p5
  );


var likelihoodStack =
  ee.Image.cat([
    ll1,
    ll2,
    ll3,
    ll4,
    ll5
  ]);


// ======================================================
// 13. ARGMAX -> CLASS 1..5
// ======================================================

var classification2015 =
  likelihoodStack
    .toArray()
    .arrayArgmax()
    .arrayGet([0])
    .add(1)
    .toByte()
    .rename('classification')
    .clip(roi);


// ======================================================
// 14. VALIDATION PREDICTIONS
// ======================================================

var validationPredictions2015 =
  classification2015.sampleRegions({

    collection:
      finalValidation2015,

    properties: [
      'class_id',
      'class_name',
      'val_poly_id',
      'source'
    ],

    scale:
      SCALE,

    projection:
      ee.Projection(CRS),

    geometries:
      true,

    tileScale:
      16
  });


// ======================================================
// 15. CONFUSION MATRIX
// ======================================================

var confusion =
  validationPredictions2015.errorMatrix(
    'class_id',
    'classification',
    [1, 2, 3, 4, 5]
  );


print('========================================');
print('2015 GAUSSIAN MLC ACCURACY');
print('========================================');


print(
  'Confusion matrix:',
  confusion
);


print(
  'Overall accuracy:',
  confusion.accuracy()
);


print(
  'Kappa:',
  confusion.kappa()
);


print(
  'Producer accuracy:',
  confusion.producersAccuracy()
);


print(
  'User accuracy:',
  confusion.consumersAccuracy()
);


// ======================================================
// 16. CORRECT / INCORRECT COUNTS
// ======================================================

var correctPredictions =
  validationPredictions2015.filter(

    ee.Filter.equals({
      leftField:
        'class_id',

      rightField:
        'classification'
    })

  );


var correct =
  correctPredictions.size();


var total =
  validationPredictions2015.size();


var incorrect =
  total.subtract(
    correct
  );


print(
  'Validation predictions:',
  total
);


print(
  'Correct:',
  correct
);


print(
  'Incorrect:',
  incorrect
);


// ======================================================
// 17. ACCURACY SUMMARY FEATURE
// ======================================================

var accuracySummary =
  ee.FeatureCollection([

    ee.Feature(
      null,
      {

        year:
          2015,

        classifier:
          'Gaussian Maximum Likelihood',

        validation_n:
          total,

        correct:
          correct,

        incorrect:
          incorrect,

        overall_accuracy:
          confusion.accuracy(),

        kappa:
          confusion.kappa(),

        confusion_matrix:
          confusion.array().toList(),

        producer_accuracy:
          confusion
            .producersAccuracy()
            .toList(),

        user_accuracy:
          confusion
            .consumersAccuracy()
            .toList()

      }
    )

  ]);


// ======================================================
// 18. MAP
// ======================================================

var palette = [
  'red',
  '00a000',
  '0000ff',
  'ffff00',
  'c2a26b'
];


Map.layers().reset();


Map.addLayer(
  classification2015,
  {
    min: 1,
    max: 5,
    palette: palette
  },
  '2015 GAUSSIAN MLC',
  true
);


Map.centerObject(
  roi,
  10
);


// ======================================================
// 19. EXPORT CLASSIFICATION TO ASSET
// ======================================================

Export.image.toAsset({

  image:
    classification2015,

  description:
    'chennai_mlc_lulc_2015',

  assetId:
    CLASSIFICATION_ASSET,

  region:
    roi,

  scale:
    SCALE,

  crs:
    CRS,

  maxPixels:
    1e13,

  pyramidingPolicy: {
    '.default': 'mode'
  }
});


// ======================================================
// 20. DRIVE CLASSIFICATION BACKUP
// ======================================================

Export.image.toDrive({

  image:
    classification2015,

  description:
    'chennai_mlc_lulc_2015',

  fileNamePrefix:
    'chennai_mlc_lulc_2015',

  region:
    roi,

  scale:
    SCALE,

  crs:
    CRS,

  maxPixels:
    1e13,

  fileFormat:
    'GeoTIFF'
});


// ======================================================
// 21. EXPORT VALIDATION PREDICTIONS
// ======================================================

Export.table.toDrive({

  collection:
    validationPredictions2015,

  description:
    'chennai_validation_predictions_2015',

  fileNamePrefix:
    'chennai_validation_predictions_2015',

  fileFormat:
    'CSV'
});


// ======================================================
// 22. EXPORT ACCURACY SUMMARY
// ======================================================

Export.table.toDrive({

  collection:
    accuracySummary,

  description:
    'chennai_mlc_accuracy_2015',

  fileNamePrefix:
    'chennai_mlc_accuracy_2015',

  fileFormat:
    'CSV'
});


// ======================================================
// 23. END
// ======================================================

print('========================================');
print('2015 GAUSSIAN MLC COMPLETE');
print('========================================');

print(
  'Review confusion matrix / OA / Kappa.'
);

print(
  'Do NOT tune training from validation.'
);

print(
  'Run chennai_mlc_lulc_2015 ASSET export.'
);

print(
  'Wait until classification asset export is COMPLETED before area statistics.'
);

print(
  CLASSIFICATION_ASSET
);
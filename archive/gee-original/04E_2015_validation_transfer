// ======================================================
// CHENNAI MULTI-TEMPORAL LULC PROJECT
// SCRIPT 04E
//
// 2020 -> 2015 INDEPENDENT VALIDATION TRANSFER
// ======================================================
//
// TRAINING IS NOW LOCKED.
//
// finalTraining2015:
//
// 600 pixels
// 120/class
//
// THIS SCRIPT:
//
// 1. Loads finalTraining2015.
// 2. Rebuilds 2020 training-derived temporal references.
// 3. Screens independent 2020 validation groups in 2015.
// 4. Builds likely-stable validation candidate pixels.
// 5. Applies the LOCKED 30 m training exclusion.
// 6. Reports remaining validation counts.
// 7. Identifies validation groups requiring manual review.
//
// IMPORTANT:
//
// Validation does NOT alter training.
// Validation does NOT create class reference signatures.
// Do NOT run MLC yet.
//
// ======================================================


// ======================================================
// 1. SETTINGS
// ======================================================

var ANALYSIS_CRS =
  'EPSG:32644';


var ANALYSIS_SCALE =
  30;


var VALIDATION_TARGET =
  60;


var PREDICTOR_BANDS = [

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


// ======================================================
// 2. ASSETS
// ======================================================

var ROI_ASSET =
  'projects/assignment-482806/assets/chennai_admin_study_area_clean';


var TRAINING_2020_ASSET =
  'projects/assignment-482806/assets/chennai_training_2020_final';


var VALIDATION_2020_ASSET =
  'projects/assignment-482806/assets/chennai_validation_2020_final';


var TRAINING_2015_ASSET =
  'projects/assignment-482806/assets/chennai_training_2015_final';


// ======================================================
// 3. PRINT HELPER
// ======================================================

function show(label, value) {

  print(label);

  print(value);

}


// ======================================================
// 4. LOAD DATA
// ======================================================

var studyArea =
  ee.FeatureCollection(
    ROI_ASSET
  );


var roi =
  studyArea.geometry();


var finalTraining2020 =
  ee.FeatureCollection(
    TRAINING_2020_ASSET
  );


var finalValidation2020 =
  ee.FeatureCollection(
    VALIDATION_2020_ASSET
  );


var finalTraining2015 =
  ee.FeatureCollection(
    TRAINING_2015_ASSET
  );


// ======================================================
// 5. FINAL 2015 TRAINING QA
// ======================================================

print(
  '========================================'
);

print(
  'FINAL 2015 TRAINING ASSET QA'
);

print(
  '========================================'
);


show(
  'Training count:',
  finalTraining2015.size()
);


show(
  'Training by class:',
  finalTraining2015.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 6. LANDSAT PREPROCESSING
// ======================================================

function preprocessL8(image) {

  var qa =
    image.select(
      'QA_PIXEL'
    );


  var radsat =
    image.select(
      'QA_RADSAT'
    );


  var mask =
    qa.bitwiseAnd(
      1 << 0
    )
    .eq(0)

    .and(
      qa.bitwiseAnd(
        1 << 1
      ).eq(0)
    )

    .and(
      qa.bitwiseAnd(
        1 << 2
      ).eq(0)
    )

    .and(
      qa.bitwiseAnd(
        1 << 3
      ).eq(0)
    )

    .and(
      qa.bitwiseAnd(
        1 << 4
      ).eq(0)
    )

    .and(
      qa.bitwiseAnd(
        1 << 5
      ).eq(0)
    )

    .and(
      radsat.eq(0)
    );


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

    .multiply(
      0.0000275
    )

    .add(
      -0.2
    );


  return optical.updateMask(
    mask
  );

}


// ======================================================
// 7. INDICES
// ======================================================

function addIndices(image) {

  var green =
    image.select(
      'green'
    );


  var red =
    image.select(
      'red'
    );


  var nir =
    image.select(
      'nir'
    );


  var swir1 =
    image.select(
      'swir1'
    );


  var ndvi =
    nir.subtract(
      red
    )

    .divide(
      nir.add(
        red
      )
    )

    .rename(
      'NDVI'
    );


  var ndwi =
    green.subtract(
      nir
    )

    .divide(
      green.add(
        nir
      )
    )

    .rename(
      'NDWI'
    );


  var ndbi =
    swir1.subtract(
      nir
    )

    .divide(
      swir1.add(
        nir
      )
    )

    .rename(
      'NDBI'
    );


  return image.addBands([

    ndvi,

    ndwi,

    ndbi

  ]);

}


// ======================================================
// 8. BUILD 2015 STACK
// ======================================================

var landsat2015 =
  ee.ImageCollection(
    'LANDSAT/LC08/C02/T1_L2'
  )

  .filterBounds(
    roi
  )

  .filterDate(
    '2015-01-01',
    '2016-01-01'
  )

  .map(
    preprocessL8
  );


var stack2015 =
  addIndices(

    landsat2015
      .median()
      .clip(
        roi
      )

  )

  .select(
    PREDICTOR_BANDS
  );


// ======================================================
// 9. BUILD 2020 STACK
// ======================================================

var landsat2020 =
  ee.ImageCollection(
    'LANDSAT/LC08/C02/T1_L2'
  )

  .filterBounds(
    roi
  )

  .filterDate(
    '2020-01-01',
    '2021-01-01'
  )

  .map(
    preprocessL8
  );


var stack2020 =
  addIndices(

    landsat2020
      .median()
      .clip(
        roi
      )

  )

  .select(
    PREDICTOR_BANDS
  );


// ======================================================
// 10. TEMPORAL BAND NAMES
// ======================================================

var bands2020 =
  PREDICTOR_BANDS.map(
    function(name) {

      return 'y2020_' + name;

    }
  );


var bands2015 =
  PREDICTOR_BANDS.map(
    function(name) {

      return 'y2015_' + name;

    }
  );


var temporalProperties =
  bands2020.concat(
    bands2015
  );


var temporalStack =
  stack2020

    .rename(
      bands2020
    )

    .addBands(

      stack2015.rename(
        bands2015
      )

    );


// ======================================================
// 11. SAMPLE TEMPORAL STACK AT 2020 TRAINING LOCATIONS
// ======================================================

var trainingTemporal =
  temporalStack.sampleRegions({

    collection:
      finalTraining2020,

    properties: [

      'class_id',

      'class_name',

      'poly_id'

    ],

    scale:
      ANALYSIS_SCALE,

    projection:
      ee.Projection(
        ANALYSIS_CRS
      ),

    geometries:
      false,

    tileScale:
      16

  })

  .filter(

    ee.Filter.notNull(
      temporalProperties
    )

  );


// ======================================================
// 12. TRAINING SOURCE IDS
// ======================================================

var trainingIds =
  ee.List(

    trainingTemporal.aggregate_array(
      'poly_id'
    )

  )

  .distinct()

  .sort();


// ======================================================
// 13. SUMMARIZE TRAINING GROUP
// ======================================================

function summarizeTrainingGroup(polyId) {

  polyId =
    ee.Number(
      polyId
    );


  var group =
    trainingTemporal.filter(

      ee.Filter.eq(
        'poly_id',
        polyId
      )

    );


  var first =
    ee.Feature(
      group.first()
    );


  var output =
    ee.Feature(

      null,

      {

        poly_id:
          polyId,

        class_id:
          first.get(
            'class_id'
          ),

        class_name:
          first.get(
            'class_name'
          )

      }

    );


  temporalProperties.forEach(
    function(propertyName) {

      output =
        output.set(

          propertyName,

          group.aggregate_mean(
            propertyName
          )

        );

    }
  );


  return output;

}


var trainingGroupStats =
  ee.FeatureCollection(

    trainingIds.map(
      summarizeTrainingGroup
    )

  );


// ======================================================
// 14. SAFE SD
// ======================================================

function safeSd(value) {

  return ee.Number(

    ee.Algorithms.If(

      ee.Algorithms.IsEqual(
        value,
        null
      ),

      0.000001,

      value

    )

  )

  .max(
    0.000001
  );

}


// ======================================================
// 15. BUILD TRAINING-DERIVED 2020 REFERENCE
// ======================================================

function buildReference(
  classId,
  className
) {

  var subset =
    trainingGroupStats.filter(

      ee.Filter.eq(
        'class_id',
        classId
      )

    );


  var reference =
    ee.Dictionary({

      class_id:
        classId,

      class_name:
        className

    });


  PREDICTOR_BANDS.forEach(
    function(bandName) {

      var propertyName =
        'y2020_' + bandName;


      reference =
        reference

          .set(

            bandName + '_mean',

            subset.aggregate_mean(
              propertyName
            )

          )

          .set(

            bandName + '_sd',

            safeSd(

              subset.aggregate_sample_sd(
                propertyName
              )

            )

          );

    }
  );


  return reference;

}


var references =
  ee.List([

    buildReference(
      1,
      'Built-up'
    ),

    buildReference(
      2,
      'Vegetation'
    ),

    buildReference(
      3,
      'Water'
    ),

    buildReference(
      4,
      'Agricultural/Open'
    ),

    buildReference(
      5,
      'Barren/Fallow'
    )

  ]);


// ======================================================
// 16. DISTANCE FUNCTION
// ======================================================

function referenceDistance(
  feature,
  reference
) {

  feature =
    ee.Feature(
      feature
    );


  reference =
    ee.Dictionary(
      reference
    );


  var differences =
    ee.List(
      PREDICTOR_BANDS
    )

    .map(
      function(bandName) {

        bandName =
          ee.String(
            bandName
          );


        var value2015 =
          ee.Number(

            feature.get(

              ee.String(
                'y2015_'
              )

              .cat(
                bandName
              )

            )

          );


        var mean2020 =
          ee.Number(

            reference.get(

              bandName.cat(
                '_mean'
              )

            )

          );


        var sd2020 =
          ee.Number(

            reference.get(

              bandName.cat(
                '_sd'
              )

            )

          );


        return value2015

          .subtract(
            mean2020
          )

          .abs()

          .divide(
            sd2020
          );

      }
    );


  return ee.Number(

    differences.reduce(
      ee.Reducer.mean()
    )

  );

}


// ======================================================
// 17. LOCKED SCREENING RULE
// ======================================================

function screenGroup(feature) {

  feature =
    ee.Feature(
      feature
    );


  var originalClass =
    ee.Number(

      feature.get(
        'class_id'
      )

    );


  var distances =
    references.map(
      function(reference) {

        return referenceDistance(
          feature,
          reference
        );

      }
    );


  var bestDistance =
    ee.Number(

      distances.reduce(
        ee.Reducer.min()
      )

    );


  var suggestedClass =
    ee.Number(

      distances.indexOf(
        bestDistance
      )

    )

    .add(
      1
    );


  var sorted =
    distances.sort();


  var secondBest =
    ee.Number(
      sorted.get(
        1
      )
    );


  var margin =
    secondBest.subtract(
      bestDistance
    );


  var originalDistance =
    ee.Number(

      distances.get(

        originalClass.subtract(
          1
        )

      )

    );


  var sameClass =
    suggestedClass.eq(
      originalClass
    );


  var stable =
    sameClass

      .and(

        originalDistance.lte(
          1.25
        )

      )

      .and(

        margin.gte(
          0.25
        )

      );


  var status =
    ee.String(

      ee.Algorithms.If(

        stable,

        'LIKELY_STABLE',

        ee.Algorithms.If(

          sameClass,

          'REVIEW_UNCERTAIN',

          'REVIEW_CHANGED'

        )

      )

    );


  return feature.set({

    suggested_class:
      suggestedClass,

    original_class_distance:
      originalDistance,

    best_distance:
      bestDistance,

    second_best_distance:
      secondBest,

    class_margin:
      margin,

    screening_status:
      status

  });

}


// ======================================================
// 18. SAMPLE TEMPORAL STACK AT VALIDATION LOCATIONS
// ======================================================

var validationTemporal =
  temporalStack.sampleRegions({

    collection:
      finalValidation2020,

    properties: [

      'class_id',

      'class_name',

      'val_poly_id'

    ],

    scale:
      ANALYSIS_SCALE,

    projection:
      ee.Projection(
        ANALYSIS_CRS
      ),

    geometries:
      false,

    tileScale:
      16

  })

  .filter(

    ee.Filter.notNull(
      temporalProperties
    )

  );


// ======================================================
// 19. VALIDATION GROUP IDS
// ======================================================

var validationIds =
  ee.List(

    validationTemporal.aggregate_array(
      'val_poly_id'
    )

  )

  .distinct()

  .sort();


// ======================================================
// 20. SUMMARIZE VALIDATION GROUP
// ======================================================

function summarizeValidationGroup(
  valPolyId
) {

  valPolyId =
    ee.Number(
      valPolyId
    );


  var group =
    validationTemporal.filter(

      ee.Filter.eq(
        'val_poly_id',
        valPolyId
      )

    );


  var first =
    ee.Feature(
      group.first()
    );


  var output =
    ee.Feature(

      null,

      {

        val_poly_id:
          valPolyId,

        class_id:
          first.get(
            'class_id'
          ),

        class_name:
          first.get(
            'class_name'
          )

      }

    );


  temporalProperties.forEach(
    function(propertyName) {

      output =
        output.set(

          propertyName,

          group.aggregate_mean(
            propertyName
          )

        );

    }
  );


  return output;

}


var validationGroupStats =
  ee.FeatureCollection(

    validationIds.map(
      summarizeValidationGroup
    )

  );


// ======================================================
// 21. SCREEN VALIDATION GROUPS
// ======================================================

var screenedValidationGroups =
  validationGroupStats.map(
    screenGroup
  );


var stableValidationGroups =
  screenedValidationGroups.filter(

    ee.Filter.eq(
      'screening_status',
      'LIKELY_STABLE'
    )

  );


var uncertainValidationGroups =
  screenedValidationGroups.filter(

    ee.Filter.eq(
      'screening_status',
      'REVIEW_UNCERTAIN'
    )

  );


var changedValidationGroups =
  screenedValidationGroups.filter(

    ee.Filter.eq(
      'screening_status',
      'REVIEW_CHANGED'
    )

  );


// ======================================================
// 22. HELPER FOR IDS BY CLASS
// ======================================================

function idsFor(
  collection,
  classId
) {

  return ee.List(

    collection

      .filter(

        ee.Filter.eq(
          'class_id',
          classId
        )

      )

      .aggregate_array(
        'val_poly_id'
      )

  )

  .sort();

}


// ======================================================
// 23. SCREENING RESULTS
// ======================================================

print(
  '========================================'
);

print(
  '2020 -> 2015 VALIDATION SCREENING'
);

print(
  '========================================'
);


show(
  'Screening status counts:',
  screenedValidationGroups.aggregate_histogram(
    'screening_status'
  )
);


print(
  '----------------------------------------'
);

print(
  'BUILT-UP'
);


show(
  'Stable IDs:',
  idsFor(
    stableValidationGroups,
    1
  )
);


show(
  'Uncertain IDs:',
  idsFor(
    uncertainValidationGroups,
    1
  )
);


show(
  'Changed IDs:',
  idsFor(
    changedValidationGroups,
    1
  )
);


print(
  '----------------------------------------'
);

print(
  'VEGETATION'
);


show(
  'Stable IDs:',
  idsFor(
    stableValidationGroups,
    2
  )
);


show(
  'Uncertain IDs:',
  idsFor(
    uncertainValidationGroups,
    2
  )
);


show(
  'Changed IDs:',
  idsFor(
    changedValidationGroups,
    2
  )
);


print(
  '----------------------------------------'
);

print(
  'WATER'
);


show(
  'Stable IDs:',
  idsFor(
    stableValidationGroups,
    3
  )
);


show(
  'Uncertain IDs:',
  idsFor(
    uncertainValidationGroups,
    3
  )
);


show(
  'Changed IDs:',
  idsFor(
    changedValidationGroups,
    3
  )
);


print(
  '----------------------------------------'
);

print(
  'AGRICULTURAL / OPEN'
);


show(
  'Stable IDs:',
  idsFor(
    stableValidationGroups,
    4
  )
);


show(
  'Uncertain IDs:',
  idsFor(
    uncertainValidationGroups,
    4
  )
);


show(
  'Changed IDs:',
  idsFor(
    changedValidationGroups,
    4
  )
);


print(
  '----------------------------------------'
);

print(
  'BARREN / FALLOW'
);


show(
  'Stable IDs:',
  idsFor(
    stableValidationGroups,
    5
  )
);


show(
  'Uncertain IDs:',
  idsFor(
    uncertainValidationGroups,
    5
  )
);


show(
  'Changed IDs:',
  idsFor(
    changedValidationGroups,
    5
  )
);


// ======================================================
// 24. GET STABLE VALIDATION IDS
// ======================================================

var stableValidationIds =
  ee.List(

    stableValidationGroups.aggregate_array(
      'val_poly_id'
    )

  );


// ======================================================
// 25. SOURCE POINTS BELONGING TO STABLE GROUPS
// ======================================================

var stableValidationSource =
  finalValidation2020.filter(

    ee.Filter.inList(
      'val_poly_id',
      stableValidationIds
    )

  );


// ======================================================
// 26. SAMPLE 2015 AT STABLE VALIDATION LOCATIONS
// ======================================================

var stableValidation2015 =
  stack2015.sampleRegions({

    collection:
      stableValidationSource,

    properties: [

      'class_id',

      'class_name',

      'val_poly_id'

    ],

    scale:
      ANALYSIS_SCALE,

    projection:
      ee.Projection(
        ANALYSIS_CRS
      ),

    geometries:
      true,

    tileScale:
      16

  });


// ======================================================
// 27. 30 m TRAINING EXCLUSION
// ======================================================

var withinTrainingBuffer =
  ee.Filter.withinDistance({

    distance:
      30,

    leftField:
      '.geo',

    rightField:
      '.geo',

    maxError:
      1

  });


var cleanStableValidation2015 =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      stableValidation2015,

      finalTraining2015,

      withinTrainingBuffer

    )

  );


// ======================================================
// 28. CLEAN VALIDATION COUNTS
// ======================================================

print(
  '========================================'
);

print(
  '2015 STABLE VALIDATION AFTER 30 m EXCLUSION'
);

print(
  '========================================'
);


show(
  'Before exclusion:',
  stableValidation2015.size()
);


show(
  'After exclusion:',
  cleanStableValidation2015.size()
);


show(
  'Clean stable validation by class:',
  cleanStableValidation2015.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 29. EXPLICIT COUNTS
// ======================================================

var builtCount =
  cleanStableValidation2015

    .filter(
      ee.Filter.eq(
        'class_id',
        1
      )
    )

    .size();


var vegetationCount =
  cleanStableValidation2015

    .filter(
      ee.Filter.eq(
        'class_id',
        2
      )
    )

    .size();


var waterCount =
  cleanStableValidation2015

    .filter(
      ee.Filter.eq(
        'class_id',
        3
      )
    )

    .size();


var agriCount =
  cleanStableValidation2015

    .filter(
      ee.Filter.eq(
        'class_id',
        4
      )
    )

    .size();


var barrenCount =
  cleanStableValidation2015

    .filter(
      ee.Filter.eq(
        'class_id',
        5
      )
    )

    .size();


show(
  'Explicit clean counts:',
  ee.Dictionary({

    Built_up:
      builtCount,

    Vegetation:
      vegetationCount,

    Water:
      waterCount,

    Agricultural_Open:
      agriCount,

    Barren_Fallow:
      barrenCount

  })
);


// ======================================================
// 30. DEFICITS
// ======================================================

function deficit(count) {

  return ee.Number(
    VALIDATION_TARGET
  )

  .subtract(
    count
  )

  .max(
    0
  );

}


show(
  'Validation deficits:',
  ee.Dictionary({

    Built_up:
      deficit(
        builtCount
      ),

    Vegetation:
      deficit(
        vegetationCount
      ),

    Water:
      deficit(
        waterCount
      ),

    Agricultural_Open:
      deficit(
        agriCount
      ),

    Barren_Fallow:
      deficit(
        barrenCount
      )

  })
);


// ======================================================
// 31. MAP
// ======================================================

Map.layers().reset();


Map.setOptions(
  'SATELLITE'
);


Map.addLayer(

  stack2015,

  {

    bands: [
      'red',
      'green',
      'blue'
    ],

    min:
      0.02,

    max:
      0.30

  },

  '2015 TRUE COLOR',

  true

);


Map.addLayer(

  finalTraining2015,

  {

    color:
      'ff0000',

    pointSize:
      3

  },

  'FINAL TRAINING 2015',

  false

);


Map.addLayer(

  cleanStableValidation2015,

  {

    color:
      '00ffff',

    pointSize:
      6

  },

  'STABLE CLEAN VALIDATION',

  true

);


Map.centerObject(
  roi,
  10
);


// ======================================================
// 32. END
// ======================================================

print(
  '========================================'
);

print(
  '2015 VALIDATION PREPARATION COMPLETE'
);

print(
  '========================================'
);


print(
  'Do NOT run MLC yet.'
);


print(
  'Do NOT alter finalTraining2015.'
);


print(
  'Next step = manually review ONLY validation classes that remain below 60 pixels.'
);


print(
  'After approved validation additions, apply the 30 m exclusion again and balance to 60/class.'
);


print(
  '========================================'
);


// ======================================================
// END SCRIPT 04E
// ======================================================
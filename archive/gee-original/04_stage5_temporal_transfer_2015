// ======================================================
// CHENNAI MULTI-TEMPORAL LULC PROJECT
// SCRIPT 04
// 2020 -> 2015 TEMPORAL TRANSFER
// ======================================================
//
// LOCKED WORKFLOW:
//
// 2020 FINAL VERIFIED DATA
//        ↓
// 2015 AUTOMATIC TEMPORAL STABILITY SCREENING
//        ↓
// CHECK WHETHER STABLE LOCATIONS ALONE ARE SUFFICIENT
//        ↓
// MANUALLY REVIEW ONLY DEFICIENT / UNCERTAIN CLASSES
//
// IMPORTANT:
//
// - 2020 is the immediate temporal reference.
// - 2025 spectral data are NOT used here.
// - 2025 master polygon assets are loaded ONLY to
//   reconstruct polygon geometry corresponding to the
//   poly_id / val_poly_id stored in the finalized
//   2020 sampled assets.
//
// - Do NOT tune screening using validation results.
// - Do NOT classify 2015 yet.
// - Do NOT calculate areas yet.
//
// ======================================================


// ======================================================
// 1. LOCKED PROJECT SETTINGS
// ======================================================

var ANALYSIS_CRS =
  'EPSG:32644';


var ANALYSIS_SCALE =
  30;


var TRAINING_TARGET_PER_CLASS =
  120;


var VALIDATION_TARGET_PER_CLASS =
  60;


var TRAINING_RANDOM_SEED =
  42;


var VALIDATION_RANDOM_SEED =
  84;


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
// 2. ASSET PATHS
// ======================================================

var ROI_ASSET =
  'projects/assignment-482806/assets/chennai_admin_study_area_clean';


var TRAINING_2020_ASSET =
  'projects/assignment-482806/assets/chennai_training_2020_final';


var VALIDATION_2020_ASSET =
  'projects/assignment-482806/assets/chennai_validation_2020_final';


// ------------------------------------------------------
// Geometry-source assets.
//
// These are used ONLY to reconstruct the verified
// polygon geometry corresponding to IDs stored in the
// finalized 2020 sample assets.
//
// They are NOT used as 2015 class truth and 2025 is NOT
// used as the spectral reference.
// ------------------------------------------------------

var TRAINING_POLYGON_GEOMETRY_ASSET =
  'projects/assignment-482806/assets/chennai_training_polygons_2025_master';


var VALIDATION_POLYGON_GEOMETRY_ASSET =
  'projects/assignment-482806/assets/chennai_validation_polygons_2025_master';


// ======================================================
// 3. LOAD FIXED CHENNAI STUDY AREA
// ======================================================

var chennaiStudyArea =
  ee.FeatureCollection(
    ROI_ASSET
  );


var chennaiROI =
  chennaiStudyArea.geometry();


// ======================================================
// 4. LOAD FINALIZED 2020 SAMPLE ASSETS
// ======================================================

var finalTraining2020 =
  ee.FeatureCollection(
    TRAINING_2020_ASSET
  );


var finalValidation2020 =
  ee.FeatureCollection(
    VALIDATION_2020_ASSET
  );


print(
  '========================================'
);

print(
  'SCRIPT 04 - 2020 -> 2015 TEMPORAL TRANSFER'
);

print(
  '========================================'
);


print(
  'Final 2020 training sample count:',
  finalTraining2020.size()
);


print(
  'Expected = 600'
);


print(
  'Final 2020 training by class:',
  finalTraining2020.aggregate_histogram(
    'class_name'
  )
);


print(
  'Final 2020 validation sample count:',
  finalValidation2020.size()
);


print(
  'Expected = 300'
);


print(
  'Final 2020 validation by class:',
  finalValidation2020.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 5. LOAD MASTER POLYGON GEOMETRIES
// ======================================================

var masterTrainingPolygonGeometry =
  ee.FeatureCollection(
    TRAINING_POLYGON_GEOMETRY_ASSET
  );


var masterValidationPolygonGeometry =
  ee.FeatureCollection(
    VALIDATION_POLYGON_GEOMETRY_ASSET
  );


// ======================================================
// 6. RECREATE TRAINING poly_id
// ======================================================
//
// This reproduces the same sequential poly_id assignment
// used in the successful 2025 -> 2020 transfer script.
//
// ======================================================

var masterTrainingPolygonCount =
  masterTrainingPolygonGeometry.size();


var masterTrainingPolygonList =
  masterTrainingPolygonGeometry.toList(
    masterTrainingPolygonCount
  );


var trainingPolygonSequence =
  ee.List.sequence(
    0,
    masterTrainingPolygonCount.subtract(1)
  );


var masterTrainingPolygonsIndexed =
  ee.FeatureCollection(

    trainingPolygonSequence.map(
      function(index) {

        index =
          ee.Number(index);


        var feature =
          ee.Feature(
            masterTrainingPolygonList.get(
              index
            )
          );


        return feature.set(
          'poly_id',
          index.add(1)
        );

      }
    )

  );


// ======================================================
// 7. RECREATE VALIDATION val_poly_id
// ======================================================

var masterValidationPolygonCount =
  masterValidationPolygonGeometry.size();


var masterValidationPolygonList =
  masterValidationPolygonGeometry.toList(
    masterValidationPolygonCount
  );


var validationPolygonSequence =
  ee.List.sequence(
    0,
    masterValidationPolygonCount.subtract(1)
  );


var masterValidationPolygonsIndexed =
  ee.FeatureCollection(

    validationPolygonSequence.map(
      function(index) {

        index =
          ee.Number(index);


        var feature =
          ee.Feature(
            masterValidationPolygonList.get(
              index
            )
          );


        return feature.set(
          'val_poly_id',
          index.add(1)
        );

      }
    )

  );


// ======================================================
// 8. GET IDs ACTUALLY PRESENT IN FINAL 2020 TRAINING
// ======================================================

var finalTrainingPolyIds2020 =
  ee.List(
    finalTraining2020.aggregate_array(
      'poly_id'
    )
  )
  .distinct()
  .sort();


print(
  '2020 finalized training polygon IDs:',
  finalTrainingPolyIds2020
);


// ======================================================
// 9. RECONSTRUCT FINAL 2020 TRAINING POLYGONS
// ======================================================

var finalTrainingPolygons2020 =
  masterTrainingPolygonsIndexed.filter(

    ee.Filter.inList(
      'poly_id',
      finalTrainingPolyIds2020
    )

  );


print(
  'Reconstructed final 2020 training polygon count:',
  finalTrainingPolygons2020.size()
);


print(
  '2020 training polygons by class:',
  finalTrainingPolygons2020.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 10. GET IDS PRESENT IN FINAL 2020 VALIDATION
// ======================================================

var finalValidationPolyIds2020 =
  ee.List(
    finalValidation2020.aggregate_array(
      'val_poly_id'
    )
  )
  .distinct()
  .sort();


print(
  '2020 finalized validation polygon IDs:',
  finalValidationPolyIds2020
);


// ======================================================
// 11. RECONSTRUCT FINAL 2020 VALIDATION POLYGONS
// ======================================================

var finalValidationPolygons2020 =
  masterValidationPolygonsIndexed.filter(

    ee.Filter.inList(
      'val_poly_id',
      finalValidationPolyIds2020
    )

  );


print(
  'Reconstructed final 2020 validation polygon count:',
  finalValidationPolygons2020.size()
);


print(
  '2020 validation polygons by class:',
  finalValidationPolygons2020.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 12. CRITICAL GEOMETRY-ID QA
// ======================================================
//
// Because the master geometry assets are re-indexed,
// verify that every finalized 2020 sample point intersects
// the polygon having the SAME ID.
//
// EXPECTED:
//
// Training geometry-ID mismatches   = 0
// Validation geometry-ID mismatches = 0
//
// If either result is NOT zero, STOP.
// Do not continue.
//
// ======================================================

var trainingIdAndSpatialMatch =
  ee.Filter.and(

    ee.Filter.equals({

      leftField:
        'poly_id',

      rightField:
        'poly_id'

    }),

    ee.Filter.intersects({

      leftField:
        '.geo',

      rightField:
        '.geo',

      maxError:
        1

    })

  );


var trainingGeometryMismatches =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      finalTraining2020,

      finalTrainingPolygons2020,

      trainingIdAndSpatialMatch

    )

  );


print(
  '----------------------------------------'
);


print(
  'CRITICAL QA'
);


print(
  'Training geometry-ID mismatch count:',
  trainingGeometryMismatches.size()
);


print(
  'EXPECTED = 0'
);


var validationIdAndSpatialMatch =
  ee.Filter.and(

    ee.Filter.equals({

      leftField:
        'val_poly_id',

      rightField:
        'val_poly_id'

    }),

    ee.Filter.intersects({

      leftField:
        '.geo',

      rightField:
        '.geo',

      maxError:
        1

    })

  );


var validationGeometryMismatches =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      finalValidation2020,

      finalValidationPolygons2020,

      validationIdAndSpatialMatch

    )

  );


print(
  'Validation geometry-ID mismatch count:',
  validationGeometryMismatches.size()
);


print(
  'EXPECTED = 0'
);


print(
  '----------------------------------------'
);


// ======================================================
// 13. LOCKED LANDSAT 8 PREPROCESSING
// ======================================================
//
// 2015 = Landsat 8 OLI
// 2020 = Landsat 8 OLI
//
// Collection:
// Landsat Collection 2 Tier 1 Level 2 SR
//
// Mask:
// fill
// dilated cloud
// cirrus
// cloud
// cloud shadow
// snow
// radiometric saturation
//
// Scaling:
// DN * 0.0000275 - 0.2
//
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


  var clearMask =
    qa.bitwiseAnd(
      1 << 0
    )
    .eq(0)

    .and(
      qa.bitwiseAnd(
        1 << 1
      )
      .eq(0)
    )

    .and(
      qa.bitwiseAnd(
        1 << 2
      )
      .eq(0)
    )

    .and(
      qa.bitwiseAnd(
        1 << 3
      )
      .eq(0)
    )

    .and(
      qa.bitwiseAnd(
        1 << 4
      )
      .eq(0)
    )

    .and(
      qa.bitwiseAnd(
        1 << 5
      )
      .eq(0)
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
    clearMask
  );

}


// ======================================================
// 14. LOCKED INDEX FUNCTION
// ======================================================
//
// Explicit arithmetic:
//
// NDVI = (NIR - RED) / (NIR + RED)
//
// NDWI = (GREEN - NIR) / (GREEN + NIR)
//
// NDBI = (SWIR1 - NIR) / (SWIR1 + NIR)
//
// ======================================================

function addIndices(image) {

  var blue =
    image.select(
      'blue'
    );


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


  var swir2 =
    image.select(
      'swir2'
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
// 15. BUILD 2015 LANDSAT 8 COLLECTION
// ======================================================

var C2015 =
  ee.ImageCollection(
    'LANDSAT/LC08/C02/T1_L2'
  )

  .filterBounds(
    chennaiROI
  )

  .filterDate(
    '2015-01-01',
    '2016-01-01'
  )

  .map(
    preprocessL8
  );


// ======================================================
// 16. BUILD 2020 LANDSAT 8 COLLECTION
// ======================================================
//
// Rebuilt only because polygon-level 2020 spectral means
// are required as the temporal reference.
//
// ======================================================

var C2020 =
  ee.ImageCollection(
    'LANDSAT/LC08/C02/T1_L2'
  )

  .filterBounds(
    chennaiROI
  )

  .filterDate(
    '2020-01-01',
    '2021-01-01'
  )

  .map(
    preprocessL8
  );


// ======================================================
// 17. FULL-YEAR ANNUAL MEDIAN COMPOSITES
// ======================================================

var composite2015 =
  C2015
    .median()
    .clip(
      chennaiROI
    );


var composite2020 =
  C2020
    .median()
    .clip(
      chennaiROI
    );


// ======================================================
// 18. FINAL 9-BAND PREDICTOR STACKS
// ======================================================

var stack2015 =
  addIndices(
    composite2015
  )

  .select(
    PREDICTOR_BANDS
  )

  .clip(
    chennaiROI
  );


var stack2020 =
  addIndices(
    composite2020
  )

  .select(
    PREDICTOR_BANDS
  )

  .clip(
    chennaiROI
  );


// ======================================================
// 19. STACK QA
// ======================================================

print(
  '========================================'
);

print(
  'LANDSAT / STACK QA'
);


print(
  '2015 Landsat 8 scene count:',
  C2015.size()
);


print(
  '2020 Landsat 8 scene count:',
  C2020.size()
);


print(
  '2015 predictor bands:',
  stack2015.bandNames()
);


print(
  '2020 predictor bands:',
  stack2020.bandNames()
);


print(
  '========================================'
);


// ======================================================
// 20. MAP SETUP
// ======================================================

Map.layers().reset();


Map.setOptions(
  'SATELLITE'
);


Map.addLayer(

  chennaiStudyArea.style({

    color:
      'ff0000',

    fillColor:
      '00000000',

    width:
      2

  }),

  {},

  'Chennai Urban Study Area',

  true

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

  '2015 True Color',

  true

);


Map.addLayer(

  stack2020,

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

  '2020 True Color',

  false

);


Map.addLayer(

  stack2015.select(
    'NDVI'
  ),

  {

    min:
      0,

    max:
      0.8,

    palette: [
      '8b4513',
      'ffff00',
      '90ee90',
      '006400'
    ]

  },

  '2015 NDVI',

  false

);


Map.centerObject(
  chennaiROI,
  10
);


// ======================================================
// 21. PREFIX TEMPORAL BANDS
// ======================================================

var bands2020Prefixed =
  PREDICTOR_BANDS.map(
    function(name) {

      return 'y2020_' + name;

    }
  );


var bands2015Prefixed =
  PREDICTOR_BANDS.map(
    function(name) {

      return 'y2015_' + name;

    }
  );


// ======================================================
// 22. CREATE 2020 + 2015 TEMPORAL STACK
// ======================================================

var temporalComparisonStack2015 =
  stack2020.rename(
    bands2020Prefixed
  )

  .addBands(

    stack2015.rename(
      bands2015Prefixed
    )

  );


// ======================================================
// 23. REQUIRED TEMPORAL PROPERTIES
// ======================================================

var requiredTemporalProperties2015 =
  bands2020Prefixed.concat(
    bands2015Prefixed
  );


// ======================================================
// 24. TRAINING POLYGON TEMPORAL STATISTICS
// ======================================================

var trainingTemporalStatsRaw2015 =
  temporalComparisonStack2015.reduceRegions({

    collection:
      finalTrainingPolygons2020,

    reducer:
      ee.Reducer.mean(),

    scale:
      ANALYSIS_SCALE,

    crs:
      ANALYSIS_CRS,

    tileScale:
      4

  });


// ======================================================
// 25. VALID TRAINING TEMPORAL POLYGONS
// ======================================================

var validTrainingTemporal2015 =
  trainingTemporalStatsRaw2015.filter(

    ee.Filter.notNull(
      requiredTemporalProperties2015
    )

  );


// ======================================================
// 26. TRAINING NO-DATA POLYGONS
// ======================================================

var trainingPolyIdMatch =
  ee.Filter.equals({

    leftField:
      'poly_id',

    rightField:
      'poly_id'

  });


var noDataTrainingPolygons2015 =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      trainingTemporalStatsRaw2015,

      validTrainingTemporal2015,

      trainingPolyIdMatch

    )

  )

  .map(
    function(feature) {

      return ee.Feature(feature).set({

        screening_status:
          'NO_DATA_REVIEW',

        suggested_transition:
          'NO_DATA'

      });

    }
  );


print(
  '----------------------------------------'
);


print(
  '2015 TRAINING TEMPORAL DATA QA'
);


print(
  '2020 finalized training polygons:',
  trainingTemporalStatsRaw2015.size()
);


print(
  'Training polygons with complete 2020 + 2015 data:',
  validTrainingTemporal2015.size()
);


print(
  'Training polygons with missing temporal data:',
  noDataTrainingPolygons2015.size()
);


print(
  'Training NO_DATA poly IDs:',
  noDataTrainingPolygons2015.aggregate_array(
    'poly_id'
  )
);


// ======================================================
// 27. SAFE STANDARD DEVIATION
// ======================================================

function safeStandardDeviation(
  rawValue
) {

  var isNull =
    ee.Algorithms.IsEqual(
      rawValue,
      null
    );


  var value =
    ee.Number(

      ee.Algorithms.If(

        isNull,

        0.000001,

        rawValue

      )

    );


  return value.max(
    0.000001
  );

}


// ======================================================
// 28. BUILD 2020 CLASS REFERENCE SIGNATURE
// ======================================================
//
// IMPORTANT:
//
// 2020 is now the spectral reference.
//
// We use polygon-level 2020 means from the verified
// final 2020 training polygon set.
//
// The reference contains:
//
// mean and sample SD for each of the 9 predictors.
//
// ======================================================

function buildClassReference2020(
  classId,
  className
) {

  var classPolygons =
    validTrainingTemporal2015.filter(

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
        className,

      polygon_count:
        classPolygons.size()

    });


  PREDICTOR_BANDS.forEach(
    function(bandName) {

      var propertyName =
        'y2020_' + bandName;


      var bandMean =
        ee.Number(

          classPolygons.aggregate_mean(
            propertyName
          )

        );


      var rawSd =
        classPolygons.aggregate_sample_sd(
          propertyName
        );


      var bandSd =
        safeStandardDeviation(
          rawSd
        );


      reference =
        reference

          .set(
            bandName + '_mean',
            bandMean
          )

          .set(
            bandName + '_sd',
            bandSd
          );

    }
  );


  return reference;

}


// ======================================================
// 29. FIVE 2020 CLASS REFERENCES
// ======================================================

var referenceBuiltup2020 =
  buildClassReference2020(
    1,
    'Built-up'
  );


var referenceVegetation2020 =
  buildClassReference2020(
    2,
    'Vegetation'
  );


var referenceWater2020 =
  buildClassReference2020(
    3,
    'Water'
  );


var referenceAgriOpen2020 =
  buildClassReference2020(
    4,
    'Agricultural/Open'
  );


var referenceBarrenFallow2020 =
  buildClassReference2020(
    5,
    'Barren/Fallow'
  );


var referenceList2020 =
  ee.List([

    referenceBuiltup2020,

    referenceVegetation2020,

    referenceWater2020,

    referenceAgriOpen2020,

    referenceBarrenFallow2020

  ]);


// ======================================================
// 30. REFERENCE QA
// ======================================================

print(
  '----------------------------------------'
);


print(
  '2020 REFERENCE POLYGON COUNTS'
);


print(

  ee.Dictionary({

    Built_up:
      ee.Dictionary(
        referenceBuiltup2020
      ).get(
        'polygon_count'
      ),

    Vegetation:
      ee.Dictionary(
        referenceVegetation2020
      ).get(
        'polygon_count'
      ),

    Water:
      ee.Dictionary(
        referenceWater2020
      ).get(
        'polygon_count'
      ),

    Agricultural_Open:
      ee.Dictionary(
        referenceAgriOpen2020
      ).get(
        'polygon_count'
      ),

    Barren_Fallow:
      ee.Dictionary(
        referenceBarrenFallow2020
      ).get(
        'polygon_count'
      )

  })

);


// ======================================================
// 31. STANDARDIZED DISTANCE TO 2020 CLASS REFERENCE
// ======================================================
//
// For each predictor:
//
// |2015 polygon value - 2020 class mean|
// ---------------------------------------
//              2020 class SD
//
// The nine standardized absolute differences are averaged.
//
// Lower distance = greater spectral similarity.
//
// ======================================================

function calculate2015ReferenceDistance(
  feature,
  reference
) {

  feature =
    ee.Feature(feature);


  reference =
    ee.Dictionary(reference);


  var standardizedDifferences =
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


        var referenceMean =
          ee.Number(

            reference.get(

              bandName.cat(
                '_mean'
              )

            )

          );


        var referenceSd =
          ee.Number(

            reference.get(

              bandName.cat(
                '_sd'
              )

            )

          );


        return value2015

          .subtract(
            referenceMean
          )

          .abs()

          .divide(
            referenceSd
          );

      }
    );


  return ee.Number(

    standardizedDifferences.reduce(
      ee.Reducer.mean()
    )

  );

}


// ======================================================
// 32. GENERIC 2020 -> 2015 SCREENING FUNCTION
// ======================================================
//
// LOCKED CONSERVATIVE RULE:
//
// LIKELY_STABLE when:
//
// 1. Best matching 2020 reference class is the same
//    as the polygon's verified 2020 class.
//
// AND
//
// 2. Distance to original class <= 1.25
//
// AND
//
// 3. Best vs second-best margin >= 0.25
//
// Otherwise:
//
// same class but thresholds fail
//      -> REVIEW_UNCERTAIN
//
// different best class
//      -> REVIEW_CHANGED
//
// ======================================================

function screenFeatureFor2015(
  feature
) {

  feature =
    ee.Feature(feature);


  var originalClass =
    ee.Number(
      feature.get(
        'class_id'
      )
    );


  // ----------------------------------------------------
  // Distance to five 2020 training-derived references
  // ----------------------------------------------------

  var distances =
    referenceList2020.map(
      function(reference) {

        return calculate2015ReferenceDistance(
          feature,
          reference
        );

      }
    );


  // ----------------------------------------------------
  // Best class
  // ----------------------------------------------------

  var minimumDistance =
    ee.Number(

      distances.reduce(
        ee.Reducer.min()
      )

    );


  var bestIndex =
    ee.Number(

      distances.indexOf(
        minimumDistance
      )

    );


  var suggestedClass =
    bestIndex.add(
      1
    );


  // ----------------------------------------------------
  // Second-best class distance
  // ----------------------------------------------------

  var sortedDistances =
    distances.sort();


  var secondBestDistance =
    ee.Number(
      sortedDistances.get(
        1
      )
    );


  var classMargin =
    secondBestDistance.subtract(
      minimumDistance
    );


  // ----------------------------------------------------
  // Original class distance
  // ----------------------------------------------------

  var originalClassDistance =
    ee.Number(

      distances.get(

        originalClass.subtract(
          1
        )

      )

    );


  // ----------------------------------------------------
  // Same class?
  // ----------------------------------------------------

  var sameClass =
    suggestedClass.eq(
      originalClass
    );


  // ----------------------------------------------------
  // LOCKED STABILITY RULE
  // ----------------------------------------------------

  var likelyStable =
    sameClass

      .and(
        originalClassDistance.lte(
          1.25
        )
      )

      .and(
        classMargin.gte(
          0.25
        )
      );


  // ----------------------------------------------------
  // Status
  // ----------------------------------------------------

  var status =
    ee.String(

      ee.Algorithms.If(

        likelyStable,

        'LIKELY_STABLE',

        ee.Algorithms.If(

          sameClass,

          'REVIEW_UNCERTAIN',

          'REVIEW_CHANGED'

        )

      )

    );


  // ----------------------------------------------------
  // Suggested transition
  // ----------------------------------------------------

  var transition =
    originalClass

      .format(
        '%d'
      )

      .cat(
        ' -> '
      )

      .cat(

        suggestedClass.format(
          '%d'
        )

      );


  return feature.set({

    suggested_class:
      suggestedClass,

    original_class_distance:
      originalClassDistance,

    best_distance:
      minimumDistance,

    second_best_distance:
      secondBestDistance,

    class_margin:
      classMargin,

    screening_status:
      status,

    suggested_transition:
      transition

  });

}


// ======================================================
// 33. SCREEN 2015 TRAINING POLYGONS
// ======================================================

var screenedValidTraining2015 =
  validTrainingTemporal2015.map(
    screenFeatureFor2015
  );


var screenedTrainingPolygons2015 =
  screenedValidTraining2015.merge(
    noDataTrainingPolygons2015
  );


// ======================================================
// 34. SPLIT TRAINING SCREENING GROUPS
// ======================================================

var stableTrainingPolygons2015 =
  screenedTrainingPolygons2015.filter(

    ee.Filter.eq(
      'screening_status',
      'LIKELY_STABLE'
    )

  );


var uncertainTrainingPolygons2015 =
  screenedTrainingPolygons2015.filter(

    ee.Filter.eq(
      'screening_status',
      'REVIEW_UNCERTAIN'
    )

  );


var changedTrainingPolygons2015 =
  screenedTrainingPolygons2015.filter(

    ee.Filter.eq(
      'screening_status',
      'REVIEW_CHANGED'
    )

  );


var noDataTrainingReview2015 =
  screenedTrainingPolygons2015.filter(

    ee.Filter.eq(
      'screening_status',
      'NO_DATA_REVIEW'
    )

  );


// ======================================================
// 35. TRAINING SCREENING SUMMARY
// ======================================================

print(
  '========================================'
);

print(
  '2020 -> 2015 TRAINING SCREENING RESULTS'
);


print(
  'Training screening status counts:',
  screenedTrainingPolygons2015.aggregate_histogram(
    'screening_status'
  )
);


print(
  'Training original -> suggested transitions:',
  screenedValidTraining2015.aggregate_histogram(
    'suggested_transition'
  )
);


print(
  'LIKELY_STABLE training polygons by class:',
  stableTrainingPolygons2015.aggregate_histogram(
    'class_name'
  )
);


print(
  'REVIEW_UNCERTAIN training polygons by class:',
  uncertainTrainingPolygons2015.aggregate_histogram(
    'class_name'
  )
);


print(
  'REVIEW_CHANGED training polygons by class:',
  changedTrainingPolygons2015.aggregate_histogram(
    'class_name'
  )
);


print(
  'NO_DATA training polygons by class:',
  noDataTrainingReview2015.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 36. TRAINING REVIEW IDS
// ======================================================

var trainingReviewPolygons2015 =
  uncertainTrainingPolygons2015

    .merge(
      changedTrainingPolygons2015
    )

    .merge(
      noDataTrainingReview2015
    );


print(
  'All 2015 training review poly IDs:',
  trainingReviewPolygons2015.aggregate_array(
    'poly_id'
  )
);


// ======================================================
// 37. SAMPLE 2015 ONLY FROM LIKELY-STABLE TRAINING POLYGONS
// ======================================================
//
// This is the critical decision test.
//
// Do NOT manually inspect anything yet.
//
// First check whether these stable polygons alone give:
//
// >=120 pixels for EVERY class.
//
// ======================================================

var stableTrainingSamples2015 =
  stack2015.sampleRegions({

    collection:
      stableTrainingPolygons2015,

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
      true,

    tileScale:
      4

  });


// ======================================================
// 38. STABLE TRAINING PIXEL COUNTS
// ======================================================

print(
  '----------------------------------------'
);


print(
  '2015 STABLE TRAINING PIXEL POOL'
);


print(
  'Total stable 2015 training pixels:',
  stableTrainingSamples2015.size()
);


print(
  'Stable 2015 training pixels by class:',
  stableTrainingSamples2015.aggregate_histogram(
    'class_name'
  )
);


print(
  'Stable 2015 training pixels by class ID:',
  stableTrainingSamples2015.aggregate_histogram(
    'class_id'
  )
);


print(
  'TARGET = 120 pixels per class'
);


// ======================================================
// 39. STABLE TRAINING CLASS COUNTS AS EXPLICIT DICTIONARY
// ======================================================

var stableTrainingCounts2015 =
  ee.Dictionary({

    Built_up:
      stableTrainingSamples2015.filter(
        ee.Filter.eq(
          'class_id',
          1
        )
      ).size(),

    Vegetation:
      stableTrainingSamples2015.filter(
        ee.Filter.eq(
          'class_id',
          2
        )
      ).size(),

    Water:
      stableTrainingSamples2015.filter(
        ee.Filter.eq(
          'class_id',
          3
        )
      ).size(),

    Agricultural_Open:
      stableTrainingSamples2015.filter(
        ee.Filter.eq(
          'class_id',
          4
        )
      ).size(),

    Barren_Fallow:
      stableTrainingSamples2015.filter(
        ee.Filter.eq(
          'class_id',
          5
        )
      ).size()

  });


print(
  '2015 stable training counts - explicit:',
  stableTrainingCounts2015
);


// ======================================================
// 40. STABLE TRAINING SPECTRAL QA
// ======================================================

function printStableTrainingMeans2015(
  classId,
  className
) {

  var samples =
    stableTrainingSamples2015.filter(

      ee.Filter.eq(
        'class_id',
        classId
      )

    );


  var n =
    samples.size();


  var meanNDVI =
    ee.Number(

      ee.Algorithms.If(

        n.gt(0),

        samples.aggregate_mean(
          'NDVI'
        ),

        -9999

      )

    );


  var meanNDWI =
    ee.Number(

      ee.Algorithms.If(

        n.gt(0),

        samples.aggregate_mean(
          'NDWI'
        ),

        -9999

      )

    );


  var meanNDBI =
    ee.Number(

      ee.Algorithms.If(

        n.gt(0),

        samples.aggregate_mean(
          'NDBI'
        ),

        -9999

      )

    );


  print(

    ee.String(
      className
    )

    .cat(
      ' | n='
    )

    .cat(
      n.format(
        '%d'
      )
    )

    .cat(
      ' | NDVI='
    )

    .cat(
      meanNDVI.format(
        '%.4f'
      )
    )

    .cat(
      ' | NDWI='
    )

    .cat(
      meanNDWI.format(
        '%.4f'
      )
    )

    .cat(
      ' | NDBI='
    )

    .cat(
      meanNDBI.format(
        '%.4f'
      )
    )

  );

}


print(
  '----------------------------------------'
);


print(
  '2015 STABLE TRAINING SPECTRAL QA'
);


printStableTrainingMeans2015(
  1,
  'Built-up'
);


printStableTrainingMeans2015(
  2,
  'Vegetation'
);


printStableTrainingMeans2015(
  3,
  'Water'
);


printStableTrainingMeans2015(
  4,
  'Agricultural/Open'
);


printStableTrainingMeans2015(
  5,
  'Barren/Fallow'
);


// ======================================================
// 41. MAP TRAINING SCREENING RESULTS
// ======================================================
//
// GREEN   = likely stable
// YELLOW  = uncertain
// RED     = likely changed
// MAGENTA = no data
//
// ======================================================

Map.addLayer(

  stableTrainingPolygons2015.style({

    color:
      '00ff00',

    fillColor:
      '00ff0033',

    width:
      3

  }),

  {},

  '2015 TRAINING - LIKELY STABLE',

  true

);


Map.addLayer(

  uncertainTrainingPolygons2015.style({

    color:
      'ffff00',

    fillColor:
      'ffff0033',

    width:
      3

  }),

  {},

  '2015 TRAINING - REVIEW UNCERTAIN',

  true

);


Map.addLayer(

  changedTrainingPolygons2015.style({

    color:
      'ff0000',

    fillColor:
      'ff000044',

    width:
      3

  }),

  {},

  '2015 TRAINING - REVIEW CHANGED',

  true

);


Map.addLayer(

  noDataTrainingReview2015.style({

    color:
      'ff00ff',

    fillColor:
      'ff00ff44',

    width:
      3

  }),

  {},

  '2015 TRAINING - NO DATA REVIEW',

  true

);


// ======================================================
// 42. BEGIN INDEPENDENT VALIDATION TEMPORAL SCREENING
// ======================================================
//
// IMPORTANT:
//
// Validation is still independent.
//
// It is NOT used to build the class references.
//
// The SAME 2020 training-derived referenceList2020
// is used to screen validation.
//
// We are only creating the candidate stable validation
// pool here.
//
// DO NOT perform 30 m training exclusion yet.
//
// Final 2015 training polygons must be determined first.
//
// ======================================================


// ======================================================
// 43. VALIDATION TEMPORAL STATISTICS
// ======================================================

var validationTemporalStatsRaw2015 =
  temporalComparisonStack2015.reduceRegions({

    collection:
      finalValidationPolygons2020,

    reducer:
      ee.Reducer.mean(),

    scale:
      ANALYSIS_SCALE,

    crs:
      ANALYSIS_CRS,

    tileScale:
      4

  });


// ======================================================
// 44. VALID VALIDATION TEMPORAL POLYGONS
// ======================================================

var validValidationTemporal2015 =
  validationTemporalStatsRaw2015.filter(

    ee.Filter.notNull(
      requiredTemporalProperties2015
    )

  );


// ======================================================
// 45. VALIDATION NO-DATA POLYGONS
// ======================================================

var validationPolyIdMatch =
  ee.Filter.equals({

    leftField:
      'val_poly_id',

    rightField:
      'val_poly_id'

  });


var noDataValidationPolygons2015 =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      validationTemporalStatsRaw2015,

      validValidationTemporal2015,

      validationPolyIdMatch

    )

  )

  .map(
    function(feature) {

      return ee.Feature(feature).set({

        screening_status:
          'NO_DATA_REVIEW',

        suggested_transition:
          'NO_DATA'

      });

    }
  );


print(
  '========================================'
);

print(
  '2015 VALIDATION TEMPORAL DATA QA'
);


print(
  '2020 finalized validation polygons reconstructed:',
  validationTemporalStatsRaw2015.size()
);


print(
  'Validation polygons with complete 2020 + 2015 data:',
  validValidationTemporal2015.size()
);


print(
  'Validation polygons with missing temporal data:',
  noDataValidationPolygons2015.size()
);


print(
  'Validation NO_DATA IDs:',
  noDataValidationPolygons2015.aggregate_array(
    'val_poly_id'
  )
);


// ======================================================
// 46. SCREEN VALIDATION USING SAME TRAINING REFERENCES
// ======================================================

var screenedValidValidation2015 =
  validValidationTemporal2015.map(
    screenFeatureFor2015
  );


var screenedValidationPolygons2015 =
  screenedValidValidation2015.merge(
    noDataValidationPolygons2015
  );


// ======================================================
// 47. SPLIT VALIDATION SCREENING GROUPS
// ======================================================

var stableValidationPolygons2015 =
  screenedValidationPolygons2015.filter(

    ee.Filter.eq(
      'screening_status',
      'LIKELY_STABLE'
    )

  );


var uncertainValidationPolygons2015 =
  screenedValidationPolygons2015.filter(

    ee.Filter.eq(
      'screening_status',
      'REVIEW_UNCERTAIN'
    )

  );


var changedValidationPolygons2015 =
  screenedValidationPolygons2015.filter(

    ee.Filter.eq(
      'screening_status',
      'REVIEW_CHANGED'
    )

  );


var noDataValidationReview2015 =
  screenedValidationPolygons2015.filter(

    ee.Filter.eq(
      'screening_status',
      'NO_DATA_REVIEW'
    )

  );


// ======================================================
// 48. VALIDATION SCREENING SUMMARY
// ======================================================

print(
  '----------------------------------------'
);


print(
  '2020 -> 2015 VALIDATION SCREENING RESULTS'
);


print(
  'Validation screening status counts:',
  screenedValidationPolygons2015.aggregate_histogram(
    'screening_status'
  )
);


print(
  'Validation original -> suggested transitions:',
  screenedValidValidation2015.aggregate_histogram(
    'suggested_transition'
  )
);


print(
  'LIKELY_STABLE validation polygons by class:',
  stableValidationPolygons2015.aggregate_histogram(
    'class_name'
  )
);


print(
  'REVIEW_UNCERTAIN validation polygons by class:',
  uncertainValidationPolygons2015.aggregate_histogram(
    'class_name'
  )
);


print(
  'REVIEW_CHANGED validation polygons by class:',
  changedValidationPolygons2015.aggregate_histogram(
    'class_name'
  )
);


print(
  'NO_DATA validation polygons by class:',
  noDataValidationReview2015.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 49. VALIDATION REVIEW IDS
// ======================================================

var validationReviewPolygons2015 =
  uncertainValidationPolygons2015

    .merge(
      changedValidationPolygons2015
    )

    .merge(
      noDataValidationReview2015
    );


print(
  'All 2015 validation review IDs:',
  validationReviewPolygons2015.aggregate_array(
    'val_poly_id'
  )
);


// ======================================================
// 50. SAMPLE STABLE VALIDATION CANDIDATE POOL
// ======================================================
//
// NOTE:
//
// This is NOT finalValidationClean2015 yet.
//
// We have NOT performed the 30 m training exclusion,
// because final 2015 training polygons are not yet fixed.
//
// ======================================================

var stableValidationSamples2015 =
  stack2015.sampleRegions({

    collection:
      stableValidationPolygons2015,

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
      4

  });


// ======================================================
// 51. STABLE VALIDATION POOL COUNTS
// ======================================================

print(
  '----------------------------------------'
);


print(
  '2015 STABLE VALIDATION CANDIDATE POOL'
);


print(
  'Total stable validation candidate pixels:',
  stableValidationSamples2015.size()
);


print(
  'Stable validation candidate pixels by class:',
  stableValidationSamples2015.aggregate_histogram(
    'class_name'
  )
);


print(
  'Stable validation candidate pixels by class ID:',
  stableValidationSamples2015.aggregate_histogram(
    'class_id'
  )
);


print(
  'Later final target = 60 pixels per class AFTER 30 m training exclusion'
);


// ======================================================
// 52. MAP VALIDATION SCREENING GROUPS
// ======================================================
//
// Hidden by default so training review remains easy.
//
// ======================================================

Map.addLayer(

  stableValidationPolygons2015.style({

    color:
      '00ff00',

    fillColor:
      '00ff0018',

    width:
      2

  }),

  {},

  '2015 VALIDATION - LIKELY STABLE',

  false

);


Map.addLayer(

  uncertainValidationPolygons2015.style({

    color:
      'ffff00',

    fillColor:
      'ffff0018',

    width:
      2

  }),

  {},

  '2015 VALIDATION - REVIEW UNCERTAIN',

  false

);


Map.addLayer(

  changedValidationPolygons2015.style({

    color:
      'ff0000',

    fillColor:
      'ff000022',

    width:
      2

  }),

  {},

  '2015 VALIDATION - REVIEW CHANGED',

  false

);


Map.addLayer(

  noDataValidationReview2015.style({

    color:
      'ff00ff',

    fillColor:
      'ff00ff22',

    width:
      2

  }),

  {},

  '2015 VALIDATION - NO DATA REVIEW',

  false

);


// ======================================================
// 53. FINAL CHECKPOINT MESSAGE
// ======================================================

print(
  '========================================'
);

print(
  'SCRIPT 04 - AUTOMATIC 2015 SCREENING COMPLETE'
);

print(
  '========================================'
);


print(
  'DO NOT CLASSIFY 2015 YET.'
);


print(
  'STEP 1: Confirm geometry-ID mismatch counts are BOTH 0.'
);


print(
  'STEP 2: Check 2015 stable TRAINING pixels by class.'
);


print(
  'Target = at least 120/class before balancing.'
);


print(
  'STEP 3: We will manually inspect ONLY deficient training classes.'
);


print(
  'STEP 4: After final 2015 training is locked, apply the 30 m exclusion to validation.'
);


print(
  'STEP 5: Then balance training to 120/class and validation to 60/class.'
);


print(
  '========================================'
);


// ======================================================
// END SCRIPT 04 - CURRENT CHECKPOINT
// ======================================================
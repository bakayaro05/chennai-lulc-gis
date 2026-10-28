// ======================================================
// CHENNAI LULC PROJECT
// STAGE 5 - TEMPORAL TRAINING TRANSFER
// ======================================================
//
// PURPOSE:
//
// Reuse the verified 2025 master training polygons
// for earlier years.
//
// Workflow:
//
// 2025 master
//      ↓
// 2020 automatic stability screening
//      ↓
// manually inspect only uncertain / changed polygons
//      ↓
// create valid 2020 training set
//
// Later:
//
// 2020 → 2015 → 2010 → 2005
//
// ======================================================


// ======================================================
// 1. LOCKED PROJECT SETTINGS
// ======================================================

var ANALYSIS_CRS =
  'EPSG:32644';

var ANALYSIS_SCALE =
  30;

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
// 2. LOAD LOCKED CHENNAI STUDY AREA
// ======================================================

var chennaiStudyArea =
  ee.FeatureCollection(
    'projects/assignment-482806/assets/chennai_admin_study_area_clean'
  );


var chennaiROI =
  chennaiStudyArea.geometry();


// ======================================================
// 3. LOAD 2025 MASTER TRAINING POLYGONS
// ======================================================

var masterTrainingPolygons2025 =
  ee.FeatureCollection(
    'projects/assignment-482806/assets/chennai_training_polygons_2025_master'
  );


print(
  '========================================'
);

print(
  'STAGE 5 - TEMPORAL TRANSFER'
);


print(
  ee.String(
    '2025 master polygon count: '
  )
    .cat(
      masterTrainingPolygons2025
        .size()
        .format('%d')
    )
);


print(
  '2025 master polygons by class:'
);


print(
  masterTrainingPolygons2025
    .aggregate_histogram(
      'class_name'
    )
);


print(
  '========================================'
);


// ======================================================
// 4. LANDSAT 8 / 9 PREPROCESSING
// ======================================================
//
// We initially need only:
//
// 2020 = Landsat 8
// 2025 = Landsat 8 + Landsat 9
//
// This keeps the new script lightweight.
//
// ======================================================

function preprocessL89(image) {

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
    image

      .select(

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


  return optical
    .updateMask(
      clearMask
    );

}


// ======================================================
// 5. SPECTRAL INDEX FUNCTION
// ======================================================

function addIndices(image) {

  var nir =
    image.select(
      'nir'
    );


  var red =
    image.select(
      'red'
    );


  var green =
    image.select(
      'green'
    );


  var swir1 =
    image.select(
      'swir1'
    );


  var ndvi =
    nir

      .subtract(
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
    green

      .subtract(
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
    swir1

      .subtract(
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
// 6. BUILD 2020 COLLECTION
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
    preprocessL89
  );


// ======================================================
// 7. BUILD 2025 COLLECTION
// ======================================================

var C2025_L8 =
  ee.ImageCollection(
    'LANDSAT/LC08/C02/T1_L2'
  )

  .filterBounds(
    chennaiROI
  )

  .filterDate(
    '2025-01-01',
    '2026-01-01'
  )

  .map(
    preprocessL89
  );


var C2025_L9 =
  ee.ImageCollection(
    'LANDSAT/LC09/C02/T1_L2'
  )

  .filterBounds(
    chennaiROI
  )

  .filterDate(
    '2025-01-01',
    '2026-01-01'
  )

  .map(
    preprocessL89
  );


var C2025 =
  C2025_L8.merge(
    C2025_L9
  );


// ======================================================
// 8. CREATE ANNUAL COMPOSITES
// ======================================================

var composite2020 =
  C2020
    .median()
    .clip(
      chennaiROI
    );


var composite2025 =
  C2025
    .median()
    .clip(
      chennaiROI
    );


// ======================================================
// 9. CREATE FINAL 9-BAND STACKS
// ======================================================

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


var stack2025 =
  addIndices(
    composite2025
  )

  .select(
    PREDICTOR_BANDS
  )

  .clip(
    chennaiROI
  );


// ======================================================
// 10. BASIC STACK QA
// ======================================================

print(
  '2020 scenes:'
);

print(
  C2020.size()
);


print(
  '2025 combined scenes:'
);

print(
  C2025.size()
);


print(
  '2020 bands:'
);

print(
  stack2020.bandNames()
);


print(
  '2025 bands:'
);

print(
  stack2025.bandNames()
);


// ======================================================
// 11. MAP SETTINGS
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

  'Chennai ROI',

  true

);


// ------------------------------------------------------
// MASTER TRAINING POLYGONS
// ------------------------------------------------------

Map.addLayer(

  masterTrainingPolygons2025.style({

    color:
      'ffff00',

    fillColor:
      'ffff0022',

    width:
      2

  }),

  {},

  '2025 Master Training Polygons',

  true

);


// ------------------------------------------------------
// 2020 TRUE COLOR
// ------------------------------------------------------

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

  true

);


// ------------------------------------------------------
// 2025 TRUE COLOR
// ------------------------------------------------------

Map.addLayer(

  stack2025,

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

  '2025 True Color',

  false

);


Map.centerObject(
  chennaiROI,
  10
);


// ======================================================
// END STAGE 5A SETUP
// ======================================================

// ======================================================
// STAGE 5B
// 2025 -> 2020 TEMPORAL STABILITY SCREENING
// ROBUST NULL-SAFE VERSION
// ======================================================
//
// PURPOSE:
//
// Reuse the 2025 master polygons intelligently.
//
// For every polygon:
//
// 1. Extract mean 2025 predictor values
// 2. Extract mean 2020 predictor values
// 3. Remove polygons that cannot be evaluated because
//    one or more required Landsat values are null
// 4. Build 2025 reference signatures by class
// 5. Compare valid 2020 polygons with those signatures
// 6. Flag:
//
//    LIKELY_STABLE
//    REVIEW_UNCERTAIN
//    REVIEW_CHANGED
//    NO_DATA_REVIEW
//
// IMPORTANT:
//
// This is only a screening tool.
// It does NOT automatically define historical truth.
//
// ======================================================


// ======================================================
// 1. ADD UNIQUE POLYGON ID
// ======================================================

var masterPolygonCount2025 =
  masterTrainingPolygons2025.size();


var masterPolygonList2025 =
  masterTrainingPolygons2025.toList(
    masterPolygonCount2025
  );


var polygonSequence2025 =
  ee.List.sequence(
    0,
    masterPolygonCount2025.subtract(1)
  );


var masterPolygonsIndexed2025 =
  ee.FeatureCollection(

    polygonSequence2025.map(
      function(index) {

        index =
          ee.Number(index);


        var feature =
          ee.Feature(
            masterPolygonList2025.get(index)
          );


        return feature.set(
          'poly_id',
          index.add(1)
        );

      }
    )

  );


// ======================================================
// 2. PREFIX BAND NAMES
// ======================================================

var bands2025Prefixed =
  PREDICTOR_BANDS.map(
    function(name) {

      return 'y2025_' + name;

    }
  );


var bands2020Prefixed =
  PREDICTOR_BANDS.map(
    function(name) {

      return 'y2020_' + name;

    }
  );


// ======================================================
// 3. CREATE TEMPORAL COMPARISON STACK
// ======================================================

var temporalComparisonStack =
  stack2025
    .rename(
      bands2025Prefixed
    )

    .addBands(
      stack2020.rename(
        bands2020Prefixed
      )
    );


// ======================================================
// 4. REDUCE BOTH YEARS OVER EVERY POLYGON
// ======================================================

var temporalPolygonStatsRaw2020 =
  temporalComparisonStack.reduceRegions({

    collection:
      masterPolygonsIndexed2025,

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
// 5. REQUIRED TEMPORAL PROPERTIES
// ======================================================
//
// A polygon can only be automatically screened if all
// nine predictors exist for BOTH years.
//
// ======================================================

var requiredTemporalProperties =
  bands2025Prefixed.concat(
    bands2020Prefixed
  );


// ======================================================
// 6. KEEP ONLY COMPLETE POLYGONS
// ======================================================

var validTemporalPolygons2020 =
  temporalPolygonStatsRaw2020.filter(
    ee.Filter.notNull(
      requiredTemporalProperties
    )
  );


// ======================================================
// 7. FIND POLYGONS THAT HAVE MISSING TEMPORAL DATA
// ======================================================
//
// Join against poly_id:
//
// polygons that are NOT present in the valid collection
// become NO_DATA_REVIEW.
//
// ======================================================

var polygonIdMatch =
  ee.Filter.equals({

    leftField:
      'poly_id',

    rightField:
      'poly_id'

  });


var noDataPolygons2020 =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      temporalPolygonStatsRaw2020,

      validTemporalPolygons2020,

      polygonIdMatch

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


// ======================================================
// 8. BASIC NULL / SAMPLE QA
// ======================================================

print(
  '========================================'
);

print(
  'STAGE 5B - TEMPORAL DATA QA'
);


print(

  ee.String(
    'Total master polygons: '
  )

    .cat(
      temporalPolygonStatsRaw2020
        .size()
        .format('%d')
    )

);


print(

  ee.String(
    'Polygons with complete 2020 + 2025 predictor data: '
  )

    .cat(
      validTemporalPolygons2020
        .size()
        .format('%d')
    )

);


print(

  ee.String(
    'Polygons requiring review because of missing data: '
  )

    .cat(
      noDataPolygons2020
        .size()
        .format('%d')
    )

);


print(
  'NO_DATA polygon IDs:'
);


print(
  noDataPolygons2020
    .aggregate_array(
      'poly_id'
    )
);


print(
  '========================================'
);


// ======================================================
// 9. SAFE STANDARD DEVIATION
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
// 10. BUILD 2025 REFERENCE FOR ONE CLASS
// ======================================================
//
// Uses only polygons that have valid values in both
// 2025 and 2020.
//
// ======================================================

function buildClassReference2025(
  classId,
  className
) {

  var classPolygons =
    validTemporalPolygons2020.filter(
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
        'y2025_' + bandName;


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
// 11. BUILD FIVE CLASS REFERENCES
// ======================================================

var referenceBuiltup2025 =
  buildClassReference2025(
    1,
    'Built-up'
  );


var referenceVegetation2025 =
  buildClassReference2025(
    2,
    'Vegetation'
  );


var referenceWater2025 =
  buildClassReference2025(
    3,
    'Water'
  );


var referenceAgriOpen2025 =
  buildClassReference2025(
    4,
    'Agricultural/Open'
  );


var referenceBarrenFallow2025 =
  buildClassReference2025(
    5,
    'Barren/Fallow'
  );


var referenceList2025 =
  ee.List([

    referenceBuiltup2025,

    referenceVegetation2025,

    referenceWater2025,

    referenceAgriOpen2025,

    referenceBarrenFallow2025

  ]);


// ======================================================
// 12. PRINT REFERENCE POLYGON COUNTS
// ======================================================

print(
  '2025 reference polygon counts after null filtering:'
);


print(

  ee.Dictionary({

    Built_up:
      ee.Dictionary(
        referenceBuiltup2025
      ).get('polygon_count'),

    Vegetation:
      ee.Dictionary(
        referenceVegetation2025
      ).get('polygon_count'),

    Water:
      ee.Dictionary(
        referenceWater2025
      ).get('polygon_count'),

    Agricultural_Open:
      ee.Dictionary(
        referenceAgriOpen2025
      ).get('polygon_count'),

    Barren_Fallow:
      ee.Dictionary(
        referenceBarrenFallow2025
      ).get('polygon_count')

  })

);


// ======================================================
// 13. STANDARDIZED DISTANCE TO ONE CLASS
// ======================================================
//
// For every predictor:
//
// |2020 polygon value - 2025 class mean|
// ---------------------------------------
//             class SD
//
// We average the 9 standardized differences.
//
// Smaller = spectrally more similar.
//
// ======================================================

function calculateReferenceDistance(
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
    ).map(
      function(bandName) {

        bandName =
          ee.String(
            bandName
          );


        var value2020 =
          ee.Number(

            feature.get(

              ee.String(
                'y2020_'
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


        return value2020

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
// 14. SCREEN VALID POLYGONS
// ======================================================

var screenedValidPolygons2020 =
  validTemporalPolygons2020.map(
    function(feature) {

      feature =
        ee.Feature(feature);


      var originalClass =
        ee.Number(
          feature.get(
            'class_id'
          )
        );


      // --------------------------------------------------
      // DISTANCE TO FIVE CLASSES
      // --------------------------------------------------

      var distances =
        referenceList2025.map(
          function(reference) {

            return calculateReferenceDistance(
              feature,
              reference
            );

          }
        );


      // --------------------------------------------------
      // BEST DISTANCE
      // --------------------------------------------------

      var minimumDistance =
        ee.Number(
          distances.reduce(
            ee.Reducer.min()
          )
        );


      // --------------------------------------------------
      // BEST CLASS INDEX
      // --------------------------------------------------

      var bestIndex =
        ee.Number(
          distances.indexOf(
            minimumDistance
          )
        );


      var suggestedClass =
        bestIndex.add(1);


      // --------------------------------------------------
      // SECOND BEST CLASS DISTANCE
      // --------------------------------------------------

      var sortedDistances =
        distances.sort();


      var secondBestDistance =
        ee.Number(
          sortedDistances.get(
            1
          )
        );


      var classMargin =
        secondBestDistance
          .subtract(
            minimumDistance
          );


      // --------------------------------------------------
      // DISTANCE TO ORIGINAL CLASS
      // --------------------------------------------------

      var originalClassDistance =
        ee.Number(

          distances.get(

            originalClass
              .subtract(1)

          )

        );


      // --------------------------------------------------
      // SAME CLASS?
      // --------------------------------------------------

      var sameClass =
        suggestedClass.eq(
          originalClass
        );


      // --------------------------------------------------
      // CONSERVATIVE STABILITY RULE
      // --------------------------------------------------

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


      // --------------------------------------------------
      // STATUS
      // --------------------------------------------------

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


      // --------------------------------------------------
      // ORIGINAL -> SUGGESTED
      // --------------------------------------------------

      var transition =
        originalClass
          .format('%d')

          .cat(
            ' -> '
          )

          .cat(
            suggestedClass.format('%d')
          );


      // --------------------------------------------------
      // SAVE RESULT
      // --------------------------------------------------

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
  );


// ======================================================
// 15. COMBINE SCREENED + NO-DATA POLYGONS
// ======================================================

var screenedPolygons2020 =
  screenedValidPolygons2020.merge(
    noDataPolygons2020
  );


// ======================================================
// 16. SPLIT STATUS GROUPS
// ======================================================

var stablePolygons2020 =
  screenedPolygons2020.filter(
    ee.Filter.eq(
      'screening_status',
      'LIKELY_STABLE'
    )
  );


var uncertainPolygons2020 =
  screenedPolygons2020.filter(
    ee.Filter.eq(
      'screening_status',
      'REVIEW_UNCERTAIN'
    )
  );


var changedPolygons2020 =
  screenedPolygons2020.filter(
    ee.Filter.eq(
      'screening_status',
      'REVIEW_CHANGED'
    )
  );


var noDataReviewPolygons2020 =
  screenedPolygons2020.filter(
    ee.Filter.eq(
      'screening_status',
      'NO_DATA_REVIEW'
    )
  );


// ======================================================
// 17. FINAL SCREENING SUMMARY
// ======================================================

print(
  '========================================'
);

print(
  '2025 -> 2020 TEMPORAL SCREENING RESULTS'
);


print(
  'Screening status counts:'
);


print(
  screenedPolygons2020
    .aggregate_histogram(
      'screening_status'
    )
);


print(
  'Original -> Suggested class counts:'
);


print(
  screenedValidPolygons2020
    .aggregate_histogram(
      'suggested_transition'
    )
);


// ======================================================
// 18. TOTAL STATUS COUNTS
// ======================================================

print(

  ee.String(
    'Likely stable polygons: '
  )

    .cat(
      stablePolygons2020
        .size()
        .format('%d')
    )

);


print(

  ee.String(
    'Uncertain polygons: '
  )

    .cat(
      uncertainPolygons2020
        .size()
        .format('%d')
    )

);


print(

  ee.String(
    'Likely changed polygons: '
  )

    .cat(
      changedPolygons2020
        .size()
        .format('%d')
    )

);


print(

  ee.String(
    'No-data review polygons: '
  )

    .cat(
      noDataReviewPolygons2020
        .size()
        .format('%d')
    )

);


// ======================================================
// 19. COUNTS BY ORIGINAL CLASS
// ======================================================

print(
  'LIKELY STABLE by original class:'
);


print(
  stablePolygons2020
    .aggregate_histogram(
      'class_name'
    )
);


print(
  'REVIEW UNCERTAIN by original class:'
);


print(
  uncertainPolygons2020
    .aggregate_histogram(
      'class_name'
    )
);


print(
  'REVIEW CHANGED by original class:'
);


print(
  changedPolygons2020
    .aggregate_histogram(
      'class_name'
    )
);


print(
  'NO DATA by original class:'
);


print(
  noDataReviewPolygons2020
    .aggregate_histogram(
      'class_name'
    )
);


// ======================================================
// 20. MAP LAYERS
// ======================================================
//
// GREEN   = likely stable
// YELLOW  = uncertain
// RED     = likely changed
// MAGENTA = no Landsat data / automatic comparison failed
//
// ======================================================

Map.addLayer(

  stablePolygons2020.style({

    color:
      '00ff00',

    fillColor:
      '00ff0033',

    width:
      3

  }),

  {},

  '2020 - LIKELY STABLE',

  true

);


Map.addLayer(

  uncertainPolygons2020.style({

    color:
      'ffff00',

    fillColor:
      'ffff0033',

    width:
      3

  }),

  {},

  '2020 - REVIEW UNCERTAIN',

  true

);


Map.addLayer(

  changedPolygons2020.style({

    color:
      'ff0000',

    fillColor:
      'ff000044',

    width:
      3

  }),

  {},

  '2020 - REVIEW CHANGED',

  true

);


Map.addLayer(

  noDataReviewPolygons2020.style({

    color:
      'ff00ff',

    fillColor:
      'ff00ff44',

    width:
      3

  }),

  {},

  '2020 - NO DATA REVIEW',

  true

);


// ======================================================
// 21. ALL MANUAL REVIEW POLYGONS
// ======================================================

var reviewPolygons2020 =
  uncertainPolygons2020

    .merge(
      changedPolygons2020
    )

    .merge(
      noDataReviewPolygons2020
    );


print(
  '2020 polygons requiring manual review:'
);


print(
  reviewPolygons2020
);


// ======================================================
// 22. REVIEW POLYGON IDS
// ======================================================

print(
  'Review polygon IDs:'
);


print(
  reviewPolygons2020
    .aggregate_array(
      'poly_id'
    )
);


// ======================================================
// 23. STABLE POLYGON IDS
// ======================================================

print(
  'Likely stable polygon IDs:'
);


print(
  stablePolygons2020
    .aggregate_array(
      'poly_id'
    )
);


print(
  '========================================'
);

print(
  'STAGE 5B COMPLETE'
);

print(
  'Green = candidate for reuse.'
);

print(
  'Yellow/red/magenta = manually inspect.'
);

print(
  '========================================'
);


// ======================================================
// END STAGE 5B
// ======================================================

// ======================================================
// STAGE 5C
// BUILD 2020 TRAINING POOL FROM LIKELY-STABLE POLYGONS
// ======================================================
//
// PURPOSE:
//
// Instead of manually reviewing every yellow/red polygon,
// first test whether the GREEN polygons alone already
// provide enough clean training pixels.
//
// If every class has enough samples:
//
// we can ignore most review polygons completely.
//
// ======================================================


// ======================================================
// 1. SAMPLE 2020 STACK INSIDE GREEN POLYGONS
// ======================================================

var stableTrainingSamples2020 =
  stack2020.sampleRegions({

    collection:
      stablePolygons2020,

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
// 2. BASIC SAMPLE COUNTS
// ======================================================

print(
  '========================================'
);

print(
  'STAGE 5C - 2020 STABLE TRAINING POOL'
);


print(

  ee.String(
    'Stable polygons used: '
  )

    .cat(
      stablePolygons2020
        .size()
        .format('%d')
    )

);


print(

  ee.String(
    'Total 2020 sampled pixels from stable polygons: '
  )

    .cat(
      stableTrainingSamples2020
        .size()
        .format('%d')
    )

);


print(
  '2020 stable training pixels by class:'
);


print(

  stableTrainingSamples2020
    .aggregate_histogram(
      'class_name'
    )

);


print(
  '2020 stable training pixels by class ID:'
);


print(

  stableTrainingSamples2020
    .aggregate_histogram(
      'class_id'
    )

);


// ======================================================
// 3. SPECTRAL QA FUNCTION
// ======================================================

function printStableTrainingMeans2020(
  classId,
  className
) {

  var samples =
    stableTrainingSamples2020.filter(
      ee.Filter.eq(
        'class_id',
        classId
      )
    );


  var n =
    samples.size();


  var meanNDVI =
    ee.Number(
      samples.aggregate_mean(
        'NDVI'
      )
    );


  var meanNDWI =
    ee.Number(
      samples.aggregate_mean(
        'NDWI'
      )
    );


  var meanNDBI =
    ee.Number(
      samples.aggregate_mean(
        'NDBI'
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
        n.format('%d')
      )

      .cat(
        ' | NDVI='
      )

      .cat(
        meanNDVI.format('%.4f')
      )

      .cat(
        ' | NDWI='
      )

      .cat(
        meanNDWI.format('%.4f')
      )

      .cat(
        ' | NDBI='
      )

      .cat(
        meanNDBI.format('%.4f')
      )

  );

}


// ======================================================
// 4. PRINT 2020 STABLE TRAINING SPECTRAL QA
// ======================================================

print(
  '----------------------------------------'
);

print(
  '2020 STABLE TRAINING SPECTRAL QA'
);


printStableTrainingMeans2020(
  1,
  'Built-up'
);


printStableTrainingMeans2020(
  2,
  'Vegetation'
);


printStableTrainingMeans2020(
  3,
  'Water'
);


printStableTrainingMeans2020(
  4,
  'Agricultural/Open'
);


printStableTrainingMeans2020(
  5,
  'Barren/Fallow'
);


print(
  '========================================'
);

print(
  'STAGE 5C COMPLETE'
);

print(
  'Do not add/review polygons yet.'
);

print(
  'First check whether stable polygons already provide enough pixels.'
);

print(
  '========================================'
);


// ======================================================
// END STAGE 5C
// ======================================================

// ======================================================
// STAGE 5D
// 2020 AGRICULTURAL/OPEN TARGETED REVIEW
// ======================================================
//
// We only need extra Agricultural/Open samples.
//
// Therefore we inspect ONLY:
// REVIEW_UNCERTAIN + Agricultural/Open
//
// No need to inspect other classes yet.
//
// ======================================================


// ======================================================
// 1. SELECT UNCERTAIN AGRICULTURAL POLYGONS
// ======================================================

var uncertainAgriPolygons2020 =
  uncertainPolygons2020

    .filter(
      ee.Filter.eq(
        'class_id',
        4
      )
    );


// ======================================================
// 2. PRINT COUNT + IDS
// ======================================================

print(
  '========================================'
);

print(
  'STAGE 5D - 2020 AGRICULTURAL REVIEW'
);


print(
  ee.String(
    'Uncertain Agricultural/Open polygons: '
  )
    .cat(
      uncertainAgriPolygons2020
        .size()
        .format('%d')
    )
);


print(
  'Agricultural review polygon IDs:'
);


print(
  uncertainAgriPolygons2020
    .aggregate_array(
      'poly_id'
    )
);


// ======================================================
// 3. SAMPLE 2020 PIXELS FROM THESE POLYGONS
// ======================================================

var uncertainAgriSamples2020 =
  stack2020.sampleRegions({

    collection:
      uncertainAgriPolygons2020,

    properties: [
      'poly_id',
      'class_id',
      'class_name'
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
// 4. PRINT TOTAL EXTRA PIXELS AVAILABLE
// ======================================================

print(
  ee.String(
    'Total candidate Agricultural/Open pixels available: '
  )
    .cat(
      uncertainAgriSamples2020
        .size()
        .format('%d')
    )
);


// ======================================================
// 5. PIXEL COUNT PER POLYGON
// ======================================================

print(
  'Candidate pixel count by polygon ID:'
);


print(
  uncertainAgriSamples2020
    .aggregate_histogram(
      'poly_id'
    )
);


// ======================================================
// 6. POLYGON-LEVEL 2020 SPECTRAL SUMMARY
// ======================================================

var uncertainAgriStats2020 =
  stack2020.reduceRegions({

    collection:
      uncertainAgriPolygons2020,

    reducer:
      ee.Reducer.mean(),

    scale:
      ANALYSIS_SCALE,

    crs:
      ANALYSIS_CRS,

    tileScale:
      4

  });


print(
  'Uncertain Agricultural/Open polygon statistics:'
);


print(
  uncertainAgriStats2020
    .select([
      'poly_id',
      'NDVI',
      'NDWI',
      'NDBI',
      'blue',
      'green',
      'red',
      'nir',
      'swir1',
      'swir2'
    ])
);


// ======================================================
// 7. MAP ONLY THESE POLYGONS
// ======================================================

Map.addLayer(

  uncertainAgriPolygons2020.style({

    color:
      'ff00ff',

    fillColor:
      'ff00ff33',

    width:
      4

  }),

  {},

  '2020 AGRI REVIEW ONLY',

  true

);


// ======================================================
// 8. 2020 NDVI FOR VISUAL CHECK
// ======================================================

Map.addLayer(

  stack2020.select(
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

  '2020 NDVI - Agri Review',

  false

);


// ======================================================
// 9. 2020 TRUE COLOR ALREADY EXISTS FROM STAGE 5A
// ======================================================
//
// Use:
//
// 2020 True Color
//
// together with:
//
// 2020 AGRI REVIEW ONLY
//
// to visually inspect the six polygons.
//
// ======================================================


print(
  '========================================'
);

print(
  'STAGE 5D COMPLETE'
);

print(
  'Inspect only the magenta Agricultural/Open polygons.'
);

print(
  'Keep a polygon only if it clearly represented agricultural/open land in 2020.'
);

print(
  '========================================'
);


// ======================================================
// END STAGE 5D
// ======================================================
// ======================================================
// STAGE 5D HELPER
// INDIVIDUAL AGRICULTURE REVIEW POLYGON LAYERS
// ======================================================
//
// Creates one map layer for each review polygon.
//
// You can turn each ID on/off individually in Layers.
//
// ======================================================


function addAgriReviewPolygon(
  polygonId
) {

  var polygon =
    uncertainAgriPolygons2020.filter(
      ee.Filter.eq(
        'poly_id',
        polygonId
      )
    );


  Map.addLayer(

    polygon,

    {
      color: 'ff00ff'
    },

    'AGRI ID ' + polygonId,

    false

  );

}


// ======================================================
// ADD SIX INDIVIDUAL REVIEW POLYGONS
// ======================================================

addAgriReviewPolygon(46);

addAgriReviewPolygon(48);

addAgriReviewPolygon(51);

addAgriReviewPolygon(52);

addAgriReviewPolygon(58);

addAgriReviewPolygon(60);


// ======================================================
// END HELPER
// ======================================================

// ======================================================
// STAGE 5E
// FINAL 2020 TRAINING DATASET
// GREEN STABLE + MANUALLY APPROVED AGRICULTURE
// ======================================================
//
// APPROVED AGRICULTURAL POLYGON IDS:
//
// 46
// 48
// 51
// 52
// 58
// 60
//
// Workflow:
//
// 1. Start with all LIKELY_STABLE polygons
// 2. Add approved uncertain Agriculture polygons
// 3. Sample stack2020
// 4. Check raw class counts
// 5. Balance to 120 pixels per class
//
// Final target:
//
// 120 x 5 classes = 600 training pixels
//
// ======================================================


// ======================================================
// 1. APPROVED AGRICULTURAL POLYGON IDS
// ======================================================

var approvedAgriIds2020 =
  ee.List([
    46,
    48,
    51,
    52,
    58,
    60
  ]);


// ======================================================
// 2. SELECT APPROVED AGRICULTURAL POLYGONS
// ======================================================

var approvedAgriPolygons2020 =
  uncertainAgriPolygons2020.filter(
    ee.Filter.inList(
      'poly_id',
      approvedAgriIds2020
    )
  );


// ======================================================
// 3. QA APPROVED POLYGONS
// ======================================================

print(
  '========================================'
);

print(
  'STAGE 5E - FINAL 2020 TRAINING DATASET'
);


print(
  ee.String(
    'Approved Agricultural/Open polygons: '
  )
    .cat(
      approvedAgriPolygons2020
        .size()
        .format('%d')
    )
);


print(
  'Approved Agricultural/Open polygon IDs:'
);


print(
  approvedAgriPolygons2020
    .aggregate_array(
      'poly_id'
    )
);


// ======================================================
// 4. MERGE GREEN STABLE + APPROVED AGRICULTURE
// ======================================================

var finalTrainingPolygons2020 =
  stablePolygons2020
    .merge(
      approvedAgriPolygons2020
    );


// ======================================================
// 5. REMOVE POSSIBLE DUPLICATES BY POLY_ID
// ======================================================
//
// Approved Agriculture polygons come from the uncertain
// set, so they should not already be in stablePolygons2020.
//
// distinct() is still used as a safety check.
//
// ======================================================

finalTrainingPolygons2020 =
  finalTrainingPolygons2020.distinct(
    [
      'poly_id'
    ]
  );


// ======================================================
// 6. PRINT FINAL POLYGON COUNTS
// ======================================================

print(
  ee.String(
    'Final 2020 training polygon count: '
  )
    .cat(
      finalTrainingPolygons2020
        .size()
        .format('%d')
    )
);


print(
  'Final 2020 training polygons by class:'
);


print(
  finalTrainingPolygons2020
    .aggregate_histogram(
      'class_name'
    )
);


// ======================================================
// 7. SAMPLE 2020 STACK
// ======================================================

var trainingSamples2020 =
  stack2020.sampleRegions({

    collection:
      finalTrainingPolygons2020,

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
// 8. PRINT RAW SAMPLE COUNTS
// ======================================================

print(
  ee.String(
    'Raw 2020 training sample count: '
  )
    .cat(
      trainingSamples2020
        .size()
        .format('%d')
    )
);


print(
  'Raw 2020 training pixels by class:'
);


print(
  trainingSamples2020
    .aggregate_histogram(
      'class_name'
    )
);


print(
  'Raw 2020 training pixels by class ID:'
);


print(
  trainingSamples2020
    .aggregate_histogram(
      'class_id'
    )
);


// ======================================================
// 9. OPTIONAL SPECTRAL QA FUNCTION
// ======================================================

function printTrainingMeans2020(
  classId,
  className
) {

  var samples =
    trainingSamples2020.filter(
      ee.Filter.eq(
        'class_id',
        classId
      )
    );


  var n =
    samples.size();


  var meanNDVI =
    ee.Number(
      samples.aggregate_mean(
        'NDVI'
      )
    );


  var meanNDWI =
    ee.Number(
      samples.aggregate_mean(
        'NDWI'
      )
    );


  var meanNDBI =
    ee.Number(
      samples.aggregate_mean(
        'NDBI'
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
        n.format('%d')
      )

      .cat(
        ' | NDVI='
      )

      .cat(
        meanNDVI.format('%.4f')
      )

      .cat(
        ' | NDWI='
      )

      .cat(
        meanNDWI.format('%.4f')
      )

      .cat(
        ' | NDBI='
      )

      .cat(
        meanNDBI.format('%.4f')
      )

  );

}


// ======================================================
// 10. PRINT RAW SPECTRAL QA
// ======================================================

print(
  '----------------------------------------'
);

print(
  '2020 FINAL RAW TRAINING SPECTRAL QA'
);


printTrainingMeans2020(
  1,
  'Built-up'
);


printTrainingMeans2020(
  2,
  'Vegetation'
);


printTrainingMeans2020(
  3,
  'Water'
);


printTrainingMeans2020(
  4,
  'Agricultural/Open'
);


printTrainingMeans2020(
  5,
  'Barren/Fallow'
);


// ======================================================
// 11. BALANCING SETTINGS
// ======================================================

var TRAINING_PIXELS_PER_CLASS_2020 =
  120;


var TRAINING_RANDOM_SEED_2020 =
  42;


// ======================================================
// 12. ADD REPRODUCIBLE RANDOM COLUMN
// ======================================================

var randomizedTrainingSamples2020 =
  trainingSamples2020.randomColumn(
    'random_value_2020',
    TRAINING_RANDOM_SEED_2020
  );


// ======================================================
// 13. SELECT BALANCED CLASS FUNCTION
// ======================================================

function selectBalancedTrainingClass2020(
  classId
) {

  return randomizedTrainingSamples2020

    .filter(
      ee.Filter.eq(
        'class_id',
        classId
      )
    )

    .sort(
      'random_value_2020'
    )

    .limit(
      TRAINING_PIXELS_PER_CLASS_2020
    );

}


// ======================================================
// 14. SELECT 120 PIXELS PER CLASS
// ======================================================

var balancedBuiltup2020 =
  selectBalancedTrainingClass2020(
    1
  );


var balancedVegetation2020 =
  selectBalancedTrainingClass2020(
    2
  );


var balancedWater2020 =
  selectBalancedTrainingClass2020(
    3
  );


var balancedAgriOpen2020 =
  selectBalancedTrainingClass2020(
    4
  );


var balancedBarrenFallow2020 =
  selectBalancedTrainingClass2020(
    5
  );


// ======================================================
// 15. MERGE FINAL BALANCED TRAINING SET
// ======================================================

var finalTraining2020 =
  balancedBuiltup2020

    .merge(
      balancedVegetation2020
    )

    .merge(
      balancedWater2020
    )

    .merge(
      balancedAgriOpen2020
    )

    .merge(
      balancedBarrenFallow2020
    );


// ======================================================
// 16. FINAL BALANCED TRAINING QA
// ======================================================

print(
  '========================================'
);

print(
  '2020 FINAL BALANCED TRAINING SET'
);


print(
  ee.String(
    'Final 2020 training pixel count: '
  )
    .cat(
      finalTraining2020
        .size()
        .format('%d')
    )
);


print(
  'Final 2020 pixels by class:'
);


print(
  finalTraining2020
    .aggregate_histogram(
      'class_name'
    )
);


print(
  'Final 2020 pixels by class ID:'
);


print(
  finalTraining2020
    .aggregate_histogram(
      'class_id'
    )
);


// ======================================================
// 17. VERIFY PROPERTIES
// ======================================================

var firstFinalTraining2020 =
  ee.Feature(
    finalTraining2020.first()
  );


print(
  'Final 2020 training sample properties:'
);


print(
  firstFinalTraining2020
    .propertyNames()
);


// ======================================================
// 18. MAP APPROVED AGRICULTURE
// ======================================================

Map.addLayer(

  approvedAgriPolygons2020.style({

    color:
      '00ffff',

    fillColor:
      '00ffff33',

    width:
      4

  }),

  {},

  '2020 APPROVED AGRI POLYGONS',

  true

);


// ======================================================
// 19. MAP FINAL TRAINING POLYGONS
// ======================================================

Map.addLayer(

  finalTrainingPolygons2020.style({

    color:
      'ffffff',

    fillColor:
      'ffffff11',

    width:
      2

  }),

  {},

  '2020 FINAL TRAINING POLYGONS',

  false

);


print(
  '========================================'
);

print(
  'STAGE 5E COMPLETE'
);

print(
  'Expected final balanced training set: 600 pixels.'
);

print(
  'Expected: 120 pixels per class.'
);

print(
  '========================================'
);


// ======================================================
// END STAGE 5E
// ======================================================

// ======================================================
// STAGE 5F
// 2025 -> 2020 VALIDATION TEMPORAL TRANSFER
// ======================================================
//
// PURPOSE:
//
// Reuse the independent 2025 validation polygons
// for 2020 wherever the class appears temporally stable.
//
// IMPORTANT:
//
// These are VALIDATION polygons.
//
// They remain completely separate from the 2020
// training polygons.
//
// ======================================================


// ======================================================
// 1. LOAD 2025 MASTER VALIDATION POLYGONS
// ======================================================

var masterValidationPolygons2025 =
  ee.FeatureCollection(
    'projects/assignment-482806/assets/chennai_validation_polygons_2025_master'
  );


// ======================================================
// 2. ADD UNIQUE VALIDATION POLYGON IDS
// ======================================================

var validationPolygonCount2025 =
  masterValidationPolygons2025.size();


var validationPolygonList2025 =
  masterValidationPolygons2025.toList(
    validationPolygonCount2025
  );


var validationSequence2025 =
  ee.List.sequence(
    0,
    validationPolygonCount2025.subtract(1)
  );


var validationPolygonsIndexed2025 =
  ee.FeatureCollection(

    validationSequence2025.map(
      function(index) {

        index =
          ee.Number(index);


        var feature =
          ee.Feature(
            validationPolygonList2025.get(
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
// 3. QA VALIDATION POLYGON ASSET
// ======================================================

print(
  '========================================'
);

print(
  'STAGE 5F - 2020 VALIDATION TRANSFER'
);


print(

  ee.String(
    '2025 validation polygon count: '
  )

    .cat(
      validationPolygonsIndexed2025
        .size()
        .format('%d')
    )

);


print(
  '2025 validation polygons by class:'
);


print(

  validationPolygonsIndexed2025
    .aggregate_histogram(
      'class_name'
    )

);


// ======================================================
// 4. TEMPORAL STACK ALREADY EXISTS
// ======================================================
//
// temporalComparisonStack:
//
// 2025 predictors +
// 2020 predictors
//
// created in Stage 5B.
//
// ======================================================


// ======================================================
// 5. SAMPLE 2025 + 2020 MEANS FOR VALIDATION POLYGONS
// ======================================================

var validationTemporalStatsRaw2020 =
  temporalComparisonStack.reduceRegions({

    collection:
      validationPolygonsIndexed2025,

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
// 6. REMOVE POLYGONS WITH MISSING TEMPORAL DATA
// ======================================================

var validValidationTemporal2020 =
  validationTemporalStatsRaw2020.filter(

    ee.Filter.notNull(
      requiredTemporalProperties
    )

  );


// ======================================================
// 7. IDENTIFY NO-DATA VALIDATION POLYGONS
// ======================================================

var validationIdMatch =
  ee.Filter.equals({

    leftField:
      'val_poly_id',

    rightField:
      'val_poly_id'

  });


var noDataValidationPolygons2020 =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      validationTemporalStatsRaw2020,

      validValidationTemporal2020,

      validationIdMatch

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


// ======================================================
// 8. BASIC DATA QA
// ======================================================

print(

  ee.String(
    'Validation polygons with complete 2020 + 2025 data: '
  )

    .cat(
      validValidationTemporal2020
        .size()
        .format('%d')
    )

);


print(

  ee.String(
    'Validation polygons with missing temporal data: '
  )

    .cat(
      noDataValidationPolygons2020
        .size()
        .format('%d')
    )

);


print(
  'Validation NO_DATA IDs:'
);


print(

  noDataValidationPolygons2020
    .aggregate_array(
      'val_poly_id'
    )

);


// ======================================================
// 9. SCREEN VALIDATION POLYGONS
// ======================================================
//
// Uses the SAME 2025 class reference signatures
// created for training screening.
//
// This prevents us from inventing a different rule
// just for validation.
//
// ======================================================

var screenedValidValidation2020 =
  validValidationTemporal2020.map(
    function(feature) {

      feature =
        ee.Feature(feature);


      var originalClass =
        ee.Number(
          feature.get(
            'class_id'
          )
        );


      // --------------------------------------------------
      // DISTANCE TO EACH 2025 CLASS REFERENCE
      // --------------------------------------------------

      var distances =
        referenceList2025.map(
          function(reference) {

            return calculateReferenceDistance(
              feature,
              reference
            );

          }
        );


      // --------------------------------------------------
      // BEST CLASS
      // --------------------------------------------------

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
        bestIndex.add(1);


      // --------------------------------------------------
      // SECOND-BEST DISTANCE
      // --------------------------------------------------

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


      // --------------------------------------------------
      // ORIGINAL CLASS DISTANCE
      // --------------------------------------------------

      var originalClassDistance =
        ee.Number(

          distances.get(

            originalClass.subtract(
              1
            )

          )

        );


      // --------------------------------------------------
      // SAME CLASS?
      // --------------------------------------------------

      var sameClass =
        suggestedClass.eq(
          originalClass
        );


      // --------------------------------------------------
      // SAME CONSERVATIVE RULE AS TRAINING SCREENING
      // --------------------------------------------------

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


      // --------------------------------------------------
      // STATUS
      // --------------------------------------------------

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


      // --------------------------------------------------
      // TRANSITION
      // --------------------------------------------------

      var transition =
        originalClass
          .format('%d')

          .cat(
            ' -> '
          )

          .cat(
            suggestedClass
              .format('%d')
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
  );


// ======================================================
// 10. MERGE VALID + NO-DATA RESULTS
// ======================================================

var screenedValidationPolygons2020 =
  screenedValidValidation2020.merge(
    noDataValidationPolygons2020
  );


// ======================================================
// 11. SPLIT SCREENING GROUPS
// ======================================================

var stableValidationPolygons2020 =
  screenedValidationPolygons2020.filter(
    ee.Filter.eq(
      'screening_status',
      'LIKELY_STABLE'
    )
  );


var uncertainValidationPolygons2020 =
  screenedValidationPolygons2020.filter(
    ee.Filter.eq(
      'screening_status',
      'REVIEW_UNCERTAIN'
    )
  );


var changedValidationPolygons2020 =
  screenedValidationPolygons2020.filter(
    ee.Filter.eq(
      'screening_status',
      'REVIEW_CHANGED'
    )
  );


var noDataValidationReview2020 =
  screenedValidationPolygons2020.filter(
    ee.Filter.eq(
      'screening_status',
      'NO_DATA_REVIEW'
    )
  );


// ======================================================
// 12. PRINT SCREENING SUMMARY
// ======================================================

print(
  '----------------------------------------'
);

print(
  '2020 VALIDATION TEMPORAL SCREENING RESULTS'
);


print(
  'Validation screening status counts:'
);


print(

  screenedValidationPolygons2020
    .aggregate_histogram(
      'screening_status'
    )

);


print(
  'Validation original -> suggested transitions:'
);


print(

  screenedValidValidation2020
    .aggregate_histogram(
      'suggested_transition'
    )

);


// ======================================================
// 13. PRINT COUNTS BY ORIGINAL CLASS
// ======================================================

print(
  'LIKELY STABLE validation polygons by class:'
);


print(

  stableValidationPolygons2020
    .aggregate_histogram(
      'class_name'
    )

);


print(
  'REVIEW UNCERTAIN validation polygons by class:'
);


print(

  uncertainValidationPolygons2020
    .aggregate_histogram(
      'class_name'
    )

);


print(
  'REVIEW CHANGED validation polygons by class:'
);


print(

  changedValidationPolygons2020
    .aggregate_histogram(
      'class_name'
    )

);


print(
  'NO DATA validation polygons by class:'
);


print(

  noDataValidationReview2020
    .aggregate_histogram(
      'class_name'
    )

);


// ======================================================
// 14. SAMPLE ONLY STABLE VALIDATION POLYGONS
// ======================================================

var stableValidationSamples2020 =
  stack2020.sampleRegions({

    collection:
      stableValidationPolygons2020,

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
// 15. PRINT STABLE VALIDATION PIXEL COUNTS
// ======================================================

print(
  '----------------------------------------'
);

print(
  '2020 STABLE VALIDATION PIXEL POOL'
);


print(

  ee.String(
    'Total stable validation pixels: '
  )

    .cat(
      stableValidationSamples2020
        .size()
        .format('%d')
    )

);


print(
  'Stable validation pixels by class:'
);


print(

  stableValidationSamples2020
    .aggregate_histogram(
      'class_name'
    )

);


// ======================================================
// 16. MAP SCREENING GROUPS
// ======================================================

Map.addLayer(

  stableValidationPolygons2020.style({

    color:
      '00ff00',

    fillColor:
      '00ff0033',

    width:
      3

  }),

  {},

  '2020 VALIDATION - STABLE',

  false

);


Map.addLayer(

  uncertainValidationPolygons2020.style({

    color:
      'ffff00',

    fillColor:
      'ffff0033',

    width:
      3

  }),

  {},

  '2020 VALIDATION - UNCERTAIN',

  false

);


Map.addLayer(

  changedValidationPolygons2020.style({

    color:
      'ff0000',

    fillColor:
      'ff000044',

    width:
      3

  }),

  {},

  '2020 VALIDATION - CHANGED',

  false

);


Map.addLayer(

  noDataValidationReview2020.style({

    color:
      'ff00ff',

    fillColor:
      'ff00ff44',

    width:
      3

  }),

  {},

  '2020 VALIDATION - NO DATA',

  false

);


print(
  '========================================'
);

print(
  'STAGE 5F COMPLETE'
);

print(
  'First inspect whether the stable validation pool alone is sufficient.'
);

print(
  '========================================'
);


// ======================================================
// END STAGE 5F
// ======================================================

// ======================================================
// STAGE 5G
// 2020 BUILT-UP VALIDATION TARGETED REVIEW
// ======================================================
//
// GOAL:
//
// Only Built-up validation is short.
//
// Stable validation pixels:
//
// Built-up              = 10
// Vegetation            = 84
// Water                 = 216
// Agricultural/Open     = 61
// Barren/Fallow         = 116
//
// Therefore:
//
// inspect ONLY the Built-up validation polygons that
// were flagged REVIEW_CHANGED.
//
// ======================================================


// ======================================================
// 1. SELECT CHANGED BUILT-UP VALIDATION POLYGONS
// ======================================================

var changedBuiltupValidation2020 =
  changedValidationPolygons2020.filter(
    ee.Filter.eq(
      'class_id',
      1
    )
  );


// ======================================================
// 2. PRINT COUNT + IDS
// ======================================================

print(
  '========================================'
);

print(
  'STAGE 5G - 2020 BUILT-UP VALIDATION REVIEW'
);


print(

  ee.String(
    'Changed Built-up validation polygons: '
  )

    .cat(
      changedBuiltupValidation2020
        .size()
        .format('%d')
    )

);


print(
  'Built-up validation review IDs:'
);


print(

  changedBuiltupValidation2020
    .aggregate_array(
      'val_poly_id'
    )

);


// ======================================================
// 3. SAMPLE THESE POLYGONS ON THE 2020 STACK
// ======================================================

var changedBuiltupValidationSamples2020 =
  stack2020.sampleRegions({

    collection:
      changedBuiltupValidation2020,

    properties: [
      'val_poly_id',
      'class_id',
      'class_name'
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
// 4. PRINT TOTAL AVAILABLE BUILT-UP CANDIDATE PIXELS
// ======================================================

print(

  ee.String(
    'Candidate Built-up validation pixels available: '
  )

    .cat(
      changedBuiltupValidationSamples2020
        .size()
        .format('%d')
    )

);


// ======================================================
// 5. PRINT PIXEL COUNT PER POLYGON
// ======================================================

print(
  'Candidate Built-up pixels by validation polygon ID:'
);


print(

  changedBuiltupValidationSamples2020
    .aggregate_histogram(
      'val_poly_id'
    )

);


// ======================================================
// 6. POLYGON-LEVEL 2020 SPECTRAL STATISTICS
// ======================================================

var changedBuiltupValidationStats2020 =
  stack2020.reduceRegions({

    collection:
      changedBuiltupValidation2020,

    reducer:
      ee.Reducer.mean(),

    scale:
      ANALYSIS_SCALE,

    crs:
      ANALYSIS_CRS,

    tileScale:
      4

  });


print(
  'Changed Built-up validation polygon statistics:'
);


print(

  changedBuiltupValidationStats2020
    .select([
      'val_poly_id',
      'NDVI',
      'NDWI',
      'NDBI',
      'blue',
      'green',
      'red',
      'nir',
      'swir1',
      'swir2'
    ])

);


// ======================================================
// 7. MAP ALL BUILT-UP REVIEW POLYGONS
// ======================================================

Map.addLayer(

  changedBuiltupValidation2020.style({

    color:
      'ff00ff',

    fillColor:
      'ff00ff33',

    width:
      4

  }),

  {},

  '2020 BUILT-UP VALIDATION REVIEW',

  true

);


// ======================================================
// 8. AUTOMATICALLY CREATE ONE TOGGLE LAYER PER ID
// ======================================================
//
// This avoids the earlier problem where IDs were hard
// to identify on the map.
//
// After this runs, the Layers panel will contain:
//
// VAL BUILT-UP ID xx
// VAL BUILT-UP ID xx
// ...
//
// Turn them on one at a time.
//
// ======================================================

changedBuiltupValidation2020
  .aggregate_array(
    'val_poly_id'
  )
  .evaluate(
    function(ids) {

      ids.forEach(
        function(id) {

          var onePolygon =
            changedBuiltupValidation2020.filter(
              ee.Filter.eq(
                'val_poly_id',
                id
              )
            );


          Map.addLayer(

            onePolygon,

            {
              color: 'ff00ff'
            },

            'VAL BUILT-UP ID ' + id,

            false

          );

        }
      );

    }
  );


// ======================================================
// 9. ADD 2020 NDBI FOR OPTIONAL INSPECTION
// ======================================================

Map.addLayer(

  stack2020.select(
    'NDBI'
  ),

  {

    min:
      -0.3,

    max:
      0.3,

    palette: [
      '006400',
      'ffff00',
      'ff0000'
    ]

  },

  '2020 NDBI - Built-up Review',

  false

);


// ======================================================
// 10. INSTRUCTIONS
// ======================================================

print(
  '========================================'
);

print(
  'STAGE 5G COMPLETE'
);

print(
  'Inspect each VAL BUILT-UP ID layer individually.'
);

print(
  'Use 2020 True Color as the primary reference.'
);

print(
  'Keep only locations that were clearly built-up / impervious in 2020.'
);

print(
  '========================================'
);


// ======================================================
// END STAGE 5G
// ======================================================

// ======================================================
// STAGE 5H
// FINAL CLEAN BALANCED 2020 VALIDATION SET
// ======================================================
//
// APPROVED BUILT-UP VALIDATION IDS:
//
// 1, 2, 3, 4, 6, 7
//
// Workflow:
//
// Stable validation polygons
//        +
// manually approved Built-up polygons
//        ↓
// sample 2020 stack
//        ↓
// remove pixels within 30 m of 2020 training polygons
//        ↓
// balance to 60 pixels/class
//
// Final target:
//
// 60 x 5 = 300 independent validation pixels
//
// ======================================================


// ======================================================
// 1. APPROVED BUILT-UP VALIDATION IDS
// ======================================================

var approvedBuiltupValidationIds2020 =
  ee.List([
    1,
    2,
    3,
    4,
    6,
    7
  ]);


// ======================================================
// 2. SELECT APPROVED BUILT-UP VALIDATION POLYGONS
// ======================================================

var approvedBuiltupValidationPolygons2020 =
  changedBuiltupValidation2020.filter(
    ee.Filter.inList(
      'val_poly_id',
      approvedBuiltupValidationIds2020
    )
  );


// ======================================================
// 3. QA APPROVED BUILT-UP POLYGONS
// ======================================================

print(
  '========================================'
);

print(
  'STAGE 5H - FINAL 2020 VALIDATION DATASET'
);


print(
  ee.String(
    'Approved Built-up validation polygons: '
  )
    .cat(
      approvedBuiltupValidationPolygons2020
        .size()
        .format('%d')
    )
);


print(
  'Approved Built-up validation IDs:'
);


print(
  approvedBuiltupValidationPolygons2020
    .aggregate_array(
      'val_poly_id'
    )
);


// ======================================================
// 4. MERGE STABLE + APPROVED BUILT-UP VALIDATION POLYGONS
// ======================================================

var finalValidationPolygons2020 =
  stableValidationPolygons2020
    .merge(
      approvedBuiltupValidationPolygons2020
    )
    .distinct(
      [
        'val_poly_id'
      ]
    );


// ======================================================
// 5. POLYGON QA
// ======================================================

print(
  ee.String(
    'Final candidate 2020 validation polygons: '
  )
    .cat(
      finalValidationPolygons2020
        .size()
        .format('%d')
    )
);


print(
  'Candidate validation polygons by class:'
);


print(
  finalValidationPolygons2020
    .aggregate_histogram(
      'class_name'
    )
);


// ======================================================
// 6. SAMPLE 2020 STACK INSIDE VALIDATION POLYGONS
// ======================================================

var rawValidationSamples2020 =
  stack2020.sampleRegions({

    collection:
      finalValidationPolygons2020,

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
// 7. RAW VALIDATION SAMPLE QA
// ======================================================

print(
  ee.String(
    'Raw candidate validation pixels: '
  )
    .cat(
      rawValidationSamples2020
        .size()
        .format('%d')
    )
);


print(
  'Raw candidate validation pixels by class:'
);


print(
  rawValidationSamples2020
    .aggregate_histogram(
      'class_name'
    )
);


// ======================================================
// 8. CREATE 30 m TRAINING EXCLUSION BUFFER
// ======================================================
//
// Same principle as 2025:
//
// Validation pixels must not fall within approximately
// one Landsat pixel of the training polygons.
//
// ======================================================

var trainingExclusionBuffer2020 =
  finalTrainingPolygons2020
    .map(
      function(feature) {

        return ee.Feature(
          feature
        ).buffer(
          30
        );

      }
    );


// ======================================================
// 9. REMOVE VALIDATION PIXELS INSIDE TRAINING BUFFER
// ======================================================
//
// Spatial join:
// keep validation pixels that DO NOT intersect
// the buffered training polygons.
//
// ======================================================

var spatialIntersectionFilter2020 =
  ee.Filter.intersects({

    leftField:
      '.geo',

    rightField:
      '.geo',

    maxError:
      1

  });


var cleanValidationSamples2020 =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      rawValidationSamples2020,

      trainingExclusionBuffer2020,

      spatialIntersectionFilter2020

    )

  );


// ======================================================
// 10. CLEAN VALIDATION QA
// ======================================================

print(
  '----------------------------------------'
);

print(
  '2020 VALIDATION AFTER 30 m TRAINING EXCLUSION'
);


print(
  ee.String(
    'Clean validation pixel pool: '
  )
    .cat(
      cleanValidationSamples2020
        .size()
        .format('%d')
    )
);


print(
  'Clean validation pixels by class:'
);


print(
  cleanValidationSamples2020
    .aggregate_histogram(
      'class_name'
    )
);


// ======================================================
// 11. VERIFY DIRECT TRAINING / VALIDATION OVERLAP
// ======================================================
//
// Should be ZERO after exclusion.
//
// ======================================================

var remainingOverlap2020 =
  ee.FeatureCollection(

    ee.Join.inner().apply(

      cleanValidationSamples2020,

      trainingExclusionBuffer2020,

      spatialIntersectionFilter2020

    )

  );


print(
  ee.String(
    'Remaining validation pixels intersecting 30 m training buffer: '
  )
    .cat(
      remainingOverlap2020
        .size()
        .format('%d')
    )
);


// ======================================================
// 12. VALIDATION BALANCE SETTINGS
// ======================================================

var VALIDATION_PIXELS_PER_CLASS_2020 =
  60;


var VALIDATION_RANDOM_SEED_2020 =
  84;


// ======================================================
// 13. RANDOMIZE CLEAN VALIDATION POOL
// ======================================================

var randomizedValidation2020 =
  cleanValidationSamples2020.randomColumn(
    'random_value_2020',
    VALIDATION_RANDOM_SEED_2020
  );


// ======================================================
// 14. BALANCING FUNCTION
// ======================================================

function selectBalancedValidationClass2020(
  classId
) {

  return randomizedValidation2020

    .filter(
      ee.Filter.eq(
        'class_id',
        classId
      )
    )

    .sort(
      'random_value_2020'
    )

    .limit(
      VALIDATION_PIXELS_PER_CLASS_2020
    );

}


// ======================================================
// 15. SELECT 60 PIXELS PER CLASS
// ======================================================

var validationBuiltup2020 =
  selectBalancedValidationClass2020(
    1
  );


var validationVegetation2020 =
  selectBalancedValidationClass2020(
    2
  );


var validationWater2020 =
  selectBalancedValidationClass2020(
    3
  );


var validationAgriOpen2020 =
  selectBalancedValidationClass2020(
    4
  );


var validationBarrenFallow2020 =
  selectBalancedValidationClass2020(
    5
  );


// ======================================================
// 16. MERGE FINAL BALANCED VALIDATION SET
// ======================================================

var finalValidationClean2020 =
  validationBuiltup2020

    .merge(
      validationVegetation2020
    )

    .merge(
      validationWater2020
    )

    .merge(
      validationAgriOpen2020
    )

    .merge(
      validationBarrenFallow2020
    );


// ======================================================
// 17. FINAL VALIDATION QA
// ======================================================

print(
  '========================================'
);

print(
  '2020 FINAL CLEAN BALANCED VALIDATION SET'
);


print(
  ee.String(
    'Final validation pixel count: '
  )
    .cat(
      finalValidationClean2020
        .size()
        .format('%d')
    )
);


print(
  'Final validation pixels by class:'
);


print(
  finalValidationClean2020
    .aggregate_histogram(
      'class_name'
    )
);


print(
  'Final validation pixels by class ID:'
);


print(
  finalValidationClean2020
    .aggregate_histogram(
      'class_id'
    )
);


// ======================================================
// 18. FINAL SAMPLE PROPERTIES
// ======================================================

print(
  'Final 2020 validation sample properties:'
);


print(
  ee.Feature(
    finalValidationClean2020.first()
  ).propertyNames()
);


// ======================================================
// 19. OPTIONAL FINAL MAP LAYERS
// ======================================================

Map.addLayer(

  approvedBuiltupValidationPolygons2020.style({

    color:
      '00ffff',

    fillColor:
      '00ffff33',

    width:
      4

  }),

  {},

  '2020 APPROVED BUILT-UP VALIDATION',

  false

);


Map.addLayer(

  finalValidationPolygons2020.style({

    color:
      'ffff00',

    fillColor:
      'ffff0011',

    width:
      2

  }),

  {},

  '2020 FINAL VALIDATION POLYGONS',

  false

);


// ======================================================
// 20. COMPLETE
// ======================================================

print(
  '========================================'
);

print(
  'STAGE 5H COMPLETE'
);

print(
  'Expected final validation set: 300 pixels.'
);

print(
  'Expected: 60 pixels per class.'
);

print(
  'Remaining 30 m training overlap must be 0.'
);

print(
  '========================================'
);


// ======================================================
// END STAGE 5H
// ======================================================

// ======================================================
// STAGE 5I
// 2020 GAUSSIAN MAXIMUM LIKELIHOOD CLASSIFICATION
// FINAL CORRECTED + LIGHTER VERSION
// ======================================================
//
// Uses:
//
// finalTraining2020
// finalValidationClean2020
// stack2020
// chennaiROI
//
// Method:
// Gaussian Maximum Likelihood Classification
// with class-specific mean vectors and covariance matrices.
// Equal priors are used because training is balanced.
//
// IMPORTANT FIXES IN THIS VERSION:
//
// 1. Uses chennaiROI consistently (no undefined "roi").
// 2. Uses FeatureCollection.makeArray() for covariance.
// 3. Uses a true 9 x 1 mean column vector.
// 4. Uses fixed client-side score band names.
// 5. Uses single-argument print() calls to remove the
//    Code Editor "Too many arguments" warnings.
// 6. Builds a much smaller computation graph than the
//    previous version, reducing browser freezes.
//
// ======================================================


// ======================================================
// 1. MLC BAND ORDER
// ======================================================

var MLC_BANDS_2020 = [
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
// 2. CONSTANTS
// ======================================================

var NUM_MLC_BANDS_2020 =
  MLC_BANDS_2020.length;


var MLC_REGULARIZATION_2020 =
  1e-6;


// ======================================================
// 3. BUILD PARAMETERS FOR ONE CLASS
// ======================================================

function buildMlcClassParameters2020(
  classId
) {

  var classSamples =
    finalTraining2020.filter(
      ee.Filter.eq(
        'class_id',
        classId
      )
    );


  // ----------------------------------------------------
  // CLASS MEAN VECTOR
  // ----------------------------------------------------
  //
  // Start as 1 x 9 then transpose to 9 x 1.
  // This matches the 9 x 1 predictor array image.
  //
  // ----------------------------------------------------

  var meanValues =
    MLC_BANDS_2020.map(
      function(bandName) {

        return classSamples.aggregate_mean(
          bandName
        );

      }
    );


  var meanVector =
    ee.Array([
      meanValues
    ]).transpose();


  // ----------------------------------------------------
  // COVARIANCE MATRIX
  // ----------------------------------------------------
  //
  // makeArray() places the nine numeric predictors into
  // one 1-D array property for each sample.
  //
  // ee.Reducer.covariance() then reduces those sample
  // arrays into a 9 x 9 covariance matrix.
  //
  // This is considerably lighter than repeatedly calling
  // aggregate_mean() inside a FeatureCollection.map().
  //
  // ----------------------------------------------------

  var classSamplesWithArray =
    classSamples.makeArray(
      MLC_BANDS_2020,
      'mlc_array_2020'
    );


  var covarianceDictionary =
    classSamplesWithArray.reduceColumns({

      reducer:
        ee.Reducer
          .covariance()
          .setOutputs([
            'covariance'
          ]),

      selectors: [
        'mlc_array_2020'
      ]

    });


  var rawCovariance =
    ee.Array(
      covarianceDictionary.get(
        'covariance'
      )
    );


  // ----------------------------------------------------
  // DIAGONAL REGULARIZATION
  // ----------------------------------------------------

  var identity =
    ee.Array.identity(
      NUM_MLC_BANDS_2020
    );


  var regularizedCovariance =
    rawCovariance.add(
      identity.multiply(
        MLC_REGULARIZATION_2020
      )
    );


  // ----------------------------------------------------
  // DETERMINANTS + INVERSE
  // ----------------------------------------------------

  var rawDeterminant =
    rawCovariance.matrixDeterminant();


  var regularizedDeterminant =
    regularizedCovariance.matrixDeterminant();


  var inverseCovariance =
    regularizedCovariance.matrixInverse();


  return ee.Dictionary({

    class_id:
      classId,

    sample_count:
      classSamples.size(),

    mean:
      meanVector,

    raw_covariance:
      rawCovariance,

    covariance:
      regularizedCovariance,

    raw_determinant:
      rawDeterminant,

    determinant:
      regularizedDeterminant,

    inverse:
      inverseCovariance

  });

}


// ======================================================
// 4. BUILD ALL FIVE CLASS PARAMETER SETS
// ======================================================

var mlcParams2020 =
  ee.List([

    buildMlcClassParameters2020(1),

    buildMlcClassParameters2020(2),

    buildMlcClassParameters2020(3),

    buildMlcClassParameters2020(4),

    buildMlcClassParameters2020(5)

  ]);


// ======================================================
// 5. PARAMETER QA
// ======================================================

print(
  '========================================'
);

print(
  'STAGE 5I - 2020 MLC COVARIANCE QA'
);

print(
  'MLC predictor order:'
);

print(
  ee.List(
    MLC_BANDS_2020
  )
);


var MLC_CLASS_NAMES_2020 = [
  'Built-up',
  'Vegetation',
  'Water',
  'Agricultural/Open',
  'Barren/Fallow'
];


for (
  var mlcQaIndex2020 = 0;
  mlcQaIndex2020 < 5;
  mlcQaIndex2020++
) {

  var qaParams2020 =
    ee.Dictionary(
      mlcParams2020.get(
        mlcQaIndex2020
      )
    );


  var qaClassName2020 =
    MLC_CLASS_NAMES_2020[
      mlcQaIndex2020
    ];


  var qaLine2020 =
    ee.String(
      qaClassName2020
    )
      .cat(
        ' | n='
      )
      .cat(
        ee.Number(
          qaParams2020.get(
            'sample_count'
          )
        ).format('%d')
      )
      .cat(
        ' | raw determinant='
      )
      .cat(
        ee.Number(
          qaParams2020.get(
            'raw_determinant'
          )
        ).format('%.12e')
      )
      .cat(
        ' | regularized determinant='
      )
      .cat(
        ee.Number(
          qaParams2020.get(
            'determinant'
          )
        ).format('%.12e')
      );


  print(
    qaLine2020
  );

}


// ======================================================
// 6. PREDICTOR ARRAY IMAGE
// ======================================================
//
// stack2020.toArray()       -> [9]
// .toArray(1)               -> [9, 1]
//
// ======================================================

var predictorColumnImage2020 =
  stack2020
    .select(
      MLC_BANDS_2020
    )
    .toArray()
    .toArray(1);


// ======================================================
// 7. CREATE GAUSSIAN LOG-LIKELIHOOD SCORE
// ======================================================
//
// g_c(x) =
// -0.5 * ln(|Sigma_c|)
// -0.5 * (x-mu_c)' Sigma_c^-1 (x-mu_c)
//
// Equal priors are used, so ln(P(class)) is constant
// across classes and does not affect the argmax.
//
// ======================================================

function createMlcScoreImage2020(
  classParams,
  scoreBandName
) {

  classParams =
    ee.Dictionary(
      classParams
    );


  var meanVector =
    ee.Array(
      classParams.get(
        'mean'
      )
    );


  var inverseCovariance =
    ee.Array(
      classParams.get(
        'inverse'
      )
    );


  var determinant =
    ee.Number(
      classParams.get(
        'determinant'
      )
    )
    .max(
      1e-300
    );


  var meanImage =
    ee.Image.constant(
      meanVector
    );


  var inverseImage =
    ee.Image.constant(
      inverseCovariance
    );


  var difference =
    predictorColumnImage2020.subtract(
      meanImage
    );


  var mahalanobisSquared =
    difference
      .arrayTranspose()
      .matrixMultiply(
        inverseImage
      )
      .matrixMultiply(
        difference
      )
      .arrayGet(
        [0, 0]
      );


  var logDeterminantTerm =
    ee.Image.constant(
      determinant.log()
    );


  var score =
    mahalanobisSquared
      .multiply(
        -0.5
      )
      .add(
        logDeterminantTerm.multiply(
          -0.5
        )
      )
      .rename(
        scoreBandName
      );


  return score;

}


// ======================================================
// 8. CREATE FIVE SCORE IMAGES
// ======================================================

var score2020_1 =
  createMlcScoreImage2020(
    mlcParams2020.get(0),
    'score_1'
  );


var score2020_2 =
  createMlcScoreImage2020(
    mlcParams2020.get(1),
    'score_2'
  );


var score2020_3 =
  createMlcScoreImage2020(
    mlcParams2020.get(2),
    'score_3'
  );


var score2020_4 =
  createMlcScoreImage2020(
    mlcParams2020.get(3),
    'score_4'
  );


var score2020_5 =
  createMlcScoreImage2020(
    mlcParams2020.get(4),
    'score_5'
  );


// ======================================================
// 9. STACK SCORES
// ======================================================

var mlcScoreStack2020 =
  score2020_1
    .addBands(
      score2020_2
    )
    .addBands(
      score2020_3
    )
    .addBands(
      score2020_4
    )
    .addBands(
      score2020_5
    );


// ======================================================
// 10. ARGMAX -> CLASS IDS 1..5
// ======================================================

var classified2020 =
  mlcScoreStack2020
    .toArray()
    .arrayArgmax()
    .arrayGet(
      [0]
    )
    .add(
      1
    )
    .rename(
      'classification'
    )
    .toInt8()
    .clip(
      chennaiROI
    );


// ======================================================
// 11. CLASSIFICATION QA
// ======================================================

var classRange2020 =
  classified2020.reduceRegion({

    reducer:
      ee.Reducer.minMax(),

    geometry:
      chennaiROI,

    scale:
      ANALYSIS_SCALE,

    crs:
      ANALYSIS_CRS,

    maxPixels:
      1e9,

    tileScale:
      4

  });


var classHistogram2020 =
  classified2020.reduceRegion({

    reducer:
      ee.Reducer.frequencyHistogram(),

    geometry:
      chennaiROI,

    scale:
      ANALYSIS_SCALE,

    crs:
      ANALYSIS_CRS,

    maxPixels:
      1e9,

    tileScale:
      4

  });


print(
  '----------------------------------------'
);

print(
  '2020 CLASSIFICATION QA'
);

print(
  '2020 classification min/max:'
);

print(
  classRange2020
);

print(
  '2020 class histogram:'
);

print(
  classHistogram2020
);


// ======================================================
// 12. DISPLAY 2020 CLASSIFICATION
// ======================================================

Map.addLayer(

  classified2020,

  {

    min:
      1,

    max:
      5,

    palette: [
      'ff0000',   // Built-up
      '008000',   // Vegetation
      '0000ff',   // Water
      'ffff00',   // Agricultural/Open
      'd2b48c'    // Barren/Fallow
    ]

  },

  '2020 MLC Classification',

  true

);


// ======================================================
// 13. SAMPLE CLASSIFICATION AT VALIDATION POINTS
// ======================================================

var validationPredictions2020 =
  classified2020.sampleRegions({

    collection:
      finalValidationClean2020,

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


print(
  ee.String(
    'Validation predictions generated: '
  ).cat(
    validationPredictions2020
      .size()
      .format('%d')
  )
);


// ======================================================
// 14. CONFUSION MATRIX
// ======================================================

var confusionMatrix2020 =
  validationPredictions2020.errorMatrix(
    'class_id',
    'classification',
    [1, 2, 3, 4, 5]
  );


var overallAccuracy2020 =
  confusionMatrix2020.accuracy();


var kappa2020 =
  confusionMatrix2020.kappa();


var producerAccuracy2020 =
  confusionMatrix2020.producersAccuracy();


var userAccuracy2020 =
  confusionMatrix2020.consumersAccuracy();


print(
  '========================================'
);

print(
  '2020 MLC ACCURACY ASSESSMENT'
);

print(
  'Confusion Matrix:'
);

print(
  confusionMatrix2020
);

print(
  'Overall Accuracy:'
);

print(
  overallAccuracy2020
);

print(
  'Kappa:'
);

print(
  kappa2020
);

print(
  'Producer Accuracy:'
);

print(
  producerAccuracy2020
);

print(
  'User Accuracy:'
);

print(
  userAccuracy2020
);


// ======================================================
// 15. CORRECT / INCORRECT COUNTS
// ======================================================

var validationPredictionsWithCorrect2020 =
  validationPredictions2020.map(
    function(feature) {

      feature =
        ee.Feature(
          feature
        );


      var actualClass =
        ee.Number(
          feature.get(
            'class_id'
          )
        );


      var predictedClass =
        ee.Number(
          feature.get(
            'classification'
          )
        );


      var correctFlag =
        ee.Number(
          ee.Algorithms.If(
            actualClass.eq(
              predictedClass
            ),
            1,
            0
          )
        );


      return feature.set(
        'correct',
        correctFlag
      );

    }
  );


var correct2020 =
  validationPredictionsWithCorrect2020
    .filter(
      ee.Filter.eq(
        'correct',
        1
      )
    )
    .size();


var incorrect2020 =
  validationPredictionsWithCorrect2020
    .filter(
      ee.Filter.eq(
        'correct',
        0
      )
    )
    .size();


print(
  ee.String(
    'Correct predictions: '
  ).cat(
    correct2020.format('%d')
  )
);


print(
  ee.String(
    'Incorrect predictions: '
  ).cat(
    incorrect2020.format('%d')
  )
);


print(
  '========================================'
);

print(
  'STAGE 5I COMPLETE'
);

print(
  '2020 Gaussian MLC classification and accuracy complete.'
);

print(
  '========================================'
);


// ======================================================
// END STAGE 5I
// ======================================================
// ======================================================
// STAGE 5J
// 2020 MATERIALIZE FINAL CLASSIFICATION + CORE ASSETS
// ======================================================
//
// WHY:
//
// Stage 5I works, but computing area statistics directly
// from the full Gaussian MLC chain can exceed the
// interactive Console computation timeout.
//
// Solution:
//
// 1. Save the final 2020 classification as an EE asset.
// 2. Save final training/validation samples as assets.
// 3. After those Tasks finish, load the raster asset in
//    a lightweight Stage 5K and calculate area statistics.
//
// ======================================================


// ======================================================
// 1. FINAL 2020 CLASSIFICATION ASSET
// ======================================================

Export.image.toAsset({

  image:
    classified2020,

  description:
    'Chennai_MLC_LULC_2020_Asset',

  assetId:
    'projects/assignment-482806/assets/chennai_mlc_lulc_2020',

  region:
    chennaiROI,

  scale:
    ANALYSIS_SCALE,

  crs:
    ANALYSIS_CRS,

  maxPixels:
    1e13

});


// ======================================================
// 2. FINAL 2020 TRAINING ASSET
// ======================================================

Export.table.toAsset({

  collection:
    finalTraining2020,

  description:
    'Chennai_Training_2020_Final_Asset',

  assetId:
    'projects/assignment-482806/assets/chennai_training_2020_final'

});


// ======================================================
// 3. FINAL 2020 VALIDATION ASSET
// ======================================================

Export.table.toAsset({

  collection:
    finalValidationClean2020,

  description:
    'Chennai_Validation_2020_Final_Asset',

  assetId:
    'projects/assignment-482806/assets/chennai_validation_2020_final'

});


// ======================================================
// 4. OPTIONAL DRIVE EXPORT OF CLASSIFIED RASTER
// ======================================================

Export.image.toDrive({

  image:
    classified2020,

  description:
    'Chennai_MLC_LULC_2020',

  folder:
    'Chennai_LULC_Exports',

  fileNamePrefix:
    'Chennai_MLC_LULC_2020',

  region:
    chennaiROI,

  scale:
    ANALYSIS_SCALE,

  crs:
    ANALYSIS_CRS,

  maxPixels:
    1e13,

  fileFormat:
    'GeoTIFF'

});


// ======================================================
// 5. OPTIONAL RAW SAMPLE CSV EXPORTS
// ======================================================

Export.table.toDrive({

  collection:
    finalTraining2020,

  description:
    'Chennai_Training_Samples_2020',

  folder:
    'Chennai_LULC_Exports',

  fileNamePrefix:
    'Chennai_Training_Samples_2020',

  fileFormat:
    'CSV'

});


Export.table.toDrive({

  collection:
    finalValidationClean2020,

  description:
    'Chennai_Validation_Samples_2020',

  folder:
    'Chennai_LULC_Exports',

  fileNamePrefix:
    'Chennai_Validation_Samples_2020',

  fileFormat:
    'CSV'

});


// ======================================================
// 6. VALIDATION PREDICTIONS CSV
// ======================================================

Export.table.toDrive({

  collection:
    validationPredictionsWithCorrect2020,

  description:
    'Chennai_MLC_Validation_Predictions_2020',

  folder:
    'Chennai_LULC_Exports',

  fileNamePrefix:
    'Chennai_MLC_Validation_Predictions_2020',

  fileFormat:
    'CSV'

});


// ======================================================
// 7. SIMPLE ACCURACY SUMMARY
// ======================================================
//
// Avoid complex array extraction here.
// We already verified the accuracy in Stage 5I.
//
// ======================================================

var accuracySummary2020 =
  ee.FeatureCollection([

    ee.Feature(
      null,
      {

        year:
          2020,

        overall_accuracy:
          confusionMatrix2020.accuracy(),

        kappa:
          confusionMatrix2020.kappa(),

        correct_predictions:
          correct2020,

        incorrect_predictions:
          incorrect2020

      }
    )

  ]);


Export.table.toDrive({

  collection:
    accuracySummary2020,

  description:
    'Chennai_MLC_Accuracy_2020',

  folder:
    'Chennai_LULC_Exports',

  fileNamePrefix:
    'Chennai_MLC_Accuracy_2020',

  fileFormat:
    'CSV'

});


// ======================================================
// 8. STATUS
// ======================================================

print(
  '========================================'
);

print(
  'STAGE 5J - EXPORT TASKS CREATED'
);

print(
  'Run the classification ASSET export first.'
);

print(
  'Then run training and validation ASSET exports.'
);

print(
  'Area statistics will be calculated from the saved raster asset in Stage 5K.'
);

print(
  '========================================'
);


// ======================================================
// END STAGE 5J
// ======================================================
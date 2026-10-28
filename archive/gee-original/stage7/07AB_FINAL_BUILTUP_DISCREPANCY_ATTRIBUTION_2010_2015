
 // ============================================================
 // CHENNAI LULC — STAGE 07AB
 // FINAL 2010–2015 BUILT-UP DISCREPANCY ATTRIBUTION AUDIT
 //
 // Read-only analysis of the original Gaussian MLC models.
 // No retraining, no exports, no modifications.
 //
 // Run BEFORE four-class post-classification aggregation.
 // ============================================================

var ROOT = 'projects/assignment-482806/assets/';

var CRS = 'EPSG:32644';

var TRANSFORM = [
  30, 0, 399060,
  0, -30, 1463250
];

var GRID = ee.Projection(CRS, TRANSFORM);

var BANDS = [
  'blue', 'green', 'red',
  'nir', 'swir1', 'swir2',
  'NDVI', 'NDWI', 'NDBI'
];

var CLASS_IDS = [1, 2, 3, 4, 5];

var REGULARIZATION = 1e-6;

// ============================================================
// A. LOAD EXISTING ASSETS
// ============================================================

var roi = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
).geometry();

var training2010 = ee.FeatureCollection(
  ROOT + 'chennai_training_2010_L5L7_manual_exp_v1'
);

var training2015 = ee.FeatureCollection(
  ROOT + 'chennai_training_2015_final'
);

var validation2010 = ee.FeatureCollection(
  ROOT + 'chennai_validation_2010_final'
);

var validation2015 = ee.FeatureCollection(
  ROOT + 'chennai_validation_2015_final'
);

var saved2010 = ee.Image(
  ROOT + 'chennai_mlc_lulc_2010_L5L7_manual_exp_v1'
).select('classification').rename('saved2010');

var saved2015 = ee.Image(
  ROOT + 'chennai_mlc_lulc_2015'
).select('classification').rename('saved2015');

var stack2010 = ee.Image(
  ROOT + 'chennai_predictor_stack_2010_L5L7_exp_v1'
).select(BANDS);

// ============================================================
// B. RECONSTRUCT ORIGINAL 2015 PREDICTOR STACK
// ============================================================

function prepareL8(image) {

  var qa = image.select('QA_PIXEL');
  var sat = image.select('QA_RADSAT');

  var clear = qa.bitwiseAnd(1 << 0).eq(0)
    .and(qa.bitwiseAnd(1 << 1).eq(0))
    .and(qa.bitwiseAnd(1 << 2).eq(0))
    .and(qa.bitwiseAnd(1 << 3).eq(0))
    .and(qa.bitwiseAnd(1 << 4).eq(0))
    .and(qa.bitwiseAnd(1 << 5).eq(0))
    .and(sat.eq(0));

  return image.select(
    [
      'SR_B2', 'SR_B3', 'SR_B4',
      'SR_B5', 'SR_B6', 'SR_B7'
    ],
    [
      'blue', 'green', 'red',
      'nir', 'swir1', 'swir2'
    ]
  )
  .multiply(0.0000275)
  .add(-0.2)
  .updateMask(clear);

}

function addIndices(image) {

  var nir = image.select('nir');
  var red = image.select('red');
  var green = image.select('green');
  var swir = image.select('swir1');

  return image.addBands([

    nir.subtract(red)
      .divide(nir.add(red))
      .rename('NDVI'),

    green.subtract(nir)
      .divide(green.add(nir))
      .rename('NDWI'),

    swir.subtract(nir)
      .divide(swir.add(nir))
      .rename('NDBI')

  ]);

}

var scenes2015 = ee.ImageCollection(
  'LANDSAT/LC08/C02/T1_L2'
)
.filterBounds(roi)
.filterDate('2015-01-01', '2016-01-01');

var stack2015 = addIndices(
  scenes2015.map(prepareL8).median()
)
.select(BANDS)
.clip(roi);

// ============================================================
// C. RECONSTRUCT THE ORIGINAL GAUSSIAN MLC MODELS
//
// Class-specific nine-band mean and covariance.
// Regularization = 1e-6 times identity.
// Equal priors.
// Score = -0.5 Mahalanobis squared - 0.5 log determinant.
// ============================================================

function gaussianParameters(training, classId) {

  var members = training.filter(
    ee.Filter.eq('class_id', classId)
  );

  var mean = ee.Array([

    BANDS.map(function(b) {
      return members.aggregate_mean(b);
    })

  ]).transpose();

  var covariance = ee.Array(

    members
      .makeArray(BANDS, 'mlc_values')
      .reduceColumns({
        reducer: ee.Reducer.covariance()
          .setOutputs(['covariance']),
        selectors: ['mlc_values']
      })
      .get('covariance')

  ).add(
    ee.Array.identity(9).multiply(REGULARIZATION)
  );

  return ee.Dictionary({

    mean: mean,

    inverse: covariance.matrixInverse(),

    logdet: ee.Number(
      covariance.matrixDeterminant()
    ).max(1e-300).log()

  });

}

function reconstructModel(training, stack, prefix) {

  var x = stack.toArray().toArray(1);

  var scoreList = [];
  var distanceList = [];
  var parametersByClass = {};

  CLASS_IDS.forEach(function(c) {

    var p = gaussianParameters(training, c);

    parametersByClass[c] = p;

    var delta = x.subtract(
      ee.Image.constant(
        ee.Array(p.get('mean'))
      )
    );

    var distanceSquared = delta
      .arrayTranspose()
      .matrixMultiply(
        ee.Image.constant(
          ee.Array(p.get('inverse'))
        )
      )
      .matrixMultiply(delta)
      .arrayGet([0, 0]);

    var logLikelihood = distanceSquared
      .multiply(-0.5)
      .subtract(
        ee.Image.constant(
          ee.Number(p.get('logdet'))
        ).multiply(0.5)
      );

    scoreList.push(
      logLikelihood.rename(prefix + '_score_' + c)
    );

    distanceList.push(
      distanceSquared.rename(prefix + '_distance_' + c)
    );

  });

  var scores = ee.Image.cat(scoreList);

  var reconstructed = scores
    .toArray()
    .arrayArgmax()
    .arrayGet([0])
    .add(1)
    .toInt8()
    .rename('reconstructed');

  return {

    scores: scores,

    distances: ee.Image.cat(distanceList),

    reconstructed: reconstructed,

    parameters: parametersByClass

  };

}

var model2010 = reconstructModel(
  training2010, stack2010, 'y2010'
);

var model2015 = reconstructModel(
  training2015, stack2015, 'y2015'
);

// ============================================================
// D. CHECK RECONSTRUCTED MODELS AGAINST SAVED RASTERS
// ============================================================

function checkReconstruction(validation, saved, rebuilt) {

  return ee.Image.cat([

    saved.rename('saved'),

    rebuilt.rename('rebuilt')

  ]).sampleRegions({

    collection: validation,

    properties: ['class_id'],

    projection: GRID,
    scale: 30,
    geometries: false,
    tileScale: 8

  }).map(function(f) {

    return f.set(
      'mismatch',

      ee.Number(f.get('saved'))
        .neq(
          ee.Number(f.get('rebuilt'))
        )

    );

  });

}

var qa2010 = checkReconstruction(
  validation2010,
  saved2010,
  model2010.reconstructed
);

var qa2015 = checkReconstruction(
  validation2015,
  saved2015,
  model2015.reconstructed
);

// Also verify that re-extracted reflectance and NDVI
// match the archived training predictor values.

function archiveCheck(training, stack) {

  return stack
    .select(['red', 'NDVI'])
    .sampleRegions({

      collection: training.map(function(f) {

        return f
          .set('arch_red', f.get('red'))
          .set('arch_NDVI', f.get('NDVI'));

      }),

      properties: ['arch_red', 'arch_NDVI'],

      projection: GRID,
      scale: 30,
      geometries: false,
      tileScale: 8

    })
    .map(function(f) {

      return f

        .set(
          'red_difference',

          ee.Number(f.get('red'))
            .subtract(
              ee.Number(f.get('arch_red'))
            ).abs()
        )

        .set(
          'ndvi_difference',

          ee.Number(f.get('NDVI'))
            .subtract(
              ee.Number(f.get('arch_NDVI'))
            ).abs()
        );

    });

}

var archive2010 = archiveCheck(
  training2010, stack2010
);

var archive2015 = archiveCheck(
  training2015, stack2015
);

// ============================================================
// E. MODEL RECONSTRUCTION PREFLIGHT
// ============================================================

print('================================================');
print('STAGE 07AB — FINAL BUILT-UP ATTRIBUTION AUDIT');
print('================================================');

print('2015 Landsat 8 scenes (expected 19):');
print(scenes2015.size());

print('2010 training count (expected 600):');
print(training2010.size());

print('2015 training count (expected 600):');
print(training2015.size());

print('Archived predictor matching counts:');

print(ee.Dictionary({

  year2010: archive2010.size(),

  year2015: archive2015.size()

}));

print('Maximum archived predictor differences:');

print(ee.Dictionary({

  year2010_red:
    archive2010.aggregate_max('red_difference'),

  year2010_NDVI:
    archive2010.aggregate_max('ndvi_difference'),

  year2015_red:
    archive2015.aggregate_max('red_difference'),

  year2015_NDVI:
    archive2015.aggregate_max('ndvi_difference')

}));

print('Saved versus reconstructed classifier checks:');

print(ee.Dictionary({

  year2010_checked: qa2010.size(),

  year2010_mismatches:
    qa2010.filter(
      ee.Filter.eq('mismatch', 1)
    ).size(),

  year2015_checked: qa2015.size(),

  year2015_mismatches:
    qa2015.filter(
      ee.Filter.eq('mismatch', 1)
    ).size()

}));

print('IMPORTANT: Both mismatch counts must be ZERO.');
print('Otherwise, do not interpret reconstructed likelihoods.');

// ============================================================
// F. ORIGINAL 2010–2015 TRANSITION AREAS
// ============================================================

var transition = saved2010
  .multiply(10)
  .add(saved2015)
  .rename('transition');

function areaKm2(mask) {

  return ee.Image.pixelArea()
    .divide(1e6)
    .rename('area')
    .updateMask(mask)
    .reduceRegion({

      reducer: ee.Reducer.sum(),

      geometry: roi,

      crs: CRS,

      crsTransform: TRANSFORM,

      maxPixels: 1e9,

      tileScale: 8

    }).get('area');

}

print('================================================');
print('SAVED RASTER BUILT-UP AREAS AND TRANSITIONS');
print('================================================');

print(ee.Dictionary({

  Built_2010:
    areaKm2(saved2010.eq(1)),

  Built_2015:
    areaKm2(saved2015.eq(1)),

  Stable_Built_11:
    areaKm2(transition.eq(11)),

  Built_to_Agricultural_14:
    areaKm2(transition.eq(14)),

  Built_to_Vacant_15:
    areaKm2(transition.eq(15)),

  Agricultural_to_Built_41:
    areaKm2(transition.eq(41)),

  Vacant_to_Built_51:
    areaKm2(transition.eq(51))

}));

// ============================================================
// G. GAUSSIAN LIKELIHOOD COMPARISON
//
// Compare Class 1 against Classes 4 and 5 WITHIN a year.
// Do not compare absolute likelihood values across years.
// ============================================================

var s10 = model2010.scores;
var s15 = model2015.scores;
var d15 = model2015.distances;

// Built-up log score minus the best of Classes 4 and 5.
// Positive means Built-up beats BOTH open-land alternatives.

var margin2010 = s10
  .select('y2010_score_1')
  .subtract(

    s10.select('y2010_score_4')
      .max(
        s10.select('y2010_score_5')
      )

  )
  .rename('margin2010_built_over_open');

var margin2015 = s15
  .select('y2015_score_1')
  .subtract(

    s15.select('y2015_score_4')
      .max(
        s15.select('y2015_score_5')
      )

  )
  .rename('margin2015_built_over_open');

// Pairwise log-likelihood advantages in 2015.

var score4OverBuilt = s15
  .select('y2015_score_4')
  .subtract(
    s15.select('y2015_score_1')
  )
  .rename('score2015_agri_over_built');

var score5OverBuilt = s15
  .select('y2015_score_5')
  .subtract(
    s15.select('y2015_score_1')
  )
  .rename('score2015_vacant_over_built');

// Distance contribution to the score difference.

var distance4OverBuilt = d15
  .select('y2015_distance_4')
  .subtract(
    d15.select('y2015_distance_1')
  )
  .multiply(-0.5)
  .rename('distance2015_agri_over_built');

var distance5OverBuilt = d15
  .select('y2015_distance_5')
  .subtract(
    d15.select('y2015_distance_1')
  )
  .multiply(-0.5)
  .rename('distance2015_vacant_over_built');

// Covariance determinant contribution.
// This value is constant for a given pair of class models.

var cov4OverBuilt = ee.Number(
  model2015.parameters[4].get('logdet')
).subtract(
  ee.Number(
    model2015.parameters[1].get('logdet')
  )
).multiply(-0.5);

var cov5OverBuilt = ee.Number(
  model2015.parameters[5].get('logdet')
).subtract(
  ee.Number(
    model2015.parameters[1].get('logdet')
  )
).multiply(-0.5);

print('================================================');
print('2015 GAUSSIAN COVARIANCE CONTRIBUTIONS');
print('================================================');

print('Covariance contribution: Agricultural minus Built-up');
print(cov4OverBuilt);

print('Covariance contribution: Vacant/Open minus Built-up');
print(cov5OverBuilt);

print('Pairwise likelihood advantage = distance contribution + covariance contribution.');

// ============================================================
// H. SPECTRAL DIFFERENCES BETWEEN 2010 AND 2015
//
// Descriptive only. Landsat 5+7 and Landsat 8 have different
// spectral response characteristics. Their observations are
// not fully sensor-harmonized.
// ============================================================

var spectralBands = ee.Image.cat([

  stack2010.select('NDVI')
    .rename('NDVI_2010'),

  stack2015.select('NDVI')
    .rename('NDVI_2015'),

  stack2010.select('NDBI')
    .rename('NDBI_2010'),

  stack2015.select('NDBI')
    .rename('NDBI_2015'),

  stack2010.select('swir1')
    .rename('SWIR1_2010'),

  stack2015.select('swir1')
    .rename('SWIR1_2015')

]);

var deltaNDVI = stack2015.select('NDVI')
  .subtract(
    stack2010.select('NDVI')
  )
  .rename('delta_NDVI');

var deltaNDBI = stack2015.select('NDBI')
  .subtract(
    stack2010.select('NDBI')
  )
  .rename('delta_NDBI');

var deltaSWIR1 = stack2015.select('swir1')
  .subtract(
    stack2010.select('swir1')
  )
  .rename('delta_SWIR1');

// ============================================================
// I. COMBINE ALL DIAGNOSTIC BANDS
// ============================================================

var auditBands = ee.Image.cat([

  saved2010,

  saved2015,

  model2010.reconstructed
    .neq(saved2010)
    .rename('mismatch2010'),

  model2015.reconstructed
    .neq(saved2015)
    .rename('mismatch2015'),

  spectralBands,

  deltaNDVI,

  deltaNDBI,

  deltaSWIR1,

  margin2010,

  margin2015,

  score4OverBuilt,

  score5OverBuilt,

  distance4OverBuilt,

  distance5OverBuilt

]);

// ============================================================
// J. SAMPLE THE SAVED TRANSITION PIXELS
//
// We first select locations using the existing saved maps.
// Only then are Gaussian scores evaluated at selected points.
// ============================================================

var samplePoints = transition.stratifiedSample({

  numPoints: 0,

  classBand: 'transition',

  classValues: [
    11, 14, 15, 41, 51
  ],

  classPoints: [
    60, 120, 80, 40, 40
  ],

  region: roi,

  projection: GRID,

  scale: 30,

  seed: 201015,

  geometries: true,

  tileScale: 8

});

var sampledResults = auditBands.sampleRegions({

  collection: samplePoints,

  properties: ['transition'],

  projection: GRID,

  scale: 30,

  geometries: true,

  tileScale: 8

});

// ============================================================
// K. SUMMARIZE THE FIVE TRANSITION GROUPS
// ============================================================

function summaryForTransition(code) {

  var subset = sampledResults.filter(
    ee.Filter.eq('transition', code)
  );

  return ee.Feature(null, {

    transition: code,

    sample_count: subset.size(),

    mean_delta_NDVI:
      subset.aggregate_mean('delta_NDVI'),

    mean_delta_NDBI:
      subset.aggregate_mean('delta_NDBI'),

    mean_delta_SWIR1:
      subset.aggregate_mean('delta_SWIR1'),

    mean_2010_built_margin:
      subset.aggregate_mean(
        'margin2010_built_over_open'
      ),

    mean_2015_built_margin:
      subset.aggregate_mean(
        'margin2015_built_over_open'
      ),

    mean_2015_agri_over_built:
      subset.aggregate_mean(
        'score2015_agri_over_built'
      ),

    mean_2015_vacant_over_built:
      subset.aggregate_mean(
        'score2015_vacant_over_built'
      ),

    mean_2015_agri_distance_component:
      subset.aggregate_mean(
        'distance2015_agri_over_built'
      ),

    mean_2015_vacant_distance_component:
      subset.aggregate_mean(
        'distance2015_vacant_over_built'
      )

  });

}

var transitionSummary = ee.FeatureCollection([

  summaryForTransition(11),

  summaryForTransition(14),

  summaryForTransition(15),

  summaryForTransition(41),

  summaryForTransition(51)

]);

print('================================================');
print('2010–2015 STRATIFIED DISCREPANCY ANALYSIS');
print('================================================');

print('Selected sample counts by transition:');
print(
  samplePoints.aggregate_histogram('transition')
);

print('Completed diagnostic samples by transition:');
print(
  sampledResults.aggregate_histogram('transition')
);

print('Saved/reconstructed mismatches at sampled locations:');

print(ee.Dictionary({

  year2010:
    sampledResults.filter(
      ee.Filter.eq('mismatch2010', 1)
    ).size(),

  year2015:
    sampledResults.filter(
      ee.Filter.eq('mismatch2015', 1)
    ).size()

}));

print('TRANSITION SUMMARY — KEY TECHNICAL RESULTS');
print(transitionSummary);

// ============================================================
// L. REVISIT OUR PREVIOUS HISTORICAL AUDIT POINTS
//
// We have already inspected these locations in historical
// Google Earth imagery. No repeat verification is needed.
// ============================================================

var knownAudit = ee.FeatureCollection([

  ee.Feature(
    ee.Geometry.Point([
      80.22751253467975,
      13.109518065120156
    ]),
    {
      audit_id: 'AUDIT_08',
      prior_transition: 14
    }
  ),

  ee.Feature(
    ee.Geometry.Point([
      80.15832908538033,
      12.944921194390886
    ]),
    {
      audit_id: 'AUDIT_04',
      prior_transition: 14
    }
  ),

  ee.Feature(
    ee.Geometry.Point([
      80.18682695633524,
      13.110749170272893
    ]),
    {
      audit_id: 'AUDIT_32',
      prior_transition: 14
    }
  ),

  ee.Feature(
    ee.Geometry.Point([
      80.27941915977351,
      13.056230133350972
    ]),
    {
      audit_id: 'AUDIT_13',
      prior_transition: 11
    }
  ),

  ee.Feature(
    ee.Geometry.Point([
      80.24423267953793,
      12.9804482502403
    ]),
    {
      audit_id: 'AUDIT_16',
      prior_transition: 15
    }
  )

]);

var historicalAuditResults = auditBands.sampleRegions({

  collection: knownAudit,

  properties: [
    'audit_id',
    'prior_transition'
  ],

  projection: GRID,

  scale: 30,

  geometries: true,

  tileScale: 8

});

print('================================================');
print('PREVIOUSLY REVIEWED HISTORICAL AUDIT LOCATIONS');
print('================================================');

print('Audit locations with original labels, likelihoods and spectral differences:');

print(
  historicalAuditResults.sort('audit_id')
);

print('AUDIT_08, AUDIT_04, AUDIT_32: residential Built-up observed historically.');
print('AUDIT_13: stable Built-up control.');
print('AUDIT_16: mixed university-campus case.');

// ============================================================
// M. MAP DISPLAY
// ============================================================

Map.layers().reset();

Map.setOptions('SATELLITE');

Map.centerObject(roi, 10);

var palette = [
  'ff0000',
  '008000',
  '0000ff',
  'ffff00',
  'd2b48c'
];

Map.addLayer(
  saved2010,
  {
    min: 1,
    max: 5,
    palette: palette
  },
  '2010 SAVED GAUSSIAN MLC',
  false
);

Map.addLayer(
  saved2015,
  {
    min: 1,
    max: 5,
    palette: palette
  },
  '2015 SAVED GAUSSIAN MLC',
  false
);

Map.addLayer(
  transition.eq(14).selfMask(),
  {
    palette: ['ff00ff']
  },
  'Built 2010 -> Agricultural 2015',
  true,
  0.8
);

Map.addLayer(
  transition.eq(15).selfMask(),
  {
    palette: ['ffa500']
  },
  'Built 2010 -> Vacant/Open 2015',
  true,
  0.8
);

Map.addLayer(
  margin2015.updateMask(
    transition.eq(14).or(
      transition.eq(15)
    )
  ),
  {
    min: -12,
    max: 12,
    palette: [
      'a50026',
      'fdae61',
      'ffffbf',
      'abd9e9',
      '313695'
    ]
  },
  '2015 Built-up vs Open Gaussian score margin',
  false
);

Map.addLayer(
  knownAudit.style({
    color: 'ffffff',
    pointSize: 6,
    width: 2
  }),
  {},
  'Previously reviewed audit points',
  true
);

print('================================================');
print('END STAGE 07AB — FINAL TECHNICAL AUDIT');
print('================================================');

print('No new model fitted.');
print('No training or validation labels modified.');
print('No exports or asset modifications.');
print('Four-class reporting merge follows this audit.');

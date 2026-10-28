
 // ======================================================================
 // CHENNAI LULC — STAGE 07AC — FIXED
 // FOUR-CLASS AGGREGATION + VALIDATION + AREA/CHANGE QA
 //
 // FINAL CLASSES:
 // 1 Built-up
 // 2 Vegetation
 // 3 Water
 // 4 Agricultural & Vacant/Unused Open Land
 //
 // Original Classes 4 and 5 are merged.
 //
 // FIX: 2025 confusion matrices now use ee.Array().toLong()
 //
 // No retraining.
 // No modifications to original assets.
 // All exports disabled by default.
 // ======================================================================

var ROOT = 'projects/assignment-482806/assets/';

var CRS = 'EPSG:32644';

var TX = [
  30, 0, 399060,
  0, -30, 1463250
];

var GRID = ee.Projection(CRS, TX);

var ROI_ASSET =
  ROOT + 'chennai_admin_study_area_clean';

var roi = ee.FeatureCollection(
  ROI_ASSET
).geometry();

// ======================================================================
// CONFIGURATION
// ======================================================================

// Add confirmed ORIGINAL 2025 five-class raster ID here.
// Leave blank if the raster asset is not yet confirmed.

var RASTER_2025 = '';

// Do not enable exports during this QA run.

var EXPORT_FOUR_CLASS_ASSETS = false;
var EXPORT_FOUR_CLASS_GEOTIFFS = false;

// ======================================================================
// CLASS DEFINITIONS
// ======================================================================

var ORIGINAL_CLASSES = [1, 2, 3, 4, 5];

var REPORT_CLASSES = [1, 2, 3, 4];

var PALETTE4 = [
  'e53935',
  '2e7d32',
  '1976d2',
  'd8b365'
];

// ======================================================================
// VERIFIED ORIGINAL ASSETS
// ======================================================================

var yearDefs = [
  {
    year: 2010,

    raster:
      ROOT +
      'chennai_mlc_lulc_2010_L5L7_manual_exp_v1',

    validation:
      ROOT +
      'chennai_validation_2010_final',

    output:
      ROOT +
      'chennai_lulc4_2010_L5L7_provisional_v1',

    status: 'PROVISIONAL'
  },

  {
    year: 2015,

    raster:
      ROOT +
      'chennai_mlc_lulc_2015',

    validation:
      ROOT +
      'chennai_validation_2015_final',

    output:
      ROOT +
      'chennai_lulc4_2015_v1',

    status: 'LOCKED_BASELINE'
  },

  {
    year: 2020,

    raster:
      ROOT +
      'chennai_mlc_lulc_2020',

    validation:
      ROOT +
      'chennai_validation_2020_final',

    output:
      ROOT +
      'chennai_lulc4_2020_v1',

    status: 'LOCKED_BASELINE'
  }
];

// Include 2025 when its actual raster ID is known.

if (RASTER_2025.trim().length > 0) {

  yearDefs.push({
    year: 2025,

    raster: RASTER_2025.trim(),

    validation: '',

    output:
      ROOT +
      'chennai_lulc4_2025_v1',

    status: 'LOCKED_BASELINE'
  });

}

// ======================================================================
// FUNCTION 1 — FIVE-CLASS TO FOUR-CLASS CONVERSION
// ======================================================================

function mergeToFour(image) {

  return image
    .select('classification')
    .remap(
      [1, 2, 3, 4, 5],
      [1, 2, 3, 4, 4]
    )
    .rename('classification')
    .toByte()
    .clip(roi);

}

// ======================================================================
// FUNCTION 2 — CLASS AREA STATISTICS
// ======================================================================

function groupedAreaKm2(image) {

  var area = ee.Image.pixelArea()
    .divide(1000000)
    .rename('area_km2');

  var result = area
    .addBands(
      image.rename('code')
    )
    .reduceRegion({
      reducer: ee.Reducer.sum().group({
        groupField: 1,
        groupName: 'code'
      }),

      geometry: roi,

      crs: CRS,
      crsTransform: TX,

      maxPixels: 1000000000,

      tileScale: 8
    });

  return ee.Dictionary(result).get('groups');

}

// ======================================================================
// FUNCTION 3 — ORIGINAL AND FOUR-CLASS VALIDATION
// ======================================================================

function checkFiveToFourConfusion(
  validationId,
  raster
) {

  var original = raster.sampleRegions({

    collection:
      ee.FeatureCollection(validationId),

    properties: ['class_id'],

    projection: GRID,

    scale: 30,

    geometries: false,

    tileScale: 8
  });

  var merged = original.map(function(f) {

    return f.set({

      actual4:
        ee.Number(
          f.get('class_id')
        ).min(4),

      predicted4:
        ee.Number(
          f.get('classification')
        ).min(4)

    });

  });

  var cm5 = original.errorMatrix(
    'class_id',
    'classification',
    ORIGINAL_CLASSES
  );

  var cm4 = merged.errorMatrix(
    'actual4',
    'predicted4',
    REPORT_CLASSES
  );

  return {
    original: original,
    merged: merged,
    cm5: cm5,
    cm4: cm4
  };

}

// ======================================================================
// FUNCTION 4 — TRANSITION MAP
// ======================================================================

function transitionImage(
  mapFrom,
  mapTo
) {

  return mapFrom
    .multiply(10)
    .add(mapTo)
    .rename('transition')
    .toByte();

}

// ======================================================================
// INITIAL CONSOLE
// ======================================================================

var maps = {};

print('======================================================');
print('STAGE 07AC — FOUR-CLASS LULC AGGREGATION — FIXED');
print('======================================================');

print('Class 1: Built-up');
print('Class 2: Vegetation');
print('Class 3: Water');
print('Class 4: Agricultural + Vacant/Unused Open Land');

print('Class 4 includes green unused plots, weeds and scrub.');

print('Source: Existing five-class Gaussian MLC models.');

print('Method: Post-classification aggregation.');

print('ROI: ' + ROI_ASSET);
print('CRS: ' + CRS);
print('Grid transform: ' + TX.join(', '));

print(
  'Asset exports enabled: ' +
  EXPORT_FOUR_CLASS_ASSETS
);

print(
  'GeoTIFF exports enabled: ' +
  EXPORT_FOUR_CLASS_GEOTIFFS
);

print(
  'Available raster years: ' +
  yearDefs.length
);

// ======================================================================
// SECTION A — 2025 ARCHIVED CONFUSION MATRIX
//
// FIXED VERSION
//
// Earth Engine ee.ConfusionMatrix expects a two-dimensional
// ee.Array containing Long (64-bit integer) values.
//
// We also explicitly specify class ordering.
// ======================================================================

var archived2025CM5 = ee.ConfusionMatrix({

  array: ee.Array([

    [55, 0, 0, 2, 3],

    [0, 55, 0, 5, 0],

    [0, 0, 60, 0, 0],

    [0, 0, 0, 52, 8],

    [0, 0, 0, 31, 29]

  ]).toLong(),

  order: ORIGINAL_CLASSES

});

var archived2025CM4 = ee.ConfusionMatrix({

  array: ee.Array([

    [55, 0, 0, 5],

    [0, 55, 0, 5],

    [0, 0, 60, 0],

    [0, 0, 0, 120]

  ]).toLong(),

  order: REPORT_CLASSES

});

// ======================================================================
// SECTION B — PRINT 2025 ARCHIVED ACCURACY
// ======================================================================

print('======================================================');

print('2025 ORIGINAL VALIDATION — ARCHIVED COUNTS');

print('======================================================');

print('2025 original five-class confusion matrix:');

print(archived2025CM5);

print('2025 original five-class accuracy (%):');

print(
  ee.Number(
    archived2025CM5.accuracy()
  ).multiply(100)
);

print('2025 aggregated four-class confusion matrix:');

print(archived2025CM4);

print('2025 aggregated four-class accuracy (%):');

print(
  ee.Number(
    archived2025CM4.accuracy()
  ).multiply(100)
);

print('2025 figures use the archived original validation matrix.');

print('No reconstructed validation samples are substituted.');

if (!RASTER_2025.trim()) {

  print('2025 classified raster is not loaded.');

  print(
    'Add confirmed 2025 raster asset ID to RASTER_2025.'
  );

  print(
    '2025 spatial area and transition QA remain incomplete.'
  );

}

// ======================================================================
// SECTION C — PROCESS AVAILABLE RASTERS
// ======================================================================

yearDefs.forEach(function(def) {

  var five = ee.Image(
    def.raster
  )
    .select('classification')
    .clip(roi);

  var four = mergeToFour(five)
    .set({

      source_five_class_asset:
        def.raster,

      source_method:
        'Gaussian_MLC_5class',

      reporting_method:
        'post_classification_aggregation',

      class4_definition:
        'Agricultural + Vacant/Unused Open Land, including green unused plots',

      study_year:
        def.year,

      source_status:
        def.status

    });

  maps[def.year] = four;

  print('------------------------------------------------------');

  print(
    'YEAR ' +
    def.year +
    ' — ' +
    def.status
  );

  print(
    'Original source raster: ' +
    def.raster
  );

  print(
    'New asset ID if exported: ' +
    def.output
  );

  // ==========================================================
  // AREA STATISTICS
  // ==========================================================

  print('Original five-class areas (km2):');

  print(
    groupedAreaKm2(five)
  );

  print('Aggregated four-class areas (km2):');

  print(
    groupedAreaKm2(four)
  );

  // ==========================================================
  // VALIDATION
  // ==========================================================

  if (def.validation !== '') {

    var report = checkFiveToFourConfusion(
      def.validation,
      five
    );

    print(
      'Validation sample count (expected 300):'
    );

    print(
      report.original.size()
    );

    print('Original five-class confusion matrix:');

    print(
      report.cm5
    );

    print('Original five-class overall accuracy (%):');

    print(
      ee.Number(
        report.cm5.accuracy()
      ).multiply(100)
    );

    print('Aggregated FOUR-class confusion matrix:');

    print(
      report.cm4
    );

    print('Aggregated FOUR-class overall accuracy (%):');

    print(
      ee.Number(
        report.cm4.accuracy()
      ).multiply(100)
    );

    print('Four-class producer accuracies:');

    print(
      report.cm4.producersAccuracy()
    );

    print('Four-class user accuracies:');

    print(
      report.cm4.consumersAccuracy()
    );

    print('Four-class Cohen kappa:');

    print(
      report.cm4.kappa()
    );

    print('Aggregated reference class distribution:');

    print(
      report.merged.aggregate_histogram(
        'actual4'
      )
    );

    print('Aggregated prediction class distribution:');

    print(
      report.merged.aggregate_histogram(
        'predicted4'
      )
    );

  } else {

    print(
      '2025 original point validation asset not confirmed.'
    );

    print(
      'Refer to archived 2025 confusion matrix above.'
    );

  }

  // ==========================================================
  // OPTIONAL GEE ASSET EXPORT
  // ==========================================================

  if (EXPORT_FOUR_CLASS_ASSETS) {

    Export.image.toAsset({

      image: four,

      description:
        'Chennai_07AC_LULC4_' +
        def.year,

      assetId:
        def.output,

      region:
        roi,

      crs:
        CRS,

      crsTransform:
        TX,

      pyramidingPolicy: {
        '.default': 'mode'
      },

      maxPixels:
        1000000000

    });

  }

  // ==========================================================
  // OPTIONAL CLOUD-OPTIMIZED GEOTIFF EXPORT
  // ==========================================================

  if (EXPORT_FOUR_CLASS_GEOTIFFS) {

    Export.image.toDrive({

      image:
        four,

      description:
        'Chennai_07AC_LULC4_TIFF_' +
        def.year,

      folder:
        'Chennai_LULC_FourClass',

      fileNamePrefix:
        'chennai_lulc4_' +
        def.year,

      region:
        roi,

      crs:
        CRS,

      crsTransform:
        TX,

      fileFormat:
        'GeoTIFF',

      formatOptions: {
        cloudOptimized: true
      },

      maxPixels:
        1000000000

    });

  }

});

// ======================================================================
// SECTION D — FOUR-CLASS TRANSITION ANALYSIS
// ======================================================================

function printTransition(
  yearFrom,
  yearTo
) {

  var from = maps[yearFrom];

  var to = maps[yearTo];

  var transition = transitionImage(
    from,
    to
  );

  print('======================================================');

  print(
    'FOUR-CLASS TRANSITION ' +
    yearFrom +
    ' -> ' +
    yearTo
  );

  print('======================================================');

  print(
    'Transition code = 10 * source class + destination class.'
  );

  print('Transition areas in km2:');

  print(
    groupedAreaKm2(transition)
  );

  print('Built-up -> Agricultural/Unused Open area (km2):');

  var builtToOpen = ee.Image.pixelArea()
    .divide(1000000)
    .rename('area')
    .updateMask(
      transition.eq(14)
    );

  print(
    builtToOpen.reduceRegion({

      reducer:
        ee.Reducer.sum(),

      geometry:
        roi,

      crs:
        CRS,

      crsTransform:
        TX,

      maxPixels:
        1000000000,

      tileScale:
        8

    }).get('area')
  );

  return transition;

}

// ======================================================================
// SECTION E — AVAILABLE TRANSITIONS
// ======================================================================

var transition1015 = printTransition(
  2010,
  2015
);

var transition1520 = printTransition(
  2015,
  2020
);

if (maps[2025]) {

  var transition2025 = printTransition(
    2020,
    2025
  );

  var transition201025 = printTransition(
    2010,
    2025
  );

}

// ======================================================================
// SECTION F — MAP DISPLAY
// ======================================================================

Map.layers().reset();

Map.setOptions('SATELLITE');

Map.centerObject(
  roi,
  10
);

Map.addLayer(

  maps[2010],

  {
    min: 1,
    max: 4,
    palette: PALETTE4
  },

  '2010 FOUR-CLASS (PROVISIONAL)',

  false,

  0.75

);

Map.addLayer(

  maps[2015],

  {
    min: 1,
    max: 4,
    palette: PALETTE4
  },

  '2015 FOUR-CLASS',

  true,

  0.75

);

Map.addLayer(

  maps[2020],

  {
    min: 1,
    max: 4,
    palette: PALETTE4
  },

  '2020 FOUR-CLASS',

  false,

  0.75

);

if (maps[2025]) {

  Map.addLayer(

    maps[2025],

    {
      min: 1,
      max: 4,
      palette: PALETTE4
    },

    '2025 FOUR-CLASS',

    false,

    0.75

  );

}

Map.addLayer(

  transition1015.eq(14).selfMask(),

  {
    palette: ['ff00ff']
  },

  '2010 Built-up -> 2015 Open/Agricultural (CAUTION)',

  false,

  0.9

);

// ======================================================================
// FINAL QA
// ======================================================================

print('======================================================');

print('STAGE 07AC — FINAL QA');

print('======================================================');

print('Expected 2010 five-class OA: 69.3333%.');

print('Expected 2010 four-class OA: 81.00%.');

print('Expected 2015 five-class OA: 85.6667%.');

print('Expected 2015 four-class OA: 88.6667%.');

print('Expected 2020 five-class OA: 86.3333%.');

print('Expected 2020 four-class OA: 95.6667%.');

print('Expected 2025 five-class OA: 83.6667%.');

print('Expected 2025 four-class OA: 96.6667%.');

print('Verify class IDs 1, 2, 3 and 4 only.');

print('Verify Built-up area remains unchanged.');

print('2010–2015 Built-up decline is NOT verified urban loss.');

print('Original five-class rasters remain unchanged.');

print('No exports unless an export flag is enabled.');

print('======================================================');

print('END STAGE 07AC — FIXED');

print('======================================================');

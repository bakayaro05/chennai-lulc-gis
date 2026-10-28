
 // ======================================================================
 // CHENNAI LULC — STAGE 07AC5
 // FINAL FOUR-CLASS RASTER ASSET EXPORT — 2010, 2015, 2020, 2025
 //
 // Five-class baseline retained.
 // Original Classes 4 + 5 become reporting Class 4.
 // All outputs: EPSG:32644, 30 m locked grid.
 // ======================================================================

var ROOT = 'projects/assignment-482806/assets/';

var CRS = 'EPSG:32644';

var TRANSFORM = [
  30, 0, 399060,
  0, -30, 1463250
];

var roi = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
).geometry();

// Creates tasks in the Tasks tab.
// You must manually START each task.

var CREATE_LULC_EXPORT_TASKS = true;

// Transition rasters are optional at this stage.

var CREATE_TRANSITION_EXPORT_TASKS = false;

// ======================================================================
// 1. SOURCE AND DESTINATION ASSETS
// ======================================================================

var specs = [
  {
    year: 2010,

    source:
      ROOT + 'chennai_mlc_lulc_2010_L5L7_manual_exp_v1',

    sourceBand: 'classification',

    destination:
      ROOT + 'chennai_lulc4_2010_L5L7_provisional_v1',

    status: 'PROVISIONAL'
  },
  {
    year: 2015,

    source:
      ROOT + 'chennai_mlc_lulc_2015',

    sourceBand: 'classification',

    destination:
      ROOT + 'chennai_lulc4_2015_v1',

    status: 'LOCKED_BASELINE'
  },
  {
    year: 2020,

    source:
      ROOT + 'chennai_mlc_lulc_2020',

    sourceBand: 'classification',

    destination:
      ROOT + 'chennai_lulc4_2020_v1',

    status: 'LOCKED_BASELINE'
  },
  {
    year: 2025,

    source:
      ROOT + 'chennai_mlc_lulc_2025_from_original_tif',

    sourceBand: 'b1',

    destination:
      ROOT + 'chennai_lulc4_2025_v1',

    status: 'RECOVERED_ORIGINAL_TIFF'
  }
];

// ======================================================================
// 2. LOAD ORIGINAL FIVE-CLASS IMAGE
// ======================================================================

function originalFive(spec) {

  var raw = ee.Image(spec.source)
    .select(
      [spec.sourceBand],
      ['classification']
    );

  // 2025 GeoTIFF uses zero for background.
  // Preserve only legitimate Class IDs 1–5.

  return raw
    .updateMask(
      raw.gte(1).and(raw.lte(5))
    )
    .clip(roi)
    .toByte();

}

// ======================================================================
// 3. AGGREGATE TO FOUR REPORTING CLASSES
// ======================================================================

function aggregateFour(five, spec) {

  return five
    .remap(
      [1, 2, 3, 4, 5],
      [1, 2, 3, 4, 4]
    )
    .rename('classification')
    .toByte()
    .set({

      study_year: spec.year,

      original_five_class_asset: spec.source,

      source_status: spec.status,

      classification_method:
        'Gaussian MLC; five-class source',

      reporting_method:
        'Post-classification aggregation of original classes 4 and 5',

      class_1: 'Built-up',

      class_2: 'Vegetation',

      class_3: 'Water',

      class_4:
        'Agricultural and Vacant/Unused Open Land, including green unused plots',

      note:
        '2010 provisional. 2010-2015 Built-up decline is not verified urban loss.'

    });

}

// ======================================================================
// 4. AREA STATISTICS
// ======================================================================

function areaByCode(image) {

  return ee.Image.pixelArea()
    .divide(1e6)
    .rename('area_km2')
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

      crsTransform: TRANSFORM,

      maxPixels: 1e9,

      tileScale: 8

    })
    .get('groups');

}

function totalArea(image) {

  return ee.Image.pixelArea()
    .divide(1e6)
    .rename('area_km2')
    .updateMask(image.mask())
    .reduceRegion({

      reducer: ee.Reducer.sum(),

      geometry: roi,

      crs: CRS,

      crsTransform: TRANSFORM,

      maxPixels: 1e9,

      tileScale: 8

    })
    .get('area_km2');

}

// ======================================================================
// 5. EXPORT FUNCTION
// ======================================================================

function exportAsset(image, name, destination) {

  Export.image.toAsset({

    image: image,

    description: name,

    assetId: destination,

    region: roi,

    crs: CRS,

    crsTransform: TRANSFORM,

    pyramidingPolicy: {
      '.default': 'mode'
    },

    maxPixels: 1e9

  });

}

// ======================================================================
// 6. PREPARE ALL FOUR YEARS
// ======================================================================

var maps = {};

print('========================================================');

print('STAGE 07AC5 — FINAL FOUR-YEAR FOUR-CLASS ASSET EXPORT');

print('========================================================');

print(
  'Classes: 1 Built-up, 2 Vegetation, 3 Water, 4 Agricultural + Vacant/Unused Open'
);

print(
  '2025 source is the recovered original GeoTIFF.'
);

print(
  'LULC export task switch: ' +
  CREATE_LULC_EXPORT_TASKS
);

print(
  'Transition export task switch: ' +
  CREATE_TRANSITION_EXPORT_TASKS
);

specs.forEach(function(spec) {

  var five = originalFive(spec);

  var four = aggregateFour(
    five,
    spec
  );

  maps[spec.year] = four;

  print('--------------------------------------------------------');

  print(
    'YEAR ' + spec.year + ' — ' + spec.status
  );

  print(
    'Source: ' + spec.source
  );

  print(
    'Destination: ' + spec.destination
  );

  print(
    'Four-class areas (km2):'
  );

  print(
    areaByCode(four)
  );

  print(
    'Total covered raster area (km2):'
  );

  print(
    totalArea(four)
  );

  // Original Built-up must be exactly preserved.

  var builtFour = ee.Image.pixelArea()
    .divide(1e6)
    .rename('area')
    .updateMask(four.eq(1));

  var builtFive = ee.Image.pixelArea()
    .divide(1e6)
    .rename('area')
    .updateMask(five.eq(1));

  var reductionSettings = {
    reducer: ee.Reducer.sum(),
    geometry: roi,
    crs: CRS,
    crsTransform: TRANSFORM,
    maxPixels: 1e9,
    tileScale: 8
  };

  var builtFourArea = ee.Number(
    builtFour.reduceRegion(
      reductionSettings
    ).get('area')
  );

  var builtFiveArea = ee.Number(
    builtFive.reduceRegion(
      reductionSettings
    ).get('area')
  );

  print(
    'Built-up area unchanged after aggregation (km2 difference):'
  );

  print(
    builtFourArea.subtract(builtFiveArea)
  );

  // Create export task for the final four-class raster.

  if (CREATE_LULC_EXPORT_TASKS) {

    exportAsset(

      four,

      'Chennai_LULC4_' + spec.year + '_FINAL',

      spec.destination

    );

  }

});

// ======================================================================
// 7. ADJACENT-YEAR TRANSITION ANALYSIS
// ======================================================================

function transition(fromYear, toYear) {

  return maps[fromYear]
    .multiply(10)
    .add(maps[toYear])
    .rename('transition')
    .toByte()
    .set({

      from_year: fromYear,

      to_year: toYear,

      note:
        'Mapped transitions only; use caution interpreting 2010-2015 Built-up losses.'

    });

}

var transitionPairs = [
  [2010, 2015],
  [2015, 2020],
  [2020, 2025]
];

transitionPairs.forEach(function(pair) {

  var fromYear = pair[0];

  var toYear = pair[1];

  var change = transition(
    fromYear,
    toYear
  );

  print(
    'Transition areas (km2): ' +
    fromYear + ' -> ' + toYear
  );

  print(
    areaByCode(change)
  );

  // Optional separate transition-image exports.

  if (CREATE_TRANSITION_EXPORT_TASKS) {

    exportAsset(

      change,

      'Chennai_LULC4_Transition_' +
        fromYear + '_' + toYear,

      ROOT +
        'chennai_lulc4_transition_' +
        fromYear + '_' + toYear + '_v1'

    );

  }

});

// ======================================================================
// 8. MAP VISUALIZATION
// ======================================================================

Map.layers().reset();

Map.setOptions('SATELLITE');

Map.centerObject(roi, 10);

var colors = [
  'e53935', // Built-up
  '2e7d32', // Vegetation
  '1976d2', // Water
  'd8b365'  // Agricultural + Vacant/Unused Open
];

[2010, 2015, 2020, 2025].forEach(function(year) {

  Map.addLayer(

    maps[year],

    {
      min: 1,
      max: 4,
      palette: colors
    },

    year + ' FOUR-CLASS LULC' +
      (year === 2010 ? ' (PROVISIONAL)' : ''),

    year === 2025,

    0.8

  );

});

// Show the known problematic transition as an optional layer.

Map.addLayer(

  transition(2010, 2015)
    .eq(14)
    .selfMask(),

  {
    palette: ['ff00ff']
  },

  '2010–2015 Built-up to Open (UNCERTAIN)',

  false,

  0.9

);

// ======================================================================
// 9. FINAL MESSAGES
// ======================================================================

print('========================================================');

print(
  'Expected archived four-class OA: 2010 81.00%, 2015 88.67%, 2020 95.67%, 2025 96.67%.'
);

print(
  'Export tasks must be STARTED manually in the GEE Tasks tab.'
);

print(
  'Check that output assets do not already exist before starting.'
);

print(
  'The original five-class assets remain untouched.'
);

print(
  '2010 remains provisional due to its documented temporal discrepancies.'
);

print('END STAGE 07AC5');

print('========================================================');

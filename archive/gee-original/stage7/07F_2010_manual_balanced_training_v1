
// =============================================================
// CHENNAI LULC — STAGE 07F
// 2010 MANUAL TRAINING: BALANCED 600-POINT SELECTION
// NEW TRAINING ASSET EXPORT
//
// Uses ONLY the 28 manually drawn training polygons.
// Does NOT use automated 2015-to-2010 transfer or V2C.
//
// No MLC yet. No accuracy assessment yet.
// Previous assets are preserved.
// =============================================================

// 1. LOCKED CONFIGURATION

var ROOT = 'projects/assignment-482806/assets/';
var CRS = 'EPSG:32644';
var SCALE = 30;
var INNER_BUFFER_M = 15;
var SEED = 42;

var BANDS = [
  'blue', 'green', 'red',
  'nir', 'swir1', 'swir2',
  'NDVI', 'NDWI', 'NDBI'
];

var EXPORT_ASSET =
  ROOT + 'chennai_training_2010_manual_final_v1';

// 2. LOAD ASSETS

var roi = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
).geometry();

var sites = ee.FeatureCollection(
  ROOT + 'chennai_training_2010_native_allclasses_v1'
);

var stack = ee.Image(
  ROOT + 'chennai_predictor_stack_2010'
).select(BANDS).clip(roi);

var validationPolys = ee.FeatureCollection(
  ROOT + 'chennai_validation_polygons_2010_manual_master'
);

var validationPoints = ee.FeatureCollection(
  ROOT + 'chennai_validation_2010_final'
);

var proj = ee.Projection(CRS).atScale(SCALE);

// 3. APPLY 15 M INWARD BUFFER

var interiors = sites.map(function(f) {
  f = ee.Feature(f);

  return ee.Feature(
    f.geometry().buffer(-INNER_BUFFER_M, 1)
  ).copyProperties(f);
});

// 4. SAMPLE THE ACTUAL 2010 PREDICTOR STACK

var grid = ee.Image.pixelCoordinates(proj)
  .rename(['grid_x', 'grid_y']);

var raw = stack.addBands(grid).sampleRegions({
  collection: interiors,
  properties: [
    'site_id',
    'class_id',
    'class_name',
    'review_st'
  ],
  projection: proj,
  scale: SCALE,
  geometries: true,
  tileScale: 8
});

// 5. PROTECT INDEPENDENT VALIDATION

var exclusionPolys = validationPolys
  .geometry().buffer(60, 1);

var exclusionPoints = validationPoints
  .geometry().buffer(30, 1);

var eligible = raw
  .filter(
    ee.Filter.bounds(exclusionPolys).not()
  )
  .filter(
    ee.Filter.bounds(exclusionPoints).not()
  );

// 6. REMOVE DUPLICATE LANDSAT PIXELS

eligible = eligible.map(function(f) {

  var key = ee.Number(f.get('grid_x'))
    .format('%.6f')
    .cat('_')
    .cat(
      ee.Number(f.get('grid_y')).format('%.6f')
    );

  return f.set('grid_key', key);

}).distinct(['grid_key']);

// 7. FIXED SITE-BALANCED TRAINING PLAN

// 6-site classes: 20 pixels per site.
// 5-site classes: 24 pixels per site.
//
// Each class receives exactly 120 training pixels
// if all sites meet their individual quota.

var GROUPS = [

  {
    id: 1,
    quota: 20,
    sites: [
      'BU2010_01',
      'BU2010_02',
      'BU2010_03',
      'BU2010_04',
      'BU2010_05',
      'BU2010_06'
    ]
  },

  {
    id: 2,
    quota: 20,
    sites: [
      'VG2010_01',
      'VG2010_02',
      'VG2010_03',
      'VG2010_04',
      'VG2010_05',
      'VG2010_06'
    ]
  },

  {
    id: 3,
    quota: 24,
    sites: [
      'WT2010_01',
      'WT2010_02',
      'WT2010_03',
      'WT2010_04',
      'WT2010_05'
    ]
  },

  {
    id: 4,
    quota: 20,
    sites: [
      'AG2010_01',
      'AG2010_02',
      'AG2010_03',
      'AG2010_04',
      'AG2010_05',
      'AG2010_06'
    ]
  },

  {
    id: 5,
    quota: 24,
    sites: [
      'B2010_01',
      'B2010_02',
      'B2010_03',
      'B2010_04',
      'B2010_05'
    ]
  }

];

// 8. SELECT TRAINING PIXELS

var selectedCollections = [];
var availabilityRows = [];

GROUPS.forEach(function(group) {

  group.sites.forEach(function(siteID) {

    var available = eligible
      .filter(
        ee.Filter.eq('site_id', siteID)
      )
      .filter(
        ee.Filter.eq('class_id', group.id)
      );

    // Reproducible random sampling within each site.
    // No NDVI-based automatic relabelling.

    var selected = available
      .randomColumn(
        'selection_random',
        SEED,
        'uniform',
        ['grid_key']
      )
      .sort('selection_random')
      .limit(group.quota)
      .map(function(f) {

        return ee.Feature(f).set({

          target_year: 2010,

          source_method:
            'MANUAL_HISTORICAL_INTERPRETATION',

          label_status:
            'USER_CONFIRMED_HISTORICAL_INTERPRETATION',

          selection_method:
            'SITE_BALANCED_RANDOM_V1',

          selection_seed: SEED

        });

      });

    selectedCollections.push(selected);

    availabilityRows.push(
      ee.Feature(null, {

        site_id: siteID,

        class_id: group.id,

        available: available.size(),

        required: group.quota,

        selected: selected.size(),

        shortfall: ee.Number(group.quota)
          .subtract(selected.size())
          .max(0)

      })
    );

  });

});

// 9. COMBINE ALL SELECTED TRAINING POINTS

var siteAvailability = ee.FeatureCollection(
  availabilityRows
);

var finalTraining = ee.FeatureCollection(
  selectedCollections
).flatten();

// 10. COMPREHENSIVE PRE-EXPORT QA

print('========================================');
print('STAGE 07F — 2010 MANUAL BALANCED TRAINING');
print('========================================');

print('Imported manual polygons:');
print(sites.size());

print('Raw valid 2010 pixels (expected 4289):');
print(raw.size());

print('Unique eligible pixels (expected 4287):');
print(eligible.size());

print('Pre-selection candidate counts by class:');
print(
  eligible.aggregate_histogram('class_id')
);

print('========================================');
print('SITE AVAILABILITY');
print('========================================');

print('Available vs selected pixels per site:');
print(
  siteAvailability.sort('site_id')
);

print('Any site sampling shortfall (expected 0):');
print(
  siteAvailability.aggregate_sum('shortfall')
);

print('========================================');
print('FINAL TRAINING QA');
print('========================================');

print('TOTAL SELECTED (expected 600):');
print(finalTraining.size());

print('SELECTED BY CLASS (expected 120 each):');
print(
  finalTraining.aggregate_histogram('class_id')
);

print('SELECTED BY SITE:');
print(
  finalTraining.aggregate_histogram('site_id')
);

print('Distinct selected grid keys (expected 600):');
print(
  finalTraining.aggregate_count_distinct('grid_key')
);

print('Training points inside validation polygon buffers:');
print(
  finalTraining.filter(
    ee.Filter.bounds(exclusionPolys)
  ).size()
);

print('Training points inside validation point buffers:');
print(
  finalTraining.filter(
    ee.Filter.bounds(exclusionPoints)
  ).size()
);

print('Example selected training sample:');
print(finalTraining.first());

// 11. MAP DISPLAY

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
  sites.style({
    color: 'FFFF00',
    fillColor: '00000000',
    width: 2
  }),
  {},
  '28 MANUAL TRAINING POLYGONS',
  true
);

Map.addLayer(
  finalTraining.style({
    color: '00FFFF',
    pointSize: 2
  }),
  {},
  'SELECTED 600 TRAINING POINTS',
  true
);

// 12. EXPORT TO NEW EARTH ENGINE ASSET
//
// Creates a Task. Does not overwrite older versions.
// Inspect the Console before starting the Task.

Export.table.toAsset({

  collection: finalTraining,

  description: 'Chennai_2010_manual_training_600_v1',

  assetId: EXPORT_ASSET

});

// 13. FINAL STATUS

print('========================================');
print('STAGE 07F — EXPORT TASK CREATED');
print('========================================');

print('New training asset path:');
print(EXPORT_ASSET);

print('Check all QA results before running the task.');

print('Existing V2C assets remain untouched.');

print('No classifier trained in this stage.');

print('========================================');
print('END STAGE 07F');
print('========================================');

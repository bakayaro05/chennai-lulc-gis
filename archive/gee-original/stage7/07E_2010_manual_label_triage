
// ============================================================
// CHENNAI LULC — STAGE 07E
// 2010 MANUAL TRAINING: LABEL-REVIEW TRIAGE + MAP INSPECTOR
//
// AUDIT ONLY
// No pixels approved or rejected automatically.
// No training/raster exports.
// No classifier or validation accuracy.
// ============================================================

// ------------------------------------------------------------
// 1. CONFIGURATION
// ------------------------------------------------------------

var ROOT = 'projects/assignment-482806/assets/';
var CRS = 'EPSG:32644';
var SCALE = 30;
var ERODE_M = 15;

var BANDS = [
  'blue', 'green', 'red',
  'nir', 'swir1', 'swir2',
  'NDVI', 'NDWI', 'NDBI'
];

// ------------------------------------------------------------
// 2. LOAD LOCKED ASSETS
// ------------------------------------------------------------

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

var projection = ee.Projection(CRS).atScale(SCALE);

// ------------------------------------------------------------
// 3. REPRODUCE STAGE 07D SAMPLING
// ------------------------------------------------------------

// Use the same 15 m inward polygon buffer as Stage 07D.

var interiors = sites.map(function(f) {
  f = ee.Feature(f);

  return ee.Feature(
    f.geometry().buffer(-ERODE_M, 1)
  ).copyProperties(f);
});

// Pixel coordinates for grid-based deduplication.

var grid = ee.Image.pixelCoordinates(projection)
  .rename(['grid_x', 'grid_y']);

var samples = stack.addBands(grid).sampleRegions({
  collection: interiors,
  properties: [
    'site_id',
    'class_id',
    'class_name',
    'review_st',
    'ref_year',
    'source'
  ],
  projection: projection,
  scale: SCALE,
  geometries: true,
  tileScale: 8
});

// ------------------------------------------------------------
// 4. PROTECT INDEPENDENT VALIDATION
// ------------------------------------------------------------

var excludePolygons = validationPolys
  .geometry()
  .buffer(60, 1);

var excludePoints = validationPoints
  .geometry()
  .buffer(30, 1);

var safeSamples = samples
  .filter(
    ee.Filter.bounds(excludePolygons).not()
  )
  .filter(
    ee.Filter.bounds(excludePoints).not()
  );

// ------------------------------------------------------------
// 5. REMOVE DUPLICATE LANDSAT PIXELS
// ------------------------------------------------------------

var keyed = safeSamples.map(function(f) {

  var key = ee.Number(f.get('grid_x'))
    .format('%.6f')
    .cat('_')
    .cat(
      ee.Number(f.get('grid_y')).format('%.6f')
    );

  return f.set('grid_key', key);
});

var candidates = keyed.distinct(['grid_key']);

// ------------------------------------------------------------
// 6. VERIFY STAGE 07D CANDIDATE TOTALS
// ------------------------------------------------------------

print('===============================================');
print('STAGE 07E — 2010 MANUAL LABEL-REVIEW TRIAGE');
print('===============================================');

print('Candidate counts by class:');
print(candidates.aggregate_histogram('class_id'));

print('Candidate total (expected from 07D: 4287):');
print(candidates.size());

print('Historical review status:');
print(sites.aggregate_histogram('review_st'));

// ------------------------------------------------------------
// 7. BUILD SITE-WISE SPECTRAL DIAGNOSTICS
// ------------------------------------------------------------

// These thresholds are REVIEW FLAGS ONLY.
//
// NDVI > 0.45:
// Indicates substantial vegetation signal, particularly
// important for sites labelled Barren/Fallow.
//
// NDVI > 0.30:
// Used to flag water sites for further inspection.
//
// NDWI < 0:
// Additional cue for inspecting water candidates.
//
// These thresholds are NOT automatic classification,
// rejection or label-correction rules.

var ids = ee.List(
  sites.aggregate_array('site_id')
).distinct().sort();

var review = ee.FeatureCollection(
  ids.map(function(id) {

    var site = ee.Feature(
      sites.filter(
        ee.Filter.eq('site_id', id)
      ).first()
    );

    var sub = candidates.filter(
      ee.Filter.eq('site_id', id)
    );

    var n = sub.size();

    var divisor = ee.Number(n).max(1);

    return ee.Feature(null, {

      site_id: id,

      class_id: site.get('class_id'),

      candidate_count: n,

      ref_year_recorded: site.get('ref_year'),

      historical_status: site.get('review_st'),

      ndvi_mean: sub.aggregate_mean('NDVI'),

      ndvi_min: sub.aggregate_min('NDVI'),

      ndvi_max: sub.aggregate_max('NDVI'),

      ndwi_mean: sub.aggregate_mean('NDWI'),

      ndbi_mean: sub.aggregate_mean('NDBI'),

      fraction_ndvi_gt_045: ee.Number(
        sub.filter(
          ee.Filter.gt('NDVI', 0.45)
        ).size()
      ).divide(divisor),

      fraction_ndvi_gt_030: ee.Number(
        sub.filter(
          ee.Filter.gt('NDVI', 0.30)
        ).size()
      ).divide(divisor),

      fraction_ndwi_lt_0: ee.Number(
        sub.filter(
          ee.Filter.lt('NDWI', 0)
        ).size()
      ).divide(divisor)

    });

  })
);

// ------------------------------------------------------------
// 8. PRINT ALL 28 SITE DIAGNOSTICS
// ------------------------------------------------------------

print('===============================================');
print('ALL 28 SITES — SPECTRAL DIAGNOSTICS');
print('===============================================');

print('Fractions range from 0 to 1.');
print(review);

// ------------------------------------------------------------
// 9. PRIORITY REVIEW — BARREN/FALLOW
// ------------------------------------------------------------

print('===============================================');
print('PRIORITY REVIEW — CLASS 5 BARREN/FALLOW');
print('===============================================');

var barrenReview = review.filter(
  ee.Filter.eq('class_id', 5)
).sort('fraction_ndvi_gt_045', false);

print(barrenReview);

// ------------------------------------------------------------
// 10. PRIORITY REVIEW — WATER
// ------------------------------------------------------------

print('===============================================');
print('PRIORITY REVIEW — CLASS 3 WATER');
print('===============================================');

var waterReview = review.filter(
  ee.Filter.eq('class_id', 3)
).sort('fraction_ndvi_gt_030', false);

print(waterReview);

// ------------------------------------------------------------
// 11. AGRICULTURAL / OPEN REVIEW
// ------------------------------------------------------------

print('===============================================');
print('CLASS 4 — AGRICULTURAL / OPEN');
print('===============================================');

var agricultureReview = review.filter(
  ee.Filter.eq('class_id', 4)
);

print(agricultureReview);

// ------------------------------------------------------------
// 12. SAFETY AND METHODOLOGY NOTICES
// ------------------------------------------------------------

print('===============================================');
print('IMPORTANT INTERPRETATION RULES');
print('===============================================');

print('Do not reject sites solely because an index is high or low.');
print('2010 annual median is not an exact-date historical photograph.');
print('All labels remain unverified until reference-image review.');
print('No training pixels or labels have been modified.');
print('No asset has been exported.');

// ------------------------------------------------------------
// 13. CONFIGURE THE MAP
// ------------------------------------------------------------

Map.layers().reset();

Map.setOptions('TERRAIN');

Map.centerObject(roi, 10);

// 2010 Landsat True Colour

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

// 2010 Landsat False Colour

Map.addLayer(
  stack,
  {
    bands: ['nir', 'red', 'green'],
    min: 0.02,
    max: 0.35
  },
  '2010 LANDSAT FALSE COLOUR',
  false
);

// NDVI

Map.addLayer(
  stack.select('NDVI'),
  {
    min: -0.2,
    max: 0.8,
    palette: [
      '253494',
      '2c7fb8',
      'ffffbf',
      '78c679',
      '006837'
    ]
  },
  '2010 NDVI',
  false
);

// NDWI

Map.addLayer(
  stack.select('NDWI'),
  {
    min: -0.7,
    max: 0.3,
    palette: [
      'a6611a',
      'f5f5f5',
      '018571'
    ]
  },
  '2010 NDWI',
  false
);

// Show all candidate training polygons.

Map.addLayer(
  sites.style({
    color: 'FFFF00',
    fillColor: '00000000',
    width: 2
  }),
  {},
  'ALL 28 MANUAL TRAINING POLYGONS',
  true
);

// Validation reference polygons.

Map.addLayer(
  validationPolys.style({
    color: 'FF00FF',
    fillColor: 'FF00FF11',
    width: 2
  }),
  {},
  'RESERVED VALIDATION POLYGONS',
  false
);

// ------------------------------------------------------------
// 14. SELECTED-SITE HIGHLIGHT LAYER
// ------------------------------------------------------------

var selectedLayer = ui.Map.Layer(
  ee.FeatureCollection([]),
  {},
  'SELECTED SITE',
  true
);

Map.layers().add(selectedLayer);

// ------------------------------------------------------------
// 15. INTERACTIVE SITE SELECTOR
// ------------------------------------------------------------

ids.evaluate(function(names, error) {

  if (error) {

    print('Site selector could not load:');
    print(error);

    return;
  }

  var select = ui.Select({

    items: names,

    placeholder: 'Choose 2010 training site',

    onChange: function(siteID) {

      var target = sites.filter(
        ee.Filter.eq('site_id', siteID)
      );

      // Highlight the selected polygon.

      selectedLayer.setEeObject(
        target.style({
          color: 'FF0000',
          fillColor: 'FF000022',
          width: 4
        })
      );

      // Zoom to the selected site.

      Map.centerObject(target, 15);

      // Print the selected site's diagnostics.

      print('===================================');
      print('SELECTED TRAINING SITE');
      print('===================================');

      print('Selected site ID:');
      print(siteID);

      print('Selected site diagnostics:');

      print(
        review.filter(
          ee.Filter.eq('site_id', siteID)
        ).first()
      );

      print('Site metadata and reference details:');
      print(target.first());

    }

  });

  var panel = ui.Panel({

    widgets: [

      ui.Label(
        'STAGE 07E — 2010 TRAINING REVIEW'
      ),

      ui.Label(
        'Start with B2010 and WT2010 sites.'
      ),

      select

    ],

    style: {
      position: 'top-left',
      width: '285px',
      padding: '8px'
    }

  });

  Map.add(panel);

});

// ------------------------------------------------------------
// 16. FINAL STATUS
// ------------------------------------------------------------

print('===============================================');
print('STAGE 07E — AUDIT ONLY');
print('===============================================');

print('28 manually collected sites under examination.');
print('Candidate pixels remain unapproved.');
print('Historical-reference label verification is pending.');
print('No Gaussian MLC classification executed.');
print('No exports performed.');

print('===============================================');
print('END OF STAGE 07E');
print('===============================================');

// ============================================================
// END
// ============================================================

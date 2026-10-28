
// ============================================================
// CHENNAI LULC — STAGE 07D
// 2010 MANUAL ALL-CLASS TRAINING QA
// NO EXPORT / NO MLC
// ============================================================

var ROOT = 'projects/assignment-482806/assets/';

var CRS = 'EPSG:32644';
var SCALE = 30;
var INNER_BUFFER_M = 15;

var BANDS = [
  'blue', 'green', 'red',
  'nir', 'swir1', 'swir2',
  'NDVI', 'NDWI', 'NDBI'
];

// LOCKED ASSETS

var roiFC = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
);

var roi = roiFC.geometry();

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

// PROTECT INDEPENDENT VALIDATION

var exclusionPolys = validationPolys
  .geometry().buffer(60, 1);

var exclusionPoints = validationPoints
  .geometry().buffer(30, 1);

// REMOVE THE OUTERMOST 15 M OF EACH DRAWN POLYGON
// TO REDUCE MIXED-BOUNDARY CANDIDATES.

var interiorSites = sites.map(function(f) {
  f = ee.Feature(f);

  return ee.Feature(
    f.geometry().buffer(-INNER_BUFFER_M, 1)
  ).copyProperties(f);
});

// PIXEL GRID FOR DEDUPLICATION

var pixelGrid = ee.Image.pixelCoordinates(
  projection
).rename(['grid_x', 'grid_y']);

var imageForQA = stack.addBands(pixelGrid);

// SAMPLE THE 2010 NINE-BAND IMAGE

var rawSamples = imageForQA.sampleRegions({
  collection: interiorSites,
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

// VALIDATION EXCLUSION

var afterPolyExclusion = rawSamples.filter(
  ee.Filter.bounds(exclusionPolys).not()
);

var afterBothExclusions = afterPolyExclusion.filter(
  ee.Filter.bounds(exclusionPoints).not()
);

// GRID DEDUPLICATION

var keyed = afterBothExclusions.map(function(f) {

  f = ee.Feature(f);

  var key = ee.Number(f.get('grid_x'))
    .format('%.6f')
    .cat('_')
    .cat(
      ee.Number(f.get('grid_y')).format('%.6f')
    );

  return f.set('grid_key', key);
});

var uniqueCandidates = keyed.distinct([
  'grid_key'
]);

// BASIC QA

print('===================================');
print('STAGE 07D — ALL CLASS MANUAL TRAINING');
print('===================================');

print('Imported polygon count:');
print(sites.size());

print('Polygons by class:');
print(sites.aggregate_histogram('class_id'));

print('Historical review status:');
print(sites.aggregate_histogram('review_st'));

print('2010 predictor bands:');
print(stack.bandNames());

print('Reserved validation polygons:');
print(validationPolys.size());

print('Reserved final validation points:');
print(validationPoints.size());

// PIXEL AVAILABILITY

print('===================================');
print('PIXEL SAMPLING AND EXCLUSIONS');
print('===================================');

print('Valid 2010 interior candidate pixels:');
print(rawSamples.size());

print('Excluded by validation polygon buffers:');
print(
  rawSamples.size().subtract(
    afterPolyExclusion.size()
  )
);

print('Additional validation point exclusions:');
print(
  afterPolyExclusion.size().subtract(
    afterBothExclusions.size()
  )
);

print('Duplicate pixel-grid observations:');
print(
  keyed.size().subtract(
    uniqueCandidates.size()
  )
);

print('Distinct candidate pixels overall:');
print(uniqueCandidates.size());

print('Candidate pixels by class:');
print(
  uniqueCandidates.aggregate_histogram('class_id')
);

print('Candidate pixels by site:');
print(
  uniqueCandidates.aggregate_histogram('site_id')
);

// CLASS-WISE SUMMARY

var classSummary = ee.FeatureCollection(
  ee.List.sequence(1, 5).map(function(k) {

    k = ee.Number(k);

    var sub = uniqueCandidates.filter(
      ee.Filter.eq('class_id', k)
    );

    return ee.Feature(null, {
      class_id: k,
      candidate_count: sub.size(),
      shortfall_before_approval: ee.Number(120)
        .subtract(sub.size()).max(0),
      distinct_sites: sub.aggregate_array('site_id')
        .distinct().size(),
      NDVI_mean: sub.aggregate_mean('NDVI'),
      NDBI_mean: sub.aggregate_mean('NDBI'),
      NDWI_mean: sub.aggregate_mean('NDWI')
    });

  })
);

print('===================================');
print('CLASS-WISE CANDIDATE SUMMARY');
print('===================================');

print(classSummary);

// SITE-WISE SUMMARY

var siteIDs = ee.List(
  sites.aggregate_array('site_id')
).distinct();

var siteSummary = ee.FeatureCollection(
  siteIDs.map(function(id) {

    var sub = uniqueCandidates.filter(
      ee.Filter.eq('site_id', id)
    );

    return ee.Feature(null, {
      site_id: id,
      candidate_count: sub.size(),
      NDVI_mean: sub.aggregate_mean('NDVI'),
      NDVI_min: sub.aggregate_min('NDVI'),
      NDVI_max: sub.aggregate_max('NDVI'),
      NDBI_mean: sub.aggregate_mean('NDBI')
    });

  })
);

print('===================================');
print('ALL 28 SITE SUMMARIES');
print('===================================');

print(siteSummary);

// MAP

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
  '2010 TRUE COLOR',
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
  validationPolys.style({
    color: 'FF00FF',
    fillColor: 'FF00FF11',
    width: 2
  }),
  {},
  'RESERVED VALIDATION POLYGONS',
  false
);

Map.addLayer(
  uniqueCandidates.style({
    color: '00FFFF',
    pointSize: 2
  }),
  {},
  'CANDIDATE PIXELS — NOT APPROVED',
  false
);

print('===================================');
print('07D AUDIT ONLY — NO MLC OR EXPORT');
print('Historical labels remain unverified.');
print('Raw counts are not final approved training.');
print('===================================');

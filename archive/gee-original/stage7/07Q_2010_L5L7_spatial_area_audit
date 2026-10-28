
// ============================================================
// CHENNAI LULC — STAGE 07Q
// 2010 L5+L7 SPATIAL, AREA AND REFERENCE AUDIT
//
// READ ONLY — NO TRAINING, NO MODEL MODIFICATION, NO EXPORTS
//
// Class 1 = Built-up
// Class 2 = Vegetation
// Class 3 = Water
// Class 4 = Agricultural land
// Class 5 = Vacant/Open land (green patches permitted)
//
// Both training and validation labels remain unchanged.
// ============================================================

// 1. CONFIGURATION

var ROOT = 'projects/assignment-482806/assets/';
var CRS = 'EPSG:32644';
var SCALE = 30;

var ORDER = [1, 2, 3, 4, 5];

var NAMES = ee.Dictionary({
  '1': 'Built-up',
  '2': 'Vegetation',
  '3': 'Water',
  '4': 'Agricultural',
  '5': 'Vacant/Open'
});

var PALETTE = [
  'ff0000',
  '008000',
  '0000ff',
  'ffff00',
  'd2b48c'
];

var BANDS = [
  'blue', 'green', 'red',
  'nir', 'swir1', 'swir2',
  'NDVI', 'NDWI', 'NDBI'
];

// 2. LOAD SAVED ASSETS

var roiFC = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
);

var roi = roiFC.geometry();

var classified = ee.Image(
  ROOT + 'chennai_mlc_lulc_2010_L5L7_manual_exp_v1'
).select('classification');

var stack = ee.Image(
  ROOT + 'chennai_predictor_stack_2010_L5L7_exp_v1'
).select(BANDS);

var training = ee.FeatureCollection(
  ROOT + 'chennai_training_2010_L5L7_manual_exp_v1'
);

var validation = ee.FeatureCollection(
  ROOT + 'chennai_validation_2010_final'
);

var projection = classified.projection();

// 3. BASIC INTEGRITY CHECKS

print('========================================');
print('STAGE 07Q — 2010 SPATIAL / AREA AUDIT');
print('========================================');

print('ROI area EPSG:32644 (expected 529.450838 km2):');
print(roi.area(1, ee.Projection(CRS)).divide(1e6));

print('Saved classification projection:');
print(projection);

print('Training samples (expected 600):');
print(training.size());

print('Validation samples (expected 300):');
print(validation.size());

print('Predictor bands:');
print(stack.bandNames());

// 4. CALCULATE CLASS AREAS
//
// Uses the saved categorical raster's native projection.
// Area totals remain EXPERIMENTAL.

var areaImage = ee.Image.pixelArea()
  .divide(1e6)
  .rename('area_km2')
  .addBands(classified);

var groupedArea = areaImage.reduceRegion({

  reducer: ee.Reducer.sum().group({
    groupField: 1,
    groupName: 'class_id'
  }),

  geometry: roi,

  crs: projection,

  maxPixels: 1e10,

  tileScale: 8

});

var areaRecords = ee.List(
  groupedArea.get('groups')
);

var rawAreaRows = ee.FeatureCollection(
  areaRecords.map(function(item) {

    var d = ee.Dictionary(item);

    var classID = ee.Number(
      d.get('class_id')
    );

    return ee.Feature(null, {

      class_id: classID,

      class_name: NAMES.get(
        classID.format('%d')
      ),

      area_km2: d.get('sum')

    });

  })
);

var totalArea = ee.Number(
  rawAreaRows.aggregate_sum('area_km2')
);

var areaTable = rawAreaRows.map(function(f) {

  var area = ee.Number(
    f.get('area_km2')
  );

  return f.set(
    'percent_of_classified_area',
    area.divide(totalArea.max(1e-12))
      .multiply(100)
  );

});

var roiArea = roi.area(
  1,
  ee.Projection(CRS)
).divide(1e6);

print('========================================');
print('2010 CLASS AREA STATISTICS — EXPERIMENTAL');
print('========================================');

print('Class area table:');
print(areaTable.sort('class_id'));

print('Total classified area (km2):');
print(totalArea);

print('Locked ROI vector area (km2):');
print(roiArea);

print('Raster minus vector area (km2):');
print(totalArea.subtract(roiArea));

print('Raster / vector area ratio (%):');
print(
  totalArea.divide(roiArea)
    .multiply(100)
);

// 5. RESAMPLE THE SAME 300 VALIDATION POINTS

var validationPredictions = classified.sampleRegions({

  collection: validation,

  properties: ['class_id'],

  projection: projection,

  scale: SCALE,

  geometries: true,

  tileScale: 8

});

var cm = validationPredictions.errorMatrix(
  'class_id',
  'classification',
  ORDER
);

print('========================================');
print('EXPORTED RASTER — REFERENCE AUDIT');
print('========================================');

print('Validation predictions (expected 300):');
print(validationPredictions.size());

print('Confusion matrix:');
print(cm);

print('Overall accuracy (expected 69.3333%):');
print(
  ee.Number(cm.accuracy()).multiply(100)
);

print('Kappa (expected 0.616667):');
print(cm.kappa());

print('Producer accuracy:');
print(cm.producersAccuracy());

print('User accuracy:');
print(cm.consumersAccuracy());

// 6. EXAMINE CRITICAL CLASS 4 / 5 ERRORS

var agricultural = validationPredictions.filter(
  ee.Filter.eq('class_id', 4)
);

var vacant = validationPredictions.filter(
  ee.Filter.eq('class_id', 5)
);

var vacantToAgri = vacant.filter(
  ee.Filter.eq('classification', 4)
);

var vacantCorrect = vacant.filter(
  ee.Filter.eq('classification', 5)
);

var agriculturalToVacant = agricultural.filter(
  ee.Filter.eq('classification', 5)
);

print('========================================');
print('CLASS 4 / CLASS 5 VALIDATION ERRORS');
print('========================================');

print('Vacant/Open reference count (expected 60):');
print(vacant.size());

print('Vacant/Open correctly classified (expected 20):');
print(vacantCorrect.size());

print('Vacant/Open predicted Agricultural (expected 20):');
print(vacantToAgri.size());

print('Agricultural predicted Vacant/Open (expected 15):');
print(agriculturalToVacant.size());

print('Complete Vacant/Open prediction histogram:');
print(vacant.aggregate_histogram('classification'));

// 7. SAMPLE L5+L7 SPECTRAL VALUES AT VALIDATION POINTS

var validationSpectra = stack.sampleRegions({

  collection: validation,

  properties: ['class_id'],

  projection: projection,

  scale: SCALE,

  geometries: false,

  tileScale: 8

});

print('========================================');
print('TRAINING VS VALIDATION SPECTRAL COVERAGE');
print('========================================');

print('Valid training spectra (expected 600):');
print(training.size());

print('Valid validation spectra (expected 300):');
print(validationSpectra.size());

// 8. TRAINING VS VALIDATION SPECTRAL COMPARISON
//
// The same L5+L7 predictor data are used for both.
// Comparing NDVI/NDWI/NDBI means and SDs by class.
//
// This diagnoses population differences.
// No training labels are changed.

var comparisonRows = ORDER.map(function(k) {

  var t = training.filter(
    ee.Filter.eq('class_id', k)
  );

  var v = validationSpectra.filter(
    ee.Filter.eq('class_id', k)
  );

  var tNDVI = ee.Dictionary(
    t.aggregate_stats('NDVI')
  );

  var vNDVI = ee.Dictionary(
    v.aggregate_stats('NDVI')
  );

  return ee.Feature(null, {

    class_id: k,

    class_name: NAMES.get(
      ee.Number(k).format('%d')
    ),

    training_count: t.size(),

    validation_count: v.size(),

    training_NDVI: tNDVI.get('mean'),

    validation_NDVI: vNDVI.get('mean'),

    training_NDVI_sd: tNDVI.get('sample_sd'),

    validation_NDVI_sd: vNDVI.get('sample_sd'),

    training_NDWI:
      t.aggregate_mean('NDWI'),

    validation_NDWI:
      v.aggregate_mean('NDWI'),

    training_NDBI:
      t.aggregate_mean('NDBI'),

    validation_NDBI:
      v.aggregate_mean('NDBI')

  });

});

var spectralComparison = ee.FeatureCollection(
  comparisonRows
);

print('========================================');
print('TRAINING VS VALIDATION — L5+L7 SPECTRA');
print('========================================');

print(spectralComparison.sort('class_id'));

// 9. OPTIONAL MAP FOR SPATIAL INSPECTION

Map.layers().reset();

Map.setOptions('SATELLITE');

Map.centerObject(roi, 10);

Map.addLayer(
  stack,
  {
    bands: ['red', 'green', 'blue'],
    min: 0.02,
    max: 0.30
  },
  '2010 L5+L7 True Colour',
  false
);

Map.addLayer(
  classified,
  {
    min: 1,
    max: 5,
    palette: PALETTE
  },
  '2010 L5+L7 MLC — EXPERIMENTAL',
  true
);

Map.addLayer(
  roiFC.style({
    color: 'FFFFFF',
    fillColor: '00000000',
    width: 2
  }),
  {},
  'Study Area Boundary',
  true
);

// Red: Vacant/Open reference predicted as agriculture.

Map.addLayer(
  vacantToAgri.style({
    color: 'FF0000',
    pointSize: 5
  }),
  {},
  'ERROR: Vacant/Open -> Agricultural',
  false
);

// Yellow: Agriculture predicted as vacant/open.

Map.addLayer(
  agriculturalToVacant.style({
    color: 'FFFF00',
    pointSize: 5
  }),
  {},
  'ERROR: Agricultural -> Vacant/Open',
  false
);

// Green: correctly recognized Vacant/Open points.

Map.addLayer(
  vacantCorrect.style({
    color: '00FF00',
    pointSize: 4
  }),
  {},
  'CORRECT: Vacant/Open',
  false
);

Map.addLayer(
  training.style({
    color: '00FFFF',
    pointSize: 2
  }),
  {},
  'Original 600 Training Locations',
  false
);

// 10. FINAL STATUS

print('========================================');
print('STAGE 07Q COMPLETE — AUDIT ONLY');
print('========================================');

print('No new classification created.');
print('No new training or validation samples created.');
print('No labels modified.');
print('No assets exported.');

print('Class areas are experimental, not final.');

print('The reused validation result is a development benchmark.');
print('Do not tune labels using these validation errors.');

print('========================================');
print('END STAGE 07Q');
print('========================================');

// ============================================================
// END STAGE 07Q
// ============================================================

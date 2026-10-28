/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var waterValAdd2015 = 
    /* color: #d63000 */
    /* shown: false */
    /* locked: true */
    ee.Geometry.MultiPolygon(
        [[[[80.15248552548657, 12.897348306707718],
           [80.14944926488171, 12.895549496053057],
           [80.15333310353527, 12.891826335251995],
           [80.15458837735424, 12.895225290431918],
           [80.15447036015759, 12.897829381784218]]],
         [[[80.18944568569557, 12.893930595642162],
           [80.19212789471047, 12.893512263023824],
           [80.19084641264249, 12.898805315821594],
           [80.1860398940878, 12.898753025301177]]],
         [[[80.18457837319973, 12.928356645546025],
           [80.18586583352688, 12.9276351207259],
           [80.18696017480495, 12.931525055934515],
           [80.18552251077297, 12.931838757744776]]],
         [[[80.16739530262345, 12.911108428569188],
           [80.16436977085465, 12.911694052837554],
           [80.16486329731339, 12.9090169021243]]]]),
    agriValAdd2015 = 
    /* color: #98ff00 */
    /* shown: false */
    ee.Geometry.MultiPolygon(
        [[[[80.24938063672069, 13.194166171505422],
           [80.24943964531901, 13.192411301408608],
           [80.25193409970286, 13.19238518717512],
           [80.25174098065379, 13.194061715304722]]],
         [[[80.24635967560383, 13.19797756181385],
           [80.24904724903675, 13.197000909827592],
           [80.24948176689716, 13.199215345085355],
           [80.24622556515308, 13.199450366517103]]],
         [[[80.23036212358862, 13.213489336440649],
           [80.22718638811499, 13.2133744437087],
           [80.22732586298376, 13.211797274375307],
           [80.23040503893286, 13.211906945420282]]]]),
    barrenValAdd2015 = 
    /* color: #0b4a8b */
    /* shown: false */
    /* locked: true */
    ee.Geometry.MultiPolygon(
        [[[[80.28110554535756, 13.185282362377123],
           [80.28391650040517, 13.185094334351382],
           [80.28390577156911, 13.187496903801943],
           [80.28094461281667, 13.187643146397662]]],
         [[[80.282109183563, 13.181199851422685],
           [80.28545121599555, 13.180212686199487],
           [80.28578917433143, 13.181727382527923],
           [80.28262953211188, 13.182641418878521]]],
         [[[80.27920732120742, 13.187710732634457],
           [80.27572581390609, 13.187924873361185],
           [80.27545222858657, 13.186164735482244],
           [80.27906784633865, 13.185616321981787]]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// ======================================================
// CHENNAI MULTI-TEMPORAL LULC PROJECT
// SCRIPT 04I
//
// FINALIZE + MATERIALIZE 2015 VALIDATION
// ======================================================
//
// REQUIRED GEOMETRY IMPORTS:
//
// waterValAdd2015
// agriValAdd2015
// barrenValAdd2015
//
// LOCKED FINAL TARGET:
//
// Built-up          = 60
// Vegetation        = 60
// Water             = 60
// Agricultural/Open = 60
// Barren/Fallow     = 60
//
// TOTAL = 300
//
// 30 m training exclusion
// Expected overlap = 0
//
// ======================================================


// ======================================================
// 1. SETTINGS
// ======================================================

var CRS = 'EPSG:32644';
var SCALE = 30;

var WATER_NEEDED = 25;
var AGRI_NEEDED = 6;
var BARREN_NEEDED = 45;

var VALIDATION_SEED = 84;

var BANDS = [
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

var TRAINING_2015_ASSET =
  'projects/assignment-482806/assets/chennai_training_2015_final';

var VALIDATION_2020_ASSET =
  'projects/assignment-482806/assets/chennai_validation_2020_final';

var FINAL_VALIDATION_2015_ASSET =
  'projects/assignment-482806/assets/chennai_validation_2015_final';


// ======================================================
// 3. LOAD DATA
// ======================================================

var roi =
  ee.FeatureCollection(ROI_ASSET).geometry();

var finalTraining2015 =
  ee.FeatureCollection(TRAINING_2015_ASSET);

var finalValidation2020 =
  ee.FeatureCollection(VALIDATION_2020_ASSET);


// ======================================================
// 4. LOCKED APPROVED VALIDATION IDS
// ======================================================

var BUILTUP_IDS = [1, 2, 3, 5, 6, 7];
var VEGETATION_IDS = [8, 9];
var WATER_IDS = [18, 20];
var AGRI_IDS = [22, 23, 24, 25, 27];
var BARREN_IDS = [28, 29, 30, 31];


// ======================================================
// 5. APPROVED SOURCE SELECTION
// ======================================================

function approved(classId, ids) {

  return finalValidation2020
    .filter(ee.Filter.eq('class_id', classId))
    .filter(ee.Filter.inList('val_poly_id', ids));
}


var approvedValidationSource =
  approved(1, BUILTUP_IDS)
    .merge(approved(2, VEGETATION_IDS))
    .merge(approved(3, WATER_IDS))
    .merge(approved(4, AGRI_IDS))
    .merge(approved(5, BARREN_IDS));


// ======================================================
// 6. LANDSAT 8 PREPROCESSING
// ======================================================

function preprocessL8(image) {

  var qa = image.select('QA_PIXEL');
  var radsat = image.select('QA_RADSAT');

  var mask =
    qa.bitwiseAnd(1 << 0).eq(0)
      .and(qa.bitwiseAnd(1 << 1).eq(0))
      .and(qa.bitwiseAnd(1 << 2).eq(0))
      .and(qa.bitwiseAnd(1 << 3).eq(0))
      .and(qa.bitwiseAnd(1 << 4).eq(0))
      .and(qa.bitwiseAnd(1 << 5).eq(0))
      .and(radsat.eq(0));

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
    .multiply(0.0000275)
    .add(-0.2);

  return optical.updateMask(mask);
}


// ======================================================
// 7. INDICES
// ======================================================

function addIndices(image) {

  var green = image.select('green');
  var red = image.select('red');
  var nir = image.select('nir');
  var swir1 = image.select('swir1');

  var ndvi =
    nir.subtract(red)
      .divide(nir.add(red))
      .rename('NDVI');

  var ndwi =
    green.subtract(nir)
      .divide(green.add(nir))
      .rename('NDWI');

  var ndbi =
    swir1.subtract(nir)
      .divide(swir1.add(nir))
      .rename('NDBI');

  return image.addBands([ndvi, ndwi, ndbi]);
}


// ======================================================
// 8. 2015 STACK
// ======================================================

var landsat2015 =
  ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterBounds(roi)
    .filterDate('2015-01-01', '2016-01-01')
    .map(preprocessL8);


var stack2015 =
  addIndices(
    landsat2015
      .median()
      .clip(roi)
  )
  .select(BANDS)
  .clip(roi);


print('2015 scene count:', landsat2015.size());
print('2015 bands:', stack2015.bandNames());


// ======================================================
// 9. REBUILD EXISTING APPROVED VALIDATION
// ======================================================

var approvedValidation2015 =
  stack2015.sampleRegions({

    collection: approvedValidationSource,

    properties: [
      'class_id',
      'class_name',
      'val_poly_id'
    ],

    scale: SCALE,
    projection: ee.Projection(CRS),
    geometries: true,
    tileScale: 16
  });


// ======================================================
// 10. 30 m TRAINING EXCLUSION
// ======================================================

var withinTraining =
  ee.Filter.withinDistance({

    distance: 30,
    leftField: '.geo',
    rightField: '.geo',
    maxError: 1
  });


var cleanApprovedValidation2015 =
  ee.FeatureCollection(
    ee.Join.inverted().apply(
      approvedValidation2015,
      finalTraining2015,
      withinTraining
    )
  );


print(
  'Existing clean validation:',
  cleanApprovedValidation2015.aggregate_histogram('class_name')
);


// ======================================================
// 11. NEW VALIDATION GEOMETRIES
// ======================================================

var newWaterPolygon =
  ee.Feature(
    waterValAdd2015,
    {
      class_id: 3,
      class_name: 'Water',
      val_poly_id: 201,
      source: 'new_validation_2015'
    }
  );


var newAgriPolygon =
  ee.Feature(
    agriValAdd2015,
    {
      class_id: 4,
      class_name: 'Agricultural/Open',
      val_poly_id: 202,
      source: 'new_validation_2015'
    }
  );


var newBarrenPolygon =
  ee.Feature(
    barrenValAdd2015,
    {
      class_id: 5,
      class_name: 'Barren/Fallow',
      val_poly_id: 203,
      source: 'new_validation_2015'
    }
  );


// ======================================================
// 12. SAMPLE NEW CANDIDATES
// ======================================================

function sampleNew(feature) {

  return stack2015.sampleRegions({

    collection:
      ee.FeatureCollection([feature]),

    properties: [
      'class_id',
      'class_name',
      'val_poly_id',
      'source'
    ],

    scale: SCALE,
    projection: ee.Projection(CRS),
    geometries: true,
    tileScale: 8
  });
}


var waterRaw =
  sampleNew(newWaterPolygon);

var agriRaw =
  sampleNew(newAgriPolygon);

var barrenRaw =
  sampleNew(newBarrenPolygon);


// ======================================================
// 13. APPLY TRAINING EXCLUSION
// ======================================================

function excludeTraining(fc) {

  return ee.FeatureCollection(
    ee.Join.inverted().apply(
      fc,
      finalTraining2015,
      withinTraining
    )
  );
}


var waterCandidates =
  excludeTraining(waterRaw);

var agriCandidates =
  excludeTraining(agriRaw);

var barrenCandidates =
  excludeTraining(barrenRaw);


// ======================================================
// 14. SELECT EXACT REQUIRED PIXELS
// ======================================================

function selectRandom(fc, n, seed) {

  return fc
    .randomColumn(
      'selection_random',
      seed
    )
    .sort('selection_random')
    .limit(n);
}


var selectedWater =
  selectRandom(
    waterCandidates,
    WATER_NEEDED,
    VALIDATION_SEED
  );


var selectedAgri =
  selectRandom(
    agriCandidates,
    AGRI_NEEDED,
    VALIDATION_SEED
  );


var selectedBarren =
  selectRandom(
    barrenCandidates,
    BARREN_NEEDED,
    VALIDATION_SEED
  );


// ======================================================
// 15. BUILD FINAL VALIDATION
// ======================================================

var finalValidationClean2015 =
  cleanApprovedValidation2015
    .merge(selectedWater)
    .merge(selectedAgri)
    .merge(selectedBarren);


// ======================================================
// 16. FINAL QA
// ======================================================

print('========================================');
print('FINAL 2015 VALIDATION QA');
print('========================================');

print(
  'Final validation count:',
  finalValidationClean2015.size()
);

print(
  'Final validation by class:',
  finalValidationClean2015.aggregate_histogram(
    'class_name'
  )
);


var c1 =
  finalValidationClean2015
    .filter(ee.Filter.eq('class_id', 1))
    .size();

var c2 =
  finalValidationClean2015
    .filter(ee.Filter.eq('class_id', 2))
    .size();

var c3 =
  finalValidationClean2015
    .filter(ee.Filter.eq('class_id', 3))
    .size();

var c4 =
  finalValidationClean2015
    .filter(ee.Filter.eq('class_id', 4))
    .size();

var c5 =
  finalValidationClean2015
    .filter(ee.Filter.eq('class_id', 5))
    .size();


print(
  'Explicit counts:',
  ee.Dictionary({
    Built_up: c1,
    Vegetation: c2,
    Water: c3,
    Agricultural_Open: c4,
    Barren_Fallow: c5
  })
);


var balanceOK =
  finalValidationClean2015.size().eq(300)
    .and(c1.eq(60))
    .and(c2.eq(60))
    .and(c3.eq(60))
    .and(c4.eq(60))
    .and(c5.eq(60));


print(
  'FINAL BALANCE OK?',
  balanceOK
);


// ======================================================
// 17. FINAL TRAINING OVERLAP CHECK
// ======================================================

var overlap =
  ee.FeatureCollection(
    ee.Join.inner().apply(
      finalValidationClean2015,
      finalTraining2015,
      withinTraining
    )
  );


print(
  'FINAL training-buffer overlap:',
  overlap.size()
);


// ======================================================
// 18. EXPORT FINAL VALIDATION ASSET
// ======================================================

Export.table.toAsset({

  collection:
    finalValidationClean2015,

  description:
    'chennai_validation_2015_final',

  assetId:
    FINAL_VALIDATION_2015_ASSET
});


// ======================================================
// 19. DRIVE BACKUP
// ======================================================

Export.table.toDrive({

  collection:
    finalValidationClean2015,

  description:
    'chennai_validation_2015_final',

  fileNamePrefix:
    'chennai_validation_2015_final',

  fileFormat:
    'CSV'
});


// ======================================================
// 20. MAP
// ======================================================

Map.layers().reset();

Map.addLayer(
  stack2015,
  {
    bands: ['red', 'green', 'blue'],
    min: 0.02,
    max: 0.30
  },
  '2015 TRUE COLOR',
  true
);

Map.addLayer(
  finalValidationClean2015,
  {
    color: '00ffff',
    pointSize: 4
  },
  'FINAL VALIDATION 2015',
  true
);

Map.centerObject(roi, 10);


// ======================================================
// 21. END
// ======================================================

print('========================================');
print('2015 FINAL VALIDATION READY FOR EXPORT');
print('========================================');

print(
  'Expected = 300 total / 60 per class.'
);

print(
  'FINAL BALANCE OK must be TRUE.'
);

print(
  'FINAL training-buffer overlap must be 0.'
);

print(
  'Run the ASSET export in Tasks.'
);

print(
  FINAL_VALIDATION_2015_ASSET
);
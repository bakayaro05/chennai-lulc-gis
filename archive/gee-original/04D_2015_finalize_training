/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var waterAdd2015 = /* color: #ff0000 */ee.Geometry.MultiPolygon(
        [[[[80.18048004507946, 13.121902053481561],
           [80.18045858740734, 13.118600242685963],
           [80.18380598425793, 13.118934605290935],
           [80.18517927527355, 13.122821537200133]]],
         [[[80.14563825735087, 13.099040184293802],
           [80.14885690816874, 13.102676642324985],
           [80.14583137639994, 13.105435298791118],
           [80.14400747426981, 13.102467651938912]]],
         [[[80.21557351730046, 13.15319258367234],
           [80.21362086913761, 13.153976134901477],
           [80.21284839294132, 13.151374735177285],
           [80.21418949744877, 13.150027011214586]]]]),
    agriAdd2015 = /* color: #00ff00 */ee.Geometry.MultiPolygon(
        [[[[80.25036353120689, 13.194452888143257],
           [80.25278824815635, 13.194160411011918],
           [80.25328177461509, 13.196500218261376],
           [80.25283116350059, 13.196562891361745],
           [80.25252002725486, 13.195518337590125],
           [80.25039571771507, 13.196009278418925]]],
         [[[80.26090239487593, 13.196918684670775],
           [80.26232933007185, 13.197080589869932],
           [80.2620503803343, 13.198809312888521],
           [80.26055907212202, 13.198704858672675]]],
         [[[80.26048795114599, 13.199469459098838],
           [80.2636422289475, 13.199667921449603],
           [80.26362613569341, 13.200931809479318],
           [80.26030556093298, 13.200900473491519]]],
         [[[80.25854073379746, 13.201074454618324],
           [80.25843344543686, 13.201821294034945],
           [80.25785945270768, 13.201810848744158],
           [80.25776825760117, 13.202286109022442],
           [80.25626622055283, 13.202045867678676],
           [80.2559014401268, 13.201831739325273],
           [80.25598727081528, 13.200870770744743]]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// ======================================================
// CHENNAI MULTI-TEMPORAL LULC PROJECT
// SCRIPT 04D
//
// FINALIZE + MATERIALIZE 2015 TRAINING
// ======================================================
//
// REQUIRED GEE GEOMETRY IMPORTS:
//
// waterAdd2015
// agriAdd2015
//
// LOCKED 2015 TRAINING:
//
// Built-up          = 120
// Vegetation        = 120
// Water             = 120
// Agricultural/Open = 120
// Barren/Fallow     = 120
//
// TOTAL = 600
//
// FINAL ASSET:
//
// projects/assignment-482806/assets/
// chennai_training_2015_final
//
// ======================================================


// ======================================================
// 1. SETTINGS
// ======================================================

var ANALYSIS_CRS = 'EPSG:32644';

var ANALYSIS_SCALE = 30;

var WATER_NEEDED = 18;

var AGRI_NEEDED = 25;

var WATER_SELECTION_SEED = 42;

var AGRI_SELECTION_SEED = 84;


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
// 2. ASSETS
// ======================================================

var ROI_ASSET =
  'projects/assignment-482806/assets/chennai_admin_study_area_clean';


var TRAINING_2020_ASSET =
  'projects/assignment-482806/assets/chennai_training_2020_final';


var FINAL_TRAINING_2015_ASSET =
  'projects/assignment-482806/assets/chennai_training_2015_final';


// ======================================================
// 3. PRINT HELPER
// ======================================================

function show(label, value) {

  print(label);

  print(value);

}


// ======================================================
// 4. LOAD DATA
// ======================================================

var studyArea =
  ee.FeatureCollection(
    ROI_ASSET
  );


var roi =
  studyArea.geometry();


var finalTraining2020 =
  ee.FeatureCollection(
    TRAINING_2020_ASSET
  );


// ======================================================
// 5. LOCKED APPROVED SOURCE IDS
// ======================================================

var BUILTUP_APPROVED_IDS = [

  1, 3, 4, 5, 6,
  7, 8, 9, 11, 12

];


var VEGETATION_APPROVED_IDS = [

  16, 17, 25, 26

];


var WATER_APPROVED_IDS = [

  31, 32, 35, 38, 39

];


var AGRI_APPROVED_IDS = [

  46, 47, 48, 51, 52,
  53, 55, 56, 57, 59, 60

];


var BARREN_APPROVED_IDS = [

  61, 62, 63, 64, 65

];


// ======================================================
// 6. SELECT APPROVED SOURCE LOCATIONS
// ======================================================

function selectApprovedClass(
  classId,
  idList
) {

  return finalTraining2020

    .filter(
      ee.Filter.eq(
        'class_id',
        classId
      )
    )

    .filter(
      ee.Filter.inList(
        'poly_id',
        idList
      )
    );

}


var approvedBuiltupSource =
  selectApprovedClass(
    1,
    BUILTUP_APPROVED_IDS
  );


var approvedVegetationSource =
  selectApprovedClass(
    2,
    VEGETATION_APPROVED_IDS
  );


var approvedWaterSource =
  selectApprovedClass(
    3,
    WATER_APPROVED_IDS
  );


var approvedAgriSource =
  selectApprovedClass(
    4,
    AGRI_APPROVED_IDS
  );


var approvedBarrenSource =
  selectApprovedClass(
    5,
    BARREN_APPROVED_IDS
  );


var approvedSourcePoints =
  approvedBuiltupSource

    .merge(
      approvedVegetationSource
    )

    .merge(
      approvedWaterSource
    )

    .merge(
      approvedAgriSource
    )

    .merge(
      approvedBarrenSource
    );


// ======================================================
// 7. LANDSAT 8 PREPROCESSING
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


  var mask =
    qa.bitwiseAnd(
      1 << 0
    )
    .eq(0)

    .and(
      qa.bitwiseAnd(
        1 << 1
      ).eq(0)
    )

    .and(
      qa.bitwiseAnd(
        1 << 2
      ).eq(0)
    )

    .and(
      qa.bitwiseAnd(
        1 << 3
      ).eq(0)
    )

    .and(
      qa.bitwiseAnd(
        1 << 4
      ).eq(0)
    )

    .and(
      qa.bitwiseAnd(
        1 << 5
      ).eq(0)
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
    mask
  );

}


// ======================================================
// 8. INDICES
// ======================================================

function addIndices(image) {

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
// 9. 2015 LANDSAT STACK
// ======================================================

var landsat2015 =
  ee.ImageCollection(
    'LANDSAT/LC08/C02/T1_L2'
  )

  .filterBounds(
    roi
  )

  .filterDate(
    '2015-01-01',
    '2016-01-01'
  )

  .map(
    preprocessL8
  );


var composite2015 =
  landsat2015

    .median()

    .clip(
      roi
    );


var stack2015 =
  addIndices(
    composite2015
  )

  .select(
    PREDICTOR_BANDS
  )

  .clip(
    roi
  );


// ======================================================
// 10. REBUILD 557 APPROVED TRANSFERRED PIXELS
// ======================================================

var retainedTraining2015 =
  stack2015.sampleRegions({

    collection:
      approvedSourcePoints,

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
      16

  });


// ======================================================
// 11. NEW WATER + AGRI FEATURES
// ======================================================

var newWaterPolygon =
  ee.Feature(

    waterAdd2015,

    {

      class_id:
        3,

      class_name:
        'Water',

      poly_id:
        201,

      source:
        'new_2015'

    }

  );


var newAgriPolygon =
  ee.Feature(

    agriAdd2015,

    {

      class_id:
        4,

      class_name:
        'Agricultural/Open',

      poly_id:
        202,

      source:
        'new_2015'

    }

  );


// ======================================================
// 12. SAMPLE NEW WATER
// ======================================================

var newWaterCandidatesRaw =
  stack2015.sampleRegions({

    collection:
      ee.FeatureCollection([
        newWaterPolygon
      ]),

    properties: [

      'class_id',

      'class_name',

      'poly_id',

      'source'

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
      8

  });


// ======================================================
// 13. SAMPLE NEW AGRI
// ======================================================

var newAgriCandidatesRaw =
  stack2015.sampleRegions({

    collection:
      ee.FeatureCollection([
        newAgriPolygon
      ]),

    properties: [

      'class_id',

      'class_name',

      'poly_id',

      'source'

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
      8

  });


// ======================================================
// 14. REMOVE NEW LOCATIONS WITHIN 30 m OF OLD TRAINING
// ======================================================

var nearOldTraining =
  ee.Filter.withinDistance({

    distance:
      30,

    leftField:
      '.geo',

    rightField:
      '.geo',

    maxError:
      1

  });


var usableNewWater =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      newWaterCandidatesRaw,

      retainedTraining2015,

      nearOldTraining

    )

  );


var usableNewAgri =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      newAgriCandidatesRaw,

      retainedTraining2015,

      nearOldTraining

    )

  );


// ======================================================
// 15. SELECT EXACTLY 18 WATER
// ======================================================

var selectedNewWater =
  usableNewWater

    .randomColumn(
      'selection_random',
      WATER_SELECTION_SEED
    )

    .sort(
      'selection_random'
    )

    .limit(
      WATER_NEEDED
    );


// ======================================================
// 16. SELECT EXACTLY 25 AGRI
// ======================================================

var selectedNewAgri =
  usableNewAgri

    .randomColumn(
      'selection_random',
      AGRI_SELECTION_SEED
    )

    .sort(
      'selection_random'
    )

    .limit(
      AGRI_NEEDED
    );


// ======================================================
// 17. BUILD FINAL TRAINING
// ======================================================

var finalTraining2015 =
  retainedTraining2015

    .merge(
      selectedNewWater
    )

    .merge(
      selectedNewAgri
    );


// ======================================================
// 18. FINAL QA
// ======================================================

print(
  '========================================'
);

print(
  'FINAL 2015 TRAINING QA'
);

print(
  '========================================'
);


show(
  'Final training total:',
  finalTraining2015.size()
);


show(
  'Final training by class:',
  finalTraining2015.aggregate_histogram(
    'class_name'
  )
);


var finalBalanceOK =
  finalTraining2015.size().eq(600)

  .and(

    finalTraining2015
      .filter(
        ee.Filter.eq(
          'class_id',
          1
        )
      )
      .size()
      .eq(120)

  )

  .and(

    finalTraining2015
      .filter(
        ee.Filter.eq(
          'class_id',
          2
        )
      )
      .size()
      .eq(120)

  )

  .and(

    finalTraining2015
      .filter(
        ee.Filter.eq(
          'class_id',
          3
        )
      )
      .size()
      .eq(120)

  )

  .and(

    finalTraining2015
      .filter(
        ee.Filter.eq(
          'class_id',
          4
        )
      )
      .size()
      .eq(120)

  )

  .and(

    finalTraining2015
      .filter(
        ee.Filter.eq(
          'class_id',
          5
        )
      )
      .size()
      .eq(120)

  );


show(
  'FINAL BALANCE OK?',
  finalBalanceOK
);


// ======================================================
// 19. SPECTRAL QA
// ======================================================

function spectralSummary(
  classId,
  className
) {

  var subset =
    finalTraining2015.filter(

      ee.Filter.eq(
        'class_id',
        classId
      )

    );


  return ee.Dictionary({

    class_name:
      className,

    n:
      subset.size(),

    mean_NDVI:
      subset.aggregate_mean(
        'NDVI'
      ),

    mean_NDWI:
      subset.aggregate_mean(
        'NDWI'
      ),

    mean_NDBI:
      subset.aggregate_mean(
        'NDBI'
      )

  });

}


print(
  '========================================'
);

print(
  'FINAL SPECTRAL QA'
);

print(
  '========================================'
);


show(
  'Built-up:',
  spectralSummary(
    1,
    'Built-up'
  )
);


show(
  'Vegetation:',
  spectralSummary(
    2,
    'Vegetation'
  )
);


show(
  'Water:',
  spectralSummary(
    3,
    'Water'
  )
);


show(
  'Agricultural/Open:',
  spectralSummary(
    4,
    'Agricultural/Open'
  )
);


show(
  'Barren/Fallow:',
  spectralSummary(
    5,
    'Barren/Fallow'
  )
);


// ======================================================
// 20. EXPORT FINAL TRAINING TO EARTH ENGINE ASSET
// ======================================================

Export.table.toAsset({

  collection:
    finalTraining2015,

  description:
    'chennai_training_2015_final',

  assetId:
    FINAL_TRAINING_2015_ASSET

});


// ======================================================
// 21. OPTIONAL DRIVE BACKUP
// ======================================================

Export.table.toDrive({

  collection:
    finalTraining2015,

  description:
    'chennai_training_2015_final',

  fileNamePrefix:
    'chennai_training_2015_final',

  fileFormat:
    'CSV'

});


// ======================================================
// 22. MAP
// ======================================================

Map.layers().reset();


Map.setOptions(
  'SATELLITE'
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

  '2015 TRUE COLOR',

  true

);


Map.addLayer(

  finalTraining2015,

  {

    color:
      '00ffff',

    pointSize:
      4

  },

  'FINAL TRAINING 2015',

  true

);


Map.centerObject(
  roi,
  10
);


// ======================================================
// 23. END
// ======================================================

print(
  '========================================'
);

print(
  '2015 FINAL TRAINING READY FOR EXPORT'
);

print(
  '========================================'
);


print(
  'Go to TASKS.'
);


print(
  'Run chennai_training_2015_final asset export.'
);


print(
  'Wait until COMPLETED before running Script 04E.'
);


print(
  FINAL_TRAINING_2015_ASSET
);


// ======================================================
// END SCRIPT 04D
// ======================================================
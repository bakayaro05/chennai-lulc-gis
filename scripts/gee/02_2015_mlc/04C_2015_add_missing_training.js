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
// SCRIPT 04C
//
// 2015 ADD MISSING TRAINING PIXELS
// FINAL DIRECT-GEOMETRY VERSION
// ======================================================
//
// REQUIRED GEOMETRY IMPORTS:
//
// waterAdd2015
// agriAdd2015
//
// These must exist in the Geometry Imports panel.
//
// IMPORTANT:
//
// - waterAdd2015 may contain multiple polygons.
// - agriAdd2015 may contain multiple polygons.
// - NO separate geometry assets are required.
// - NO validation is used here.
// - NO MLC is run here.
// - NO final export yet.
//
// LOCKED RETAINED TRAINING:
//
// Built-up          = 120
// Vegetation        = 120
// Water             = 102
// Agricultural/Open = 95
// Barren/Fallow     = 120
//
// TOTAL             = 557
//
// REQUIRED ADDITIONS:
//
// Water             = 18
// Agricultural/Open = 25
//
// FINAL TARGET:
//
// 120/class
// 600 total
//
// ======================================================


// ======================================================
// 1. LOCKED SETTINGS
// ======================================================

var ANALYSIS_CRS =
  'EPSG:32644';


var ANALYSIS_SCALE =
  30;


var WATER_NEEDED =
  18;


var AGRI_NEEDED =
  25;


var WATER_SELECTION_SEED =
  42;


var AGRI_SELECTION_SEED =
  84;


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
// 2. ASSET PATHS
// ======================================================

var ROI_ASSET =
  'projects/assignment-482806/assets/chennai_admin_study_area_clean';


var TRAINING_2020_ASSET =
  'projects/assignment-482806/assets/chennai_training_2020_final';


// ======================================================
// 3. PRINT HELPER
// ======================================================

function show(label, value) {

  print(label);

  print(value);

}


// ======================================================
// 4. LOAD LOCKED DATA
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
// 5. LOCKED APPROVED 2015 TRANSFER IDS
// ======================================================


// ------------------------------------------------------
// BUILT-UP
// ------------------------------------------------------

var BUILTUP_APPROVED_IDS = [

  1,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  11,
  12

];


// ------------------------------------------------------
// VEGETATION
// ------------------------------------------------------

var VEGETATION_APPROVED_IDS = [

  16,
  17,
  25,
  26

];


// ------------------------------------------------------
// WATER
// ------------------------------------------------------

var WATER_APPROVED_IDS = [

  31,
  32,
  35,
  38,
  39

];


// ------------------------------------------------------
// AGRICULTURAL / OPEN
// ------------------------------------------------------

var AGRI_APPROVED_IDS = [

  46,
  47,
  48,
  51,
  52,
  53,
  55,
  56,
  57,
  59,
  60

];


// ------------------------------------------------------
// BARREN / FALLOW
// ------------------------------------------------------

var BARREN_APPROVED_IDS = [

  61,
  62,
  63,
  64,
  65

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


// ======================================================
// 7. APPROVED SOURCE COLLECTIONS
// ======================================================

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


// ======================================================
// 8. MERGE APPROVED SOURCE LOCATIONS
// ======================================================

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
// 9. SOURCE QA
// ======================================================

print(
  '========================================'
);

print(
  'APPROVED 2015 TRANSFER SOURCE QA'
);

print(
  '========================================'
);


show(
  'Approved source total:',
  approvedSourcePoints.size()
);


show(
  'Approved source by class:',
  approvedSourcePoints.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 10. LANDSAT 8 PREPROCESSING — LOCKED
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
    clearMask
  );

}


// ======================================================
// 11. LOCKED SPECTRAL INDICES
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
// 12. BUILD 2015 LANDSAT COLLECTION
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


// ======================================================
// 13. FULL-YEAR MEDIAN COMPOSITE
// ======================================================

var composite2015 =
  landsat2015

    .median()

    .clip(
      roi
    );


// ======================================================
// 14. FINAL 9-BAND 2015 STACK
// ======================================================

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
// 15. LANDSAT QA
// ======================================================

show(
  '2015 Landsat scene count:',
  landsat2015.size()
);


show(
  '2015 predictor bands:',
  stack2015.bandNames()
);


// ======================================================
// 16. REBUILD LOCKED 557 RETAINED PIXELS
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
// 17. RETAINED POOL QA
// ======================================================

print(
  '========================================'
);

print(
  'RETAINED 2015 TRAINING'
);

print(
  '========================================'
);


show(
  'Retained total:',
  retainedTraining2015.size()
);


show(
  'Retained by class:',
  retainedTraining2015.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 18. DIRECTLY USE THE GEE GEOMETRY IMPORTS
// ======================================================
//
// waterAdd2015
// agriAdd2015
//
// They may each contain several polygons.
//
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
// 19. SAMPLE ALL WATER CANDIDATES
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
// 20. SAMPLE ALL AGRICULTURAL/OPEN CANDIDATES
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
// 21. REMOVE CANDIDATES WITHIN 30 m OF EXISTING
//     RETAINED TRAINING PIXELS
// ======================================================

var nearExistingTraining =
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


var newWaterCandidates =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      newWaterCandidatesRaw,

      retainedTraining2015,

      nearExistingTraining

    )

  );


var newAgriCandidates =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      newAgriCandidatesRaw,

      retainedTraining2015,

      nearExistingTraining

    )

  );


// ======================================================
// 22. CANDIDATE COUNT QA
// ======================================================

print(
  '========================================'
);

print(
  'NEW 2015 CANDIDATE PIXELS'
);

print(
  '========================================'
);


show(
  'Raw new Water candidates:',
  newWaterCandidatesRaw.size()
);


show(
  'Usable new Water candidates after 30 m exclusion:',
  newWaterCandidates.size()
);


show(
  'Water candidates required:',
  WATER_NEEDED
);


show(
  'Enough Water candidates?',
  newWaterCandidates.size().gte(
    WATER_NEEDED
  )
);


show(
  'Raw new Agricultural/Open candidates:',
  newAgriCandidatesRaw.size()
);


show(
  'Usable new Agricultural/Open candidates after 30 m exclusion:',
  newAgriCandidates.size()
);


show(
  'Agricultural/Open candidates required:',
  AGRI_NEEDED
);


show(
  'Enough Agricultural/Open candidates?',
  newAgriCandidates.size().gte(
    AGRI_NEEDED
  )
);


// ======================================================
// 23. RANDOMIZE WATER CANDIDATES
// ======================================================

var newWaterRandomized =
  newWaterCandidates.randomColumn(

    'selection_random',

    WATER_SELECTION_SEED

  );


// ======================================================
// 24. SELECT EXACTLY 18 NEW WATER PIXELS
// ======================================================

var selectedNewWater =
  newWaterRandomized

    .sort(
      'selection_random'
    )

    .limit(
      WATER_NEEDED
    );


// ======================================================
// 25. RANDOMIZE AGRI CANDIDATES
// ======================================================

var newAgriRandomized =
  newAgriCandidates.randomColumn(

    'selection_random',

    AGRI_SELECTION_SEED

  );


// ======================================================
// 26. SELECT EXACTLY 25 NEW AGRI PIXELS
// ======================================================

var selectedNewAgri =
  newAgriRandomized

    .sort(
      'selection_random'
    )

    .limit(
      AGRI_NEEDED
    );


// ======================================================
// 27. SELECTED NEW PIXEL COUNTS
// ======================================================

print(
  '========================================'
);

print(
  'SELECTED NEW 2015 TRAINING PIXELS'
);

print(
  '========================================'
);


show(
  'Selected new Water:',
  selectedNewWater.size()
);


show(
  'Selected new Agricultural/Open:',
  selectedNewAgri.size()
);


// ======================================================
// 28. NEW WATER SPECTRAL QA
// ======================================================

var newWaterQA =
  ee.Dictionary({

    n:
      selectedNewWater.size(),

    mean_NDVI:
      selectedNewWater.aggregate_mean(
        'NDVI'
      ),

    mean_NDWI:
      selectedNewWater.aggregate_mean(
        'NDWI'
      ),

    mean_NDBI:
      selectedNewWater.aggregate_mean(
        'NDBI'
      )

  });


show(
  'New Water spectral QA:',
  newWaterQA
);


// ======================================================
// 29. NEW AGRICULTURAL/OPEN SPECTRAL QA
// ======================================================

var newAgriQA =
  ee.Dictionary({

    n:
      selectedNewAgri.size(),

    mean_NDVI:
      selectedNewAgri.aggregate_mean(
        'NDVI'
      ),

    mean_NDWI:
      selectedNewAgri.aggregate_mean(
        'NDWI'
      ),

    mean_NDBI:
      selectedNewAgri.aggregate_mean(
        'NDBI'
      )

  });


show(
  'New Agricultural/Open spectral QA:',
  newAgriQA
);


// ======================================================
// 30. BUILD FINAL 2015 TRAINING CANDIDATE
// ======================================================

var finalTraining2015Candidate =
  retainedTraining2015

    .merge(
      selectedNewWater
    )

    .merge(
      selectedNewAgri
    );


// ======================================================
// 31. FINAL COUNTS
// ======================================================

print(
  '========================================'
);

print(
  'FINAL 2015 TRAINING CANDIDATE'
);

print(
  '========================================'
);


show(
  'Final training candidate total:',
  finalTraining2015Candidate.size()
);


show(
  'Final training candidate by class:',
  finalTraining2015Candidate.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 32. EXPLICIT FINAL COUNTS
// ======================================================

var finalCounts =
  ee.Dictionary({

    Built_up:

      finalTraining2015Candidate

        .filter(
          ee.Filter.eq(
            'class_id',
            1
          )
        )

        .size(),


    Vegetation:

      finalTraining2015Candidate

        .filter(
          ee.Filter.eq(
            'class_id',
            2
          )
        )

        .size(),


    Water:

      finalTraining2015Candidate

        .filter(
          ee.Filter.eq(
            'class_id',
            3
          )
        )

        .size(),


    Agricultural_Open:

      finalTraining2015Candidate

        .filter(
          ee.Filter.eq(
            'class_id',
            4
          )
        )

        .size(),


    Barren_Fallow:

      finalTraining2015Candidate

        .filter(
          ee.Filter.eq(
            'class_id',
            5
          )
        )

        .size()

  });


show(
  'Final explicit counts:',
  finalCounts
);


// ======================================================
// 33. FINAL BALANCE CHECK
// ======================================================

var finalBalanceOK =
  finalTraining2015Candidate.size().eq(600)

  .and(

    finalTraining2015Candidate
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

    finalTraining2015Candidate
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

    finalTraining2015Candidate
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

    finalTraining2015Candidate
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

    finalTraining2015Candidate
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
// 34. SPECTRAL SUMMARY FUNCTION
// ======================================================

function spectralSummary(
  classId,
  className
) {

  var subset =
    finalTraining2015Candidate.filter(

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


// ======================================================
// 35. FINAL SPECTRAL QA
// ======================================================

print(
  '========================================'
);

print(
  'FINAL 2015 TRAINING SPECTRAL QA'
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
// 36. MAP
// ======================================================

Map.layers().reset();


Map.setOptions(
  'SATELLITE'
);


// ======================================================
// 37. 2015 TRUE COLOR
// ======================================================

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


// ======================================================
// 38. 2015 SWIR-NIR-RED
// ======================================================

Map.addLayer(

  stack2015,

  {

    bands: [

      'swir1',

      'nir',

      'red'

    ],

    min:
      0.02,

    max:
      0.40

  },

  '2015 SWIR-NIR-RED',

  false

);


// ======================================================
// 39. NEW WATER DRAWING
// ======================================================

Map.addLayer(

  ee.FeatureCollection([
    newWaterPolygon
  ])
  .style({

    color:
      '00ffff',

    fillColor:
      '00ffff22',

    width:
      2

  }),

  {},

  'NEW WATER DRAWING',

  true

);


// ======================================================
// 40. ALL USABLE WATER CANDIDATES
// ======================================================

Map.addLayer(

  newWaterCandidates,

  {

    color:
      '0000ff',

    pointSize:
      4

  },

  'ALL USABLE WATER CANDIDATES',

  false

);


// ======================================================
// 41. SELECTED 18 WATER PIXELS
// ======================================================

Map.addLayer(

  selectedNewWater,

  {

    color:
      '00ffff',

    pointSize:
      8

  },

  'SELECTED 18 NEW WATER',

  true

);


// ======================================================
// 42. NEW AGRICULTURAL/OPEN DRAWING
// ======================================================

Map.addLayer(

  ee.FeatureCollection([
    newAgriPolygon
  ])
  .style({

    color:
      'ffff00',

    fillColor:
      'ffff0022',

    width:
      2

  }),

  {},

  'NEW AGRI DRAWING',

  true

);


// ======================================================
// 43. ALL USABLE AGRI CANDIDATES
// ======================================================

Map.addLayer(

  newAgriCandidates,

  {

    color:
      'ff9900',

    pointSize:
      4

  },

  'ALL USABLE AGRI CANDIDATES',

  false

);


// ======================================================
// 44. SELECTED 25 AGRI PIXELS
// ======================================================

Map.addLayer(

  selectedNewAgri,

  {

    color:
      'ffff00',

    pointSize:
      8

  },

  'SELECTED 25 NEW AGRI',

  true

);


// ======================================================
// 45. OLD APPROVED WATER
// ======================================================

Map.addLayer(

  approvedWaterSource,

  {

    color:
      '0066ff',

    pointSize:
      3

  },

  'OLD APPROVED WATER',

  false

);


// ======================================================
// 46. OLD APPROVED AGRI
// ======================================================

Map.addLayer(

  approvedAgriSource,

  {

    color:
      'ff6600',

    pointSize:
      3

  },

  'OLD APPROVED AGRI',

  false

);


// ======================================================
// 47. CENTER ON NEW DRAWINGS
// ======================================================

var newDrawingExtent =
  ee.FeatureCollection([

    newWaterPolygon,

    newAgriPolygon

  ]);


Map.centerObject(
  newDrawingExtent,
  11
);


// ======================================================
// 48. CURRENT CHECKPOINT
// ======================================================

print(
  '========================================'
);

print(
  'SCRIPT 04C COMPLETE'
);

print(
  '========================================'
);


print(
  'EXPECTED FINAL RESULT:'
);


print(
  'Built-up          = 120'
);


print(
  'Vegetation        = 120'
);


print(
  'Water             = 120'
);


print(
  'Agricultural/Open = 120'
);


print(
  'Barren/Fallow     = 120'
);


print(
  'TOTAL             = 600'
);


print(
  'FINAL BALANCE OK must be TRUE.'
);


print(
  'Do NOT export finalTraining2015 yet.'
);


print(
  'First visually verify SELECTED 18 NEW WATER and SELECTED 25 NEW AGRI.'
);


print(
  '========================================'
);


// ======================================================
// END SCRIPT 04C
// ======================================================
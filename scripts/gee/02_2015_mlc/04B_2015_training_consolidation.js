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
// SCRIPT 04B
//
// 2015 TRAINING CONSOLIDATION AFTER MANUAL REVIEW
// ======================================================
//
// STATUS:
//
// 2020 -> 2015 automatic temporal screening COMPLETE.
// 2015 manual TRAINING review COMPLETE.
//
// LOCKED MANUAL DECISIONS:
//
// BUILT-UP
// Stable:
// [1,3,4,5,6,9,11,12]
//
// Approved manual:
// [7,8]
//
// Rejected:
// none
//
//
// VEGETATION
// Stable:
// [16,26]
//
// Approved manual:
// [17,25]
//
// Rejected:
// none
//
//
// WATER
// Stable:
// [35]
//
// Approved manual:
// [31,32,38,39]
//
// Rejected:
// [34]
//
//
// AGRICULTURAL / OPEN
// Stable:
// [52,56,57,60]
//
// Approved manual:
// [59,46,47,48,51,53,55]
//
// Rejected:
// [58]
//
//
// BARREN / FALLOW
// Stable:
// [61,62,64]
//
// Approved manual:
// [63,65]
//
// Rejected:
// none
//
//
// EXPECTED RETAINED PIXELS:
//
// Built-up          = 120
// Vegetation        = 120
// Water             = 102
// Agricultural/Open = 95
// Barren/Fallow     = 120
//
// TOTAL             = 557
//
// EXPECTED DEFICITS:
//
// Water             = 18
// Agricultural/Open = 25
//
// TOTAL NEW PIXELS REQUIRED = 43
//
// IMPORTANT:
//
// - Do NOT create finalTraining2015 yet.
// - Do NOT balance yet.
// - Do NOT use validation yet.
// - Do NOT run MLC yet.
//
// First verify the retained counts.
//
// ======================================================


// ======================================================
// 1. LOCKED SETTINGS
// ======================================================

var ANALYSIS_CRS =
  'EPSG:32644';


var ANALYSIS_SCALE =
  30;


var TARGET_PER_CLASS =
  120;


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
// 5. LOCKED APPROVED SOURCE IDS
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
// 6. EXPLICIT REJECTED IDS
// ======================================================

var WATER_REJECTED_IDS = [
  34
];


var AGRI_REJECTED_IDS = [
  58
];


// ======================================================
// 7. FILTER ONE CLASS USING LOCKED IDS
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
// 8. BUILD APPROVED 2020 SOURCE-POINT COLLECTIONS
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
// 9. MERGE APPROVED SOURCE POINTS
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
// 10. SOURCE-POINT QA BEFORE 2015 SAMPLING
// ======================================================

print(
  '========================================'
);

print(
  '2015 TRAINING CONSOLIDATION'
);

print(
  '========================================'
);


show(
  'Approved source-point count:',
  approvedSourcePoints.size()
);


show(
  'Approved source points by class:',
  approvedSourcePoints.aggregate_histogram(
    'class_name'
  )
);


show(
  'Approved source groups:',
  approvedSourcePoints
    .aggregate_array(
      'poly_id'
    )
    .distinct()
    .sort()
);


// ======================================================
// 11. CHECK REJECTED SOURCE PIXEL COUNTS
// ======================================================

var rejectedWaterSource =
  finalTraining2020

    .filter(
      ee.Filter.eq(
        'class_id',
        3
      )
    )

    .filter(
      ee.Filter.inList(
        'poly_id',
        WATER_REJECTED_IDS
      )
    );


var rejectedAgriSource =
  finalTraining2020

    .filter(
      ee.Filter.eq(
        'class_id',
        4
      )
    )

    .filter(
      ee.Filter.inList(
        'poly_id',
        AGRI_REJECTED_IDS
      )
    );


show(
  'Rejected Water pixels - ID 34:',
  rejectedWaterSource.size()
);


show(
  'Rejected Agricultural/Open pixels - ID 58:',
  rejectedAgriSource.size()
);


// ======================================================
// 12. LANDSAT 8 PREPROCESSING — LOCKED
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
// 13. LOCKED INDICES
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
// 14. BUILD LOCKED 2015 LANDSAT COLLECTION
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
// 15. FULL-YEAR MEDIAN COMPOSITE
// ======================================================

var composite2015 =
  landsat2015

    .median()

    .clip(
      roi
    );


// ======================================================
// 16. FINAL 9-BAND 2015 STACK
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
// 17. STACK QA
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
// 18. SAMPLE 2015 AT APPROVED SOURCE LOCATIONS
// ======================================================
//
// These are the manually accepted temporal-transfer
// locations.
//
// ======================================================

var approvedTraining2015 =
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
// 19. 2015 RETAINED COUNTS
// ======================================================

print(
  '========================================'
);

print(
  '2015 RETAINED TRAINING PIXELS'
);

print(
  '========================================'
);


show(
  'Total retained 2015 training pixels:',
  approvedTraining2015.size()
);


show(
  'Retained 2015 pixels by class:',
  approvedTraining2015.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 20. EXPLICIT CLASS COUNTS
// ======================================================

var countBuiltup =
  approvedTraining2015

    .filter(
      ee.Filter.eq(
        'class_id',
        1
      )
    )

    .size();


var countVegetation =
  approvedTraining2015

    .filter(
      ee.Filter.eq(
        'class_id',
        2
      )
    )

    .size();


var countWater =
  approvedTraining2015

    .filter(
      ee.Filter.eq(
        'class_id',
        3
      )
    )

    .size();


var countAgri =
  approvedTraining2015

    .filter(
      ee.Filter.eq(
        'class_id',
        4
      )
    )

    .size();


var countBarren =
  approvedTraining2015

    .filter(
      ee.Filter.eq(
        'class_id',
        5
      )
    )

    .size();


var retainedCounts =
  ee.Dictionary({

    Built_up:
      countBuiltup,

    Vegetation:
      countVegetation,

    Water:
      countWater,

    Agricultural_Open:
      countAgri,

    Barren_Fallow:
      countBarren

  });


show(
  'Retained counts - explicit:',
  retainedCounts
);


// ======================================================
// 21. DEFICIT FUNCTION
// ======================================================

function deficit(count) {

  return ee.Number(
    TARGET_PER_CLASS
  )

  .subtract(
    count
  )

  .max(
    0
  );

}


// ======================================================
// 22. EXACT REMAINING DEFICITS
// ======================================================

var deficitBuiltup =
  deficit(
    countBuiltup
  );


var deficitVegetation =
  deficit(
    countVegetation
  );


var deficitWater =
  deficit(
    countWater
  );


var deficitAgri =
  deficit(
    countAgri
  );


var deficitBarren =
  deficit(
    countBarren
  );


var deficits =
  ee.Dictionary({

    Built_up_deficit:
      deficitBuiltup,

    Vegetation_deficit:
      deficitVegetation,

    Water_deficit:
      deficitWater,

    Agricultural_Open_deficit:
      deficitAgri,

    Barren_Fallow_deficit:
      deficitBarren

  });


show(
  'EXACT remaining deficits:',
  deficits
);


// ======================================================
// 23. TOTAL NEW PIXELS REQUIRED
// ======================================================

var totalDeficit =
  deficitBuiltup

    .add(
      deficitVegetation
    )

    .add(
      deficitWater
    )

    .add(
      deficitAgri
    )

    .add(
      deficitBarren
    );


show(
  'TOTAL new 2015 pixels required:',
  totalDeficit
);


// ======================================================
// 24. RETAINED SPECTRAL QA
// ======================================================

function spectralSummary(
  classId,
  className
) {

  var samples =
    approvedTraining2015.filter(

      ee.Filter.eq(
        'class_id',
        classId
      )

    );


  return ee.Dictionary({

    class_name:
      className,

    n:
      samples.size(),

    mean_NDVI:
      samples.aggregate_mean(
        'NDVI'
      ),

    mean_NDWI:
      samples.aggregate_mean(
        'NDWI'
      ),

    mean_NDBI:
      samples.aggregate_mean(
        'NDBI'
      )

  });

}


// ======================================================
// 25. PRINT SPECTRAL QA
// ======================================================

print(
  '========================================'
);

print(
  '2015 RETAINED TRAINING SPECTRAL QA'
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
// 26. MAP SETUP
// ======================================================

Map.layers().reset();


Map.setOptions(
  'SATELLITE'
);


// ======================================================
// 27. STUDY AREA
// ======================================================

Map.addLayer(

  studyArea.style({

    color:
      'ffffff',

    fillColor:
      '00000000',

    width:
      2

  }),

  {},

  'Chennai Urban Study Area',

  false

);


// ======================================================
// 28. 2015 TRUE COLOR
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
// 29. 2015 SWIR-NIR-RED
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
// 30. APPROVED WATER POINTS
// ======================================================

Map.addLayer(

  approvedWaterSource,

  {

    color:
      '00ffff',

    pointSize:
      5

  },

  'APPROVED WATER',

  true

);


// ======================================================
// 31. APPROVED AGRI/OPEN POINTS
// ======================================================

Map.addLayer(

  approvedAgriSource,

  {

    color:
      'ffff00',

    pointSize:
      5

  },

  'APPROVED AGRI OPEN',

  false

);


// ======================================================
// 32. REJECTED WATER ID 34
// ======================================================

Map.addLayer(

  rejectedWaterSource,

  {

    color:
      'ff0000',

    pointSize:
      7

  },

  'REJECTED WATER ID 34',

  false

);


// ======================================================
// 33. REJECTED AGRI ID 58
// ======================================================

Map.addLayer(

  rejectedAgriSource,

  {

    color:
      'ff00ff',

    pointSize:
      7

  },

  'REJECTED AGRI ID 58',

  false

);


// ======================================================
// 34. CENTER MAP
// ======================================================

Map.centerObject(
  roi,
  10
);


// ======================================================
// 35. CURRENT CHECKPOINT
// ======================================================

print(
  '========================================'
);

print(
  '2015 TRAINING CONSOLIDATION COMPLETE'
);

print(
  '========================================'
);


print(
  'EXPECTED IF ALL MANUAL DECISIONS WERE APPLIED CORRECTLY:'
);


print(
  'Built-up          = 120'
);


print(
  'Vegetation        = 120'
);


print(
  'Water             = 102'
);


print(
  'Agricultural/Open = 95'
);


print(
  'Barren/Fallow     = 120'
);


print(
  'TOTAL             = 557'
);


print(
  'Water deficit             = 18'
);


print(
  'Agricultural/Open deficit = 25'
);


print(
  'TOTAL new pixels needed   = 43'
);


print(
  'Do NOT run MLC yet.'
);


print(
  'Do NOT process validation yet.'
);


print(
  'Next step = add clean NEW 2015 training locations ONLY for Water and Agricultural/Open.'
);


print(
  '========================================'
);


// ======================================================
// EXPORT NEW 2015 ADDITIONAL TRAINING GEOMETRIES
// ======================================================

var waterAdd2015FC =
  ee.FeatureCollection([
    ee.Feature(
      waterAdd2015,
      {
        class_id: 3,
        class_name: 'Water'
      }
    )
  ]);


var agriAdd2015FC =
  ee.FeatureCollection([
    ee.Feature(
      agriAdd2015,
      {
        class_id: 4,
        class_name: 'Agricultural/Open'
      }
    )
  ]);


Export.table.toAsset({

  collection:
    waterAdd2015FC,

  description:
    'export_waterAdd2015',

  assetId:
    'projects/assignment-482806/assets/chennai_water_add_2015'

});


Export.table.toAsset({

  collection:
    agriAdd2015FC,

  description:
    'export_agriAdd2015',

  assetId:
    'projects/assignment-482806/assets/chennai_agri_add_2015'

});

// ======================================================
// END SCRIPT 04B
// ======================================================
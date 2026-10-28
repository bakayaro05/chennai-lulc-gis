// ======================================================
// CHENNAI MULTI-TEMPORAL LULC PROJECT
// SCRIPT 04A
//
// 2015 SINGLE TRAINING-ID MANUAL REVIEW
// ULTRA-LIGHT / MEMORY-SAFE VERSION
// ======================================================
//
// PURPOSE:
//
// Visual/manual inspection ONLY.
//
// The automatic 2020 -> 2015 screening has already been
// completed successfully in Script 04.
//
// We DO NOT recompute:
//
// - class reference signatures
// - temporal distances
// - stability screening
// - validation
// - MLC
// - balancing
//
// This script simply:
//
// 1. Loads the selected source pixels from the LOCKED
//    final 2020 training asset.
// 2. Builds the locked 2015 Landsat composite.
// 3. Builds the 2020 composite for optional comparison.
// 4. Displays the selected source locations.
// 5. Prints small 2015 spectral summaries.
//
// ======================================================


// ======================================================
// 1. CHANGE ONLY THIS VALUE FOR EACH REVIEW
// ======================================================
//
// CURRENT:
// Agricultural/Open ID 58
//
// ======================================================

var REVIEW_ID = 58;


// ======================================================
// 2. LOCKED PROJECT SETTINGS
// ======================================================

var ANALYSIS_CRS =
  'EPSG:32644';


var ANALYSIS_SCALE =
  30;


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
// 3. ASSETS
// ======================================================

var ROI_ASSET =
  'projects/assignment-482806/assets/chennai_admin_study_area_clean';


var TRAINING_2020_ASSET =
  'projects/assignment-482806/assets/chennai_training_2020_final';


// ======================================================
// 4. PRINT HELPER
// ======================================================
//
// One argument per print() to avoid Code Editor warnings.
//
// ======================================================

function show(label, value) {

  print(label);

  print(value);

}


// ======================================================
// 5. LOAD LOCKED DATA
// ======================================================

var studyArea =
  ee.FeatureCollection(
    ROI_ASSET
  );


var finalTraining2020 =
  ee.FeatureCollection(
    TRAINING_2020_ASSET
  );


// ======================================================
// 6. SELECT ONLY THE CURRENT REVIEW ID
// ======================================================

var selectedPoints =
  finalTraining2020.filter(

    ee.Filter.eq(
      'poly_id',
      REVIEW_ID
    )

  );


// ======================================================
// 7. BASIC SELECTED-ID QA
// ======================================================

print(
  '========================================'
);

print(
  '2015 SINGLE TRAINING-ID REVIEW'
);

print(
  '========================================'
);


show(
  'Selected poly_id:',
  REVIEW_ID
);


show(
  'Selected source pixel count:',
  selectedPoints.size()
);


show(
  'Selected original class:',
  ee.Feature(
    selectedPoints.first()
  ).get(
    'class_name'
  )
);


show(
  'Selected original class ID:',
  ee.Feature(
    selectedPoints.first()
  ).get(
    'class_id'
  )
);


// ======================================================
// 8. CREATE SMALL REVIEW AREA
// ======================================================
//
// Only a local area around the selected source points is
// used for the visual review.
//
// This makes the script much lighter than rebuilding the
// full temporal-screening graph.
//
// ======================================================

var reviewArea =
  selectedPoints
    .geometry()
    .bounds()
    .buffer(
      1000
    );


// ======================================================
// 9. LOCKED LANDSAT 8 PREPROCESSING
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
// 10. LOCKED INDICES
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
// 11. BUILD LOCAL 2015 COLLECTION
// ======================================================

var landsat2015 =
  ee.ImageCollection(
    'LANDSAT/LC08/C02/T1_L2'
  )

  .filterBounds(
    reviewArea
  )

  .filterDate(
    '2015-01-01',
    '2016-01-01'
  )

  .map(
    preprocessL8
  );


// ======================================================
// 12. BUILD LOCAL 2020 COLLECTION
// ======================================================

var landsat2020 =
  ee.ImageCollection(
    'LANDSAT/LC08/C02/T1_L2'
  )

  .filterBounds(
    reviewArea
  )

  .filterDate(
    '2020-01-01',
    '2021-01-01'
  )

  .map(
    preprocessL8
  );


// ======================================================
// 13. FULL-YEAR MEDIAN COMPOSITES
// ======================================================

var composite2015 =
  landsat2015
    .median()
    .clip(
      reviewArea
    );


var composite2020 =
  landsat2020
    .median()
    .clip(
      reviewArea
    );


// ======================================================
// 14. FINAL 9-BAND LOCAL STACKS
// ======================================================

var stack2015 =
  addIndices(
    composite2015
  )

  .select(
    PREDICTOR_BANDS
  );


var stack2020 =
  addIndices(
    composite2020
  )

  .select(
    PREDICTOR_BANDS
  );


// ======================================================
// 15. BASIC LANDSAT QA
// ======================================================

show(
  '2015 local scene count:',
  landsat2015.size()
);


show(
  '2020 local scene count:',
  landsat2020.size()
);


// ======================================================
// 16. SAMPLE ONLY THE SELECTED POINTS IN 2015
// ======================================================
//
// Usually only a few to a few dozen pixels.
// Very lightweight.
//
// ======================================================

var selected2015Samples =
  stack2015.sampleRegions({

    collection:
      selectedPoints,

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
      8

  });


// ======================================================
// 17. SELECTED-ID 2015 SPECTRAL QA
// ======================================================

show(
  'Valid selected 2015 pixels:',
  selected2015Samples.size()
);


show(
  'Mean 2015 NDVI:',
  selected2015Samples.aggregate_mean(
    'NDVI'
  )
);


show(
  'Mean 2015 NDWI:',
  selected2015Samples.aggregate_mean(
    'NDWI'
  )
);


show(
  'Mean 2015 NDBI:',
  selected2015Samples.aggregate_mean(
    'NDBI'
  )
);


// ======================================================
// 18. MAP RESET
// ======================================================

Map.layers().reset();


Map.setOptions(
  'SATELLITE'
);


// ======================================================
// 19. GOOGLE SATELLITE BASEMAP
// ======================================================
//
// Already supplied by Map.setOptions('SATELLITE').
//
// The Landsat layers below should be used for the actual
// year-specific decision.
//
// ======================================================


// ======================================================
// 20. 2015 TRUE COLOR
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
// 21. 2020 TRUE COLOR
// ======================================================

Map.addLayer(

  stack2020,

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

  '2020 TRUE COLOR',

  false

);


// ======================================================
// 22. 2015 FALSE COLOR VEGETATION
// ======================================================

Map.addLayer(

  stack2015,

  {

    bands: [

      'nir',

      'red',

      'green'

    ],

    min:
      0.02,

    max:
      0.45

  },

  '2015 FALSE COLOR VEGETATION',

  false

);


// ======================================================
// 23. 2015 SWIR-NIR-RED
// ======================================================
//
// Particularly useful for distinguishing:
//
// - built-up
// - dry soil
// - barren/fallow
// - agricultural/open
// - water
//
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
// 24. 2015 NDVI
// ======================================================

Map.addLayer(

  stack2015.select(
    'NDVI'
  ),

  {

    min:
      0,

    max:
      0.8,

    palette: [

      '8b4513',

      'ffff00',

      '90ee90',

      '006400'

    ]

  },

  '2015 NDVI',

  false

);


// ======================================================
// 25. 2015 NDWI
// ======================================================

Map.addLayer(

  stack2015.select(
    'NDWI'
  ),

  {

    min:
      -0.7,

    max:
      0.4,

    palette: [

      '8b4513',

      'ffffff',

      '00ffff',

      '0000ff'

    ]

  },

  '2015 NDWI',

  false

);


// ======================================================
// 26. 2015 NDBI
// ======================================================

Map.addLayer(

  stack2015.select(
    'NDBI'
  ),

  {

    min:
      -0.5,

    max:
      0.3,

    palette: [

      '006400',

      'ffffff',

      'ff0000'

    ]

  },

  '2015 NDBI',

  false

);


// ======================================================
// 27. SELECTED REVIEW POINTS
// ======================================================

Map.addLayer(

  selectedPoints,

  {

    color:
      '00ffff',

    pointSize:
      9

  },

  'SELECTED REVIEW GROUP',

  true

);


// ======================================================
// 28. OPTIONAL REVIEW AREA BOUNDARY
// ======================================================

Map.addLayer(

  ee.FeatureCollection([

    ee.Feature(
      reviewArea
    )

  ])

  .style({

    color:
      'ffffff',

    fillColor:
      '00000000',

    width:
      1

  }),

  {},

  'LOCAL REVIEW AREA',

  false

);


// ======================================================
// 29. AUTO-ZOOM
// ======================================================

Map.centerObject(
  selectedPoints,
  15
);


// ======================================================
// 30. FINAL MESSAGE
// ======================================================

print(
  '========================================'
);

print(
  'SINGLE-ID REVIEW READY'
);

print(
  '========================================'
);


print(
  'Use 2015 TRUE COLOR as the primary year-specific evidence.'
);


print(
  'Use SWIR-NIR-RED / NDVI / NDWI / NDBI only as supporting evidence.'
);


print(
  'Google Satellite can help with spatial interpretation but is not the 2015 temporal reference.'
);


print(
  'No validation data are loaded in this script.'
);


print(
  '========================================'
);


// ======================================================
// END
// ======================================================
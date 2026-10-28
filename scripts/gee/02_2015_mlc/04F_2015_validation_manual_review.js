// ======================================================
// CHENNAI MULTI-TEMPORAL LULC PROJECT
// SCRIPT 04F
//
// 2015 VALIDATION MANUAL REVIEW HELPER
// ======================================================
//
// PURPOSE:
//
// Manual inspection of ONE independent validation
// source group at a time.
//
// TRAINING IS COMPLETELY FROZEN.
//
// This script:
//
// 1. Loads finalValidation2020.
// 2. Selects one val_poly_id.
// 3. Builds 2015 Landsat imagery.
// 4. Displays the selected validation points.
// 5. Displays 2015 spectral views.
// 6. Reports simple 2015 spectral QA.
//
// NO TRAINING MODIFICATION.
// NO VALIDATION BALANCING.
// NO MLC.
// NO TEMPORAL SCREENING RECOMPUTATION.
//
// ======================================================


// ======================================================
// 1. CHANGE ONLY THIS ID
// ======================================================
//
// Start with Built-up ID 2.
//
// Later change to:
//
// Built-up:
// 2, 5, 1, 3, 6, 7
//
// Water:
// 18, 19
//
// Agricultural/Open:
// 22, 23, 27
//
// Barren/Fallow:
// 29, 30, 33
//
// ======================================================

var REVIEW_ID = 22;


// ======================================================
// 2. LOCKED SETTINGS
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


var VALIDATION_2020_ASSET =
  'projects/assignment-482806/assets/chennai_validation_2020_final';


var TRAINING_2015_ASSET =
  'projects/assignment-482806/assets/chennai_training_2015_final';


// ======================================================
// 4. PRINT HELPER
// ======================================================

function show(label, value) {

  print(label);

  print(value);

}


// ======================================================
// 5. LOAD DATA
// ======================================================

var studyArea =
  ee.FeatureCollection(
    ROI_ASSET
  );


var finalValidation2020 =
  ee.FeatureCollection(
    VALIDATION_2020_ASSET
  );


var finalTraining2015 =
  ee.FeatureCollection(
    TRAINING_2015_ASSET
  );


// ======================================================
// 6. SELECT CURRENT VALIDATION GROUP
// ======================================================

var selectedValidation =
  finalValidation2020.filter(

    ee.Filter.eq(
      'val_poly_id',
      REVIEW_ID
    )

  );


// ======================================================
// 7. SELECTED GROUP QA
// ======================================================

print(
  '========================================'
);

print(
  '2015 VALIDATION MANUAL REVIEW'
);

print(
  '========================================'
);


show(
  'Selected val_poly_id:',
  REVIEW_ID
);


show(
  'Selected validation pixel count:',
  selectedValidation.size()
);


show(
  'Original class:',
  ee.Feature(
    selectedValidation.first()
  ).get(
    'class_name'
  )
);


show(
  'Original class ID:',
  ee.Feature(
    selectedValidation.first()
  ).get(
    'class_id'
  )
);


// ======================================================
// 8. LOCAL REVIEW AREA
// ======================================================

var reviewArea =
  selectedValidation

    .geometry()

    .bounds()

    .buffer(
      1000
    );


// ======================================================
// 9. LANDSAT 8 PREPROCESSING — LOCKED
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
// 10. INDICES — LOCKED
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
// 11. 2015 LOCAL LANDSAT
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
// 12. 2020 LOCAL LANDSAT
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
// 13. LOCAL STACKS
// ======================================================

var stack2015 =
  addIndices(

    landsat2015
      .median()
      .clip(
        reviewArea
      )

  )

  .select(
    PREDICTOR_BANDS
  );


var stack2020 =
  addIndices(

    landsat2020
      .median()
      .clip(
        reviewArea
      )

  )

  .select(
    PREDICTOR_BANDS
  );


// ======================================================
// 14. SAMPLE SELECTED VALIDATION GROUP IN 2015
// ======================================================

var selected2015 =
  stack2015.sampleRegions({

    collection:
      selectedValidation,

    properties: [

      'class_id',

      'class_name',

      'val_poly_id'

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
// 15. 2015 SPECTRAL QA
// ======================================================

show(
  'Valid 2015 pixels:',
  selected2015.size()
);


show(
  'Mean 2015 NDVI:',
  selected2015.aggregate_mean(
    'NDVI'
  )
);


show(
  'Mean 2015 NDWI:',
  selected2015.aggregate_mean(
    'NDWI'
  )
);


show(
  'Mean 2015 NDBI:',
  selected2015.aggregate_mean(
    'NDBI'
  )
);


// ======================================================
// 16. CHECK 30 m TRAINING OVERLAP FOR THIS GROUP
// ======================================================

var withinTrainingDistance =
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


var cleanSelected2015 =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      selected2015,

      finalTraining2015,

      withinTrainingDistance

    )

  );


show(
  'Pixels before 30 m exclusion:',
  selected2015.size()
);


show(
  'Pixels surviving 30 m exclusion:',
  cleanSelected2015.size()
);


show(
  'Pixels removed by 30 m exclusion:',
  selected2015
    .size()
    .subtract(
      cleanSelected2015.size()
    )
);


// ======================================================
// 17. MAP RESET
// ======================================================

Map.layers().reset();


Map.setOptions(
  'SATELLITE'
);


// ======================================================
// 18. 2015 TRUE COLOR
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
// 19. 2020 TRUE COLOR
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
// 20. 2015 FALSE COLOR VEGETATION
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
// 21. 2015 SWIR-NIR-RED
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
// 22. NDVI
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
// 23. NDWI
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
// 24. NDBI
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
// 25. ALL SELECTED SOURCE POINTS
// ======================================================

Map.addLayer(

  selectedValidation,

  {

    color:
      'ffff00',

    pointSize:
      8

  },

  'SELECTED VALIDATION GROUP',

  true

);


// ======================================================
// 26. CLEAN SURVIVING POINTS
// ======================================================

Map.addLayer(

  cleanSelected2015,

  {

    color:
      '00ffff',

    pointSize:
      9

  },

  'SURVIVES 30 m EXCLUSION',

  true

);


// ======================================================
// 27. FINAL TRAINING — OPTIONAL
// ======================================================

Map.addLayer(

  finalTraining2015,

  {

    color:
      'ff0000',

    pointSize:
      3

  },

  'FINAL TRAINING 2015',

  false

);


// ======================================================
// 28. CENTER
// ======================================================

Map.centerObject(
  selectedValidation,
  15
);


// ======================================================
// 29. FINAL MESSAGE
// ======================================================

print(
  '========================================'
);

print(
  'VALIDATION REVIEW READY'
);

print(
  '========================================'
);


print(
  'Yellow = original selected validation locations.'
);


print(
  'Cyan = locations that survive the 30 m training exclusion.'
);


print(
  'Manual decision must be based on 2015 land cover.'
);


print(
  'Training remains frozen.'
);


print(
  '========================================'
);


// ======================================================
// END SCRIPT 04F
// ======================================================
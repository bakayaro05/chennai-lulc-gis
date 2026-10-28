// ======================================================
// CHENNAI MULTI-TEMPORAL LULC PROJECT
// SCRIPT 04G
//
// 2015 VALIDATION CONSOLIDATION
// AFTER MANUAL REVIEW
// ======================================================
//
// TRAINING IS LOCKED:
//
// projects/assignment-482806/assets/
// chennai_training_2015_final
//
// 600 pixels
// 120/class
//
// ------------------------------------------------------
// LOCKED VALIDATION DECISIONS
// ------------------------------------------------------
//
// BUILT-UP
//
// Approved:
// 1, 2, 3, 5, 6, 7
//
// Rejected:
// none
//
//
// VEGETATION
//
// Stable / approved:
// 8, 9
//
// No manual review required.
//
//
// WATER
//
// Stable:
// 20
//
// Approved:
// 18
//
// Rejected:
// 19
//
//
// AGRICULTURAL / OPEN
//
// Stable:
// 24, 25
//
// Approved:
// 22, 23, 27
//
// Rejected:
// none
//
//
// BARREN / FALLOW
//
// Stable:
// 28, 31
//
// Approved:
// 29, 30
//
// Rejected:
// 33
//
//
// THIS SCRIPT:
//
// 1. Loads finalTraining2015.
// 2. Loads independent finalValidation2020.
// 3. Keeps ONLY approved 2015 validation groups.
// 4. Samples the locked 2015 Landsat stack.
// 5. Reapplies 30 m training exclusion globally.
// 6. Calculates exact clean counts by class.
// 7. Calculates exact deficits to 60/class.
// 8. Does NOT balance yet.
// 9. Does NOT run MLC.
//
// ======================================================


// ======================================================
// 1. LOCKED SETTINGS
// ======================================================

var ANALYSIS_CRS =
  'EPSG:32644';


var ANALYSIS_SCALE =
  30;


var VALIDATION_TARGET =
  60;


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


var TRAINING_2015_ASSET =
  'projects/assignment-482806/assets/chennai_training_2015_final';


var VALIDATION_2020_ASSET =
  'projects/assignment-482806/assets/chennai_validation_2020_final';


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


var finalTraining2015 =
  ee.FeatureCollection(
    TRAINING_2015_ASSET
  );


var finalValidation2020 =
  ee.FeatureCollection(
    VALIDATION_2020_ASSET
  );


// ======================================================
// 5. LOCKED APPROVED VALIDATION IDS
// ======================================================


// ------------------------------------------------------
// BUILT-UP
// ------------------------------------------------------

var BUILTUP_APPROVED_IDS = [

  1,
  2,
  3,
  5,
  6,
  7

];


// ------------------------------------------------------
// VEGETATION
// ------------------------------------------------------

var VEGETATION_APPROVED_IDS = [

  8,
  9

];


// ------------------------------------------------------
// WATER
// ------------------------------------------------------

var WATER_APPROVED_IDS = [

  18,
  20

];


// ------------------------------------------------------
// AGRICULTURAL / OPEN
// ------------------------------------------------------

var AGRI_APPROVED_IDS = [

  22,
  23,
  24,
  25,
  27

];


// ------------------------------------------------------
// BARREN / FALLOW
// ------------------------------------------------------

var BARREN_APPROVED_IDS = [

  28,
  29,
  30,
  31

];


// ======================================================
// 6. LOCKED REJECTED VALIDATION IDS
// ======================================================

var WATER_REJECTED_IDS = [

  19

];


var BARREN_REJECTED_IDS = [

  33

];


// ======================================================
// 7. SELECT APPROVED VALIDATION CLASS
// ======================================================

function selectApprovedClass(
  classId,
  idList
) {

  return finalValidation2020

    .filter(

      ee.Filter.eq(
        'class_id',
        classId
      )

    )

    .filter(

      ee.Filter.inList(
        'val_poly_id',
        idList
      )

    );

}


// ======================================================
// 8. BUILD APPROVED SOURCE COLLECTIONS
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
// 9. MERGE ALL APPROVED VALIDATION SOURCE POINTS
// ======================================================

var approvedValidationSource =
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
// 10. SOURCE QA
// ======================================================

print(
  '========================================'
);

print(
  '2015 APPROVED VALIDATION SOURCE QA'
);

print(
  '========================================'
);


show(
  'Approved validation source pixels:',
  approvedValidationSource.size()
);


show(
  'Approved source pixels by class:',
  approvedValidationSource.aggregate_histogram(
    'class_name'
  )
);


show(
  'Approved validation IDs:',
  approvedValidationSource
    .aggregate_array(
      'val_poly_id'
    )
    .distinct()
    .sort()
);


// ======================================================
// 11. REJECTED SOURCE QA
// ======================================================

var rejectedWater =
  finalValidation2020

    .filter(
      ee.Filter.eq(
        'class_id',
        3
      )
    )

    .filter(
      ee.Filter.inList(
        'val_poly_id',
        WATER_REJECTED_IDS
      )
    );


var rejectedBarren =
  finalValidation2020

    .filter(
      ee.Filter.eq(
        'class_id',
        5
      )
    )

    .filter(
      ee.Filter.inList(
        'val_poly_id',
        BARREN_REJECTED_IDS
      )
    );


show(
  'Rejected Water ID 19 pixels:',
  rejectedWater.size()
);


show(
  'Rejected Barren/Fallow ID 33 pixels:',
  rejectedBarren.size()
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
// 14. BUILD LOCKED 2015 STACK
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
// 16. SAMPLE APPROVED VALIDATION LOCATIONS IN 2015
// ======================================================

var approvedValidation2015 =
  stack2015.sampleRegions({

    collection:
      approvedValidationSource,

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
      16

  });


// ======================================================
// 17. BEFORE EXCLUSION QA
// ======================================================

print(
  '========================================'
);

print(
  'APPROVED VALIDATION BEFORE 30 m EXCLUSION'
);

print(
  '========================================'
);


show(
  'Approved 2015 validation pixels:',
  approvedValidation2015.size()
);


show(
  'Approved 2015 validation by class:',
  approvedValidation2015.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 18. GLOBAL 30 m TRAINING EXCLUSION
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


var cleanApprovedValidation2015 =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      approvedValidation2015,

      finalTraining2015,

      withinTrainingDistance

    )

  );


// ======================================================
// 19. AFTER EXCLUSION QA
// ======================================================

print(
  '========================================'
);

print(
  'CLEAN APPROVED 2015 VALIDATION'
);

print(
  '========================================'
);


show(
  'Before 30 m exclusion:',
  approvedValidation2015.size()
);


show(
  'After 30 m exclusion:',
  cleanApprovedValidation2015.size()
);


show(
  'Removed by 30 m exclusion:',
  approvedValidation2015
    .size()
    .subtract(
      cleanApprovedValidation2015.size()
    )
);


show(
  'Clean validation by class:',
  cleanApprovedValidation2015.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 20. EXPLICIT CLASS COUNTS
// ======================================================

var countBuiltup =
  cleanApprovedValidation2015

    .filter(
      ee.Filter.eq(
        'class_id',
        1
      )
    )

    .size();


var countVegetation =
  cleanApprovedValidation2015

    .filter(
      ee.Filter.eq(
        'class_id',
        2
      )
    )

    .size();


var countWater =
  cleanApprovedValidation2015

    .filter(
      ee.Filter.eq(
        'class_id',
        3
      )
    )

    .size();


var countAgri =
  cleanApprovedValidation2015

    .filter(
      ee.Filter.eq(
        'class_id',
        4
      )
    )

    .size();


var countBarren =
  cleanApprovedValidation2015

    .filter(
      ee.Filter.eq(
        'class_id',
        5
      )
    )

    .size();


var cleanCounts =
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
  'EXACT clean validation counts:',
  cleanCounts
);


// ======================================================
// 21. DEFICIT FUNCTION
// ======================================================

function deficit(count) {

  return ee.Number(
    VALIDATION_TARGET
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


var exactDeficits =
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
  'EXACT remaining validation deficits:',
  exactDeficits
);


// ======================================================
// 23. TOTAL NEW VALIDATION PIXELS REQUIRED
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
  'TOTAL new validation pixels required:',
  totalDeficit
);


// ======================================================
// 24. VERIFY TRAINING OVERLAP = ZERO
// ======================================================

var remainingOverlap =
  ee.FeatureCollection(

    ee.Join.inner().apply(

      cleanApprovedValidation2015,

      finalTraining2015,

      withinTrainingDistance

    )

  );


show(
  'Remaining training-buffer overlap:',
  remainingOverlap.size()
);


// ======================================================
// 25. SPECTRAL SUMMARY FUNCTION
// ======================================================

function spectralSummary(
  classId,
  className
) {

  var subset =
    cleanApprovedValidation2015.filter(

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
// 26. CLEAN VALIDATION SPECTRAL QA
// ======================================================

print(
  '========================================'
);

print(
  'CLEAN APPROVED VALIDATION SPECTRAL QA'
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
// 27. MAP SETUP
// ======================================================

Map.layers().reset();


Map.setOptions(
  'SATELLITE'
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
// 29. CLEAN BUILT-UP VALIDATION
// ======================================================

Map.addLayer(

  cleanApprovedValidation2015.filter(
    ee.Filter.eq(
      'class_id',
      1
    )
  ),

  {

    color:
      'ff0000',

    pointSize:
      5

  },

  'CLEAN BUILT-UP VALIDATION',

  false

);


// ======================================================
// 30. CLEAN VEGETATION VALIDATION
// ======================================================

Map.addLayer(

  cleanApprovedValidation2015.filter(
    ee.Filter.eq(
      'class_id',
      2
    )
  ),

  {

    color:
      '00ff00',

    pointSize:
      5

  },

  'CLEAN VEGETATION VALIDATION',

  false

);


// ======================================================
// 31. CLEAN WATER VALIDATION
// ======================================================

Map.addLayer(

  cleanApprovedValidation2015.filter(
    ee.Filter.eq(
      'class_id',
      3
    )
  ),

  {

    color:
      '00ffff',

    pointSize:
      5

  },

  'CLEAN WATER VALIDATION',

  true

);


// ======================================================
// 32. CLEAN AGRI VALIDATION
// ======================================================

Map.addLayer(

  cleanApprovedValidation2015.filter(
    ee.Filter.eq(
      'class_id',
      4
    )
  ),

  {

    color:
      'ffff00',

    pointSize:
      5

  },

  'CLEAN AGRI VALIDATION',

  false

);


// ======================================================
// 33. CLEAN BARREN VALIDATION
// ======================================================

Map.addLayer(

  cleanApprovedValidation2015.filter(
    ee.Filter.eq(
      'class_id',
      5
    )
  ),

  {

    color:
      'ff00ff',

    pointSize:
      5

  },

  'CLEAN BARREN VALIDATION',

  false

);


// ======================================================
// 34. FINAL TRAINING — OPTIONAL
// ======================================================

Map.addLayer(

  finalTraining2015,

  {

    color:
      'ffffff',

    pointSize:
      2

  },

  'FINAL TRAINING 2015',

  false

);


// ======================================================
// 35. CENTER
// ======================================================

Map.centerObject(
  roi,
  10
);


// ======================================================
// 36. FINAL CHECKPOINT
// ======================================================

print(
  '========================================'
);

print(
  '2015 VALIDATION CONSOLIDATION COMPLETE'
);

print(
  '========================================'
);


print(
  'Training remains LOCKED.'
);


print(
  'Do NOT run MLC yet.'
);


print(
  'Do NOT export final validation yet.'
);


print(
  'Next step = add NEW independent 2015 validation locations ONLY for classes with a remaining deficit.'
);


print(
  'New validation locations must also survive the 30 m training exclusion.'
);


print(
  'Final target = exactly 60/class = 300 total.'
);


print(
  '========================================'
);


// ======================================================
// END SCRIPT 04G
// ======================================================
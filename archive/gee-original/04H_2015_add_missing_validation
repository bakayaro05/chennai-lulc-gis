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
// SCRIPT 04H
//
// ADD MISSING 2015 INDEPENDENT VALIDATION PIXELS
// ======================================================
//
// REQUIRED GEOMETRY IMPORTS:
//
// waterValAdd2015
// agriValAdd2015
// barrenValAdd2015
//
// LOCKED CLEAN VALIDATION:
//
// Built-up          = 60
// Vegetation        = 60
// Water             = 35
// Agricultural/Open = 54
// Barren/Fallow     = 15
//
// REQUIRED ADDITIONS:
//
// Water             = 25
// Agricultural/Open = 6
// Barren/Fallow     = 45
//
// TOTAL NEW = 76
//
// FINAL TARGET:
//
// 60/class
// 300 total
//
// TRAINING REMAINS COMPLETELY LOCKED.
//
// NO MLC YET.
// NO FINAL EXPORT YET.
//
// ======================================================


// ======================================================
// 1. SETTINGS
// ======================================================

var ANALYSIS_CRS =
  'EPSG:32644';


var ANALYSIS_SCALE =
  30;


var WATER_NEEDED =
  25;


var AGRI_NEEDED =
  6;


var BARREN_NEEDED =
  45;


var VALIDATION_SEED =
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

var BUILTUP_APPROVED_IDS = [

  1,
  2,
  3,
  5,
  6,
  7

];


var VEGETATION_APPROVED_IDS = [

  8,
  9

];


var WATER_APPROVED_IDS = [

  18,
  20

];


var AGRI_APPROVED_IDS = [

  22,
  23,
  24,
  25,
  27

];


var BARREN_APPROVED_IDS = [

  28,
  29,
  30,
  31

];


// ======================================================
// 6. SELECT APPROVED VALIDATION CLASS
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
// 7. REBUILD APPROVED SOURCE POOL
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
// 8. LANDSAT 8 PREPROCESSING — LOCKED
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
    clearMask
  );

}


// ======================================================
// 9. LOCKED INDICES
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
// 10. BUILD 2015 STACK
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
// 11. REBUILD APPROVED VALIDATION PIXELS
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
// 12. 30 m TRAINING EXCLUSION
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
// 13. QA EXISTING CLEAN VALIDATION
// ======================================================

print(
  '========================================'
);

print(
  'EXISTING CLEAN 2015 VALIDATION'
);

print(
  '========================================'
);


show(
  'Existing clean validation total:',
  cleanApprovedValidation2015.size()
);


show(
  'Existing clean validation by class:',
  cleanApprovedValidation2015.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 14. CREATE NEW VALIDATION FEATURES
// ======================================================

var newWaterValidationPolygon =
  ee.Feature(

    waterValAdd2015,

    {

      class_id:
        3,

      class_name:
        'Water',

      val_poly_id:
        201,

      source:
        'new_validation_2015'

    }

  );


var newAgriValidationPolygon =
  ee.Feature(

    agriValAdd2015,

    {

      class_id:
        4,

      class_name:
        'Agricultural/Open',

      val_poly_id:
        202,

      source:
        'new_validation_2015'

    }

  );


var newBarrenValidationPolygon =
  ee.Feature(

    barrenValAdd2015,

    {

      class_id:
        5,

      class_name:
        'Barren/Fallow',

      val_poly_id:
        203,

      source:
        'new_validation_2015'

    }

  );


// ======================================================
// 15. SAMPLE RAW NEW WATER CANDIDATES
// ======================================================

var newWaterCandidatesRaw =
  stack2015.sampleRegions({

    collection:
      ee.FeatureCollection([
        newWaterValidationPolygon
      ]),

    properties: [

      'class_id',

      'class_name',

      'val_poly_id',

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
// 16. SAMPLE RAW NEW AGRI CANDIDATES
// ======================================================

var newAgriCandidatesRaw =
  stack2015.sampleRegions({

    collection:
      ee.FeatureCollection([
        newAgriValidationPolygon
      ]),

    properties: [

      'class_id',

      'class_name',

      'val_poly_id',

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
// 17. SAMPLE RAW NEW BARREN CANDIDATES
// ======================================================

var newBarrenCandidatesRaw =
  stack2015.sampleRegions({

    collection:
      ee.FeatureCollection([
        newBarrenValidationPolygon
      ]),

    properties: [

      'class_id',

      'class_name',

      'val_poly_id',

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
// 18. APPLY 30 m TRAINING EXCLUSION TO NEW WATER
// ======================================================

var newWaterCandidates =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      newWaterCandidatesRaw,

      finalTraining2015,

      withinTrainingDistance

    )

  );


// ======================================================
// 19. APPLY 30 m TRAINING EXCLUSION TO NEW AGRI
// ======================================================

var newAgriCandidates =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      newAgriCandidatesRaw,

      finalTraining2015,

      withinTrainingDistance

    )

  );


// ======================================================
// 20. APPLY 30 m TRAINING EXCLUSION TO NEW BARREN
// ======================================================

var newBarrenCandidates =
  ee.FeatureCollection(

    ee.Join.inverted().apply(

      newBarrenCandidatesRaw,

      finalTraining2015,

      withinTrainingDistance

    )

  );


// ======================================================
// 21. NEW CANDIDATE QA
// ======================================================

print(
  '========================================'
);

print(
  'NEW VALIDATION CANDIDATE QA'
);

print(
  '========================================'
);


show(
  'Raw Water candidates:',
  newWaterCandidatesRaw.size()
);


show(
  'Usable Water candidates after 30 m exclusion:',
  newWaterCandidates.size()
);


show(
  'Water required:',
  WATER_NEEDED
);


show(
  'Enough Water?',
  newWaterCandidates.size().gte(
    WATER_NEEDED
  )
);


print(
  '----------------------------------------'
);


show(
  'Raw Agricultural/Open candidates:',
  newAgriCandidatesRaw.size()
);


show(
  'Usable Agricultural/Open candidates after 30 m exclusion:',
  newAgriCandidates.size()
);


show(
  'Agricultural/Open required:',
  AGRI_NEEDED
);


show(
  'Enough Agricultural/Open?',
  newAgriCandidates.size().gte(
    AGRI_NEEDED
  )
);


print(
  '----------------------------------------'
);


show(
  'Raw Barren/Fallow candidates:',
  newBarrenCandidatesRaw.size()
);


show(
  'Usable Barren/Fallow candidates after 30 m exclusion:',
  newBarrenCandidates.size()
);


show(
  'Barren/Fallow required:',
  BARREN_NEEDED
);


show(
  'Enough Barren/Fallow?',
  newBarrenCandidates.size().gte(
    BARREN_NEEDED
  )
);


// ======================================================
// 22. SELECT EXACTLY 25 WATER
// ======================================================

var selectedNewWater =
  newWaterCandidates

    .randomColumn(
      'selection_random',
      VALIDATION_SEED
    )

    .sort(
      'selection_random'
    )

    .limit(
      WATER_NEEDED
    );


// ======================================================
// 23. SELECT EXACTLY 6 AGRI
// ======================================================

var selectedNewAgri =
  newAgriCandidates

    .randomColumn(
      'selection_random',
      VALIDATION_SEED
    )

    .sort(
      'selection_random'
    )

    .limit(
      AGRI_NEEDED
    );


// ======================================================
// 24. SELECT EXACTLY 45 BARREN
// ======================================================

var selectedNewBarren =
  newBarrenCandidates

    .randomColumn(
      'selection_random',
      VALIDATION_SEED
    )

    .sort(
      'selection_random'
    )

    .limit(
      BARREN_NEEDED
    );


// ======================================================
// 25. SELECTED NEW COUNTS
// ======================================================

print(
  '========================================'
);

print(
  'SELECTED NEW VALIDATION PIXELS'
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


show(
  'Selected new Barren/Fallow:',
  selectedNewBarren.size()
);


// ======================================================
// 26. NEW WATER SPECTRAL QA
// ======================================================

show(
  'New Water spectral QA:',
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

  })
);


// ======================================================
// 27. NEW AGRI SPECTRAL QA
// ======================================================

show(
  'New Agricultural/Open spectral QA:',
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

  })
);


// ======================================================
// 28. NEW BARREN SPECTRAL QA
// ======================================================

show(
  'New Barren/Fallow spectral QA:',
  ee.Dictionary({

    n:
      selectedNewBarren.size(),

    mean_NDVI:
      selectedNewBarren.aggregate_mean(
        'NDVI'
      ),

    mean_NDWI:
      selectedNewBarren.aggregate_mean(
        'NDWI'
      ),

    mean_NDBI:
      selectedNewBarren.aggregate_mean(
        'NDBI'
      )

  })
);


// ======================================================
// 29. BUILD FINAL VALIDATION CANDIDATE
// ======================================================

var finalValidation2015Candidate =
  cleanApprovedValidation2015

    .merge(
      selectedNewWater
    )

    .merge(
      selectedNewAgri
    )

    .merge(
      selectedNewBarren
    );


// ======================================================
// 30. FINAL COUNTS
// ======================================================

print(
  '========================================'
);

print(
  'FINAL 2015 VALIDATION CANDIDATE'
);

print(
  '========================================'
);


show(
  'Final validation candidate total:',
  finalValidation2015Candidate.size()
);


show(
  'Final validation candidate by class:',
  finalValidation2015Candidate.aggregate_histogram(
    'class_name'
  )
);


// ======================================================
// 31. EXPLICIT FINAL COUNTS
// ======================================================

var finalCounts =
  ee.Dictionary({

    Built_up:

      finalValidation2015Candidate
        .filter(
          ee.Filter.eq(
            'class_id',
            1
          )
        )
        .size(),


    Vegetation:

      finalValidation2015Candidate
        .filter(
          ee.Filter.eq(
            'class_id',
            2
          )
        )
        .size(),


    Water:

      finalValidation2015Candidate
        .filter(
          ee.Filter.eq(
            'class_id',
            3
          )
        )
        .size(),


    Agricultural_Open:

      finalValidation2015Candidate
        .filter(
          ee.Filter.eq(
            'class_id',
            4
          )
        )
        .size(),


    Barren_Fallow:

      finalValidation2015Candidate
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
// 32. FINAL BALANCE CHECK
// ======================================================

var finalBalanceOK =
  finalValidation2015Candidate.size().eq(
    300
  )

  .and(

    finalValidation2015Candidate
      .filter(
        ee.Filter.eq(
          'class_id',
          1
        )
      )
      .size()
      .eq(60)

  )

  .and(

    finalValidation2015Candidate
      .filter(
        ee.Filter.eq(
          'class_id',
          2
        )
      )
      .size()
      .eq(60)

  )

  .and(

    finalValidation2015Candidate
      .filter(
        ee.Filter.eq(
          'class_id',
          3
        )
      )
      .size()
      .eq(60)

  )

  .and(

    finalValidation2015Candidate
      .filter(
        ee.Filter.eq(
          'class_id',
          4
        )
      )
      .size()
      .eq(60)

  )

  .and(

    finalValidation2015Candidate
      .filter(
        ee.Filter.eq(
          'class_id',
          5
        )
      )
      .size()
      .eq(60)

  );


show(
  'FINAL VALIDATION BALANCE OK?',
  finalBalanceOK
);


// ======================================================
// 33. VERIFY FINAL TRAINING OVERLAP = 0
// ======================================================

var finalOverlap =
  ee.FeatureCollection(

    ee.Join.inner().apply(

      finalValidation2015Candidate,

      finalTraining2015,

      withinTrainingDistance

    )

  );


show(
  'FINAL training-buffer overlap:',
  finalOverlap.size()
);


// ======================================================
// 34. MAP RESET
// ======================================================

Map.layers().reset();


Map.setOptions(
  'SATELLITE'
);


// ======================================================
// 35. 2015 TRUE COLOR
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
// 36. 2015 SWIR-NIR-RED
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
// 37. SELECTED NEW WATER
// ======================================================

Map.addLayer(

  selectedNewWater,

  {

    color:
      '00ffff',

    pointSize:
      8

  },

  'SELECTED 25 NEW WATER VALIDATION',

  true

);


// ======================================================
// 38. SELECTED NEW AGRI
// ======================================================

Map.addLayer(

  selectedNewAgri,

  {

    color:
      'ffff00',

    pointSize:
      8

  },

  'SELECTED 6 NEW AGRI VALIDATION',

  true

);


// ======================================================
// 39. SELECTED NEW BARREN
// ======================================================

Map.addLayer(

  selectedNewBarren,

  {

    color:
      'ff00ff',

    pointSize:
      8

  },

  'SELECTED 45 NEW BARREN VALIDATION',

  true

);


// ======================================================
// 40. DRAWN WATER GEOMETRY
// ======================================================

Map.addLayer(

  ee.FeatureCollection([
    newWaterValidationPolygon
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

  'DRAWN WATER VALIDATION AREA',

  false

);


// ======================================================
// 41. DRAWN AGRI GEOMETRY
// ======================================================

Map.addLayer(

  ee.FeatureCollection([
    newAgriValidationPolygon
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

  'DRAWN AGRI VALIDATION AREA',

  false

);


// ======================================================
// 42. DRAWN BARREN GEOMETRY
// ======================================================

Map.addLayer(

  ee.FeatureCollection([
    newBarrenValidationPolygon
  ])
  .style({

    color:
      'ff00ff',

    fillColor:
      'ff00ff22',

    width:
      2

  }),

  {},

  'DRAWN BARREN VALIDATION AREA',

  false

);


// ======================================================
// 43. FINAL TRAINING OPTIONAL
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
// 44. CENTER
// ======================================================

var newValidationAreas =
  ee.FeatureCollection([

    newWaterValidationPolygon,

    newAgriValidationPolygon,

    newBarrenValidationPolygon

  ]);


Map.centerObject(
  newValidationAreas,
  10
);


// ======================================================
// 45. END
// ======================================================

print(
  '========================================'
);

print(
  'SCRIPT 04H COMPLETE'
);

print(
  '========================================'
);


print(
  'EXPECTED:'
);


print(
  'Built-up          = 60'
);


print(
  'Vegetation        = 60'
);


print(
  'Water             = 60'
);


print(
  'Agricultural/Open = 60'
);


print(
  'Barren/Fallow     = 60'
);


print(
  'TOTAL             = 300'
);


print(
  'FINAL VALIDATION BALANCE OK must be TRUE.'
);


print(
  'FINAL training-buffer overlap must be 0.'
);


print(
  'DO NOT EXPORT YET.'
);


print(
  'First visually verify the selected new Water, Agricultural/Open and Barren/Fallow validation pixels.'
);


print(
  '========================================'
);


// ======================================================
// END SCRIPT 04H
// ======================================================
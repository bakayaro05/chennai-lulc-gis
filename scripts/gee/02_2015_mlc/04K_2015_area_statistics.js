// ======================================================
// CHENNAI MULTI-TEMPORAL LULC PROJECT
// SCRIPT 04K
//
// 2015 AREA STATISTICS
// FROM MATERIALIZED CLASSIFICATION ASSET
// ======================================================


var CRS =
  'EPSG:32644';

var SCALE =
  30;


var ROI_ASSET =
  'projects/assignment-482806/assets/chennai_admin_study_area_clean';


var CLASSIFICATION_ASSET =
  'projects/assignment-482806/assets/chennai_mlc_lulc_2015';


var roi =
  ee.FeatureCollection(
    ROI_ASSET
  )
  .geometry();


var classification =
  ee.Image(
    CLASSIFICATION_ASSET
  )
  .select(
    'classification'
  );


// ======================================================
// AREA BANDS
// ======================================================

var pixelAreaKm2 =
  ee.Image.pixelArea()
    .divide(1e6);


var analysisArea =
  pixelAreaKm2
    .updateMask(
      classification.mask()
    )
    .rename(
      'analysis_area'
    );


var builtupArea =
  pixelAreaKm2
    .updateMask(
      classification.eq(1)
    )
    .rename(
      'builtup'
    );


var vegetationArea =
  pixelAreaKm2
    .updateMask(
      classification.eq(2)
    )
    .rename(
      'vegetation'
    );


var waterArea =
  pixelAreaKm2
    .updateMask(
      classification.eq(3)
    )
    .rename(
      'water'
    );


var agriArea =
  pixelAreaKm2
    .updateMask(
      classification.eq(4)
    )
    .rename(
      'agri'
    );


var barrenArea =
  pixelAreaKm2
    .updateMask(
      classification.eq(5)
    )
    .rename(
      'barren'
    );


var areaImage =
  ee.Image.cat([
    analysisArea,
    builtupArea,
    vegetationArea,
    waterArea,
    agriArea,
    barrenArea
  ]);


// ======================================================
// SINGLE AREA REDUCTION
// ======================================================

var areas =
  areaImage.reduceRegion({

    reducer:
      ee.Reducer.sum(),

    geometry:
      roi,

    scale:
      SCALE,

    crs:
      CRS,

    maxPixels:
      1e13,

    tileScale:
      8
  });


// ======================================================
// VALUES
// ======================================================

var total =
  ee.Number(
    areas.get(
      'analysis_area'
    )
  );


var builtup =
  ee.Number(
    areas.get(
      'builtup'
    )
  );


var vegetation =
  ee.Number(
    areas.get(
      'vegetation'
    )
  );


var water =
  ee.Number(
    areas.get(
      'water'
    )
  );


var agri =
  ee.Number(
    areas.get(
      'agri'
    )
  );


var barren =
  ee.Number(
    areas.get(
      'barren'
    )
  );


var sumClasses =
  builtup
    .add(vegetation)
    .add(water)
    .add(agri)
    .add(barren);


// ======================================================
// PRINT
// ======================================================

print('========================================');
print('2015 AREA STATISTICS');
print('========================================');


print(
  'Raster analysis area km²:',
  total
);


print(
  'Built-up km²:',
  builtup
);

print(
  'Built-up %:',
  builtup
    .divide(total)
    .multiply(100)
);


print(
  'Vegetation km²:',
  vegetation
);

print(
  'Vegetation %:',
  vegetation
    .divide(total)
    .multiply(100)
);


print(
  'Water km²:',
  water
);

print(
  'Water %:',
  water
    .divide(total)
    .multiply(100)
);


print(
  'Agricultural/Open km²:',
  agri
);

print(
  'Agricultural/Open %:',
  agri
    .divide(total)
    .multiply(100)
);


print(
  'Barren/Fallow km²:',
  barren
);

print(
  'Barren/Fallow %:',
  barren
    .divide(total)
    .multiply(100)
);


print(
  'Class-area sum km²:',
  sumClasses
);


print(
  'Raster area minus class-area sum:',
  total.subtract(
    sumClasses
  )
);


// ======================================================
// EXPORT AREA TABLE
// ======================================================

var areaTable =
  ee.FeatureCollection([

    ee.Feature(
      null,
      {
        year: 2015,

        raster_area_km2:
          total,

        builtup_km2:
          builtup,

        builtup_percent:
          builtup.divide(total).multiply(100),

        vegetation_km2:
          vegetation,

        vegetation_percent:
          vegetation.divide(total).multiply(100),

        water_km2:
          water,

        water_percent:
          water.divide(total).multiply(100),

        agricultural_open_km2:
          agri,

        agricultural_open_percent:
          agri.divide(total).multiply(100),

        barren_fallow_km2:
          barren,

        barren_fallow_percent:
          barren.divide(total).multiply(100),

        class_sum_km2:
          sumClasses,

        area_difference_km2:
          total.subtract(sumClasses)
      }
    )

  ]);


Export.table.toDrive({

  collection:
    areaTable,

  description:
    'chennai_lulc_area_2015',

  fileNamePrefix:
    'chennai_lulc_area_2015',

  fileFormat:
    'CSV'
});


print('========================================');
print('2015 AREA STATISTICS COMPLETE');
print('========================================');
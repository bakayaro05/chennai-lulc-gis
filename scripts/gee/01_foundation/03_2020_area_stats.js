// ======================================================
// CHENNAI LULC PROJECT
// STAGE 5K
// 2020 AREA STATISTICS FROM SAVED CLASSIFICATION ASSET
// ======================================================


// ======================================================
// 1. SETTINGS
// ======================================================

var ANALYSIS_CRS =
  'EPSG:32644';

var ANALYSIS_SCALE =
  30;


// ======================================================
// 2. LOAD ROI
// ======================================================

var chennaiStudyArea =
  ee.FeatureCollection(
    'projects/assignment-482806/assets/chennai_admin_study_area_clean'
  );

var chennaiROI =
  chennaiStudyArea.geometry();


// ======================================================
// 3. LOAD SAVED 2020 CLASSIFICATION
// ======================================================

var classified2020 =
  ee.Image(
    'projects/assignment-482806/assets/chennai_mlc_lulc_2020'
  )
  .rename(
    'classification'
  );


// ======================================================
// 4. CLASS NAMES
// ======================================================

var classNames2020 =
  ee.Dictionary({

    '1':
      'Built-up',

    '2':
      'Vegetation',

    '3':
      'Water',

    '4':
      'Agricultural/Open',

    '5':
      'Barren/Fallow'

  });


// ======================================================
// 5. BASIC QA
// ======================================================

print(
  '========================================'
);

print(
  'STAGE 5K - 2020 AREA STATISTICS'
);


print(
  'Classification bands:'
);

print(
  classified2020.bandNames()
);


print(
  'Classification min/max:'
);

print(

  classified2020.reduceRegion({

    reducer:
      ee.Reducer.minMax(),

    geometry:
      chennaiROI,

    scale:
      ANALYSIS_SCALE,

    crs:
      ANALYSIS_CRS,

    maxPixels:
      1e9,

    tileScale:
      4

  })

);


// ======================================================
// 6. TOTAL RASTER ANALYSIS AREA
// ======================================================

var rasterArea2020M2 =
  ee.Number(

    ee.Image.pixelArea()

      .updateMask(
        classified2020.mask()
      )

      .reduceRegion({

        reducer:
          ee.Reducer.sum(),

        geometry:
          chennaiROI,

        scale:
          ANALYSIS_SCALE,

        crs:
          ANALYSIS_CRS,

        maxPixels:
          1e9,

        tileScale:
          4

      })

      .get(
        'area'
      )

  );


var rasterArea2020Km2 =
  rasterArea2020M2.divide(
    1e6
  );


print(
  ee.String(
    '2020 raster analysis area (km²): '
  )
  .cat(
    rasterArea2020Km2.format(
      '%.6f'
    )
  )
);


// ======================================================
// 7. AREA BY CLASS
// ======================================================

var groupedArea2020 =
  ee.Image.pixelArea()

    .rename(
      'area'
    )

    .addBands(
      classified2020.rename(
        'class_id'
      )
    )

    .reduceRegion({

      reducer:
        ee.Reducer.sum()
          .group({

            groupField:
              1,

            groupName:
              'class_id'

          }),

      geometry:
        chennaiROI,

      scale:
        ANALYSIS_SCALE,

      crs:
        ANALYSIS_CRS,

      maxPixels:
        1e9,

      tileScale:
        4

    });


// ======================================================
// 8. BUILD AREA TABLE
// ======================================================

var classAreaStats2020 =
  ee.FeatureCollection(

    ee.List(
      groupedArea2020.get(
        'groups'
      )
    )

    .map(
      function(item) {

        item =
          ee.Dictionary(
            item
          );


        var classId =
          ee.Number(
            item.get(
              'class_id'
            )
          );


        var areaM2 =
          ee.Number(
            item.get(
              'sum'
            )
          );


        var areaKm2 =
          areaM2.divide(
            1e6
          );


        var percentage =
          areaKm2
            .divide(
              rasterArea2020Km2
            )
            .multiply(
              100
            );


        return ee.Feature(
          null,
          {

            year:
              2020,

            class_id:
              classId,

            class_name:
              classNames2020.get(
                classId.format(
                  '%d'
                )
              ),

            area_m2:
              areaM2,

            area_km2:
              areaKm2,

            percentage:
              percentage

          }
        );

      }
    )

  )
  .sort(
    'class_id'
  );


// ======================================================
// 9. PRINT AREA RESULTS
// ======================================================

print(
  '2020 class area statistics:'
);

print(
  classAreaStats2020
);


// ======================================================
// 10. PRINT EACH CLASS CLEARLY
// ======================================================

function printClassArea2020(
  classId,
  className
) {

  var feature =
    ee.Feature(
      classAreaStats2020
        .filter(
          ee.Filter.eq(
            'class_id',
            classId
          )
        )
        .first()
    );


  print(

    ee.String(
      className
    )

    .cat(
      ' | area km² = '
    )

    .cat(
      ee.Number(
        feature.get(
          'area_km2'
        )
      )
      .format(
        '%.6f'
      )
    )

    .cat(
      ' | percentage = '
    )

    .cat(
      ee.Number(
        feature.get(
          'percentage'
        )
      )
      .format(
        '%.4f'
      )
    )

    .cat(
      '%'
    )

  );

}


print(
  '----------------------------------------'
);

printClassArea2020(
  1,
  'Built-up'
);

printClassArea2020(
  2,
  'Vegetation'
);

printClassArea2020(
  3,
  'Water'
);

printClassArea2020(
  4,
  'Agricultural/Open'
);

printClassArea2020(
  5,
  'Barren/Fallow'
);


// ======================================================
// 11. SUM CHECK
// ======================================================

var summedClassArea2020Km2 =
  ee.Number(
    classAreaStats2020.aggregate_sum(
      'area_km2'
    )
  );


var areaDifference2020 =
  rasterArea2020Km2.subtract(
    summedClassArea2020Km2
  );


print(
  ee.String(
    'Sum of class areas (km²): '
  )
  .cat(
    summedClassArea2020Km2.format(
      '%.6f'
    )
  )
);


print(
  ee.String(
    'Raster area minus summed class area (km²): '
  )
  .cat(
    areaDifference2020.format(
      '%.9f'
    )
  )
);


// ======================================================
// 12. DISPLAY CLASSIFICATION
// ======================================================

Map.setOptions(
  'SATELLITE'
);


Map.centerObject(
  chennaiROI,
  10
);


Map.addLayer(

  classified2020,

  {

    min:
      1,

    max:
      5,

    palette: [

      'ff0000',   // Built-up
      '008000',   // Vegetation
      '0000ff',   // Water
      'ffff00',   // Agricultural/Open
      'd2b48c'    // Barren/Fallow

    ]

  },

  '2020 MLC Classification',

  true

);


// ======================================================
// 13. EXPORT AREA STATISTICS CSV
// ======================================================

Export.table.toDrive({

  collection:
    classAreaStats2020,

  description:
    'Chennai_MLC_Area_Statistics_2020',

  folder:
    'Chennai_LULC_Exports',

  fileNamePrefix:
    'Chennai_MLC_Area_Statistics_2020',

  fileFormat:
    'CSV'

});


// ======================================================
// 14. COMPLETE
// ======================================================

print(
  '========================================'
);

print(
  'STAGE 5K COMPLETE'
);

print(
  '2020 class-area statistics calculated from saved raster asset.'
);

print(
  '========================================'
);


// ======================================================
// END STAGE 5K
// ======================================================
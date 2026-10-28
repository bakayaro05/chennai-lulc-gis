
 // ===================================================================
 // CHENNAI LULC — SCIENTIFIC INDEX MAP RECOVERY FOR REPORT
 // 2010, 2015, 2020, 2025 — NDVI / NDWI / NDBI
 // READ ONLY unless an Export switch is enabled.
 // ===================================================================

var ROOT = 'projects/assignment-482806/assets/';

var roiFC = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
);

var roi = roiFC.geometry();

var CRS = 'EPSG:32644';

var TRANSFORM = [
  30, 0, 399060,
  0, -30, 1463250
];

var INDEX_NAMES = ['NDVI', 'NDWI', 'NDBI'];

// =============================================================
// MAP PREVIEW SETTINGS
// =============================================================

var DISPLAY_YEAR = 2025;

var DISPLAY_INDEX = 'NDVI';

// Creates 4 GeoTIFFs with original numerical index values.

var EXPORT_FOUR_NUMERIC_GEOTIFFS = false ;

// Creates 12 colorized RGB GeoTIFFs for report figures.

var EXPORT_TWELVE_COLORED_GEOTIFFS = true;

// =============================================================
// FIXED VISUALIZATION SCALES
// Identical per index across all four years.
// =============================================================

var LEGENDS = {

  NDVI: {
    min: -1,
    max: 1,
    palette: [
      '8b4513', 'f5deb3', 'ffff00',
      '90ee90', '006400'
    ]
  },

  NDWI: {
    min: -1,
    max: 1,
    palette: [
      '8b4513', 'f5deb3', 'ffffff',
      '87cefa', '00008b'
    ]
  },

  NDBI: {
    min: -1,
    max: 1,
    palette: [
      '006400', '90ee90', 'ffffff',
      'ffb6c1', '8b0000'
    ]
  }

};

// =============================================================
// ORIGINAL LANDSAT 8/9 PREPROCESSING
// Landsat Collection 2 Level 2 Surface Reflectance
// =============================================================

function preprocessL89(image) {

  var qa = image.select('QA_PIXEL');

  var mask = qa.bitwiseAnd(1 << 0).eq(0)

    .and(qa.bitwiseAnd(1 << 1).eq(0))

    .and(qa.bitwiseAnd(1 << 2).eq(0))

    .and(qa.bitwiseAnd(1 << 3).eq(0))

    .and(qa.bitwiseAnd(1 << 4).eq(0))

    .and(qa.bitwiseAnd(1 << 5).eq(0))

    .and(image.select('QA_RADSAT').eq(0));

  return image.select(

    [
      'SR_B2', 'SR_B3', 'SR_B4',
      'SR_B5', 'SR_B6', 'SR_B7'
    ],

    [
      'blue', 'green', 'red',
      'nir', 'swir1', 'swir2'
    ]

  )
  .multiply(0.0000275)
  .add(-0.2)
  .updateMask(mask);

}

// =============================================================
// ORIGINAL INDEX FORMULAS
// Applied AFTER full-year median compositing.
// =============================================================

function addIndices(image) {

  var nir = image.select('nir');

  var red = image.select('red');

  var green = image.select('green');

  var swir1 = image.select('swir1');

  var ndvi = nir
    .subtract(red)
    .divide(nir.add(red))
    .rename('NDVI');

  var ndwi = green
    .subtract(nir)
    .divide(green.add(nir))
    .rename('NDWI');

  var ndbi = swir1
    .subtract(nir)
    .divide(swir1.add(nir))
    .rename('NDBI');

  return image.addBands([
    ndvi, ndwi, ndbi
  ]);

}

// =============================================================
// LANDSAT 8 COLLECTION BUILDER
// =============================================================

function getLandsat8(year) {

  return ee.ImageCollection(
    'LANDSAT/LC08/C02/T1_L2'
  )
  .filterBounds(roi)
  .filterDate(
    year + '-01-01',
    (year + 1) + '-01-01'
  )
  .map(preprocessL89);

}

// =============================================================
// 2010 — USE SAVED FINAL LANDSAT 5+7 PREDICTOR STACK
// Do not substitute earlier L5-only composite.
// =============================================================

var index2010 = ee.Image(

  ROOT +
  'chennai_predictor_stack_2010_L5L7_exp_v1'

)
.select(INDEX_NAMES)
.clip(roi);

// =============================================================
// 2015 — LANDSAT 8
// =============================================================

var c2015 = getLandsat8(2015);

var index2015 = addIndices(

  c2015.median().clip(roi)

)
.select(INDEX_NAMES)
.clip(roi);

// =============================================================
// 2020 — LANDSAT 8
// =============================================================

var c2020 = getLandsat8(2020);

var index2020 = addIndices(

  c2020.median().clip(roi)

)
.select(INDEX_NAMES)
.clip(roi);

// =============================================================
// 2025 — LANDSAT 8 + LANDSAT 9
// =============================================================

var c2025L8 = getLandsat8(2025);

var c2025L9 = ee.ImageCollection(

  'LANDSAT/LC09/C02/T1_L2'

)
.filterBounds(roi)
.filterDate(
  '2025-01-01',
  '2026-01-01'
)
.map(preprocessL89);

var index2025 = addIndices(

  c2025L8
    .merge(c2025L9)
    .median()
    .clip(roi)

)
.select(INDEX_NAMES)
.clip(roi);

// =============================================================
// COMMON INDEX STACKS
// =============================================================

var stacks = {

  2010: index2010,

  2015: index2015,

  2020: index2020,

  2025: index2025

};

var YEARS = [2010, 2015, 2020, 2025];

// =============================================================
// CONSOLE VERIFICATION
// =============================================================

print('==========================================');

print('CHENNAI SPECTRAL INDEX MAP RECOVERY');

print('==========================================');

print('ROI asset:');

print(ROOT + 'chennai_admin_study_area_clean');

print('CRS: EPSG:32644');

print('Resolution: 30 m');

print('Grid transform:');

print(TRANSFORM);

print('2010 saved Landsat 5+7 predictor bands:');

print(
  ee.Image(
    ROOT +
    'chennai_predictor_stack_2010_L5L7_exp_v1'
  ).bandNames()
);

print('2015 Landsat 8 scenes:');

print(c2015.size());

print('2020 Landsat 8 scenes:');

print(c2020.size());

print('2025 Landsat 8 scenes:');

print(c2025L8.size());

print('2025 Landsat 9 scenes:');

print(c2025L9.size());

print('Selected year index bands:');

print(stacks[DISPLAY_YEAR].bandNames());

print('Numeric export enabled:');

print(EXPORT_FOUR_NUMERIC_GEOTIFFS);

print('Colored export enabled:');

print(EXPORT_TWELVE_COLORED_GEOTIFFS);

// =============================================================
// DISPLAY ONE INDEX MAP AT A TIME
// =============================================================

Map.layers().reset();

Map.setOptions('SATELLITE');

Map.centerObject(roi, 10);

Map.addLayer(

  stacks[DISPLAY_YEAR].select(DISPLAY_INDEX),

  LEGENDS[DISPLAY_INDEX],

  DISPLAY_YEAR + ' ' + DISPLAY_INDEX,

  true,

  0.95

);

Map.addLayer(

  roiFC.style({

    color: 'ffffff',

    fillColor: '00000000',

    width: 2

  }),

  {},

  'Chennai Urban Study Area Boundary',

  true

);

// =============================================================
// MAP LEGEND
// =============================================================

var legend = ui.Panel({

  style: {
    position: 'bottom-left',
    padding: '8px 12px',
    width: '245px'
  }

});

legend.add(

  ui.Label({

    value:
      'Chennai ' +
      DISPLAY_YEAR +
      ' — ' +
      DISPLAY_INDEX,

    style: {
      fontWeight: 'bold',
      fontSize: '14px'
    }

  })

);

legend.add(

  ui.Label(
    'Landsat full-year median composite'
  )

);

var ticks = [-1, -0.5, 0, 0.5, 1];

var colors = LEGENDS[DISPLAY_INDEX].palette;

for (var j = 0; j < ticks.length; j++) {

  var line = ui.Panel({

    layout: ui.Panel.Layout.flow('horizontal')

  });

  line.add(

    ui.Label({

      value: '   ',

      style: {
        backgroundColor: '#' + colors[j],
        margin: '2px 8px 2px 0'
      }

    })

  );

  line.add(ui.Label(String(ticks[j])));

  legend.add(line);

}

legend.add(

  ui.Label(
    'EPSG:32644 | 30 m pixel resolution'
  )

);

legend.add(

  ui.Label(
    'Source: USGS Landsat C2 L2 / Google Earth Engine'
  )

);

Map.add(legend);

// =============================================================
// EXPORT OPTION 1
// FOUR NUMERICAL GEOTIFFS
//
// Each output includes three float32 bands:
// NDVI, NDWI, NDBI
//
// Suitable for QGIS, ArcGIS, Python and report maps.
// =============================================================

if (EXPORT_FOUR_NUMERIC_GEOTIFFS) {

  YEARS.forEach(function(year) {

    Export.image.toDrive({

      image:
        stacks[year].toFloat(),

      description:
        'Chennai_Spectral_Indices_' +
        year +
        '_NUMERIC',

      folder:
        'Chennai_LULC_Report_Index_Maps',

      fileNamePrefix:
        'Chennai_Indices_' +
        year +
        '_NDVI_NDWI_NDBI',

      region: roi,

      crs: CRS,

      crsTransform: TRANSFORM,

      maxPixels: 1000000000,

      fileFormat: 'GeoTIFF',

      formatOptions: {
        cloudOptimized: true
      }

    });

  });

}

// =============================================================
// EXPORT OPTION 2
// TWELVE COLORIZED GEOTIFFS
//
// Four years x three indices.
//
// These are RGB visualizations, not raw index values.
// =============================================================

if (EXPORT_TWELVE_COLORED_GEOTIFFS) {

  YEARS.forEach(function(year) {

    INDEX_NAMES.forEach(function(idx) {

      var rgb = stacks[year]
        .select(idx)
        .visualize(LEGENDS[idx]);

      Export.image.toDrive({

        image: rgb,

        description:
          'Chennai_' +
          year +
          '_' +
          idx +
          '_COLORED',

        folder:
          'Chennai_LULC_Report_Index_Maps',

        fileNamePrefix:
          'Chennai_' +
          year +
          '_' +
          idx +
          '_COLOR',

        region: roi,

        crs: CRS,

        crsTransform: TRANSFORM,

        maxPixels: 1000000000,

        fileFormat: 'GeoTIFF',

        formatOptions: {
          cloudOptimized: true
        }

      });

    });

  });

}

// =============================================================
// FINAL
// =============================================================

print('==========================================');

print('INDEX MAP SCRIPT READY');

print('==========================================');

print('Four years: 2010, 2015, 2020, 2025');

print('Three indices: NDVI, NDWI, NDBI');

print('Numeric values are not clipped for export.');

print('Display colors use fixed -1 to +1 scales.');

print('No final LULC assets are modified.');

print('Enable exports only after checking map previews.');

print('==========================================');

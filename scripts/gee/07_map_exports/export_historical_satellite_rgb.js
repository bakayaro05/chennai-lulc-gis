// ============================================================
// CHENNAI LULC GIS — STAGE 08
// OPTION 2A: HISTORICAL SATELLITE RGB EXPORT
//
// Annual true-colour Landsat composites:
// 2010, 2015, 2020, 2025.
//
// Display-only satellite imagery.
// No reclassification, model training or prediction.
//
// Output: four RGB + Alpha GeoTIFFs, 30 m, EPSG:32644.
// ============================================================

// 1. PROJECT CONFIGURATION

var ROOT = 'projects/assignment-482806/assets/';

var roi = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
);

var studyArea = roi.geometry();

var OUTPUT_FOLDER =
  'Chennai_LULC_Historical_RGB_Stage08';

var CRS = 'EPSG:32644';

var TRANSFORM = [
  30, 0, 399060,
  0, -30, 1463250
];

// Match the previously validated classification GeoTIFFs.
var WIDTH = 951;
var HEIGHT = 1412;

// This export rectangle exactly covers the locked raster grid.
// The actual satellite data remain clipped to the study area.
var outputRegion = ee.Geometry.Rectangle(
  [
    399060,
    1463250 - HEIGHT * 30,
    399060 + WIDTH * 30,
    1463250
  ],
  CRS,
  false
);

// 2. FIXED RGB VISUALIZATION
//
// These settings produce display-ready byte images.
// The same stretch is used across all years.
// Differences in colours should not be interpreted directly
// as quantitative surface-reflectance changes.

var RGB_STYLE = {
  bands: ['red', 'green', 'blue'],
  min: 0.02,
  max: 0.30,
  gamma: 1.15
};

// 3. CLOUD / SHADOW / SATURATION MASK
//
// Collection 2 QA_PIXEL bits:
// 0 = Fill
// 1 = Dilated cloud
// 2 = Cirrus (where applicable)
// 3 = Cloud
// 4 = Cloud shadow
// 5 = Snow

function clearMask(image) {

  var qa = image.select('QA_PIXEL');

  var cloudsAndSnow = qa
    .bitwiseAnd(63)
    .eq(0);

  var unsaturated = image
    .select('QA_RADSAT')
    .eq(0);

  return image
    .updateMask(cloudsAndSnow)
    .updateMask(unsaturated);
}

// 4. LANDSAT 5 / 7 TRUE-COLOUR BANDS
//
// Landsat 5 TM / Landsat 7 ETM+:
// Red   = SR_B3
// Green = SR_B2
// Blue  = SR_B1

function prepareL57(image) {

  return clearMask(image)
    .select(
      ['SR_B3', 'SR_B2', 'SR_B1'],
      ['red', 'green', 'blue']
    )
    .multiply(0.0000275)
    .add(-0.2)
    .copyProperties(
      image,
      ['system:time_start']
    );
}

// 5. LANDSAT 8 / 9 TRUE-COLOUR BANDS
//
// Landsat 8 OLI / Landsat 9 OLI-2:
// Red   = SR_B4
// Green = SR_B3
// Blue  = SR_B2

function prepareL89(image) {

  return clearMask(image)
    .select(
      ['SR_B4', 'SR_B3', 'SR_B2'],
      ['red', 'green', 'blue']
    )
    .multiply(0.0000275)
    .add(-0.2)
    .copyProperties(
      image,
      ['system:time_start']
    );
}

// 6. LOAD AND PREPARE COLLECTION

function getCollection(
  asset,
  start,
  end,
  preparation
) {

  return ee.ImageCollection(asset)
    .filterBounds(studyArea)
    .filterDate(start, end)
    .filter(
      ee.Filter.lt('CLOUD_COVER', 85)
    )
    .map(preparation);
}

// 7. PREPARE AND EXPORT EACH YEAR

function prepareYear(year) {

  var start = year + '-01-01';
  var end = (year + 1) + '-01-01';

  var scenes;
  var sensors;

  // ----------------------
  // YEAR 2010
  // ----------------------

  if (year === 2010) {

    var l5 = getCollection(
      'LANDSAT/LT05/C02/T1_L2',
      start,
      end,
      prepareL57
    );

    var l7 = getCollection(
      'LANDSAT/LE07/C02/T1_L2',
      start,
      end,
      prepareL57
    );

    scenes = l5.merge(l7);

    sensors =
      'Landsat 5 TM + Landsat 7 ETM+';

    print(
      ee.Dictionary({
        year: year,
        landsat5Count: l5.size(),
        landsat7Count: l7.size()
      })
    );
  }

  // ----------------------
  // YEARS 2015 AND 2020
  // ----------------------

  else if (
    year === 2015 ||
    year === 2020
  ) {

    scenes = getCollection(
      'LANDSAT/LC08/C02/T1_L2',
      start,
      end,
      prepareL89
    );

    sensors = 'Landsat 8 OLI';
  }

  // ----------------------
  // YEAR 2025
  // ----------------------

  else if (year === 2025) {

    var l8 = getCollection(
      'LANDSAT/LC08/C02/T1_L2',
      start,
      end,
      prepareL89
    );

    var l9 = getCollection(
      'LANDSAT/LC09/C02/T1_L2',
      start,
      end,
      prepareL89
    );

    scenes = l8.merge(l9);

    sensors =
      'Landsat 8 OLI + Landsat 9 OLI-2';

    print(
      ee.Dictionary({
        year: year,
        landsat8Count: l8.size(),
        landsat9Count: l9.size()
      })
    );
  }

  else {

    throw new Error(
      'Unsupported RGB year: ' + year
    );
  }

  // Fail before creating an export with an empty collection.
  var imageCount = scenes.size().getInfo();

  if (imageCount < 1) {

    throw new Error(
      'No usable Landsat scenes for ' +
      year +
      '. Check collection availability.'
    );
  }

  // 8. ANNUAL MEDIAN COMPOSITE

  var median = scenes
    .median()
    .clip(studyArea);

  // 9. RGB VISUALIZATION + EXPLICIT ALPHA
  //
  // Alpha 255 = valid satellite observation.
  // Alpha 0   = missing / outside image coverage.
  //
  // We cannot simply treat black RGB values as NoData,
  // because real dark water can also have low RGB values.

  var redMask = median
    .select('red')
    .mask();

  var rgb8 = median
    .visualize(RGB_STYLE)
    .rename([
      'red',
      'green',
      'blue'
    ]);

  var alpha8 = redMask
    .multiply(255)
    .toByte()
    .rename('alpha');

  var rgba8 = rgb8
    .addBands(alpha8)
    .unmask({
      value: 0,
      sameFootprint: false
    })
    .toByte();

  // 10. DIAGNOSTIC METADATA

  print(
    ee.Dictionary({
      year: year,
      startInclusive: start,
      endExclusive: end,
      sensorSource: sensors,
      candidateSceneCount: imageCount,
      exportBands: rgba8.bandNames(),
      projection: CRS,
      lockedTransform: TRANSFORM
    })
  );

  // 11. EARTH ENGINE MAP PREVIEW

  Map.addLayer(
    median,
    RGB_STYLE,
    'Annual RGB ' + year,
    year === 2025
  );

  // 12. CLOUD OPTIMIZED GEOTIFF EXPORT

  Export.image.toDrive({
    image: rgba8,

    description:
      'Chennai_RGB_' + year,

    folder: OUTPUT_FOLDER,

    fileNamePrefix:
      'Chennai_RGB_' + year,

    region: outputRegion,

    crs: CRS,

    crsTransform: TRANSFORM,

    maxPixels: 1e9,

    fileFormat: 'GeoTIFF',

    formatOptions: {
      cloudOptimized: true
    }
  });
}

// 13. MAP SETUP

Map.centerObject(roi, 10);

Map.addLayer(
  roi.style({
    color: 'FFFF00',
    fillColor: '00000000',
    width: 2
  }),
  {},
  'Chennai study boundary',
  true
);

// 14. PREPARE ALL FOUR EXPORT TASKS

[2010, 2015, 2020, 2025].forEach(
  prepareYear
);

print(
  'Prepared four historical RGB exports. Start all four in the Tasks tab.'
);
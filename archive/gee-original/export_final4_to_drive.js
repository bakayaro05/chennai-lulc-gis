// Chennai LULC GIS — Stage 08 / Milestone 0
// Export only the four completed, final four-class reporting images.
// Run in https://code.earthengine.google.com/ with access to the assets.
// These are NOT the original five-class classifier outputs.

var ASSET_ROOT = 'projects/assignment-482806/assets/';
var ROI_ASSET = ASSET_ROOT + 'chennai_admin_study_area_clean';
var DRIVE_FOLDER = 'Chennai_LULC_Final4_Stage08';
var OUTPUT_CRS = 'EPSG:32644';
var LOCKED_TRANSFORM = [30, 0, 399060, 0, -30, 1463250];
var NODATA = -9999;

var roi = ee.FeatureCollection(ROI_ASSET);
var region = roi.geometry();

var exports = [
  {
    year: 2010,
    asset: 'chennai_lulc4_2010_L5L7_provisional_v1',
    filename: 'Chennai_LULC4_2010_provisional'
  },
  {
    year: 2015,
    asset: 'chennai_lulc4_2015_v1',
    filename: 'Chennai_LULC4_2015'
  },
  {
    year: 2020,
    asset: 'chennai_lulc4_2020_v1',
    filename: 'Chennai_LULC4_2020'
  },
  {
    year: 2025,
    asset: 'chennai_lulc4_2025_v1',
    filename: 'Chennai_LULC4_2025'
  }
];

Map.centerObject(roi, 10);
Map.addLayer(
  roi.style({
    color: 'FFFF00',
    fillColor: '00000000',
    width: 2
  }),
  {},
  'Chennai study boundary'
);

// A one-time, synchronous metadata guard prevents accidentally exporting
// a multi-band asset with the wrong first band. No classifier is rerun.
exports.forEach(function(spec) {
  var assetId = ASSET_ROOT + spec.asset;
  var image = ee.Image(assetId);
  var bands = image.bandNames().getInfo();

  if (!bands || bands.length !== 1) {
    throw new Error(
      'Expected exactly one class band in ' + assetId +
      '; found: ' + JSON.stringify(bands)
    );
  }

  // Preserve existing class values and masks. Cast to signed 16-bit to
  // accommodate the explicit -9999 NoData sentinel in the output file.
  var classes = image.select([0], ['lulc']).toInt16();
  var exportable = classes.unmask({
    value: NODATA,
    sameFootprint: false
  });

  // No 'scale' or 'dimensions': the exact common grid is set by crsTransform.
  // GEE's default nearest-neighbor sampling is retained for categorical IDs.
  Export.image.toDrive({
    image: exportable,
    description: spec.filename,
    folder: DRIVE_FOLDER,
    fileNamePrefix: spec.filename,
    region: region,
    crs: OUTPUT_CRS,
    crsTransform: LOCKED_TRANSFORM,
    maxPixels: 1e9,
    fileFormat: 'GeoTIFF',
    formatOptions: {
      cloudOptimized: true,
      noData: NODATA
    }
  });

  // Exactly one argument for each print() call.
  print(ee.Dictionary({
    year: spec.year,
    sourceAsset: assetId,
    sourceBand: bands[0],
    sourceCRS: image.projection().crs(),
    targetCRS: OUTPUT_CRS,
    targetGrid: LOCKED_TRANSFORM,
    nodata: NODATA,
    outputFile: spec.filename + '.tif'
  }));
});

// Boundary is a separate vector input for the React/Leaflet frontend.
Export.table.toDrive({
  collection: roi,
  description: 'Chennai_Study_Area_Boundary',
  folder: DRIVE_FOLDER,
  fileNamePrefix: 'chennai_study_area',
  fileFormat: 'GeoJSON'
});

print(ee.Dictionary({
  stage: '08 / Milestone 0',
  expectedRasterTasks: exports.length,
  expectedBoundaryTasks: 1,
  note: 'Open Tasks tab and start the five exports manually.'
}));
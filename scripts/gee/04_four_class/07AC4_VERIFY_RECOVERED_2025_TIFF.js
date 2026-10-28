
 // ======================================================================
 // STAGE 07AC4 — VERIFY RECOVERED ORIGINAL 2025 TIFF
 // FOUR-CLASS POST-CLASSIFICATION AGGREGATION
 //
 // QA FIRST — NO EXPORTS BY DEFAULT
 // ======================================================================

var ROOT = 'projects/assignment-482806/assets/';

var TIFF_ASSET =
  ROOT + 'chennai_mlc_lulc_2025_from_original_tif';

var OUTPUT_ASSET =
  ROOT + 'chennai_lulc4_2025_v1';

var EXPORT_FOUR_CLASS_ASSET = false;

var CRS = 'EPSG:32644';

var GRID_TRANSFORM = [
  30, 0, 399060,
  0, -30, 1463250
];

var ROI = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
).geometry();

// ============================================================
// 1. LOAD ORIGINAL 2025 TIFF
// ============================================================

var ORIGINAL = ee.Image(TIFF_ASSET)
  .select([0], ['classification']);

// Zero is the TIFF background, not a real LULC class.

var five = ORIGINAL
  .updateMask(
    ORIGINAL.gte(1).and(ORIGINAL.lte(5))
  )
  .clip(ROI)
  .toByte();

// ============================================================
// 2. AGGREGATE FIVE CLASSES INTO FOUR
// ============================================================

var four = five
  .remap(
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 4]
  )
  .rename('classification')
  .toByte()
  .clip(ROI);

// ============================================================
// 3. CLASS AREA CALCULATION — LOCKED COMMON GRID
// ============================================================

function classAreas(image) {

  var result = ee.Image.pixelArea()
    .divide(1e6)
    .rename('area_km2')
    .addBands(image.rename('class_code'))
    .reduceRegion({

      reducer: ee.Reducer.sum().group({
        groupField: 1,
        groupName: 'class_code'
      }),

      geometry: ROI,

      crs: CRS,

      crsTransform: GRID_TRANSFORM,

      maxPixels: 1e9,

      tileScale: 8

    });

  var rows = ee.List(result.get('groups'));

  return ee.Dictionary(
    rows.iterate(function(row, accum) {

      row = ee.Dictionary(row);

      var key = ee.Number(
        row.get('class_code')
      ).format('%d');

      return ee.Dictionary(accum).set(
        key,
        row.get('sum')
      );

    }, ee.Dictionary({}))
  );

}

var a5 = classAreas(five);

var a4 = classAreas(four);

// ============================================================
// 4. ORIGINAL ARCHIVED 2025 CLASS AREAS
// ============================================================

var reference = {
  1: 256.372809,
  2: 44.269634,
  3: 20.389113,
  4: 87.307165,
  5: 121.432382
};

// ============================================================
// 5. CALCULATE TOTALS
// ============================================================

var total5 = ee.Number(0);

[1, 2, 3, 4, 5].forEach(function(id) {

  total5 = total5.add(
    ee.Number(a5.get(String(id)))
  );

});

var total4 = ee.Number(0);

[1, 2, 3, 4].forEach(function(id) {

  total4 = total4.add(
    ee.Number(a4.get(String(id)))
  );

});

// ============================================================
// 6. PRINT QA RESULTS
// ============================================================

print('================================================');
print('STAGE 07AC4 — RECOVERED 2025 GEOTIFF QA');
print('================================================');

print('Imported source: ' + TIFF_ASSET);

print('Original uploaded band names:');
print(ee.Image(TIFF_ASSET).bandNames());

print('Original image projection:');
print(ORIGINAL.projection());

print('================================================');
print('FIVE-CLASS AREA COMPARISON');
print('================================================');

print('Imported 2025 five-class areas (km2):');
print(a5);

print('Archived expected five-class areas (km2):');
print(reference);

[1, 2, 3, 4, 5].forEach(function(id) {

  print(
    'Class ' + id +
    ' imported minus archived area (km2):'
  );

  print(
    ee.Number(a5.get(String(id)))
      .subtract(reference[id])
  );

});

print('================================================');
print('FOUR-CLASS AGGREGATION');
print('================================================');

print('2025 aggregated four-class areas (km2):');
print(a4);

print('2025 imported five-class total area (km2):');
print(total5);

print('2025 imported four-class total area (km2):');
print(total4);

print('Archived total area (km2): 529.771103');

print('Imported minus archived total area (km2):');
print(total5.subtract(529.771103));

// ============================================================
// 7. VERIFY AGGREGATION MATHEMATICALLY
// ============================================================

print('================================================');
print('FOUR-CLASS CONSISTENCY CHECK');
print('================================================');

print(ee.Dictionary({

  builtup_difference:
    ee.Number(a4.get('1'))
      .subtract(ee.Number(a5.get('1'))),

  vegetation_difference:
    ee.Number(a4.get('2'))
      .subtract(ee.Number(a5.get('2'))),

  water_difference:
    ee.Number(a4.get('3'))
      .subtract(ee.Number(a5.get('3'))),

  merged_open_difference:
    ee.Number(a4.get('4'))
      .subtract(
        ee.Number(a5.get('4'))
          .add(ee.Number(a5.get('5')))
      ),

  total_area_difference:
    total4.subtract(total5)

}));

print('Expected consistency differences: near zero.');

print('Background value 0 is masked, not classified.');

// ============================================================
// 8. MAP DISPLAY
// ============================================================

Map.layers().reset();

Map.setOptions('SATELLITE');

Map.centerObject(ROI, 10);

Map.addLayer(
  four,
  {
    min: 1,
    max: 4,
    palette: [
      'e53935',
      '2e7d32',
      '1976d2',
      'd8b365'
    ]
  },
  '2025 FOUR CLASSES — RECOVERED TIFF',
  true,
  0.8
);

Map.addLayer(
  five,
  {
    min: 1,
    max: 5,
    palette: [
      'e53935',
      '2e7d32',
      '1976d2',
      'fdae61',
      'a6611a'
    ]
  },
  '2025 ORIGINAL FIVE CLASSES',
  false,
  0.8
);

// ============================================================
// 9. OPTIONAL FINAL FOUR-CLASS ASSET EXPORT
//
// LEAVE FALSE UNTIL QA RESULTS ARE REVIEWED.
// ============================================================

if (EXPORT_FOUR_CLASS_ASSET) {

  Export.image.toAsset({

    image: four,

    description:
      'Chennai_LULC4_2025_from_original_GeoTIFF',

    assetId: OUTPUT_ASSET,

    region: ROI,

    crs: CRS,

    crsTransform: GRID_TRANSFORM,

    maxPixels: 1e9,

    pyramidingPolicy: {
      '.default': 'mode'
    }

  });

}

print('Four-class export enabled: ' +
  EXPORT_FOUR_CLASS_ASSET);

print('================================================');
print('END STAGE 07AC4 — REVIEW BEFORE EXPORT');
print('================================================');

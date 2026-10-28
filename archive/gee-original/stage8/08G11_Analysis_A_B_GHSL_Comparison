
// ===============================================================
// CHENNAI LULC | STAGE 08G-11
// ANALYSIS A: EXPORTED FUSION LULC MAPS (30 m)
// ANALYSIS B: GHSL P2023A BUILT-UP SURFACE (native 100 m)
// Diagnostic and reporting only. NO exports or asset changes.
// ===============================================================

var ROOT = 'projects/assignment-482806/assets/';
var study = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
);
var roi = study.geometry();

var CRS = 'EPSG:32644';
var GRID = [30, 0, 399060, 0, -30, 1463250];

var PALETTE = [
  'ff0000', '008000', '0000ff',
  'ffff00', 'd2b48c'
];

var CLASS_NAMES = [
  'Built-up',
  'Vegetation',
  'Water',
  'Agricultural/Open',
  'Barren/Fallow'
];

// ===============================================================
// PART A: EXPORTED CLASSIFICATION ASSETS
// ===============================================================

// 2010 remains provisional.
// These are the three already-exported fusion candidates.

var a2010 = ee.Image(
  ROOT + 'chennai_mlc_lulc_2010'
).select(0).rename('LULC_2010');

var a2015 = ee.Image(
  ROOT + 'chennai_08g10_2015_temporal_fusion_candidate_v1'
).select(0).rename('LULC_2015');

var a2020 = ee.Image(
  ROOT + 'chennai_08g10_2020_gaia_wc_fusion_candidate_v1'
).select(0).rename('LULC_2020');

var a2025 = ee.Image(
  ROOT + 'chennai_08g10_2025_gaia_dw_fusion_candidate_v1'
).select(0).rename('LULC_2025');

var A = [
  {year: 2010, image: a2010},
  {year: 2015, image: a2015},
  {year: 2020, image: a2020},
  {year: 2025, image: a2025}
];

// ===============================================================
// A1. CALCULATE FIVE-CLASS LULC AREAS
// ===============================================================

function areaBand(img, classId, name) {
  return ee.Image.pixelArea().divide(1e6)
    .updateMask(img.eq(classId))
    .rename(name);
}

var areaBands = [];

A.forEach(function(item) {

  for (var c = 1; c <= 5; c++) {

    areaBands.push(
      areaBand(
        item.image,
        c,
        'A_' + item.year + '_C' + c
      )
    );

  }

  areaBands.push(
    ee.Image.pixelArea().divide(1e6)
      .updateMask(item.image.mask())
      .rename('A_' + item.year + '_VALID')
  );

});

var areaA = ee.Image.cat(areaBands).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: roi,
  crs: CRS,
  crsTransform: GRID,
  maxPixels: 1e8,
  tileScale: 8
});

var rowsA = ee.FeatureCollection(
  A.map(function(item) {

    return ee.Feature(null, {

      year: item.year,

      builtup_km2:
        areaA.get('A_' + item.year + '_C1'),

      vegetation_km2:
        areaA.get('A_' + item.year + '_C2'),

      water_km2:
        areaA.get('A_' + item.year + '_C3'),

      agricultural_open_km2:
        areaA.get('A_' + item.year + '_C4'),

      barren_fallow_km2:
        areaA.get('A_' + item.year + '_C5'),

      valid_map_area_km2:
        areaA.get('A_' + item.year + '_VALID')

    });

  })
);

function aBU(year) {
  return ee.Number(
    areaA.get('A_' + year + '_C1')
  );
}

// ===============================================================
// A2. FIVE-CLASS TRANSITION MATRICES
// ===============================================================

// Transition code = 10 * FROM + TO.
//
// Examples:
// 11 = Built-up -> Built-up
// 14 = Built-up -> Agricultural/Open
// 41 = Agricultural/Open -> Built-up
// 51 = Barren/Fallow -> Built-up
//
// Values are area in km2.

function transitionArea(from, to) {

  var common = from.mask().and(to.mask());

  var encoded = from.multiply(10)
    .add(to)
    .rename('transition')
    .toInt16();

  var paired = ee.Image.pixelArea()
    .divide(1e6)
    .rename('area_km2')
    .addBands(encoded)
    .updateMask(common);

  return paired.reduceRegion({

    reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'transition_code'
    }),

    geometry: roi,
    crs: CRS,
    crsTransform: GRID,
    maxPixels: 1e8,
    tileScale: 8

  });

}

// ===============================================================
// A3. ANALYSIS A RESULTS
// ===============================================================

print('==============================================');
print('ANALYSIS A | EXPORTED FUSION LULC (30 m)');
print('==============================================');

print('Study projection:');
print(a2015.projection());

print('Classification classes:');
print(CLASS_NAMES);

print('A FIVE-CLASS AREA TABLE (km2):');
print(rowsA.sort('year'));

print('A BUILT-UP AREA VALUES (km2):');

print(ee.Dictionary({
  y2010: aBU(2010),
  y2015: aBU(2015),
  y2020: aBU(2020),
  y2025: aBU(2025)
}));

print('A BUILT-UP AREA CHANGE (km2):');

print(ee.Dictionary({

  y2010_to_2015:
    aBU(2015).subtract(aBU(2010)),

  y2015_to_2020:
    aBU(2020).subtract(aBU(2015)),

  y2020_to_2025:
    aBU(2025).subtract(aBU(2020))

}));

// Check that this 2010 raster is the version associated
// with our archived approximately 279.82 km2 result.

print('2010 VERSION CHECK: measured minus 279.82 km2:');

print(
  aBU(2010).subtract(279.82)
);

print('A 2010 -> 2015 TRANSITIONS (km2):');
print(transitionArea(a2010, a2015));

print('A 2015 -> 2020 TRANSITIONS (km2):');
print(transitionArea(a2015, a2020));

print('A 2020 -> 2025 TRANSITIONS (km2):');
print(transitionArea(a2020, a2025));

// ===============================================================
// PART B: CONSISTENT GHSL PRODUCT FAMILY
// ===============================================================

// P2023A GHS-BUILT-S:
// Built-up surface in square metres per native 100m cell.
//
// The 2025 epoch is MODELLED/PROJECTED in the 2023 release,
// not an actual observed 2025 land-cover map.

var GHSL_ROOT = 'JRC/GHSL/P2023A/GHS_BUILT_S/';

var B_YEARS = [
  2005, 2010, 2015, 2020, 2025
];

var ghsl = {};
var ghslBands = [];

B_YEARS.forEach(function(year) {

  ghsl[year] = ee.Image(
    GHSL_ROOT + year
  )
  .select('built_surface')
  .rename('GHS_' + year);

  ghslBands.push(
    ghsl[year]
  );

});

// ===============================================================
// B1. SUM GHSL BUILT-UP SURFACE
// ===============================================================

// IMPORTANT:
// Values already represent m2 of built-up surface.
//
// DO NOT multiply by pixelArea.
// DO NOT reclassify into 0/1.
// DO NOT resample to the LULC 30m grid.
//
// Use the native GHSL projection across all years.

var ghslProj = ghsl[2005].projection();

var ghslAreasM2 = ee.Image.cat(
  ghslBands
).reduceRegion({

  reducer: ee.Reducer.sum(),

  geometry: roi,

  crs: ghslProj,

  maxPixels: 1e8,

  tileScale: 8

});

function bBU(year) {

  return ee.Number(
    ghslAreasM2.get('GHS_' + year)
  ).divide(1e6);

}

var rowsB = ee.FeatureCollection(
  B_YEARS.map(function(year) {

    return ee.Feature(null, {

      year: year,

      ghsl_built_surface_km2:
        bBU(year),

      epoch_status: year === 2025
        ? 'MODELLED 2025 PROJECTION - NOT OBSERVED'
        : 'HISTORICAL MODELLED ESTIMATE'

    });

  })
);

// ===============================================================
// B2. ANALYSIS B RESULTS
// ===============================================================

print('==============================================');
print('ANALYSIS B | GHSL P2023A NATIVE 100 m');
print('==============================================');

print('GHSL 2005 bands:');
print(ghsl[2005].bandNames());

print('GHSL native projection:');
print(ghslProj);

print('GHSL 2025 projection:');
print(ghsl[2025].projection());

print('B GHSL BUILT-UP SURFACE TABLE (km2):');

print(rowsB.sort('year'));

print('B GHSL BUILT-UP SURFACE VALUES (km2):');

print(ee.Dictionary({

  y2005: bBU(2005),

  y2010: bBU(2010),

  y2015: bBU(2015),

  y2020: bBU(2020),

  y2025_MODELLED: bBU(2025)

}));

print('B GHSL BUILT-UP SURFACE CHANGE (km2):');

print(ee.Dictionary({

  y2005_to_2010:
    bBU(2010).subtract(bBU(2005)),

  y2010_to_2015:
    bBU(2015).subtract(bBU(2010)),

  y2015_to_2020:
    bBU(2020).subtract(bBU(2015)),

  y2020_to_2025_MODELLED:
    bBU(2025).subtract(bBU(2020))

}));

print('IMPORTANT: GHSL 2025 IS MODELLED.');
print('It is not observed 2025 Built-up classification.');

print('GHSL built-up surface is not equivalent to');
print('our broader 30m LULC Built-up class area.');

print('Compare the trends, not raw area equivalence.');

print('No confirmed 2005 five-class raster in Analysis A.');

print('NO ORIGINAL ASSETS MODIFIED.');
print('NO CLASSIFICATION OR EXPORT PERFORMED.');

// ===============================================================
// CHART 1 — ANALYSIS A
// ===============================================================

print(

  ui.Chart.feature.byFeature(
    rowsA.sort('year'),
    'year',
    ['builtup_km2']
  )
  .setChartType('LineChart')
  .setOptions({

    title:
      'Analysis A - Fusion LULC Built-up area',

    hAxis: {
      title: 'Year'
    },

    vAxis: {
      title: 'Built-up class area (km2)'
    },

    pointSize: 6,

    lineWidth: 2,

    legend: {
      position: 'none'
    }

  })

);

// ===============================================================
// CHART 2 — ANALYSIS B
// ===============================================================

print(

  ui.Chart.feature.byFeature(
    rowsB.sort('year'),
    'year',
    ['ghsl_built_surface_km2']
  )
  .setChartType('LineChart')
  .setOptions({

    title:
      'Analysis B - GHSL Built-up surface (2025 modelled)',

    hAxis: {
      title: 'Year'
    },

    vAxis: {
      title: 'GHSL built-up surface (km2)'
    },

    pointSize: 6,

    lineWidth: 2,

    legend: {
      position: 'none'
    }

  })

);

// ===============================================================
// OPTIONAL MAP VISUALIZATION
// ===============================================================

Map.layers().reset();

Map.setOptions('SATELLITE');

Map.addLayer(
  a2015,
  {
    min: 1,
    max: 5,
    palette: PALETTE
  },
  'A - 2015 Fusion',
  false
);

Map.addLayer(
  a2020,
  {
    min: 1,
    max: 5,
    palette: PALETTE
  },
  'A - 2020 Fusion',
  true
);

Map.addLayer(
  a2025,
  {
    min: 1,
    max: 5,
    palette: PALETTE
  },
  'A - 2025 Fusion',
  false
);

Map.addLayer(
  ghsl[2005].clip(roi),
  {
    min: 0,
    max: 9000,
    palette: [
      'ffffff',
      'b6c9d8',
      '17446b'
    ]
  },
  'B - GHSL 2005',
  false
);

Map.addLayer(
  ghsl[2020].clip(roi),
  {
    min: 0,
    max: 9000,
    palette: [
      'ffffff',
      'badccc',
      '006b5b'
    ]
  },
  'B - GHSL 2020',
  false
);

Map.addLayer(
  ghsl[2025].clip(roi),
  {
    min: 0,
    max: 9000,
    palette: [
      'ffffff',
      'ffddb3',
      'ac3e20'
    ]
  },
  'B - GHSL 2025 MODELLED',
  false
);

Map.centerObject(roi, 10);

// ===============================================================
// END STAGE 08G-11
// ===============================================================

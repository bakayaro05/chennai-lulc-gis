
// ============================================================
// CHENNAI LULC — STAGE 07R
// 2010 L5+L7 VERSUS 2015 CROSS-YEAR PLAUSIBILITY AUDIT
//
// READ ONLY
// NO CLASSIFICATION, TRAINING, RELABELLING OR EXPORTS
//
// 2010 = experimental L5+L7 Gaussian MLC
// 2015 = previously locked Gaussian MLC
//
// Purpose:
// Identify spatial and area inconsistencies before
// approving 2010 for historical change detection.
// ============================================================


// ------------------------------------------------------------
// 1. LOCKED SETTINGS
// ------------------------------------------------------------

var ROOT = 'projects/assignment-482806/assets/';

var CRS = 'EPSG:32644';

var GRID = [
  30, 0, 399060,
  0, -30, 1463250
];

var PALETTE = [
  'ff0000',
  '008000',
  '0000ff',
  'ffff00',
  'd2b48c'
];


// ------------------------------------------------------------
// 2. LOAD EXISTING SAVED CLASSIFICATIONS
// ------------------------------------------------------------

var roiFC = ee.FeatureCollection(
  ROOT + 'chennai_admin_study_area_clean'
);

var roi = roiFC.geometry();

var raster2010 = ee.Image(
  ROOT + 'chennai_mlc_lulc_2010_L5L7_manual_exp_v1'
).select('classification').clip(roi);

var raster2015 = ee.Image(
  ROOT + 'chennai_mlc_lulc_2015'
).select('classification').clip(roi);


// ------------------------------------------------------------
// 3. COMMON VALID PIXEL COVERAGE
// ------------------------------------------------------------

var commonMask = raster2010.mask()
  .and(raster2015.mask());

var a2010 = raster2010.updateMask(commonMask);

var a2015 = raster2015.updateMask(commonMask);


print('=============================================');
print('07R — 2010 / 2015 CROSS-YEAR PLAUSIBILITY');
print('=============================================');

print('Locked ROI area, km2:');
print(
  roi.area(1, ee.Projection(CRS))
    .divide(1e6)
);

print('2010 raster projection:');
print(raster2010.projection());

print('2015 raster projection:');
print(raster2015.projection());

print('2010 = experimental classification.');
print('2015 = previously locked classification.');


// ------------------------------------------------------------
// 4. POST-CLASSIFICATION TRANSITION IMAGE
// ------------------------------------------------------------
//
// Encode transition as:
//
// (2010 class * 10) + 2015 class
//
// Examples:
//
// 11 = Built-up -> Built-up
// 12 = Built-up -> Vegetation
// 14 = Built-up -> Agricultural
// 15 = Built-up -> Vacant/Open
//
// These are differences between classifications,
// NOT independently verified historical conversions.
// ------------------------------------------------------------

var transition = a2010
  .multiply(10)
  .add(a2015)
  .rename('transition')
  .toInt16();


// ------------------------------------------------------------
// 5. AREA-WEIGHTED TRANSITION STATISTICS
// ------------------------------------------------------------

var areaAndTransition = ee.Image.pixelArea()
  .divide(1e6)
  .rename('area_km2')
  .addBands(transition);

var grouped = areaAndTransition.reduceRegion({

  reducer: ee.Reducer.sum().group({
    groupField: 1,
    groupName: 'transition'
  }),

  geometry: roi,

  crs: CRS,

  crsTransform: GRID,

  maxPixels: 1e10,

  tileScale: 8

});


// ------------------------------------------------------------
// 6. BUILD TRANSITION TABLE
// ------------------------------------------------------------

var transitionRows = ee.FeatureCollection(

  ee.List(grouped.get('groups')).map(
    function(item) {

      var d = ee.Dictionary(item);

      var code = ee.Number(
        d.get('transition')
      );

      var fromClass = code.divide(10).floor();

      var toClass = code.mod(10);

      return ee.Feature(null, {

        transition_code: code,

        from_2010: fromClass,

        to_2015: toClass,

        area_km2: d.get('sum')

      });

    }
  )

);


// ------------------------------------------------------------
// 7. MEASURE APPARENT BUILT-UP LOSSES AND GAINS
// ------------------------------------------------------------

// Mapped Built-up in 2010, another class in 2015.

var builtLoss = ee.Number(

  transitionRows
    .filter(ee.Filter.eq('from_2010', 1))
    .filter(ee.Filter.neq('to_2015', 1))
    .aggregate_sum('area_km2')

);

// Mapped non-Built-up in 2010, Built-up in 2015.

var builtGain = ee.Number(

  transitionRows
    .filter(ee.Filter.neq('from_2010', 1))
    .filter(ee.Filter.eq('to_2015', 1))
    .aggregate_sum('area_km2')

);

// Built-up in both classifications.

var stableBuilt = ee.Number(

  transitionRows
    .filter(
      ee.Filter.eq('transition_code', 11)
    )
    .aggregate_sum('area_km2')

);

var builtArea2010 = builtLoss.add(stableBuilt);

var builtArea2015 = builtGain.add(stableBuilt);


// ------------------------------------------------------------
// 8. TRANSITION MATRIX RESULTS
// ------------------------------------------------------------

print('=============================================');
print('2010 TO 2015 — CLASS TRANSITION RESULTS');
print('=============================================');

print('Transition code = 2010 class * 10 + 2015 class.');

print('All observed transition pairs:');
print(
  transitionRows.sort('transition_code')
);

print('Common valid classified area, km2:');
print(
  transitionRows.aggregate_sum('area_km2')
);


// ------------------------------------------------------------
// 9. CRITICAL BUILT-UP AREA AUDIT
// ------------------------------------------------------------

print('=============================================');
print('CRITICAL BUILT-UP PLAUSIBILITY CHECK');
print('=============================================');

print('2010 Built-up area on common grid, km2:');
print(builtArea2010);

print('2015 Built-up area on common grid, km2:');
print(builtArea2015);

print('Mapped 2010 Built-up -> 2015 Other, km2:');
print(builtLoss);

print('Mapped 2010 Other -> 2015 Built-up, km2:');
print(builtGain);

print('Mapped Built-up in both years, km2:');
print(stableBuilt);

print('Net 2015 minus 2010 Built-up area, km2:');
print(
  builtArea2015.subtract(builtArea2010)
);

print('Destinations of pixels mapped Built-up in 2010:');

print(
  transitionRows
    .filter(ee.Filter.eq('from_2010', 1))
    .sort('to_2015')
);


// ------------------------------------------------------------
// 10. SPATIAL FLAG LAYERS
// ------------------------------------------------------------

// Pixels mapped Built-up in 2010,
// but as another class in 2015.

var mappedBuiltLoss = a2010.eq(1)
  .and(a2015.neq(1))
  .selfMask();

// Pixels mapped as other classes in 2010,
// but Built-up in 2015.

var mappedBuiltGain = a2010.neq(1)
  .and(a2015.eq(1))
  .selfMask();

// Agricultural / Vacant differences between years.

var agricultureVacantMismatch = a2010.eq(4)
  .and(a2015.eq(5))
  .or(
    a2010.eq(5).and(a2015.eq(4))
  )
  .selfMask();


// ------------------------------------------------------------
// 11. MAP DISPLAY
// ------------------------------------------------------------

Map.layers().reset();

Map.setOptions('SATELLITE');

Map.centerObject(roi, 10);

// 2010 classification

Map.addLayer(
  raster2010,
  {
    min: 1,
    max: 5,
    palette: PALETTE
  },
  '2010 L5+L7 — EXPERIMENTAL',
  true
);

// 2015 classification for visual comparison

Map.addLayer(
  raster2015,
  {
    min: 1,
    max: 5,
    palette: PALETTE
  },
  '2015 — LOCKED',
  false
);

// Potentially implausible mapped Built-up losses

Map.addLayer(
  mappedBuiltLoss,
  {
    palette: ['ff00ff']
  },
  'ALERT: 2010 Built -> 2015 Other',
  true
);

// Mapped Built-up gains

Map.addLayer(
  mappedBuiltGain,
  {
    palette: ['00ffff']
  },
  '2010 Other -> 2015 Built',
  false
);

// Agricultural vs Vacant/Open disagreement

Map.addLayer(
  agricultureVacantMismatch,
  {
    palette: ['ffff00']
  },
  '2010/2015 Agricultural-Vacant Disagreement',
  false
);

// Locked study area

Map.addLayer(
  roiFC.style({
    color: 'FFFFFF',
    fillColor: '00000000',
    width: 2
  }),
  {},
  'Locked Study Area',
  true
);


// ------------------------------------------------------------
// 12. FINAL SAFEGUARDS
// ------------------------------------------------------------

print('=============================================');
print('STAGE 07R COMPLETED — AUDIT ONLY');
print('=============================================');

print('No assets modified.');
print('No labels changed.');
print('No classifiers retrained.');
print('No exports created.');

print('2015 classifications are not ground truth for 2010.');

print('Do not automatically remove unusual transitions.');

print('Verify class definitions across years before');
print('using these differences as historical change.');

print('=============================================');
print('END STAGE 07R');
print('=============================================');

// ============================================================
// END
// ============================================================

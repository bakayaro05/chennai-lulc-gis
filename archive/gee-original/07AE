
 // =============================================================
 // CHENNAI LULC — STAGE 07AE
 // DIAGNOSE 07AD'S GROUPED-AREA VS MASK-AREA DIFFERENCE
 // READ-ONLY. No export, asset write or classification changes.
 // Start with the 2010 provisional four-class map; change YEAR to
 // another year only after inspecting the first result.
 // =============================================================

 var ROOT = 'projects/assignment-482806/assets/';
 var YEAR = 2010;
 var CRS = 'EPSG:32644';
 var TX = [30, 0, 399060, 0, -30, 1463250];

 var ROI = ee.FeatureCollection(
   ROOT + 'chennai_admin_study_area_clean'
 ).geometry();

 var assetByYear = {
   2010: 'chennai_lulc4_2010_L5L7_provisional_v1',
   2015: 'chennai_lulc4_2015_v1',
   2020: 'chennai_lulc4_2020_v1',
   2025: 'chennai_lulc4_2025_v1'
 };

 var name = assetByYear[YEAR];

 if (!name) {
   throw new Error(
     'YEAR must be 2010, 2015, 2020 or 2025.'
   );
 }

 // =============================================================
 // 1. LOAD EXISTING CLASSIFICATION
 // =============================================================

 // Match 07AD's saved-image expression exactly.

 var saved = ee.Image(ROOT + name)
   .select([0], ['classification'])
   .clip(ROI);

 var area = ee.Image.pixelArea()
   .divide(1e6)
   .rename('area_km2');

 var mask = saved.mask()
   .rename('mask_fraction');

 var classIsValid = saved.gte(1)
   .and(saved.lte(4));

 var opts = {
   geometry: ROI,
   crs: CRS,
   crsTransform: TX,
   maxPixels: 1e9,
   tileScale: 8
 };

 // =============================================================
 // 2. AREA REDUCTION HELPER
 // =============================================================

 function totalArea(image) {

   return image.rename('area_km2')
     .reduceRegion({
       reducer: ee.Reducer.sum(),
       geometry: opts.geometry,
       crs: opts.crs,
       crsTransform: opts.crsTransform,
       maxPixels: opts.maxPixels,
       tileScale: opts.tileScale
     })
     .get('area_km2');

 }

 // =============================================================
 // 3. EXACT GROUPED-AREA METHOD FROM STAGE 07AD
 // =============================================================

 var groups = ee.List(
   area.addBands(
     saved.rename('code')
   )
   .reduceRegion({
     reducer: ee.Reducer.sum().group({
       groupField: 1,
       groupName: 'code'
     }),
     geometry: opts.geometry,
     crs: opts.crs,
     crsTransform: opts.crsTransform,
     maxPixels: opts.maxPixels,
     tileScale: opts.tileScale
   })
   .get('groups')
 );

 var groupedTotal = ee.Number(
   groups.map(function(g) {
     return ee.Number(
       ee.Dictionary(g).get('sum')
     );
   })
   .reduce(ee.Reducer.sum())
 );

 // =============================================================
 // 4. COMPARE DIFFERENT AREA CALCULATIONS
 // =============================================================

 // A: Grouped total from 07AD

 var aGrouped = groupedTotal;

 // B: Mask treated as a numeric value.
 // This reproduces Stage 07AD's mask diagnostic.

 var aMaskAsValue = ee.Number(
   totalArea(
     area.multiply(mask)
   )
 );

 // C: Mask applied as an image mask.

 var aMaskAsWeight = ee.Number(
   totalArea(
     area.updateMask(mask)
   )
 );

 // D: Pixels belonging to classes 1 through 4.

 var aValidClassAsWeight = ee.Number(
   totalArea(
     area.updateMask(classIsValid)
   )
 );

 // E: Pixel area reduced over the ROI.

 var aRawROI = ee.Number(
   totalArea(area)
 );

 // =============================================================
 // 5. CHECK FRACTIONAL MASK VALUES
 // =============================================================

 // Test whether mask values lie strictly between 0 and 1.

 var fractionalMask = mask.gt(0)
   .and(mask.lt(1));

 var aFractionalMaskCells = ee.Number(
   totalArea(
     area.updateMask(fractionalMask)
   )
 );

 // =============================================================
 // 6. PRINT DIAGNOSTIC RESULTS
 // =============================================================

 print('=============================================');
 print('STAGE 07AE — AREA RECONCILIATION (READ-ONLY)');
 print('=============================================');

 print('Year');
 print(YEAR);

 print('Asset');
 print(ROOT + name);

 print('Projection');
 print(saved.projection());

 print('ROI vector geometry area, sq km');
 print(
   ROI.area(1, ee.Projection(CRS)).divide(1e6)
 );

 print('07AD grouped 4-class area, sq km');
 print(aGrouped);

 print('07AD pixelArea × saved.mask(), sq km');
 print(aMaskAsValue);

 print('pixelArea.updateMask(saved.mask()), sq km');
 print(aMaskAsWeight);

 print('pixelArea.updateMask(code >= 1 & <= 4), sq km');
 print(aValidClassAsWeight);

 print('Unmasked ROI pixelArea reduction, sq km');
 print(aRawROI);

 print('Area in locations with fractional (0 < mask < 1), sq km');
 print(aFractionalMaskCells);

 // =============================================================
 // 7. PRINT DIFFERENCES
 // =============================================================

 print('Grouped minus 07AD mask-as-value, sq km');
 print(
   aGrouped.subtract(aMaskAsValue)
 );

 print('Grouped minus mask-as-weight, sq km');
 print(
   aGrouped.subtract(aMaskAsWeight)
 );

 print('Grouped minus class-valid-as-weight, sq km');
 print(
   aGrouped.subtract(aValidClassAsWeight)
 );

 print('=============================================');

 print(
   'No exports, changes to class pixels or asset modifications.'
 );

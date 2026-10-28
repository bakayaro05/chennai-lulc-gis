
 // ================================================================
 // STAGE 08 | QUICK UNSEEN-CITY SCREEN | 2020
 // Frozen Chennai Gaussian MLC -> closest coastal TN pilot city
 // NO new training and NO manual reference labels.
 // Automated map agreement is NOT verified ground-truth accuracy.
 // ================================================================

 var ROOT = 'projects/assignment-482806/assets/';
 var CRS = 'EPSG:32644';
 var SCALE = 30;
 var RADIUS_METERS = 3000;

 var RAW = ['blue','green','red','nir','swir1','swir2'];
 var BANDS = ['blue','green','red','nir','swir1','swir2',
              'NDVI','NDWI','NDBI'];

 var PALETTE = [
   'e31a1c','33a02c','1f78b4','ffb000','b15928'
 ];

 var CLASS_NAMES = [
   'Built-up','Vegetation','Water',
   'Agricultural/Open','Barren/Fallow'
 ];

 var sourceROI = ee.FeatureCollection(
   ROOT + 'chennai_admin_study_area_clean'
 ).geometry();

 var sourceTraining = ee.FeatureCollection(
   ROOT + 'chennai_training_2020_final'
 );

 // Predefined shortlist. The winning city is chosen from
 // UNLABELED spectral information, before looking at model agreement.
 var PLACES = [
   {name:'Cuddalore', lon:79.770000, lat:11.740000},
   {name:'Nagapattinam', lon:79.843130, lat:10.763769},
   {name:'Thoothukudi', lon:78.134835, lat:8.764166}
 ];

 // ================================================================
 // 1. ORIGINAL 2020 LANDSAT PROCESSING
 // ================================================================

 function preprocess(im) {
   var q = im.select('QA_PIXEL');

   var clear = q.bitwiseAnd(1 << 0).eq(0)
     .and(q.bitwiseAnd(1 << 1).eq(0))
     .and(q.bitwiseAnd(1 << 2).eq(0))
     .and(q.bitwiseAnd(1 << 3).eq(0))
     .and(q.bitwiseAnd(1 << 4).eq(0))
     .and(q.bitwiseAnd(1 << 5).eq(0))
     .and(im.select('QA_RADSAT').eq(0));

   return im.select(
     ['SR_B2','SR_B3','SR_B4','SR_B5','SR_B6','SR_B7'],
     RAW
   )
   .multiply(0.0000275)
   .add(-0.2)
   .toFloat()
   .updateMask(clear)
   .copyProperties(im,['system:time_start']);
 }

 function landsat(geometry) {
   return ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
     .filterBounds(geometry)
     .filterDate('2020-01-01','2021-01-01')
     .map(preprocess);
 }

 function indices(six) {
   var nir = six.select('nir');
   var red = six.select('red');
   var green = six.select('green');
   var swir = six.select('swir1');

   return six.addBands([
     nir.subtract(red)
       .divide(nir.add(red)).rename('NDVI'),

     green.subtract(nir)
       .divide(green.add(nir)).rename('NDWI'),

     swir.subtract(nir)
       .divide(swir.add(nir)).rename('NDBI')
   ]).select(BANDS);
 }

 // ================================================================
 // 2. COMPARE SPECTRAL SIMILARITY TO CHENNAI
 //
 // Six Landsat reflectance bands.
 // Unlabeled regional medians estimated at 90 m.
 // Lower distance means closer among these three candidates.
 // ================================================================

 var srcSix = landsat(sourceROI).median().select(RAW);

 var srcMedian = ee.Dictionary(srcSix.reduceRegion({
   reducer:ee.Reducer.median(),
   geometry:sourceROI,
   crs:CRS,
   scale:90,
   maxPixels:1e8,
   tileScale:8
 }));

 var cityFeatures = [];

 for (var i=0; i<PLACES.length; i++) {

   var p = PLACES[i];

   // Fixed pilot circle, not an official municipal boundary.
   var g = ee.Geometry.Point([p.lon,p.lat])
     .buffer(RADIUS_METERS);

   var collection = landsat(g);

   var med = ee.Dictionary(
     collection.median().select(RAW).reduceRegion({
       reducer:ee.Reducer.median(),
       geometry:g,
       crs:CRS,
       scale:90,
       maxPixels:1e8,
       tileScale:8
     })
   );

   var distance = ee.Number(0);

   for (var b=0; b<RAW.length; b++) {

     var band = RAW[b];

     var sourceValue = ee.Number(
       srcMedian.get(band)
     );

     var cityValue = ee.Number(
       med.get(band)
     );

     distance = distance.add(
       cityValue.subtract(sourceValue).abs()
         .divide(sourceValue.abs().max(0.05))
     );
   }

   distance = distance.divide(RAW.length);

   cityFeatures.push(
     ee.Feature(g,{
       city:p.name,
       spectral_distance:distance,
       landsat_scene_count:collection.size(),
       pilot_area_km2:g.area(1).divide(1e6)
     })
   );
 }

 var cityRanking = ee.FeatureCollection(cityFeatures)
   .sort('spectral_distance');

 var selectedCity = ee.Feature(cityRanking.first());

 var roi = selectedCity.geometry();

 var chosenName = selectedCity.get('city');

 // ================================================================
 // 3. CREATE TARGET NINE-BAND PREDICTOR STACK
 // ================================================================

 var composite = landsat(roi).median().select(RAW);

 var predictor = indices(composite).clip(roi);

 // ================================================================
 // 4. ORIGINAL FROZEN CHENNAI GAUSSIAN MLC
 // ================================================================

 function frozenParameters(k) {

   var f = sourceTraining.filter(
     ee.Filter.eq('class_id',k)
   );

   var mu = ee.Array([
     BANDS.map(function(b) {
       return f.aggregate_mean(b);
     })
   ]).transpose();

   var cov = ee.Array(
     f.makeArray(BANDS,'mlc_vector')
       .reduceColumns({
         reducer:ee.Reducer.covariance()
           .setOutputs(['covariance']),
         selectors:['mlc_vector']
       }).get('covariance')
   );

   var covReg = cov.add(
     ee.Array.identity(9).multiply(1e-6)
   );

   return {
     id:k,
     mu:mu,
     inv:covReg.matrixInverse(),
     logdet:covReg.matrixDeterminant()
       .max(1e-300).log()
   };
 }

 function logScore(stack, model) {

   var x = stack.toArray().toArray(1);

   var d = x.subtract(
     ee.Image.constant(model.mu)
   );

   var quad = d.arrayTranspose()
     .matrixMultiply(
       ee.Image.constant(model.inv)
     )
     .matrixMultiply(d)
     .arrayGet([0,0]);

   return quad.multiply(-0.5)
     .subtract(
       ee.Image.constant(model.logdet)
         .multiply(0.5)
     )
     .rename('score_'+model.id);
 }

 var scores = [];

 for (var k=1; k<=5; k++) {
   scores.push(
     logScore(predictor,frozenParameters(k))
   );
 }

 var predicted = ee.Image.cat(scores)
   .toArray()
   .arrayArgmax()
   .arrayGet([0])
   .add(1)
   .rename('mlc_class')
   .toByte()
   .clip(roi);

 // ================================================================
 // 5. AUTOMATED REFERENCE CONSENSUS
 //
 // ESA WorldCover 2020 + Dynamic World 2020.
 // Include only locations where both products agree.
 //
 // Mapping to our five classes:
 // 1: WorldCover built-up / DW built
 // 2: WorldCover tree / DW trees
 // 3: WorldCover water / DW water
 // 4: WorldCover cropland / DW crops
 // 5: WorldCover bare / DW bare
 //
 // Classes 2,4,5 are only subsets of our broader definitions.
 // ================================================================

 var wc = ee.ImageCollection('ESA/WorldCover/v100')
   .first()
   .select('Map')
   .clip(roi);

 var dw = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1')
   .filterBounds(roi)
   .filterDate('2020-01-01','2021-01-01');

 var dwMode = dw.select('label').mode();

 var dwMean = dw.select([
   'built','trees','water','crops','bare'
 ]).mean();

 var dwCount = dw.select('label').count();

 var enough = dwCount.gte(3);

 // Predefined probability screening thresholds.
 // These are not calibrated or optimized on target references.

 var proxy = ee.Image.constant(0)
   .rename('proxy_class')
   .toByte()

   .where(
     wc.eq(50).and(dwMode.eq(6))
       .and(dwMean.select('built').gte(0.30))
       .and(enough),1
   )

   .where(
     wc.eq(10).and(dwMode.eq(1))
       .and(dwMean.select('trees').gte(0.40))
       .and(enough),2
   )

   .where(
     wc.eq(80).and(dwMode.eq(0))
       .and(dwMean.select('water').gte(0.50))
       .and(enough),3
   )

   .where(
     wc.eq(40).and(dwMode.eq(4))
       .and(dwMean.select('crops').gte(0.25))
       .and(enough),4
   )

   .where(
     wc.eq(60).and(dwMode.eq(7))
       .and(dwMean.select('bare').gte(0.25))
       .and(enough),5
   );

 proxy = proxy
   .updateMask(proxy.gt(0))
   .updateMask(predicted.mask())
   .clip(roi);

 // ================================================================
 // 6. SAMPLE AUTOMATIC REFERENCE CLASSES
 //
 // Maximum 40 sampled locations per reference class.
 // Deterministic random seed.
 // No manual interpretation.
 // ================================================================

 var paired = proxy
   .addBands(predicted.unmask(0))
   .stratifiedSample({
     numPoints:40,
     classBand:'proxy_class',
     region:roi,
     projection:ee.Projection(CRS),
     scale:SCALE,
     seed:20261027,
     geometries:false,
     tileScale:8
   })
   .map(function(f) {

     var correct = ee.Number(
       f.get('proxy_class')
     ).eq(
       ee.Number(f.get('mlc_class'))
     );

     return f.set(
       'match',
       ee.Number(
         ee.Algorithms.If(correct,1,0)
       )
     );
   });

 // ================================================================
 // 7. REFERENCE SUBSET AREA WEIGHTS
 // ================================================================

 var grouped = ee.List(
   ee.Image.pixelArea()
     .rename('m2')
     .addBands(proxy)
     .reduceRegion({
       reducer:ee.Reducer.sum().group({
         groupField:1,
         groupName:'proxy_id'
       }),
       geometry:roi,
       crs:CRS,
       scale:SCALE,
       maxPixels:1e8,
       tileScale:8
     }).get('groups')
 );

 var areaDict = ee.Dictionary.fromLists(

   grouped.map(function(f) {
     return ee.Number(
       ee.Dictionary(f).get('proxy_id')
     ).format('%d');
   }),

   grouped.map(function(f) {
     return ee.Dictionary(f).get('sum');
   })
 );

 var totalArea = ee.Number(
   grouped.iterate(function(f,acc) {

     return ee.Number(acc).add(
       ee.Number(
         ee.Dictionary(f).get('sum')
       )
     );

   },0)
 );

 // ================================================================
 // 8. AGREEMENT SUMMARY BY AUTOMATIC REFERENCE CLASS
 // ================================================================

 var byClass = ee.FeatureCollection(
   ee.List.sequence(1,5).map(function(id) {

     id = ee.Number(id);

     var subset = paired.filter(
       ee.Filter.eq('proxy_class',id)
     );

     var n = subset.size();

     var correct = ee.Number(
       ee.Algorithms.If(
         n.gt(0),
         subset.aggregate_sum('match'),
         0
       )
     );

     var a = ee.Number(
       areaDict.get(id.format('%d'),0)
     );

     var fraction = correct.divide(
       ee.Number(n).max(1)
     );

     var weight = a.divide(
       totalArea.max(1)
     );

     return ee.Feature(null,{
       class_id:id,

       class_name:ee.List(CLASS_NAMES)
         .get(id.subtract(1)),

       proxy_area_km2:a.divide(1e6),

       reference_samples:n,

       correct_matches:correct,

       sample_agreement_pct:
         fraction.multiply(100),

       reference_subset_area_weight:weight,

       agreement_contribution:
         weight.multiply(fraction)
     });

   })
 );

 var proxyAgreement = ee.Number(
   byClass.aggregate_sum('agreement_contribution')
 );

 // ================================================================
 // 9. FULL MLC MAPPED AREAS
 // ================================================================

 var mappedGroups = ee.List(
   ee.Image.pixelArea()
     .rename('m2')
     .addBands(predicted)
     .reduceRegion({
       reducer:ee.Reducer.sum().group({
         groupField:1,
         groupName:'mlc_id'
       }),
       geometry:roi,
       crs:CRS,
       scale:SCALE,
       maxPixels:1e8,
       tileScale:8
     }).get('groups')
 );

 var fullMapAreas = ee.FeatureCollection(
   mappedGroups.map(function(g) {

     g = ee.Dictionary(g);

     var id = ee.Number(
       g.get('mlc_id')
     );

     return ee.Feature(null,{
       class_id:id,

       class_name:ee.List(CLASS_NAMES)
         .get(id.subtract(1)),

       area_km2:ee.Number(
         g.get('sum')
       ).divide(1e6)
     });

   })
 );

 var predictedArea = ee.Number(
   ee.Image.pixelArea()
     .updateMask(predicted.mask())
     .reduceRegion({
       reducer:ee.Reducer.sum(),
       geometry:roi,
       crs:CRS,
       scale:SCALE,
       maxPixels:1e8,
       tileScale:8
     }).get('area')
 );

 // ================================================================
 // 10. CONSOLE OUTPUT
 // ================================================================

 print('==============================================');
 print('STAGE 08: UNSEEN COASTAL TN CITY | FROZEN MLC');
 print('==============================================');

 print('Candidate cities ranked by UNLABELED spectral similarity:');
 print(
   cityRanking.select([
     'city',
     'spectral_distance',
     'landsat_scene_count',
     'pilot_area_km2'
   ])
 );

 print('Selected city (lowest spectral distance):');
 print(chosenName);

 print('Chosen pilot area km2 (NOT official boundary):');
 print(roi.area(1).divide(1e6));

 print('Selected city 2020 Landsat scenes:');
 print(landsat(roi).size());

 print('Selected city 2020 Dynamic World scenes:');
 print(dw.size());

 print('Chennai source model class counts (expect 120 each):');
 print(
   sourceTraining.aggregate_histogram('class_id')
 );

 print('Total classified area km2:');
 print(predictedArea.divide(1e6));

 print('Frozen MLC full-map class areas (km2):');
 print(fullMapAreas);

 print('High-confidence agreement subset area km2:');
 print(totalArea.divide(1e6));

 print('High-confidence subset, percentage of classified area:');
 print(
   totalArea.divide(predictedArea).multiply(100)
 );

 print('Proxy-reference sampled point counts by class:');
 print(
   paired.aggregate_histogram('proxy_class')
 );

 print('Reference-product agreement by class (NOT true accuracy):');
 print(byClass);

 print('Area-weighted MLC-versus-proxy AGREEMENT on subset (%):');
 print(
   proxyAgreement.multiply(100)
 );

 print('Confusion matrix: rows=automatic proxy, columns=MLC:');
 print(
   paired.errorMatrix(
     'proxy_class',
     'mlc_class',
     [1,2,3,4,5]
   )
 );

 print('Automated agreement is NOT independently verified accuracy.');
 print('Class definitions do not match perfectly, especially 2, 4 and 5.');
 print('No Chennai model parameters changed.');
 print('No manual labels used.');

 // ================================================================
 // 11. MAP DISPLAY
 // ================================================================

 Map.layers().reset();
 Map.setOptions('SATELLITE');
 Map.centerObject(roi,12);

 Map.addLayer(
   predicted,
   {min:1,max:5,palette:PALETTE},
   'Frozen Chennai Gaussian MLC - chosen city',
   true
 );

 Map.addLayer(
   proxy,
   {min:1,max:5,palette:PALETTE},
   'WorldCover + Dynamic World agreement only',
   false
 );

 Map.addLayer(
   ee.Image().paint(roi,1,2),
   {palette:['ffffff']},
   'Pilot circle boundary',
   true
 );

 // ================================================================
 // 12. OPTIONAL EXPORTS
 // ================================================================

 Export.image.toAsset({
   image:predicted,

   description:
     'TN2020_SPECTRALLY_SELECTED_CITY_FROZEN_MLC',

   assetId:ROOT +
     'tn_2020_spectrally_selected_city_frozen_mlc_v1',

   region:roi,
   crs:CRS,
   scale:SCALE,
   maxPixels:1e9,

   pyramidingPolicy:{
     '.default':'mode'
   }
 });

 Export.table.toDrive({
   collection:byClass,

   description:
     'TN2020_SELECTED_CITY_AUTOMATIC_PROXY_AGREEMENT',

   fileNamePrefix:
     'TN2020_SELECTED_CITY_AUTOMATIC_PROXY_AGREEMENT',

   fileFormat:'CSV'
 });

 print('Finished. Review spectral ranking, subset coverage and agreement.');

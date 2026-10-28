
 // ================================================================
 // STAGE 09 - AUTOMATED FROZEN MLC TRANSFER BENCHMARK
 // Run Nagapattinam, then Thoothukudi separately.
 // Chennai 2020 source model remains unchanged.
 // NO target training; automated proxy agreement, NOT true accuracy.
 // ================================================================

 var CITY = 'Thoothukudi';

 // For the second run, change ONLY the line above to:
 // var CITY = 'Thoothukudi';

 var PLACES = {
   'Nagapattinam': {lon:79.843130, lat:10.763769},
   'Thoothukudi': {lon:78.134835, lat:8.764166}
 };

 if (!PLACES[CITY]) {
   throw new Error('Invalid city selected');
 }

 var CHOSEN = PLACES[CITY];
 var ROOT = 'projects/assignment-482806/assets/';
 var CRS = 'EPSG:32644';
 var SCALE = 30;
 var SEED = 20261027;

 var RAW = [
   'blue','green','red','nir','swir1','swir2'
 ];

 var BANDS = [
   'blue','green','red','nir','swir1','swir2',
   'NDVI','NDWI','NDBI'
 ];

 var COLORS = [
   'e31a1c','33a02c','1f78b4','ffb000','b15928'
 ];

 var NAMES = ee.List([
   'Built-up','Vegetation','Water',
   'Agricultural/Open','Barren/Fallow'
 ]);

 var ROI = ee.Geometry.Point([
   CHOSEN.lon, CHOSEN.lat
 ]).buffer(3000);

 var TRAIN = ee.FeatureCollection(
   ROOT + 'chennai_training_2020_final'
 );

 var KEY = CITY.toUpperCase();
 var SLUG = CITY.toLowerCase();

 // ================================================================
 // 1. LANDSAT PREPROCESSING
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
     [
       'SR_B2','SR_B3','SR_B4',
       'SR_B5','SR_B6','SR_B7'
     ],
     RAW
   )
   .multiply(0.0000275)
   .add(-0.2)
   .toFloat()
   .updateMask(clear)
   .copyProperties(im,['system:time_start']);
 }

 var landsat = ee.ImageCollection(
   'LANDSAT/LC08/C02/T1_L2'
 )
 .filterBounds(ROI)
 .filterDate('2020-01-01','2021-01-01')
 .map(preprocess);

 var six = landsat.median().select(RAW);

 var nir = six.select('nir');
 var red = six.select('red');
 var green = six.select('green');
 var swir = six.select('swir1');

 var predictors = six.addBands([

   nir.subtract(red)
     .divide(nir.add(red))
     .rename('NDVI'),

   green.subtract(nir)
     .divide(green.add(nir))
     .rename('NDWI'),

   swir.subtract(nir)
     .divide(swir.add(nir))
     .rename('NDBI')

 ]).select(BANDS).clip(ROI);

 // ================================================================
 // 2. FROZEN CHENNAI GAUSSIAN MLC
 // ================================================================

 function modelForClass(id) {

   var fc = TRAIN.filter(
     ee.Filter.eq('class_id',id)
   );

   var mu = ee.Array([
     BANDS.map(function(b) {
       return fc.aggregate_mean(b);
     })
   ]).transpose();

   var cov = ee.Array(
     fc.makeArray(BANDS,'mlc_vector')
       .reduceColumns({
         reducer:ee.Reducer.covariance()
           .setOutputs(['covariance']),
         selectors:['mlc_vector']
       }).get('covariance')
   );

   var reg = cov.add(
     ee.Array.identity(9).multiply(1e-6)
   );

   return {
     id:id,
     mean:mu,
     inverse:reg.matrixInverse(),
     logdet:reg.matrixDeterminant()
       .max(1e-300).log()
   };
 }

 function gaussianLogScore(im,m) {

   var x = im.toArray().toArray(1);

   var d = x.subtract(
     ee.Image.constant(m.mean)
   );

   var mahalanobis = d.arrayTranspose()
     .matrixMultiply(
       ee.Image.constant(m.inverse)
     )
     .matrixMultiply(d)
     .arrayGet([0,0]);

   return mahalanobis.multiply(-0.5)
     .subtract(
       ee.Image.constant(m.logdet)
         .multiply(0.5)
     )
     .rename('score_' + m.id);
 }

 var scoreBands = [];

 for (var k=1; k<=5; k++) {
   scoreBands.push(
     gaussianLogScore(
       predictors,
       modelForClass(k)
     )
   );
 }

 var classified = ee.Image.cat(scoreBands)
   .toArray()
   .arrayArgmax()
   .arrayGet([0])
   .add(1)
   .rename('mlc_class')
   .toByte()
   .clip(ROI);

 // ================================================================
 // 3. AUTOMATIC REFERENCE AGREEMENT
 // ESA WorldCover 2020 + Dynamic World 2020.
 // ================================================================

 var wc = ee.ImageCollection(
   'ESA/WorldCover/v100'
 )
 .first()
 .select('Map')
 .clip(ROI);

 var dw = ee.ImageCollection(
   'GOOGLE/DYNAMICWORLD/V1'
 )
 .filterBounds(ROI)
 .filterDate('2020-01-01','2021-01-01');

 var dwMode = dw.select('label').mode();

 var dwMean = dw.select([
   'built','trees','water','crops','bare'
 ]).mean();

 var sufficientDW = dw.select('label')
   .count().gte(3);

 var proxy = ee.Image.constant(0)
   .rename('proxy_class')
   .toByte()

   .where(
     wc.eq(50).and(dwMode.eq(6))
       .and(dwMean.select('built').gte(0.30))
       .and(sufficientDW),1
   )

   .where(
     wc.eq(10).and(dwMode.eq(1))
       .and(dwMean.select('trees').gte(0.40))
       .and(sufficientDW),2
   )

   .where(
     wc.eq(80).and(dwMode.eq(0))
       .and(dwMean.select('water').gte(0.50))
       .and(sufficientDW),3
   )

   .where(
     wc.eq(40).and(dwMode.eq(4))
       .and(dwMean.select('crops').gte(0.25))
       .and(sufficientDW),4
   )

   .where(
     wc.eq(60).and(dwMode.eq(7))
       .and(dwMean.select('bare').gte(0.25))
       .and(sufficientDW),5
   );

 proxy = proxy
   .updateMask(proxy.gt(0))
   .updateMask(classified.mask())
   .clip(ROI);

 // ================================================================
 // 4. AUTOMATIC STRATIFIED SAMPLING
 // ================================================================

 var sampled = proxy
   .addBands(classified.unmask(0))
   .stratifiedSample({
     numPoints:40,
     classBand:'proxy_class',
     region:ROI,
     projection:ee.Projection(CRS),
     scale:SCALE,
     seed:SEED,
     geometries:false,
     tileScale:8
   })
   .map(function(f) {

     var equal = ee.Number(
       f.get('proxy_class')
     ).eq(
       ee.Number(f.get('mlc_class'))
     );

     return f.set(
       'match',
       ee.Number(
         ee.Algorithms.If(equal,1,0)
       )
     );
   });

 // ================================================================
 // 5. AUTOMATIC PROXY AREA WEIGHTS
 // ================================================================

 var proxyGroups = ee.List(
   ee.Image.pixelArea()
     .rename('area_m2')
     .addBands(proxy)
     .reduceRegion({

       reducer:ee.Reducer.sum().group({
         groupField:1,
         groupName:'proxy_id'
       }),

       geometry:ROI,
       crs:CRS,
       scale:SCALE,
       maxPixels:1e8,
       tileScale:8

     }).get('groups')
 );

 var proxyAreaDict = ee.Dictionary.fromLists(

   proxyGroups.map(function(g) {
     return ee.Number(
       ee.Dictionary(g).get('proxy_id')
     ).format('%d');
   }),

   proxyGroups.map(function(g) {
     return ee.Dictionary(g).get('sum');
   })

 );

 var proxyArea = ee.Number(
   proxyGroups.iterate(function(g,acc) {

     return ee.Number(acc).add(
       ee.Number(
         ee.Dictionary(g).get('sum')
       )
     );

   },0)
 );

 // ================================================================
 // 6. AGREEMENT BY CLASS
 // ================================================================

 var perClass = ee.FeatureCollection(
   ee.List.sequence(1,5).map(function(id) {

     id = ee.Number(id);

     var sub = sampled.filter(
       ee.Filter.eq('proxy_class',id)
     );

     var n = sub.size();

     var hits = ee.Number(
       ee.Algorithms.If(
         n.gt(0),
         sub.aggregate_sum('match'),
         0
       )
     );

     var area = ee.Number(
       proxyAreaDict.get(id.format('%d'),0)
     );

     var agree = hits.divide(
       ee.Number(n).max(1)
     );

     var weight = area.divide(
       proxyArea.max(1)
     );

     return ee.Feature(null,{

       city:CITY,

       class_id:id,
       class_name:NAMES.get(id.subtract(1)),

       proxy_area_km2:area.divide(1e6),

       proxy_sample_n:n,
       proxy_sample_agree_n:hits,

       proxy_sample_agree_pct:
         agree.multiply(100),

       proxy_area_weight:weight,

       weighted_agreement_contribution:
         weight.multiply(agree)

     });

   })
 );

 var overallAgreement = ee.Number(
   perClass.aggregate_sum(
     'weighted_agreement_contribution'
   )
 );

 // ================================================================
 // 7. ADD NON-WATER AGREEMENT
 //
 // Cuddalore's result was strongly influenced by water.
 // Keep this as an additional descriptive metric.
 // ================================================================

 var waterWeight = ee.Number(
   proxyAreaDict.get('3',0)
 ).divide(proxyArea.max(1));

 var noWaterContrib = ee.Number(
   perClass
     .filter(ee.Filter.neq('class_id',3))
     .aggregate_sum('weighted_agreement_contribution')
 );

 var landAgreement = noWaterContrib.divide(
   ee.Number(1)
     .subtract(waterWeight)
     .max(1e-12)
 );

 // ================================================================
 // 8. MLC MAPPED AREAS
 // ================================================================

 var fullGroups = ee.List(
   ee.Image.pixelArea()
     .rename('area_m2')
     .addBands(classified)
     .reduceRegion({

       reducer:ee.Reducer.sum().group({
         groupField:1,
         groupName:'mlc_id'
       }),

       geometry:ROI,
       crs:CRS,
       scale:SCALE,
       maxPixels:1e8,
       tileScale:8

     }).get('groups')
 );

 var fullAreas = ee.FeatureCollection(
   fullGroups.map(function(g) {

     g = ee.Dictionary(g);

     var id = ee.Number(
       g.get('mlc_id')
     );

     return ee.Feature(null,{
       city:CITY,
       class_id:id,
       class_name:NAMES.get(id.subtract(1)),
       mapped_area_km2:
         ee.Number(g.get('sum')).divide(1e6)
     });

   })
 );

 var mappedArea = ee.Number(
   ee.Image.pixelArea()
     .updateMask(classified.mask())
     .reduceRegion({

       reducer:ee.Reducer.sum(),
       geometry:ROI,
       crs:CRS,
       scale:SCALE,
       maxPixels:1e8,
       tileScale:8

     }).get('area')
 );

 var coverage = proxyArea
   .divide(mappedArea)
   .multiply(100);

 // ================================================================
 // 9. CONSOLE OUTPUTS
 // ================================================================

 print('==========================================');
 print('STAGE 09 - AUTOMATED FROZEN MLC TEST');
 print('==========================================');

 print('Selected city:');
 print(CITY);

 print('Pilot area km2:');
 print(ROI.area(1).divide(1e6));

 print('2020 Landsat scenes:');
 print(landsat.size());

 print('2020 Dynamic World scenes:');
 print(dw.size());

 print('Chennai source training counts:');
 print(TRAIN.aggregate_histogram('class_id'));

 print('Valid classified area km2:');
 print(mappedArea.divide(1e6));

 print('Five mapped-class areas km2:');
 print(fullAreas);

 print('Automatic proxy-supported area km2:');
 print(proxyArea.divide(1e6));

 print('Proxy coverage percentage:');
 print(coverage);

 print('Sample counts by proxy class:');
 print(sampled.aggregate_histogram('proxy_class'));

 print('Agreement by automatic proxy class:');
 print(perClass);

 print('OVERALL WEIGHTED PROXY AGREEMENT %:');
 print(overallAgreement.multiply(100));

 print('NON-WATER WEIGHTED PROXY AGREEMENT %:');
 print(landAgreement.multiply(100));

 print('Confusion matrix:');
 print(
   sampled.errorMatrix(
     'proxy_class',
     'mlc_class',
     [1,2,3,4,5]
   )
 );

 print('No model retraining.');
 print('Proxy agreement is NOT verified accuracy.');

 // ================================================================
 // 10. MAP
 // ================================================================

 Map.layers().reset();
 Map.setOptions('SATELLITE');
 Map.centerObject(ROI,12);

 Map.addLayer(
   classified,
   {min:1,max:5,palette:COLORS},
   CITY + ' - Frozen Chennai MLC',
   true
 );

 Map.addLayer(
   proxy,
   {min:1,max:5,palette:COLORS},
   CITY + ' - Automated Reference',
   false
 );

 Map.addLayer(
   ee.Image().paint(ROI,1,2),
   {palette:['ffffff']},
   'Pilot Circle',
   true
 );

 // ================================================================
 // 11. EXPORTS
 // Unique filenames and asset IDs per city.
 // ================================================================

 var tableWithSummary = perClass.map(function(f) {

   return f.set({

     full_classified_area_km2:
       mappedArea.divide(1e6),

     proxy_supported_area_km2:
       proxyArea.divide(1e6),

     proxy_coverage_pct:coverage,

     weighted_proxy_agreement_pct:
       overallAgreement.multiply(100),

     nonwater_weighted_proxy_agreement_pct:
       landAgreement.multiply(100)

   });
 });

 Export.table.toDrive({

   collection:tableWithSummary,

   description:
     'TN2020_' + KEY + '_PROXY_AGREEMENT_V1',

   fileNamePrefix:
     'TN2020_' + KEY + '_PROXY_AGREEMENT_V1',

   fileFormat:'CSV'

 });

 Export.image.toAsset({

   image:classified,

   description:
     'TN2020_' + KEY + '_FROZEN_MLC_MAP_V1',

   assetId:
     ROOT + 'tn_2020_' + SLUG + '_frozen_mlc_v1',

   region:ROI,
   crs:CRS,
   scale:SCALE,
   maxPixels:1e9,

   pyramidingPolicy:{
     '.default':'mode'
   }

 });

 print('==========================================');
 print('EXPERIMENT FINISHED');
 print('==========================================');

 print('Two export tasks created for:');
 print(CITY);

 print('Run the exports from the Tasks tab.');

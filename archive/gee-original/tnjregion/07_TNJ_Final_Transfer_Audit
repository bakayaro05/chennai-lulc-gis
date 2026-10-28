
 // ============================================================
 // FINAL READ-ONLY AUDIT: EXPERIMENT A VS C
 // Chennai 2020 -> Thanjavur 2020
 // Original mapped strata and weights are preserved.
 // No retraining or modification of existing assets.
 // Requires completed Experiment C v2 map export.
 // ============================================================

 var ROOT = 'projects/assignment-482806/assets/';
 var BASE_ASSET = ROOT + 'thanjavur_mlc_transfer_2020_frozen_chennai';
 var C_ASSET = ROOT + 'tnj_2020_experiment_C_quantile_align_v2';
 var REF_ASSET = ROOT + 'tnj_2020_reference_112_final_v1';
 var ROI_ASSET = ROOT + 'tnj_city_trace_pilot_roi_2020';
 var CRS = 'EPSG:32644';
 var SCALE = 30;
 var IDS = [1, 2, 3, 4, 5];
 var NAMES = ee.List(['Built-up', 'Vegetation', 'Water',
                      'Agricultural/Open', 'Barren/Fallow']);

 var roiFC = ee.FeatureCollection(ROI_ASSET);
 var roi = roiFC.geometry();
 var baseline = ee.Image(BASE_ASSET).select('mapped_class');
 var candidate = ee.Image(C_ASSET).select('experiment_C_class');
 var references = ee.FeatureCollection(REF_ASSET);

 // 1. Area estimates from the two maps (not reference areas).
 function mappedAreaDictionary(classified) {
   var output = ee.Image.pixelArea().rename('area_m2')
     .addBands(classified.rename('class_id'))
     .reduceRegion({
       reducer: ee.Reducer.sum().group({
         groupField: 1,
         groupName: 'class_id'
       }),
       geometry: roi,
       crs: CRS,
       scale: SCALE,
       maxPixels: 1e8,
       tileScale: 8
     });

   var groups = ee.List(output.get('groups'));
   return ee.Dictionary.fromLists(
     groups.map(function(g) {
       return ee.Number(ee.Dictionary(g).get('class_id')).format('%d');
     }),
     groups.map(function(g) {
       return ee.Dictionary(g).get('sum');
     })
   );
 }

 var aAreas = mappedAreaDictionary(baseline);
 var cAreas = mappedAreaDictionary(candidate);

 function summedArea(d) {
   return ee.Number(ee.List.sequence(1, 5).iterate(function(k, sum) {
     var key = ee.Number(k).format('%d');
     return ee.Number(sum).add(ee.Number(d.get(key, 0)));
   }, 0));
 }

 var totalA = summedArea(aAreas);
 var totalC = summedArea(cAreas);

 // 2. Same 112 original reference locations. 0 means missing map value.
 var compared = ee.Image.cat([
   baseline.unmask(0).rename('A_class'),
   candidate.unmask(0).rename('C_class')
 ]).sampleRegions({
   collection: references,
   properties: ['point_id', 'reference_class'],
   projection: ee.Projection(CRS),
   scale: SCALE,
   geometries: false,
   tileScale: 8
 }).map(function(f) {
   var actual = ee.Number(f.get('reference_class'));
   var a = ee.Number(f.get('A_class'));
   var c = ee.Number(f.get('C_class'));
   var ac = ee.Number(ee.Algorithms.If(actual.eq(a), 1, 0));
   var cc = ee.Number(ee.Algorithms.If(actual.eq(c), 1, 0));
   var difference = cc.subtract(ac);
   return f.set({
     A_correct: ac,
     C_correct: cc,
     paired_difference: difference,
     difference_squared: difference.multiply(difference)
   });
 });

 // 3. Per-baseline-stratum estimates and paired variance.
 // Approximate SE uses within-stratum sample variance, without
 // finite-population correction (conservative for tiny strata).
 var audit = ee.FeatureCollection(ee.List.sequence(1, 5).map(function(k) {
   k = ee.Number(k);
   var key = k.format('%d');
   var stratum = compared.filter(ee.Filter.eq('A_class', k));
   var n = stratum.size();
   var weight = ee.Number(aAreas.get(key, 0)).divide(totalA);
   var aCorrect = ee.Number(stratum.aggregate_sum('A_correct'));
   var cCorrect = ee.Number(stratum.aggregate_sum('C_correct'));
   var dSum = ee.Number(stratum.aggregate_sum('paired_difference'));
   var dSumSq = ee.Number(stratum.aggregate_sum('difference_squared'));
   var meanD = dSum.divide(n);
   var s2 = dSumSq.subtract(dSum.pow(2).divide(n))
     .divide(ee.Number(n).subtract(1)).max(0);
   var variancePart = weight.pow(2).multiply(s2).divide(n);
   var areaA = ee.Number(aAreas.get(key, 0));
   var areaC = ee.Number(cAreas.get(key, 0));

   return ee.Feature(null, {
     class_id: k,
     class_name: NAMES.get(k.subtract(1)),
     n: n,
     baseline_area_km2: areaA.divide(1e6),
     experiment_C_area_km2: areaC.divide(1e6),
     baseline_area_percent: areaA.divide(totalA).multiply(100),
     C_area_percent: areaC.divide(totalC).multiply(100),
     weight_from_baseline: weight,
     A_correct: aCorrect,
     C_correct: cCorrect,
     A_contribution: weight.multiply(aCorrect.divide(n)),
     C_contribution: weight.multiply(cCorrect.divide(n)),
     difference_pp_contribution: weight.multiply(meanD).multiply(100),
     paired_variance_contribution: variancePart
   });
 }));

 var oaA = ee.Number(audit.aggregate_sum('A_contribution'));
 var oaC = ee.Number(audit.aggregate_sum('C_contribution'));
 var delta = oaC.subtract(oaA);
 var se = ee.Number(audit.aggregate_sum('paired_variance_contribution')).sqrt();
 var lower = delta.subtract(se.multiply(1.96));
 var upper = delta.add(se.multiply(1.96));

 // 4. Lightweight QA and output.
 print('=========== FINAL A vs C AUDIT ===========');
 print('Reference count (expect 112):');
 print(references.size());
 print('Matched references (expect 112):');
 print(compared.size());
 print('Unique IDs (expect 112):');
 print(compared.aggregate_count_distinct('point_id'));
 print('Baseline mapped strata (expect 25,12,25,25,25):');
 print(compared.aggregate_histogram('A_class'));
 print('Missing C predictions (expect 0):');
 print(compared.filter(ee.Filter.eq('C_class', 0)).size());
 print('Mapped-class areas and paired comparison (5 rows):');
 print(audit);
 print('A area km2:');
 print(totalA.divide(1e6));
 print('C area km2:');
 print(totalC.divide(1e6));
 print('A weighted accuracy % (expect 23.1854):');
 print(oaA.multiply(100));
 print('C weighted accuracy % (expect 35.9444):');
 print(oaC.multiply(100));
 print('C minus A improvement in percentage points:');
 print(delta.multiply(100));
 print('Approximate paired difference SE in percentage points:');
 print(se.multiply(100));
 print('Approximate 95% paired difference CI in percentage points:');
 print(ee.List([lower.multiply(100), upper.multiply(100)]));
 print('Experiment C mapped vegetation area km2:');
 print(ee.Number(cAreas.get('2', 0)).divide(1e6));
 print('Experiment C mapped class 2 absent across ROI?');
 print(ee.Number(cAreas.get('2', 0)).eq(0));
 print('C confusion matrix (row=reference, col=prediction):');
 print(compared.errorMatrix('reference_class', 'C_class', [0,1,2,3,4,5]));

 Map.setOptions('SATELLITE');
 Map.centerObject(roiFC, 12);
 var colors = ['e31a1c', '33a02c', '1f78b4', 'ffb000', 'b15928'];
 Map.addLayer(baseline, {min:1,max:5,palette:colors}, 'A direct', false);
 Map.addLayer(candidate, {min:1,max:5,palette:colors}, 'C harmonised', true);
 Map.addLayer(roiFC.style({color:'ffffff', fillColor:'00000000',width:2}), {}, 'Pilot ROI');

 Export.table.toDrive({
   collection: audit,
   description: 'TNJ2020_A_C_FINAL_PAIRED_AUDIT',
   fileNamePrefix: 'TNJ2020_A_C_FINAL_PAIRED_AUDIT',
   fileFormat: 'CSV'
 });

 print('READ-ONLY: source model, maps and reference assets unchanged.');
 print('CI is exploratory: no spatial clustering or label-error correction.');

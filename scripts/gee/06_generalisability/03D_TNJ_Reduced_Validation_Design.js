
 // ============================================================
 // CHENNAI -> THANJAVUR GAUSSIAN MLC BENCHMARK
 //
 // STAGE 03D - REDUCED VALIDATION DESIGN V2
 //
 // INPUT:
 // 252 points, 55 manually labelled.
 //
 // TARGET:
 // Built-up          25
 // Vegetation        12
 // Water             25
 // Agricultural/Open 25
 // Barren/Fallow     25
 //
 // Total = 112
 //
 // No automatic labels used as reference truth.
 // No model training or modification.
 // ============================================================

 var ROOT = 'projects/assignment-482806/assets/';

 var CHECKPOINT =
   ROOT + 'tnj_2020_manual_checkpoint';

 var CLASSIFIED =
   ROOT + 'thanjavur_mlc_transfer_2020_frozen_chennai';

 var BLIND_OUT =
   ROOT + 'tnj_2020_blind_subsample_112_v2';

 var AUDIT_OUT =
   ROOT + 'tnj_2020_subsample_audit_112_v2';

 var CRS = 'EPSG:32644';
 var SCALE = 30;
 var SEED = 20261026;

 var CLASSES = [1, 2, 3, 4, 5];

 // ============================================================
 // 1. LOAD EXISTING CHECKPOINT
 // ============================================================

 var input = ee.FeatureCollection(CHECKPOINT);

 print('====================================');
 print('STAGE 03D V2 - INPUT QA');
 print('====================================');

 print('Original point count (expected 252):');
 print(input.size());

 print('Distinct point IDs (expected 252):');
 print(input.aggregate_count_distinct('point_id'));

 print('Reference class histogram:');
 print(input.aggregate_histogram('reference_class'));

 var initialManual = input.filter(
   ee.Filter.inList('reference_class', CLASSES)
 );

 print('Existing manual labels (expected 55):');
 print(initialManual.size());

 // ============================================================
 // 2. LOAD FROZEN THANJAVUR CLASSIFICATION
 // ============================================================

 var mapped = ee.Image(CLASSIFIED)
   .select('mapped_class');

 // Unmask with 0 so unavailable pixels are explicitly
 // flagged, rather than silently dropping locations.

 var safeMapped = mapped.unmask(0, false);

 // ============================================================
 // 3. EXTRACT MAPPED CLASS USING sampleRegions
 // ============================================================
 //
 // sampleRegions copies original reference attributes
 // and attaches the image band 'mapped_class'.
 //
 // Existing human reference labels are unchanged.
 // ============================================================

 var tagged = safeMapped.sampleRegions({

   collection: input,

   properties: [
     'point_id',
     'reference_class',
     'confidence',
     'evidence_notes',
     'reference_year',
     'sampling_design'
   ],

   projection: ee.Projection(CRS),

   scale: SCALE,

   geometries: true,

   tileScale: 8

 });

 print('====================================');
 print('MAPPED CLASS SAMPLING QA');
 print('====================================');

 print('Tagged point count (expected 252):');
 print(tagged.size());

 print('Mapped class histogram:');
 print(tagged.aggregate_histogram('mapped_class'));

 print('Points with mapped class 0 (expected 0):');
 print(
   tagged.filter(
     ee.Filter.eq('mapped_class', 0)
   ).size()
 );

 print('Points with valid mapped classes:');
 print(
   tagged.filter(
     ee.Filter.inList('mapped_class', CLASSES)
   ).size()
 );

 print('Distinct tagged point IDs:');
 print(
   tagged.aggregate_count_distinct('point_id')
 );

 // ============================================================
 // 4. RANDOM SELECTION FROM ORIGINAL POINT FRAME
 // ============================================================
 //
 // Sampling is independent of the actual reference label.
 // This avoids preferentially selecting easy/correct points.
 //
 // Random numbers use point_id for reproducibility.
 // ============================================================

 var eligible = tagged.filter(
   ee.Filter.inList('mapped_class', CLASSES)
 );

 var randomized = eligible.randomColumn(
   'audit_random',
   SEED,
   'uniform',
   ['point_id']
 );

 var selected = ee.FeatureCollection([]);

 CLASSES.forEach(function(k) {

   var required = (k === 2) ? 12 : 25;

   var group = randomized
     .filter(
       ee.Filter.eq('mapped_class', k)
     )
     .sort('audit_random')
     .limit(required);

   selected = selected.merge(group);

 });

 // ============================================================
 // 5. SUBSET QUALITY ASSURANCE
 // ============================================================

 print('====================================');
 print('REDUCED SUBSET QA');
 print('====================================');

 print('Selected total (expected 112):');
 print(selected.size());

 print('Selected mapped classes:');
 print(
   selected.aggregate_histogram('mapped_class')
 );

 print('Selected distinct point IDs:');
 print(
   selected.aggregate_count_distinct('point_id')
 );

 // ============================================================
 // 6. REUSE EXISTING HUMAN REFERENCE LABELS
 // ============================================================

 var completed = selected.filter(
   ee.Filter.inList('reference_class', CLASSES)
 );

 var toReview = selected.filter(
   ee.Filter.inList(
     'reference_class',
     [-1, -9]
   )
 );

 print('====================================');
 print('MANUAL REVIEW REQUIREMENTS');
 print('====================================');

 print('Previously reviewed labels retained:');
 print(completed.size());

 print('Additional manual labels required:');
 print(toReview.size());

 print('Reference class distribution of retained labels:');
 print(
   completed.aggregate_histogram('reference_class')
 );

 // ============================================================
 // 7. CREATE BLIND REFERENCE COLLECTION
 // ============================================================
 //
 // DO NOT expose mapped_class to the reviewer.
 //
 // Existing human labels remain saved.
 // Missing reference labels remain -1.
 // ============================================================

 var blind = selected.map(function(f) {

   var originalClass = ee.Number(
     f.get('reference_class')
   );

   var isReviewed = ee.List(CLASSES)
     .contains(originalClass);

   var reviewStatus = ee.String(
     ee.Algorithms.If(
       isReviewed,
       'MANUAL_COMPLETE',
       'TO_REVIEW'
     )
   );

   return ee.Feature(
     f.geometry(),
     {
       point_id: f.get('point_id'),

       reference_class: originalClass,

       confidence: f.get('confidence'),

       evidence_notes: f.get('evidence_notes'),

       reference_year: 2020,

       review_status: reviewStatus,

       selection_protocol:
         'random_stratified_seed_20261026',

       source:
         '2020 independent visual interpretation'
     }
   );

 }).sort('point_id');

 // ============================================================
 // 8. FINAL OUTPUT QA
 // ============================================================

 print('====================================');
 print('FINAL BLIND COLLECTION QA');
 print('====================================');

 print('Blind collection size (expected 112):');
 print(blind.size());

 print('Blind reference class histogram:');
 print(
   blind.aggregate_histogram('reference_class')
 );

 print('Review status histogram:');
 print(
   blind.aggregate_histogram('review_status')
 );

 // Do not call blind.first().propertyNames().
 // If a source collection is empty, first() is null.
 // The size diagnostics above reveal that condition.

 // ============================================================
 // 9. MAP DISPLAY
 // ============================================================

 var roi = ee.FeatureCollection(
   ROOT + 'tnj_city_trace_pilot_roi_2020'
 );

 Map.layers().reset();

 Map.setOptions('SATELLITE');

 Map.centerObject(roi, 12);

 Map.addLayer(
   blind.filter(
     ee.Filter.eq(
       'review_status',
       'MANUAL_COMPLETE'
     )
   ).style({
     color: '00ff00',
     pointSize: 5
   }),
   {},
   'Already Reviewed - Green',
   true
 );

 Map.addLayer(
   blind.filter(
     ee.Filter.eq(
       'review_status',
       'TO_REVIEW'
     )
   ).style({
     color: 'ffff00',
     pointSize: 5
   }),
   {},
   'Remaining Review - Yellow',
   true
 );

 Map.addLayer(
   roi.style({
     color: 'ffffff',
     fillColor: '00000000',
     width: 2
   }),
   {},
   'Thanjavur Pilot ROI',
   true
 );

 // ============================================================
 // 10. EXPORT BLIND REVIEW DATA
 // ============================================================

 Export.table.toAsset({
   collection: blind,
   description: 'TNJ_2020_BLIND_SUBSAMPLE_112_V2',
   assetId: BLIND_OUT
 });

 // Internal audit data retains mapped strata and
 // sampling information for future accuracy weighting.
 // Do not display it during reference interpretation.

 Export.table.toAsset({
   collection: selected,
   description: 'TNJ_2020_SUBSAMPLE_AUDIT_112_V2',
   assetId: AUDIT_OUT
 });

 // ============================================================
 // 11. FINAL
 // ============================================================

 print('====================================');
 print('STAGE 03D V2 FINISHED');
 print('====================================');

 print('Check all numeric QA results.');

 print('Required: 252 source points.');

 print('Required: 112 selected points.');

 print('Required: 12 vegetation + 25 per other class.');

 print('Required: selected manual + remaining = 112.');

 print('Only start Tasks exports after QA passes.');

 print('Keep the original 252-point asset unchanged.');

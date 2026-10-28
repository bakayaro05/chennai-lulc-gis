# Earth Engine curated execution and interpretation guide

This file is a **roadmap, not a one-click executable pipeline**. Source code is preserved exactly; individual scripts may need manual imports and existing remote assets. Never launch all exports automatically.

## Required access and fixed settings

- Google Earth Engine project `assignment-482806` and the study boundary `projects/assignment-482806/assets/chennai_admin_study_area_clean`.
- Original annual Landsat Collection 2 Level 2 inputs, cloud/saturation masks, SR scaling and nine-band predictor conventions described in `docs/CODE_MANUAL.md`.
- Chennai: EPSG:32644, 30 m, locked study area about 529.4508 km² vector; avoid confusing fixed raster-footprint area with vector area.
- Five-class Gaussian MLC is the **underlying** model; four-class maps combine classes 4 and 5 **only for reporting/application**.
- Source assets and validation points live remotely. A Git clone is not sufficient to run historical scripts.

## Recommended reading / checkpoint sequence

1. `01_foundation/`: inspect original 2025/2020 source logic. These multi-stage historical scripts should be treated as **read-first**; do not rerun their exports against locked assets.
2. `02_2015_mlc/`: manual training review -> consolidation -> targeted additions -> freeze training -> independent validation transfer/review/additions -> freeze validation -> Gaussian MLC -> materialised area statistics. Check imported `waterAdd2015`/`agriAdd2015` geometry and asset availability.
3. `03_2010_provisional/`: inspect manual native polygon source and label triage (`07D`/`07E`); `07F` selects 600 historical training points. Earlier `07G`/`07H`/`07H2` Landsat-5-only classification/validation is a **historical predecessor**, not the reported map. `07L` tests scarce Landsat 5 observations -> `07M` L5/L7 predictor -> `07N` read-only test -> `07O` export of **provisional** 2010 L5+L7 MLC -> `07P` CV -> `07Q` area QA -> historical discrepancy audits. **Do not substitute the older 05F1/06E1 branches.**
4. `04_four_class/`: verify recovered 2025 TIFF via `07AC4`, inspect `07AC` aggregation and validation, then `07AC5` asset exports, then `07AD` QA and `07AE` mask/area verification. `07AC4` has an optional export; do not enable it without checking asset collision. Completed four-class raster exports are documented in project history; these copies need not be rerun.
5. `05_fusion/`: examine `08G4B` as an **exploratory 2020 rule test**; then `08G9` and `08G10` for 2015 temporal, 2020 GAIA+WorldCover and 2025 GAIA+Dynamic World candidate assets; QA through `08G11`, `08G13`. `08G15` is 2010 read-only original/add-only/two-way **sensitivity**; Stage 11 defines sensitivity/export tasks without replacing the original 2010 reported map.
6. `06_generalisability/`: 2020 frozen Chennai MLC -> Thanjavur pilot ROI -> early blind manual review on 252 candidates (`03B`, historical) -> reduced and independently interpreted 112-point reference -> area-adjusted direct-transfer accuracy -> diagnostics -> B (source month matching) / C (quantile harmonisation) with fixed Gaussian parameters -> A/C paired audit. Coastal city screening is agreement with automatic WC/DW proxies, **not independently verified accuracy**.
7. `07_map_exports/`: report and GUI-oriented categorical/RGB exports, spectral indices and city benchmark maps. Exports generate tasks; *running code is not proof they completed*. Separate documented asset IDs from actual Drive outputs.

## Scientifically locked findings — for interpretation only

- Five-class original Gaussian OA: 2025 83.67%, 2020 86.33%, 2015 85.67%, provisional 2010 L5/L7 69.33% (300-point assessments in the project record). Do not substitute four-class OA: 2025 96.67%, 2020 95.67%, 2015 88.67%, 2010 81.00%.
- Retained 2015/2020/2025 fusion products are post-classification **candidate** outputs, not Gaussian retraining. 2010 two-way sensitivity was 71.33% versus original 69.33% but is not the reported baseline.
- Thanjavur frozen 2020 A/B/C area-adjusted OA: 23.1854%, 20.6625%, 35.9444%. C improves A by 12.7590 percentage points under exploratory sampling/uncertainty limitations. No local Gaussian retraining.
- Cuddalore/Nagapattinam/Thoothukudi 2020 automatic agreement figures must not be described as independently measured OA.
- No completed, approved 2005 historical classification established. No future prediction is within scope.

## Before executing a single script

1. Read its complete original source and linked entry in `docs/CODE_MANUAL.md`.
2. Confirm whether it is read-only, creates a task, or requires manually supplied geometries/checkpoints. A task declaration is **not** proof of task completion.
3. Check its actual input Earth Engine assets exist and match expected bands, class IDs, CRS and 30 m grid.
4. If an output asset path already exists, **do not start a conflicting export**. Prefer no reruns of completed locked products.
5. Review geometry-dependent scripts inside the GEE Code Editor. A `.js` extension does not magically restore Code Editor imported geometries.
6. Confirm validation independence, 30 m training exclusion and class sample denominators before reporting accuracy.
7. Save new experimental outputs to separate, versioned assets. Record the completed GEE task ID and output metadata in an explicit manifest.
8. Verify output masks, grid alignment, class map and class-area totals. Never silently treat class 5 naming across versions as identical without inspecting the source labels.

## Still requires human validation

- The actual completed GEE Tasks and asset metadata for all claimed exports.
- The earliest 2010 intermediate branch versus reported L5/L7 provisional lineage.
- Stage 7's local class-name variations (e.g. class 5 terminology) against the master palette.
- Whether manually imported geometries/point references are materialised and accessible.
- Syntax/runtime success of each standalone copied script; curation verifies byte identity but does not execute the code against GEE.

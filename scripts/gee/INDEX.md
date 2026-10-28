# Curated Earth Engine script collection

**62 selectively curated copies from 156 verified archived files.**

Each `.js` is **byte-for-byte identical** to its original under `archive/gee-original/`. Only its filename receives a `.js` extension and optional whitespace-normalisation. It is not a repaired or refactored program.

> **Do not run an entire folder or assume every file is standalone.** Some files require historical manual geometry imports, prior asset exports, fixed GEE project permissions, and active review before pressing Run/Start.

See [execution notes](EXECUTION_ORDER.md), [the manifest](../../docs/CURATED_GEE_MANIFEST.csv), and [the complete research code manual](../../docs/CODE_MANUAL.md).

## `01_foundation/`

| Curated file | Decision | Execution | Source-linked description |
|---|---|---|---|
| [`01_stage1_to_stage4_2025_master.js`](01_foundation/01_stage1_to_stage4_2025_master.js) | `BASELINE_SOURCE` | `REVIEW_ONLY` | 2025 source ROI Landsat preprocessing training and Gaussian MLC; multi-stage script; never rerun in bulk ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/01_stage1_to_stage4_2025_master)) |
| [`02_stage5_temporal_transfer.js`](01_foundation/02_stage5_temporal_transfer.js) | `BASELINE_SOURCE` | `REVIEW_ONLY` | 2025 to 2020 temporal screening and 2020 Gaussian MLC; inspect multiple task definitions first ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/02_stage5_temporal_transfer)) |
| [`03_2020_area_stats.js`](01_foundation/03_2020_area_stats.js) | `BASELINE_QA` | `READ_OR_EXPORT` | Reload saved 2020 classification and calculate mapped class areas ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/03_2020_area_stats)) |
| [`04_stage5_temporal_transfer_2015.js`](01_foundation/04_stage5_temporal_transfer_2015.js) | `HISTORICAL_PROVENANCE` | `MANUAL_SETUP` | 2020 to 2015 candidate screening; not a standalone completed 2015 export ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04_stage5_temporal_transfer_2015)) |

## `02_2015_mlc/`

| Curated file | Decision | Execution | Source-linked description |
|---|---|---|---|
| [`04A_2015_training_manual_review.js`](02_2015_mlc/04A_2015_training_manual_review.js) | `MANUAL_REFERENCE` | `READ_ONLY_QA` | 2015 one group at a time manual training review helper ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04A_2015_training_manual_review)) |
| [`04B_2015_training_consolidation.js`](02_2015_mlc/04B_2015_training_consolidation.js) | `MANUAL_REFERENCE` | `EXPORT_TASKS` | Consolidate approved 2015 training candidates and supplementary source assets ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04B_2015_training_consolidation)) |
| [`04C_2015_add_missing_training.js`](02_2015_mlc/04C_2015_add_missing_training.js) | `MANUAL_REFERENCE` | `MANUAL_SETUP` | 2015 targeted Water and Agricultural training additions; geometry imports required ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04C_2015_add_missing_training)) |
| [`04D_2015_finalize_training.js`](02_2015_mlc/04D_2015_finalize_training.js) | `BASELINE_SOURCE` | `EXPORT_TASKS` | Freeze and export independently reviewed 2015 training set ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04D_2015_finalize_training)) |
| [`04E_2015_validation_transfer.js`](02_2015_mlc/04E_2015_validation_transfer.js) | `MANUAL_REFERENCE` | `READ_ONLY_QA` | Independent 2020 to 2015 validation temporal screening after training lock ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04E_2015_validation_transfer)) |
| [`04F_2015_validation_manual_review.js`](02_2015_mlc/04F_2015_validation_manual_review.js) | `MANUAL_REFERENCE` | `READ_ONLY_QA` | Manual inspection helper for independent 2015 validation groups ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04F_2015_validation_manual_review)) |
| [`04G_2015_validation_consolidation.js`](02_2015_mlc/04G_2015_validation_consolidation.js) | `MANUAL_REFERENCE` | `READ_ONLY_QA` | Assemble reviewed 2015 validation candidates without changing training ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04G_2015_validation_consolidation)) |
| [`04H_2015_add_missing_validation.js`](02_2015_mlc/04H_2015_add_missing_validation.js) | `MANUAL_REFERENCE` | `MANUAL_SETUP` | Target class shortages in 2015 independent validation samples ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04H_2015_add_missing_validation)) |
| [`04I_2015_finalize_validation.js`](02_2015_mlc/04I_2015_finalize_validation.js) | `BASELINE_SOURCE` | `EXPORT_TASKS` | Freeze and export 2015 independent validation set ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04I_2015_finalize_validation)) |
| [`04J_2015_gaussian_mlc.js`](02_2015_mlc/04J_2015_gaussian_mlc.js) | `BASELINE_SOURCE` | `EXPORT_TASKS` | Five class true Gaussian MLC for 2015 with validation and result exports ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04J_2015_gaussian_mlc)) |
| [`04K_2015_area_statistics.js`](02_2015_mlc/04K_2015_area_statistics.js) | `BASELINE_QA` | `READ_OR_EXPORT` | 2015 mapped class area statistics using saved MLC image ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04K_2015_area_statistics)) |

## `03_2010_provisional/`

| Curated file | Decision | Execution | Source-linked description |
|---|---|---|---|
| [`07AB_FINAL_BUILTUP_DISCREPANCY_ATTRIBUTION_2010_2015.js`](03_2010_provisional/07AB_FINAL_BUILTUP_DISCREPANCY_ATTRIBUTION_2010_2015.js) | `BASELINE_QA` | `READ_ONLY_QA` | Read-only attribution of 2010 and 2015 Built-up class discrepancy ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AB_FINAL_BUILTUP_DISCREPANCY_ATTRIBUTION_2010_2015)) |
| [`07D_2010_all_classes_candidate_QA.js`](03_2010_provisional/07D_2010_all_classes_candidate_QA.js) | `MANUAL_REFERENCE` | `READ_ONLY_QA` | 2010 manual 28-polygon candidate QA; requires existing native training polygons asset; does not export it ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07D_2010_all_classes_candidate_QA)) |
| [`07E_2010_manual_label_triage.js`](03_2010_provisional/07E_2010_manual_label_triage.js) | `MANUAL_REFERENCE` | `READ_ONLY_QA` | Inspect 2010 polygon candidate labels before 07F 600-point balanced sample; does not auto-approve labels ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07E_2010_manual_label_triage)) |
| [`07F_2010_manual_balanced_training_v1.js`](03_2010_provisional/07F_2010_manual_balanced_training_v1.js) | `MANUAL_REFERENCE` | `EXPORT_TASKS` | 600 balanced 2010 training locations from manually interpreted polygons ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07F_2010_manual_balanced_training_v1)) |
| [`07G_2010_manual_Gaussian_MLC_v1.js`](03_2010_provisional/07G_2010_manual_Gaussian_MLC_v1.js) | `HISTORICAL_PREDECESSOR` | `EXPORT_TASKS` | Initial manual Landsat-5-only 2010 Gaussian MLC precursor; not final provisional L5+L7 reported map ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07G_2010_manual_Gaussian_MLC_v1)) |
| [`07H2_2010_site_heldout_CV.js`](03_2010_provisional/07H2_2010_site_heldout_CV.js) | `HISTORICAL_PREDECESSOR` | `READ_ONLY_QA` | Five-fold training-site held-out cross validation of earlier 2010 manual model; distinct from independent validation ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07H2_2010_site_heldout_CV)) |
| [`07H_Independent_Accuracy_Assessment.js`](03_2010_provisional/07H_Independent_Accuracy_Assessment.js) | `HISTORICAL_PREDECESSOR` | `READ_ONLY_QA` | Independent 300-point assessment of initial 2010 manual Landsat-5-only model; not the L5+L7 baseline accuracy ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07H_Independent_Accuracy_Assessment)) |
| [`07L_2010_L5_L7_clear_observation_feasibility.js`](03_2010_provisional/07L_2010_L5_L7_clear_observation_feasibility.js) | `BASELINE_QA` | `READ_ONLY_QA` | Diagnose extra clear 2010 Landsat 7 support before changing predictor stack ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07L_2010_L5_L7_clear_observation_feasibility)) |
| [`07M_2010_L5L7_experimental_stack.js`](03_2010_provisional/07M_2010_L5L7_experimental_stack.js) | `BASELINE_SOURCE` | `EXPORT_TASKS` | Generate 2010 Landsat 5 plus 7 nine band experimental predictor asset ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07M_2010_L5L7_experimental_stack)) |
| [`07N_2010_L5L7_Gaussian_MLC_test.js`](03_2010_provisional/07N_2010_L5L7_Gaussian_MLC_test.js) | `BASELINE_QA` | `READ_ONLY_QA` | Test frozen Gaussian MLC on L5 plus L7 re-extracted sample signatures ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07N_2010_L5L7_Gaussian_MLC_test)) |
| [`07O_2010_L5L7_MLC_export_exp_v1.js`](03_2010_provisional/07O_2010_L5L7_MLC_export_exp_v1.js) | `PROVISIONAL_BASELINE` | `EXPORT_TASKS` | Export 2010 L5 plus L7 training and officially reported provisional five class raster ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07O_2010_L5L7_MLC_export_exp_v1)) |
| [`07P_2010_L5L7_site_heldout_CV.js`](03_2010_provisional/07P_2010_L5L7_site_heldout_CV.js) | `BASELINE_QA` | `READ_ONLY_QA` | Site held-out cross-validation of 2010 L5 plus L7 model; not independent map accuracy ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07P_2010_L5L7_site_heldout_CV)) |
| [`07Q_2010_L5L7_spatial_area_audit.js`](03_2010_provisional/07Q_2010_L5L7_spatial_area_audit.js) | `BASELINE_QA` | `READ_ONLY_QA` | Read-only 2010 L5 plus L7 spatial extent area and reference audit ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07Q_2010_L5L7_spatial_area_audit)) |
| [`07R_2010_2015_cross_year_plausibility.js`](03_2010_provisional/07R_2010_2015_cross_year_plausibility.js) | `BASELINE_QA` | `READ_ONLY_QA` | Historical 2010 to 2015 plausibility checks; not direct urban change proof ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07R_2010_2015_cross_year_plausibility)) |

## `04_four_class/`

| Curated file | Decision | Execution | Source-linked description |
|---|---|---|---|
| [`07AC4_VERIFY_RECOVERED_2025_TIFF.js`](04_four_class/07AC4_VERIFY_RECOVERED_2025_TIFF.js) | `BASELINE_QA` | `READ_OR_EXPORT` | Verify restored original 2025 five-class TIFF and derived four-class aggregation; has optional export disabled by default ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/07AC4_VERIFY_RECOVERED_2025_TIFF)) |
| [`07AD_FINAL_POST_EXPORT_FOUR_CLASS_QA.js`](04_four_class/07AD_FINAL_POST_EXPORT_FOUR_CLASS_QA.js) | `LOCKED_REPORTING` | `READ_ONLY_QA` | Post-export comparison of original and four class rasters and masks ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/07AD_FINAL_POST_EXPORT_FOUR_CLASS_QA)) |
| [`07AE.js`](04_four_class/07AE.js) | `LOCKED_REPORTING` | `READ_ONLY_QA` | Diagnose mapped pixel area reduction and mask accounting ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/07AE)) |
| [`07AC5_FINAL_FOUR_CLASS_EXPORT_ALL_YEARS.js`](04_four_class/07AC5_FINAL_FOUR_CLASS_EXPORT_ALL_YEARS.js) | `LOCKED_REPORTING` | `EXPORT_TASKS` | Four class classification asset exports for 2010 2015 2020 and 2025 ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AC5_FINAL_FOUR_CLASS_EXPORT_ALL_YEARS)) |
| [`07AC_FOUR_CLASS_AGGREGATION_QA_AND_EXPORT.js`](04_four_class/07AC_FOUR_CLASS_AGGREGATION_QA_AND_EXPORT.js) | `LOCKED_REPORTING` | `READ_OR_EXPORT` | Aggregate original class 4 and 5 for four class reporting and assess change ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AC_FOUR_CLASS_AGGREGATION_QA_AND_EXPORT)) |

## `05_fusion/`

| Curated file | Decision | Execution | Source-linked description |
|---|---|---|---|
| [`08G10_Export_Three_Fusion_Candidates.js`](05_fusion/08G10_Export_Three_Fusion_Candidates.js) | `FUSION_CANDIDATE` | `EXPORT_TASKS` | Export three distinct 2015 2020 2025 retained fusion candidate assets ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G10_Export_Three_Fusion_Candidates)) |
| [`08G11_Analysis_A_B_GHSL_Comparison.js`](05_fusion/08G11_Analysis_A_B_GHSL_Comparison.js) | `FUSION_QA` | `READ_ONLY_QA` | Read-only fusion area and GHSL built surface comparison at different native scales ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G11_Analysis_A_B_GHSL_Comparison)) |
| [`08G13_Analysis_A_Corrected_2010_Final_QA.js`](05_fusion/08G13_Analysis_A_Corrected_2010_Final_QA.js) | `FUSION_QA` | `READ_ONLY_QA` | Correct original 2010 asset selection and audit 2010 versus 2015 2020 2025 ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G13_Analysis_A_Corrected_2010_Final_QA)) |
| [`08G15_2010_GAIA_GHSL_Temporal_Fusion_Comparison.js`](05_fusion/08G15_2010_GAIA_GHSL_Temporal_Fusion_Comparison.js) | `SENSITIVITY_ONLY` | `READ_ONLY_QA` | Read-only 2010 original add only and two-way GAIA GHSL temporal fusion comparison ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G15_2010_GAIA_GHSL_Temporal_Fusion_Comparison)) |
| [`08G4B_2020_Conservative_Builtup_Fusion.js`](05_fusion/08G4B_2020_Conservative_Builtup_Fusion.js) | `FUSION_QA` | `READ_ONLY_QA` | Read-only conservative GAIA plus WorldCover built-up correction experiment informing 2020 retained fusion ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G4B_2020_Conservative_Builtup_Fusion)) |
| [`08G8_2025_GAIA_DW_PairedValidation.js`](05_fusion/08G8_2025_GAIA_DW_PairedValidation.js) | `FUSION_QA` | `READ_ONLY_QA` | 2025 GAIA and Dynamic World paired validation using recreated sample not identical archive points ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G8_2025_GAIA_DW_PairedValidation)) |
| [`08G9_2015_Temporal_Consistency_Fusion.js`](05_fusion/08G9_2015_Temporal_Consistency_Fusion.js) | `FUSION_CANDIDATE` | `READ_ONLY_QA` | Construct 2015 temporal consistency fusion in memory for comparisons ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G9_2015_Temporal_Consistency_Fusion)) |
| [`11_CHENNAI_STAGE08G15_RECOVER_2010_FUSION_AND_EXPORT_FIVE_LULC_MAPS.js`](05_fusion/11_CHENNAI_STAGE08G15_RECOVER_2010_FUSION_AND_EXPORT_FIVE_LULC_MAPS.js) | `SENSITIVITY_ONLY` | `EXPORT_TASKS` | Reconstruct sensitivity and export four reported time series maps plus additional 2010 alternative ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/11_CHENNAI_STAGE08G15_RECOVER_2010_FUSION_AND_EXPORT_FIVE_LULC_MAPS)) |

## `06_generalisability/`

| Curated file | Decision | Execution | Source-linked description |
|---|---|---|---|
| [`00_TNJ_City_ROI.js`](06_generalisability/00_TNJ_City_ROI.js) | `EXTERNAL_BENCHMARK` | `EXPORT_TASKS` | Create approximate screenshot traced Thanjavur pilot ROI; not official municipal boundary ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/00_TNJ_City_ROI)) |
| [`01_TNJ_2020_Frozen_MLC.js`](06_generalisability/01_TNJ_2020_Frozen_MLC.js) | `EXTERNAL_BENCHMARK` | `EXPORT_TASKS` | Transfer frozen 2020 Chennai five class Gaussian model to Thanjavur with no local training ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/01_TNJ_2020_Frozen_MLC)) |
| [`02_TNJ_2020_Reference_Points.js`](06_generalisability/02_TNJ_2020_Reference_Points.js) | `MANUAL_REFERENCE` | `READ_OR_EXPORT` | Initial stratified candidate target reference point locations; later 112 point review is definitive ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/02_TNJ_2020_Reference_Points)) |
| [`03A_TNJ_Freeze_Reference_Points.js`](06_generalisability/03A_TNJ_Freeze_Reference_Points.js) | `MANUAL_REFERENCE` | `EXPORT_TASKS` | Freeze blind target reference coordinates before human image interpretation ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03A_TNJ_Freeze_Reference_Points)) |
| [`03B_TNJ_2020_Reference_Reviewer.js`](06_generalisability/03B_TNJ_2020_Reference_Reviewer.js) | `MANUAL_REFERENCE` | `MANUAL_SETUP` | Historical blind human review of 2020 Thanjavur 252 candidate locations; manual labels and progress management ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03B_TNJ_2020_Reference_Reviewer)) |
| [`03D_TNJ_Reduced_Validation_Design.js`](06_generalisability/03D_TNJ_Reduced_Validation_Design.js) | `EXTERNAL_BENCHMARK` | `EXPORT_TASKS` | Prespecified 112 point target reference subset with predicted class strata ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03D_TNJ_Reduced_Validation_Design)) |
| [`03E_TNJ_2020_Review_Remaining_91.js`](06_generalisability/03E_TNJ_2020_Review_Remaining_91.js) | `MANUAL_REFERENCE` | `MANUAL_SETUP` | Finish independent manual 112 point reference interpretation from checkpoints ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03E_TNJ_2020_Review_Remaining_91)) |
| [`04_TNJ_2020_Final_Accuracy_Benchmark.js`](06_generalisability/04_TNJ_2020_Final_Accuracy_Benchmark.js) | `EXTERNAL_BENCHMARK` | `READ_OR_EXPORT` | Calculate area adjusted accuracy on 112 independently reviewed target locations ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/04_TNJ_2020_Final_Accuracy_Benchmark)) |
| [`05A2_V3_Monthly_Spectral_Extraction.js`](06_generalisability/05A2_V3_Monthly_Spectral_Extraction.js) | `EXTERNAL_BENCHMARK` | `READ_OR_EXPORT` | Corrected month level 2020 Landsat spectral and observation extraction ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/05A2_V3_Monthly_Spectral_Extraction)) |
| [`05A_TNJ_Spectral_Transfer_Diagnostics.js`](06_generalisability/05A_TNJ_Spectral_Transfer_Diagnostics.js) | `EXTERNAL_BENCHMARK` | `READ_OR_EXPORT` | Diagnose baseline model parity and Chennai to Thanjavur spectral shifts ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/05A_TNJ_Spectral_Transfer_Diagnostics)) |
| [`06B_TNJ_2020_Source_Month_Matching.js`](06_generalisability/06B_TNJ_2020_Source_Month_Matching.js) | `EXTERNAL_BENCHMARK` | `EXPORT_TASKS` | Experiment B target scene month matching with frozen Gaussian parameters ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/06B_TNJ_2020_Source_Month_Matching)) |
| [`06C_TNJ_2020_Quantile_Harmonisation_V2.js`](06_generalisability/06C_TNJ_2020_Quantile_Harmonisation_V2.js) | `EXTERNAL_BENCHMARK` | `EXPORT_TASKS` | Experiment C unlabeled quantile spectral adaptation with frozen Gaussian parameters ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/06C_TNJ_2020_Quantile_Harmonisation_V2)) |
| [`07_TNJ_Final_Transfer_Audit.js`](06_generalisability/07_TNJ_Final_Transfer_Audit.js) | `EXTERNAL_BENCHMARK` | `READ_OR_EXPORT` | Read-only paired A versus C audit and approximation to uncertainty ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/07_TNJ_Final_Transfer_Audit)) |
| [`08_TN_Closest_Spectral_City_Frozen_MLC_Auto_Proxy_2020.js`](06_generalisability/08_TN_Closest_Spectral_City_Frozen_MLC_Auto_Proxy_2020.js) | `AUTO_PROXY_SCREEN` | `EXPORT_TASKS` | Select coastal pilot from unlabeled spectra and calculate external product agreement ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/08_TN_Closest_Spectral_City_Frozen_MLC_Auto_Proxy_2020)) |
| [`STAGE_09_AUTOMATED_FROZEN_MLC_TRANSFER_BENCHMARK.js`](06_generalisability/STAGE_09_AUTOMATED_FROZEN_MLC_TRANSFER_BENCHMARK.js) | `AUTO_PROXY_SCREEN` | `EXPORT_TASKS` | Run Nagapattinam and Thoothukudi frozen transfer with automated proxy agreement ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/STAGE_09%20_AUTOMATED_FROZEN_MLC_TRANSFER_BENCHMARK)) |

## `07_map_exports/`

| Curated file | Decision | Execution | Source-linked description |
|---|---|---|---|
| [`08_REPORT_NDVI_NDWI_NDBI_ALL_YEARS.js`](07_map_exports/08_REPORT_NDVI_NDWI_NDBI_ALL_YEARS.js) | `DISPLAY_EXPORT` | `READ_OR_EXPORT` | Export or preview seasonal full-year indices for report and maps ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/08_REPORT_NDVI_NDWI_NDBI_ALL_YEARS)) |
| [`export_final4_to_drive.js`](07_map_exports/export_final4_to_drive.js) | `DISPLAY_EXPORT` | `EXPORT_TASKS` | Export final four class categorical GeoTIFF rasters for React FastAPI viewer ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/export_final4_to_drive.js)) |
| [`export_historical_satellite_rgb.js`](07_map_exports/export_historical_satellite_rgb.js) | `DISPLAY_EXPORT` | `EXPORT_TASKS` | Export annual historical Landsat RGB display rasters; does not change classification ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/export_historical_satellite_rgb)) |
| [`07C2_export_locked_ROI.js`](07_map_exports/07C2_export_locked_ROI.js) | `DISPLAY_EXPORT` | `EXPORT_TASKS` | Export locked ROI boundary for mapping and the interactive viewer ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07C2_export_locked_ROI)) |
| [`10_EXPORT_ALL_SIX_FROZEN_MLC_LULC_MAPS_TO_DRIVE.js`](07_map_exports/10_EXPORT_ALL_SIX_FROZEN_MLC_LULC_MAPS_TO_DRIVE.js) | `DISPLAY_EXPORT` | `EXPORT_TASKS` | Export 6 five class frozen transfer benchmark maps plus selected supporting data ([original](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/10_EXPORT_ALL_SIX_FROZEN_MLC_LULC_MAPS_TO_DRIVE)) |

## Decision labels

- `BASELINE_SOURCE` / `PROVISIONAL_BASELINE`: historical source of the reported model; not permission to rerun.
- `LOCKED_REPORTING`: four-class **derived** product, not a second independently trained classifier.
- `FUSION_CANDIDATE`: retained post-classification candidate, does not replace original MLC.
- `SENSITIVITY_ONLY`: 2010 two-way fusion is **not** the official 2010 baseline.
- `EXTERNAL_BENCHMARK`: frozen five-class model transferred to Thanjavur; target reference separately assessed.
- `AUTO_PROXY_SCREEN`: automatic reference-product *agreement*, not ground-truth accuracy.
- `MANUAL_REFERENCE`: historical manual screening or label-review provenance, often not standalone.
- `HISTORICAL_PREDECESSOR`: earlier method/assessment used to motivate the retained alternative; not a replacement for the reported version.
- `BASELINE_QA`, `FUSION_QA`, `DISPLAY_EXPORT`, `HISTORICAL_PROVENANCE`: as described; review the source first.

## What is intentionally not curated?

Earlier 05/06 and several Stage 7 2010 alternatives, RF replacements, SNIC exploratory experiments, earlier Thanjavur reviewer versions and any unverified 2005 output remain in the complete, unchanged 156-file archive. They are documented by `docs/CODE_MANUAL.md`; omitting them from this shortlist does **not** mean they never contributed to research decisions.


# Chennai GIS — Per-script code-scan catalogue

**Status:** Automatically extracted from locally archived source; it is NOT a full scientific review.
**Preservation:** Source scripts are read-only to this generator.
**Counts:** 156 archived files. **Expected from upstream snapshot:** 156.

## How to read this catalogue

Source-header excerpts come from each file itself. Asset mentions and export calls are located by static pattern scanning. A referenced asset may be an input, candidate output, explanatory comment, or dead code; do not claim it was created or executed without verifying the original code and Earth Engine task/asset.
Labels such as "final" or "exploratory" describe wording found in the source, **not an independently validated adoption decision**.
Some scripts have misleading names, duplicate versions, no file extensions or dynamic asset identifiers. The full original path is authoritative.

## Summary by category

| Category | Files |
|---|---:|
| 2010 training, validation and Gaussian MLC | 40 |
| 2015 training, validation and Gaussian MLC | 12 |
| Cross-stage tools and exports | 12 |
| Foundation: study area, predictors and 2020/2025 | 3 |
| Out-of-region generalisability | 21 |
| Stage 07: historical MLC and four-class reporting | 39 |
| Stage 08: diagnosis and post-classification fusion | 29 |

## Source-derived file entries

### 2010 training, validation and Gaussian MLC

#### [`05A_2010_transfer_harmonization_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05A_2010_transfer_harmonization_QA)

**Source-described purpose:** 05A_2010_transfer_harmonization_QA — Chennai Multi-Temporal LULC Project — PURPOSE.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2015_final`, `chennai_transfer_2015_to_2010_QA_05A`.
**External dataset IDs (where statically detected):** `LANDSAT/LT05/C02/T1_L2`, `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `05A_2015_to_2010_transfer_QA`, `projects/assignment-482806/assets/chennai_transfer_2015_to_2010_QA_05A`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `8dbb42ef9038941df257bace319dca842ff9ba89f16353ef1acfae32d94c7863` · 2039 lines.

#### [`05B_2010_automated_training`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05B_2010_automated_training)

**Source-described purpose:** 05B_2010_automated_training — Chennai Multi-Temporal LULC Project — PURPOSE.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 2 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_training_2010_final`, `chennai_2010_passB_candidates_05B`.
**External dataset IDs (where statically detected):** `LANDSAT/LT05/C02/T1_L2`.
**Output/export arguments (where statically detected):** `chennai_training_2010_final`, `//     'projects/assignment-482806/assets/chennai_training_2010_final`, `chennai_2010_passB_candidates_05B`, `projects/assignment-482806/assets/chennai_2010_passB_candidates_05B`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `1de9adfce7762d342003c4ef43a9d0453d58c607699ce99588ba188d034b1c47` · 2149 lines.

#### [`05B_export_only_restricted_mode`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05B_export_only_restricted_mode)

**Source-described purpose:** 05B_export_only_restricted_mode — Chennai Multi-Temporal LULC Project — RESTRICTED-MODE VERSION.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_2010_passB_candidates_05B`.
**External dataset IDs (where statically detected):** `LANDSAT/LT05/C02/T1_L2`.
**Output/export arguments (where statically detected):** `chennai_2010_passB_candidates_05B`, `projects/assignment-482806/assets/chennai_2010_passB_candidates_05B`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `0827f7cc5057912d1ebf4fe54cceefb3255a8bbd4b6d66a952be121c252cd938` · 1021 lines.

#### [`05C0_2010_materialize_predictor_stack`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C0_2010_materialize_predictor_stack)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05C0 — MATERIALIZE LOCKED 2010 PREDICTOR + QA STACK.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`.
**External dataset IDs (where statically detected):** `LANDSAT/LT05/C02/T1_L2`.
**Output/export arguments (where statically detected):** `chennai_predictor_stack_2010`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `34a51fe781d52727250b7cf865efa386c878feb724d39c6f442c825cb20a1bc4` · 473 lines.

#### [`05C1_2010_reQA_passB_candidates`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C1_2010_reQA_passB_candidates)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05C1 — RE-QA EXISTING 05B CANDIDATES USING THE AUTHORITATIVE.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_2010_passB_candidates_05B`, `chennai_2010_passB_reQA_05C1`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_2010_passB_reQA_05C1`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `25b44c45a8e27dd0779196683470fa2ac48642e8ad6734cb91857a76e1b46e48` · 1341 lines.

#### [`05C2A_2010_rescue_uncertain_anchors`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C2A_2010_rescue_uncertain_anchors)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05C2A — RESCUE 05A UNCERTAIN ANCHORS USING AUTHORITATIVE.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_2010_rescued_uncertain_05C2A`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_2010_rescued_uncertain_05C2A`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `5f9febd1eff6bb88ca1b0f38cf966f357e4b7a06f85ae7810dbf54a1dff7cbd0` · 1116 lines.

#### [`05C2B_2010_candidate_diversity_and_failure_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C2B_2010_candidate_diversity_and_failure_QA)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05C2B — 2010 CANDIDATE DIVERSITY + FAILURE DIAGNOSTICS.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_rescued_uncertain_05C2A`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `7a2eabe2565634cd6e72b1743e0b4d74c0ca1a8d77310e3a821dd4ad614c6772` · 1984 lines.

#### [`05C3A_2010_targeted_expansion_60m_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C3A_2010_targeted_expansion_60m_QA)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05C3A — TARGETED 60 m EXPANSION USING THE AUTHORITATIVE 2010 STACK.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_rescued_uncertain_05C2A`, `chennai_2010_targeted_expansion_05C3A`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_2010_targeted_expansion_05C3A`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `c64132aa30253d98b4a8c256a1420ed683d2485f075024ccb163caec51278be5` · 1575 lines.

#### [`05C3B_2010_barren_targeted_expansion_90m_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C3B_2010_barren_targeted_expansion_90m_QA)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05C3B — BARREN/FALLOW TARGETED 90 m EXPANSION QA.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_rescued_uncertain_05C2A`, `chennai_2010_targeted_expansion_05C3A`, `chennai_2010_barren_expansion_90m_05C3B`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_2010_barren_expansion_90m_05C3B`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `895141d91ac04ebd62ecad321d980c041959ed54ddfa88d53280f6d3a332c4b3` · 1185 lines.

#### [`05C4A_2010_manual_barren_review`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C4A_2010_manual_barren_review)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05C4A — MANUAL 2010 BARREN/FALLOW REVIEW.
**Static code indicators:** validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_rescued_uncertain_05C2A`, `chennai_2010_targeted_expansion_05C3A`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `149f3e427737d1d07ab5b99a41b32e7cc1d5d2e5ec26953629ac2c9a88693e22` · 422 lines.

#### [`05C4B_2010_manual_barren_sampling_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C4B_2010_manual_barren_sampling_QA)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05C4B — MANUAL BARREN/FALLOW POLYGON SAMPLING + QA.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_rescued_uncertain_05C2A`, `chennai_2010_targeted_expansion_05C3A`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `8322fadfe91a264dc49910560b2b5e016101a80cdc870bbdeee0e70266b6f821` · 1622 lines.

#### [`05C4C_2010_manual_barren_visual_review05C4C_2010_manual_barren_visual_review`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C4C_2010_manual_barren_visual_review05C4C_2010_manual_barren_visual_review)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05C4C — MANUAL BARREN/FALLOW VISUAL REVIEW.
**Static code indicators:** requires-human-review; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_rescued_uncertain_05C2A`, `chennai_2010_targeted_expansion_05C3A`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `4275d24f2366fc890396e739d82226200992ee00ecbff8068fa753d280c784f1` · 455 lines.

#### [`05C4D_2010_polygon304_final_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C4D_2010_polygon304_final_QA)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05C4D — POLYGON 304 FINAL MANUAL-BARREN QA.
**Static code indicators:** final/locked-mentioned; 0 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_rescued_uncertain_05C2A`, `chennai_2010_targeted_expansion_05C3A`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `b8405a34b7c5bcf40a907ee148138a2dc9c28e0e6546e1bd633f1ea40fe0aef7` · 1124 lines.

#### [`05C4E_2010_manual_barren_select_export`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C4E_2010_manual_barren_select_export)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05C4E — SELECT + MATERIALIZE 61 MANUAL BARREN/FALLOW PIXELS.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_rescued_uncertain_05C2A`, `chennai_2010_targeted_expansion_05C3A`, `chennai_2010_manual_barren_05C4E`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_2010_manual_barren_05C4E`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `17d82542f76b69fd8a09db014991e2dc02a2d112792704f1da07d74185d30968` · 1096 lines.

#### [`05D1_2010_final_training_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05D1_2010_final_training_QA)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05D1 — FINAL 2010 TRAINING CONSTRUCTION + QA.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_rescued_uncertain_05C2A`, `chennai_2010_targeted_expansion_05C3A`, `chennai_2010_manual_barren_05C4E`, `chennai_2010_training_candidate_05D1`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_2010_training_candidate_05D1`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `173f8abf84fdb3c3dd432525675e782f260c5efc1f8c098355765949a585ce96` · 1357 lines.

#### [`05D2_2010_finalize_training`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05D2_2010_finalize_training)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05D2 — FINALIZE / PROMOTE 2010 TRAINING.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_2010_training_candidate_05D1`, `chennai_training_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_training_2010_final`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `f18328573a12473cf7bc1dc40586ea8c2e2a0246f3e9bed48ca1cc52ac856d4f` · 360 lines.

#### [`05E1_2010_validation_transfer_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05E1_2010_validation_transfer_QA)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05E1 — 2015 -> 2010 INDEPENDENT VALIDATION TRANSFER QA.
**Static code indicators:** final/locked-mentioned, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_validation_2015_final`, `chennai_predictor_stack_2010`, `chennai_training_2010_final`, `chennai_validation_transfer_2015_to_2010_QA_05E1`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `chennai_validation_transfer_2015_to_2010_QA_05E1`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `98bec0a46486427e8e6be3987cb398b94093e9cf67eba6d82537918081f35ee3` · 2184 lines.

#### [`05E2A_2010_manual_validation_review`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05E2A_2010_manual_validation_review)

**Source-described purpose:** No useful introductory comments; manual code review required.
**Static code indicators:** final/locked-mentioned, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`, `chennai_training_2010_final`, `chennai_validation_transfer_2015_to_2010_QA_05E1`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `85ce49788cf026bfc5c76b1d6f3568deabcad55c6c27019049225cc263f6925c` · 787 lines.

#### [`05E2B_2010_manual_validation_sampling_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05E2B_2010_manual_validation_sampling_QA)

**Source-described purpose:** No useful introductory comments; manual code review required.
**Static code indicators:** final/locked-mentioned, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_training_2010_final`, `chennai_validation_transfer_2015_to_2010_QA_05E1`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `1f181ede24be30a080bfb7e0b15b518ecf76c811282dbbdca1fcd3ea494118aa` · 1385 lines.

#### [`05E2C_2010_finalize_validation_candidate`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05E2C_2010_finalize_validation_candidate)

**Source-described purpose:** No useful introductory comments; manual code review required.
**Static code indicators:** final/locked-mentioned, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_training_2010_final`, `chennai_validation_transfer_2015_to_2010_QA_05E1`, `chennai_2010_validation_candidate_05E2C`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_2010_validation_candidate_05E2C`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `0f975b4c00e5002bcfd7e630e0eb6c91e6e4b0c045a6d571687c9f78be8290cb` · 1616 lines.

#### [`05E2D_2010_finalize_validation`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05E2D_2010_finalize_validation)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05E2D — FINALIZE / PROMOTE 2010 INDEPENDENT VALIDATION.
**Static code indicators:** final/locked-mentioned, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_2010_validation_candidate_05E2C`, `chennai_training_2010_final`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_validation_2010_final`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `33789e01a303f0eeea199ad51b0cdfa16d5bc8c66e59353377ae160081c328f1` · 485 lines.

#### [`05F1_2010_gaussian_MLC_validation`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05F1_2010_gaussian_MLC_validation)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05F1 — 2010 ACTUAL GAUSSIAN MAXIMUM LIKELIHOOD CLASSIFICATION.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_training_2010_final`, `chennai_validation_2010_final`, `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2010`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_mlc_lulc_2010`, `OUTPUT_CLASSIFICATION_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `f02117035dcbc1a81031a35610d9a629610e2c1af933c3b67194ef574521bb73` · 1380 lines.

#### [`05F1A_2010_MLC_training_sanity_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05F1A_2010_MLC_training_sanity_QA)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05F1 — 2010 ACTUAL GAUSSIAN MAXIMUM LIKELIHOOD CLASSIFICATION.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_training_2010_final`, `chennai_validation_2010_final`, `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2010`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `6ddd3d327b4617a322cef2b151c1f4abdfa42d213b2a72ca077ce4e65f270699` · 1252 lines.

#### [`05F1B_2010_classification_export_only`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05F1B_2010_classification_export_only)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05F1B — 2010 GAUSSIAN MLC — CLASSIFICATION EXPORT ONLY.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`, `chennai_training_2010_final`, `chennai_mlc_lulc_2010`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_mlc_lulc_2010`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `685642424fc4e66fe5ff1f5300bd75ca8789a21b13a306a7274fd4004ecd8de4` · 753 lines.

#### [`05G_2010_materialized_classification_QA_and_area`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05G_2010_materialized_classification_QA_and_area)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 05G — 2010 MATERIALIZED CLASSIFICATION QA + AREA STATISTICS.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_mlc_lulc_2010`, `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `4fc5f0219cd1027802ad82fcbc0f1ddebcd7275bdda10980a8517c6d8bacebf8` · 868 lines.

#### [`06A_2010_lock_manual_validation_polygons_V2`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06A_2010_lock_manual_validation_polygons_V2)

**Source-described purpose:** No useful introductory comments; manual code review required.
**Static code indicators:** final/locked-mentioned, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** None matched by scanner.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_validation_polygons_2010_manual_master`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `d19498647db943a3b8e4f0220a4be25eb960866cb199d4adb20e7701748d7d6d` · 456 lines.

#### [`06B_2010_manual_training_review_V2`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06B_2010_manual_training_review_V2)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 06B — 2010 MANUAL / SEMI-MANUAL TRAINING REVIEW V2.
**Static code indicators:** validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `856a7386395bd7033fe10cc898b0d2cde17c760d16e876dbd78ec920447fa51d` · 1466 lines.

#### [`06C2_2010_manual_consolidation_QA_FINAL`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06C2_2010_manual_consolidation_QA_FINAL)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 06C2 — 2010 V2 MANUAL TRAINING CONSOLIDATION QA — FINAL CORRECTED LEDGER.
**Static code indicators:** final/locked-mentioned, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `ed165e7c9b8927d8830b462bb6750c81a7926e0b3ea02c8679912fd9c52d4a0a` · 2170 lines.

#### [`06C_2010_V2_training_consolidation_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06C_2010_V2_training_consolidation_QA)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 06C — 2010 V2 TRAINING CONSOLIDATION QA.
**Static code indicators:** final/locked-mentioned, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `2c69dfd313ac98bca434fa3e2ed347f0f07a8c7cb5ccf4491127b1340a92a5f0` · 1929 lines.

#### [`06D0_2010_existing_training_reuse_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D0_2010_existing_training_reuse_QA)

**Source-described purpose:** 06D0_2010_existing_training_reuse_QA — PURPOSE — Before drawing any NEW 2010 training polygons, recover and QA legitimate.
**Static code indicators:** final/locked-mentioned, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_rescued_uncertain_05C2A`, `chennai_2010_targeted_expansion_05C3A`, `chennai_2010_manual_barren_05C4E`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `f1784d6e81f805d5fde9b0df707c567f50fbd739dc74917b340056b27d24c144` · 1383 lines.

#### [`06D0B_2010_existing_training_reuse_QA_FAST`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D0B_2010_existing_training_reuse_QA_FAST)

**Source-described purpose:** 06D0B_2010_existing_training_reuse_QA_FAST — FAST replacement for 06D0. — PURPOSE.
**Static code indicators:** validation-related; 0 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_rescued_uncertain_05C2A`, `chennai_2010_targeted_expansion_05C3A`, `chennai_2010_manual_barren_05C4E`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `43702bc3236a70e41ef31bf4b39a7ea9c07d0818b13a309095fbc3c5a98cd399` · 949 lines.

#### [`06D0C_2010_existing_training_reuse_QA_ROBUST`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D0C_2010_existing_training_reuse_QA_ROBUST)

**Source-described purpose:** 06D0C_2010_existing_training_reuse_QA_ROBUST — PURPOSE — FAST + ROBUST QA for reusing existing TRAINING-SIDE 2010 data.
**Static code indicators:** validation-related; 0 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_rescued_uncertain_05C2A`, `chennai_2010_targeted_expansion_05C3A`, `chennai_2010_manual_barren_05C4E`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `70431d3f496b30dc5c9d8114cbac90ef2697aaba63da0e87433c560bfd4e011c` · 1147 lines.

#### [`06D1_2010_training_validation_independence_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D1_2010_training_validation_independence_QA)

**Source-described purpose:** 06D1_2010_training_validation_independence_QA — PURPOSE — Rebuild the successful 06D0C consolidated 2010 training candidate pool,.
**Static code indicators:** final/locked-mentioned, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_rescued_uncertain_05C2A`, `chennai_2010_targeted_expansion_05C3A`, `chennai_2010_manual_barren_05C4E`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `eb5d362606897e574d543e13a37bd643aca863d0adbb36205cbf338a72ddf352` · 1074 lines.

#### [`06D2_2010_V2_final_training_selection_QA_EXPORT`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D2_2010_V2_final_training_selection_QA_EXPORT)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 06D2 — 2010 V2 FINAL TRAINING SELECTION — QA + EXPORT TASK.
**Static code indicators:** final/locked-mentioned, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_training_2010_final`, `chennai_training_2010_final_v2`, `chennai_predictor_stack_2010`, `chennai_transfer_2015_to_2010_QA_05A`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_rescued_uncertain_05C2A`, `chennai_2010_targeted_expansion_05C3A`, `chennai_2010_manual_barren_05C4E`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_training_2010_final_v2`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `5c5a0d6a505c71e04f9173d2e639d8c24837c757d9d843310bb2c95e2c4ef182` · 1742 lines.

#### [`06D3_2010_V2_training_asset_reload_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D3_2010_V2_training_asset_reload_QA)

**Source-described purpose:** 06D3_2010_V2_training_asset_reload_QA — PURPOSE: — Reload the materialized 2010 V2 final training asset and verify that.
**Static code indicators:** final/locked-mentioned, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_training_2010_final_v2`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `a225feae065792963b2b637a163a0dc9292aab27d892104894a567dd8928f211` · 348 lines.

#### [`06D3B_2010_V2_final_asset_scalar_check`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D3B_2010_V2_final_asset_scalar_check)

**Source-described purpose:** 06D3B — 2010 V2 FINAL MATERIALIZED ASSET SCALAR CHECK — Tiny final verification only. — NO EXPORT.
**Static code indicators:** final/locked-mentioned; 0 Export calls.
**Asset names referenced:** `chennai_training_2010_final_v2`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `b13f8a50ef596f210fcb233cca804567a9a8562bf929d35739d6edea6c8efe02` · 126 lines.

#### [`06D4_2010_V2B_correct_Vegetation16_QA_EXPORT`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D4_2010_V2B_correct_Vegetation16_QA_EXPORT)

**Source-described purpose:** 06D4 — 2010 V2B CORRECTION — REMOVE REJECTED VEGETATION POLY 16 + REPLACE WITH 4 CLEAN POLY 25 PIXELS — IMPORTANT.
**Static code indicators:** final/locked-mentioned, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_training_2010_final_v2`, `chennai_training_2010_final_v2b_corrected`, `chennai_2010_passB_reQA_05C1`, `chennai_predictor_stack_2010`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_training_2010_final_v2b_corrected`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `abac4bc08e47310178bac6860367a8c1f2e846b840a60ddd0bdb819f88eb2a0c` · 1217 lines.

#### [`06D5_2010_V2C_final_correction_QA_EXPORT`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D5_2010_V2C_final_correction_QA_EXPORT)

**Source-described purpose:** 06D5 — 2010 V2C FINAL TRAINING CORRECTION — CORRECTS TWO ISSUES IN MATERIALIZED V2: — A) Vegetation poly 16 was manually REJECTED.
**Static code indicators:** final/locked-mentioned, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_training_2010_final_v2`, `chennai_training_2010_final_v2c_corrected`, `chennai_predictor_stack_2010`, `chennai_validation_2010_final`, `chennai_2010_passB_reQA_05C1`, `chennai_2010_targeted_expansion_05C3A`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_training_2010_final_v2c_corrected`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `1ed5be08feaf322dd2528958640b32ce68b254187a4cf2d9c7ce41e27c1ec4d5` · 1825 lines.

#### [`06D6_2010_V2C_materialized_final_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D6_2010_V2C_materialized_final_QA)

**Source-described purpose:** 06D6 — 2010 V2C MATERIALIZED FINAL QA — PURPOSE — Verify the ACTUAL exported 2010 V2C training asset.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_training_2010_final_v2c_corrected`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `626d3aed783898222582cf7cb01431cc0249be1cd7ca6c9d61e5ce588272477b` · 571 lines.

#### [`06E1_2010_V2C_Gaussian_MLC_validation_export`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06E1_2010_V2C_Gaussian_MLC_validation_export)

**Source-described purpose:** 06E1 — CHENNAI 2010 V2C — TRUE GAUSSIAN MAXIMUM LIKELIHOOD CLASSIFICATION — + INDEPENDENT VALIDATION.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_training_2010_final_v2c_corrected`, `chennai_validation_2010_final`, `chennai_predictor_stack_2010`, `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2010_v2c`, `chennai_mlc_lulc_2010`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_mlc_lulc_2010_v2c`, `OUTPUT_CLASSIFICATION_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `1919b3abfdcac4e3c1f9755935dc5426ea1dab2a19c5c499d169e82d4a26be1d` · 1337 lines.

### 2015 training, validation and Gaussian MLC

#### [`04_stage5_temporal_transfer_2015`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04_stage5_temporal_transfer_2015)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 04 — 2020 -> 2015 TEMPORAL TRANSFER.
**Static code indicators:** final/locked-mentioned, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2020_final`, `chennai_validation_2020_final`, `chennai_training_polygons_2025_master`, `chennai_validation_polygons_2025_master`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `2ab882a3b67b5a4a68123ace96761a01f8223877062480e3f21354829cf420fe` · 2959 lines.

#### [`04A_2015_training_manual_review`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04A_2015_training_manual_review)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 04A — 2015 SINGLE TRAINING-ID MANUAL REVIEW.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2020_final`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `94b62cc3993975cb553e1c70d7d1dc2a9290a7f542a5e8a59e4506117e39cc19` · 994 lines.

#### [`04B_2015_training_consolidation`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04B_2015_training_consolidation)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 04B — 2015 TRAINING CONSOLIDATION AFTER MANUAL REVIEW.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 2 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2020_final`, `chennai_water_add_2015`, `chennai_agri_add_2015`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `export_waterAdd2015`, `projects/assignment-482806/assets/chennai_water_add_2015`, `export_agriAdd2015`, `projects/assignment-482806/assets/chennai_agri_add_2015`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `c872172118c0c69a86e3a58cf6acb30cbea178cb829c8fd79572745f2e155e1d` · 1533 lines.

#### [`04C_2015_add_missing_training`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04C_2015_add_missing_training)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 04C — 2015 ADD MISSING TRAINING PIXELS.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2020_final`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `6cf1fdb85f9685f7f2cdbea18346403e780a9966cc12c5ae5c58160c8950f5c4` · 1880 lines.

#### [`04D_2015_finalize_training`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04D_2015_finalize_training)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 04D — FINALIZE + MATERIALIZE 2015 TRAINING.
**Static code indicators:** final/locked-mentioned, export-calls-present; 2 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2020_final`, `chennai_training_2015_final`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `chennai_training_2015_final`, `FINAL_TRAINING_2015_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `a92f616218b0ab6b1181047f89c8324fe4bafcd53d4c56a46dc901d2e76b1029` · 1161 lines.

#### [`04E_2015_validation_transfer`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04E_2015_validation_transfer)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 04E — 2020 -> 2015 INDEPENDENT VALIDATION TRANSFER.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2020_final`, `chennai_validation_2020_final`, `chennai_training_2015_final`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `4cd08d2c86a7e1a58f7acb8be3663e45cd8093a8529226a1fa998811b14ee790` · 1893 lines.

#### [`04F_2015_validation_manual_review`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04F_2015_validation_manual_review)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 04F — 2015 VALIDATION MANUAL REVIEW HELPER.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_validation_2020_final`, `chennai_training_2015_final`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `28a6c695b8d55e2811c764f3fc5bce2dbccec9c2755c241ac7a4c0e178893abf` · 1021 lines.

#### [`04G_2015_validation_consolidation`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04G_2015_validation_consolidation)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 04G — 2015 VALIDATION CONSOLIDATION.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2015_final`, `chennai_validation_2020_final`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `b1a4e5bcef89a9ca6f1da1a7435ded45c3a08283efc1d7188d31846c2eb30353` · 1504 lines.

#### [`04H_2015_add_missing_validation`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04H_2015_add_missing_validation)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 04H — ADD MISSING 2015 INDEPENDENT VALIDATION PIXELS.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2015_final`, `chennai_validation_2020_final`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `5493944fbed5db04dcf273e74db427c29fb4ba7064c603a5228fc6024a475a32` · 1857 lines.

#### [`04I_2015_finalize_validation`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04I_2015_finalize_validation)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 04I — FINALIZE + MATERIALIZE 2015 VALIDATION.
**Static code indicators:** final/locked-mentioned, validation-related, export-calls-present; 2 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2015_final`, `chennai_validation_2020_final`, `chennai_validation_2015_final`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `chennai_validation_2015_final`, `FINAL_VALIDATION_2015_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `22ecb0af950fbdaeec1161e05bb5c439d238fae4a1b75fa5f3cee77e62b79116` · 665 lines.

#### [`04J_2015_gaussian_mlc`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04J_2015_gaussian_mlc)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 04J — 2015 ACTUAL GAUSSIAN MAXIMUM LIKELIHOOD.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 4 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2015_final`, `chennai_validation_2015_final`, `chennai_mlc_lulc_2015`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `chennai_mlc_lulc_2015`, `CLASSIFICATION_ASSET`, `chennai_validation_predictions_2015`, `chennai_mlc_accuracy_2015`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `ec72bc7f320536a7d7cf7051a431bd397b80ad194697761a475a52128c2ae87c` · 1089 lines.

#### [`04K_2015_area_statistics`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04K_2015_area_statistics)

**Source-described purpose:** CHENNAI MULTI-TEMPORAL LULC PROJECT — SCRIPT 04K — 2015 AREA STATISTICS.
**Static code indicators:** Gaussian-MLC-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2015`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `chennai_lulc_area_2015`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `9763bc35b4ca41e90e7dcb492570e24c04c4daaed722c89de2646544da4444c7` · 376 lines.

### Cross-stage tools and exports

#### [`07AC1_FIND_2025_CLASSIFICATION_ASSET`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/07AC1_FIND_2025_CLASSIFICATION_ASSET)

**Source-described purpose:** STAGE 07AC1 — FIND ORIGINAL 2025 CLASSIFICATION ASSET — READ ONLY — NO EXPORTS.
**Static code indicators:** read-only-labelled, Gaussian-MLC-related; 0 Export calls.
**Asset names referenced:** None matched by scanner.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `2f7ad18fd1b943f306435a6166392d33ac0c1cdb2935d83b9a8bf505dbec3dee` · 54 lines.

#### [`07AC4_VERIFY_RECOVERED_2025_TIFF`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/07AC4_VERIFY_RECOVERED_2025_TIFF)

**Source-described purpose:** STAGE 07AC4 — VERIFY RECOVERED ORIGINAL 2025 TIFF — FOUR-CLASS POST-CLASSIFICATION AGGREGATION — QA FIRST — NO EXPORTS BY DEFAULT.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_mlc_lulc_2025_from_original_tif`, `chennai_lulc4_2025_v1`, `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `Chennai_LULC4_2025_from_original_GeoTIFF`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `c877b6af71eda1e020b0375ff18ae83225f70ec85f0bd8e5d564e6325881b8c4` · 328 lines.

#### [`07AD_FINAL_POST_EXPORT_FOUR_CLASS_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/07AD_FINAL_POST_EXPORT_FOUR_CLASS_QA)

**Source-described purpose:** CHENNAI LULC — STAGE 07AD — FINAL POST-EXPORT QA — 2010, 2015, 2020, 2025 — READ ONLY — NO EXPORTS OR ASSET MODIFICATIONS.
**Static code indicators:** read-only-labelled, final/locked-mentioned, Gaussian-MLC-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `d6d933fc7c4d50e13fa62d9256a5be88a22a99f0a2853de3f2b502a301475f2a` · 252 lines.

#### [`07AE`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/07AE)

**Source-described purpose:** CHENNAI LULC — STAGE 07AE — DIAGNOSE 07AD'S GROUPED-AREA VS MASK-AREA DIFFERENCE — READ-ONLY. No export, asset write or classification changes.
**Static code indicators:** read-only-labelled; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `a929c96a1faa4a68526e1b0f40150f4a8ca47954e58e6015062812f6448e717e` · 229 lines.

#### [`08_REPORT_NDVI_NDWI_NDBI_ALL_YEARS`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/08_REPORT_NDVI_NDWI_NDBI_ALL_YEARS)

**Source-described purpose:** CHENNAI LULC — SCIENTIFIC INDEX MAP RECOVERY FOR REPORT — 2010, 2015, 2020, 2025 — NDVI / NDWI / NDBI — READ ONLY unless an Export switch is enabled.
**Static code indicators:** read-only-labelled, export-calls-present; 2 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010_L5L7_exp_v1`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`, `LANDSAT/LC09/C02/T1_L2`.
**Output/export arguments (where statically detected):** `Chennai_Spectral_Indices_' +`, `Chennai_Indices_' +`, `Chennai_' +`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `2d8b3ec5b2c26288bd154c84ca61996a74e315cfac10287af905e4bf9a65354e` · 593 lines.

#### [`08G12_2010_Asset_Identification`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/08G12_2010_Asset_Identification)

**Source-described purpose:** CHENNAI LULC — STAGE 08G-12 — WHICH 2010 FIVE-CLASS ASSET BELONGS IN ANALYSIS A? — Read-only. Does NOT pick a map based on an area target.
**Static code indicators:** read-only-labelled, final/locked-mentioned, fusion, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `e07c6227b7e73e1d8c5d08dce6088b4feec5f40eb747fc8844d9a14fa51b7a55` · 195 lines.

#### [`99_DOWNLOAD_ALL_ASSETS`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/99_DOWNLOAD_ALL_ASSETS)

**Source-described purpose:** CHENNAI LULC PROJECT — EXPORT ALL CURRENT EARTH ENGINE ASSETS TO GOOGLE DRIVE — RASTERS  -> GeoTIFF.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 3 Export calls.
**Asset names referenced:** None matched by scanner.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `EXPORT_chennai_mlc_lulc_2015`, `chennai_mlc_lulc_2015`, `EXPORT_chennai_mlc_lulc_2020`, `chennai_mlc_lulc_2020`, `EXPORT_' + assetName`, `assetName`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `5e1207900951c554373308752db0ff9139d1e90c30853a9a5bfea2383b62fdc5` · 174 lines.

#### [`CHENNAIboundary`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/CHENNAIboundary)

**Source-described purpose:** No useful introductory comments; manual code review required.
**Static code indicators:** final/locked-mentioned; 0 Export calls.
**Asset names referenced:** `chennai_gcc_wards_corrected_shapefile`, `chennai_urban_study_area_expanded`, `chennai_admin_study_area`, `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `15c1bc918224a84580cb401994ba75a5781e1ecb30c52e11e065b9df989f2c61` · 32 lines.

#### [`export_final4_to_drive.js`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/export_final4_to_drive.js)

**Source-described purpose:** Chennai LULC GIS — Stage 08 / Milestone 0 — Export only the four completed, final four-class reporting images. — Run in https://code.earthengine.google.com/ with access to the assets.
**Static code indicators:** final/locked-mentioned, export-calls-present; 2 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `spec.filename`, `Chennai_Study_Area_Boundary`, `chennai_study_area`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `779909582c9259e21994fecf72f21f17eb8ee3defe8f6f00c7b7240515ee57bd` · 117 lines.

#### [`export_historical_satellite_rgb`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/export_historical_satellite_rgb)

**Source-described purpose:** CHENNAI LULC GIS — STAGE 08 — OPTION 2A: HISTORICAL SATELLITE RGB EXPORT — Annual true-colour Landsat composites:.
**Static code indicators:** final/locked-mentioned, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `Chennai_RGB_' + year`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `13a5db4df583d13e860ce374b9e1eb51bbfd9c570d812e5bd387d2d91444ab56` · 385 lines.

#### [`rough`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/rough)

**Source-described purpose:** No useful introductory comments; manual code review required.
**Static code indicators:** requires-human-review; 0 Export calls.
**Asset names referenced:** None matched by scanner.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` · 0 lines.

#### [`xport_boundary_only`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/xport_boundary_only)

**Source-described purpose:** Chennai LULC Stage 08: export only the official study boundary. — This does not change any classification or image asset.
**Static code indicators:** final/locked-mentioned, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `Chennai_Study_Area_Boundary_Stage08`, `chennai_study_area`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `ba4f301fc791ca1d300df93739ed3edc60c5add37efe7fbd9f6f1e7b41cf2356` · 18 lines.

### Foundation: study area, predictors and 2020/2025

#### [`01_stage1_to_stage4_2025_master`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/01_stage1_to_stage4_2025_master)

**Source-described purpose:** No useful introductory comments; manual code review required.
**Static code indicators:** final/locked-mentioned, export-calls-present; 8 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_polygons_2025_master`, `chennai_validation_polygons_2025_master`.
**External dataset IDs (where statically detected):** `LANDSAT/LT05/C02/T1_L2`, `LANDSAT/LC08/C02/T1_L2`, `LANDSAT/LC09/C02/T1_L2`.
**Output/export arguments (where statically detected):** `Chennai_MLC_LULC_2025`, `Chennai_MLC_Area_Statistics_2025`, `Chennai_Training_Samples_2025`, `Chennai_Validation_Samples_2025`, `Chennai_MLC_Validation_Predictions_2025`, `Chennai_MLC_Accuracy_2025`, `Export_Chennai_Training_Polygons_2025_Master`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `13e33cb8798b2b4da7edb29b1683ec4fe1cb62bbf17b04cf737da8a3b6db6c86` · 7110 lines.

#### [`02_stage5_temporal_transfer`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/02_stage5_temporal_transfer)

**Source-described purpose:** CHENNAI LULC PROJECT — STAGE 5 - TEMPORAL TRAINING TRANSFER — PURPOSE:.
**Static code indicators:** final/locked-mentioned, export-calls-present; 8 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_polygons_2025_master`, `chennai_validation_polygons_2025_master`, `chennai_mlc_lulc_2020`, `chennai_training_2020_final`, `chennai_validation_2020_final`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`, `LANDSAT/LC09/C02/T1_L2`.
**Output/export arguments (where statically detected):** `Chennai_MLC_LULC_2020_Asset`, `projects/assignment-482806/assets/chennai_mlc_lulc_2020`, `Chennai_Training_2020_Final_Asset`, `projects/assignment-482806/assets/chennai_training_2020_final`, `Chennai_Validation_2020_Final_Asset`, `projects/assignment-482806/assets/chennai_validation_2020_final`, `Chennai_MLC_LULC_2020`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `4318eba0f855cc3a3c6cbeec28ec5a65c19ecbb89e95fbf32849ad90262c1eb3` · 6100 lines.

#### [`03_2020_area_stats`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/03_2020_area_stats)

**Source-described purpose:** CHENNAI LULC PROJECT — STAGE 5K — 2020 AREA STATISTICS FROM SAVED CLASSIFICATION ASSET.
**Static code indicators:** Gaussian-MLC-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2020`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `Chennai_MLC_Area_Statistics_2020`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `e59c5b43ea4ec41d6f0dfe9455e8c30f47d455c02ecfc9f526eba9e6315f8b48` · 569 lines.

### Out-of-region generalisability

#### [`tnjregion/00_TNJ_City_ROI`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/00_TNJ_City_ROI)

**Source-described purpose:** SCRIPT 00 - THANJAVUR CITY ROI — Screenshot-traced, approximate geographic boundary — Pilot only - not an official GIS boundary.
**Static code indicators:** export-calls-present; 1 Export calls.
**Asset names referenced:** None matched by scanner.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `TNJ_CITY_TRACE_PILOT_ROI_2020`, `projects/assignment-482806/assets/' +`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `1ee5f2940f956d013c842d83d1583bfce51fd558afe484b11321345ca7ba0574` · 119 lines.

#### [`tnjregion/01_TNJ_2020_Frozen_MLC`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/01_TNJ_2020_Frozen_MLC)

**Source-described purpose:** SCRIPT 01 - FROZEN CHENNAI GAUSSIAN MLC — Apply Chennai 2020 model to Thanjavur City, 2020 — NO THANJAVUR TRAINING.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `tnj_city_trace_pilot_roi_2020`, `chennai_training_2020_final`, `chennai_validation_2020_final`, `thanjavur_mlc_transfer_2020_frozen_chennai`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `TNJ_2020_FROZEN_CHENNAI_MLC`, `OUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `b235ca4f2dfe57daa9b842f17243f0c52e0e66a17c4b079d32417d391d5c11e5` · 326 lines.

#### [`tnjregion/02_TNJ_2020_Reference_Points`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/02_TNJ_2020_Reference_Points)

**Source-described purpose:** SCRIPT 02 - THANJAVUR REFERENCE SAMPLING — Run after Script 01 export has completed — Stratified sampling by predicted class.
**Static code indicators:** Gaussian-MLC-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `tnj_city_trace_pilot_roi_2020`, `thanjavur_mlc_transfer_2020_frozen_chennai`, `thanjavur_reference_2020_independently_labelled`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `TNJ_2020_REFERENCE_LOCATIONS`, `tnj_2020_reference_locations`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `cb357b69a510f93975c194824772ba0414e0d8636539ed4030169d2ddb805fee` · 89 lines.

#### [`tnjregion/02A_TNJ_Class_Distribution_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/02A_TNJ_Class_Distribution_QA)

**Source-described purpose:** THANJAVUR 2020 - FROZEN GAUSSIAN MLC — SCRIPT 02A - CLASS DISTRIBUTION AND COVERAGE QA — 1. STUDY AREA.
**Static code indicators:** Gaussian-MLC-related; 0 Export calls.
**Asset names referenced:** `tnj_city_trace_pilot_roi_2020`, `thanjavur_mlc_transfer_2020_frozen_chennai`.
**External dataset IDs (where statically detected):** `ESA/WorldCover/v100`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `adc1a011d7f0a4e064b52ad04ba9cc6c5e62f21f8bc7428c3b4f106ce355e7fe` · 241 lines.

#### [`tnjregion/03_TNJ_2020_Accuracy`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03_TNJ_2020_Accuracy)

**Source-described purpose:** SCRIPT 03 - THANJAVUR 2020 ACCURACY AUDIT — Uses independent reference data — No training or retraining.
**Static code indicators:** fusion, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `tnj_city_trace_pilot_roi_2020`, `thanjavur_mlc_transfer_2020_frozen_chennai`, `thanjavur_reference_2020_independently_labelled`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `TNJ_2020_GAUSSIAN_MLC_ACCURACY`, `tnj_2020_gaussian_mlc_accuracy`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `8d5123bedb168eefb41b46267eb2cd5804200bf26f3df63afc519024b9729e3d` · 199 lines.

#### [`tnjregion/03A_TNJ_Freeze_Reference_Points`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03A_TNJ_Freeze_Reference_Points)

**Source-described purpose:** STAGE 03A: FREEZE BLIND THANJAVUR 2020 REFERENCE LOCATIONS — No model training, no ground-truth labels inferred. — Run once; finish export before Stage 03B.
**Static code indicators:** Gaussian-MLC-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `tnj_city_trace_pilot_roi_2020`, `thanjavur_mlc_transfer_2020_frozen_chennai`, `tnj_2020_blind_reference_points_v1`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `TNJ_2020_BLIND_REFERENCE_POINTS_V1`, `OUTPUT`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `d42ea49dad9df310ec4d0d6e278107ffb4221ed8c4d91e15c3bc937e468363e5` · 93 lines.

#### [`tnjregion/03B_TNJ_2020_Reference_Reviewer`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03B_TNJ_2020_Reference_Reviewer)

**Source-described purpose:** STAGE 03B - BLIND 2020 REFERENCE LABEL REVIEWER — Thanjavur City \| 252 previously frozen locations — Use historical 2020 Sentinel-2 imagery.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, export-calls-present; 2 Export calls.
**Asset names referenced:** `tnj_2020_blind_reference_points_v1`, `thanjavur_reference_2020_independently_labelled`, `tnj_city_trace_pilot_roi_2020`.
**External dataset IDs (where statically detected):** `COPERNICUS/S2_SR_HARMONIZED`.
**Output/export arguments (where statically detected):** `TNJ_2020_REFERENCE_PROGRESS_' +`, `tnj_2020_reference_progress_' +`, `TNJ_2020_INDEPENDENT_VALIDATION_FINAL`, `FINAL_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `a8caf07a5c7c3024c720f70b2faa85f0db406fd5fdab20f39a74c2676ff21ea7` · 778 lines.

#### [`tnjregion/03C_TNJ_Automated_Reference_Assistance`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03C_TNJ_Automated_Reference_Assistance)

**Source-described purpose:** CHENNAI -> THANJAVUR GAUSSIAN MLC BENCHMARK — STAGE 03C - AUTOMATED REFERENCE ASSISTANCE — CORRECTED CHECKPOINT ASSET VERSION.
**Static code indicators:** Gaussian-MLC-related, validation-related, export-calls-present; 2 Export calls.
**Asset names referenced:** `tnj_2020_manual_checkpoint`, `tnj_2020_assisted_reference_queue_v1`, `tnj_city_trace_pilot_roi_2020`.
**External dataset IDs (where statically detected):** `ESA/WorldCover/v100`, `GOOGLE/DYNAMICWORLD/V1`.
**Output/export arguments (where statically detected):** `TNJ_2020_ASSISTED_REFERENCE_QUEUE_V1`, `OUTPUT`, `TNJ_2020_ASSISTED_REFERENCE_BACKUP`, `tnj_2020_assisted_reference_queue_v1`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `bcd64af5521fd71b66a73e1b7b1f6412415216261db992d4bb6e9fc151a2f388` · 393 lines.

#### [`tnjregion/03D_TNJ_Reduced_Validation_Design`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03D_TNJ_Reduced_Validation_Design)

**Source-described purpose:** CHENNAI -> THANJAVUR GAUSSIAN MLC BENCHMARK — STAGE 03D - REDUCED VALIDATION DESIGN V2 — 252 points, 55 manually labelled.
**Static code indicators:** Gaussian-MLC-related, validation-related, export-calls-present; 2 Export calls.
**Asset names referenced:** `tnj_2020_manual_checkpoint`, `thanjavur_mlc_transfer_2020_frozen_chennai`, `tnj_2020_blind_subsample_112_v2`, `tnj_2020_subsample_audit_112_v2`, `tnj_city_trace_pilot_roi_2020`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `TNJ_2020_BLIND_SUBSAMPLE_112_V2`, `BLIND_OUT`, `TNJ_2020_SUBSAMPLE_AUDIT_112_V2`, `AUDIT_OUT`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `7ad88a664a8df6788cd9f81cdd505a3798816eae757f3b8af0997a63ee932cb6` · 404 lines.

#### [`tnjregion/03E_TNJ_2020_Review_Remaining_91`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03E_TNJ_2020_Review_Remaining_91)

**Source-described purpose:** STAGE 03E - THANJAVUR 2020 REFERENCE REVIEW — FIXED VERSION - ES5 COMPATIBLE — 112 selected points, 21 existing human labels.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, export-calls-present; 3 Export calls.
**Asset names referenced:** `tnj_2020_blind_subsample_112_v2`, `tnj_city_trace_pilot_roi_2020`, `tnj_2020_reference_112_final_v1`, `tnj_2020_ref112_checkpoint_`.
**External dataset IDs (where statically detected):** `COPERNICUS/S2_SR_HARMONIZED`.
**Output/export arguments (where statically detected):** `TNJ_REF112_CHECKPOINT_' +`, `asset`, `TNJ_REF112_BACKUP_' +`, `TNJ_2020_REFERENCE_112_FINAL_V1`, `FINAL_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `ab46ca28b31662eafb689b56d06e62076440858c5f38e1f2c169c38c9f0d3842` · 750 lines.

#### [`tnjregion/04_TNJ_2020_Final_Accuracy_Benchmark`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/04_TNJ_2020_Final_Accuracy_Benchmark)

**Source-described purpose:** STAGE 04 - THANJAVUR 2020 — FROZEN CHENNAI GAUSSIAN MLC ACCURACY BENCHMARK — 112 independently reviewed reference points.
**Static code indicators:** final/locked-mentioned, fusion, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `tnj_2020_reference_112_final_v1`, `thanjavur_mlc_transfer_2020_frozen_chennai`, `tnj_city_trace_pilot_roi_2020`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `TNJ_2020_112_MLC_CLASS_ACCURACY_V1`, `tnj_2020_112_mlc_accuracy_by_class_v1`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `e7166575d374d2ab2e1b292078416ac18a5133036c20ed37da486d74156e49d9` · 438 lines.

#### [`tnjregion/05A2_TNJ_Chennai_2020_Seasonal_Diagnostics`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/05A2_TNJ_Chennai_2020_Seasonal_Diagnostics)

**Source-described purpose:** STAGE 05A.2 — CHENNAI / THANJAVUR 2020 — SEASONAL DIAGNOSTICS — READ ONLY: no retraining or changes to baseline.
**Static code indicators:** read-only-labelled, final/locked-mentioned, export-calls-present; 2 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `tnj_city_trace_pilot_roi_2020`, `chennai_training_2020_final`, `tnj_2020_reference_112_final_v1`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `TNJ_STAGE05A2_MONTHLY_OBSERVATION_QA_2020`, `TNJ_STAGE05A2_SEASONAL_CLASS_SIGNATURES_2020`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `742c1f542dcf006afb5db47a7530cfafe11f4abd1aaea4c1750a50e7fa9fff12` · 339 lines.

#### [`tnjregion/05A2_V2_Monthly_Spectral_Extraction`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/05A2_V2_Monthly_Spectral_Extraction)

**Source-described purpose:** STAGE 05A.2 - MEMORY-SAFE MONTHLY SPECTRAL EXTRACTION — Chennai vs Thanjavur, Landsat 8, 2020 — READ ONLY: no classifier training or asset changes.
**Static code indicators:** read-only-labelled, final/locked-mentioned, export-calls-present; 2 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `tnj_city_trace_pilot_roi_2020`, `chennai_training_2020_final`, `tnj_2020_reference_112_final_v1`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `TNJ05A2_V2_CHENNAI_2020_MONTHLY_POINTS`, `TNJ05A2_V2_THANJAVUR_2020_MONTHLY_POINTS`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `0d25d695e0034b9527a5cee0d0411dd53ce9625b219f4390af7912cc62f915b3` · 344 lines.

#### [`tnjregion/05A2_V3_Monthly_Spectral_Extraction`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/05A2_V3_Monthly_Spectral_Extraction)

**Source-described purpose:** STAGE 05A.2 V3 - MONTHLY SPECTRAL EXTRACTION (READ ONLY) — Chennai and Thanjavur, Landsat 8, January-December 2020 — FIX: no synthetic image is merged into Landsat collections.
**Static code indicators:** read-only-labelled, final/locked-mentioned, export-calls-present; 2 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `tnj_city_trace_pilot_roi_2020`, `chennai_training_2020_final`, `tnj_2020_reference_112_final_v1`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `TNJ05A2_V3_CHENNAI_2020_MONTHLY_POINTS`, `TNJ05A2_V3_THANJAVUR_2020_MONTHLY_POINTS`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `fc6d6eb7140b4cbd562587b8301abdba8fb51bc3345296227ea2157e1876a656` · 374 lines.

#### [`tnjregion/05A_TNJ_Spectral_Transfer_Diagnostics`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/05A_TNJ_Spectral_Transfer_Diagnostics)

**Source-described purpose:** STAGE 05A - READ-ONLY TRANSFER FAILURE DIAGNOSTIC — Chennai 2020 -> Thanjavur 2020 Gaussian MLC — No fitting, no altered predictions, no label changes.
**Static code indicators:** read-only-labelled, final/locked-mentioned, fusion, Gaussian-MLC-related, export-calls-present; 3 Export calls.
**Asset names referenced:** `tnj_city_trace_pilot_roi_2020`, `thanjavur_mlc_transfer_2020_frozen_chennai`, `chennai_training_2020_final`, `tnj_2020_reference_112_final_v1`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `TNJ2020_FROZEN_BASELINE_MANIFEST`, `TNJ2020_STAGE5A_CLASS_SIGNATURE_SHIFTS`, `TNJ2020_STAGE5A_UNLABELED_POOLED_STATS`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `413b00e52c5db24368afdc9e205e072acca6690528cd65961ae82c571cebee64` · 572 lines.

#### [`tnjregion/06B_TNJ_2020_Source_Month_Matching`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/06B_TNJ_2020_Source_Month_Matching)

**Source-described purpose:** EXPERIMENT B V3 — SOURCE-MONTH MATCHED FROZEN GAUSSIAN MLC — Chennai 2020 -> Thanjavur 2020.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 2 Export calls.
**Asset names referenced:** `tnj_city_trace_pilot_roi_2020`, `chennai_training_2020_final`, `thanjavur_mlc_transfer_2020_frozen_chennai`, `tnj_2020_reference_112_final_v1`, `tnj_2020_experiment_B_source_months_v3`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `TNJ2020_B_V3_ACCURACY`, `TNJ2020_B_V3_MAP`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `51e8c5e7091e13140a7025221e2d2039a1f75bcad9dbfd8fb46aac5e8c283bdc` · 566 lines.

#### [`tnjregion/06C_TNJ_2020_Quantile_Harmonisation_V2`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/06C_TNJ_2020_Quantile_Harmonisation_V2)

**Source-described purpose:** EXPERIMENT C V2 - UNSUPERVISED QUANTILE ALIGNMENT — Chennai -> Thanjavur, 2020 — NO TARGET TRAINING.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, export-calls-present; 3 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `tnj_city_trace_pilot_roi_2020`, `chennai_training_2020_final`, `tnj_2020_reference_112_final_v1`, `thanjavur_mlc_transfer_2020_frozen_chennai`, `tnj_2020_experiment_C_quantile_align_v2`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `TNJ2020_C_V2_ADJUSTMENT_PARAMS`, `TNJ2020_C_V2_ACCURACY`, `TNJ2020_C_V2_MAP`, `OUTPUT`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `1f2c6653ce6fc9256f5c9eba745a011bbdd0675bc2b5c6ae2db08ea168dd2e28` · 702 lines.

#### [`tnjregion/07_TNJ_Final_Transfer_Audit`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/07_TNJ_Final_Transfer_Audit)

**Source-described purpose:** FINAL READ-ONLY AUDIT: EXPERIMENT A VS C — Chennai 2020 -> Thanjavur 2020 — Original mapped strata and weights are preserved.
**Static code indicators:** read-only-labelled, final/locked-mentioned, Gaussian-MLC-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `thanjavur_mlc_transfer_2020_frozen_chennai`, `tnj_2020_experiment_C_quantile_align_v2`, `tnj_2020_reference_112_final_v1`, `tnj_city_trace_pilot_roi_2020`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `TNJ2020_A_C_FINAL_PAIRED_AUDIT`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `30f6d2232601f5f9ff67003ef5a31f1394b7e9aa949320b65bb92f407d39003d` · 188 lines.

#### [`tnjregion/08_TN_Closest_Spectral_City_Frozen_MLC_Auto_Proxy_2020`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/08_TN_Closest_Spectral_City_Frozen_MLC_Auto_Proxy_2020)

**Source-described purpose:** STAGE 08 \| QUICK UNSEEN-CITY SCREEN \| 2020 — Frozen Chennai Gaussian MLC -> closest coastal TN pilot city — NO new training and NO manual reference labels.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, export-calls-present; 2 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2020_final`, `tn_2020_spectrally_selected_city_frozen_mlc_v1`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`, `ESA/WorldCover/v100`, `GOOGLE/DYNAMICWORLD/V1`.
**Output/export arguments (where statically detected):** `TN2020_SPECTRALLY_SELECTED_CITY_FROZEN_MLC`, `ROOT +`, `TN2020_SELECTED_CITY_AUTOMATIC_PROXY_AGREEMENT`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `2de5cb05019906da53b190d48c67e9d07ca9ff37ff787a4258c28f22c6c4a1c4` · 682 lines.

#### [`tnjregion/10_EXPORT_ALL_SIX_FROZEN_MLC_LULC_MAPS_TO_DRIVE`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/10_EXPORT_ALL_SIX_FROZEN_MLC_LULC_MAPS_TO_DRIVE)

**Source-described purpose:** STAGE 10 - EXPORT ALL SIX GAUSSIAN MLC LULC MAPS — Chennai Generalisability Benchmark - 2020 — Thanjavur A - Original Frozen MLC.
**Static code indicators:** Gaussian-MLC-related, export-calls-present; 5 Export calls.
**Asset names referenced:** `tnj_city_trace_pilot_roi_2020`, `thanjavur_mlc_transfer_2020_frozen_chennai`, `tnj_2020_experiment_B_source_months_v3`, `tnj_2020_experiment_C_quantile_align_v2`, `tn_2020_spectrally_selected_city_frozen_mlc_v1`, `tn_2020_nagapattinam_frozen_mlc_v1`, `tn_2020_thoothukudi_frozen_mlc_v1`, `tnj_2020_reference_112_final_v1`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `stem + '_CLASS_CODES_30M`, `stem + '_COLOR_MAP_RGB_30M`, `MLC2020_ALL_SIX_MAP_CLASS_AREAS_AND_MANIFEST`, `MLC2020_ALL_SIX_PILOT_ROI_GEOMETRIES`, `MLC2020_TNJ_MANUAL_REFERENCE_112_POINTS`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `3f1b3aeb8d1685d47c2c51b439331e23c407b22de1ff04d333719eccb7446610` · 677 lines.

#### [`tnjregion/STAGE_09 _AUTOMATED_FROZEN_MLC_TRANSFER_BENCHMARK`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/STAGE_09%20_AUTOMATED_FROZEN_MLC_TRANSFER_BENCHMARK)

**Source-described purpose:** STAGE 09 - AUTOMATED FROZEN MLC TRANSFER BENCHMARK — Run Nagapattinam, then Thoothukudi separately. — Chennai 2020 source model remains unchanged.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, export-calls-present; 2 Export calls.
**Asset names referenced:** `chennai_training_2020_final`, `tn_2020_`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`, `ESA/WorldCover/v100`, `GOOGLE/DYNAMICWORLD/V1`.
**Output/export arguments (where statically detected):** `TN2020_' + KEY + '_PROXY_AGREEMENT_V1`, `TN2020_' + KEY + '_FROZEN_MLC_MAP_V1`, `ROOT + 'tn_2020_' + SLUG + '_frozen_mlc_v1`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `a00d05367e27e5dae6720a19ef4da8ec11cda47495348e404a73696808c15c04` · 655 lines.

### Stage 07: historical MLC and four-class reporting

#### [`stage7/07A_2010_V2_manual_training_audit`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07A_2010_V2_manual_training_audit)

**Source-described purpose:** CHENNAI LULC PROJECT — STAGE 07A — 2010 V2 MANUAL TRAINING AUDIT — FIXED VERSION 2.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`, `chennai_training_2015_final`, `chennai_validation_polygons_2010_manual_master`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `357acf61543f36d303d63beeeb92fa37b2352d9b1dcf4568de855368bfa28022` · 802 lines.

#### [`stage7/07AB_FINAL_BUILTUP_DISCREPANCY_ATTRIBUTION_2010_2015`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AB_FINAL_BUILTUP_DISCREPANCY_ATTRIBUTION_2010_2015)

**Source-described purpose:** CHENNAI LULC — STAGE 07AB — FINAL 2010–2015 BUILT-UP DISCREPANCY ATTRIBUTION AUDIT — Read-only analysis of the original Gaussian MLC models.
**Static code indicators:** read-only-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2010_L5L7_manual_exp_v1`, `chennai_training_2015_final`, `chennai_validation_2010_final`, `chennai_validation_2015_final`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`, `chennai_mlc_lulc_2015`, `chennai_predictor_stack_2010_L5L7_exp_v1`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `28f4e30fc85ac08c58ca24f5134c204e698e24945072d9b870842ef6b62cd385` · 1057 lines.

#### [`stage7/07AC5_FINAL_FOUR_CLASS_EXPORT_ALL_YEARS`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AC5_FINAL_FOUR_CLASS_EXPORT_ALL_YEARS)

**Source-described purpose:** CHENNAI LULC — STAGE 07AC5 — FINAL FOUR-CLASS RASTER ASSET EXPORT — 2010, 2015, 2020, 2025 — Five-class baseline retained.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`, `chennai_lulc4_2010_L5L7_provisional_v1`, `chennai_mlc_lulc_2015`, `chennai_lulc4_2015_v1`, `chennai_mlc_lulc_2020`, `chennai_lulc4_2020_v1`, `chennai_mlc_lulc_2025_from_original_tif`, `chennai_lulc4_2025_v1`, `chennai_lulc4_transition_`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `name`, `destination`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `b6904b9ac295749efdd39bc21172c6811c0e9347f543652ebd3239de2ca4b6ba` · 537 lines.

#### [`stage7/07AC_FOUR_CLASS_AGGREGATION_QA_AND_EXPORT`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AC_FOUR_CLASS_AGGREGATION_QA_AND_EXPORT)

**Source-described purpose:** CHENNAI LULC — STAGE 07AC — FIXED — FOUR-CLASS AGGREGATION + VALIDATION + AREA/CHANGE QA — FINAL CLASSES:.
**Static code indicators:** final/locked-mentioned, fusion, Gaussian-MLC-related, validation-related, export-calls-present; 2 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`, `chennai_validation_2010_final`, `chennai_lulc4_2010_L5L7_provisional_v1`, `chennai_mlc_lulc_2015`, `chennai_validation_2015_final`, `chennai_lulc4_2015_v1`, `chennai_mlc_lulc_2020`, `chennai_validation_2020_final`, `chennai_lulc4_2020_v1`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `Chennai_07AC_LULC4_' +`, `def.output`, `Chennai_07AC_LULC4_TIFF_' +`, `chennai_lulc4_' +`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `790f948aabf21b07eb72c651de1500ec7d7d43fb79dceb9e4c080d4ba495df4a` · 920 lines.

#### [`stage7/07B1_2010_barren_manual_review`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07B1_2010_barren_manual_review)

**Source-described purpose:** CHENNAI LULC PROJECT — STAGE 07B1 — 2010 V2 MANUAL CLASS REVIEW — VERSION 3 — DYNAMIC POLYGON FOCUS.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`, `chennai_training_2015_final`, `chennai_validation_polygons_2010_manual_master`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `3dc88458c5e6eded21ddb20a25bda0dcccdf32daf42730a7a91a8726a17df242` · 991 lines.

#### [`stage7/07B2_2010_native_barren_batch_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07B2_2010_native_barren_batch_QA)

**Source-described purpose:** CHENNAI LULC \| STAGE 07B2 \| 2010 NATIVE CLASS-5 SITE AUDIT — VERSION 1 \| COPY-PASTE INTO GOOGLE EARTH ENGINE CODE EDITOR — PURPOSE: Draw multiple NEW 2010 Barren/Fallow site polygons and.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`, `chennai_validation_polygons_2010_manual_master`.
**External dataset IDs (where statically detected):** `LANDSAT/LT05/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `6fe6c1b3b199e06399639f1ca4f23cda866999ad4fb218618e063c011475a2dc` · 470 lines.

#### [`stage7/07B2A_2010_export_validation_exclusion_KML`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07B2A_2010_export_validation_exclusion_KML)

**Source-described purpose:** CHENNAI LULC — STAGE 07B2A — EXPORT 2010 TRAINING EXCLUSION ZONES TO GOOGLE EARTH — PURPOSE:.
**Static code indicators:** final/locked-mentioned, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_validation_polygons_2010_manual_master`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `Chennai_2010_Validation_Exclusion_60m`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `22bd88f561c36e3014dc32ef798a27e3d1c8a8af3823655dc5efc281dd301200` · 137 lines.

#### [`stage7/07C2_export_locked_ROI`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07C2_export_locked_ROI)

**Source-described purpose:** CHENNAI LULC — 07C2 — EXPORT LOCKED CHENNAI ROI TO GOOGLE EARTH.
**Static code indicators:** final/locked-mentioned, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `Chennai_Locked_ROI_2010_Training`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `a2920674a571b89ed59ed36d58c6751050dea93b68533500d98eaae1d1a93ced` · 42 lines.

#### [`stage7/07C_2010_native_barren_batch_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07C_2010_native_barren_batch_QA)

**Source-described purpose:** CHENNAI LULC — STAGE 07C — 2010 NATIVE BARREN/FALLOW BATCH QA — VERSION 1 — AUDIT ONLY.
**Static code indicators:** final/locked-mentioned, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`, `chennai_training_2010_barren_native_candidates`, `chennai_validation_polygons_2010_manual_master`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `871211b570242b45d71bf22c30052e24efbd386e62dcae5b40d281fbac655412` · 349 lines.

#### [`stage7/07D_2010_all_classes_candidate_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07D_2010_all_classes_candidate_QA)

**Source-described purpose:** CHENNAI LULC — STAGE 07D — 2010 MANUAL ALL-CLASS TRAINING QA — NO EXPORT / NO MLC.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2010_native_allclasses_v1`, `chennai_predictor_stack_2010`, `chennai_validation_polygons_2010_manual_master`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `11e972ffafa19950901bddf79761cfc8ef98ec07d9916e554367e267a709763e` · 304 lines.

#### [`stage7/07E_2010_manual_label_triage`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07E_2010_manual_label_triage)

**Source-described purpose:** CHENNAI LULC — STAGE 07E — 2010 MANUAL TRAINING: LABEL-REVIEW TRIAGE + MAP INSPECTOR — AUDIT ONLY.
**Static code indicators:** final/locked-mentioned, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2010_native_allclasses_v1`, `chennai_predictor_stack_2010`, `chennai_validation_polygons_2010_manual_master`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `a3329d823f1897160e1024a2a363298be5b1dd76e4235909ed8c12ea1b680639` · 518 lines.

#### [`stage7/07F_2010_manual_balanced_training_v1`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07F_2010_manual_balanced_training_v1)

**Source-described purpose:** CHENNAI LULC — STAGE 07F — 2010 MANUAL TRAINING: BALANCED 600-POINT SELECTION — NEW TRAINING ASSET EXPORT.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_training_2010_manual_final_v1`, `chennai_admin_study_area_clean`, `chennai_training_2010_native_allclasses_v1`, `chennai_predictor_stack_2010`, `chennai_validation_polygons_2010_manual_master`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `Chennai_2010_manual_training_600_v1`, `EXPORT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `e14d5dff6349855f1f48d7592e570828fc45a78ab8a4f34fca04cc9e47b2c1ab` · 419 lines.

#### [`stage7/07G_2010_manual_Gaussian_MLC_v1`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07G_2010_manual_Gaussian_MLC_v1)

**Source-described purpose:** CHENNAI LULC — STAGE 07G — 2010 MANUAL-TRAINED GAUSSIAN MLC — VERSION: 2010_MANUAL_V1.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_mlc_lulc_2010_manual_v1`, `chennai_admin_study_area_clean`, `chennai_training_2010_manual_final_v1`, `chennai_predictor_stack_2010`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `Chennai_2010_manual_Gaussian_MLC_v1`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `bdfaf5e97cf5579d5744b7a6b0183bb75d84867afca2fec31c3b2106a9f0b7b1` · 546 lines.

#### [`stage7/07H1_2010_MLC_root_cause_diagnostics`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07H1_2010_MLC_root_cause_diagnostics)

**Source-described purpose:** CHENNAI LULC — STAGE 07H1 — 2010 MANUAL GAUSSIAN MLC — ROOT CAUSE DIAGNOSTICS — READ-ONLY / NO EXPORT / NO RETRAINING.
**Static code indicators:** read-only-labelled, final/locked-mentioned, fusion, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2010_manual_final_v1`, `chennai_validation_2010_final`, `chennai_mlc_lulc_2010_manual_v1`, `chennai_predictor_stack_2010`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `77ead1ac85f7e363060c6a7da2bb9f915e4f8fc26867a397991d3ce0a1ce2f9e` · 399 lines.

#### [`stage7/07H2_2010_site_heldout_CV`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07H2_2010_site_heldout_CV)

**Source-described purpose:** CHENNAI LULC — STAGE 07H2 — SITE-HELD-OUT SPATIAL CROSS-VALIDATION — VERSION 2 — COVARIANCE OUTPUT FIXED.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_training_2010_manual_final_v1`, `chennai_predictor_stack_2010`, `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `8e31cc2b568a4d4eae419e18fd59eb1d675091b3e6a851b5870c5e736b9bb3f1` · 636 lines.

#### [`stage7/07H3_Spectral_Separability_Analysis`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07H3_Spectral_Separability_Analysis)

**Source-described purpose:** CHENNAI LULC — STAGE 07H3 — 2010 SPECTRAL SEPARABILITY: CLASSES 2, 4, 5 — CLASS 2: VEGETATION (DENSE / TREE-DOMINATED).
**Static code indicators:** read-only-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_training_2010_manual_final_v1`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `ec36a937529f112e71028f8e0aea7a026e0f3edd50cb555799d6ec327e31c4e3` · 487 lines.

#### [`stage7/07H4_Test_whether_the nine-band_stack_is_helping_generalization`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07H4_Test_whether_the%20nine-band_stack_is_helping_generalization)

**Source-described purpose:** CHENNAI LULC — STAGE 07H4 — SIX-BAND GAUSSIAN MLC ABLATION — SITE-HELD-OUT CROSS-VALIDATION.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_training_2010_manual_final_v1`, `chennai_predictor_stack_2010`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `1d39be69ab6ce446f067a9f17ed1dc178c489a2fc835d53a8df1180014cf9725` · 426 lines.

#### [`stage7/07H_Independent_Accuracy_Assessment`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07H_Independent_Accuracy_Assessment)

**Source-described purpose:** CHENNAI LULC — STAGE 07H — 2010 MANUAL GAUSSIAN MLC — INDEPENDENT VALIDATION — VERSION: 2010_MANUAL_V1.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2010_manual_v1`, `chennai_validation_2010_final`, `chennai_predictor_stack_2010`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `b290e596e1c1e73d8537b2a134a52ea9c789e0e16463deae977c268230475138` · 327 lines.

#### [`stage7/07J_2015_MLC_to_2010_direct_transfer`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07J_2015_MLC_to_2010_direct_transfer)

**Source-described purpose:** CHENNAI LULC — STAGE 07J — DIRECT 2015 GAUSSIAN MLC MODEL -> 2010 LANDSAT STACK — DIAGNOSTIC ONLY: no 2010 training, no exports, no changes.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_training_2015_final`, `chennai_predictor_stack_2010`, `chennai_validation_2010_final`, `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `96925b7dc9e218f00795001c969ce5b2d1bcd5d742c4bda74ef654fb45c71dc2` · 187 lines.

#### [`stage7/07K_2015_MLC_2010_calibrated_transfer`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07K_2015_MLC_2010_calibrated_transfer)

**Source-described purpose:** CHENNAI LULC — STAGE 07K (READ-ONLY EXPERIMENT) — 2015 GAUSSIAN MLC APPLIED TO 2010 WITH BAND CALIBRATION — Cross-year calibration: six Landsat reflectance bands are.
**Static code indicators:** read-only-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_training_2015_final`, `chennai_training_2010_manual_final_v1`, `chennai_validation_2010_final`, `chennai_predictor_stack_2010`, `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `e1f1f362bc13e234007eb07a0ebbd365e3515955649d65cc573a8d7b8d811256` · 447 lines.

#### [`stage7/07L_2010_L5_L7_clear_observation_feasibility`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07L_2010_L5_L7_clear_observation_feasibility)

**Source-described purpose:** CHENNAI LULC — STAGE 07L — 2010 LANDSAT 7 COVERAGE FEASIBILITY (READ-ONLY) — Existing baseline: 2010 Landsat 5 full-year composite.
**Static code indicators:** read-only-labelled; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** `LANDSAT/LT05/C02/T1_L2`, `LANDSAT/LE07/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `17da4379636b2b8a8b708eaef007b1d04f51e8551cd890ebc30153c44ed3ddba` · 265 lines.

#### [`stage7/07M_2010_L5L7_experimental_stack`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07M_2010_L5L7_experimental_stack)

**Source-described purpose:** CHENNAI LULC — STAGE 07M — 2010 LANDSAT 5 + 7 EXPERIMENTAL NINE-BAND STACK — Source: Landsat Collection 2 Tier 1 Level 2 SR.
**Static code indicators:** exploratory-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010_L5L7_exp_v1`, `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`, `chennai_training_2010_manual_final_v1`.
**External dataset IDs (where statically detected):** `LANDSAT/LT05/C02/T1_L2`, `LANDSAT/LE07/C02/T1_L2`.
**Output/export arguments (where statically detected):** `Chennai_2010_L5L7_predictor_exp_v1`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `d15c2a5443c69958ed7653938cc69d1c3f8cebb5b4c75e9079c56ba830efcfaa` · 340 lines.

#### [`stage7/07N_2010_L5L7_Gaussian_MLC_test`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07N_2010_L5L7_Gaussian_MLC_test)

**Source-described purpose:** CHENNAI LULC — STAGE 07N — 2010 LANDSAT 5+7 NINE-BAND GAUSSIAN MLC TEST — READ ONLY: NO EXPORTS OR MODIFICATION OF SAVED ASSETS.
**Static code indicators:** read-only-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010`, `chennai_predictor_stack_2010_L5L7_exp_v1`, `chennai_training_2010_manual_final_v1`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `34aab897dc024298f8756393c4837c08301ef45facca18405ccbfc5745d4f23e` · 514 lines.

#### [`stage7/07O_2010_L5L7_MLC_export_exp_v1`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07O_2010_L5L7_MLC_export_exp_v1)

**Source-described purpose:** CHENNAI LULC — STAGE 07O — EXPORT EXPERIMENTAL 2010 LANDSAT 5 + 7 GAUSSIAN MLC — SAME method and manual reference locations as Stage 07N.
**Static code indicators:** exploratory-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 2 Export calls.
**Asset names referenced:** `chennai_predictor_stack_2010_L5L7_exp_v1`, `chennai_training_2010_manual_final_v1`, `chennai_training_2010_L5L7_manual_exp_v1`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`, `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `Chennai_2010_L5L7_training_manual_exp_v1`, `OUTPUT_TRAINING`, `Chennai_2010_L5L7_Gaussian_MLC_exp_v1`, `OUTPUT_RASTER`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `3e01e9e06a1313c6010123517464c060afa2d3f05907e51a3376dc7ecc604120` · 376 lines.

#### [`stage7/07P_2010_L5L7_site_heldout_CV`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07P_2010_L5L7_site_heldout_CV)

**Source-described purpose:** CHENNAI LULC — STAGE 07P — LANDSAT 5+7 GAUSSIAN MLC — SITE-HELD-OUT VALIDATION — READ-ONLY / NO EXPORTS / NO LABEL MODIFICATION.
**Static code indicators:** read-only-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_training_2010_L5L7_manual_exp_v1`, `chennai_predictor_stack_2010_L5L7_exp_v1`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`, `chennai_validation_2010_final`, `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `fa264e3d866fd8246c019555a2fe4e3fcd308499c38547f0daf1b4c2e708fd17` · 688 lines.

#### [`stage7/07Q_2010_L5L7_spatial_area_audit`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07Q_2010_L5L7_spatial_area_audit)

**Source-described purpose:** CHENNAI LULC — STAGE 07Q — 2010 L5+L7 SPATIAL, AREA AND REFERENCE AUDIT — READ ONLY — NO TRAINING, NO MODEL MODIFICATION, NO EXPORTS.
**Static code indicators:** read-only-labelled, exploratory-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`, `chennai_predictor_stack_2010_L5L7_exp_v1`, `chennai_training_2010_L5L7_manual_exp_v1`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `c275a10fcdffe78676ad2ce68ceeccd37620f76f42471a8a8e1b02f18271f0ad` · 492 lines.

#### [`stage7/07R_2010_2015_cross_year_plausibility`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07R_2010_2015_cross_year_plausibility)

**Source-described purpose:** CHENNAI LULC — STAGE 07R — 2010 L5+L7 VERSUS 2015 CROSS-YEAR PLAUSIBILITY AUDIT — READ ONLY.
**Static code indicators:** read-only-labelled, exploratory-labelled, final/locked-mentioned, Gaussian-MLC-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`, `chennai_mlc_lulc_2015`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `ab90b87d8ff459c536ef3979e9d1fddb3d71b92dd1bf1d28591a6b26fcd84508` · 421 lines.

#### [`stage7/07S_script_diagnostic_Inspection_points`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07S_script_diagnostic_Inspection_points)

**Source-described purpose:** CHENNAI LULC — STAGE 07S — TARGETED 2010 vs 2015 HISTORICAL DISAGREEMENT AUDIT — READ-ONLY — NO CLASSIFIER, NO EXPORTS, NO RELABELLING.
**Static code indicators:** read-only-labelled, exploratory-labelled, final/locked-mentioned, Gaussian-MLC-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`, `chennai_mlc_lulc_2015`, `chennai_predictor_stack_2010_L5L7_exp_v1`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `7bad4ca6f93f31738eec10a1c6a3c8c04391fd3cc3a590fcd57f75fdd5755565` · 646 lines.

#### [`stage7/07T_2015_Builtup_Omission_Diagnostic`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07T_2015_Builtup_Omission_Diagnostic)

**Source-described purpose:** CHENNAI LULC — STAGE 07T — 2015 BUILT-UP OMISSION / IMAGE COVERAGE DIAGNOSTIC — READ ONLY. NO RETRAINING, EXPORTS OR RELABELLING.
**Static code indicators:** read-only-labelled, final/locked-mentioned, fusion, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2015`, `chennai_training_2015_final`, `chennai_validation_2015_final`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`, `LANDSAT/LE07/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `7783e06485de216bfbeb30d463ad8c588a80053a138aa7affc57df2ffd0b18bc` · 455 lines.

#### [`stage7/07U1_Prepare_the_2015_training_polygon_workspace`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07U1_Prepare_the_2015_training_polygon_workspace)

**Source-described purpose:** CHENNAI LULC — STAGE 07U1 — 2015 V2 TRAINING-DIGITIZATION PREPARATION — READ-ONLY GEE REVIEW + ONE GOOGLE DRIVE KML EXPORT.
**Static code indicators:** read-only-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2015_final`, `chennai_validation_2015_final`, `chennai_mlc_lulc_2015`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `Chennai_2015_Validation_60m_Exclusions_KML`, `Chennai_2015_Validation_60m_Exclusions`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `d08af1babd5915c14b0e7ec19de3cf06065c7d77d003b62d7d9ec207169456f6` · 233 lines.

#### [`stage7/07U2 _2015_V2A_TRAINING_GAUSSIAN_MLC`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07U2%20_2015_V2A_TRAINING_GAUSSIAN_MLC)

**Source-described purpose:** CHENNAI LULC -- STAGE 07U2 -- 2015 V2A TRAINING + GAUSSIAN MLC — INPUT GEE TABLE ASSET: — projects/assignment-482806/assets.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_training_polygons_2015_v2_clean9`, `chennai_mlc_lulc_2015_V2A_exp_v1`, `chennai_admin_study_area_clean`, `chennai_training_2015_final`, `chennai_validation_2015_final`, `chennai_mlc_lulc_2015`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `07U2_2015_V2A_Gaussian_MLC_Experimental`, `OUTPUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `8725a4b4e7701a757cb8fcb62a97c5d77bdd51a8d95fc7d6d2cf3aa06d75a0e4` · 674 lines.

#### [`stage7/07V_spatial_temporal_MLC`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07V_spatial_temporal_MLC)

**Source-described purpose:** CHENNAI LULC — STAGE 07V — SPATIAL + TEMPORAL GAUSSIAN MLC EXPERIMENT — 2015 FIRST, THEN 2010.
**Static code indicators:** read-only-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010_L5L7_exp_v1`.
**External dataset IDs (where statically detected):** `LANDSAT/LT05/C02/T1_L2`, `LANDSAT/LE07/C02/T1_L2`, `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `8f18d46413b0441219008ac8b6c5de6bb9fbdfb3db813c30f785e78666e454a2` · 631 lines.

#### [`stage7/07W_External_historical_Built_up_verification`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07W_External_historical_Built_up_verification)

**Source-described purpose:** CHENNAI LULC — STAGE 07W — HISTORICAL BUILT-UP CROSS-CHECK: 2010 VS 2015 — Uses GHSL and GAIA as external contextual evidence.
**Static code indicators:** read-only-labelled, Gaussian-MLC-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`, `chennai_mlc_lulc_2015`.
**External dataset IDs (where statically detected):** `Tsinghua/FROM-GLC/GAIA/v10`, `JRC/GHSL/P2023A/GHS_BUILT_S/`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `b1fece1bfdb132417c2197da7ac281ac692e3f9cf0c712bf9055a53138b84840` · 325 lines.

#### [`stage7/07X_One_final_Random_Forest_comparison`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07X_One_final_Random_Forest_comparison)

**Source-described purpose:** CHENNAI LULC — STAGE 07X (FIXED) — FINAL 9-BAND RANDOM FOREST EXPERIMENT — Run YEAR = 2015, then YEAR = 2010.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, Random-Forest-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_predictor_stack_2010_L5L7_exp_v1`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `d63b6cba682ba62cbfd062c87bd7d76adbcc01a766067dec7da1e280a286e094` · 456 lines.

#### [`stage7/07Y_2020_RF_Comparison`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07Y_2020_RF_Comparison)

**Source-described purpose:** CHENNAI LULC — STAGE 07Y — 2020 RANDOM FOREST VS ORIGINAL GAUSSIAN MLC — Uses existing 2020 training and validation assets.
**Static code indicators:** read-only-labelled, final/locked-mentioned, Gaussian-MLC-related, Random-Forest-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2020_final`, `chennai_validation_2020_final`, `chennai_mlc_lulc_2020`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `32ef5e4b13278c4782969b49042a87b0047e49f726fdcc3a7d8d0dbf9dab0573` · 515 lines.

#### [`stage7/07Y_2025_RF_MLC_reconstructed_paired`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07Y_2025_RF_MLC_reconstructed_paired)

**Source-described purpose:** CHENNAI LULC — 07Y-2025 PAIRED RECONSTRUCTION — Rebuild balanced points from saved 2025 MASTER POLYGONS (not original points). — Compare Gaussian MLC versus Random Forest on the SAME reconstructed samples.
**Static code indicators:** Gaussian-MLC-related, Random-Forest-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_polygons_2025_master`, `chennai_validation_polygons_2025_master`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`, `LANDSAT/LC09/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `edcb3ac429a32e1f475bc1157abedb073d6f22cf8a4b5724b613d8e4b8616016` · 611 lines.

#### [`stage7/07Y_Random_Forest_2020_2025`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07Y_Random_Forest_2020_2025)

**Source-described purpose:** CHENNAI LULC — 07Y-2025 PAIRED RECONSTRUCTION — Rebuild balanced points from saved 2025 MASTER POLYGONS (not original points). — Compare Gaussian MLC versus Random Forest on the SAME reconstructed samples.
**Static code indicators:** Gaussian-MLC-related, Random-Forest-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_polygons_2025_master`, `chennai_validation_polygons_2025_master`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`, `LANDSAT/LC09/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `e1d531ace159fc258c59e204945aa7c364f7e67e05d4fb478b1f5e3a0b5d9a42` · 627 lines.

#### [`stage7/07Z`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07Z)

**Source-described purpose:** CHENNAI LULC — STAGE 07Z — FINAL 2010 CLASS 4 / CLASS 5 DIAGNOSTIC — Existing 2010 L5+L7 MLC and archived reference samples.
**Static code indicators:** read-only-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2010_L5L7_manual_exp_v1`, `chennai_validation_2010_final`, `chennai_predictor_stack_2010_L5L7_exp_v1`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `cd7a7065b87a9c6dc503c814fbbf9f63b42feba737135bae7cb04fdd6deeafbe` · 316 lines.

#### [`stage7/07Z2_2010_NDBI_SWIR1_Separability`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07Z2_2010_NDBI_SWIR1_Separability)

**Source-described purpose:** CHENNAI LULC — STAGE 07Z2 — 2010 CLASS 4 vs CLASS 5 SPECTRAL SEPARABILITY TEST — CLASS 4: Recognizable agricultural land / fields.
**Static code indicators:** read-only-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_training_2010_L5L7_manual_exp_v1`, `chennai_validation_2010_final`, `chennai_predictor_stack_2010_L5L7_exp_v1`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `f733fe97d393d206e6fdac7bea0d28b6960f01ebfa14cbb3385f04a50bee123e` · 455 lines.

### Stage 08: diagnosis and post-classification fusion

#### [`stage8/08A_BU_UNDERCLASSIFICATION_SPATIAL_AUDIT`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08A_BU_UNDERCLASSIFICATION_SPATIAL_AUDIT)

**Source-described purpose:** CHENNAI LULC — STAGE 08B — LIGHTWEIGHT BUILT-UP / OPEN-LAND DISAGREEMENT AUDIT — READ ONLY.
**Static code indicators:** read-only-labelled, final/locked-mentioned; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `50812c0144e0e43cf72fd194bfa875e272d7cce57cf96b539624e4c597cd2ad0` · 291 lines.

#### [`stage8/08D_2015_HISTORICAL_SITE_GAUSSIAN_DIAGNOSTIC`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08D_2015_HISTORICAL_SITE_GAUSSIAN_DIAGNOSTIC)

**Source-described purpose:** CHENNAI LULC — STAGE 08D — 2015 HISTORICAL-SITE GAUSSIAN MLC DIAGNOSTIC — READ ONLY.
**Static code indicators:** read-only-labelled, exploratory-labelled, final/locked-mentioned, Gaussian-MLC-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2015`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`, `chennai_lulc4_2015_v1`, `chennai_training_2015_final`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `0a405e8f8ad3ce19db3746bb438df16a86f48995e4194532d520d49b898515cc` · 625 lines.

#### [`stage8/08E_2015_EXACT_PIXEL_FOOTPRINT_AUDIT`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08E_2015_EXACT_PIXEL_FOOTPRINT_AUDIT)

**Source-described purpose:** CHENNAI LULC — STAGE 08E FIXED — ACTUAL 30 m PIXEL FOOTPRINTS — READ ONLY — Corrects pixel-coordinate/metre projection mix-up.
**Static code indicators:** read-only-labelled, Gaussian-MLC-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`, `chennai_mlc_lulc_2015`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** `Chennai_08E_FIXED_True30mCell_KML`, `Chennai_2015_10_TRUE_30m_Cells`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `a710d5045e909926a7e0f5627c37602ced10794f2c5031ecdddafb6dbb5ea125` · 200 lines.

#### [`stage8/08F2_2015_Original_Points_Context_MLC_Exploratory`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08F2_2015_Original_Points_Context_MLC_Exploratory)

**Source-described purpose:** CHENNAI LULC - STAGE 08F-2 — ORIGINAL 2015 TRAINING + VALIDATION POINTS — SPATIAL-CONTEXT GAUSSIAN MLC.
**Static code indicators:** read-only-labelled, exploratory-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2015_final`, `chennai_validation_2015_final`, `chennai_mlc_lulc_2015`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `21b32ee3ba3d21c7a8ddd266a18000ff529baa65b1e0e9b389dd1e45e2626311` · 538 lines.

#### [`stage8/08F3_2015_5x5_Context_MLC_Exploratory`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08F3_2015_5x5_Context_MLC_Exploratory)

**Source-described purpose:** CHENNAI LULC - STAGE 08F-3 — EXPERIMENT X2: 5x5 SPATIAL CONTEXT GAUSSIAN MLC — DATE: 21 OCTOBER 2026.
**Static code indicators:** read-only-labelled, exploratory-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2015_final`, `chennai_validation_2015_final`, `chennai_mlc_lulc_2015`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `a74bac76c83de715c90e84247aec3447555e5dee2e038f5825e5bba93fd3f14a` · 660 lines.

#### [`stage8/08F4_2015_SNIC_segment_context_exploratory`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08F4_2015_SNIC_segment_context_exploratory)

**Source-described purpose:** CHENNAI LULC — STAGE 08F-4 \| X3 SNIC SEGMENT CONTEXT — Date: 21 October 2026 — Original 2015: 600 training, 300 validation, 5 classes.
**Static code indicators:** read-only-labelled, exploratory-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2015_final`, `chennai_validation_2015_final`, `chennai_mlc_lulc_2015`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `00dd296f7a27ffe17e34a7b42a8dc7c61426f3578ba5f3362fd51405f205afc1` · 362 lines.

#### [`stage8/08F4A_1_EXPORT_SNAPSHOT`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08F4A_1_EXPORT_SNAPSHOT)

**Source-described purpose:** CHENNAI LULC - STAGE 08F-4A / PART 1 — MEMORY-SAFE SNIC SAMPLE SNAPSHOT (NEW ASSET ONLY) — 2015 X3 parameters frozen. No original asset modification.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_08f4a_X3_point_snapshot_v1`, `chennai_admin_study_area_clean`, `chennai_training_2015_final`, `chennai_validation_2015_final`, `chennai_mlc_lulc_2015`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `Chennai_08F4A_X3_PointSnapshot_v1`, `OUTPUT`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `6d85cc47a4be6ed984b728872bbc87ad6400192891a4654b7a4c26db937b4ea1` · 236 lines.

#### [`stage8/08F4A_2015_SNIC_paired_spatial_audit`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08F4A_2015_SNIC_paired_spatial_audit)

**Source-described purpose:** CHENNAI LULC \| STAGE 08F-4A \| X3 SNIC ROBUSTNESS AUDIT — Same 2015 X3 model and settings as Stage 08F-4. — Paired recheck on all 300, 267 non-shared, 33 shared points.
**Static code indicators:** read-only-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2015_final`, `chennai_validation_2015_final`, `chennai_mlc_lulc_2015`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `c17aa061160eb9a2cac49bb985dc9f8107800184230408a7f94dccdfe82174a7` · 734 lines.

#### [`stage8/08F4A_2_AUDIT_SNAPSHOT`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08F4A_2_AUDIT_SNAPSHOT)

**Source-described purpose:** CHENNAI LULC - STAGE 08F-4A / PART 2 — MEMORY-SAFE POINT-ONLY SNIC PAIRED ROBUSTNESS AUDIT — Requires COMPLETED Part 1 asset.
**Static code indicators:** Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_08f4a_X3_point_snapshot_v1`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `ca012f2d539cfd68413dc724f19c0ff02cd6dc08412d3134691bb4337273f44e` · 518 lines.

#### [`stage8/08F4B_2015_SNIC_snapshot_audit_FIXED`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08F4B_2015_SNIC_snapshot_audit_FIXED)

**Source-described purpose:** CHENNAI LULC \| STAGE 08F-4B — CORRECTED, POINT-ONLY SNIC SNAPSHOT AUDIT — No Landsat/SNIC rerun. No exports or original asset writes.
**Static code indicators:** Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_08f4a_X3_point_snapshot_v1`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `2fdf5ac7130e87deb6f17cc291945b860841fa84ff5d5859990d24ab4d6bc03e` · 482 lines.

#### [`stage8/08F4C_2015_FREEZE_SNIC_PREDICTORS`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08F4C_2015_FREEZE_SNIC_PREDICTORS)

**Source-described purpose:** CHENNAI LULC - STAGE 08F-4C — X3 SNIC: FREEZE ONE 2015 PREDICTOR RASTER — NO changes to existing training, validation or MLC assets.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_08f4c_X3_SNIC_frozen_11bands_segments_v1`, `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2015`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`.
**Output/export arguments (where statically detected):** `Chennai_08F4C_X3_SNIC_FrozenPredictors_v1`, `OUTPUT`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `b1a77fe1178ae9f9a8a9af59972808bb2330641b7d667518b9c9e7598c597a12` · 189 lines.

#### [`stage8/08F4D_2015_Frozen_SNIC_Reproducibility_Audit`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08F4D_2015_Frozen_SNIC_Reproducibility_Audit)

**Source-described purpose:** CHENNAI LULC \| STAGE 08F-4D — X3 FROZEN SNIC RASTER: POINT REPRODUCIBILITY AUDIT — Uses the already completed 12-band raster export.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_08f4c_X3_SNIC_frozen_11bands_segments_v1`, `chennai_08f4a_X3_point_snapshot_v1`, `chennai_training_2015_final`, `chennai_validation_2015_final`, `chennai_mlc_lulc_2015`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `bb1017def6f4543f1fa51149b84e37fa2343c910e33dd818136f061fb17afd29` · 264 lines.

#### [`stage8/08G10_Export_Three_Fusion_Candidates`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G10_Export_Three_Fusion_Candidates)

**Source-described purpose:** CHENNAI LULC - STAGE 08G-10 — FREEZE THREE EXPERIMENTAL FUSION CLASSIFICATIONS — 2015: GAIA2015 + WSF2015 + corrected 2020.
**Static code indicators:** exploratory-labelled, fusion, Gaussian-MLC-related, export-calls-present; 3 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2015`, `chennai_mlc_lulc_2020`, `chennai_mlc_lulc_2025_from_original_tif`, `chennai_08g10_2015_temporal_fusion_candidate_v1`, `chennai_08g10_2020_gaia_wc_fusion_candidate_v1`, `chennai_08g10_2025_gaia_dw_fusion_candidate_v1`.
**External dataset IDs (where statically detected):** `Tsinghua/FROM-GLC/GAIA/v10`, `ESA/WorldCover/v100`, `DLR/WSF/WSF2015/v1`, `GOOGLE/DYNAMICWORLD/V1`.
**Output/export arguments (where statically detected):** `Chennai_08G10_2015_temporal_fusion_CANDIDATE_v1`, `ROOT + 'chennai_08g10_2015_temporal_fusion_candidate_v1`, `Chennai_08G10_2020_gaia_wc_fusion_CANDIDATE_v1`, `ROOT + 'chennai_08g10_2020_gaia_wc_fusion_candidate_v1`, `Chennai_08G10_2025_gaia_dw_fusion_CANDIDATE_v1`, `ROOT + 'chennai_08g10_2025_gaia_dw_fusion_candidate_v1`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `c62346658cf31d4ef0b49602cf8d24935c5c3c370c24084b3648db1ebd52fa94` · 289 lines.

#### [`stage8/08G11_Analysis_A_B_GHSL_Comparison`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G11_Analysis_A_B_GHSL_Comparison)

**Source-described purpose:** CHENNAI LULC \| STAGE 08G-11 — ANALYSIS A: EXPORTED FUSION LULC MAPS (30 m) — ANALYSIS B: GHSL P2023A BUILT-UP SURFACE (native 100 m).
**Static code indicators:** fusion, Gaussian-MLC-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2010`, `chennai_08g10_2015_temporal_fusion_candidate_v1`, `chennai_08g10_2020_gaia_wc_fusion_candidate_v1`, `chennai_08g10_2025_gaia_dw_fusion_candidate_v1`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `40cdec6a2efefa42147c243863afc419d63eb2b6c9bc218751a1df6878f9055f` · 568 lines.

#### [`stage8/08G13_Analysis_A_Corrected_2010_Final_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G13_Analysis_A_Corrected_2010_Final_QA)

**Source-described purpose:** CHENNAI LULC \| STAGE 08G-13 — ANALYSIS A - CORRECTED 2010 VERSION AND FINAL READ-ONLY QA — 2010: archived L5/L7 manual experimental v1 (provisional).
**Static code indicators:** read-only-labelled, exploratory-labelled, final/locked-mentioned, fusion, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`, `chennai_08g10_2015_temporal_fusion_candidate_v1`, `chennai_08g10_2020_gaia_wc_fusion_candidate_v1`, `chennai_08g10_2025_gaia_dw_fusion_candidate_v1`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** None detected.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `1b8a30c16823880000e4eb6a54ec95623660e77633ffeb4e9c6ee91b586c3a7d` · 146 lines.

#### [`stage8/08G15_2010_GAIA_GHSL_Temporal_Fusion_Comparison`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G15_2010_GAIA_GHSL_Temporal_Fusion_Comparison)

**Source-described purpose:** CHENNAI LULC - STAGE 08G-15 — 2010 GAIA + GHSL + TEMPORAL FUSION — ORIGINAL vs ADD-ONLY vs TWO-WAY FUSION.
**Static code indicators:** read-only-labelled, final/locked-mentioned, fusion, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`, `chennai_08g10_2015_temporal_fusion_candidate_v1`, `chennai_validation_2010_final`.
**External dataset IDs (where statically detected):** `Tsinghua/FROM-GLC/GAIA/v10`, `JRC/GHSL/P2023A/GHS_BUILT_S/2010`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `acd4b5682f98a0dfb251ace425e6717cd28c876bc7b5e7ea50fc9b6a2e16a395` · 502 lines.

#### [`stage8/08G1_Builtup_Omission_Atlas_QA`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G1_Builtup_Omission_Atlas_QA)

**Source-described purpose:** CHENNAI LULC - STAGE 08G-1 — BUILT-UP OMISSION ATLAS \| 2015, 2020, 2025 — CORRECTED: 2025 asset recovered from original TIFF.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2015`, `chennai_mlc_lulc_2020`, `chennai_mlc_lulc_2025_from_original_tif`.
**External dataset IDs (where statically detected):** `Tsinghua/FROM-GLC/GAIA/v10`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `66bccbab88c0873f22c3d8838c5c3dac533446e3033d870d4947844d8a2e60dd` · 440 lines.

#### [`stage8/08G3_2015_Automated_Builtup_RF`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G3_2015_Automated_Builtup_RF)

**Source-described purpose:** CHENNAI LULC — STAGE 08G-3 — AUTOMATED GAIA-ASSISTED FIVE-CLASS RANDOM FOREST \| YEAR 2015 — EXPERIMENTAL ONLY. No edits to the locked original assets.
**Static code indicators:** exploratory-labelled, final/locked-mentioned, Gaussian-MLC-related, Random-Forest-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2015_final`, `chennai_validation_2015_final`, `chennai_mlc_lulc_2015`, `chennai_2015_08G3_gaia_assisted_RF_experimental_v1`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`, `Tsinghua/FROM-GLC/GAIA/v10`.
**Output/export arguments (where statically detected):** `Chennai_2015_08G3_GAIA_RF_experimental_v1`, `OUTPUT`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `db6048e5e832e39f4c0098a4373a8db54220dcfe8f3a7a328d9baf43a619bb61` · 402 lines.

#### [`stage8/08G3B_2015_RF_GAIA_Support_Audit`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G3B_2015_RF_GAIA_Support_Audit)

**Source-described purpose:** CHENNAI LULC - STAGE 08G-3B — AUTOMATED CITYWIDE BUILT-UP CORRECTION SUPPORT AUDIT — Compares the ORIGINAL and EXPERIMENTAL 2015 rasters.
**Static code indicators:** exploratory-labelled, final/locked-mentioned, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2015`, `chennai_2015_08G3_gaia_assisted_RF_experimental_v1`.
**External dataset IDs (where statically detected):** `Tsinghua/FROM-GLC/GAIA/v10`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `ca0beeec08040336ca125c8293687297d09ad6c04085e42ada205b12edead382` · 256 lines.

#### [`stage8/08G4A_2020_GAIA2018_RF_Comparison`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G4A_2020_GAIA2018_RF_Comparison)

**Source-described purpose:** CHENNAI LULC — STAGE 08G-4A — CONTROLLED GAIA-2018 POSITIVE TRAINING TEST \| YEAR 2020 — Difference from Stage 08G-4:.
**Static code indicators:** final/locked-mentioned, Gaussian-MLC-related, Random-Forest-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2020_final`, `chennai_validation_2020_final`, `chennai_mlc_lulc_2020`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`, `Tsinghua/FROM-GLC/GAIA/v10`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `a3bc5524b58fd351a329b69c0e76f1378a0cffd89d1599b6d56bd2bfd849783d` · 554 lines.

#### [`stage8/08G4B_2020_Conservative_Builtup_Fusion`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G4B_2020_Conservative_Builtup_Fusion)

**Source-described purpose:** CHENNAI LULC — STAGE 08G-4B — 2020 CONSERVATIVE BUILT-UP FUSION (NO RANDOM FOREST) — Hypothesis: some existing Class 4 / Class 5 pixels are truly urban.
**Static code indicators:** exploratory-labelled, final/locked-mentioned, fusion, Gaussian-MLC-related, Random-Forest-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2020`, `chennai_validation_2020_final`.
**External dataset IDs (where statically detected):** `Tsinghua/FROM-GLC/GAIA/v10`, `ESA/WorldCover/v100`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `b3a98ecc91d9e3ac98f8f5839400bbc994143e8299a1cf46267e4c694a931a6e` · 336 lines.

#### [`stage8/08G4C_GAIA _2015_versus_2018_fusion`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G4C_GAIA%20_2015_versus_2018_fusion)

**Source-described purpose:** CHENNAI LULC - STAGE 08G-4C — 2020 BUILT-UP FUSION: GAIA 2015 vs GAIA 2018 — Same original MLC, same ESA WorldCover 2020,.
**Static code indicators:** final/locked-mentioned, fusion, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2020`, `chennai_validation_2020_final`.
**External dataset IDs (where statically detected):** `Tsinghua/FROM-GLC/GAIA/v10`, `ESA/WorldCover/v100`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `28d45b322889688a02ef75e60debfb57fe87867833c7604920a683ababcf6e55` · 389 lines.

#### [`stage8/08G5_2015_GAIA_WSF_Fusion`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G5_2015_GAIA_WSF_Fusion)

**Source-described purpose:** CHENNAI LULC - STAGE 08G-5 (FIXED) — 2015 GAIA + WORLD SETTLEMENT FOOTPRINT FUSION — Read-only comparison: original MLC vs experimental RF vs fusion.
**Static code indicators:** read-only-labelled, exploratory-labelled, final/locked-mentioned, fusion, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2015`, `chennai_2015_08G3_gaia_assisted_RF_experimental_v1`, `chennai_validation_2015_final`.
**External dataset IDs (where statically detected):** `Tsinghua/FROM-GLC/GAIA/v10`, `DLR/WSF/WSF2015/v1`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `91a48fc715dfae8b25dbe87040251573ea21489354da6cf3431948db6955e53a` · 250 lines.

#### [`stage8/08G6G7_Final_Automated_Builtup_Comparison`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G6G7_Final_Automated_Builtup_Comparison)

**Source-described purpose:** CHENNAI LULC \| STAGES 08G-6 + 08G-7 — 2015 GHSL SCREEN + 2025 DYNAMIC WORLD CORRECTION — 2020 best fusion previously audited: 296.739518 km2.
**Static code indicators:** read-only-labelled, final/locked-mentioned, fusion, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2015`, `chennai_mlc_lulc_2025_from_original_tif`, `chennai_validation_2015_final`.
**External dataset IDs (where statically detected):** `Tsinghua/FROM-GLC/GAIA/v10`, `DLR/WSF/WSF2015/v1`, `JRC/GHSL/P2023A/GHS_BUILT_S/2015`, `GOOGLE/DYNAMICWORLD/V1`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `d37170ee9f28e64aed6a449a6e2ddf976c4cc7865ec01b8f432ad5df4b49c7a9` · 530 lines.

#### [`stage8/08G8_2025_GAIA_DW_PairedValidation`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G8_2025_GAIA_DW_PairedValidation)

**Source-described purpose:** CHENNAI LULC — STAGE 08G-8 — AUTOMATED 2025 GAIA + DYNAMIC WORLD PAIRED VALIDATION — Reconstruct a NEW balanced 300-pixel assessment sample from.
**Static code indicators:** read-only-labelled, fusion, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2025_from_original_tif`, `chennai_validation_polygons_2025_master`, `chennai_training_polygons_2025_master`.
**External dataset IDs (where statically detected):** `Tsinghua/FROM-GLC/GAIA/v10`, `GOOGLE/DYNAMICWORLD/V1`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `e7dc60fdbd2ab246c26f210d68c03fe851e68ea155163fa55298fb22407cc5e5` · 355 lines.

#### [`stage8/08G9_2015_Temporal_Consistency_Fusion`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G9_2015_Temporal_Consistency_Fusion)

**Source-described purpose:** CHENNAI LULC \| STAGE 08G-9 — 2015 TEMPORAL-CONSISTENCY FUSION WITH CORRECTED 2020 MAP — Diagnostic candidate only. No asset modifications or exports.
**Static code indicators:** final/locked-mentioned, fusion, Gaussian-MLC-related, validation-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2015`, `chennai_mlc_lulc_2020`, `chennai_validation_2015_final`.
**External dataset IDs (where statically detected):** `Tsinghua/FROM-GLC/GAIA/v10`, `DLR/WSF/WSF2015/v1`, `ESA/WorldCover/v100`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `d1f2fba6749b89d46c0551feaf0f315756faf340a62dea8e193d683dc287ec34` · 324 lines.

#### [`stage8/11_CHENNAI_STAGE08G15_RECOVER_2010_FUSION_AND_EXPORT_FIVE_LULC_MAPS`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/11_CHENNAI_STAGE08G15_RECOVER_2010_FUSION_AND_EXPORT_FIVE_LULC_MAPS)

**Source-described purpose:** STAGE 11 - RECOVER ORIGINAL 2010 TWO-WAY FUSION + EXPORT LULC MAPS — Source: archived Stage 08G-15 (rules preserved exactly). — Reported series: 2010 ORIGINAL + 2015, 2020, 2025 FUSION.
**Static code indicators:** final/locked-mentioned, fusion, Gaussian-MLC-related, validation-related, export-calls-present; 4 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2010_L5L7_manual_exp_v1`, `chennai_08g10_2015_temporal_fusion_candidate_v1`, `chennai_08g10_2020_gaia_wc_fusion_candidate_v1`, `chennai_08g10_2025_gaia_dw_fusion_candidate_v1`, `chennai_validation_2010_final`, `chennai_08g15_2010_two_way_fusion_sensitivity_v1`.
**External dataset IDs (where statically detected):** `Tsinghua/FROM-GLC/GAIA/v10`, `JRC/GHSL/P2023A/GHS_BUILT_S/2010`.
**Output/export arguments (where statically detected):** `fileBase + '_CLASS_CODES_30M`, `fileBase + '_RGB_LULC_MAP`, `CHENNAI_FUSION_FIVE_MAPS_CLASS_AREA_MANIFEST`, `CHENNAI_2010_08G15_TWO_WAY_SENSITIVITY_ASSET`, `saved2010Asset`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `7430beb1d112b7e6854e3c354c848b7b83133d8b07c25d2abc741b7fd3b08e7b` · 603 lines.

#### [`stage8/8G4_2020_GAIA_Assisted_RF`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/8G4_2020_GAIA_Assisted_RF)

**Source-described purpose:** CHENNAI LULC — STAGE 08G-4 — AUTOMATED GAIA-ASSISTED RANDOM FOREST \| YEAR 2020 — Experimental candidate; all original assets remain locked.
**Static code indicators:** exploratory-labelled, final/locked-mentioned, Gaussian-MLC-related, Random-Forest-related, validation-related, export-calls-present; 1 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_training_2020_final`, `chennai_validation_2020_final`, `chennai_mlc_lulc_2020`, `chennai_2020_08G4_gaia_assisted_RF_experimental_v1`.
**External dataset IDs (where statically detected):** `LANDSAT/LC08/C02/T1_L2`, `Tsinghua/FROM-GLC/GAIA/v10`.
**Output/export arguments (where statically detected):** `Chennai_2020_08G4_GAIA_RF_experimental_v1`, `OUT_ASSET`.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `7acfb66f14290069698bacb36feb4a996bfee68612d7a0ab9748423d924a3ade` · 495 lines.

#### [`stage8/Chennai_2015_08G3_GAIA_RF_experimental_v1`](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/Chennai_2015_08G3_GAIA_RF_experimental_v1)

**Source-described purpose:** CHENNAI LULC - STAGE 08G-3A — NEW RF BUILT-UP AREA AND CHANGE AUDIT — Run ONLY after 08G-3 experimental export COMPLETES.
**Static code indicators:** read-only-labelled, exploratory-labelled, Gaussian-MLC-related; 0 Export calls.
**Asset names referenced:** `chennai_admin_study_area_clean`, `chennai_mlc_lulc_2015`, `chennai_2015_08G3_gaia_assisted_RF_experimental_v1`.
**External dataset IDs (where statically detected):** `Tsinghua/FROM-GLC/GAIA/v10`.
**Output/export arguments (where statically detected):** None detected.
**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.
**Source fingerprint:** SHA-256 `7702efe55233c84e981dd671c661f3da72cc3916d58937cabc6fa595a08ec804` · 157 lines.

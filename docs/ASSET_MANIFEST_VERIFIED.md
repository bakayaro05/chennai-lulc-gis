# ASSET_MANIFEST_VERIFIED.md — Chennai Multi-Temporal LULC

**Status:** Verified *Earth Engine metadata* and documented *export evidence*; this is **not** pixel-level or scientific accuracy revalidation.  
**Snapshot:** 2026-10-28 18:31:52 UTC (second audit), cross-checked with the 18:28:05 UTC audit.  
**GEE project:** `projects/assignment-482806`; primary asset root `projects/assignment-482806/assets/`.  
**Repository:** https://github.com/bakayaro05/chennai-lulc-gis · source archive revision `1c1335e76291d7014336912f2292ba56049bf345`.  
**Evidence:** Two uploaded `asset_metadata_*.csv` records, two audit summaries, 107 operation records, Code Editor asset screenshots, Google Drive folder screenshots, GitHub scripts and the established project research history.  

> **Use this file as the asset inventory for the snapshot above, not as proof of complete scientific reproducibility.** The live lookup confirms IDs, asset types and the limited raster metadata available; it does not check pixel values, geometries, masks, 30 m transforms, class correctness, training/validation independence or local output file checksums. Google Drive thumbnails alone do not verify raster integrity.

## 1. Executive evidence summary

| Item | Verified observation | Boundary of evidence |
| --- | --- | --- |
| Static asset IDs checked | **69** unique IDs directly derived from archived GEE source | Not a full census of all assets; dynamic identifiers and manual imports may be absent |
| Earth Engine asset metadata available | **62** (**25 IMAGE + 37 TABLE**) | Returned from 2026-10-28 API audit |
| Not accessible or not found | **7** | Missing and permission-denied are indistinguishable; none is a 26-item critical asset |
| Critical assets | **26/26 accessible** | This priority label comes from the verification plan |
| High-priority supporting assets | **8/8 accessible** | Metadata checked; not pixels |
| Other/review assets | **28 accessible; 7 unresolved** | No scientific adoption assumed |
| Recorded operations | **107 `SUCCEEDED` records; 95 distinct descriptions** | Accessible task history; not all tasks necessarily returned; duplicate descriptions exist |
| Screenshots | Earth Engine asset browser + several Drive export folders | Shows visible names/tiles; not hashes, band metadata or full folder inventories |
| Research scope | 2010 provisional + 2015/2020/2025; 2005 remains unverified | No future prediction |

### Status definitions

- **METADATA-VERIFIED**: Earth Engine returned asset metadata, including type and, for images, reported bands and projection. This is the level of verification of the 62 assets below.
- **UNRESOLVED**: Earth Engine did not return metadata for the supplied identity under the authenticated account; no claim of deletion or failed export.
- **OPERATION-SUCCEEDED**: a project operation record reports `SUCCEEDED`; there may be no explicit destination path in the provided CSV. A name match to an asset or Drive filename is **corroboration, not definitive identity proof**.
- **DRIVE-SCREENSHOT-VISIBLE**: a file tile or thumbnail is visible in an uploaded folder screenshot; Google Drive connector access did not independently resolve those folders in this session. Folder contents, file IDs, file hashes and georeferencing are not audited here.
- **SCIENCE-VALIDATED**: would require raster/feature inspection against independent references and the methods in the research report. **Not performed in this manifest.**

## 2. Locked scientific identity and naming safeguards

1. **Locked study area:** `projects/assignment-482806/assets/chennai_admin_study_area_clean`; vector area reported in project history as **529.450838 km²**. Raster-support area (about 529.7711 km² in earlier audits) must not be substituted for the boundary area.
2. **Raster specification:** historical classification analysis uses **EPSG:32644**, a nominal **30 m** grid, six Landsat reflectance bands and NDVI/NDWI/NDBI. The *metadata* field `EPSG:32644` is reported for 25 accessible images, but their exact pixel transforms and masks were not assessed by this audit.
3. **Five-class original models:** Built-up (1), Vegetation (2), Water (3), and historical open/barren classes (4/5). Class labels differ in some early scripts, so check the appropriate script before using detailed class 4/5 names. The **four-class application maps merge 4+5** and should never be mistaken for original five-class Gaussian MLC outputs.
4. **2010 reported map:** `chennai_mlc_lulc_2010_L5L7_manual_exp_v1` is the **provisional original** L5/L7 classification; older assets `chennai_mlc_lulc_2010`, `chennai_mlc_lulc_2010_manual_v1` and `chennai_mlc_lulc_2010_v2c` are distinct branches.
5. **2010 sensitivity:** `chennai_08g15_2010_two_way_fusion_sensitivity_v1` is a separate GAIA/GHSL/2015-informed sensitivity raster; it does **not** supersede the provisional 2010 reported map.
6. **2015/2020/2025 retained fusion** maps are **post-classification candidates**, not Gaussian model retraining.
7. **Thanjavur A/B/C** reuses the frozen 2020 Chennai Gaussian MLC; the original reported 112-reference target OA values (A 23.1854%, B 20.6625%, C 35.9444%) come from prior analysis, **not new audit computations**.
8. **Cuddalore/Nagapattinam/Thoothukudi** consensus percentages rely on automatic external-product proxies, **not independently human-labelled accuracy**.
9. **2005:** no verified accepted original 2005 map is established by the archived source or uploaded metadata audit.

## 3. Critical authoritative assets — all 26 metadata-verified

| Asset short name (prefix `projects/assignment-482806/assets/`) | Purpose / interpretation | Type | Image metadata | Example source |
| --- | --- | --- | --- | --- |
| `chennai_08g10_2015_temporal_fusion_candidate_v1` | Retained post-classification fusion candidate | IMAGE | 1 band(s): `LULC`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G10_Export_Three_Fusion_Candidates) (+4) |
| `chennai_08g10_2020_gaia_wc_fusion_candidate_v1` | Retained post-classification fusion candidate | IMAGE | 1 band(s): `LULC`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G10_Export_Three_Fusion_Candidates) (+3) |
| `chennai_08g10_2025_gaia_dw_fusion_candidate_v1` | Retained post-classification fusion candidate | IMAGE | 1 band(s): `LULC`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G10_Export_Three_Fusion_Candidates) (+3) |
| `chennai_admin_study_area_clean` | Study boundary (locked) | TABLE | TABLE; no image bands | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/01_stage1_to_stage4_2025_master) (+106) |
| `chennai_lulc4_2010_L5L7_provisional_v1` | Derived four-class reporting raster | IMAGE | 1 band(s): `classification`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AC5_FINAL_FOUR_CLASS_EXPORT_ALL_YEARS) (+1) |
| `chennai_lulc4_2015_v1` | Derived four-class reporting raster | IMAGE | 1 band(s): `classification`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AC5_FINAL_FOUR_CLASS_EXPORT_ALL_YEARS) (+2) |
| `chennai_lulc4_2020_v1` | Derived four-class reporting raster | IMAGE | 1 band(s): `classification`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AC5_FINAL_FOUR_CLASS_EXPORT_ALL_YEARS) (+1) |
| `chennai_lulc4_2025_v1` | Derived four-class reporting raster | IMAGE | 1 band(s): `classification`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/07AC4_VERIFY_RECOVERED_2025_TIFF) (+2) |
| `chennai_mlc_lulc_2010_L5L7_manual_exp_v1` | 2010 five-class provisional original MLC | IMAGE | 1 band(s): `classification`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AB_FINAL_BUILTUP_DISCREPANCY_ATTRIBUTION_2010_2015) (+16) |
| `chennai_mlc_lulc_2015` | Five-class Gaussian MLC original | IMAGE | 1 band(s): `classification`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04J_2015_gaussian_mlc) (+27) |
| `chennai_mlc_lulc_2020` | Five-class Gaussian MLC original | IMAGE | 1 band(s): `classification`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/02_stage5_temporal_transfer) (+11) |
| `chennai_mlc_lulc_2025_from_original_tif` | Recovered 2025 original five-class raster | IMAGE | 1 band(s): `b1`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/07AC4_VERIFY_RECOVERED_2025_TIFF) (+5) |
| `chennai_predictor_stack_2010_L5L7_exp_v1` | Landsat 5+7 2010 nine-band predictor | IMAGE | 9 band(s): `blue; green; red; nir; swir1; swir2; NDVI; NDWI; NDBI`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/08_REPORT_NDVI_NDWI_NDBI_ALL_YEARS) (+11) |
| `chennai_training_2010_L5L7_manual_exp_v1` | Training feature table | TABLE | TABLE; no image bands | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AB_FINAL_BUILTUP_DISCREPANCY_ATTRIBUTION_2010_2015) (+5) |
| `chennai_training_2015_final` | Training feature table | TABLE | TABLE; no image bands | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04D_2015_finalize_training) (+23) |
| `chennai_training_2020_final` | Training feature table | TABLE | TABLE; no image bands | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/02_stage5_temporal_transfer) (+18) |
| `chennai_training_polygons_2025_master` | Master historical source points/polygons | TABLE | TABLE; no image bands | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/01_stage1_to_stage4_2025_master) (+5) |
| `chennai_validation_2010_final` | Validation feature table | TABLE | TABLE; no image bands | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05E2D_2010_finalize_validation) (+28) |
| `chennai_validation_2015_final` | Validation feature table | TABLE | TABLE; no image bands | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04I_2015_finalize_validation) (+17) |
| `chennai_validation_2020_final` | Validation feature table | TABLE | TABLE; no image bands | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/02_stage5_temporal_transfer) (+13) |
| `chennai_validation_polygons_2025_master` | Master historical source points/polygons | TABLE | TABLE; no image bands | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/01_stage1_to_stage4_2025_master) (+5) |
| `thanjavur_mlc_transfer_2020_frozen_chennai` | Frozen Chennai 2020 MLC applied to Thanjavur | IMAGE | 1 band(s): `mapped_class`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/01_TNJ_2020_Frozen_MLC) (+11) |
| `tnj_2020_experiment_B_source_months_v3` | Thanjavur frozen-model Experiment B or C output | IMAGE | 1 band(s): `experiment_B_class`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/06B_TNJ_2020_Source_Month_Matching) (+1) |
| `tnj_2020_experiment_C_quantile_align_v2` | Thanjavur frozen-model Experiment B or C output | IMAGE | 1 band(s): `experiment_C_class`; `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/06C_TNJ_2020_Quantile_Harmonisation_V2) (+2) |
| `tnj_2020_reference_112_final_v1` | 112 manually reviewed Thanjavur target reference locations | TABLE | TABLE; no image bands | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03E_TNJ_2020_Review_Remaining_91) (+9) |
| `tnj_city_trace_pilot_roi_2020` | Traced Thanjavur target pilot boundary | TABLE | TABLE; no image bands | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/01_TNJ_2020_Frozen_MLC) (+17) |

**Key interpretation:** the recovered 2025 raster advertises band `b1` rather than `classification`; any downstream code should select/rename it deliberately. Fusion rasters report `LULC`, while the 2010 sensitivity reports `lulc_class`. The class IDs and masks must be checked independently before stacking them.

## 4. Eight additional high-priority supporting assets — all metadata-verified

| Asset short name | Research role | Type | Bands / CRS when image | Example source |
| --- | --- | --- | --- | --- |
| `chennai_08g15_2010_two_way_fusion_sensitivity_v1` | 2010 two-way fusion sensitivity only | IMAGE | 1 · lulc_class · `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/11_CHENNAI_STAGE08G15_RECOVER_2010_FUSION_AND_EXPORT_FIVE_LULC_MAPS) |
| `chennai_predictor_stack_2010` | Earlier Landsat 5 predictor plus QA band | IMAGE | 10 · blue; green; red; nir; swir1; swir2; NDVI; NDWI; NDBI; clear_count · `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C0_2010_materialize_predictor_stack) (+45) |
| `chennai_training_2010_manual_final_v1` | Historical manual training feature table | TABLE | TABLE | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07F_2010_manual_balanced_training_v1) (+9) |
| `chennai_training_2010_native_allclasses_v1` | Manual polygons and class references | TABLE | TABLE | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07D_2010_all_classes_candidate_QA) (+2) |
| `chennai_validation_polygons_2010_manual_master` | Reference polygons (manual) | TABLE | TABLE | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07A_2010_V2_manual_training_audit) (+7) |
| `tn_2020_nagapattinam_frozen_mlc_v1` | Frozen-model coastal-city candidate map; proxy screening | IMAGE | 1 · mlc_class · `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/10_EXPORT_ALL_SIX_FROZEN_MLC_LULC_MAPS_TO_DRIVE) |
| `tn_2020_spectrally_selected_city_frozen_mlc_v1` | Frozen-model coastal-city candidate map; proxy screening | IMAGE | 1 · mlc_class · `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/08_TN_Closest_Spectral_City_Frozen_MLC_Auto_Proxy_2020) (+1) |
| `tn_2020_thoothukudi_frozen_mlc_v1` | Frozen-model coastal-city candidate map; proxy screening | IMAGE | 1 · mlc_class · `EPSG:32644` | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/10_EXPORT_ALL_SIX_FROZEN_MLC_LULC_MAPS_TO_DRIVE) |

**Important:** `chennai_predictor_stack_2010` has **10** reported bands, including `clear_count`; `chennai_predictor_stack_2010_L5L7_exp_v1` has the **nine** expected spectral/index predictor bands. Do not assume the two arrays are interchangeable in classifier fitting.

## 5. Other accessible archive or experimental references (28)

| Asset short name | Type | Image bands | Source context / evidence |
| --- | --- | --- | --- |
| `chennai_08f4a_X3_point_snapshot_v1` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08F4A_1_EXPORT_SNAPSHOT) (+3) |
| `chennai_08f4c_X3_SNIC_frozen_11bands_segments_v1` | IMAGE | 12: blue; green; red; nir; swir1; swir2; NDVI; NDWI; NDBI; segment_NDBI_mean; segment_red_sd; segment_id | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08F4C_2015_FREEZE_SNIC_PREDICTORS) (+1) |
| `chennai_2010_manual_barren_05C4E` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C4E_2010_manual_barren_select_export) (+6) |
| `chennai_2010_passB_candidates_05B` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05B_2010_automated_training) (+2) |
| `chennai_2010_passB_reQA_05C1` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C1_2010_reQA_passB_candidates) (+16) |
| `chennai_2010_rescued_uncertain_05C2A` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C2A_2010_rescue_uncertain_anchors) (+14) |
| `chennai_2010_targeted_expansion_05C3A` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C3A_2010_targeted_expansion_60m_QA) (+13) |
| `chennai_2010_training_candidate_05D1` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05D1_2010_final_training_QA) (+1) |
| `chennai_2010_validation_candidate_05E2C` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05E2C_2010_finalize_validation_candidate) (+1) |
| `chennai_2015_08G3_gaia_assisted_RF_experimental_v1` | IMAGE | 1: candidate | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G3B_2015_RF_GAIA_Support_Audit) (+3) |
| `chennai_admin_study_area` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/CHENNAIboundary) |
| `chennai_gcc_wards_corrected_shapefile` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/CHENNAIboundary) |
| `chennai_mlc_lulc_2010` | IMAGE | 1: classification | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05F1A_2010_MLC_training_sanity_QA) (+5) |
| `chennai_mlc_lulc_2010_manual_v1` | IMAGE | 1: classification | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07G_2010_manual_Gaussian_MLC_v1) (+2) |
| `chennai_mlc_lulc_2010_v2c` | IMAGE | 1: classification | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06E1_2010_V2C_Gaussian_MLC_validation_export) |
| `chennai_training_2010_barren_native_candidates` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07C_2010_native_barren_batch_QA) |
| `chennai_training_2010_final` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05B_2010_automated_training) (+10) |
| `chennai_training_2010_final_v2` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D2_2010_V2_final_training_selection_QA_EXPORT) (+4) |
| `chennai_training_2010_final_v2c_corrected` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D5_2010_V2C_final_correction_QA_EXPORT) (+2) |
| `chennai_training_polygons_2015_v2_clean9` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07U2%20_2015_V2A_TRAINING_GAUSSIAN_MLC) |
| `chennai_transfer_2015_to_2010_QA_05A` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05A_2010_transfer_harmonization_QA) (+18) |
| `chennai_urban_study_area_expanded` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/CHENNAIboundary) |
| `chennai_validation_transfer_2015_to_2010_QA_05E1` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05E1_2010_validation_transfer_QA) (+3) |
| `tnj_2020_assisted_reference_queue_v1` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03C_TNJ_Automated_Reference_Assistance) |
| `tnj_2020_blind_reference_points_v1` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03A_TNJ_Freeze_Reference_Points) (+1) |
| `tnj_2020_blind_subsample_112_v2` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03D_TNJ_Reduced_Validation_Design) (+1) |
| `tnj_2020_manual_checkpoint` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03C_TNJ_Automated_Reference_Assistance) (+1) |
| `tnj_2020_subsample_audit_112_v2` | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03D_TNJ_Reduced_Validation_Design) |

These 28 objects exist under the account used for the audit. They include the earlier 2010 candidate/training branches, SNIC predictor snapshot, GAIA-assisted RF candidate, support boundaries, manual-reference intermediates and transfer-stage tables. **Presence does not mean the assets belong in the reported final series.**

## 6. Seven unresolved code-referenced asset IDs

| Asset short name | Code context / potential reason | Metadata result | First source |
| --- | --- | --- | --- |
| `chennai_2010_barren_expansion_90m_05C3B` | Historical proposed barren expansion; later workflow used other candidate evidence. | NOT_ACCESSIBLE_OR_NOT_FOUND | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C3B_2010_barren_targeted_expansion_90m_QA) |
| `chennai_2020_08G4_gaia_assisted_RF_experimental_v1` | Experimental 2020 RF candidate; not the retained Gaussian MLC baseline. | NOT_ACCESSIBLE_OR_NOT_FOUND | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/8G4_2020_GAIA_Assisted_RF) |
| `chennai_agri_add_2015` | Intermediate manual addition; some scripts use Code Editor imported geometry rather than saved asset. | NOT_ACCESSIBLE_OR_NOT_FOUND | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04B_2015_training_consolidation) |
| `chennai_mlc_lulc_2015_V2A_exp_v1` | 2015 V2A experimental MLC, not original 2015 baseline. | NOT_ACCESSIBLE_OR_NOT_FOUND | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07U2%20_2015_V2A_TRAINING_GAUSSIAN_MLC) |
| `chennai_training_2010_final_v2b_corrected` | Intermediate V2B training correction; V2C branch exists as separate asset. | NOT_ACCESSIBLE_OR_NOT_FOUND | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D4_2010_V2B_correct_Vegetation16_QA_EXPORT) |
| `chennai_water_add_2015` | Intermediate manual addition; some scripts use imported geometry rather than saved asset. | NOT_ACCESSIBLE_OR_NOT_FOUND | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04B_2015_training_consolidation) |
| `thanjavur_reference_2020_independently_labelled` | Early proposed Thanjavur reference output; the separately verified `tnj_2020_reference_112_final_v1` is the reported target reference. | NOT_ACCESSIBLE_OR_NOT_FOUND | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/02_TNJ_2020_Reference_Points) (+2) |

**Resolution policy:** Do not create placeholders or replace a locked asset to make this count reach 69. Verify whether each name was an unexecuted intermediate, a renamed output, a geometry import, or an inaccessible asset. These seven are **not automatically publication-blocking**: none belongs to the 26 critical IDs.

## 7. Accessible GEE operation history (107 succeeded)

`task_operations_20261028_183152.csv` includes **107 operation records**, **all `SUCCEEDED`** and no recorded errors. Records span **18–28 October 2026 UTC**. There are **95 distinct task descriptions**, because several tasks were launched more than once. Each record reports one destination, but the shared CSV does not contain an actual destination URL/ID, so this section stops short of asserting an exact file-to-task bijection.

| Task description | Succeeded records | What it corroborates |
| --- | --- | --- |
| `CHENNAI_2010_08G15_TWO_WAY_SENSITIVITY_ASSET` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `Chennai_08G10_2015_temporal_fusion_CANDIDATE_v1` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `Chennai_08G10_2020_gaia_wc_fusion_CANDIDATE_v1` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `Chennai_08G10_2025_gaia_dw_fusion_CANDIDATE_v1` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `CHENNAI_FUSION_FIVE_MAPS_CLASS_AREA_MANIFEST` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `CHENNAI_2010_ORIGINAL_PROVISIONAL_CLASS_CODES_30M` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `CHENNAI_2010_TWO_WAY_SENSITIVITY_CLASS_CODES_30M` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `CHENNAI_2015_TEMPORAL_FUSION_CLASS_CODES_30M` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `CHENNAI_2020_GAIA_WORLDCOVER_FUSION_CLASS_CODES_30M` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `CHENNAI_2025_GAIA_DYNAMICWORLD_FUSION_CLASS_CODES_30M` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `Chennai_LULC4_2010_FINAL` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `Chennai_LULC4_2015_FINAL` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `Chennai_LULC4_2020_FINAL` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `Chennai_LULC4_2025_FINAL` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `Chennai_RGB_2010` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `Chennai_RGB_2015` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `Chennai_RGB_2020` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `Chennai_RGB_2025` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `MLC2020_ALL_SIX_MAP_CLASS_AREAS_AND_MANIFEST` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `MLC2020_ALL_SIX_PILOT_ROI_GEOMETRIES` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `MLC2020_TNJ_MANUAL_REFERENCE_112_POINTS` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `TNJ_2020_REFERENCE_112_FINAL_V1` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `TNJ2020_B_V3_MAP` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |
| `TNJ2020_C_V2_MAP` | 1 | Candidate/asset or export task reported as succeeded; destination file identity not independently verified |

Other successful operation descriptions include the six Thanjavur/coastal map exports (categorical codes and RGB visualization), the four full-year index numeric exports and twelve coloured index-map exports, historical cell-footprint KML, and intermediate audit/feature tasks. The source CSV should be retained with the research record; do not interpret a successful operation as proof of model accuracy.

## 8. Drive export evidence — grounded in supplied screenshots

**Scope of the screenshot audit:** Folder names and the visible thumbnail/filename labels are transcribed from the supplied images (28–29 October 2026). This does not establish a complete folder listing, Drive file IDs, exact sizes, checksum matches, TIFF CRS, alpha masks, or geospatial pixel alignment. The Google Drive connection for this conversation did not return those folders in a name search; therefore the screenshots and Earth Engine operations are the evidence for Drive exports below.

| Drive folder (user screenshot) | Screenshot evidence | Visible content | Cross-check / limitation |
| --- | --- | --- | --- |
| `Chennai_Fusion_LULC_Maps_2020_Project` | Screenshot 2026-10-29 000013.png | Visible five-map series: 2010 original provisional, 2010 two-way sensitivity, 2015 temporal fusion, 2020 GAIA/WorldCover, 2025 GAIA/Dynamic World. Each appears as coloured map + separate class-coded output; class-area CSV is visible. | Both image-pair task descriptions and class-area manifest operation show `SUCCEEDED`; five-map output identity is strongly corroborated by screenshot, but binary not opened. |
| `Chennai_Gaussian_MLC_Generalisability_Maps_2020` | Screenshot 2026-10-29 000005.png | Six-map set (Thanjavur A/B/C; Cuddalore; Nagapattinam; Thoothukudi), each visible as coloured raster and separate class-coded raster; manual reference, ROI geometry and class-area manifest files visible. | Task records for matching A/B/C/coastal class and RGB maps, manual reference and six-map manifest are `SUCCEEDED`; not pixel-verified. |
| `Chennai_LULC_Final4_Stage08` | Screenshot 2026-10-28 235950.png; 235954.png | Four `Chennai_LULC4_YYYY` TIFF tiles for 2010, 2015, 2020, 2025, plus study-area boundary file. | Corresponding four final/classification export tasks are `SUCCEEDED`; source four-class GEE assets separately return metadata. |
| `Chennai_LULC_Historical_RGB_Stage08` | Screenshot 2026-10-28 235922.png | Four true-colour Landsat TIFFs: `Chennai_RGB_2010.tif`, `Chennai_RGB_2015.tif`, `Chennai_RGB_2020.tif`, `Chennai_RGB_2025.tif`. | Four matching export operations report `SUCCEEDED`. |
| `Chennai_LULC_Report_Index_Maps` | Screenshot 2026-10-28 235902.png; 235911.png; 235915.png | Numeric spectral-index rasters and coloured NDVI/NDWI/NDBI renderings for 2010, 2015, 2020 and 2025; screenshot spans multiple portions of folder. | Four numeric-index and twelve coloured-index operations show `SUCCEEDED`. |
| `Chennai_LULC_Exports` | Screenshot 2026-10-28 235959.png | Earlier training/validation CSV, MLC area/accuracy CSV and classified TIFF-type tiles; exact titles truncated. | Historical export archive evidence only; do not conflate with final four-class or fusion outputs. |
| `Chennai_LULC_Historical_Pixel_Audit` | Screenshot 2026-10-28 235929.png | Two historical site/pixel-footprint audit feature files appear in folder. | Operations `Chennai_08E_FIXED_True30mCell_KML` and `Chennai_08E_Historical_Pixel_Footprints_KML` succeeded. |
| `Chennai_LULC_GEE_ASSETS_BACKUP` | Screenshot 2026-10-28 235939.png; 235945.png | Visible feature/geometry-like backup files and at least two raster-like files. The thumbnails do not establish complete asset equivalence. | Backup evidence only; no checksum or restoration test. |


### Screenshot-only Earth Engine asset browser observations

- `Screenshot 2026-10-28 235731.png` and `235734.png` display the **Cloud Assets** list for `assignment-482806`, including the retained fusion, 2010 sensitivity, four-class and original MLC assets. The list is scrolled in two positions, so screenshots do **not** independently prove a total asset count.
- The Code Editor screenshot visibly lists `chennai_gcc_wards_2025`, but that exact ID is **not among the 69 static lookup IDs**. Treat `projects/assignment-482806/assets/chennai_gcc_wards_2025` as **SCREENSHOT-ONLY / metadata not audited here**, not as a missing asset and not as an accepted study boundary. This is a supplementary discovery, not a 70th item with verified metadata.
- The legacy Code Editor namespace `users/harishravichandran0302` appears empty in the shown browser view. Do not interpret that as proof of deletion of the original saved *scripts*; GitHub independently archives the original 156 Code Editor files.

## 9. Verification still required for a reproducible release

1. **Pixel-level QA:** Run read-only GEE reductions on final four-class, original five-class, and fusion rasters to confirm masks, class domain, spatial transform, aligned 30 m grid and grouped area against report; the metadata lookup did not run these tests.
2. **Training/reference table QA:** Verify actual feature counts and class histograms for 2010/2015/2020/2025 and Thanjavur 112. Table existence alone does not establish the original balance or independence.
3. **Export-content QA:** Download/check at least one representative TIFF from each Drive export family with GIS tools (e.g. GDAL/rasterio) for CRS, transform, nodata, band count and classes; compare against GEE raster or export manifest. Capture file SHA-256s for long-term provenance.
4. **Task-to-file reconciliation:** If exact byte/file provenance is required, query operation destination metadata/Drive file IDs; the uploaded task CSV records task descriptions and count but not destinations.
5. **Resolve seven references by provenance**, not by creating fictional replacement assets. Identify any Code Editor `Import` geometries that were never exported to asset storage.
6. **Review access policy:** the underlying GEE assets may require authentication to `assignment-482806`; a public GitHub repo does not grant public access to those assets.
7. **No 2005 claims:** keep historical 2005 intent separate from demonstrably completed 2010–2025 maps.
8. **Sensitive material:** this manifest includes Earth Engine project and asset IDs, which are identifiers rather than credentials. Review access and any private training/reference data before publishing feature data or raw task logs.

## 10. Complete machine-verified inventory — 69 static asset IDs

This appendix preserves **all 69** evaluated paths, including unresolved paths. All accessible image CRS values returned in the CSV are `EPSG:32644`; the precise transform is not in the supplied metadata records. The research role values are the verification-plan labels, not automatically proven production/adoption statuses.

| Full Earth Engine asset ID | Priority | Research-role label | Metadata | Type | Band count / names | Source mention |
| --- | --- | --- | --- | --- | --- | --- |
| `projects/assignment-482806/assets/chennai_08f4a_X3_point_snapshot_v1` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08F4A_1_EXPORT_SNAPSHOT) (+3) |
| `projects/assignment-482806/assets/chennai_08f4c_X3_SNIC_frozen_11bands_segments_v1` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | IMAGE | 12: blue; green; red; nir; swir1; swir2; NDVI; NDWI; NDBI; segment_NDBI_mean; segment_red_sd; segment_id | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08F4C_2015_FREEZE_SNIC_PREDICTORS) (+1) |
| `projects/assignment-482806/assets/chennai_08g10_2015_temporal_fusion_candidate_v1` | CRITICAL | FUSION_RETAINED | EXISTS | IMAGE | 1: LULC | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G10_Export_Three_Fusion_Candidates) (+4) |
| `projects/assignment-482806/assets/chennai_08g10_2020_gaia_wc_fusion_candidate_v1` | CRITICAL | FUSION_RETAINED | EXISTS | IMAGE | 1: LULC | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G10_Export_Three_Fusion_Candidates) (+3) |
| `projects/assignment-482806/assets/chennai_08g10_2025_gaia_dw_fusion_candidate_v1` | CRITICAL | FUSION_RETAINED | EXISTS | IMAGE | 1: LULC | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G10_Export_Three_Fusion_Candidates) (+3) |
| `projects/assignment-482806/assets/chennai_08g15_2010_two_way_fusion_sensitivity_v1` | HIGH | SENSITIVITY_ONLY | EXISTS | IMAGE | 1: lulc_class | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/11_CHENNAI_STAGE08G15_RECOVER_2010_FUSION_AND_EXPORT_FIVE_LULC_MAPS) |
| `projects/assignment-482806/assets/chennai_2010_barren_expansion_90m_05C3B` | REVIEW | UNCLASSIFIED_REFERENCE | UNRESOLVED | Not returned | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C3B_2010_barren_targeted_expansion_90m_QA) |
| `projects/assignment-482806/assets/chennai_2010_manual_barren_05C4E` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C4E_2010_manual_barren_select_export) (+6) |
| `projects/assignment-482806/assets/chennai_2010_passB_candidates_05B` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05B_2010_automated_training) (+2) |
| `projects/assignment-482806/assets/chennai_2010_passB_reQA_05C1` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C1_2010_reQA_passB_candidates) (+16) |
| `projects/assignment-482806/assets/chennai_2010_rescued_uncertain_05C2A` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C2A_2010_rescue_uncertain_anchors) (+14) |
| `projects/assignment-482806/assets/chennai_2010_targeted_expansion_05C3A` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C3A_2010_targeted_expansion_60m_QA) (+13) |
| `projects/assignment-482806/assets/chennai_2010_training_candidate_05D1` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05D1_2010_final_training_QA) (+1) |
| `projects/assignment-482806/assets/chennai_2010_validation_candidate_05E2C` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05E2C_2010_finalize_validation_candidate) (+1) |
| `projects/assignment-482806/assets/chennai_2015_08G3_gaia_assisted_RF_experimental_v1` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | IMAGE | 1: candidate | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/08G3B_2015_RF_GAIA_Support_Audit) (+3) |
| `projects/assignment-482806/assets/chennai_2020_08G4_gaia_assisted_RF_experimental_v1` | REVIEW | UNCLASSIFIED_REFERENCE | UNRESOLVED | Not returned | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage8/8G4_2020_GAIA_Assisted_RF) |
| `projects/assignment-482806/assets/chennai_admin_study_area` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/CHENNAIboundary) |
| `projects/assignment-482806/assets/chennai_admin_study_area_clean` | CRITICAL | ROI | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/01_stage1_to_stage4_2025_master) (+106) |
| `projects/assignment-482806/assets/chennai_agri_add_2015` | REVIEW | UNCLASSIFIED_REFERENCE | UNRESOLVED | Not returned | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04B_2015_training_consolidation) |
| `projects/assignment-482806/assets/chennai_gcc_wards_corrected_shapefile` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/CHENNAIboundary) |
| `projects/assignment-482806/assets/chennai_lulc4_2010_L5L7_provisional_v1` | CRITICAL | FOUR_CLASS | EXISTS | IMAGE | 1: classification | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AC5_FINAL_FOUR_CLASS_EXPORT_ALL_YEARS) (+1) |
| `projects/assignment-482806/assets/chennai_lulc4_2015_v1` | CRITICAL | FOUR_CLASS | EXISTS | IMAGE | 1: classification | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AC5_FINAL_FOUR_CLASS_EXPORT_ALL_YEARS) (+2) |
| `projects/assignment-482806/assets/chennai_lulc4_2020_v1` | CRITICAL | FOUR_CLASS | EXISTS | IMAGE | 1: classification | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AC5_FINAL_FOUR_CLASS_EXPORT_ALL_YEARS) (+1) |
| `projects/assignment-482806/assets/chennai_lulc4_2025_v1` | CRITICAL | FOUR_CLASS | EXISTS | IMAGE | 1: classification | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/07AC4_VERIFY_RECOVERED_2025_TIFF) (+2) |
| `projects/assignment-482806/assets/chennai_mlc_lulc_2010` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | IMAGE | 1: classification | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05F1A_2010_MLC_training_sanity_QA) (+5) |
| `projects/assignment-482806/assets/chennai_mlc_lulc_2010_L5L7_manual_exp_v1` | CRITICAL | PROVISIONAL_BASELINE | EXISTS | IMAGE | 1: classification | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AB_FINAL_BUILTUP_DISCREPANCY_ATTRIBUTION_2010_2015) (+16) |
| `projects/assignment-482806/assets/chennai_mlc_lulc_2010_manual_v1` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | IMAGE | 1: classification | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07G_2010_manual_Gaussian_MLC_v1) (+2) |
| `projects/assignment-482806/assets/chennai_mlc_lulc_2010_v2c` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | IMAGE | 1: classification | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06E1_2010_V2C_Gaussian_MLC_validation_export) |
| `projects/assignment-482806/assets/chennai_mlc_lulc_2015` | CRITICAL | BASELINE | EXISTS | IMAGE | 1: classification | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04J_2015_gaussian_mlc) (+27) |
| `projects/assignment-482806/assets/chennai_mlc_lulc_2015_V2A_exp_v1` | REVIEW | UNCLASSIFIED_REFERENCE | UNRESOLVED | Not returned | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07U2%20_2015_V2A_TRAINING_GAUSSIAN_MLC) |
| `projects/assignment-482806/assets/chennai_mlc_lulc_2020` | CRITICAL | BASELINE | EXISTS | IMAGE | 1: classification | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/02_stage5_temporal_transfer) (+11) |
| `projects/assignment-482806/assets/chennai_mlc_lulc_2025_from_original_tif` | CRITICAL | BASELINE_RECOVERED | EXISTS | IMAGE | 1: b1 | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/07AC4_VERIFY_RECOVERED_2025_TIFF) (+5) |
| `projects/assignment-482806/assets/chennai_predictor_stack_2010` | HIGH | HISTORICAL | EXISTS | IMAGE | 10: blue; green; red; nir; swir1; swir2; NDVI; NDWI; NDBI; clear_count | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05C0_2010_materialize_predictor_stack) (+45) |
| `projects/assignment-482806/assets/chennai_predictor_stack_2010_L5L7_exp_v1` | CRITICAL | PREDICTOR | EXISTS | IMAGE | 9: blue; green; red; nir; swir1; swir2; NDVI; NDWI; NDBI | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/08_REPORT_NDVI_NDWI_NDBI_ALL_YEARS) (+11) |
| `projects/assignment-482806/assets/chennai_training_2010_L5L7_manual_exp_v1` | CRITICAL | TRAINING | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07AB_FINAL_BUILTUP_DISCREPANCY_ATTRIBUTION_2010_2015) (+5) |
| `projects/assignment-482806/assets/chennai_training_2010_barren_native_candidates` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07C_2010_native_barren_batch_QA) |
| `projects/assignment-482806/assets/chennai_training_2010_final` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05B_2010_automated_training) (+10) |
| `projects/assignment-482806/assets/chennai_training_2010_final_v2` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D2_2010_V2_final_training_selection_QA_EXPORT) (+4) |
| `projects/assignment-482806/assets/chennai_training_2010_final_v2b_corrected` | REVIEW | UNCLASSIFIED_REFERENCE | UNRESOLVED | Not returned | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D4_2010_V2B_correct_Vegetation16_QA_EXPORT) |
| `projects/assignment-482806/assets/chennai_training_2010_final_v2c_corrected` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/06D5_2010_V2C_final_correction_QA_EXPORT) (+2) |
| `projects/assignment-482806/assets/chennai_training_2010_manual_final_v1` | HIGH | HISTORICAL_TRAINING | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07F_2010_manual_balanced_training_v1) (+9) |
| `projects/assignment-482806/assets/chennai_training_2010_native_allclasses_v1` | HIGH | MANUAL_INPUT | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07D_2010_all_classes_candidate_QA) (+2) |
| `projects/assignment-482806/assets/chennai_training_2015_final` | CRITICAL | TRAINING | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04D_2015_finalize_training) (+23) |
| `projects/assignment-482806/assets/chennai_training_2020_final` | CRITICAL | TRAINING | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/02_stage5_temporal_transfer) (+18) |
| `projects/assignment-482806/assets/chennai_training_polygons_2015_v2_clean9` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07U2%20_2015_V2A_TRAINING_GAUSSIAN_MLC) |
| `projects/assignment-482806/assets/chennai_training_polygons_2025_master` | CRITICAL | SOURCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/01_stage1_to_stage4_2025_master) (+5) |
| `projects/assignment-482806/assets/chennai_transfer_2015_to_2010_QA_05A` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05A_2010_transfer_harmonization_QA) (+18) |
| `projects/assignment-482806/assets/chennai_urban_study_area_expanded` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/CHENNAIboundary) |
| `projects/assignment-482806/assets/chennai_validation_2010_final` | CRITICAL | VALIDATION | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05E2D_2010_finalize_validation) (+28) |
| `projects/assignment-482806/assets/chennai_validation_2015_final` | CRITICAL | VALIDATION | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04I_2015_finalize_validation) (+17) |
| `projects/assignment-482806/assets/chennai_validation_2020_final` | CRITICAL | VALIDATION | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/02_stage5_temporal_transfer) (+13) |
| `projects/assignment-482806/assets/chennai_validation_polygons_2010_manual_master` | HIGH | MANUAL_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/stage7/07A_2010_V2_manual_training_audit) (+7) |
| `projects/assignment-482806/assets/chennai_validation_polygons_2025_master` | CRITICAL | SOURCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/01_stage1_to_stage4_2025_master) (+5) |
| `projects/assignment-482806/assets/chennai_validation_transfer_2015_to_2010_QA_05E1` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/05E1_2010_validation_transfer_QA) (+3) |
| `projects/assignment-482806/assets/chennai_water_add_2015` | REVIEW | UNCLASSIFIED_REFERENCE | UNRESOLVED | Not returned | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/04B_2015_training_consolidation) |
| `projects/assignment-482806/assets/thanjavur_mlc_transfer_2020_frozen_chennai` | CRITICAL | TRANSFER_BASELINE | EXISTS | IMAGE | 1: mapped_class | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/01_TNJ_2020_Frozen_MLC) (+11) |
| `projects/assignment-482806/assets/thanjavur_reference_2020_independently_labelled` | REVIEW | UNCLASSIFIED_REFERENCE | UNRESOLVED | Not returned | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/02_TNJ_2020_Reference_Points) (+2) |
| `projects/assignment-482806/assets/tn_2020_nagapattinam_frozen_mlc_v1` | HIGH | COASTAL_PROXY | EXISTS | IMAGE | 1: mlc_class | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/10_EXPORT_ALL_SIX_FROZEN_MLC_LULC_MAPS_TO_DRIVE) |
| `projects/assignment-482806/assets/tn_2020_spectrally_selected_city_frozen_mlc_v1` | HIGH | COASTAL_PROXY | EXISTS | IMAGE | 1: mlc_class | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/08_TN_Closest_Spectral_City_Frozen_MLC_Auto_Proxy_2020) (+1) |
| `projects/assignment-482806/assets/tn_2020_thoothukudi_frozen_mlc_v1` | HIGH | COASTAL_PROXY | EXISTS | IMAGE | 1: mlc_class | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/10_EXPORT_ALL_SIX_FROZEN_MLC_LULC_MAPS_TO_DRIVE) |
| `projects/assignment-482806/assets/tnj_2020_assisted_reference_queue_v1` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03C_TNJ_Automated_Reference_Assistance) |
| `projects/assignment-482806/assets/tnj_2020_blind_reference_points_v1` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03A_TNJ_Freeze_Reference_Points) (+1) |
| `projects/assignment-482806/assets/tnj_2020_blind_subsample_112_v2` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03D_TNJ_Reduced_Validation_Design) (+1) |
| `projects/assignment-482806/assets/tnj_2020_experiment_B_source_months_v3` | CRITICAL | TRANSFER_EXPERIMENT | EXISTS | IMAGE | 1: experiment_B_class | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/06B_TNJ_2020_Source_Month_Matching) (+1) |
| `projects/assignment-482806/assets/tnj_2020_experiment_C_quantile_align_v2` | CRITICAL | TRANSFER_EXPERIMENT | EXISTS | IMAGE | 1: experiment_C_class | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/06C_TNJ_2020_Quantile_Harmonisation_V2) (+2) |
| `projects/assignment-482806/assets/tnj_2020_manual_checkpoint` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03C_TNJ_Automated_Reference_Assistance) (+1) |
| `projects/assignment-482806/assets/tnj_2020_reference_112_final_v1` | CRITICAL | TARGET_VALIDATION | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03E_TNJ_2020_Review_Remaining_91) (+9) |
| `projects/assignment-482806/assets/tnj_2020_subsample_audit_112_v2` | REVIEW | UNCLASSIFIED_REFERENCE | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/03D_TNJ_Reduced_Validation_Design) |
| `projects/assignment-482806/assets/tnj_city_trace_pilot_roi_2020` | CRITICAL | TARGET_ROI | EXISTS | TABLE | — | [source](https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/tnjregion/01_TNJ_2020_Frozen_MLC) (+17) |

## 11. Source audit trail and regeneration

The entries above derive from these uploaded evidence files:

- `asset_metadata_20261028_182805.csv` — 53,903 bytes, SHA-256 `0190b590afc54960e85f516e8aad7e08f60693b0786dd9d776795364140278fa`.
- `asset_metadata_20261028_183152.csv` — 53,903 bytes, SHA-256 `0190b590afc54960e85f516e8aad7e08f60693b0786dd9d776795364140278fa`.
- `task_operations_20261028_183152.csv` — 19,133 bytes, SHA-256 `8a6b3cb1bcf9c5e7ade6ecd124702ddda8a71bc8e54de4ad2b4a672647b0d229`.
- `asset_summary_20261028_182805.md` — 2,038 bytes, SHA-256 `00b68452513acf3ec3d739d5876327a9ceb82ddcfaa25eea2bb8fa69e53fbc88`.
- `asset_summary_20261028_183152.md` — 2,157 bytes, SHA-256 `ad5e7274f8aa60df3a42e5446967ddcf012ec6b1a6cc18e2ead55d7f2bf0398a`.

- Screenshots: 14 PNG files dated 28–29 October 2026, including 2 Code Editor asset-panel captures and 12 Google Drive captures. The screenshot evidence is descriptive and not embedded in this Markdown manifest.
- GitHub code/manual reference: [`docs/CODE_MANUAL.md`](CODE_MANUAL.md), [`docs/CURATED_GEE_MANIFEST.csv`](CURATED_GEE_MANIFEST.csv), [`scripts/gee/EXECUTION_ORDER.md`](../scripts/gee/EXECUTION_ORDER.md), and archived `stage7`, `stage8` and `tnjregion` GEE scripts.
- This document was assembled offline from uploaded audit CSVs, screenshot inspection and repository source; **no new Earth Engine classification or export task was executed during its preparation**.

### Publication / GitHub placement

Save as `docs/ASSET_MANIFEST_VERIFIED.md` and link it from the repository README. Keep the raw task CSV locally unless you intentionally want to publish the full operation history. For a reproducibility update, retain a new timestamped metadata audit rather than overwriting the earlier evidence.


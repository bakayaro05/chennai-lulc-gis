# Reported research results — Chennai multi-temporal LULC

This folder stores compact **source-transcribed quantitative results** from the authoritative 103-page `Chennai_LULC_Report_With_Fusion_Maps.pdf` and the locked application scientific catalogue. No data were reclassified or remotely recomputed during this extraction. Keep the report table number, **PDF page number**, class schema, denominator and design limitation attached to any use of these CSVs.

## Main recorded summary tables

| File | Scientific meaning |
|---|---|
| [`chennai_accuracy.csv`](chennai_accuracy.csv) | Original five-class Gaussian MLC accuracy vs derived four-class reporting OA, 2010 provisional / 2015 / 2020 / 2025 |
| [`chennai_four_class_areas.csv`](chennai_four_class_areas.csv) | Archived GEE `pixelArea` results for **original four-class reporting**, not fused five-class maps |
| [`fusion_2010_sensitivity.csv`](fusion_2010_sensitivity.csv) | **Table 8.8** original/add-only/two-way 2010 sensitivities; includes the report's mapped areas, false positives and recall; original remains reported baseline |
| [`transferability_2020.csv`](transferability_2020.csv) | Exact previously recorded 112-point Thanjavur area-adjusted OA and three-city **automatic proxy agreement**, which are not comparable validation designs |

## Additional transcribed tables from final report

| File | Source in authoritative PDF | Main caution |
|---|---|---|
| [`reported/original_four_class_builtup_flows_table6_2.csv`](reported/original_four_class_builtup_flows_table6_2.csv) | Table 6.2, PDF p40 | Original four-class transitions; 2010–2015 provisional |
| [`reported/fusion_validation_table8_6.csv`](reported/fusion_validation_table8_6.csv) | Table 8.6, PDF p60 | Paired **reused** validation points; 2025 uses **new clustered sample 250/300**, not the archived official 251/300 |
| [`reported/2010_raster_lineage_table8_7.csv`](reported/2010_raster_lineage_table8_7.csv) | Table 8.7, PDF p61 | Distinguishes official provisional L5/L7 2010 from older incompatible branches |
| [`reported/five_class_fusion_areas_table8_9.csv`](reported/five_class_fusion_areas_table8_9.csv) | Table 8.9, PDF p62 | **Five classes**, 2010 original followed by 2015/20/25 fusion candidates |
| [`reported/fusion_builtup_change_table8_10.csv`](reported/fusion_builtup_change_table8_10.csv) | Table 8.10, PDF p63 | Alternate 2010 two-way **net** only; no gross transition for two-way calculated |
| [`reported/fusion_fiveclass_gain_loss_table8_11.csv`](reported/fusion_fiveclass_gain_loss_table8_11.csv) | Table 8.11, PDF pp64–65 | Mapped gross gain/loss, **not error-adjusted physical conversions** |
| [`reported/thanjavur_manual_abc_table10_4.csv`](reported/thanjavur_manual_abc_table10_4.csv) | Table 10.4, PDF p79 | 112 manually referenced points; original A area weights, exploratory B/C |
| [`reported/coastal_proxy_agreement_table10_7.csv`](reported/coastal_proxy_agreement_table10_7.csv) | Table 10.7, PDF p84 | Product-consensus agreement on eligible subsets, **not independent target classification OA** |
| [`reported/transfer_six_experiment_areas_table10_8.csv`](reported/transfer_six_experiment_areas_table10_8.csv) | Table 10.8, PDF p86 | Mapped class areas for Thanjavur A/B/C + three pilot cities; **not validation scores** |

## Original-versus-fusion distinction

- **Original four-class mapped series:** [`chennai_four_class_areas.csv`](chennai_four_class_areas.csv), [Fig. 6.1](../figures/report_exports/original_fourclass_composition_fig6_1.jpeg).
- **Five-class reported fusion series:** [`five_class_fusion_areas_table8_9.csv`](reported/five_class_fusion_areas_table8_9.csv), [Fig. 8.9](../figures/report_exports/reported_series_maps_fig8_9.jpeg).
- **2010 two-way sensitivity only:** [`fusion_2010_sensitivity.csv`](fusion_2010_sensitivity.csv), [Fig. 8.10](../figures/report_exports/2010_original_vs_two_way_fig8_10.jpeg).

The corrected series promotes selected class-4/5 pixels to Built-up in 2015, 2020 and 2025 without Gaussian retraining; the **reported 2010 panel is not corrected**. Mapped quantities do not establish the physical area of real land-cover conversion.

## Area, versioning, and evidence conventions

- Fixed study-area boundary ~**529.450838 km²**; archived GEE mapped/pixelArea ~**529.7711 km²**; local 30 m whole-cell mapped area **532.8351 km²**. Do not conflate these measurement bases.
- Five-class original and four-class aggregated accuracy use **different label schemas**. The reported five-class fusion areas are **not** four-class application raster totals.
- The 2025 original official Gaussian OA was **251/300 = 83.67%** on archived references. Table 8.6 re-evaluated a **different** 300-point sample: **250/300 = 83.33%** original and **254/300 = 84.67%** fused. Do not silently substitute 84.67% for the official original MLC figure.
- 2005 classification remains unverified; no future LULC prediction.
- To reproduce results, consult [`docs/CODE_MANUAL.md`](../docs/CODE_MANUAL.md) and [`data/`](../data/README.md). The result CSVs are **transcriptions of reported numbers**, not freshly rerun exports or independent revalidation.

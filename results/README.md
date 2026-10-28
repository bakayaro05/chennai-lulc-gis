# Results index — Chennai multi-temporal LULC

This folder is intentionally for **small, human-readable and machine-readable summaries of previously recorded findings**. It is **not** a directory of output GeoTIFFs, training datasets, full-size maps, or newly rerun model predictions. All figures below are transcribed from the recorded project workflow and its [Code Manual](../docs/CODE_MANUAL.md); the CSV files do not independently recompute validation metrics.

## Files

| File | Contents | Source and interpretation |
|---|---|---|
| [`chennai_accuracy.csv`](chennai_accuracy.csv) | Original five-class Gaussian MLC accuracy and derived four-class reporting accuracy for 2010, 2015, 2020, 2025 | [Code Manual §3.2–3.3](../docs/CODE_MANUAL.md); 2010 remains provisional; four-class merging is not new classifier training. |
| [`chennai_four_class_areas.csv`](chennai_four_class_areas.csv) | Archived GEE `pixelArea` four-class areas in km² | [Application catalog](../app/backend/catalog.py) / [local audit](../app/docs/milestone0_audit.json); *not* local whole-cell counts. |
| [`fusion_2010_sensitivity.csv`](fusion_2010_sensitivity.csv) | Separate 2010 original, add-only, two-way validation outcomes | [Research lineage](../docs/RESEARCH_LINEAGE.md) / [Code Manual §3.6](../docs/CODE_MANUAL.md); two-way is **sensitivity only**, never the official reported 2010 map. |
| [`transferability_2020.csv`](transferability_2020.csv) | Thanjavur frozen-model variants A/B/C and coastal automatic product agreement | [Research lineage](../docs/RESEARCH_LINEAGE.md) / [Code Manual §6](../docs/CODE_MANUAL.md). **These are different evaluation protocols** and must not be ranked together as independent classification accuracy. |

## Representative recorded findings

| Year | Original **five-class** overall accuracy | Derived **four-class** overall accuracy |
|---|---:|---:|
| 2010 (provisional) | 69.33% (208/300) | 81.00% |
| 2015 | 85.67% (257/300) | 88.67% |
| 2020 | 86.33% (259/300) | 95.67% |
| 2025 | 83.67% (251/300) | 96.67% |

For the separately studied **2010 two-way fusion sensitivity**, accuracy was 71.33% versus 69.33% for the original 2010 baseline. It is not substituted into the reported time series.

In **Thanjavur** (112 manually interpreted reference locations), 2020 frozen-model **area-adjusted** overall accuracies were 23.1854% (A direct), 20.6625% (B season matched), and 35.9444% (C quantile harmonisation). The C–A estimate was +12.759 percentage points; the archived approximate confidence interval does not fully account for reference uncertainty or spatial dependence. Cuddalore, Nagapattinam and Thoothukudi use **automated proxy agreement** on partially covered areas, **not manually validated accuracy**.

## Area conventions and raster limitations

- **Fixed Chennai study-area vector:** approximately **529.450838 km²**.
- **Archived GEE class-area sum:** approximately **529.7711 km²**, depending on year-specific decimal rounding.
- **Local whole-cell GeoTIFF class-area sum:** **532.8351 km²** for each of the four app rasters (592,039 mapped cells × 0.0009 km²); **not** a replacement for archived GEE area statistics.
- An earlier **528.785508 km²** mask diagnostic was classified in Stage 07AE as a mask-as-value underestimate; independent reconciliation of all measurement conventions is still pending.
- The four classified rasters passed real-data API integration checks in the user's final local project. Their overview-pyramid interpolation method remains **unverified** from available metadata, despite valid COG structure and consistent full-resolution grids.
- App display rasters use class IDs **1–4**; background `0` is **not** a land-cover category. Original scientific model source rasters have **five** class IDs.

## Where are the maps and raster outputs?

Large raster exports are **deliberately not committed to GitHub**. The retained source Earth Engine assets and limited verified metadata are listed in the [asset manifest](../docs/ASSET_MANIFEST_VERIFIED.md); final app inputs (four LULC GeoTIFFs, four historical RGBA GeoTIFFs and one boundary GeoJSON) are documented in the [application README](../app/README.md). Google Drive screenshots and operation records provide export evidence but **do not prove file hashes or complete independent pixel verification**.

To add future tables here: preserve the original products; document their source script/asset, validation design, units, class schema, denominator and whether values are official, exploratory, or proxy-only. Do not upload credentials, large GeoTIFFs or unverified future predictions.

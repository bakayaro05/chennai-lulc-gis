# Data catalogue — Chennai LULC research

This is the repository's **data discovery and provenance directory**, not a claim that all Earth Engine research assets have been publicly exported. A checked subset of original Stage 08 application inputs and reference samples is now available as versioned GitHub Release attachments; the app's binary runtime inputs remain excluded from the **Git source tree**. Other historical exports, fusion-candidate rasters and GEE FeatureCollections may remain external or access-controlled.

## Published checked dataset — v1.0.0

- [Chennai LULC Dataset v1.0.0](https://github.com/bakayaro05/chennai-lulc-gis/releases/tag/dataset-v1.0.0) — 33 individually attached files, including nine original Stage 08 runtime inputs, 17 reference exports, and seven documentation/checksum/verification files.
- [Pinned file manifest](https://github.com/bakayaro05/chennai-lulc-gis/releases/download/dataset-v1.0.0/dataset_file_manifest.csv) · [SHA256SUMS](https://github.com/bakayaro05/chennai-lulc-gis/releases/download/dataset-v1.0.0/SHA256SUMS.txt) · [Verifier](https://github.com/bakayaro05/chennai-lulc-gis/releases/download/dataset-v1.0.0/verify_chennai_dataset_v1.py) · [QA report](https://github.com/bakayaro05/chennai-lulc-gis/releases/download/dataset-v1.0.0/CHENNAI_DATASET_V1_QA_REPORT.md).
- Download all release assets into an empty folder, verify with `python verify_chennai_dataset_v1.py --flat . --manifest dataset_file_manifest.csv`, then restore the folder layout with the same command plus `--reconstruct restored`. Copy only `boundary/`, `lulc4/` and `satellite/` into `app/data/raw/`, preserving filenames. The `samples/` references are research evidence rather than runtime requirements.
- Read the QA report before reuse: the original 2010 classification is provisional; 2025 source-polygon overlaps and approximately 30 m separation concerns for three 2015 validation points must be disclosed. The 2025 sampled CSVs do not contain exact point coordinates.

## Included manifests

| File | What it records | Evidence and limitations |
|---|---|---|
| [`manifests/gee_asset_inventory_2026-10-28.csv`](manifests/gee_asset_inventory_2026-10-28.csv) | **69 code-derived GEE asset IDs** and their actual 28 October metadata-audit status; includes 62 accessible (25 image, 37 table) and 7 unresolved | Metadata snapshot only; **not** a raster export, checksum validation, pixel/class accuracy check or an access grant |
| [`manifests/drive_export_folder_evidence.csv`](manifests/drive_export_folder_evidence.csv) | **8 screenshot-evidenced Google Drive export folders** and visible output types | Names observed in screenshots and corroborated by task descriptions where possible; **no Drive URLs or per-file hashes verified** |
| [`manifests/app_required_inputs.csv`](manifests/app_required_inputs.csv) | The **nine exact files** required to run the FastAPI application, their roles and relative local paths | Four categorical GeoTIFFs, four historical RGB TIFFs and one true boundary GeoJSON; binary files are not committed |
| [`manifests/source_file_checksums_template.csv`](manifests/source_file_checksums_template.csv) | Empty checksum/download-identity form for original exports | Deliberately blank until actual files are examined |

The primary documentation for the GEE snapshot is [`docs/ASSET_MANIFEST_VERIFIED.md`](../docs/ASSET_MANIFEST_VERIFIED.md). The report-derived quantitative outputs are under [`results/reported/`](../results/reported/); original scientific figures extracted unchanged from the authoritative report are in [`figures/report_exports/`](../figures/report_exports/).

## Meaning of `data/` and `app/data/raw/`

- `data/` here is the **public, lightweight dataset catalogue**.
- `app/data/raw/lulc4/` is where the FastAPI backend expects the four local **four-class** rasters.
- `app/data/raw/satellite/` expects four **historical Landsat RGB + alpha** rasters.
- `app/data/raw/boundary/` expects the true clean study-area GeoJSON.
- The five-class post-classification fusion maps, Thanjavur/city exports, reference tables and NDVI/NDWI/NDBI imagery are **additional research products**, not substitutes for the app's nine original runtime inputs.

## How to obtain/publish complete exports

1. Obtain the exact exported files from the researcher's GEE/Google Drive account; check access and third-party license terms before distributing. The folders listed in the CSV were visible in prior screenshots; no publicly accessible folder URLs were verified.
2. Inventory actual local exports using [`tools/inventory_local_exports.py`](../tools/inventory_local_exports.py), which records file sizes and SHA-256 hashes without changing the files. Store the resulting file-level manifest in a versioned, reviewed location **only after checking filenames and paths for sensitive information**.
3. The checked Stage 08 subset has already been published as [Dataset v1.0.0](https://github.com/bakayaro05/chennai-lulc-gis/releases/tag/dataset-v1.0.0), with file-specific hashes. Any **additional** historical exports not included in this release require separate file-identity, licensing, permissions and publication checks; do not infer that every original GEE asset is publicly downloadable.
4. If full third-party data redistribution is not permitted, publish the analysis script, asset ID and acquisition/access instructions instead. **GEE asset IDs alone are not downloadable files.**

## Data integrity conventions

The study-area vector area is ~529.450838 km², the archived GEE `pixelArea` mapped total ~529.7711 km², and the app's local whole-cell raster area 532.8351 km². These are different measurement conventions. The 2010 original MLC is provisional; the 2010 two-way map is sensitivity only; 2015–2025 fusion candidates are five-class post-classification corrections; **no verified 2005 completed classification is claimed**. See the [Code Manual](../docs/CODE_MANUAL.md).

**Policy:** Never commit `.env`, tokens, credentials, full-resolution imagery or datasets whose ownership/redistribution status has not been checked. The source inventory includes asset IDs but grants no public Earth Engine access.

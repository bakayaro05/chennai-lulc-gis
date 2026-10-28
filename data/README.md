# Data catalogue — Chennai LULC research

This is the repository's **data discovery and provenance directory**, not a claim that all research rasters have been uploaded here. The original classification GeoTIFFs, RGBA composites, five-class fusion candidate exports and GEE FeatureCollections remain **external binary datasets** unless separately deposited and verified. The local runtime data for the interactive app are excluded from GitHub.

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
3. Publish large datasets separately, preferably as a versioned GitHub Release asset or an appropriate research data repository (e.g., Zenodo) once licensing and permissions are confirmed. Fill in the blank verified URLs/hashes in a future manifest revision; **do not invent working download links**.
4. If full third-party data redistribution is not permitted, publish the analysis script, asset ID and acquisition/access instructions instead. **GEE asset IDs alone are not downloadable files.**

## Data integrity conventions

The study-area vector area is ~529.450838 km², the archived GEE `pixelArea` mapped total ~529.7711 km², and the app's local whole-cell raster area 532.8351 km². These are different measurement conventions. The 2010 original MLC is provisional; the 2010 two-way map is sensitivity only; 2015–2025 fusion candidates are five-class post-classification corrections; **no verified 2005 completed classification is claimed**. See the [Code Manual](../docs/CODE_MANUAL.md).

**Policy:** Never commit `.env`, tokens, credentials, full-resolution imagery or datasets whose ownership/redistribution status has not been checked. The source inventory includes asset IDs but grants no public Earth Engine access.

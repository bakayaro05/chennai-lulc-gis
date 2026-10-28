# Dataset and results expansion — provenance note

<!-- experiments-v1.0.0:begin -->
## Current public report edition (separate from original research evidence)

The report PDF at `report/Chennai_LULC_Report_With_Fusion_Maps.pdf` has been replaced with a **revised public edition** exported from the author's `Github_REPORT.docx`. The older **103-page** report with SHA-256 `75f71b75d1af5a41ef4d84911c8b4678efb1d80530719fe736687b03b22bdca6` remains the fixed provenance basis of the transcribed result CSVs and four original figure JPEGs. Their historic source page numbers have **not** been remapped to the revised edition. This change does not constitute a new validation or reclassification. The revised PDF SHA-256 is recorded in `report/SHA256SUMS.txt`.
<!-- experiments-v1.0.0:end -->


**Basis:** 103-page authoritative `Chennai_LULC_Report_With_Fusion_Maps.pdf` (PDF SHA-256 `75f71b75d1af5a41ef4d84911c8b4678efb1d80530719fe736687b03b22bdca6`), verified locally against supplied source images and the 28 October 2026 GEE metadata audit. No Earth Engine computation was rerun and no Drive TIFF bytes were downloaded in preparing this repository supplement.

## Included

- Nine detailed CSV transcriptions from report Tables 6.2, 8.6, 8.7, 8.9, 8.10, 8.11, 10.4, 10.7 and 10.8; a refined 2010 sensitivity CSV includes the report's 308.47 km² add-only figure.
- Four **unmodified report-embedded** JPEG images (Fig. 6.1, 8.8, 8.9 and 8.10), with image provenance.
- All 69 static asset records from `asset_metadata_20261028_183152.csv`, which reported 62 metadata-accessible and seven unresolved GEE assets; see original `docs/ASSET_MANIFEST_VERIFIED.md` for evidence caveats.
- Eight Drive folder names and observed export types **transcribed from uploaded screenshots** (not live Drive API verification or working external share URLs).
- Exact nine runtime file names for the app and an optional local file-inventory script to compute actual sizes/checksums after copying or downloading them.

## Not included or asserted

- No newly downloaded remote GeoTIFFs, Google Drive source files, asset content bytes, or transferable Earth Engine permissions.
- No invented URLs, SHA-256 values, validation metrics, 2005 accepted map, or undocumented export completions.
- No report-derived numbers replaced the backend's approved scientific values.

## Unresolved

- **Historical GeoTIFF overviews:** the metadata do not record categorical resampling algorithm; the four local TIFFs had COG/LZW/overviews, but method cannot be certified from metadata alone.
- **Area bases:** GEE ~529.7711 km² versus local whole-cell 532.8351 km², plus fixed vector 529.4508 km²; preserve documented mismatch.
- **Actual remote downloads:** exact per-file names, hashes, ownership and public access require local export inventory before publishing full datasets.

Do not commit raw files or publish a dataset DOI until rights and exact file identities are validated.

# Chennai LULC GIS — Stage 08 validated Milestone 0

Four original user-provided TIFFs are in `data/raw/lulc4/`; they are unmodified.
The validation utility is `tools/audit_rasters.py`.

## On Windows PowerShell

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install numpy rasterio
.\.venv\Scripts\python.exe .\tools\audit_rasters.py
```

Expected: basic structural QA passes. See `docs/milestone0_audit.json` for measured counts and matrices.

## Scientific status

- 2010 remains PROVISIONAL.
- All TIFFs declare -9999 NoData, but also have a substantial **0-valued background**. The 0 background must be explicitly excluded from class calculations and drawn transparently.
- Official GEE class-area tables and transition matrices remain the published data; the local whole-cell pixel area has a different measurement basis and does not exactly equal the official measurements.
- The 528.785508 km2 separate GEE mask diagnostic is not yet resolved.
- The official study boundary GeoJSON is NOT in this package: it must be exported separately from the `chennai_admin_study_area_clean` asset.

## Progress

Milestone 0: file integrity checked; raster metadata and pixel-alignment passed; area weighting reconciliation and exact ROI boundary pending.
Milestones 1–5: not implemented.

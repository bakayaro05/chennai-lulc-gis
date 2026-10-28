# Chennai LULC GIS — Stage 08 Interactive Application

> **Source-preserving GitHub import.** This directory contains the completed Stage 08 FastAPI + React/Leaflet application as imported from the local Windows project. The scientific raster inputs are **not stored in GitHub**. This guide documents the observed source code and required local setup; it does not claim a fresh runtime test was performed during GitHub import.

## 1. What the application does

The application displays historical four-class Chennai land-use/land-cover (LULC) rasters for **2010, 2015, 2020, and 2025**, with year selection, timelapse playback, raster transparency, local pixel inspection, boundary overlay, classification and historical-Landsat RGB modes, and a combined historical RGB + LULC view. The original raster's 2010 classification is **provisional**. A completed/accepted 2005 map is not represented in this version, and the app does not forecast land cover.

- **Backend:** FastAPI; rasterio, NumPy, Shapely, PyProj and Pillow for geographic data checks and raster-to-PNG tile rendering.
- **Frontend:** React 18, TypeScript, Vite, Leaflet and React-Leaflet.
- **Research provenance:** The backend serves archived Earth Engine class-area numbers, distinguishing them from local whole-cell raster counts. The app uses **four-class reporting rasters**, not the original five-class Gaussian MLC prediction images.
- **Display data:** Annual Landsat surface-reflectance median composites are displayed as 8-bit RGBA rasters. These are not individual-date satellite photographs; RGB interpolation does not improve the source Landsat spatial resolution.

## 2. Source layout

```text
app/
├── backend/
│   ├── main.py                 # FastAPI routes and startup checks
│   ├── catalog.py              # Years, classes, published area/accuracy metadata, paths
│   ├── raster_service.py       # Boundary, data verification, pixel inspect, LULC tiles
│   ├── satellite_service.py    # Annual RGB validation and RGBA tiles
│   ├── requirements.txt
│   └── tests/test_api.py       # Real-raster integration tests
├── frontend/
│   ├── src/App.tsx             # Interactive GIS viewer and timelapse controls
│   ├── src/api.ts              # API base URL and response types
│   ├── src/main.tsx            # React entry point
│   ├── src/*.css               # Viewer styling
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   └── tsconfig.json            # Must be named .json; see migration note below
├── gee/                        # Original Stage 08 supporting Earth Engine export scripts
├── tools/                      # Raster audits
├── docs/milestone0_audit.json   # Archived local structural audit results
└── data/raw/                   # Required local inputs — excluded from GitHub
```

The raw raster paths below are **runtime dependencies**, not tracked files. Their absence from GitHub is deliberate. Empty ignored folders may need to be created locally.

## 3. Required local data (exact filenames)

Place these files under the **`app/`** directory, maintaining these relative paths:

```text
data/raw/
├── boundary/
│   └── chennai_study_area.geojson
├── lulc4/
│   ├── Chennai_LULC4_2010_provisional.tif
│   ├── Chennai_LULC4_2015.tif
│   ├── Chennai_LULC4_2020.tif
│   └── Chennai_LULC4_2025.tif
└── satellite/
    ├── Chennai_RGB_2010.tif
    ├── Chennai_RGB_2015.tif
    ├── Chennai_RGB_2020.tif
    └── Chennai_RGB_2025.tif
```

**LULC input constraints (verified by `backend/raster_service.py`):** single-band EPSG:32644 raster, 951 columns × 1412 rows, 30 m cells and transform `(30, 0, 399060, 0, -30, 1463250)`, NoData metadata `-9999`, class values `1–4`, and separate **background value `0`**. All four must use the same mapped footprint.

**Satellite input constraints (verified by `backend/satellite_service.py`):** four-band uint8 red/green/blue/alpha GeoTIFFs with matching LULC grids and opacity footprint. The RGB renderer uses alpha-aware interpolation; the categorical LULC renderer uses nearest-neighbor sampling.

**Boundary:** GeoJSON `FeatureCollection` holding the true exported `chennai_admin_study_area_clean` polygon. The backend validates Chennai geographic bounds and expects projected area between 528 and 531 km². Do not substitute an earlier GCC boundary or generate an approximate polygon to make startup pass.

## 4. Run locally on Windows

Use Python **3.11 or 3.12** and a supported current Node.js installation. The commands below are for **PowerShell** in the repository's `app` directory:

**Backend — terminal 1**

```powershell
cd C:\Users\ravic\Documents\Chennai-LULC-GitHub\chennai-lulc-gis\app
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
cd backend
..\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

API health: <http://127.0.0.1:8000/api/health>  
OpenAPI documentation: <http://127.0.0.1:8000/docs>

The server intentionally **fails during startup** if a required raster or boundary file is missing, invalid or misaligned. This is a scientific integrity safeguard, not a reason to insert placeholder data.

**Frontend — terminal 2**

```powershell
cd C:\Users\ravic\Documents\Chennai-LULC-GitHub\chennai-lulc-gis\app\frontend
npm ci
npm run dev
```

Viewer: <http://127.0.0.1:5173>

**Frontend build:**

```powershell
npm run build
```

The frontend uses `VITE_API_BASE_URL` if set; otherwise it calls `http://127.0.0.1:8000`. The backend CORS settings allow requests from `localhost:5173` and `127.0.0.1:5173`.

### Packaging status: TypeScript configuration

The initial GitHub import used `frontend/tsconfig.js` for a JSON TypeScript configuration. That one-time packaging rename is **complete**: the repository now contains `frontend/tsconfig.json`. The user's October 2026 GitHub-working-copy `npm ci` and `npm run build` both passed. Do **not** run the previous rename command on a fresh clone.

## 5. Backend API routes

| Route | Method | Function |
|---|---|---|
| `/api/health` | GET | Startup status, source verification and available years |
| `/api/metadata` | GET | Study area, classes, published OA, year warnings, imagery metadata |
| `/api/areas` | GET | Archived GEE four-class area data across all four years |
| `/api/areas/{year}` | GET | Archived GEE areas for one supported year |
| `/api/boundary` | GET | Study-area GeoJSON polygon |
| `/api/pixel?year=2025&lat=...&lon=...` | GET | Actual LULC pixel classification for a coordinate |
| `/api/tiles/{year}/{z}/{x}/{y}.png` | GET | Categorical LULC PNG tile, transparent background |
| `/api/satellite-tiles/{year}/{z}/{x}/{y}.png` | GET | Historical Landsat RGBA PNG tile |

Supported years: **2010, 2015, 2020, 2025**. Unsupported years return an HTTP 404.

## 6. Verification (requires real local input data)

**Check the classification/transition rasters:**

```powershell
# Run in app/ from terminal 1 or a fresh PowerShell terminal
.\.venv\Scripts\python.exe tools\audit_rasters.py
.\.venv\Scripts\python.exe tools\audit_satellite_rgb.py
```

**Run the backend integration tests:**

```powershell
cd backend
..\.venv\Scripts\python.exe -m pytest tests -q
```

`backend/tests/test_api.py` checks health/metadata, official area data, boundary, a real pixel query, classification PNG tiles and all four historical satellite tile endpoints. It does **not** run meaningfully without the local GeoTIFFs and true boundary.

**Frontend:** `npm run build` passed in the user's GitHub working copy after the completed TypeScript config rename. The user's final local Windows Stage 08 project passed 3/3 backend API tests using its real nine runtime inputs; five tested backend source files matched the GitHub working copy by SHA-256. These results do not imply a fresh Git clone has been independently tested with data.

**Phase 5B raster QA note (October 2026):** Four historical RGB files passed structural/coverage checks, although intermediate alpha values were observed. The four LULC GeoTIFFs had matching full-resolution grids, class counts and footprints; the separate overview audit flagged absent `OVERVIEW_RESAMPLING`/`rio_overview` metadata. Their pyramid generation method is **unverified**, not proven incorrect. The archived GEE class-area sum (~529.7711 km²), local whole-cell area (532.8351 km²), vector area (~529.450838 km²) and historical 528.785508 km² mask diagnostic are different quantities. Stage 07AE previously interpreted the last value as a mask-as-value underestimate; independent local reconciliation is still pending. See [Phase 5C audit](../docs/PHASE5C_SCIENTIFIC_CONSISTENCY_AUDIT.md).

## 7. Scientific and reproducibility cautions

1. **2010 provisional:** never represent 2010–2015 apparent Built-up decline as verified real urban loss; the 2010 GAIA/GHSL two-way sensitivity experiment is separate from the reported baseline.
2. **Four-class versus five-class:** classes 4 and 5 in the original five-class MLC are merged for four-class reporting; preserve the provenance of each accuracy number.
3. **Published versus local areas:** reported four-class areas use archived GEE `pixelArea` calculations. Simple local 30 m whole-pixel counts differ; see `docs/milestone0_audit.json`. Never silently replace published numbers with the local totals.
4. **Transparency:** background value `0` is not Water or a fifth LULC class. Declared GeoTIFF NoData `-9999` is different from the zero background actually present in these exports.
5. **Exact inputs:** GitHub omits large GeoTIFFs; users must obtain the original verified files and boundary separately. Do not commit credentials or locally generated export rasters.
6. **Scope:** 2005 is in the larger research plan, but an approved 2005 classification is not supplied by the verified Stage 08 app.

## 8. Repository documentation

- [Overall repository README](../README.md)
- [Complete 156-script code manual](../docs/CODE_MANUAL.md)
- [62 curated Earth Engine scripts](../scripts/gee/INDEX.md)
- [Verified Earth Engine asset manifest](../docs/ASSET_MANIFEST_VERIFIED.md)
- [Curated execution guide](../scripts/gee/EXECUTION_ORDER.md)

The import preserves the application's scientific computations. Any further changes to the application should be reviewed separately from GitHub documentation and packaging corrections.

# Dataset release guide — Chennai LULC GIS

## What counts as the dataset?

The study is a **geospatial remote-sensing project**, not a tabular CSV-only prediction task. Its input data and derived products are different kinds of datasets:

| Type | Research role | Current repository status | Suggested publication |
|---|---|---|---|
| Landsat Collection 2 Tier 1 Level 2 surface reflectance | Public original optical observations acquired, filtered and composited through GEE | Acquisition and preprocessing code exists; source imagery is not mirrored | Cite official USGS/GEE source and collection identifiers; do not duplicate entire Landsat archive |
| Chennai clean study-area boundary | Defines the fixed ROI for all years | GEE asset ID and expected local GeoJSON filename are documented; binary not committed | Publish the exact exported `chennai_study_area.geojson` with CRS/provenance |
| Per-year training and independent validation references | Inputs for five-class Gaussian MLC and its accuracy assessment | GEE FeatureCollection asset IDs are catalogued; exported original tables not committed | If permitted, release original point/polygon tables as GeoJSON/CSV with class IDs, year, sampling and split roles; preserve training/validation separation |
| Four-class 2010/2015/2020/2025 classified maps | The four final app classification layers | Four exact TIFF filenames are in `data/manifests/app_required_inputs.csv`; raw files not committed | Publish four original GeoTIFFs unchanged in a versioned dataset release |
| True-colour annual RGB maps | Optional historical visual layer, essential to current app startup | Four exact TIFF names listed in app input manifest | Publish four RGBA GeoTIFFs alongside LULC for a fully runnable app |
| Five-class original and fusion outputs, including 2010 sensitivity | Scientific products for paper/report comparisons | Asset IDs, screenshots and report figures documented; binaries are external | Optional extended release with **separate** original, fused and sensitivity file identities |
| Summary CSV tables and report figures | Reported numerical findings and illustrations (not raw model inputs) | Already committed under `results/` and `figures/` | Keep these in ordinary Git, with provenance and interpretation limitations |

## The minimum practical dataset release

To let an independent reader run the *existing* Stage 08 GUI, publish the nine files already defined in [`manifests/app_required_inputs.csv`](manifests/app_required_inputs.csv):

```text
dataset-v1/
  boundary/
    chennai_study_area.geojson
  lulc4/
    Chennai_LULC4_2010_provisional.tif
    Chennai_LULC4_2015.tif
    Chennai_LULC4_2020.tif
    Chennai_LULC4_2025.tif
  satellite/
    Chennai_RGB_2010.tif
    Chennai_RGB_2015.tif
    Chennai_RGB_2020.tif
    Chennai_RGB_2025.tif
```

Keep **exact original filenames, metadata, class codes, CRS EPSG:32644, georeferencing and masks**. The four-class raster background is 0 and the declared NoData is -9999. The GUI requires the genuine boundary. Publish a `SHA256SUMS.txt` and a dataset version/date with these files. Do **not** silently rewrite source rasters to quiet the existing overview-metadata warning.

A GitHub **Release** with separate attached files or a research data archive such as **Zenodo** is preferable to committing large TIFFs into normal Git history. Keep the existing `app/data/raw/` Git exclusions; copy/download released files into that directory locally for runtime. A report-table CSV is **not** a substitute for any of the nine app input files.

## Extended reproducibility beyond running the app

A full re-training/reclassification dataset needs more than the nine GUI inputs: original per-year training points/polygons, independent validation samples, source image collection IDs/dates, nine-band predictor conventions, class mapping, screening decisions and GEE asset permissions. Use the catalogued source assets and explicit export scripts. A public GitHub entry for an inaccessible private GEE asset is **documentation**, not a downloadable dataset.

The public data release should distinguish **original five-class Gaussian**, **derived four-class reporting**, **2015/2020/2025 post-classification fusion**, and **2010 original versus two-way sensitivity**. No completed 2005 map should be included as though it is a validated result.

## Publishing checklist

1. Locate the original exported files; inventory real **sizes, SHA-256, raster band metadata, CRS, NoData, pixel values and spatial footprints** using [`../tools/inventory_local_exports.py`](../tools/inventory_local_exports.py).
2. Check sharing/redistribution permissions of source-derived and externally referenced assets; include appropriate USGS, Google Earth Engine and other attribution.
3. Choose a versioned release location and upload **unchanged binaries**. Record the actual release URL, individual file URL, size and SHA-256 in a new verified dataset manifest. Do not invent URLs or hashes.
4. Verify that another researcher can download the nine files, place them under `app/data/raw/` and pass the existing backend integration tests. Record test version and any unresolved metadata warnings.
5. After the release is verified, update the repository **main README once** to link both the [`report/`](../report/README.md) and published dataset. Until then, keep existing scientific reports and the README unchanged.

## Scientific limitations that still apply

The fixed ROI vector area (~529.450838 km²), archived Earth Engine pixelArea sum (~529.7711 km²) and whole-cell local GeoTIFF area (532.8351 km²) differ by measurement convention, and must not be substituted for one another. The 2010 classification is provisional and apparent 2010–2015 built-up loss is not confirmed physical urban loss. Broad-geographic transferability results include distinct manual-reference and automated proxy evaluations. Published summaries cannot be treated as ground truth or newly recomputed metrics.

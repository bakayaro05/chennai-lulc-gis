# Chennai Multi-Temporal LULC — Research Scripts

Reproducible research-code archive for the Chennai Landsat LULC project: historical Gaussian MLC, training/validation, post-classification fusion, and transferability benchmarking in Tamil Nadu.

**Start here:** [Script inventory](docs/SCRIPT_INDEX.md) | [Research decisions](docs/RESEARCH_LINEAGE.md) | [Source revision](docs/SOURCE_REVISION.md).

- `archive/gee-original/`: all original saved Google Earth Engine Code Editor files, **unchanged**. Some do not have `.js` extensions. Includes exploratory/failed/superseded scripts.
- `scripts/gee/`: future **reviewed** and clearly named entry points; never edit archival copies.
- `docs/`: inventories, research lineage, and eventual per-script input/output descriptions.
- `app/`: separate FastAPI/React code if later imported from its actual location; not included automatically in a GEE Git clone.
- `results/`: validated small result summaries and asset manifests; not large raster data.

**Important:** Source ROI assets and exported Earth Engine rasters are remote dependencies and are not embedded in this Git repo. The official 2010 baseline must not be confused with the 2010 two-way fusion *sensitivity* alternative. Manually validated Thanjavur accuracy is not the same as coastal-city automated reference-product agreement.

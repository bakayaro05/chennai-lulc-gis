# Curated GEE source integrity and research boundaries

- Full original archive files verified against SHA-256 and size inventory: **156**.
- Selectively curated script copies: **62**.
- The files are copied unchanged; this process does not rewrite, execute or validate JS behavior.
- Source archive remains untouched, including excluded experiments.
- File modifications, corrupted index, duplicate output names, missing source and likely credentials stop the copy.

## Included files by group

| Group | Files |
|---|---:|
| `01_foundation` | 4 |
| `02_2015_mlc` | 11 |
| `03_2010_provisional` | 14 |
| `04_four_class` | 5 |
| `05_fusion` | 8 |
| `06_generalisability` | 15 |
| `07_map_exports` | 5 |

## Research decision labels

| Label | Files |
|---|---:|
| `AUTO_PROXY_SCREEN` | 2 |
| `BASELINE_QA` | 9 |
| `BASELINE_SOURCE` | 6 |
| `DISPLAY_EXPORT` | 5 |
| `EXTERNAL_BENCHMARK` | 9 |
| `FUSION_CANDIDATE` | 2 |
| `FUSION_QA` | 4 |
| `HISTORICAL_PREDECESSOR` | 3 |
| `HISTORICAL_PROVENANCE` | 1 |
| `LOCKED_REPORTING` | 4 |
| `MANUAL_REFERENCE` | 14 |
| `PROVISIONAL_BASELINE` | 1 |
| `SENSITIVITY_ONLY` | 2 |

## Critical unresolved checks

1. **Never infer completed GEE exports from `Export.*` source lines.** Check live tasks and remote assets before re-executing.
2. Some original scripts contain manual GEE geometry imports, historical checkpoint assumptions or multiple export sections; **source curation is not runtime validation**.
3. Official 2010 map is *provisional original L5/L7*, not the 2010 GAIA/GHSL two-way sensitivity map.
4. RF, SNIC and V2A comparisons are retained in the complete archive but intentionally omitted from the canonical curated path; absence is not deletion.
5. Four-class reporting and five-class frozen transfer use different class schemas and accuracy denominators.
5a. Native 2010 training-polygon asset and some GEE Code Editor geometry imports were created manually and are not reconstructible from the source archive alone.
6. Class 5 naming in some earlier Stage 7 scripts is not uniform; inspect original legend and study description before downstream use.
7. 2005 final classification is not verified; no code is labelled as a completed 2005 baseline.
8. App source (`app/`) was not delivered by the original Earth Engine clone; handle it as the later GitHub task.
9. This archive snapshot comes from the original upstream GEE commit in `docs/SOURCE_REVISION.md`; subsequent live GEE edits are not implicitly included.

## Files to inspect

- `docs/CURATED_GEE_MANIFEST.csv`: exact file paths, hashes, decision labels and export risk labels.
- `scripts/gee/INDEX.md`: curated overview with source links.
- `scripts/gee/EXECUTION_ORDER.md`: research order and execution prerequisites.
- `docs/CODE_MANUAL.md`: full 156-file source history; superseded experiments remain there.


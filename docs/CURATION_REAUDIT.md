# Chennai LULC — Curated Earth Engine re-audit (28 October 2026)

**Scope:** GitHub `bakayaro05/chennai-lulc-gis` archived GEE source at original upstream revision `1c1335e76291d7014336912f2292ba56049bf345`, the 156-file source inventory and full code manual, and project research history through 28 October 2026. **This audit does not run GEE, inspect live Earth Engine task completion, or imply every archive file is executable without manual imports.**

## Finding 1 — no missing files are established by the screenshot

The screenshot of the local `scripts/gee/` directory shows two **folder schemes**. The newer names (`01_foundation`, `02_2015_mlc`, `03_2010_provisional`, `04_four_class`, `05_fusion`, `06_generalisability`, `07_map_exports`) correspond to the 54-copy curation generator. The older names (`02_training_validation`, `03_classification`, `04_diagnostics`, `07_exports`) predate that generator. They are **not destinations** of the current manifest. If they are empty, they are local leftovers rather than missing exported source scripts. Neither the screenshot nor repository file-tree evidence proves the content of every folder; inspect with `find` first. Git does not track genuinely empty folders.

## Finding 2 — 54 original selections were largely appropriate, but not complete for research lineage

Eight additional archived scripts are directly relevant for explaining critical original assets, earlier experimental decisions, the recovered 2025 classifier, and manual generalisability ground truth. Add them as **byte-identical** source copies, not modified code:

| Original file (relative to `archive/gee-original/`) | Curated category | Why included | Research caveat |
|---|---|---|---|
| `stage7/07D_2010_all_classes_candidate_QA` | `03_2010_provisional` | Checks the saved 2010 manually drawn all-class native polygon candidates used before `07F` | Read-only; the original polygon asset comes from separate manual work |
| `stage7/07E_2010_manual_label_triage` | `03_2010_provisional` | Audits manual training labels before balanced 600-point sampling | Not an automated approval step |
| `stage7/07G_2010_manual_Gaussian_MLC_v1` | `03_2010_provisional` | Initial Landsat-5-only manual MLC predecessor explaining later L5+L7 adoption | **Not** the reported 2010 map |
| `stage7/07H_Independent_Accuracy_Assessment` | `03_2010_provisional` | Independent assessment of the earlier manual MLC | Not the 69.33% L5+L7 accuracy |
| `stage7/07H2_2010_site_heldout_CV` | `03_2010_provisional` | Training-site held-out CV for earlier 2010 manual model | Not independent map validation |
| `07AC4_VERIFY_RECOVERED_2025_TIFF` | `04_four_class` | Explains verification of recovered 2025 original five-class TIFF and four-class reporting derivation | Read-first; optional export task, disabled by default |
| `stage8/08G4B_2020_Conservative_Builtup_Fusion` | `05_fusion` | Conservative GAIA + WorldCover 2020 Built-up correction rule experiment | Diagnostic; no locked asset changes |
| `tnjregion/03B_TNJ_2020_Reference_Reviewer` | `06_generalisability` | Historical blind manual reference reviewer on 252 Thanjavur candidate locations | Replaced in final analysis by locked, manually interpreted 112-point design |

The curated selection is now **62 scripts** divided as follows:

| Category | Number | Role |
|---|---:|---|
| `01_foundation` | 4 | ROI, Landsat preprocessing, original 2025/2020 MLC source code |
| `02_2015_mlc` | 11 | Temporal transfer, manual training, independent validation, 2015 Gaussian MLC |
| `03_2010_provisional` | 14 | Manual native training, early MLC diagnostics, L5+L7 provisional model |
| `04_four_class` | 5 | Recovered 2025 raster, class aggregation, four-class QA and export |
| `05_fusion` | 8 | 2015–2025 retained post-classification fusion, 2010 sensitivity |
| `06_generalisability` | 15 | Thanjavur A/B/C manual benchmark and coastal automatic-product screening |
| `07_map_exports` | 5 | Classified LULC, historical RGB, indices, ROI and six benchmark maps |
| **Total** | **62** | No research source changed or deleted |

## Research distinctions enforced by this curation

- **Reported 2010:** original provisional 2010 Landsat 5+7 Gaussian MLC (five class), not the older 05F/06E/G only branches and not the 08G15 GAIA/GHSL two-way sensitivity variant. The latter is a distinct supplementary export.
- **2015, 2020, 2025:** underlying five-class original MLC remains separately identifiable; post-classification built-up fusion is a derived map, not Gaussian retraining.
- **Four-class reporting:** merges source classes 4 and 5 for reported land-cover groups. Some earlier Stage 7 comments give class 5 a different descriptive name. These descriptive variations must not be silently harmonised without inspecting the actual class and legend in each script.
- **Thanjavur 2020:** manually interpreted 112-reference design, frozen model, A/B/C no-target-training comparison. The earlier 252-point review script documents provenance, not the final denominator.
- **Coastal cities:** WorldCover + Dynamic World agreement is proxy agreement, not accuracy measured using independent human reference labels.
- **2005:** was part of original research planning, but a completed approved 2005 map is **not established by the later archived project results**.
- **GEE exports:** source `Export.*` calls describe tasks, not successful executions. Source scripts may require manually supplied geometries and project-level asset access.

## Original and curated repository roles

1. `archive/gee-original/` — **all 156** tracked original files, frozen as originally exported from Earth Engine; not modified, deleted, renamed or otherwise curated in place.
2. `scripts/gee/` — **62 copies**, with added `.js` extensions where necessary; non-executable-by-default research entry points classified by purpose and status. Not guaranteed drop-in, standalone executables.
3. `docs/CODE_MANUAL.md` — the complete 156-entry historical code manual.
4. `docs/CURATED_GEE_MANIFEST.csv`, `docs/CURATED_GEE_AUDIT.md`, `scripts/gee/INDEX.md`, `scripts/gee/EXECUTION_ORDER.md` — machine-generated selection provenance and operational cautions.

## Local safety procedure

Run `python tools/curate_gee.py --plan` after replacing the previous curation tool and CSV with the **v2 files**; then `--apply` and `--verify`. The v2 tool verifies the 156 archive file sizes/hashes, the selected 62 paths, copy identity, and exact previous generated documentation fingerprints before it upgrades any existing v1 generated documents. Any unexpected or manually edited existing file causes a refusal to overwrite.

Only after `--verify`, inspect the four obsolete folder names. `rmdir` is safe because it removes a folder **only if empty**; it will fail and preserve any directory containing scripts or other files. Do not use recursive deletion (`rm -rf`) on `scripts/gee/`.

Do not rerun archival Earth Engine exporters to populate the GitHub folder. Copying sources into a public GitHub repository **does not** populate their remote asset dependencies.

## Still unverified, not claimed by this release

- Individual Earth Engine script syntax and runtime success after copy.
- Completion and integrity of all remote task/export IDs and target assets in the live Earth Engine project.
- Availability of all historic manually imported polygons, including original 2010 native class training polygons and 2015 additions.
- Whether additional non-canonical diagnostic branches should become optional companion packages; they remain fully available in the 156-file archive.
- Public repository security/privacy audit, repository license and provenance/citation policy, and actual FastAPI/React application source import. These are separate subsequent GitHub phases.

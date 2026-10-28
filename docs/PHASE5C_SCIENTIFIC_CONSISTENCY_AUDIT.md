# Phase 5C — Chennai LULC scientific and documentation consistency audit

**Audit date:** 29 October 2026  
**Repository:** [bakayaro05/chennai-lulc-gis](https://github.com/bakayaro05/chennai-lulc-gis), default branch `main`  
**Audit method:** Read-only inspection of current GitHub source and documentation, cross-checked against the user's Phase 5A/5B local outputs and the previously recorded Earth Engine asset evidence. **No Earth Engine task, new classification, local raster edit, app-code edit, or fresh experiment was performed.**  
**Disposition:** **Core scientific reporting consistent; targeted documentation refresh recommended.** Do not label the entire project “fully reproducible”: original GEE assets, manually imported geometries and large local raster inputs remain external.

## 1. Scope and verification basis

Primary material checked:

- [`README.md`](../README.md)
- [`docs/CODE_MANUAL.md`](CODE_MANUAL.md)
- [`docs/ASSET_MANIFEST_VERIFIED.md`](ASSET_MANIFEST_VERIFIED.md)
- [`docs/RESEARCH_LINEAGE.md`](RESEARCH_LINEAGE.md)
- [`scripts/gee/EXECUTION_ORDER.md`](../scripts/gee/EXECUTION_ORDER.md)
- [`docs/CURATED_GEE_AUDIT.md`](CURATED_GEE_AUDIT.md), [`docs/CURATED_GEE_MANIFEST.csv`](CURATED_GEE_MANIFEST.csv), and [`scripts/gee/INDEX.md`](../scripts/gee/INDEX.md)
- [`app/README.md`](../app/README.md), [`app/backend/catalog.py`](../app/backend/catalog.py), and [`app/docs/milestone0_audit.json`](../app/docs/milestone0_audit.json)
- [`docs/PHASE4_SOURCE_AUDIT.md`](PHASE4_SOURCE_AUDIT.md) as an **earlier historical audit**, not an assertion of current remaining work.
- User-provided Phase 5A local report and Phase 5B PowerShell logs; the files themselves need not be committed to GitHub.

An automated relative-link check inspected **107 relative Markdown links across eight principal GitHub documents** and found **no missing paths**. This does not certify every external URL, image, or GitHub Markdown anchor.

## 2. Scientific concordance — no contradictory numerical values found

| Topic | Confirmed consistent statements | Interpretation limit |
|---|---|---|
| Study domain | Chennai Urban Study Area; GEE ROI `projects/assignment-482806/assets/chennai_admin_study_area_clean`; about **529.450838 km²** vector area | Do not substitute local raster-cell area or GEE summed pixel area |
| Historical years | Scope **2005, 2010, 2015, 2020, 2025**; assessed/served maps **2010, 2015, 2020, 2025** | No approved final 2005 classification or future prediction established |
| Original five-class MLC OA | **2010 provisional 69.33%; 2015 85.67%; 2020 86.33%; 2025 83.67%** | Recorded 300-point source evaluations; not newly recomputed |
| Derived four-class reporting OA | **2010 81.00%; 2015 88.67%; 2020 95.67%; 2025 96.67%** | Classes 4+5 merged **after** MLC; do not call it retraining |
| Accepted 2010 identity | Provisional original **Landsat 5+7** map `chennai_mlc_lulc_2010_L5L7_manual_exp_v1` | Not the earlier L5-only/V2C branches or two-way fusion |
| 2010 sensitivity | Original **69.33%**, add-only **69.67%**, two-way **71.33%**; mapped Built-up about **279.82** vs **304.72 km²** | Supplementary, not replacement of the reported 2010 baseline |
| Retained fusion candidates | **2015 temporal consistency; 2020 GAIA + WorldCover; 2025 GAIA + Dynamic World** | Post-classification correction candidates; not refitted Gaussian models |
| Thanjavur 2020 | Frozen Chennai five-class Gaussian; independent **112-point** manually interpreted target reference; A **23.1854%**, B **20.6625%**, C **35.9444%** area-adjusted OA | C-A **+12.759 pp** exploratory; not robust generalisability proof |
| Coastal proxies | Cuddalore **57.9251%**, Nagapattinam **82.9085%**, Thoothukudi **46.0861%** | *Automatic reference-product agreement on eligible pixels*, not independent measured accuracy |
| Code integrity | Original **156/156** archived copies verified by local SHA-256; curated **62/62** match archived sources and Git blob identities | Integrity verification does not imply every historical script is standalone executable |
| GEE asset metadata | **62/69** static IDs accessible; **7 unresolved**, **26/26** critical accessible; **107** succeeded operations observed | Existence/task success alone does not verify output-file identity, masks or pixels |

**Source basis:** `README.md`, `docs/CODE_MANUAL.md` §§1–3 and §6, `docs/ASSET_MANIFEST_VERIFIED.md` §§1–3, `docs/RESEARCH_LINEAGE.md`, `scripts/gee/EXECUTION_ORDER.md`, and `app/backend/catalog.py`.

## 3. Issues and targeted dispositions

### D1 — Main README incorrectly presents completed tasks as future milestones

**Priority: Medium; documentation only.** `README.md` under **Current limitations and next repository milestones** still says to *complete an asset existence / task-completion manifest* and *add the actual FastAPI backend and React/Leaflet frontend*. Both are present: `docs/ASSET_MANIFEST_VERIFIED.md` and actual application source at `app/backend/` and `app/frontend/`. The introduction was already updated, making this a contradiction *within the README itself*.

**Change:** Replace the two completed-task bullets with present-tense statements that distinguish **partial asset/task evidence** and **external local app data**. Add a prominent link to the asset manifest in **Start here**. The statement that complete task-to-file verification is unavailable must **remain**.

### D2 — App README contains an already-completed TypeScript migration instruction

**Priority: Medium; documentation only.** `app/README.md` section **Packaging note: TypeScript config filename** instructs `mv app/frontend/tsconfig.js app/frontend/tsconfig.json`, but current GitHub source already has `tsconfig.json`, and local Phase 5B logs show `npm ci` and `npm run build` passed. Repeating that rename on a fresh clone will fail.

**Change:** Replace the historical command with a short completed-migration note, without modifying the TypeScript configuration or application source.

### D3 — Runtime-test status in app README predates the latest evidence

**Priority: Medium; documentation only.** The app README's source-import snapshot disclaims fresh runtime tests. That was true *at import*, but the user's subsequent Windows checks confirm a GitHub-copy frontend production build, **0 npm audit vulnerabilities**, and **3/3** backend API tests using real local inputs. SHA-256 comparisons found **5/5** checked backend source files identical between local final project and the GitHub working copy. Four historical satellite raster QA checks passed.

**Change:** Add a **dated Phase 5B result** without claiming tests were rerun in this analysis session or on a fresh clone. Mention six non-fatal deprecation warnings in the backend test run.

### D4 — Area/mask terminology could be misread as contradictory

**Priority: Medium scientific *communication* risk; do not rewrite measurements.** `docs/CODE_MANUAL.md` §2.3 says the **528.785508 km²** earlier GEE diagnostic was explained in Stage 07AE as a *mask-as-value underestimate*, compared with approximately **529.771104 km²** fixed-grid GEE area. `app/docs/milestone0_audit.json` still describes reproducing that earlier diagnostic as **unresolved** locally, and local unweighted counts give **532.8351 km²**. Those statements refer to differing evidence stages and measurement conventions; they must not be silently merged or forced equal.

**Change:** Add an explanatory note to `app/README.md` and/or new audit report: **(a)** vector boundary ≈529.450838; **(b)** archived GEE class-area sum ≈529.7711; **(c)** local whole-30 m-cell area 532.8351; **(d)** earlier 528.785508 GEE mask diagnostic and Stage 07AE's interpretation. **Independent reproduction of the local-to-GEE discrepancy remains pending.** Preserve the original `milestone0_audit.json` and Code Manual's historically dated statement.

### D5 — Overview-method claim remains unverified

**Priority: Low/Medium scientific display QA.** The user's GeoTIFF inspection showed **COG/LZW**, overview factors **[2,4,8,16,32]**, but no dataset-level `OVERVIEW_RESAMPLING` and no Rasterio `rio_overview` tag. The local audit therefore reported four overview-resampling check failures. This **does not prove** interpolation was unsuitable; it also **does not prove** nearest-neighbor was used to build the overviews. All four full-resolution grids, class counts and footprints were consistent; categorical web-tile rendering in `raster_service.py` explicitly requests nearest-neighbor.

**Change:** Document “overview generation method **unverified from available metadata**” instead of “overviews pass nearest-neighbor QA” or “raster is corrupted”. Do not re-export approved rasters solely to appease a missing tag.

### D6 — Research lineage has outdated future-tense verification language

**Priority: Low; documentation only.** The final sentence of `docs/RESEARCH_LINEAGE.md` says detailed source statuses *will be verified once the GitHub repository is available*. The code manual, source curation, and GEE asset metadata audits now exist.

**Change:** Point to the existing Code Manual, source audit and asset manifest, while retaining the warning that a file's presence does not prove an adopted result.

### D7 — Preserve historical audit snapshots as historical records

**Priority: Informational.** `docs/PHASE4_SOURCE_AUDIT.md` instructs a TypeScript rename and README replacement; `docs/CURATED_GEE_AUDIT.md` refers to app source as a subsequent task. These were valid descriptions *at the time of those audits*. Changing them retroactively would obscure project chronology.

**Change:** Do **not** rewrite the old audits. Use this Phase 5C document as the dated superseding status reference. Likewise, do not alter the original 156 GEE sources, 62 curated copies, application algorithms, or archived `milestone0_audit.json`.

### D8 — Asset-manifest interpretation and external data prerequisites

**Priority: Important reproducibility limitation; not a numerical conflict.** The 69-item static source plan is not exhaustive. Seven references were unresolved; operations need not map one-to-one to specific Drive filenames. The application requires **nine local inputs** (four four-class GeoTIFFs, four RGBA historical GeoTIFFs, one true study-area GeoJSON). A fresh clone without them is intentionally non-runnable, even though the app and tests work with the supplied local data.

**Change:** Keep the exact filename and source-provenance instructions in `app/README.md`. Do not upload synthetic substitutes, new interpretation datasets, account credentials or large raw rasters to make clone-and-run appear complete.

## 4. Application checks — user-provided Phase 5B evidence

| Test | Reported outcome | Limit |
|---|---|---|
| `npm ci` + `npm run build` in GitHub working copy | PASS; Vite built 75 modules | Does not exercise a deployed browser session |
| `npm audit --audit-level=high` | 0 advisories returned at execution | Time-specific npm registry result; Python dependencies not independently audited |
| Local backend PyTest integration | **3 passed, 6 warnings** | Real local data; same five checked backend source hashes as GitHub working copy |
| Local historical RGB raster audit | **4/4 passed**, with intermediate alpha-value warnings | Structural/coverage checks, not comparison to original reflectance |
| Local four-class raster audit | Full-resolution class counts and grid consistent; **4 overview metadata/resampling checks flagged** | Actual overview generation algorithm not evidenced |
| Internal source checks | **156/156** archive hash/size, **62/62** curated matching; **0** common credential-pattern alerts in current files and scanned Git history | Pattern scanner does not guarantee absolute absence of secrets |

## 5. Decision and boundaries

- **Scientific claims:** core reported outcomes and experiment identities are concordant among reviewed current source documents.
- **Documentation:** current-state errors in `README.md`, `app/README.md`, `docs/RESEARCH_LINEAGE.md`, and the “still requires human validation” summary in `scripts/gee/EXECUTION_ORDER.md` warrant small targeted updates.
- **Historical audit records:** preserve original manual, source scripts, old audit JSON, asset evidence snapshots and milestone status documents as originally recorded.
- **No destructive correction:** do not rewrite the classification, fusion, training/validation, raster values or area calculations.
- **Remaining limitations:** 7 unresolved code-referenced EE assets; incomplete task-to-file provenance; remote GEE/manual geometry dependencies; missing local raster inputs on fresh clone; overview-generation algorithm unverified; area-convention reconciliation outstanding; no release citation/license policy yet (separate optional Phase 6).

## 6. Narrow follow-up change-set

An **optional**, source-preserving script `phase5c_docs_patch.py` accompanies this report. It previews and then updates **only four** present-tense documentation files:

1. `README.md`
2. `app/README.md`
3. `docs/RESEARCH_LINEAGE.md`
4. `scripts/gee/EXECUTION_ORDER.md`

The script refuses to write if expected original wording is absent or duplicated. Run its `--check` first, inspect `git diff`, then commit together with this report. It does not modify archived records or the original final application.

**Conclusion:** **Phase 5C source/document consistency review completed, with minor documentation corrections identified.** These updates can be applied without changing any scientific result. This outcome is not a claim of end-to-end independent scientific reproducibility.

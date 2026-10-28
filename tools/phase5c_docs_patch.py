#!/usr/bin/env python3
"""Apply narrow Phase 5C present-tense documentation corrections.

Usage (from repository root):
    python tools/phase5c_docs_patch.py --check
    python tools/phase5c_docs_patch.py --apply

No source JavaScript, app Python/TSX, archived GEE files, or old audit snapshots
are modified. An exact old-text match is required for each edit. Re-running
an already applied patch fails safely instead of silently rewriting content.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import sys


EDITS = {
    "README.md": [
        (
            "| Trace **asset names** across scripts | [Static asset reference index](docs/ASSET_REFERENCE_INDEX.md) |",
            "| Trace **asset names** across scripts | [Static asset reference index](docs/ASSET_REFERENCE_INDEX.md) |\n"
            "| See **metadata-verified Earth Engine assets** and export evidence | [Verified asset manifest](docs/ASSET_MANIFEST_VERIFIED.md) |",
        ),
        (
            "- **2005 final LULC**, automated end-to-end reruns, and live task-completion verification are **not claimed** here.",
            "- An accepted **2005 final LULC** product and automated end-to-end reruns are **not claimed**. "
            "The [asset manifest](docs/ASSET_MANIFEST_VERIFIED.md) records 62/69 accessible static Earth Engine IDs "
            "and 107 `SUCCEEDED` operations from the October 2026 snapshot; these do not establish full task-to-file provenance.",
        ),
        (
            "- Complete an **asset existence / task-completion manifest** rather than inferring success from source `Export.*` statements.",
            "- Maintain and periodically recheck the [verified asset manifest](docs/ASSET_MANIFEST_VERIFIED.md): "
            "62/69 code-derived IDs returned metadata and 7 remained unresolved in the recorded snapshot. "
            "Asset existence and `SUCCEEDED` operations are not complete output-file or scientific validation.",
        ),
        (
            "- Add the actual **FastAPI backend and React/Leaflet frontend** from the separate application project, with environment files and large outputs appropriately excluded.",
            "- Preserve the imported [Stage 08 FastAPI/React application](app/README.md); "
            "its four classification rasters, four historical RGB rasters and true boundary GeoJSON "
            "remain external runtime inputs rather than tracked GitHub files.",
        ),
        (
            "- Perform a **public-repository security and attribution audit** (tokens, data permissions, third-party licenses). The repository is currently public.",
            "- Maintain the public-repository security and attribution review (tokens, data permissions, third-party licenses). "
            "The October 2026 local pattern scan reported no matches but does not guarantee absolute absence of secrets; "
            "see [Phase 5C audit](docs/PHASE5C_SCIENTIFIC_CONSISTENCY_AUDIT.md).",
        ),
    ],
    "app/README.md": [
        (
            "### Packaging note: TypeScript config filename\n\n"
            "At the first GitHub import, the TypeScript configuration appeared under **`frontend/tsconfig.js`**, although its content is a JSON TypeScript configuration and the frontend's `build` script invokes `tsc --noEmit`. Standard TypeScript auto-discovery requires **`frontend/tsconfig.json`**. Rename the file **in the GitHub working copy**, without altering its contents or the original source project:\n\n"
            "```bash\n"
            "cd ~/Documents/Chennai-LULC-GitHub/chennai-lulc-gis\n"
            "mv app/frontend/tsconfig.js app/frontend/tsconfig.json\n"
            "```\n\n"
            "This is a filename/packaging correction, **not a scientific code change**. Commit the rename with this documentation after checking `npm run build`.",
            "### Packaging status: TypeScript configuration\n\n"
            "The initial GitHub import used `frontend/tsconfig.js` for a JSON TypeScript configuration. "
            "That one-time packaging rename is **complete**: the repository now contains "
            "`frontend/tsconfig.json`. The user's October 2026 GitHub-working-copy `npm ci` and "
            "`npm run build` both passed. Do **not** run the previous rename command on a fresh clone.",
        ),
        (
            "**Frontend:** `npm run build` must pass after the TypeScript configuration rename. This README documents commands; the current GitHub audit did not execute full application tests against the local Windows raster dataset.",
            "**Frontend:** `npm run build` passed in the user's GitHub working copy after the completed TypeScript config rename. "
            "The user's final local Windows Stage 08 project passed 3/3 backend API tests using its real nine runtime inputs; "
            "five tested backend source files matched the GitHub working copy by SHA-256. "
            "These results do not imply a fresh Git clone has been independently tested with data.",
        ),
        (
            "## 7. Scientific and reproducibility cautions",
            "**Phase 5B raster QA note (October 2026):** Four historical RGB files passed structural/coverage checks, "
            "although intermediate alpha values were observed. The four LULC GeoTIFFs had matching full-resolution grids, "
            "class counts and footprints; the separate overview audit flagged absent `OVERVIEW_RESAMPLING`/`rio_overview` "
            "metadata. Their pyramid generation method is **unverified**, not proven incorrect. "
            "The archived GEE class-area sum (~529.7711 km²), local whole-cell area (532.8351 km²), "
            "vector area (~529.450838 km²) and historical 528.785508 km² mask diagnostic are different quantities. "
            "Stage 07AE previously interpreted the last value as a mask-as-value underestimate; "
            "independent local reconciliation is still pending. See "
            "[Phase 5C audit](../docs/PHASE5C_SCIENTIFIC_CONSISTENCY_AUDIT.md).\n\n"
            "## 7. Scientific and reproducibility cautions",
        ),
    ],
    "docs/RESEARCH_LINEAGE.md": [
        (
            "A file's presence in the archive does **not** prove that it produced an adopted result. Detailed statuses will be verified from source after the full GitHub repository is available.",
            "A file's presence in the archive does **not** prove that it produced an adopted result. "
            "Source roles are now documented in the [Code Manual](CODE_MANUAL.md) and "
            "[curation audit](CURATED_GEE_AUDIT.md); the October 2026 "
            "[asset manifest](ASSET_MANIFEST_VERIFIED.md) records 62/69 metadata-accessible assets "
            "and 107 succeeded operations. Neither source inspection nor metadata/task history alone proves "
            "every file's scientific adoption or completes task-to-export verification.",
        ),
    ],
    "scripts/gee/EXECUTION_ORDER.md": [
        (
            "- The actual completed GEE Tasks and asset metadata for all claimed exports.",
            "- Some individual GEE task-to-asset/Drive-file identity checks remain outstanding. "
            "The October 2026 [asset manifest](../../docs/ASSET_MANIFEST_VERIFIED.md) "
            "documents 62/69 code-referenced assets with metadata and 107 succeeded operations, "
            "but does not confirm every file's exact destination or pixel integrity.",
        ),
    ],
}


def plan(root: Path) -> dict[Path, tuple[str, str, str]]:
    """Validate ALL matches before writing ANY file."""
    changes: dict[Path, tuple[str, str, str]] = {}
    for rel, updates in EDITS.items():
        path = root / rel
        if not path.is_file():
            raise RuntimeError(f"Missing expected documentation file: {rel}")
        raw = path.read_bytes()
        newline = "\r\n" if b"\r\n" in raw else "\n"
        original = raw.decode("utf-8").replace("\r\n", "\n")
        changed = original
        for old, new in updates:
            matches = changed.count(old)
            if matches != 1:
                raise RuntimeError(
                    f"Refusing to change {rel}: expected exactly one match; found {matches}. "
                    "The file may already be updated or differs from the audited version."
                )
            changed = changed.replace(old, new, 1)
        changes[path] = (original, changed, newline)
    return changes


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    command = parser.add_mutually_exclusive_group(required=True)
    command.add_argument("--check", action="store_true", help="validate exact replacements; no files written")
    command.add_argument("--apply", action="store_true", help="write changes only after every precondition passes")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    try:
        changes = plan(root)
    except (OSError, RuntimeError, UnicodeError) as exc:
        print(f"REFUSED: {exc}", file=sys.stderr)
        return 2
    print("Validated exact intended changes in:")
    for path in changes:
        print("  " + str(path.relative_to(root)).replace("\\", "/"))
    if args.check:
        print("CHECK PASSED; no files written.")
        return 0
    for path, (_, updated, newline) in changes.items():
        path.write_bytes(updated.replace("\n", newline).encode("utf-8"))
    print("APPLIED: documentation-only changes. Review git diff before committing.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

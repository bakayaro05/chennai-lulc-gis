"""Read-only verification of the four approved Chennai four-class GeoTIFFs.

Run: python tools/audit_rasters.py
Requires: numpy, rasterio
Produces: docs/milestone0_audit.json

IMPORTANT: 0 is background in the actual exports, although the declared
GeoTIFF NoData is -9999. Do not treat 0 as a land-cover category or Water.
"""

import json
from pathlib import Path

import numpy as np
import rasterio

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "raw" / "lulc4"
OUTPUT = ROOT / "docs" / "milestone0_audit.json"
FILES = {
    2010: "Chennai_LULC4_2010_provisional.tif",
    2015: "Chennai_LULC4_2015.tif",
    2020: "Chennai_LULC4_2020.tif",
    2025: "Chennai_LULC4_2025.tif",
}
OFFICIAL_AREAS = {
    2010: [279.821871, 81.218516, 21.778480, 146.952238],
    2015: [200.882401, 33.654600, 39.730711, 255.503391],
    2020: [225.716608, 14.108663, 22.036104, 267.909728],
    2025: [256.372809, 44.269634, 20.389113, 208.739548],
}
OFFICIAL_TRANSITIONS = {
    (2010, 2015): [
        [177.827394, 0.737257, 1.207482, 100.049737],
        [6.255710, 20.272511, 3.586177, 51.104117],
        [0.830793, 0.088255, 19.184935, 1.674497],
        [15.968504, 12.556577, 15.752117, 102.675040],
    ],
    (2015, 2020): [
        [172.548244, 0.044128, 0.257766, 28.032263],
        [0.842900, 10.651266, 0.176509, 21.983925],
        [2.659763, 0.649753, 19.915633, 16.505561],
        [49.665701, 2.763516, 1.686196, 201.387979],
    ],
    (2020, 2025): [
        [195.368281, 0.624580, 0.653092, 29.070655],
        [0.398028, 10.932625, 0.094176, 2.683834],
        [0.911769, 3.281048, 16.599194, 1.244094],
        [59.694732, 29.431381, 3.042651, 175.740965],
    ],
}
EXPECTED_TRANSFORM = (30.0, 0.0, 399060.0, 0.0, -30.0, 1463250.0)
VALID_CLASS_IDS = (1, 2, 3, 4)
KM2_PER_PIXEL = 30 * 30 / 1_000_000


def verify():
    problems = []
    years = {}
    arrays = {}
    transforms = {}
    report = {
        "stage": "08 / Milestone 0",
        "statistics_convention": "Local whole 30 m pixel count; NOT official GEE area weighting",
        "background_value": 0,
        "declared_nodata": -9999,
        "archived_gee_mask_diagnostic_km2": 528.785508,
        "mask_diagnostic_status": "Unresolved, pending ROI/method reproduction",
        "years": years,
        "transitions": {},
        "checks": {},
    }

    for year, filename in FILES.items():
        path = SOURCE / filename
        if not path.is_file():
            problems.append(f"{year}: missing {path}")
            continue
        with rasterio.open(path) as src:
            if src.count != 1:
                problems.append(f"{year}: expected exactly one band, got {src.count}")
                continue
            if src.crs is None or src.crs.to_epsg() != 32644:
                problems.append(f"{year}: expected EPSG:32644, got {src.crs}")
            if not np.allclose(tuple(src.transform)[:6], EXPECTED_TRANSFORM, atol=1e-8, rtol=0):
                problems.append(f"{year}: mismatched transform {src.transform}")
            if (src.width, src.height) != (951, 1412):
                problems.append(f"{year}: unexpected raster shape {(src.width, src.height)}")
            if src.res != (30, 30):
                problems.append(f"{year}: unexpected raster resolution {src.res}")
            if src.nodata != -9999:
                problems.append(f"{year}: unexpected declared NoData {src.nodata}")
            if src.dtypes[0] != "int16":
                problems.append(f"{year}: unexpected data type {src.dtypes[0]}")

            cog_metadata = src.tags(ns="IMAGE_STRUCTURE")
            if cog_metadata.get("LAYOUT") != "COG":
                problems.append(f"{year}: missing COG layout marker")
            if cog_metadata.get("OVERVIEW_RESAMPLING") != "NEAREST":
                problems.append(f"{year}: overview resampling is not NEAREST")

            values = src.read(1)
            classes, counts = np.unique(values, return_counts=True)
            unexpected = set(classes.tolist()) - {0, 1, 2, 3, 4, -9999}
            if unexpected:
                problems.append(f"{year}: unexpected class values: {sorted(unexpected)}")
            if not set(VALID_CLASS_IDS).issubset(set(classes.tolist())):
                problems.append(f"{year}: one or more expected categories absent")

            # Important: zero is excluded explicitly, because the source files
            # contain a real 0 background, despite declaring NoData=-9999.
            valid = np.isin(values, VALID_CLASS_IDS)
            class_counts = [int(np.count_nonzero(values == cid)) for cid in VALID_CLASS_IDS]
            areas = [round(number * KM2_PER_PIXEL, 6) for number in class_counts]
            official = OFFICIAL_AREAS[year]
            years[str(year)] = {
                "filename": filename,
                "projection": str(src.crs),
                "width": src.width,
                "height": src.height,
                "transform": list(tuple(src.transform)[:6]),
                "format": src.driver,
                "is_cog": src.tags(ns="IMAGE_STRUCTURE").get("LAYOUT") == "COG",
                "overview_resampling": src.tags(ns="IMAGE_STRUCTURE").get("OVERVIEW_RESAMPLING"),
                "overview_levels": src.overviews(1),
                "raw_values": {str(v): int(n) for v, n in zip(classes, counts)},
                "background_zero_pixels": int(np.count_nonzero(values == 0)),
                "classified_pixels": int(np.count_nonzero(valid)),
                "class_counts": class_counts,
                "local_planar_areas_km2": areas,
                "local_total_km2": round(sum(areas), 6),
                "official_gee_areas_km2": official,
                "official_gee_total_km2": round(sum(official), 6),
                "local_minus_gee_total_km2": round(sum(areas) - sum(official), 6),
            }
            arrays[year] = values
            transforms[year] = tuple(src.transform)[:6]
            print(f"{year}: classes={class_counts} background={years[str(year)]['background_zero_pixels']:,} ")
            print(f"      local={sum(areas):.6f} km2, archived GEE={sum(official):.6f} km2")

    all_loaded = len(arrays) == len(FILES)
    report["checks"]["all_four_readable"] = all_loaded
    if all_loaded:
        reference = arrays[2010]
        same_shape = all(array.shape == reference.shape for array in arrays.values())
        same_transforms = all(t == transforms[2010] for t in transforms.values())
        same_background = all(np.array_equal(reference == 0, a == 0)
                              for a in arrays.values())
        report["checks"]["identical_raster_dimensions"] = same_shape
        report["checks"]["identical_grid_transform"] = same_transforms
        report["checks"]["identical_zero_background"] = same_background
        for title, condition in [
            ("dimensions", same_shape),
            ("transforms", same_transforms),
            ("zero background", same_background),
        ]:
            if not condition:
                problems.append(f"Raster {title} differ across years")
        if same_shape and same_transforms:
            for (earlier, later), archived in OFFICIAL_TRANSITIONS.items():
                src_a, src_b = arrays[earlier], arrays[later]
                overlap = np.isin(src_a, VALID_CLASS_IDS) & np.isin(src_b, VALID_CLASS_IDS)
                indices = (src_a[overlap].astype(np.int64) - 1) * 4 + (src_b[overlap] - 1)
                matrix = np.bincount(indices, minlength=16).reshape(4, 4) * KM2_PER_PIXEL
                baseline = np.array(archived, dtype=float)
                key = f"{earlier}-{later}"
                report["transitions"][key] = {
                    "local_planar_matrix_km2": np.round(matrix, 6).tolist(),
                    "archived_gee_matrix_km2": archived,
                    "largest_cell_difference_km2": round(float(np.max(np.abs(matrix - baseline))), 6),
                    "overlap_pixels": int(np.count_nonzero(overlap)),
                }
                print(f"{key}: largest cell difference {np.max(np.abs(matrix - baseline)):.6f} km2")

    report["checks"]["basic_integrity"] = "PASS" if not problems else "FAIL"
    report["problems"] = problems
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"\nWrote {OUTPUT}")
    print("Area-convention reconciliation: PENDING; do not overwrite official GEE values.")
    if problems:
        print("DATA CHECK FAILURES:")
        for problem in problems:
            print("  -", problem)
        return 1
    print("Basic structural, pixel-ID and alignment QA: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(verify())


"""Chennai Stage 08: read-only historical satellite audit.

Expected format:
Four uint8 bands: Red, Green, Blue, Alpha.
Alpha 0 = transparent, 255 = valid observation.

RGB pixel values of zero are not automatically NoData.
"""

from pathlib import Path
import sys

import numpy as np
import rasterio


ROOT = Path(__file__).resolve().parents[1]

RGB_DIR = ROOT / "data" / "raw" / "satellite"

LULC_DIR = ROOT / "data" / "raw" / "lulc4"

YEARS = [2010, 2015, 2020, 2025]

LULC_NAMES = {
    2010: "Chennai_LULC4_2010_provisional.tif",
    2015: "Chennai_LULC4_2015.tif",
    2020: "Chennai_LULC4_2020.tif",
    2025: "Chennai_LULC4_2025.tif",
}


def check_year(year):

    rgb_path = RGB_DIR / f"Chennai_RGB_{year}.tif"
    lulc_path = LULC_DIR / LULC_NAMES[year]

    if not rgb_path.is_file() or not lulc_path.is_file():

        missing = (
            rgb_path
            if not rgb_path.is_file()
            else lulc_path
        )

        print(f"{year}: missing input: {missing}")
        return False

    success = True

    with rasterio.open(rgb_path) as rgb, \
         rasterio.open(lulc_path) as lulc:

        print(f"\n{year}: {rgb_path.name}")

        print(
            f"  RGB: {rgb.width}x{rgb.height}; "
            f"bands={rgb.count}; dtype={rgb.dtypes}; "
            f"CRS={rgb.crs}"
        )

        print(
            f"  LULC: {lulc.width}x{lulc.height}; "
            f"CRS={lulc.crs}"
        )

        if (
            rgb.count != 4
            or any(t != "uint8" for t in rgb.dtypes)
        ):
            print(
                "  FAIL: expected four uint8 bands "
                "(red, green, blue, alpha)"
            )
            return False

        if rgb.crs != lulc.crs:

            print("  FAIL: RGB and LULC projections differ")
            success = False

        if (
            rgb.shape != lulc.shape
            or not rgb.transform.almost_equals(lulc.transform)
        ):

            print(
                "  FAIL: RGB does not occupy the "
                "exact locked LULC raster grid"
            )
            success = False

        alpha = rgb.read(4)

        alpha_values = np.unique(alpha)

        if not np.all(
            np.isin(alpha_values, [0, 255])
        ):

            print(
                "  WARNING: alpha contains "
                "intermediate values:",
                alpha_values.tolist()
            )

        valid = alpha > 0

        print(
            f"  Satellite-data pixels: {int(valid.sum()):,}"
        )

        print(
            f"  Transparent pixels: {int((~valid).sum()):,}"
        )

        if valid.sum() == 0:

            print(
                "  FAIL: satellite image "
                "contains no valid pixels"
            )

            success = False

        if rgb.shape == lulc.shape and valid.any():

            classes = lulc.read(1)

            class_valid = (
                (classes >= 1)
                & (classes <= 4)
            )

            missing_under_classes = (
                class_valid & ~valid
            )

            print(
                "  LULC pixels with missing RGB data: "
                f"{int(missing_under_classes.sum()):,} / "
                f"{int(class_valid.sum()):,}"
            )

            if missing_under_classes.any():

                print(
                    "  NOTE: Some gaps remain. "
                    "Do not invent satellite observations."
                )

        if success:
            print(
                "  PASS: RGB structure/grid/alpha audit"
            )

    return success


def main():

    passed = [
        check_year(year)
        for year in YEARS
    ]

    if all(passed):

        print(
            "\nPASS: all four satellite files passed "
            "structural checks"
        )

        return 0

    print(
        "\nNOT READY: resolve missing files or "
        "failed raster checks before integration"
    )

    return 1


if __name__ == "__main__":
    sys.exit(main())

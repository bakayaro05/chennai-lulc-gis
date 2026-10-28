
"""Historical satellite RGB tile service for Chennai LULC GIS.

Uses alpha-aware bilinear interpolation to improve display
of annual Landsat RGB imagery.

This smooths visible pixels but does not increase the
native 30-metre spatial resolution of the source imagery.

The categorical LULC raster renderer is NOT modified.
"""

from io import BytesIO

import numpy as np
import rasterio

from PIL import Image
from rasterio.enums import ColorInterp
from rasterio.transform import from_bounds
from rasterio.warp import reproject, Resampling

from catalog import (
    FILES,
    PROJECT_ROOT,
    RASTER_DIRECTORY,
)


SATELLITE_DIRECTORY = (
    PROJECT_ROOT / "data" / "raw" / "satellite"
)

RGB_FILES = {
    year: f"Chennai_RGB_{year}.tif"
    for year in FILES
}

WEB_MERCATOR_LIMIT = 20037508.342789244

TILE_SIZE = 256


def inspect_satellite_sources():
    """Validate genuine satellite rasters against LULC grids."""

    summary = {}

    for year, filename in RGB_FILES.items():

        rgb_path = SATELLITE_DIRECTORY / filename
        lulc_path = RASTER_DIRECTORY / FILES[year]

        if not rgb_path.is_file():
            raise RuntimeError(
                f"Missing historical satellite TIFF: {rgb_path}"
            )

        with rasterio.open(rgb_path) as rgb, \
             rasterio.open(lulc_path) as lulc:

            if (
                rgb.count != 4
                or rgb.dtypes != ("uint8",) * 4
            ):
                raise RuntimeError(
                    f"{year}: expected 4-band uint8 RGBA"
                )

            expected_channels = (
                ColorInterp.red,
                ColorInterp.green,
                ColorInterp.blue,
                ColorInterp.alpha,
            )

            if rgb.colorinterp != expected_channels:
                raise RuntimeError(
                    f"{year}: incorrect RGBA band interpretation"
                )

            if (
                rgb.crs != lulc.crs
                or rgb.shape != lulc.shape
                or not rgb.transform.almost_equals(
                    lulc.transform
                )
            ):
                raise RuntimeError(
                    f"{year}: RGB raster alignment mismatch"
                )

            alpha = rgb.read(4)

            lulc_valid = np.isin(
                lulc.read(1),
                (1, 2, 3, 4)
            )

            if not np.array_equal(
                alpha > 0,
                lulc_valid
            ):
                raise RuntimeError(
                    f"{year}: RGB and LULC footprints differ"
                )

            summary[str(year)] = {
                "source": filename,
                "nontransparent_pixels": int(
                    np.count_nonzero(alpha)
                ),
                "opaque_pixels": int(
                    np.count_nonzero(alpha == 255)
                ),
                "partial_alpha_pixels": int(
                    np.count_nonzero(
                        (alpha > 0) & (alpha < 255)
                    )
                ),
                "transparent_pixels": int(
                    np.count_nonzero(alpha == 0)
                ),
            }

    return summary


def satellite_tile_png(
    year: int,
    z: int,
    x: int,
    y: int
) -> bytes:
    """Render an alpha-aware satellite RGB web-map tile.

    Bilinear interpolation is used ONLY for continuous RGB.

    The fourth band contains genuine alpha coverage.
    Source pixels with RGB value zero must not be treated
    as missing because dark water may also have zero values.
    """

    span = (
        2 * WEB_MERCATOR_LIMIT
    ) / (2 ** z)

    west = (
        -WEB_MERCATOR_LIMIT
        + x * span
    )

    north = (
        WEB_MERCATOR_LIMIT
        - y * span
    )

    destination_transform = from_bounds(
        west,
        north - span,
        west + span,
        north,
        TILE_SIZE,
        TILE_SIZE
    )

    destination = np.zeros(
        (4, TILE_SIZE, TILE_SIZE),
        dtype=np.uint8
    )

    filepath = (
        SATELLITE_DIRECTORY
        / RGB_FILES[year]
    )

    with rasterio.open(filepath) as src:

        reproject(
            source=rasterio.band(
                src,
                (1, 2, 3, 4)
            ),
            destination=destination,
            src_transform=src.transform,
            src_crs=src.crs,
            dst_transform=destination_transform,
            dst_crs="EPSG:3857",

            # Explicitly preserve transparency during
            # RGB resampling.
            src_alpha=4,
            dst_alpha=4,

            # Smoother appearance for RGB imagery only.
            resampling=Resampling.bilinear,

            init_dest_nodata=True,
        )

    rgba = np.moveaxis(
        destination,
        0,
        -1
    )

    output = BytesIO()

    Image.fromarray(
        rgba,
        mode="RGBA"
    ).save(
        output,
        format="PNG",
        optimize=True
    )

    return output.getvalue()

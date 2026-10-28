
"""Read-only spatial processing for Chennai LULC rasters."""

from io import BytesIO
import json

import numpy as np
import rasterio

from PIL import Image
from pyproj import Transformer
from rasterio.transform import from_bounds
from rasterio.warp import (
    Resampling,
    reproject,
    transform_bounds,
)
from shapely.geometry import mapping, shape
from shapely.ops import (
    transform as shapely_transform,
    unary_union,
)

from catalog import (
    AREA_NOTICE,
    BOUNDARY_FILE,
    CLASS_COLORS,
    CLASS_NAMES,
    FILES,
    RASTER_DIRECTORY,
)


LOCKED_TRANSFORM = (
    30.0, 0.0, 399060.0,
    0.0, -30.0, 1463250.0,
)

TARGET_CRS = "EPSG:32644"

PIXEL_AREA_KM2 = 0.0009

MERCATOR_LIMIT = 20037508.342789244

LATLON_TO_UTM = Transformer.from_crs(
    "EPSG:4326",
    TARGET_CRS,
    always_xy=True,
)


def load_boundary():
    """Load only polygon geometries from the GEE GeoJSON."""

    with BOUNDARY_FILE.open(encoding="utf-8") as stream:
        source = json.load(stream)

    if (
        source.get("type") != "FeatureCollection"
        or not source.get("features")
    ):
        raise RuntimeError(
            "Boundary file is not a valid GeoJSON FeatureCollection"
        )

    polygons = []

    for feature in source["features"]:
        geometry = shape(feature["geometry"])

        if geometry.geom_type in ("Polygon", "MultiPolygon"):
            polygons.append(geometry)

        elif geometry.geom_type == "GeometryCollection":
            polygons.extend(
                item
                for item in geometry.geoms
                if item.geom_type in ("Polygon", "MultiPolygon")
            )

    if not polygons:
        raise RuntimeError(
            "No polygon geometry found in boundary GeoJSON"
        )

    combined = unary_union(polygons)

    if not combined.is_valid:
        raise RuntimeError("Study-area polygon is invalid")

    min_lon, min_lat, max_lon, max_lat = combined.bounds

    if not (
        70 < min_lon < max_lon < 90
        and 8 < min_lat < max_lat < 20
    ):
        raise RuntimeError(
            "Boundary coordinates do not match Chennai WGS84 bounds"
        )

    projected = shapely_transform(
        LATLON_TO_UTM.transform,
        combined,
    )

    area_km2 = projected.area / 1_000_000

    if not 528 < area_km2 < 531:
        raise RuntimeError(
            f"Unexpected study-area boundary: {area_km2} km2"
        )

    result = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Chennai Urban Study Area",
                    "vector_area_km2": round(area_km2, 6),
                    "source": "chennai_admin_study_area_clean",
                },
                "geometry": mapping(combined),
            }
        ],
    }

    return result, round(area_km2, 6)


def inspect_sources():
    """Verify all raster files before starting the API."""

    missing = [
        str(RASTER_DIRECTORY / filename)
        for filename in FILES.values()
        if not (RASTER_DIRECTORY / filename).is_file()
    ]

    if not BOUNDARY_FILE.is_file():
        missing.append(str(BOUNDARY_FILE))

    if missing:
        raise RuntimeError(
            "Missing required data files:\n" + "\n".join(missing)
        )

    boundary, vector_area = load_boundary()

    baseline_mask = None
    baseline_shape = None
    raster_bounds = None
    summaries = {}

    for year, filename in FILES.items():

        filepath = RASTER_DIRECTORY / filename

        with rasterio.open(filepath) as src:

            if (
                src.count != 1
                or src.crs is None
                or src.crs.to_epsg() != 32644
            ):
                raise RuntimeError(
                    f"{year}: expected one EPSG:32644 raster band"
                )

            if src.width != 951 or src.height != 1412:
                raise RuntimeError(
                    f"{year}: unexpected raster dimensions"
                )

            actual_transform = tuple(src.transform)[:6]

            if any(
                abs(actual - expected) > 1e-7
                for actual, expected in zip(
                    actual_transform,
                    LOCKED_TRANSFORM,
                )
            ):
                raise RuntimeError(
                    f"{year}: raster alignment does not match locked grid"
                )

            if src.nodata != -9999:
                raise RuntimeError(
                    f"{year}: expected NoData metadata -9999"
                )

            data = src.read(1)

            values = np.unique(data)

            if not np.all(
                np.isin(values, (0, 1, 2, 3, 4))
            ):
                raise RuntimeError(
                    f"{year}: invalid class IDs: {values.tolist()}"
                )

            # Background 0 is NOT a land-cover category.
            classified = (data >= 1) & (data <= 4)

            if baseline_mask is not None:
                if not np.array_equal(
                    classified,
                    baseline_mask,
                ):
                    raise RuntimeError(
                        f"{year}: classified footprint differs across years"
                    )

            baseline_mask = classified.copy()

            baseline_shape = data.shape

            counts = np.bincount(
                data[classified].astype(np.int64),
                minlength=5,
            )[1:5]

            summaries[year] = {
                "class_pixel_counts": {
                    str(i): int(counts[i - 1])
                    for i in range(1, 5)
                },
                "classified_pixels": int(classified.sum()),
                "background_zero_pixels": int((data == 0).sum()),
                "local_planar_area_km2": round(
                    float(classified.sum()) * PIXEL_AREA_KM2,
                    6,
                ),
            }

            if raster_bounds is None:
                raster_bounds = list(
                    transform_bounds(
                        src.crs,
                        "EPSG:4326",
                        *src.bounds,
                    )
                )

    return {
        "boundary": boundary,
        "boundary_area_km2": vector_area,
        "local_raster_statistics": summaries,
        "raster_bounds_lonlat": raster_bounds,
        "raster_shape": list(baseline_shape),
        "qa": (
            "Structural integrity and common footprint verified. "
            + AREA_NOTICE
        ),
    }


def inspect_pixel(year, lat, lon):
    """Read the true classification at a geographical location."""

    x, y = LATLON_TO_UTM.transform(lon, lat)

    filepath = RASTER_DIRECTORY / FILES[year]

    with rasterio.open(filepath) as src:

        row, col = src.index(x, y)

        if not (
            0 <= row < src.height
            and 0 <= col < src.width
        ):
            class_id = None

        else:
            sample = src.read(
                1,
                window=(
                    (row, row + 1),
                    (col, col + 1),
                ),
            )

            raw = int(sample[0, 0])

            class_id = raw if raw in CLASS_NAMES else None

    return {
        "year": year,
        "latitude": lat,
        "longitude": lon,
        "class_id": class_id,
        "class_name": CLASS_NAMES.get(class_id),
        "status": (
            "classified"
            if class_id is not None
            else "unclassified_or_outside"
        ),
    }


def tile_mercator_bounds(z, x, y):
    """Calculate the EPSG:3857 boundary of a web-map tile."""

    span = (2 * MERCATOR_LIMIT) / (2 ** z)

    left = -MERCATOR_LIMIT + x * span
    top = MERCATOR_LIMIT - y * span

    return (
        left,
        top - span,
        left + span,
        top,
    )


def tile_png(year, z, x, y):
    """Render a 256x256 PNG using nearest-neighbor resampling."""

    west, south, east, north = tile_mercator_bounds(
        z, x, y
    )

    destination_transform = from_bounds(
        west,
        south,
        east,
        north,
        256,
        256,
    )

    target = np.zeros(
        (256, 256),
        dtype=np.int16,
    )

    filepath = RASTER_DIRECTORY / FILES[year]

    with rasterio.open(filepath) as src:

        reproject(
            source=rasterio.band(src, 1),
            destination=target,
            src_transform=src.transform,
            src_crs=src.crs,
            src_nodata=0,
            dst_transform=destination_transform,
            dst_crs="EPSG:3857",
            dst_nodata=0,
            resampling=Resampling.nearest,
            init_dest_nodata=True,
        )

    rgba = np.zeros(
        (256, 256, 4),
        dtype=np.uint8,
    )

    for class_id, color in CLASS_COLORS.items():

        selector = target == class_id

        rgb = tuple(
            bytes.fromhex(color[1:])
        )

        rgba[selector, :3] = rgb
        rgba[selector, 3] = 255

    buffer = BytesIO()

    Image.fromarray(
        rgba,
        "RGBA",
    ).save(
        buffer,
        format="PNG",
        optimize=True,
    )

    return buffer.getvalue()


"""Integration tests for Chennai LULC GIS Stage 08.

Tests the actual FastAPI application using the real
classification and historical satellite GeoTIFFs.
"""

from io import BytesIO
import math

import numpy as np
import rasterio

from fastapi.testclient import TestClient
from PIL import Image
from pyproj import Transformer
from rasterio.transform import xy

from catalog import FILES, RASTER_DIRECTORY
from main import app


def get_sample_location():
    """Find a genuinely classified coordinate in 2025."""

    path = RASTER_DIRECTORY / FILES[2025]

    with rasterio.open(path) as src:
        data = src.read(1)

        rows, cols = np.where(
            (data >= 1) & (data <= 4)
        )

        assert len(rows) > 0

        index = len(rows) // 2

        row = int(rows[index])
        col = int(cols[index])

        class_id = int(data[row, col])

        easting, northing = xy(
            src.transform, row, col
        )

        transformer = Transformer.from_crs(
            src.crs,
            "EPSG:4326",
            always_xy=True
        )

        lon, lat = transformer.transform(
            easting, northing
        )

    return lat, lon, class_id


def get_tile_index(lat, lon, zoom):
    """Convert geographic coordinates to XYZ tile indices."""

    latitude_rad = math.radians(lat)

    x = int(
        (lon + 180) / 360 * (2 ** zoom)
    )

    y = int(
        (
            1
            - math.asinh(math.tan(latitude_rad))
            / math.pi
        )
        / 2
        * (2 ** zoom)
    )

    return x, y


def test_health_metadata_and_areas():
    """Verify startup, imagery sources and archived statistics."""

    with TestClient(app) as client:

        health = client.get("/api/health")

        assert health.status_code == 200

        result = health.json()

        assert result["status"] == "ok"
        assert result["raster_count"] == 4

        assert result["historical_satellite_years"] == [
            2010, 2015, 2020, 2025
        ]

        metadata_response = client.get(
            "/api/metadata"
        )

        assert metadata_response.status_code == 200

        metadata = metadata_response.json()

        assert metadata["years"] == [
            2010, 2015, 2020, 2025
        ]

        assert [
            category["id"]
            for category in metadata["classes"]
        ] == [1, 2, 3, 4]

        assert metadata["raster_crs"] == "EPSG:32644"

        assert "historical_satellite" in metadata

        areas = client.get(
            "/api/areas/2025"
        )

        assert areas.status_code == 200

        area_data = areas.json()

        assert area_data["basis"] == (
            "archived_GEE_pixelArea"
        )

        assert area_data["categories"][0][
            "area_km2"
        ] == 256.372809

        assert client.get(
            "/api/areas/2005"
        ).status_code == 404

        boundary = client.get("/api/boundary")

        assert boundary.status_code == 200

        assert boundary.json()["type"] == (
            "FeatureCollection"
        )


def test_classification_pixel_and_tile():
    """Verify real pixel queries and classification tile PNGs."""

    lat, lon, expected_class = get_sample_location()

    with TestClient(app) as client:

        response = client.get(
            "/api/pixel",
            params={
                "year": 2025,
                "lat": lat,
                "lon": lon
            }
        )

        assert response.status_code == 200

        assert response.json()["class_id"] == (
            expected_class
        )

        zoom = 11

        x, y = get_tile_index(
            lat, lon, zoom
        )

        response = client.get(
            f"/api/tiles/2025/{zoom}/{x}/{y}.png"
        )

        assert response.status_code == 200

        assert response.headers[
            "content-type"
        ] == "image/png"

        image = Image.open(
            BytesIO(response.content)
        ).convert("RGBA")

        assert image.size == (256, 256)

        pixels = np.asarray(image)

        # At least some classified pixels must be visible.
        assert np.any(
            pixels[:, :, 3] > 0
        )


def test_historical_satellite_tiles():
    """Verify all four genuine historical RGB tile endpoints."""

    lat, lon, _ = get_sample_location()

    zoom = 11

    x, y = get_tile_index(
        lat, lon, zoom
    )

    outputs = {}

    with TestClient(app) as client:

        for year in [2010, 2015, 2020, 2025]:

            response = client.get(
                f"/api/satellite-tiles/"
                f"{year}/{zoom}/{x}/{y}.png"
            )

            assert response.status_code == 200

            assert response.headers[
                "content-type"
            ] == "image/png"

            image = Image.open(
                BytesIO(response.content)
            ).convert("RGBA")

            assert image.size == (256, 256)

            pixels = np.asarray(image)

            assert np.any(
                pixels[:, :, 3] > 0
            )

            outputs[year] = image.tobytes()

        # The historical images must not all be identical.
        assert outputs[2010] != outputs[2025]

        invalid = client.get(
            f"/api/satellite-tiles/"
            f"2005/{zoom}/{x}/{y}.png"
        )

        assert invalid.status_code == 404

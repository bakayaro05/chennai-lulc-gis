
"""Chennai LULC scientific metadata and approved GEE statistics."""

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]

RASTER_DIRECTORY = PROJECT_ROOT / "data" / "raw" / "lulc4"

BOUNDARY_FILE = (
    PROJECT_ROOT / "data" / "raw" / "boundary"
    / "chennai_study_area.geojson"
)

FILES = {
    2010: "Chennai_LULC4_2010_provisional.tif",
    2015: "Chennai_LULC4_2015.tif",
    2020: "Chennai_LULC4_2020.tif",
    2025: "Chennai_LULC4_2025.tif",
}

CLASS_NAMES = {
    1: "Built-up",
    2: "Vegetation",
    3: "Water",
    4: "Agricultural & Vacant/Unused Open Land",
}

CLASS_COLORS = {
    1: "#e53935",
    2: "#2e7d32",
    3: "#1976d2",
    4: "#d8b365",
}

# Official archived GEE class-area measurements (km2).
# Do not overwrite using unweighted local pixel counts.
AREAS_GEE_KM2 = {
    2010: (
        279.821871,
        81.218516,
        21.778480,
        146.952238,
    ),
    2015: (
        200.882401,
        33.654600,
        39.730711,
        255.503391,
    ),
    2020: (
        225.716608,
        14.108663,
        22.036104,
        267.909728,
    ),
    2025: (
        256.372809,
        44.269634,
        20.389113,
        208.739548,
    ),
}

# Original five-class OA, reporting four-class OA (%).
ACCURACY = {
    2010: (69.3333, 81.0000),
    2015: (85.6667, 88.6667),
    2020: (86.3333, 95.6667),
    2025: (83.6667, 96.6667),
}

PROVISIONAL_NOTICE = (
    "2010 is provisional. The approximately 78.94 km2 "
    "mapped Built-up decline from 2010 to 2015 is not "
    "verified urban loss. Transition 14 (Built-up to "
    "Agricultural/Unused Open) is affected by "
    "classification disagreement."
)

AREA_NOTICE = (
    "Published areas use archived Google Earth Engine "
    "pixelArea results. Local GeoTIFF whole-pixel counts "
    "use 900 square metres per pixel and differ slightly. "
    "Exact area-convention reconciliation is pending."
)


def classes_list():
    return [
        {
            "id": class_id,
            "name": CLASS_NAMES[class_id],
            "color": CLASS_COLORS[class_id],
        }
        for class_id in CLASS_NAMES
    ]


def year_warning(year):
    if year == 2010:
        return PROVISIONAL_NOTICE
    return None


def year_areas(year):
    values = AREAS_GEE_KM2[year]

    categories = []

    for class_id in CLASS_NAMES:
        categories.append({
            "class_id": class_id,
            "name": CLASS_NAMES[class_id],
            "color": CLASS_COLORS[class_id],
            "area_km2": round(values[class_id - 1], 6),
        })

    return {
        "year": year,
        "basis": "archived_GEE_pixelArea",
        "unit": "km2",
        "categories": categories,
        "total_km2": round(sum(values), 6),
        "warning": year_warning(year),
        "area_methodology_warning": AREA_NOTICE,
    }

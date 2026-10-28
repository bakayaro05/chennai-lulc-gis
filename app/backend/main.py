
"""Chennai LULC GIS Stage 08 — historical raster and satellite REST API."""
from contextlib import asynccontextmanager
from functools import lru_cache

from fastapi import FastAPI, HTTPException, Path, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from catalog import (
    ACCURACY, AREA_NOTICE, FILES, PROVISIONAL_NOTICE,
    classes_list, year_areas, year_warning,
)
from raster_service import inspect_pixel, inspect_sources, tile_png
from satellite_service import inspect_satellite_sources, satellite_tile_png


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Fail clearly on missing/wrong real data instead of displaying fake imagery.
    app.state.sources = inspect_sources()
    app.state.satellite_sources = inspect_satellite_sources()
    yield


app = FastAPI(title="Chennai LULC GIS API", version="0.2.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


def verify_year(year: int) -> int:
    if year not in FILES:
        raise HTTPException(404, f"Unsupported year {year}; use 2010, 2015, 2020 or 2025")
    return year


def verify_tile_coordinates(z: int, x: int, y: int) -> None:
    if x >= 2**z or y >= 2**z:
        raise HTTPException(404, "Tile coordinates outside zoom level")


@app.get("/api/health")
def health(request: Request):
    data = request.app.state.sources
    return {
        "status": "ok", "raster_count": len(FILES),
        "source_files_verified_on_startup": True,
        "boundary_vector_area_km2": data["boundary_area_km2"],
        "historical_satellite_years": sorted(int(y) for y in request.app.state.satellite_sources),
    }


@app.get("/api/metadata")
def metadata(request: Request):
    source = request.app.state.sources
    return {
        "study_area": "Chennai Urban Study Area",
        "years": list(FILES), "classes": classes_list(),
        "raster_crs": "EPSG:32644", "raster_resolution_m": 30,
        "web_tiles_crs": "EPSG:3857",
        "raster_bounds_lonlat": source["raster_bounds_lonlat"],
        "boundary_vector_area_km2": source["boundary_area_km2"],
        "accuracy": [
            {
                "year": y,
                "original_five_class_oa_percent": ACCURACY[y][0],
                "reporting_four_class_oa_percent": ACCURACY[y][1],
                "status": "provisional" if y == 2010 else (
                    "area_matched_recovered_raster" if y == 2025 else "approved"
                ),
                "source_raster_filename": FILES[y], "warning": year_warning(y),
            }
            for y in FILES
        ],
        "provenance": "Original five-class Gaussian MLC; classes 4 and 5 combined after classification into reporting class 4.",
        "area_methodology_warning": AREA_NOTICE,
        "provisional_2010_warning": PROVISIONAL_NOTICE,
        "local_raster_statistics": source["local_raster_statistics"],
        "historical_satellite": {
            "available_years": list(FILES),
            "source": "Annual cloud-reduced Landsat Collection 2 Level-2 surface-reflectance median composites",
            "representation": "8-bit display-stretched true-colour RGBA; 30 m; not a single-date image",
            "tiles": "/api/satellite-tiles/{year}/{z}/{x}/{y}.png",
            "coverage": request.app.state.satellite_sources,
        },
    }


@app.get("/api/areas")
def areas():
    return {
        "source": "archived_GEE_pixelArea",
        "years": [year_areas(y) for y in FILES],
        "note": AREA_NOTICE,
    }


@app.get("/api/areas/{year}")
def area_by_year(year: int):
    return year_areas(verify_year(year))


@app.get("/api/boundary")
def boundary(request: Request):
    return request.app.state.sources["boundary"]


@app.get("/api/pixel")
def pixel(
    year: int = Query(...),
    lat: float = Query(..., ge=-90, le=90, allow_inf_nan=False),
    lon: float = Query(..., ge=-180, le=180, allow_inf_nan=False),
):
    verify_year(year)
    return {**inspect_pixel(year, lat, lon), "warning": year_warning(year)}


@lru_cache(maxsize=512)
def cached_classification_tile(year: int, z: int, x: int, y: int):
    return tile_png(year, z, x, y)


@lru_cache(maxsize=512)
def cached_satellite_tile(year: int, z: int, x: int, y: int):
    return satellite_tile_png(year, z, x, y)


@app.get("/api/tiles/{year}/{z}/{x}/{y}.png")
def tile(
    year: int,
    z: int = Path(ge=0, le=18),
    x: int = Path(ge=0),
    y: int = Path(ge=0),
):
    verify_year(year)
    verify_tile_coordinates(z, x, y)
    return Response(
        content=cached_classification_tile(year, z, x, y),
        media_type="image/png",
        headers={"Cache-Control": "public, max-age=300"},
    )


@app.get("/api/satellite-tiles/{year}/{z}/{x}/{y}.png")
def satellite_tile(
    year: int,
    z: int = Path(ge=0, le=18),
    x: int = Path(ge=0),
    y: int = Path(ge=0),
):
    verify_year(year)
    verify_tile_coordinates(z, x, y)
    return Response(
        content=cached_satellite_tile(year, z, x, y),
        media_type="image/png",
        headers={"Cache-Control": "public, max-age=300"},
    )

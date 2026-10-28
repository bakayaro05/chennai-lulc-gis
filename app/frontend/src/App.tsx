
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GeoJSON,
  MapContainer,
  Popup,
  ScaleControl,
  TileLayer,
  useMapEvents,
  ZoomControl
} from "react-leaflet";

import type { LatLngBoundsExpression } from "leaflet";
import type { FeatureCollection } from "geojson";

import { API_BASE_URL, getApi } from "./api";
import type {
  AccuracyRecord,
  AllAreas,
  Metadata,
  PixelResult,
  YearAreas
} from "./api";

import "./timelapse.css";
import "./historical.css";

type BasemapType = "street" | "satellite";
type DisplayMode = "classification" | "historical" | "combined";
type ClickLocation = [number, number];

const FALLBACK_YEARS = [2010, 2015, 2020, 2025];

const SPEED_OPTIONS = [
  { value: 800, label: "Fast · 0.8 s" },
  { value: 1600, label: "Normal · 1.6 s" },
  { value: 3000, label: "Slow · 3 s" }
];

const SATELLITE_BASEMAP =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

const STREET_BASEMAP =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const SATELLITE_ATTRIBUTION =
  "Tiles &copy; Esri — Esri, Maxar, Earthstar Geographics and the GIS User Community";

const STREET_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const formatArea = (value: number) =>
  new Intl.NumberFormat("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);

interface MapInteractionProps {
  bounds: LatLngBoundsExpression;
  resetVersion: number;
  onInspect: (lat: number, lon: number) => void;
  onZoomChange: (zoom: number) => void;
}

function MapInteractions({
  bounds,
  resetVersion,
  onInspect,
  onZoomChange
}: MapInteractionProps) {
  const map = useMapEvents({
    click(event) {
      onInspect(event.latlng.lat, event.latlng.lng);
    },

    zoomend() {
      onZoomChange(map.getZoom());
    }
  });

  // Changing the year or imagery mode MUST NOT recenter the map.
  useEffect(() => {
    map.fitBounds(bounds, {
      padding: [25, 25],
      maxZoom: 12
    });

    onZoomChange(map.getZoom());
  }, [map, bounds, resetVersion, onZoomChange]);

  return null;
}

export default function App() {
  const [metadata, setMetadata] =
    useState<Metadata | null>(null);

  const [areas, setAreas] =
    useState<AllAreas | null>(null);

  const [boundary, setBoundary] =
    useState<FeatureCollection | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retryVersion, setRetryVersion] = useState(0);

  const [year, setYear] = useState(2025);

  // New: three GIS visualization modes.
  const [mode, setMode] =
    useState<DisplayMode>("classification");

  const [basemap, setBasemap] =
    useState<BasemapType>("satellite");

  const [opacity, setOpacity] = useState(78);

  const [showClassification, setShowClassification] =
    useState(true);

  const [showBoundary, setShowBoundary] =
    useState(true);

  const [resetVersion, setResetVersion] = useState(0);
  const [zoom, setZoom] = useState(11);
  const [tileError, setTileError] = useState(false);

  // Shared timelapse player.
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(1600);
  const [repeat, setRepeat] = useState(true);

  const years = useMemo(
    () => metadata?.years ?? FALLBACK_YEARS,
    [metadata]
  );

  const frameIndex = Math.max(
    0,
    years.indexOf(year)
  );

  const [clickedLocation, setClickedLocation] =
    useState<ClickLocation | null>(null);

  const [pixel, setPixel] =
    useState<PixelResult | null>(null);

  const [pixelLoading, setPixelLoading] =
    useState(false);

  const [pixelError, setPixelError] = useState("");

  const inspectRequestId = useRef(0);

  // Load metadata, official area statistics and boundary.
  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setLoadError("");

    Promise.all([
      getApi<Metadata>(
        "/api/metadata",
        controller.signal
      ),
      getApi<AllAreas>(
        "/api/areas",
        controller.signal
      ),
      getApi<FeatureCollection>(
        "/api/boundary",
        controller.signal
      )
    ])
      .then(([meta, areaData, boundaryData]) => {
        if (controller.signal.aborted) return;

        setMetadata(meta);
        setAreas(areaData);
        setBoundary(boundaryData);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        setLoadError(
          error instanceof Error
            ? error.message
            : "Cannot reach GIS backend"
        );

        setLoading(false);
      });

    return () => controller.abort();
  }, [retryVersion]);

  // Timelapse works with all three display modes.
  useEffect(() => {
    if (!playing || years.length < 2) return;

    const interval = window.setInterval(() => {
      setYear((previous) => {
        const index = years.indexOf(previous);

        if (index < 0) {
          return years[0];
        }

        if (index === years.length - 1) {
          return repeat
            ? years[0]
            : previous;
        }

        return years[index + 1];
      });
    }, speedMs);

    return () => window.clearInterval(interval);
  }, [playing, years, repeat, speedMs]);

  // Stop at 2025 if looping is switched off.
  useEffect(() => {
    if (
      playing &&
      !repeat &&
      year === years[years.length - 1]
    ) {
      setPlaying(false);
    }
  }, [playing, repeat, year, years]);

  // Clear stale inspection and tile errors.
  useEffect(() => {
    inspectRequestId.current += 1;

    setClickedLocation(null);
    setPixel(null);
    setPixelLoading(false);
    setPixelError("");
    setTileError(false);
  }, [year, mode]);

  const selectYear = (nextYear: number) => {
    setPlaying(false);
    setYear(nextYear);
  };

  // Switching modes does not alter the map position.
  const selectMode = (nextMode: DisplayMode) => {
    setPlaying(false);
    setMode(nextMode);

    if (nextMode === "combined") {
      setShowClassification(true);
    }
  };

  const togglePlayback = () => {
    if (playing) {
      setPlaying(false);
      return;
    }

    if (mode !== "historical") {
      setShowClassification(true);
    }

    if (
      !repeat &&
      year === years[years.length - 1]
    ) {
      setYear(years[0]);
    }

    setPlaying(true);
  };

  const stepYear = (direction: -1 | 1) => {
    setPlaying(false);

    const next = frameIndex + direction;

    if (next < 0) {
      setYear(
        repeat
          ? years[years.length - 1]
          : years[0]
      );
    } else if (next >= years.length) {
      setYear(
        repeat
          ? years[0]
          : years[years.length - 1]
      );
    } else {
      setYear(years[next]);
    }
  };

  const bounds = useMemo<
    LatLngBoundsExpression | null
  >(() => {
    if (!metadata) return null;

    const [west, south, east, north] =
      metadata.raster_bounds_lonlat;

    return [
      [south, west],
      [north, east]
    ];
  }, [metadata]);

  const currentAreas: YearAreas | undefined =
    areas?.years.find(
      (item) => item.year === year
    );

  const currentAccuracy: AccuracyRecord | undefined =
    metadata?.accuracy.find(
      (item) => item.year === year
    );

  const currentPixelCount =
    metadata?.local_raster_statistics[
      String(year)
    ]?.classified_pixels;

  // Pixel inspection always refers to the selected LULC map.
  const handleInspect = useCallback(
    async (lat: number, lon: number) => {
      setPlaying(false);

      const requestId =
        ++inspectRequestId.current;

      setClickedLocation([lat, lon]);
      setPixel(null);
      setPixelError("");
      setPixelLoading(true);

      try {
        const result = await getApi<PixelResult>(
          `/api/pixel?year=${year}` +
          `&lat=${lat.toFixed(8)}` +
          `&lon=${lon.toFixed(8)}`
        );

        if (requestId === inspectRequestId.current) {
          setPixel(result);
        }
      } catch (error) {
        if (requestId === inspectRequestId.current) {
          setPixelError(
            error instanceof Error
              ? error.message
              : "Pixel inspection failed"
          );
        }
      } finally {
        if (requestId === inspectRequestId.current) {
          setPixelLoading(false);
        }
      }
    },
    [year]
  );

  if (
    loading ||
    loadError ||
    !metadata ||
    !areas ||
    !boundary
  ) {
    return (
      <div className="startup-screen">
        <div className="startup-card">
          <div className="brand-symbol">
            GIS
          </div>

          <div className="eyebrow">
            CHENNAI URBAN STUDY AREA
          </div>

          <h1>Chennai LULC Explorer</h1>

          {loading ? (
            <p>
              Connecting to your local GIS backend...
            </p>
          ) : (
            <>
              <p className="error-text">
                Unable to load project data.
              </p>

              <div className="error-details">
                {loadError || "Missing data"}
              </div>

              <p>
                Check FastAPI at
                http://127.0.0.1:8000.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  setRetryVersion((v) => v + 1)
                }
              >
                Retry connection
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const totalArea = currentAreas?.total_km2 ?? 0;

  // Existing four-class classification endpoint.
  const classificationTile =
    `${API_BASE_URL}/api/tiles/` +
    `${year}/{z}/{x}/{y}.png`;

  // New historical satellite endpoint.
  const historicalTile =
    `${API_BASE_URL}/api/satellite-tiles/` +
    `${year}/{z}/{x}/{y}.png`;

  const isHistorical =
    mode !== "classification";

  const displayClassification =
    mode !== "historical" &&
    showClassification;

  // Never show an undated high-resolution satellite
  // basemap underneath historical Landsat imagery.
  const useCurrentSatelliteBasemap =
    mode === "classification" &&
    basemap === "satellite";

  const modeLabel =
    mode === "classification"
      ? "CLASSIFICATION"
      : mode === "historical"
        ? "HISTORICAL LANDSAT RGB"
        : "HISTORICAL RGB + LULC";

  return (
    <div className="app-shell">

      {/* HEADER */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-symbol">
            GIS
          </div>

          <div>
            <div className="brand-title">
              CHENNAI LULC
            </div>

            <div className="brand-subtitle">
              Geospatial Research Explorer
            </div>
          </div>
        </div>

        <div className="header-right">
          <span className="project-tag">
            STAGE 08
          </span>

          <span className="connection-status">
            <span className="status-dot" />
            Local API connected
          </span>
        </div>
      </header>

      <main className="workspace">
        <aside className="sidebar">

          {/* INTRODUCTION */}
          <div className="sidebar-intro">
            <div className="eyebrow">
              MULTI-TEMPORAL LAND COVER
            </div>

            <h1>Explore Chennai</h1>

            <p>
              Explore mapped land cover and genuine
              annual Landsat composites for four
              observation years.
            </p>
          </div>

          {/* YEAR SELECTION */}
          <section className="side-section">
            <div className="section-heading">
              <h2>Observation year</h2>
              <span>01 / 05</span>
            </div>

            <div className="year-grid">
              {years.map((option) => (
                <button
                  key={option}
                  className={
                    `year-button ${
                      year === option
                        ? "selected"
                        : ""
                    }`
                  }
                  aria-pressed={year === option}
                  onClick={() => selectYear(option)}
                >
                  {option}

                  {option === 2010 && (
                    <span
                      className="year-dot"
                      title="Provisional 2010 classification"
                    />
                  )}
                </button>
              ))}
            </div>

            <p className="section-caption">
              2010 LULC is provisional. Historical
              RGB is an annual composite, not a
              single-date photo.
            </p>
          </section>

          {/* HISTORICAL TIMELAPSE */}
          <section
            className="side-section timelapse-section"
            aria-label="Timelapse player"
          >
            <div className="section-heading">
              <h2>Timelapse player</h2>
              <span>02 / 05</span>
            </div>

            {/* NEW DISPLAY MODES */}
            <div
              className="mode-grid"
              role="group"
              aria-label="Timelapse display mode"
            >
              <button
                className={
                  `mode-button ${
                    mode === "classification"
                      ? "active"
                      : ""
                  }`
                }
                aria-pressed={
                  mode === "classification"
                }
                onClick={() =>
                  selectMode("classification")
                }
              >
                Classification
              </button>

              <button
                className={
                  `mode-button ${
                    mode === "historical"
                      ? "active"
                      : ""
                  }`
                }
                aria-pressed={
                  mode === "historical"
                }
                onClick={() =>
                  selectMode("historical")
                }
              >
                Historical RGB
              </button>

              <button
                className={
                  `mode-button ${
                    mode === "combined"
                      ? "active"
                      : ""
                  }`
                }
                aria-pressed={
                  mode === "combined"
                }
                onClick={() =>
                  selectMode("combined")
                }
              >
                Combined
              </button>
            </div>

            {/* TIMELAPSE CONTROLS */}
            <div className="timelapse-player">
              <div className="timelapse-head">
                <span>
                  FRAME {frameIndex + 1} /{" "}
                  {years.length}
                </span>

                <strong>
                  {year}
                  {year === 2010
                    ? " · Provisional LULC"
                    : ""}
                </strong>
              </div>

              <input
                className="timelapse-range"
                type="range"
                aria-label="Choose timelapse year"
                min={0}
                max={years.length - 1}
                step={1}
                value={frameIndex}
                onChange={(event) =>
                  selectYear(
                    years[
                      Number(event.target.value)
                    ]
                  )
                }
              />

              <div
                className="timelapse-years"
                aria-hidden="true"
              >
                {years.map((item) => (
                  <span key={item}>
                    {item}
                  </span>
                ))}
              </div>

              <div className="timelapse-actions">
                <button
                  type="button"
                  onClick={() => stepYear(-1)}
                  aria-label="Previous year"
                >
                  ◀◀
                </button>

                <button
                  type="button"
                  className="timelapse-play"
                  onClick={togglePlayback}
                  aria-label={
                    playing
                      ? "Pause timelapse"
                      : "Play timelapse"
                  }
                  aria-pressed={playing}
                >
                  {playing
                    ? "❚❚ Pause"
                    : "▶ Play"}
                </button>

                <button
                  type="button"
                  onClick={() => stepYear(1)}
                  aria-label="Next year"
                >
                  ▶▶
                </button>
              </div>

              <div className="timelapse-settings">
                <label htmlFor="timelapse-speed">
                  Playback speed
                </label>

                <select
                  id="timelapse-speed"
                  value={speedMs}
                  onChange={(event) =>
                    setSpeedMs(
                      Number(event.target.value)
                    )
                  }
                >
                  {SPEED_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="timelapse-loop">
                <input
                  type="checkbox"
                  checked={repeat}
                  onChange={(event) =>
                    setRepeat(event.target.checked)
                  }
                />
                Loop continuously
              </label>

              <div
                className="timelapse-state"
                role="status"
                aria-live="off"
              >
                {playing
                  ? `Playing ${modeLabel.toLowerCase()} snapshots`
                  : "Paused · choose a year or press Play"}
              </div>
            </div>

            <p className="historical-note">
              {isHistorical
                ? "Historical imagery is a year-specific, cloud-reduced 30 m Landsat composite. Outside Chennai coverage, the background is street mapping — never an undated satellite photo."
                : "Classification switches between years; the optional high-resolution satellite basemap is reference imagery and does not change with the year."}
            </p>
          </section>

          {/* MAP APPEARANCE */}
          <section className="side-section">
            <div className="section-heading">
              <h2>Map appearance</h2>
              <span>03 / 05</span>
            </div>

            <label className="field-label">
              Reference basemap
            </label>

            <div className="segmented">
              <button
                disabled={isHistorical}
                className={
                  basemap === "satellite" &&
                  !isHistorical
                    ? "active"
                    : ""
                }
                aria-pressed={
                  useCurrentSatelliteBasemap
                }
                onClick={() =>
                  setBasemap("satellite")
                }
              >
                Satellite
              </button>

              <button
                disabled={isHistorical}
                className={
                  basemap === "street" &&
                  !isHistorical
                    ? "active"
                    : ""
                }
                aria-pressed={
                  !useCurrentSatelliteBasemap
                }
                onClick={() =>
                  setBasemap("street")
                }
              >
                Streets
              </button>
            </div>

            {isHistorical && (
              <p className="section-caption">
                Historical mode uses streets only
                outside the Landsat coverage.
              </p>
            )}

            <div className="toggle-row">
              <label htmlFor="classification-visibility">
                Classification overlay
              </label>

              <input
                id="classification-visibility"
                type="checkbox"
                checked={displayClassification}
                disabled={mode === "historical"}
                onChange={(event) => {
                  setShowClassification(
                    event.target.checked
                  );

                  if (
                    !event.target.checked &&
                    mode === "classification"
                  ) {
                    setPlaying(false);
                  }
                }}
              />
            </div>

            <div className="slider-heading">
              <label htmlFor="opacity-control">
                Classification opacity
              </label>

              <strong>
                {opacity}%
              </strong>
            </div>

            <input
              id="opacity-control"
              className="opacity-slider"
              type="range"
              min="0"
              max="100"
              step="5"
              value={opacity}
              disabled={!displayClassification}
              onChange={(event) =>
                setOpacity(
                  Number(event.target.value)
                )
              }
            />

            <div className="toggle-row">
              <label htmlFor="boundary-visibility">
                Study-area boundary
              </label>

              <input
                id="boundary-visibility"
                type="checkbox"
                checked={showBoundary}
                onChange={(event) =>
                  setShowBoundary(
                    event.target.checked
                  )
                }
              />
            </div>
          </section>

          {/* LAND COVER STATISTICS */}
          <section className="side-section">
            <div className="section-heading">
              <h2>Land-cover composition</h2>
              <span>04 / 05</span>
            </div>

            <div className="legend-list">
              {currentAreas?.categories.map(
                (category) => {
                  const percent =
                    totalArea > 0
                      ? (
                          category.area_km2 /
                          totalArea
                        ) * 100
                      : 0;

                  return (
                    <div
                      className="legend-item"
                      key={category.class_id}
                    >
                      <div className="legend-line">
                        <span
                          className="legend-swatch"
                          style={{
                            background:
                              category.color
                          }}
                        />

                        <span className="legend-name">
                          {category.name}
                        </span>

                        <span className="legend-value">
                          {percent.toFixed(1)}%
                        </span>
                      </div>

                      <div className="legend-track">
                        <div
                          className="legend-fill"
                          style={{
                            width: `${percent}%`,
                            background:
                              category.color
                          }}
                        />
                      </div>

                      <div className="legend-area">
                        {formatArea(
                          category.area_km2
                        )}{" "}
                        km²
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <div className="metric-row">
              <span>
                Official GEE mapped area
              </span>

              <strong>
                {formatArea(totalArea)} km²
              </strong>
            </div>

            <div className="metric-row">
              <span>
                Four-class overall accuracy
              </span>

              <strong>
                {currentAccuracy
                  ?.reporting_four_class_oa_percent
                  .toFixed(2)}%
              </strong>
            </div>

            <div className="metric-row">
              <span>
                Original five-class accuracy
              </span>

              <strong>
                {currentAccuracy
                  ?.original_five_class_oa_percent
                  .toFixed(2)}%
              </strong>
            </div>

            {mode === "historical" && (
              <p className="section-caption">
                These statistics describe the{" "}
                {year} LULC classification,
                not an RGB measurement.
              </p>
            )}
          </section>

          {/* PIXEL INSPECTION */}
          <section className="side-section inspection-section">
            <div className="section-heading">
              <h2>Pixel inspector</h2>
              <span>05 / 05</span>
            </div>

            {!clickedLocation && (
              <p className="inspection-hint">
                Click the map to inspect its{" "}
                {year} LULC class. Playback pauses
                during inspection.
              </p>
            )}

            {clickedLocation && (
              <div className="inspection-result">
                <div className="coordinates">
                  {clickedLocation[0].toFixed(5)}° N,{" "}
                  {clickedLocation[1].toFixed(5)}° E
                </div>

                {pixelLoading && (
                  <p>
                    Reading the raster...
                  </p>
                )}

                {pixelError && (
                  <p className="error-text">
                    {pixelError}
                  </p>
                )}

                {pixel && (
                  <>
                    <div className="inspection-name">
                      {pixel.class_name ||
                        "Outside classified coverage"}
                    </div>

                    <p>
                      Year:{" "}
                      <strong>{pixel.year}</strong>
                      {" · "}
                      Class ID:{" "}
                      <strong>
                        {pixel.class_id ?? "NoData"}
                      </strong>
                    </p>
                  </>
                )}
              </div>
            )}
          </section>

          {/* PROVISIONAL 2010 WARNING */}
          {currentAccuracy?.warning && (
            <div className="warning-panel">
              <strong>
                Provisional classification — 2010
              </strong>

              <p>
                {currentAccuracy.warning}
              </p>
            </div>
          )}

          {/* METHODOLOGY */}
          <details className="methodology-panel">
            <summary>
              Data interpretation &amp; limitations
            </summary>

            <p>
              {metadata.provenance}
            </p>

            <p>
              {metadata.area_methodology_warning}
            </p>

            <p>
              Historical imagery is annual cloud-reduced
              Landsat imagery, visually stretched for
              display; it is not Google Earth
              high-resolution historical photography.
            </p>

            <p>
              Classified results are estimates.
              Mapped loss does not establish
              actual demolition.
            </p>
          </details>
        </aside>

        {/* MAIN MAP */}
        <section className="map-workspace">
          <div className="map-heading">
            <div>
              <div className="eyebrow">
                INTERACTIVE GEOSPATIAL TIMELAPSE
              </div>

              <h2>
                {year}{" "}
                {mode === "classification"
                  ? "Land-cover Distribution"
                  : mode === "historical"
                    ? "Historical Satellite Composite"
                    : "Satellite + Land-cover"}
              </h2>
            </div>

            <div className="map-heading-actions">
              {playing && (
                <span className="timelapse-live">
                  <span />
                  TIMELAPSE PLAYING
                </span>
              )}

              <span className="resolution-tag">
                30 m resolution
              </span>

              <button
                className="reset-button"
                onClick={() =>
                  setResetVersion(
                    (v) => v + 1
                  )
                }
              >
                Reset map
              </button>
            </div>
          </div>

          <div className="map-panel">
            {bounds && (
              <MapContainer
                center={[13.045, 80.20]}
                zoom={11}
                minZoom={8}
                maxZoom={18}
                zoomControl={false}
                className="gis-map"
              >
                {/* Reference basemap */}
                <TileLayer
                  key={
                    useCurrentSatelliteBasemap
                      ? "reference-satellite"
                      : "reference-streets"
                  }
                  url={
                    useCurrentSatelliteBasemap
                      ? SATELLITE_BASEMAP
                      : STREET_BASEMAP
                  }
                  attribution={
                    useCurrentSatelliteBasemap
                      ? SATELLITE_ATTRIBUTION
                      : STREET_ATTRIBUTION
                  }
                  maxZoom={18}
                />

                {/* NEW: ACTUAL YEAR-SPECIFIC LANDSAT */}
                {isHistorical && (
                  <TileLayer
                    key={`historical-${year}`}
                    url={historicalTile}
                    bounds={bounds}
                    tileSize={256}
                    maxZoom={18}
                    opacity={1}
                    zIndex={200}
                    eventHandlers={{
                      tileerror: () =>
                        setTileError(true)
                    }}
                  />
                )}

                {/* Existing LULC overlay */}
                {displayClassification && (
                  <TileLayer
                    key={`classification-${year}`}
                    url={classificationTile}
                    bounds={bounds}
                    tileSize={256}
                    maxZoom={18}
                    opacity={opacity / 100}
                    zIndex={300}
                    eventHandlers={{
                      tileerror: () =>
                        setTileError(true)
                    }}
                  />
                )}

                {/* Official study-area boundary */}
                {showBoundary && (
                  <GeoJSON
                    data={boundary}
                    interactive={false}
                    style={{
                      color:
                        isHistorical ||
                        basemap === "satellite"
                          ? "#ffdf6d"
                          : "#182e48",
                      weight: 2.5,
                      opacity: 0.95,
                      fillOpacity: 0,
                      dashArray: "7 4"
                    }}
                  />
                )}

                <MapInteractions
                  bounds={bounds}
                  resetVersion={resetVersion}
                  onInspect={handleInspect}
                  onZoomChange={setZoom}
                />

                {clickedLocation && (
                  <Popup
                    key={
                      `${year}-` +
                      clickedLocation.join("-")
                    }
                    position={clickedLocation}
                    className="pixel-popup"
                  >
                    <div className="popup-content">
                      <strong>
                        {year} LULC Pixel Inspection
                      </strong>

                      {pixelLoading && (
                        <p>
                          Reading classification...
                        </p>
                      )}

                      {pixelError && (
                        <p>{pixelError}</p>
                      )}

                      {pixel && (
                        <>
                          <p>
                            {pixel.class_name ||
                              "No classified coverage"}
                          </p>

                          <small>
                            Class:{" "}
                            {pixel.class_id ?? "NoData"}
                          </small>
                        </>
                      )}
                    </div>
                  </Popup>
                )}

                <ScaleControl
                  position="bottomleft"
                  metric={true}
                  imperial={false}
                />

                <ZoomControl
                  position="topright"
                />
              </MapContainer>
            )}

            <div className="map-overlay-label">
              <span className="overlay-status-dot" />

              {modeLabel}

              <span className="overlay-divider">
                /
              </span>

              {year}

              <span className="overlay-divider">
                /
              </span>

              ZOOM {zoom}
            </div>

            {tileError && (
              <div className="tile-error">
                A raster tile failed. Check the
                FastAPI terminal and the satellite
                TIFF folder.
              </div>
            )}

            <div className="map-footer-note">
              {isHistorical
                ? "Annual Landsat RGB · 30 m · historical composite"
                : "Classification timelapse · reference basemap is not historical"}
            </div>
          </div>

          {/* BOTTOM STATISTICS */}
          <footer className="map-bottom">
            <div className="bottom-stat">
              <span>STUDY BOUNDARY</span>

              <strong>
                {formatArea(
                  metadata.boundary_vector_area_km2
                )}{" "}
                km²
              </strong>
            </div>

            <div className="bottom-stat">
              <span>CLASSIFIED PIXELS</span>

              <strong>
                {currentPixelCount?.toLocaleString(
                  "en-AU"
                )}
              </strong>
            </div>

            <div className="bottom-stat">
              <span>MAP PROJECTION</span>

              <strong>
                {metadata.raster_crs}
              </strong>
            </div>

            <div className="bottom-stat">
              <span>DATA YEAR</span>

              <strong>
                {year === 2010
                  ? "2010 · Provisional LULC"
                  : String(year)}
              </strong>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

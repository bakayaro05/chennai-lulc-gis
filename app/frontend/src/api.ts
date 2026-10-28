
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export interface LandClass {
  id: number;
  name: string;
  color: string;
}

export interface AccuracyRecord {
  year: number;
  original_five_class_oa_percent: number;
  reporting_four_class_oa_percent: number;
  status: string;
  source_raster_filename: string;
  warning: string | null;
}

export interface LocalRasterStatistics {
  class_pixel_counts: Record<string, number>;
  classified_pixels: number;
  background_zero_pixels: number;
  local_planar_area_km2: number;
}

export interface Metadata {
  study_area: string;
  years: number[];
  classes: LandClass[];
  raster_crs: string;
  raster_resolution_m: number;
  web_tiles_crs: string;
  raster_bounds_lonlat: [number, number, number, number];
  boundary_vector_area_km2: number;
  accuracy: AccuracyRecord[];
  provenance: string;
  area_methodology_warning: string;
  provisional_2010_warning: string;
  local_raster_statistics: Record<
    string,
    LocalRasterStatistics
  >;
}

export interface AreaCategory {
  class_id: number;
  name: string;
  color: string;
  area_km2: number;
}

export interface YearAreas {
  year: number;
  basis: string;
  unit: string;
  categories: AreaCategory[];
  total_km2: number;
  warning: string | null;
  area_methodology_warning: string;
}

export interface AllAreas {
  source: string;
  years: YearAreas[];
  note: string;
}

export interface PixelResult {
  year: number;
  latitude: number;
  longitude: number;
  class_id: number | null;
  class_name: string | null;
  status: string;
  warning: string | null;
}

export async function getApi<T>(
  path: string,
  signal?: AbortSignal
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    { signal }
  );

  if (!response.ok) {
    let detail = response.statusText;

    try {
      const body = await response.json();

      if (typeof body.detail === "string") {
        detail = body.detail;
      }
    } catch {
      // Preserve the original HTTP error if JSON is absent.
    }

    throw new Error(
      `API error ${response.status}: ${detail}`
    );
  }

  return (await response.json()) as T;
}

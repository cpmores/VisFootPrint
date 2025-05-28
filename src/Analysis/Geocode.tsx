import type { Place } from "./types";

interface NominatimResponse {
  error?: string;
  display_name?: string;
  address?: {
    state?: string;
    country?: string;
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    county?: string;
    [key: string]: string | undefined;
  };
}

const cache = new Map<string, Place>();

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 2000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status} ${response.statusText}`
        );
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`Retry ${i + 1}/${retries} after error:`, error);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries reached");
}

export async function getAddressByOSM(
  lng: number,
  lat: number,
  citycount: number
): Promise<Place> {
  const cacheKey = `${lat},${lng}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=zh`;

  try {
    const response = await fetchWithRetry(url, {
      headers: {
        "User-Agent": "MyGeoApp/1.0 (yourname@yourdomain.com)",
      },
    });

    const data: NominatimResponse = await response.json();

    if (data.error || !data.address) {
      console.error("OSM error:", data.error || "No address data");
      return { province: "", city: "", district: "", suburb: "", cityCount: 0 };
    }

    const address = data.address;
    const result: Place = {
      province: address.state || "",
      city: address.city || "",
      district: address.suburb || address.county || "",
      suburb: address.suburb || address.county || "",
      cityCount: citycount
    };

    if (data.display_name) {
      const parts = data.display_name.split(",").map((part) => part.trim());
      const cityIndex = parts.findIndex((part) => part.endsWith("市"));
      if (cityIndex !== -1) {
        result.city = parts[cityIndex];
        for (let i = cityIndex - 1; i >= 0; i--) {
          if (parts[i].endsWith("区")) {
            result.district = parts[i];
            break;
          }
        }
      }
      const provinceIndex = parts.findIndex(
        (part) => part.endsWith("省") || part.endsWith("自治区")
      );
      if (provinceIndex !== -1) {
        result.province = parts[provinceIndex];
      }
    }

    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("OSM request failed:", error);
    return { province: "", city: "", district: "", suburb: "", cityCount: 0 };
  }
}

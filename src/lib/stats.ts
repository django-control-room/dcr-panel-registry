import { useEffect, useState } from "react";

const STATS_URL = "https://stats.djangocontrolroom.com";

export interface DownloadStats {
  last30Days: number;
  previous30Days: number | null;
  allTime: number;
  asOf: string;
}

// One request per package per page load, shared by every component that asks.
const requests = new Map<string, Promise<DownloadStats | null>>();

async function fetchJsonOrNull(url: string) {
  try {
    const response = await fetch(url);
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

function fetchDownloadStatsForPackage(name: string) {
  if (!requests.has(name)) {
    const base = `${STATS_URL}/packages/${encodeURIComponent(name)}`;
    const request = Promise.all([
      fetchJsonOrNull(`${base}/last-30-days.json`),
      fetchJsonOrNull(`${base}/summary.json`),
    ]).then(([rolling, summary]) =>
      typeof rolling?.downloads === "number" && typeof summary?.recorded_downloads === "number"
        ? {
            last30Days: rolling.downloads,
            previous30Days: rolling.previous?.complete ? rolling.previous.downloads : null,
            allTime: summary.recorded_downloads,
            asOf: rolling.as_of,
          }
        : null,
    );
    requests.set(name, request);
  }
  return requests.get(name)!;
}

/** Download stats for a published package, or null while loading or if the package isn't tracked. */
export function useDownloadStats(name: string) {
  const [stats, setStats] = useState<DownloadStats | null>(null);
  useEffect(() => {
    let current = true;
    fetchDownloadStatsForPackage(name).then((result) => current && setStats(result));
    return () => {
      current = false;
    };
  }, [name]);
  return stats;
}

export function statsPageUrl(name: string) {
  return `${STATS_URL}/?packages=${encodeURIComponent(name)}`;
}

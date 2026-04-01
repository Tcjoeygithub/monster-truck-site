const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN || "";
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD || "";

function getAuthHeader(): string {
  const credentials = Buffer.from(
    `${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`
  ).toString("base64");
  return `Basic ${credentials}`;
}

async function apiRequest(endpoint: string, body: unknown) {
  const res = await fetch(`https://api.dataforseo.com${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DataForSEO error ${res.status}: ${text}`);
  }

  return res.json();
}

export interface KeywordResult {
  keyword: string;
  searchVolume: number;
  competition: number;
  competitionLevel: string;
  cpc: number;
  monthlySearches: { year: number; month: number; search_volume: number }[];
  trendingUp: boolean;
}

// Get search volume and keyword data for a list of keywords
export async function getKeywordData(
  keywords: string[]
): Promise<KeywordResult[]> {
  const data = await apiRequest(
    "/v3/keywords_data/google_ads/search_volume/live",
    [
      {
        keywords,
        language_code: "en",
        location_code: 2840, // United States
      },
    ]
  );

  const results: KeywordResult[] = [];

  for (const task of data.tasks || []) {
    for (const item of task.result || []) {
      const monthly = item.monthly_searches || [];
      const recent3 = monthly.slice(0, 3);
      const older3 = monthly.slice(3, 6);
      const recentAvg =
        recent3.length > 0
          ? recent3.reduce(
              (s: number, m: { search_volume: number }) =>
                s + (m.search_volume || 0),
              0
            ) / recent3.length
          : 0;
      const olderAvg =
        older3.length > 0
          ? older3.reduce(
              (s: number, m: { search_volume: number }) =>
                s + (m.search_volume || 0),
              0
            ) / older3.length
          : 0;

      results.push({
        keyword: item.keyword,
        searchVolume: item.search_volume || 0,
        competition: item.competition || 0,
        competitionLevel: item.competition_level || "UNKNOWN",
        cpc: item.cpc || 0,
        monthlySearches: monthly,
        trendingUp: recentAvg > olderAvg * 1.1,
      });
    }
  }

  return results.sort((a, b) => b.searchVolume - a.searchVolume);
}

// Get keyword suggestions (related keywords)
export async function getKeywordSuggestions(
  seedKeyword: string,
  limit: number = 50
): Promise<KeywordResult[]> {
  const data = await apiRequest(
    "/v3/keywords_data/google_ads/keywords_for_keywords/live",
    [
      {
        keywords: [seedKeyword],
        language_code: "en",
        location_code: 2840,
        include_seed_keyword: true,
        limit,
      },
    ]
  );

  const results: KeywordResult[] = [];

  for (const task of data.tasks || []) {
    for (const item of task.result || []) {
      const monthly = item.monthly_searches || [];
      const recent3 = monthly.slice(0, 3);
      const older3 = monthly.slice(3, 6);
      const recentAvg =
        recent3.length > 0
          ? recent3.reduce(
              (s: number, m: { search_volume: number }) =>
                s + (m.search_volume || 0),
              0
            ) / recent3.length
          : 0;
      const olderAvg =
        older3.length > 0
          ? older3.reduce(
              (s: number, m: { search_volume: number }) =>
                s + (m.search_volume || 0),
              0
            ) / older3.length
          : 0;

      results.push({
        keyword: item.keyword,
        searchVolume: item.search_volume || 0,
        competition: item.competition || 0,
        competitionLevel: item.competition_level || "UNKNOWN",
        cpc: item.cpc || 0,
        monthlySearches: monthly,
        trendingUp: recentAvg > olderAvg * 1.1,
      });
    }
  }

  return results.sort((a, b) => b.searchVolume - a.searchVolume);
}

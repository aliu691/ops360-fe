const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface KpiFilters {
  month?: string; // YYYY-MM
  week?: string; // calendar week (e.g. 32)
  quarter?: string; // YYYY-QN
}

/* ---------------------------------------
   API ENDPOINTS
----------------------------------------*/

export const API_ENDPOINTS = {
  uploadMeetings: (repName: string, month: string, week: number) =>
    `${BASE_URL}/upload/meetings?repName=${encodeURIComponent(
      repName
    )}&month=${encodeURIComponent(month)}&week=${week}`,

  getMeetings: (repName?: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();

    if (repName) params.append("repName", repName);
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    return `${BASE_URL}/meetings${
      params.toString() ? `?${params.toString()}` : ""
    }`;
  },

  getKpi: (
    repName: string,
    filters?: { month?: string; week?: string; quarter?: string }
  ) => {
    const params = new URLSearchParams();

    if (filters?.month) params.append("month", filters.month);
    if (filters?.week) params.append("week", filters.week);
    if (filters?.quarter) params.append("quarter", filters.quarter);

    const query = params.toString();
    return `${BASE_URL}/kpi/${encodeURIComponent(repName)}${
      query ? `?${query}` : ""
    }`;
  },

  getAvailableMonths: () => `${BASE_URL}/filters/months`,
  getAvailableWeeks: (month: string) =>
    `${BASE_URL}/filters/weeks?month=${encodeURIComponent(month)}`,

  getAvailableQuarters: () => `${BASE_URL}/filters/quarters`,
};

export default BASE_URL;

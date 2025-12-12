const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  uploadMeetings: (repName: string) =>
    `${BASE_URL}/upload/meetings?repName=${encodeURIComponent(repName)}`,

  getMeetings: (repName?: string, page?: number, limit?: number) => {
    let url = `${BASE_URL}/meetings`;

    const params = new URLSearchParams();
    if (repName) params.append("repName", repName);
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    return `${url}?${params.toString()}`;
  },

  getKpi: (repName: string) => `${BASE_URL}/kpi/${encodeURIComponent(repName)}`,
};

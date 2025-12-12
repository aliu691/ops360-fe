const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  uploadMeetings: (repName: string) =>
    `${BASE_URL}/upload/meetings?repName=${encodeURIComponent(repName)}`,
  getMeetings: (repName?: string) =>
    `${BASE_URL}/meetings${
      repName ? `?repName=${encodeURIComponent(repName)}` : ""
    }`,
  getKpi: (repName: string) => `${BASE_URL}/kpi/${encodeURIComponent(repName)}`,
};

export default BASE_URL;

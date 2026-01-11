const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface KpiFilters {
  month?: string; // YYYY-MM
  week?: string; // calendar week (e.g. 32)
  quarter?: string; // YYYY-QN
}

export const API_ENDPOINTS = {
  /* =========================
   * AUTH
   * ========================= */
  login: () => `/auth/login`,
  requestPasswordReset: () => `/auth/request-password-reset`,
  resetPassword: () => `/auth/reset-password`,

  /* =========================
   * ADMINS
   * ========================= */
  inviteAdmin: () => `/admins/invite`,
  acceptInvite: () => `/admins/accept-invite`,
  getAdmins: () => `/admins`,
  getAdminByEmail: (email: string) => `/admins/${email}`,

  /* =========================
   * MEETINGS
   * ========================= */
  uploadMeetings: (repName: string, month: string, week: number) =>
    `/upload/meetings?repName=${encodeURIComponent(
      repName
    )}&month=${encodeURIComponent(month)}&week=${week}`,

  getMeetings: (
    repName?: string,
    page?: number,
    limit?: number,
    filters?: {
      month?: string;
      week?: number;
    }
  ) => {
    const params = new URLSearchParams();

    if (repName) params.append("repName", repName);
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    if (filters?.month) params.append("month", filters.month);
    if (filters?.week !== undefined)
      params.append("week", String(filters.week));

    return `/meetings?${params.toString()}`;
  },

  /* =========================
   * KPI
   * ========================= */
  getKpi: (
    repName: string,
    filters?: {
      month?: string;
      week?: string;
      quarter?: string;
    }
  ) => {
    const params = new URLSearchParams();

    if (filters?.month) params.append("month", filters.month);
    if (filters?.week) params.append("week", filters.week);
    if (filters?.quarter) params.append("quarter", filters.quarter);

    const query = params.toString();
    return `/kpi/${encodeURIComponent(repName)}${query ? `?${query}` : ""}`;
  },

  /* =========================
   * FILTERS
   * ========================= */
  getAvailableMonths: () => `/filters/months`,
  getAvailableWeeks: (month: string) =>
    `/filters/weeks?month=${encodeURIComponent(month)}`,
  getAvailableQuarters: () => `/filters/quarters`,

  /* =========================
   * CALENDAR
   * ========================= */
  getCalendarMonths: () => `/calendar/months`,
  getCalendarWeeks: (month: string, userId: number) =>
    `/calendar/weeks?month=${encodeURIComponent(month)}&userId=${userId}`,

  /* =========================
   * USERS (STAFF)
   * ========================= */
  getUsers: () => `/users`,
  getUserById: (id: number | string) => `/users/${id}`,
  createUser: () => `/users`,
  updateUser: (id: number | string) => `/users/${id}`,
  deactivateUser: (id: number | string) => `/users/${id}`,
};

export default BASE_URL;

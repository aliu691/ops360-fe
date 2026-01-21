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
  getDepartments: () => `/departments`,

  /* =========================
   * PIPELINE (DEALS)
   * ========================= */

  getPipelineDeals: (params?: {
    page?: number;
    limit?: number;
    year?: number;
    quarter?: number;
    stageId?: number;
    stageKey?: string;
    salesOwnerId?: number;
    preSalesOwnerIds?: number[];
  }) => {
    const query = new URLSearchParams();

    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.year) query.append("year", String(params.year));
    if (params?.quarter) query.append("quarter", String(params.quarter));
    if (params?.stageId) query.append("stageId", String(params.stageId));
    if (params?.stageKey) query.append("stageKey", params.stageKey);
    if (params?.salesOwnerId)
      query.append("salesOwnerId", String(params.salesOwnerId));
    if (params?.preSalesOwnerIds?.length) {
      query.append("preSalesOwnerIds", params.preSalesOwnerIds.join(","));
    }

    const qs = query.toString();
    return `/pipeline${qs ? `?${qs}` : ""}`;
  },

  getPipelineDealByExternalId: (externalDealId: string) =>
    `/pipeline/deal/${externalDealId}`,

  createPipelineDeal: () => `/pipeline`,

  updatePipelineDeal: (externalDealId: string) => `/pipeline/${externalDealId}`,
  getDealStages: () => `/deal-stages`,
};

export default BASE_URL;

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export const API_ENDPOINTS = {
    uploadMeetings: (repName, month, week) => `${BASE_URL}/upload/meetings?repName=${encodeURIComponent(repName)}&month=${encodeURIComponent(month)}&week=${week}`,
    getMeetings: (repName, page, limit, filters) => {
        const params = new URLSearchParams();
        if (repName)
            params.append("repName", repName);
        if (page)
            params.append("page", String(page));
        if (limit)
            params.append("limit", String(limit));
        // ✅ NEW: optional filters
        if (filters?.month)
            params.append("month", filters.month);
        if (filters?.week !== undefined)
            params.append("week", String(filters.week));
        return `${BASE_URL}/meetings?${params.toString()}`;
    },
    getKpi: (repName, filters) => {
        const params = new URLSearchParams();
        if (filters?.month)
            params.append("month", filters.month);
        if (filters?.week)
            params.append("week", filters.week);
        if (filters?.quarter)
            params.append("quarter", filters.quarter);
        const query = params.toString();
        return `${BASE_URL}/kpi/${encodeURIComponent(repName)}${query ? `?${query}` : ""}`;
    },
    getAvailableMonths: () => `${BASE_URL}/filters/months`,
    getAvailableWeeks: (month) => `${BASE_URL}/filters/weeks?month=${encodeURIComponent(month)}`,
    getAvailableQuarters: () => `${BASE_URL}/filters/quarters`,
    getCalendarMonths: () => `${BASE_URL}/calendar/months`,
    getCalendarWeeks: (month) => `${BASE_URL}/calendar/weeks?month=${encodeURIComponent(month)}`,
    getUsers: () => `${BASE_URL}/users`,
    getUserById: (id) => `${BASE_URL}/users/${id}`,
    createUser: `/users`,
    updateUser: (id) => `${BASE_URL}/users/${id}`,
    deactivateUser: (id) => `${BASE_URL}/users/${id}`,
};
export default BASE_URL;

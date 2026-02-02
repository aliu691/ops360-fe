import { useEffect, useState } from "react";
import { Select } from "../components/select";
import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "../config/apiClient";
import { useNavigate, useLocation } from "react-router-dom";
import { Opportunity } from "../types/pipeline";
import { StagePill } from "../components/pipeline/StagePill";
import { UploadPipelineModal } from "../components/pipeline/UploadPiepelineForm";
import Pagination from "../components/Pagination";
import { useAuth } from "../hooks/useAuth";

export default function OpportunitiesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isUser } = useAuth();

  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<any[]>([]);
  const [dealStages, setDealStages] = useState<any[]>([]);

  /* =========================
   * FILTER VISIBILITY
   * ========================= */
  const [showFilters, setShowFilters] = useState(false);

  /* =========================
   * DRAFT FILTERS (UI ONLY)
   * ========================= */
  const [draftQuarter, setDraftQuarter] = useState<string | undefined>();
  const [draftSalesRepId, setDraftSalesRepId] = useState<string | undefined>();
  const [draftPreSalesRepId, setDraftPreSalesRepId] = useState<
    string | undefined
  >();
  const [draftStageId, setDraftStageId] = useState<string | undefined>();

  const currentYear = String(new Date().getFullYear());

  const [draftYear, setDraftYear] = useState(currentYear);

  const [refreshKey, setRefreshKey] = useState(0);

  /* =========================
   * APPLIED FILTERS (API)
   * ========================= */
  const [appliedFilters, setAppliedFilters] = useState({
    year: currentYear,
    quarter: undefined as string | undefined,
    salesRepId: undefined as string | undefined,
    preSalesRepId: undefined as string | undefined,
    stageId: undefined as string | undefined,
  });

  /* =========================
   * PAGINATION
   * ========================= */
  const [page, setPage] = useState(1);
  const limit = 15;
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  /* =========================
   * LOAD USERS
   * ========================= */
  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.getUsers())
      .then((res) => setUsers(res.data?.items ?? []))
      .catch(() => setUsers([]));
  }, []);

  const salesReps = users.filter((u) => u.department === "SALES");
  const preSalesReps = users.filter((u) => u.department === "PRE_SALES");

  /* =========================
   * LOAD DEAL STAGES
   * ========================= */
  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.getDealStages())
      .then((res) => setDealStages(res.data?.items ?? []))
      .catch(() => setDealStages([]));
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      setRefreshKey((k) => k + 1);
    }
  }, [location.state?.refresh]);

  /* =========================
   * LOAD OPPORTUNITIES
   * ========================= */
  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        API_ENDPOINTS.getPipelineDeals({
          page,
          limit,
          year: Number(appliedFilters.year),
          quarter: appliedFilters.quarter
            ? Number(appliedFilters.quarter)
            : undefined,

          salesOwnerId:
            isAdmin && appliedFilters.salesRepId
              ? Number(appliedFilters.salesRepId)
              : undefined,

          preSalesOwnerIds: appliedFilters.preSalesRepId
            ? [Number(appliedFilters.preSalesRepId)]
            : undefined,

          stageId: appliedFilters.stageId
            ? Number(appliedFilters.stageId)
            : undefined,
        })
      );

      setItems(res.data.items ?? []);
      setTotalPages(res.data.totalPages ?? 1);
      setTotal(res.data?.total ?? 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [appliedFilters, page, refreshKey]);

  const yearOptions = Array.from(new Set([currentYear, "2025"])).sort(
    (a, b) => Number(b) - Number(a)
  );

  /* =========================
   * APPLY / RESET FILTERS
   * ========================= */
  const applyFilters = () => {
    setAppliedFilters({
      year: draftYear,
      quarter: draftQuarter,
      salesRepId: draftSalesRepId,
      preSalesRepId: draftPreSalesRepId,
      stageId: draftStageId,
    });

    setPage(1);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setDraftYear(currentYear);
    setDraftQuarter(undefined);
    setDraftPreSalesRepId(undefined);
    setDraftStageId(undefined);

    if (isAdmin) {
      setDraftSalesRepId(undefined);
    }

    setAppliedFilters({
      year: currentYear,
      quarter: undefined,
      salesRepId: undefined,
      preSalesRepId: undefined,
      stageId: undefined,
    });

    setPage(1);
    setShowFilters(false);
  };

  /* =========================
   * RESET PAGE FROM NAV
   * ========================= */
  useEffect(() => {
    if (location.state?.resetPage) {
      setPage(1);
    }
  }, [location.state?.resetPage]);

  const [showUpload, setShowUpload] = useState(false);

  /* =========================
   * UI
   * ========================= */
  return (
    <div className="space-y-6 pb-20 px-6 md:px-10 lg:px-14">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Opportunities</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage all sales opportunities
          </p>
        </div>

        <div className="flex gap-3">
          {/* ✅ USERS ONLY */}
          {isUser && (
            <button
              onClick={() => navigate("/opportunities/new")}
              className="px-4 py-2 border rounded-xl bg-white text-sm hover:bg-gray-50"
            >
              Add Opportunity
            </button>
          )}

          {/* ✅ USERS ONLY */}
          {isUser && (
            <button
              onClick={() => setShowUpload(true)}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              ＋ Upload Pipeline
            </button>
          )}

          {showUpload && (
            <UploadPipelineModal
              onClose={() => setShowUpload(false)}
              onSuccess={() => {
                setRefreshKey((k) => k + 1);
                setShowUpload(false);
              }}
            />
          )}

          <button
            onClick={() => setShowFilters((v) => !v)}
            className="px-4 py-2 border rounded-xl bg-white text-sm hover:bg-gray-50"
          >
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 border rounded-xl bg-gray-50">
          {/* <Select
            value={draftYear}
            onChange={(v) => v && setDraftYear(v)}
            options={["2025"]}
            placeholder="Year"
          /> */}

          <Select
            value={draftYear}
            onChange={(v) => v && setDraftYear(v)}
            options={yearOptions}
            placeholder="Year"
          />

          <Select
            value={draftQuarter}
            onChange={setDraftQuarter}
            options={["1", "2", "3", "4"]}
            placeholder="All Quarters"
            format={(q) => `Q${q}`}
          />

          {isAdmin && (
            <Select
              value={draftSalesRepId}
              onChange={setDraftSalesRepId}
              options={salesReps.map((u) => String(u.id))}
              placeholder="All Sales Reps"
              format={(id) => {
                const u = salesReps.find((x) => String(x.id) === id);
                return u ? `${u.firstName} ${u.lastName}` : id;
              }}
            />
          )}

          <Select
            value={draftPreSalesRepId}
            onChange={setDraftPreSalesRepId}
            options={preSalesReps.map((u) => String(u.id))}
            placeholder="All Presales Reps"
            format={(id) => {
              const u = preSalesReps.find((x) => String(x.id) === id);
              return u ? `${u.firstName} ${u.lastName}` : id;
            }}
          />

          <Select
            value={draftStageId}
            onChange={setDraftStageId}
            options={dealStages.map((s) => String(s.id))}
            placeholder="All Deal Stages"
            format={(id) => {
              const s = dealStages.find((x) => String(x.id) === id);
              return s ? s.name : id;
            }}
          />

          <div className="flex gap-2 ml-auto">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border rounded-lg bg-white text-sm hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Organization</th>
              <th className="px-4 py-3 text-left">Opportunity</th>
              <th className="px-4 py-3 text-left">Stage</th>
              <th className="px-4 py-3 text-right">Amount (NGN)</th>
              <th className="px-4 py-3 text-left">Expected Close</th>
              <th className="px-4 py-3 text-center">Owner</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  Loading opportunities…
                </td>
              </tr>
            )}

            {!loading &&
              items.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() =>
                    navigate(`/opportunities/${deal.externalDealId}`)
                  }
                  className="border-t hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-4 font-medium text-blue-600">
                    {deal.organizationName}
                  </td>
                  <td className="px-4 py-4">{deal.dealName}</td>
                  <td className="px-4 py-4">
                    <StagePill
                      probability={deal.displayStage?.probability}
                      label={deal.displayStage?.name}
                    />
                  </td>
                  <td className="px-4 py-4 text-right font-semibold">
                    ₦{Number(deal.displayValue).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    {new Date(deal.expectedCloseDate).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {deal.salesOwner?.firstName ?? "—"}
                  </td>
                </tr>
              ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  No opportunities found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        label="deals"
      />
    </div>
  );
}

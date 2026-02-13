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
import { MultiSelect } from "../MultiSelect";
import PipelineFilter from "../components/pipeline/PipelineFilter";

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

  const currentYear = String(new Date().getFullYear());

  const [refreshKey, setRefreshKey] = useState(0);

  /* =========================
   * APPLIED FILTERS (API)
   * ========================= */
  type OpportunityFilters = {
    year: string;
    quarter?: string;
    salesRepId?: string;
    preSalesRepIds: string[];
    stageId?: string;
  };

  const [appliedFilters, setAppliedFilters] = useState<OpportunityFilters>({
    year: currentYear,
    preSalesRepIds: [],
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

          preSalesOwnerIds: appliedFilters.preSalesRepIds.length
            ? appliedFilters.preSalesRepIds.map(Number)
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

      {showFilters && (
        <PipelineFilter
          isAdmin={isAdmin}
          users={users}
          dealStages={dealStages}
          value={appliedFilters}
          onApply={(filters) => {
            setAppliedFilters(filters);
            setPage(1); // reset pagination on filter apply
          }}
          onClose={() => setShowFilters(false)}
        />
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

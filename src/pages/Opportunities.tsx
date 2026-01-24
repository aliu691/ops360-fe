import { useEffect, useState } from "react";
import { Select } from "../components/select";
import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "../config/apiClient";
import { useNavigate } from "react-router-dom";
import { Opportunity } from "../types/pipeline";
import { StagePill } from "../components/pipeline/StagePill";
import { UploadPipelineModal } from "../components/pipeline/UploadPiepelineForm";
import { useLocation } from "react-router-dom";
import Pagination from "../components/Pagination";

export default function OpportunitiesPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<any[]>([]);

  const [year, setYear] = useState<string>("2025");
  const [quarter, setQuarter] = useState<string | undefined>();
  const [salesRepId, setSalesRepId] = useState<string | undefined>();
  const [preSalesRepId, setPreSalesRepId] = useState<string | undefined>();

  const [dealStages, setDealStages] = useState<any[]>([]);
  const [stageId, setStageId] = useState<string | undefined>();

  const [page, setPage] = useState(1);
  const limit = 15;
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  /* =========================
   * LOAD USERS (FILTERS)
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
   * LOAD OPPORTUNITIES
   * ========================= */
  const loadOpportunities = async () => {
    setLoading(true);

    try {
      const res = await apiClient.get(
        API_ENDPOINTS.getPipelineDeals({
          page,
          limit,
          year: Number(year),
          quarter: quarter ? Number(quarter) : undefined,
          salesOwnerId: salesRepId ? Number(salesRepId) : undefined,
          preSalesOwnerIds: preSalesRepId ? [Number(preSalesRepId)] : undefined,
          stageId: stageId ? Number(stageId) : undefined,
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
    const loadDealStages = async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.getDealStages());
        setDealStages(res.data?.items ?? []);
      } catch (err) {
        console.error("Failed to load deal stages", err);
        setDealStages([]);
      }
    };

    loadDealStages();
  }, []);

  useEffect(() => {
    loadOpportunities();
  }, [year, quarter, salesRepId, preSalesRepId, page, stageId]);

  /* =========================
   * HELPERS
   * ========================= */
  const resetFilters = () => {
    setYear("2025"); // default year
    setQuarter(undefined);
    setSalesRepId(undefined);
    setPreSalesRepId(undefined);
    setStageId(undefined);
  };

  const [showUpload, setShowUpload] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.resetPage) {
      setPage(1);
    }
  }, [location.state?.resetPage]);

  /* =========================
   * UI
   * ========================= */
  return (
    <div className="space-y-6 pb-20 px-6 md:px-10 lg:px-14">
      {/* HEADER + ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Opportunities</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage all sales opportunities
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/opportunities/new")}
            className="flex items-center gap-2 px-4 py-2 border rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Add Opportunity
          </button>

          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            <span className="text-lg">＋</span>
            Upload Pipeline
          </button>

          {showUpload && (
            <UploadPipelineModal onClose={() => setShowUpload(false)} />
          )}
        </div>
      </div>

      {/* FILTERS (NOW ABOVE TABLE) */}
      <div className="flex flex-wrap gap-3 items-center justify-end">
        <Select
          value={year}
          onChange={(v) => v && setYear(v)}
          options={[year]}
        />

        <Select
          value={quarter}
          onChange={setQuarter}
          options={["1", "2", "3", "4"]}
          placeholder="All Quarters"
          format={(q) => `Q${q}`}
        />

        <Select
          value={salesRepId}
          onChange={setSalesRepId}
          options={salesReps.map((u) => String(u.id))}
          placeholder="All Sales Reps"
          format={(id) => {
            const u = salesReps.find((x) => String(x.id) === id);
            return u ? `${u.firstName} ${u.lastName}` : id;
          }}
        />

        <Select
          value={preSalesRepId}
          onChange={setPreSalesRepId}
          options={preSalesReps.map((u) => String(u.id))}
          placeholder="All Presales Reps"
          format={(id) => {
            const u = preSalesReps.find((x) => String(x.id) === id);
            return u ? `${u.firstName} ${u.lastName}` : id;
          }}
        />

        <Select
          value={stageId}
          onChange={setStageId}
          options={dealStages.map((s) => String(s.id))}
          placeholder="All Deal Stages"
          format={(id) => {
            const stage = dealStages.find((s) => String(s.id) === id);
            return stage ? stage.name : id;
          }}
        />

        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 text-gray-700"
        >
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="py-3 px-4 text-left">Organization Name</th>
              <th className="py-3 px-4 text-left">Opportunity</th>
              <th className="py-3 px-4 text-left">Deal Stage</th>
              {/* <th className="py-3 px-4 text-left">Probability</th> */}
              <th className="py-3 px-4 text-right">Amount (NGN)</th>
              <th className="py-3 px-4 text-left">Expected Close Date</th>
              <th className="py-3 px-4 text-center">Deal Owner</th>
            </tr>
          </thead>

          <tbody>
            {/* LOADING */}
            {loading && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-500">
                  Loading opportunities…
                </td>
              </tr>
            )}

            {/* DATA */}
            {!loading &&
              items.map((deal) => (
                <tr
                  key={deal.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    navigate(`/opportunities/${deal.externalDealId}`)
                  }
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

                  {/* <td className="px-4 py-4 text-gray-600">
                    {deal.displayStage?.probability
                      ? `${deal.displayStage.probability}%`
                      : "—"}
                  </td> */}

                  <td className="px-4 py-4 text-right font-semibold">
                    ₦{Number(deal.displayValue).toLocaleString()}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {new Date(deal.expectedCloseDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {deal.salesOwner?.firstName ?? "—"}
                  </td>
                </tr>
              ))}

            {/* EMPTY */}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-500">
                  No opportunities found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* ================= PAGINATION ================= */}
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

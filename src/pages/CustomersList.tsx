import { useEffect, useState } from "react";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { Plus, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Customer } from "../types/customer-responses";
import Pagination from "../components/Pagination";
import { formatMoney } from "../utils/numbersFormatters";

export default function CustomersList() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 15;
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await apiClient.get(
        API_ENDPOINTS.getCustomers({ page, limit })
      );

      setCustomers(res.data?.customers ?? []);
      setTotalPages(res.data?.totalPages ?? 1);
      setTotal(res.data?.total ?? 0);
    } catch (err) {
      console.error("Failed to load customers", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  return (
    <div className="p-8 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All Customers</h1>
          <p className="text-gray-500 text-sm">
            Manage your relationships and track customer data.
          </p>
        </div>

        <button
          onClick={() => navigate("/customers/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Loading customers…</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="text-left px-6 py-4">Customer Name</th>
                <th className="text-left px-6 py-4">Total Deals</th>
                <th className="text-left px-6 py-4">Total Deal Size</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => {
                const primaryContact = customer.contacts?.[0];

                return (
                  <tr
                    onClick={() => navigate(`/customers/${customer.id}`)}
                    key={customer.id}
                    className="border-t hover:bg-gray-50"
                  >
                    {/* Customer */}
                    <td className="px-6 py-4 font-semibold">{customer.name}</td>

                    {/* Deals (placeholder for now) */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {customer.dealCount}
                    </td>

                    {/* Primary Contact */}
                    <td className="px-6 py-4 text-sm">
                      {formatMoney(customer.totalDealSize)}
                    </td>
                  </tr>
                );
              })}

              {customers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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

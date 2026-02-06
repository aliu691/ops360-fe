import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

/* Public pages */
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import ForgotPassword from "./pages/ForgotPassword";

/* Core app pages */
import KpiDashboard from "./pages/Dashboard";
import Meetings from "./pages/Meetings";
import UsersList from "./pages/UsersList";
import UserDetails from "./pages/UsersDetails";
import AdminsList from "./pages/AdminsList";

import SalesPipelinePage from "./pages/SalesPipelinePage";
import OpportunitiesPage from "./pages/Opportunities";
import OpportunityDetailsPage from "./pages/OpportunityDetailsPage";
import CreateOpportunityPage from "./pages/CreateOpportunityPage";

import CustomersList from "./pages/CustomersList";
import CustomerDetails from "./pages/CustomerDetailsPage";
import CreateCustomerPage from "./pages/CreateCustomerPage";

import AuditLogs from "./pages/AuditLogs";
import AuditLogDetails from "./pages/AuditLogDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================= AUTHENTICATED USERS ================= */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/kpi" replace />} />

            <Route path="/kpi" element={<KpiDashboard />} />
            <Route path="/meetings" element={<Meetings />} />

            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<UserDetails />} />

            <Route path="/pipeline" element={<SalesPipelinePage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route
              path="/opportunities/new"
              element={<CreateOpportunityPage />}
            />
            <Route
              path="/opportunities/:id"
              element={<OpportunityDetailsPage />}
            />

            <Route path="/customers" element={<CustomersList />} />
            <Route path="/customers/new" element={<CreateCustomerPage />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
          </Route>
        </Route>

        {/* ================= SUPER ADMIN ONLY ================= */}
        <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
          <Route element={<Layout />}>
            <Route path="/admins" element={<AdminsList />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/audit-logs/:id" element={<AuditLogDetails />} />
          </Route>
        </Route>
      </Routes>

      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;

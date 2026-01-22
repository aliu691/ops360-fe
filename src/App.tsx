import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Meetings from "./pages/Meetings";
import KpiDashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import UsersList from "./pages/UsersList";
import UserDetails from "./pages/UsersDetails";
import Login from "./pages/Login";
import AdminsList from "./pages/AdminsList";
import SetPassword from "./pages/SetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import SalesPipelinePage from "./pages/SalesPipelinePage";
import OpportunitiesPage from "./pages/Opportunities";
import OpportunityDetailsPage from "./pages/OpportunityDetailsPage";
import CreateOpportunityPage from "./pages/CreateOpportunityPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* -------- Public routes -------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* -------- Protected routes -------- */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/kpi" replace />} />
          <Route path="/kpi" element={<KpiDashboard />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/pipeline" element={<SalesPipelinePage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route
            path="/opportunities/:id"
            element={<OpportunityDetailsPage />}
          />
          <Route
            path="/opportunities/new"
            element={<CreateOpportunityPage />}
          />

          {/* SUPER ADMIN */}
          <Route path="/admins" element={<AdminsList />} />
        </Route>
      </Routes>

      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;

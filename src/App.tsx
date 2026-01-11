import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Meetings from "./pages/Meetings";
import KpiDashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import UsersList from "./pages/UsersList";
import UserDetails from "./pages/UsersDetails";
import Login from "./pages/Login";
import AuthGuard from "./components/AuthGuard";
import AdminsList from "./pages/AdminsList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* -------- Public routes -------- */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/accept-invite" element={<AcceptInvite />} /> */}

        {/* -------- Protected routes -------- */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/kpi" replace />} />
          <Route path="/kpi" element={<KpiDashboard />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/users" element={<UsersList />} />

          {/* SUPER ADMIN */}
          <Route path="/admins" element={<AdminsList />} />
        </Route>
      </Routes>

      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;

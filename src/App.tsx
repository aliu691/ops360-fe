import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Meetings from "./pages/Meetings";
import KpiDashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import UsersList from "./pages/UsersList";
import UserDetails from "./pages/UsersDetails";
import Login from "./pages/Login";
import AuthGuard from "./components/AuthGuard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}

        {/* ---------- PROTECTED ROUTES ---------- */}
        <Route element={<AuthGuard />}>
          <Route element={<Layout />}>
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/kpi" element={<KpiDashboard />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<UserDetails />} />
          </Route>
        </Route>

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;

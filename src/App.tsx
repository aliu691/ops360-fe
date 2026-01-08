import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Meetings from "./pages/Meetings";
import KpiDashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import UsersList from "./pages/UsersList";
import UserDetails from "./pages/UsersDetails";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/kpi" replace />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/kpi" element={<KpiDashboard />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </Layout>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;

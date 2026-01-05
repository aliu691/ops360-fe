import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Meetings from "./pages/Meetings";
import KpiDashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import UsersList from "./pages/UsersList";
import UserDetails from "./pages/UsersDetails";
function App() {
    return (_jsxs(BrowserRouter, { children: [_jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/kpi", replace: true }) }), _jsx(Route, { path: "/meetings", element: _jsx(Meetings, {}) }), _jsx(Route, { path: "/kpi", element: _jsx(KpiDashboard, {}) }), _jsx(Route, { path: "/users", element: _jsx(UsersList, {}) }), _jsx(Route, { path: "/users/:id", element: _jsx(UserDetails, {}) })] }) }), _jsx(Toaster, { position: "top-center" })] }));
}
export default App;

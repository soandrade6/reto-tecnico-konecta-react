import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Sales from "./pages/Sales";
import SalesStats  from "./components/SalesStats";
import ProtectedRoute from "./components/ProtectedRoute";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="sales" replace />} />
        <Route path="sales" element={<Sales />} />
        <Route path="users" element={<Users />} />
        <Route path="stats" element={<SalesStats  />} />

      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;

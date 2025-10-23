import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Sales from "./pages/Sales";
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
        <Route path="users" element={<Users />} />
        <Route path="sales" element={<Sales />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;

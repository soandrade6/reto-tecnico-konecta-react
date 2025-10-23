import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  // Si no hay usuario autenticado, redirige al login
  if (!user) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;


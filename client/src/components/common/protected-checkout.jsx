import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedCheckout({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the current path so user can return after login
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedCheckout;
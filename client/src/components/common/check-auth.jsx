import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  console.log(location.pathname, isAuthenticated);

  // For auth pages (login/register), redirect if already authenticated
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // For protected routes, check authentication
  if (!isAuthenticated) {
    if (location.pathname.includes("/login") || location.pathname.includes("/register")) {
      return <>{children}</>;
    }
    return <Navigate to="/auth/login" />;
  }

  // Check admin access
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Redirect admin users away from shop routes to admin dashboard
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    (location.pathname.includes("/shop/checkout") ||
     location.pathname.includes("/shop/account") ||
     location.pathname.includes("/shop/paypal") ||
     location.pathname.includes("/shop/payment"))
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;

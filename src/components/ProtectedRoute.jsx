import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/ui/spinner";

const ProtectedRoute = ({ children, requireProfileComplete = true }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to signin with the current location as redirectUri
    const redirectUri = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/signin?redirectUri=${redirectUri}`} replace />;
  }

  console.log("ProtectedRoute - User:", user, "Profile Completed:", user?.profileCompleted, "Require Profile Complete:", requireProfileComplete, "Current Path:", location.pathname);

  // Check if profile is completed (skip for profile-setup page itself)
  if (
    requireProfileComplete &&
    user &&
    !user.profileCompleted &&
    location.pathname !== "/profile-setup"
  ) {
    return <Navigate to="/profile-setup" replace />;
  } else if (
    !requireProfileComplete &&
    user &&
    user.profileCompleted &&
    location.pathname === "/profile-setup"
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

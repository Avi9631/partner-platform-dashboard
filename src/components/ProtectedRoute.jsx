import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/ui/spinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
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

  return children;
};

export default ProtectedRoute;

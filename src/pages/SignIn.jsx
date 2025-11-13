import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const SignIn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const redirectUri = searchParams.get("redirectUri") || "/";
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch(`${backendUrl}/auth/status`, {
          credentials: "include",
        });
        if (response.ok) {
          // User is already authenticated, redirect to the intended page
          navigate(redirectUri, { replace: true });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();
  }, [backendUrl, navigate, redirectUri]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    const encodedRedirect = encodeURIComponent(
      `${window.location.origin}${redirectUri}`
    );
    window.location.href = `${backendUrl}/auth/google?redirectUri=${encodedRedirect}`;
  };

  const handleMicrosoftLogin = () => {
    setIsLoading(true);
    const encodedRedirect = encodeURIComponent(
      `${window.location.origin}${redirectUri}`
    );
    window.location.href = `${backendUrl}/auth/microsoft?redirectUri=${encodedRedirect}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-base">
            Sign in to access Partner Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12 text-base font-medium hover:bg-gray-50"
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading ? "Redirecting..." : "Continue with Google"}
          </Button>

          <Button
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12 text-base font-medium hover:bg-gray-50"
          >
            <svg
              className="mr-3 h-5 w-5"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="#f25022" d="M1 1h10v10H1z" />
              <path fill="#00a4ef" d="M12 1h10v10H12z" />
              <path fill="#7fba00" d="M1 12h10v10H1z" />
              <path fill="#ffb900" d="M12 12h10v10H12z" />
            </svg>
            {isLoading ? "Redirecting..." : "Continue with Microsoft"}
          </Button>

          <div className="pt-4 text-center text-sm text-gray-500">
            <p>Secure OAuth 2.0 authentication</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;

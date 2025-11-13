import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Building2, Shield, Sparkles, ArrowRight } from "lucide-react";

const SignIn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);
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
    setLoadingProvider("google");
    const encodedRedirect = encodeURIComponent(
      `${window.location.origin}${redirectUri}`
    );
    window.location.href = `${backendUrl}/auth/google?redirectUri=${encodedRedirect}`;
  };

  const handleMicrosoftLogin = () => {
    setIsLoading(true);
    setLoadingProvider("microsoft");
    const encodedRedirect = encodeURIComponent(
      `${window.location.origin}${redirectUri}`
    );
    window.location.href = `${backendUrl}/auth/microsoft?redirectUri=${encodedRedirect}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-orange-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-8 px-8"
        >
          {/* Logo & Brand */}
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold">
                  <span className="text-orange-600">PARTNER</span>{" "}
                  <span className="text-gray-900">PLATFORM</span>
                </h1>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-extrabold text-gray-900 leading-tight"
            >
              Manage Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
                Property Portfolio
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-700 leading-relaxed"
            >
              The all-in-one platform for property partners to list, manage, and grow their real estate business with ease.
            </motion.p>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            {[
              { icon: Building2, text: "List unlimited properties" },
              { icon: Shield, text: "Secure & trusted platform" },
              { icon: Sparkles, text: "Advanced analytics & insights" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-4 bg-white/60 backdrop-blur-sm px-5 py-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-800 font-semibold text-base">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Sign In Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <Card className="w-full max-w-md shadow-2xl border-2 border-orange-200/50 bg-white/95 backdrop-blur-sm overflow-hidden">
            {/* Decorative Top Bar */}
            <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500" />

            <CardHeader className="space-y-4 pt-8 pb-6 text-center">
              {/* Mobile Logo */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="lg:hidden flex items-center justify-center gap-2 mb-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-extrabold">
                  <span className="text-orange-600">PARTNER</span>{" "}
                  <span className="text-gray-900">PLATFORM</span>
                </h1>
              </motion.div>

              <div className="space-y-2">
                <CardTitle className="text-4xl font-extrabold text-gray-900 tracking-tight">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Sign in to access your partner dashboard
                </CardDescription>
              </div>

              {/* Decorative Element */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="h-1 w-12 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full" />
                <Sparkles className="w-4 h-4 text-orange-500" />
                <div className="h-1 w-12 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4 px-8 pb-8">
              {/* Google Sign In */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full h-14 text-base font-bold border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-xl group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 group-hover:via-orange-500/10 transition-all duration-300" />
                  <svg className="mr-3 h-6 w-6 relative z-10" viewBox="0 0 24 24">
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
                  <span className="relative z-10">
                    {isLoading && loadingProvider === "google"
                      ? "Redirecting..."
                      : "Continue with Google"}
                  </span>
                  <ArrowRight className="ml-2 w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300 relative z-10" />
                </Button>
              </motion.div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    OR
                  </span>
                </div>
              </div>

              {/* Microsoft Sign In */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleMicrosoftLogin}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full h-14 text-base font-bold border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-xl group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 group-hover:via-orange-500/10 transition-all duration-300" />
                  <svg
                    className="mr-3 h-6 w-6 relative z-10"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="#f25022" d="M1 1h10v10H1z" />
                    <path fill="#00a4ef" d="M12 1h10v10H12z" />
                    <path fill="#7fba00" d="M1 12h10v10H1z" />
                    <path fill="#ffb900" d="M12 12h10v10H12z" />
                  </svg>
                  <span className="relative z-10">
                    {isLoading && loadingProvider === "microsoft"
                      ? "Redirecting..."
                      : "Continue with Microsoft"}
                  </span>
                  <ArrowRight className="ml-2 w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300 relative z-10" />
                </Button>
              </motion.div>

              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="pt-6 flex items-center justify-center gap-2 text-sm text-gray-600"
              >
                <Shield className="w-4 h-4 text-orange-500" />
                <span className="font-medium">Secure OAuth 2.0 Authentication</span>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-600"
      >
        <p>
          By signing in, you agree to our{" "}
          <span className="text-orange-600 font-semibold hover:underline cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-orange-600 font-semibold hover:underline cursor-pointer">
            Privacy Policy
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default SignIn;

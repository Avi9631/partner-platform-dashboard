import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Building2, Shield, Sparkles, ArrowRight, 
  BarChart3, Users, TrendingUp, CheckCircle2,
  Zap, Globe, Lock, HeadphonesIcon, 
  Layers, Target, DollarSign, Clock,
  ChevronRight, Star, Play
} from "lucide-react";

const SignIn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const redirectUri = searchParams.get("redirectUri") || "/";
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);

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

  const features = [
    {
      icon: DollarSign,
      title: "Credit-Based System",
      description: "Simple pay-per-listing model with flexible credit packages and instant recharge",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      icon: Sparkles,
      title: "AI Listing Enrichment",
      description: "Auto-enhance your listings with AI-powered descriptions, tags, and optimizations",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: BarChart3,
      title: "AI Analytics Dashboard",
      description: "Smart insights and predictions powered by advanced AI algorithms",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Intelligent Lead Scoring",
      description: "AI-driven lead qualification and prioritization for better conversions",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: Zap,
      title: "Instant AI Support",
      description: "24/7 AI assistant for queries, listing help, and platform guidance",
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Globe,
      title: "Multi-Property Types",
      description: "List residential, commercial, PG hostels, and projects with one wallet",
      gradient: "from-pink-500 to-pink-600"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Partners", icon: Users },
    { value: "50K+", label: "Properties Listed", icon: Building2 },
    { value: "95%", label: "AI Accuracy", icon: Sparkles },
    { value: "24/7", label: "AI Support", icon: HeadphonesIcon }
  ];

  const benefits = [
    "200 free credits on signup (3-month validity)",
    "AI-powered listing enrichment",
    "Smart analytics & insights dashboard",
    "Instant wallet recharge system",
    "24/7 AI assistant support",
    "Flexible credit packages & plans"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Floating Header */}
      <motion.header 
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-orange-600">PARTNER</span>{" "}
              <span className="text-gray-900">PLATFORM</span>
            </span>
          </div>
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            Sign In <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </motion.header>
      {/* Floating Header */}
      <motion.header 
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-orange-600">PARTNER</span>{" "}
              <span className="text-gray-900">PLATFORM</span>
            </span>
          </div>
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            Sign In <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Animated Background */}
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-1.5 text-sm font-semibold">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI-Powered Credit-Based Listing Platform
                  </Badge>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
                >
                  AI-Powered <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
                    Property Listing Platform
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-600 leading-relaxed"
                >
                  List smarter with AI-powered enrichment and credit-based pricing. Get 200 free credits on signup, 
                  recharge anytime, and leverage intelligent analytics to boost your real estate business.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Button
                  onClick={() => setShowAuthModal(true)}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                {/* <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-orange-300 hover:bg-orange-50 px-8 py-6 text-lg font-bold"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button> */}
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                    ))}
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">10,000+ Happy Partners</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <Card className="bg-white/80 backdrop-blur-md border-2 border-orange-200/50 shadow-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500" />
                <CardContent className="p-8 space-y-6">
                  {/* Mini Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {stats.slice(0, 4).map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center"
                      >
                        <stat.icon className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                        <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-3">
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>

                  <Button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 py-6 text-lg font-bold"
                  >
                    Start Your Free Trial
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl"
              >
                <TrendingUp className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-4xl font-extrabold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-1.5 text-sm font-semibold mb-4">
              <Layers className="w-3 h-3 mr-1" />
              Platform Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              AI-Powered Tools to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
                Supercharge Sales
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Credit-based system with intelligent features designed for modern real estate professionals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-2 border-orange-100/50 hover:border-orange-300 transition-all duration-300 shadow-lg hover:shadow-2xl group cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    <div className="flex items-center text-orange-600 font-semibold group-hover:gap-2 gap-1 transition-all duration-300">
                      Learn more
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-1.5 text-sm font-semibold">
                <Target className="w-3 h-3 mr-1" />
                Why Choose Us
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
                Simple{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
                  Credit-Based Pricing
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Pay only for what you list with our flexible credit system. Get 200 free credits (valid for 3 months) when you sign up, 
                then recharge your wallet anytime to continue listing.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 bg-orange-50 rounded-xl p-4 hover:bg-orange-100 transition-colors duration-300"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-900 font-semibold text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={() => setShowAuthModal(true)}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-6 text-lg font-bold mt-6"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: DollarSign, label: "Signup Bonus", value: "200", color: "from-blue-500 to-blue-600" },
                  { icon: Sparkles, label: "AI Powered", value: "100%", color: "from-green-500 to-green-600" },
                  { icon: Clock, label: "Valid For", value: "3 Months", color: "from-purple-500 to-purple-600" },
                  { icon: Zap, label: "Instant", value: "Recharge", color: "from-orange-500 to-orange-600" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <Card className="bg-white border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${item.color}`} />
                      <CardContent className="p-6 text-center space-y-3">
                        <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-extrabold text-gray-900">{item.value}</div>
                        <div className="text-sm text-gray-600 font-medium">{item.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white">
              Ready to List Smarter with AI?
            </h2>
            
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Sign up now and get 200 free credits (valid for 3 months). Experience AI-powered listing enrichment, 
              smart analytics, and instant wallet recharge.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button
                onClick={() => setShowAuthModal(true)}
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              {/* <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-bold backdrop-blur-sm"
              >
                Schedule a Demo
              </Button> */}
            </div>

            {/* <div className="flex items-center justify-center gap-6 pt-8 text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">200 free credits included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">3-month validity</span>
              </div>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">PARTNER PLATFORM</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering real estate professionals with cutting-edge technology and unmatched support.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Features</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Demo</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Updates</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-orange-500 cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Blog</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Cookie Policy</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">GDPR</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 Partner Platform. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Shield className="w-5 h-5 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
              <Lock className="w-5 h-5 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAuthModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="shadow-2xl border-2 border-orange-200/50 bg-white overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500" />
              
              <CardHeader className="space-y-4 pt-8 pb-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-3xl font-extrabold text-gray-900">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Sign in to access your partner dashboard
                  </CardDescription>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="h-1 w-12 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full" />
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <div className="h-1 w-12 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4 px-8 pb-8">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4 flex items-center justify-center gap-2 text-sm text-gray-600"
                >
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">Secure OAuth 2.0 Authentication</span>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SignIn;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/hooks/use-toast";
import { apiCall } from "@/lib/apiClient";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Briefcase,
  Calendar,
} from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function MyBusiness() {
  const [business, setBusiness] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadBusinessProfile = async () => {
      try {
        setLoading(true);
        
        const userResponse = await apiCall(`${backendUrl}/partnerUser/get`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const userData = userResponse.data.user;
        setUser(userData);

        if (userData.accountType === "BUSINESS" && userResponse.data.business) {
          setBusiness(userResponse.data.business);
        }
      } catch (error) {
        console.error("Error fetching business profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load business profile. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    loadBusinessProfile();
  }, [toast]);



  const getVerificationBadge = (status) => {
    const badges = {
      PENDING: {
        variant: "default",
        icon: Clock,
        label: "Pending Review",
      },
      VERIFIED: {
        variant: "success",
        icon: CheckCircle,
        label: "Verified",
      },
      REJECTED: {
        variant: "destructive",
        icon: XCircle,
        label: "Rejected",
      },
    };

    const badge = badges[status] || badges.PENDING;
    const Icon = badge.icon;

    return (
      <Badge variant={badge.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {badge.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // If not an agency account
  if (!user || user.accountType !== "BUSINESS") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Building2 className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Business Profile Not Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              This feature is only available for Agency accounts. Upgrade your account to access business features.
            </p>
            <Button 
              onClick={() => navigate("/edit-profile")} 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg"
            >
              Upgrade to Agency Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If agency but no business profile yet
  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Building2 className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              No Business Profile Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Create your business profile to start managing your agency and unlock all features.
            </p>
            <Button 
              onClick={() => navigate("/edit-business")} 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Create Business Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section with Business Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Business Icon */}
            <div className="relative">
              <div className="h-32 w-32 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl border-4 border-white/20 shadow-2xl flex items-center justify-center">
                <Building2 className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                {getVerificationBadge(business.verificationStatus)}
              </div>
            </div>

            {/* Business Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                {business.businessName}
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex items-center gap-2 justify-center md:justify-start text-blue-100">
                  <Mail className="h-5 w-5" />
                  <span className="text-lg">{business.businessEmail}</span>
                </div>
                {business.businessPhone && (
                  <div className="flex items-center gap-2 justify-center md:justify-start text-blue-100">
                    <Phone className="h-5 w-5" />
                    <span className="text-lg">
                      {typeof business.businessPhone === "object"
                        ? business.businessPhone.number || JSON.stringify(business.businessPhone)
                        : business.businessPhone}
                    </span>
                  </div>
                )}
              </div>
              <Button
                onClick={() => navigate("/edit-business")}
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-lg"
              >
                <Edit className="h-5 w-5 mr-2" />
                Edit Business
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Business Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Business Details</h2>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Business Name
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{business.businessName}</p>
                </div>

                {business.registrationNumber && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      <FileText className="h-4 w-4" />
                      Registration Number
                    </div>
                    <p className="text-base font-mono text-gray-900 dark:text-white">{business.registrationNumber}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Business ID
                  </div>
                  <p className="text-base font-mono text-gray-900 dark:text-white break-all">{business.businessId}</p>
                </div>

                {business.verifiedAt && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Verified On
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-base text-gray-900 dark:text-white">
                        {new Date(business.verifiedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="text-base text-gray-900 dark:text-white break-all">{business.businessEmail}</p>
              </div>

              {business.businessPhone && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </div>
                  <p className="text-base text-gray-900 dark:text-white">
                    {typeof business.businessPhone === "object"
                      ? business.businessPhone.number || JSON.stringify(business.businessPhone)
                      : business.businessPhone}
                  </p>
                </div>
              )}

              {business.businessAddress && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </div>
                  <p className="text-base text-gray-900 dark:text-white leading-relaxed">{business.businessAddress}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Notes - Full Width */}
        {business.verificationNotes && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Details</h2>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <p className="text-base text-gray-900 dark:text-white leading-relaxed mb-4">
                {business.verificationNotes}
              </p>
              {business.verifiedAt && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Verified on {new Date(business.verifiedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline Section */}
        {(business.business_created_at || business.business_updated_at) && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Timeline</h2>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-4">
                {business.business_created_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</span>
                    <span className="text-base text-gray-900 dark:text-white">
                      {new Date(business.business_created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
                {business.business_updated_at && (
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</span>
                    <span className="text-base text-gray-900 dark:text-white">
                      {new Date(business.business_updated_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

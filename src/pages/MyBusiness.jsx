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

        if (userData.accountType === "BUSINESS" && userData.business) {
          setBusiness(userData.business);
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
      APPROVED: {
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
          <div className=" dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
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
          <div className=" dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
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
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg"
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
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header with Business Name and Status */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16  rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 break-words">
                  {business.businessName}
                </h1>
                <div className="flex items-center gap-2">
                  {getVerificationBadge(business.verificationStatus)}
                </div>
              </div>
            </div>
            <Button
              onClick={() => navigate("/edit-business")}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Business
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Business Information Card */}
          <div className="bg-card border border-border rounded-lg shadow-sm">
            <div className="p-4 sm:p-6 border-b border-border ">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">Business Details</h2>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                <p className="mt-1 text-base text-card-foreground break-words">{business.businessName}</p>
              </div>

              {business.registrationNumber && (
                <div className="pt-4 border-t border-border">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Registration Number
                  </label>
                  <p className="mt-1 text-base font-mono text-card-foreground break-words">{business.registrationNumber}</p>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <label className="text-sm font-medium text-muted-foreground">Business ID</label>
                <p className="mt-1 text-sm font-mono text-card-foreground break-all">{business.businessId}</p>
              </div>

              {business.verifiedAt && (
                <div className="pt-4 border-t border-border">
                  <label className="text-sm font-medium text-muted-foreground">Verified On</label>
                  <div className="mt-1 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-base text-card-foreground">
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

          {/* Contact Information Card */}
          <div className="bg-card border border-border rounded-lg shadow-sm">
            <div className="p-4 sm:p-6 border-b border-border ">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">Contact Information</h2>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="mt-1 text-base text-card-foreground break-all">{business.businessEmail}</p>
              </div>

              {business.businessPhone && business.businessPhone.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone{business.businessPhone.length > 1 ? "s" : ""}
                  </label>
                  <div className="mt-1 space-y-1">
                    {business.businessPhone.map((phoneObj, index) => (
                      <p key={index} className="text-base text-card-foreground">
                        {phoneObj.phone}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {business.businessAddress && (
                <div className="pt-4 border-t border-border">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </label>
                  <p className="mt-1 text-base text-card-foreground leading-relaxed break-words">{business.businessAddress}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Notes - Full Width */}
        {business.verificationNotes && (
          <div className="mt-6 bg-card border border-border rounded-lg shadow-sm">
            <div className="p-4 sm:p-6 border-b border-border ">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">Verification Details</h2>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-base text-card-foreground leading-relaxed mb-4">
                {business.verificationNotes}
              </p>
              {business.verifiedAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
                  <Calendar className="w-4 h-4" />
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
          <div className="mt-6 bg-card border border-border rounded-lg shadow-sm">
            <div className="p-4 sm:p-6 border-b border-border ">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">Timeline</h2>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-3">
              {business.business_created_at && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Created</span>
                  <span className="text-sm sm:text-base text-card-foreground">
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 pt-3 border-t border-border">
                  <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                  <span className="text-sm sm:text-base text-card-foreground">
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
        )}
      </div>
    </div>
  );
}

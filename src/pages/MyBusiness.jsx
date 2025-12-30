import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

        if (userData.business) {
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

  const InfoItem = ({ icon: Icon, label, value, className = "" }) => {
    if (!value) return null;
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Icon className="h-4 w-4 text-orange-600" />
          <span>{label}</span>
        </div>
        <p className="text-base font-medium text-foreground pl-6">{value}</p>
      </div>
    );
  };

  const DateInfoItem = ({ icon: Icon, label, date }) => {
    if (!date) return null;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Icon className="h-4 w-4 text-orange-600" />
          <span>{label}</span>
        </div>
        <div className="pl-6">
          <p className="text-base font-medium text-foreground">
            {new Date(date).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
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
  if (!user.business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Card className="rounded-3xl shadow-xl border p-12 text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Building2 className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Business Profile Not Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              This feature is only available for Agency accounts. Upgrade your
              account to access business features.
            </p>
            <Button
              onClick={() => navigate("/edit-profile")}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg"
            >
              Upgrade to Agency Account
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // If agency but no business profile yet
  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Card className="rounded-3xl shadow-xl border p-12 text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Building2 className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              No Business Profile Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Create your business profile to start managing your agency and
              unlock all features.
            </p>
            <Button
              onClick={() => navigate("/edit-business")}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Create Business Profile
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Business Header */}
      <div className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white overflow-hidden">
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Business Avatar/Icon */}
            <Avatar className="relative h-32 w-32 border-4 border-white/30 shadow-2xl ring-4 ring-white/10">
              {business.profileImage ? (
                <AvatarImage
                  src={`${backendUrl}${business.profileImage}`}
                  alt={`${business.firstName} ${business.lastName}`}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="text-4xl bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold">
                  {business.nameInitial}
                </AvatarFallback>
              )}
            </Avatar>

            {/* Business Header Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                  {business.businessName}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                  {getVerificationBadge(business.verificationStatus)}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                <Button
                  onClick={() => navigate("/edit-business")}
                  size="lg"
                  className="bg-white text-orange-700 hover:bg-orange-50 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Business
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Business Information Card */}
          <Card className="overflow-hidden">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Business Details</CardTitle>
                  <CardDescription>
                    Your business information and registration
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <InfoItem
                  icon={Building2}
                  label="Business Name"
                  value={business.businessName}
                />

                {business.registrationNumber && (
                  <InfoItem
                    icon={FileText}
                    label="Registration Number"
                    value={business.registrationNumber}
                    className="font-mono"
                  />
                )}

                <InfoItem
                  icon={Briefcase}
                  label="Business ID"
                  value={business.businessId}
                  className="font-mono"
                />

                {/* Verification Status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                    <span>Verification Status</span>
                  </div>
                  <div className="pl-6">
                    {getVerificationBadge(business.verificationStatus)}
                  </div>
                </div>

                {business.verifiedAt && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <span>Verified On</span>
                    </div>
                    <div className="pl-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="text-base font-medium text-foreground">
                          {new Date(business.verifiedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card className="overflow-hidden">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Business contact details and address
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={business.businessEmail}
                />

                {business.businessPhone &&
                  business.businessPhone.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Phone className="h-4 w-4 text-orange-600" />
                        <span>
                          Phone{business.businessPhone.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="pl-6 space-y-1">
                        {business.businessPhone.map((phoneObj, index) => (
                          <p
                            key={index}
                            className="text-base font-medium text-foreground"
                          >
                            {phoneObj.phone}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                {business.businessAddress && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <MapPin className="h-4 w-4 text-orange-600" />
                      <span>Address</span>
                    </div>
                    <p className="text-base font-medium text-foreground leading-relaxed pl-6 bg-muted/50 p-4 rounded-lg">
                      {business.businessAddress}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Notes - Full Width */}
        {business.verificationNotes && (
          <Card className="mt-6 overflow-hidden">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Verification Details
                  </CardTitle>
                  <CardDescription>
                    Business verification status and notes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base text-foreground leading-relaxed">
                {business.verificationNotes}
              </p>
              {business.verifiedAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Verified on{" "}
                    {new Date(business.verifiedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Timeline Section */}
        {(business.business_created_at || business.business_updated_at) && (
          <Card className="mt-6 overflow-hidden">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Activity Timeline</CardTitle>
                  <CardDescription>
                    Business account history and recent activity
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {business.business_created_at && (
                  <DateInfoItem
                    icon={Calendar}
                    label="Business Created"
                    date={business.business_created_at}
                  />
                )}

                {business.business_updated_at && (
                  <DateInfoItem
                    icon={Clock}
                    label="Last Updated"
                    date={business.business_updated_at}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

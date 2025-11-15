import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

        if (userData.accountType === "AGENCY" && userResponse.data.business) {
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
  if (!user || user.accountType !== "AGENCY") {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">My Business Profile</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Business Profile Not Available
                </h3>
                <p className="text-muted-foreground mb-4">
                  This feature is only available for Agency accounts.
                </p>
                <Button onClick={() => navigate("/edit-profile")}>
                  Upgrade to Agency Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If agency but no business profile yet
  if (!business) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">My Business Profile</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  No Business Profile Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create your business profile to get started.
                </p>
                <Button onClick={() => navigate("/edit-business")}>
                  Create Business Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Business Profile</h1>
        <Button onClick={() => navigate("/edit-business")}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Business
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Business Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="h-24 w-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-12 w-12 text-white" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{business.businessName}</h2>
                  {getVerificationBadge(business.verificationStatus)}
                </div>
                <div className="flex flex-col gap-1 text-muted-foreground">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="h-4 w-4" />
                    <span>{business.businessEmail}</span>
                  </div>
                  {business.businessPhone && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Phone className="h-4 w-4" />
                      <span>
                        {typeof business.businessPhone === "object"
                          ? business.businessPhone.number || JSON.stringify(business.businessPhone)
                          : business.businessPhone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Business Name
                </label>
                <p className="text-base mt-1">{business.businessName}</p>
              </div>

              {business.registrationNumber && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Registration Number
                  </label>
                  <p className="text-base mt-1">{business.registrationNumber}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Business ID
                </label>
                <p className="text-base mt-1">{business.businessId}</p>
              </div>

              {business.verifiedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Verified On
                  </label>
                  <p className="text-base mt-1">
                    {new Date(business.verifiedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <p className="text-base mt-1">{business.businessEmail}</p>
            </div>

            {business.businessPhone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Phone
                </label>
                <p className="text-base mt-1">
                  {typeof business.businessPhone === "object"
                    ? business.businessPhone.number || JSON.stringify(business.businessPhone)
                    : business.businessPhone}
                </p>
              </div>
            )}

            {business.businessAddress && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Address
                </label>
                <p className="text-base mt-1">{business.businessAddress}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Notes */}
        {business.verificationNotes && (
          <Card>
            <CardHeader>
              <CardTitle>Verification Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">{business.verificationNotes}</p>
              {business.verifiedAt && (
                <p className="text-sm text-muted-foreground mt-2">
                  Verified on: {new Date(business.verifiedAt).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {business.business_created_at && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm">
                  {new Date(business.business_created_at).toLocaleString()}
                </span>
              </div>
            )}
            {business.business_updated_at && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm">
                  {new Date(business.business_updated_at).toLocaleString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

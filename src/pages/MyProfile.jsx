import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/hooks/use-toast";
import { apiCall } from "@/lib/apiClient";
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  Video,
} from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await apiCall(`${backendUrl}/partnerUser/get`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [toast]);



  const getVerificationBadge = (status) => {
    const badges = {
      INITIAL: {
        variant: "secondary",
        icon: Clock,
        label: "Not Submitted",
      },
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

    const badge = badges[status] || badges.INITIAL;
    const Icon = badge.icon;

    return (
      <Badge variant={badge.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {badge.label}
      </Badge>
    );
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Unable to load profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button onClick={() => navigate("/edit-profile")}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Profile Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="h-24 w-24">
                {user.profileImage ? (
                  <AvatarImage
                    src={`${backendUrl}${user.profileImage}`}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <AvatarFallback className="text-2xl bg-black text-white">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">
                    {user.firstName} {user.lastName}
                  </h2>
                  {getVerificationBadge(user.verificationStatus)}
                </div>
                <div className="flex flex-col gap-1 text-muted-foreground">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Account Type
                </label>
                <p className="text-base mt-1 capitalize">
                  {user.accountType?.toLowerCase() || "Individual"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  User ID
                </label>
                <p className="text-base mt-1">{user.userId}</p>
              </div>

              {user.phoneVerifiedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone Verified
                  </label>
                  <p className="text-base mt-1 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {new Date(user.phoneVerifiedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {user.lastLoginAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Login
                  </label>
                  <p className="text-base mt-1">
                    {new Date(user.lastLoginAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        {(user.address || (user.latitude && user.longitude)) && (
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground">
                      Address
                    </label>
                    <p className="text-base mt-1">{user.address}</p>
                  </div>
                </div>
              )}

              {user.latitude && user.longitude && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Latitude
                    </label>
                    <p className="text-base mt-1">{user.latitude}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Longitude
                    </label>
                    <p className="text-base mt-1">{user.longitude}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

   

        {/* Verification Notes */}
        {user.verificationNotes && (
          <Card>
            <CardHeader>
              <CardTitle>Verification Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">{user.verificationNotes}</p>
              {user.verifiedAt && (
                <p className="text-sm text-muted-foreground mt-2">
                  Verified on: {new Date(user.verifiedAt).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

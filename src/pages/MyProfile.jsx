import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Mail,
  Phone,
  MapPin,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Calendar,
  Shield,
  Video,
  Image as ImageIcon,
  Building2,
  Hash,
  Globe,
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

  const DateInfoItem = ({ icon: Icon, label, date, additionalInfo }) => {
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
          {additionalInfo && (
            <p className="text-sm text-muted-foreground mt-1">
              {additionalInfo}
            </p>
          )}
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Unable to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section with Profile Header */}
      <div className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"></div>

        <div className="relative  mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar with Verification Badge */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-300 to-orange-200 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <Avatar className="relative h-32 w-32 border-4 border-white/30 shadow-2xl ring-4 ring-white/10">
                {user.profileImage ? (
                  <AvatarImage
                    src={`${backendUrl}${user.profileImage}`}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                )}
              </Avatar>
       
            </div>

            {/* Profile Header Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                  {user.firstName} {user.lastName}
                </h1>
                {user.derivedUserName && (
                  <p className="text-xl text-orange-100 font-medium flex items-center gap-2 justify-center md:justify-start">
                    <User className="h-5 w-5" />
                    {user.derivedUserName}
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start">
                <div className="flex items-center gap-2 text-orange-100 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Mail className="h-5 w-5" />
                  <span className="text-base font-medium">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-orange-100 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <Phone className="h-5 w-5" />
                    <span className="text-base font-medium">{user.phone}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                <Button
                  onClick={() => navigate("/edit-profile")}
                  size="lg"
                  className="bg-white text-orange-700 hover:bg-orange-50 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Account Information Card */}
          <div>
            <div className="space-y-3 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Account Details</CardTitle>
                  <CardDescription>
                    Your account information and status
                  </CardDescription>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid gap-6">
                <InfoItem
                  icon={Shield}
                  label="Account Type"
                  value={
                    user.accountType
                      ? user.accountType.charAt(0) +
                        user.accountType.slice(1).toLowerCase()
                      : "Individual"
                  }
                />

                <InfoItem
                  icon={Hash}
                  label="User ID"
                  value={user.userId}
                  className="font-mono text-sm"
                />

                {user.nameInitial && (
                  <InfoItem
                    icon={User}
                    label="Name Initial"
                    value={user.nameInitial}
                  />
                )}

                {/* Phone Verification Status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Phone className="h-4 w-4 text-orange-600" />
                    <span>Phone Verification</span>
                  </div>
                  <div className="pl-6">
                    {user.phoneVerifiedAt ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-base font-medium text-foreground">
                            Verified
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(user.phoneVerifiedAt).toLocaleDateString(
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
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-gray-400" />
                        <p className="text-base text-muted-foreground">
                          Not Verified
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information Card */}
          {(user.address || (user.latitude && user.longitude)) && (
            <div>
              <div className="space-y-3 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Location</CardTitle>
                    <CardDescription>
                      Your address and coordinates
                    </CardDescription>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {user.address && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Building2 className="h-4 w-4 text-orange-600" />
                      <span>Address</span>
                    </div>
                    <p className="text-base font-medium text-foreground leading-relaxed pl-6 bg-muted/50 p-4 rounded-lg">
                      {user.address}
                    </p>
                  </div>
                )}

                {user.latitude && user.longitude && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Globe className="h-4 w-4 text-blue-600" />
                        <span>Latitude</span>
                      </div>
                      <p className="text-base font-mono font-medium text-foreground">
                        {user.latitude}
                      </p>
                    </div>
                    <div className="space-y-2 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Globe className="h-4 w-4 text-purple-600" />
                        <span>Longitude</span>
                      </div>
                      <p className="text-base font-mono font-medium text-foreground">
                        {user.longitude}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Activity Timeline Card - Full Width */}
        <div className="mt-12">
          <div className="space-y-3 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Activity Timeline</CardTitle>
                <CardDescription>
                  Your account history and recent activity
                </CardDescription>
              </div>
            </div>
          </div>
          <div>
            <div className="grid md:grid-cols-3 gap-6">
              <DateInfoItem
                icon={Calendar}
                label="Account Created"
                date={user.user_created_at}
                additionalInfo={
                  user.created_date && user.v_created_time
                    ? `${user.created_date} at ${user.v_created_time}`
                    : null
                }
              />

              <DateInfoItem
                icon={Calendar}
                label="Last Updated"
                date={user.user_updated_at}
                additionalInfo={
                  user.v_updated_date && user.v_updated_time
                    ? `${user.v_updated_date} at ${user.v_updated_time}`
                    : null
                }
              />

              <DateInfoItem
                icon={Clock}
                label="Last Login"
                date={user.lastLoginAt}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

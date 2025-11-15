import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  User,
  Calendar,
  Shield,
  Video,
  Image as ImageIcon,
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
        <div className="text-center">
          <p className="text-muted-foreground">Unable to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Profile Header */}
      <div className="relative bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative  mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white/20 shadow-2xl">
                {user.profileImage ? (
                  <AvatarImage
                    src={`${backendUrl}${user.profileImage}`}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                )}
              </Avatar>
              {/* <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                {getVerificationBadge(user.verificationStatus)}
              </div> */}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                {user.firstName} {user.lastName}
              </h1>
              {user.derivedUserName && (
                <p className="text-xl text-orange-100 mb-3 font-medium">
                  {user.derivedUserName}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex items-center gap-2 justify-center md:justify-start text-orange-100">
                  <Mail className="h-5 w-5" />
                  <span className="text-lg">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 justify-center md:justify-start text-orange-100">
                    <Phone className="h-5 w-5" />
                    <span className="text-lg">{user.phone}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button
                  onClick={() => navigate("/edit-profile")}
                  size="lg"
                  className="bg-white text-orange-700 hover:bg-orange-50 font-semibold shadow-lg"
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Account Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Details</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <Shield className="h-4 w-4" />
                    Account Type
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {user.accountType?.toLowerCase() || "Individual"}
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    User ID
                  </div>
                  <p className="text-lg font-mono text-gray-900 dark:text-white break-all">
                    {user.userId}
                  </p>
                </div>

                {user.nameInitial && (
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Name Initial
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {user.nameInitial}
                    </p>
                  </div>
                )}

                {user.phoneVerifiedAt ? (
                  <div className="col-span-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Phone Verified
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-base text-gray-900 dark:text-white">
                        {new Date(user.phoneVerifiedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="col-span-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Phone Status
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-gray-400" />
                      <p className="text-base text-gray-500 dark:text-gray-400">
                        Not Verified
                      </p>
                    </div>
                  </div>
                )}

                {user.user_created_at && (
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      <Calendar className="h-4 w-4" />
                      Account Created
                    </div>
                    <p className="text-base text-gray-900 dark:text-white">
                      {new Date(user.user_created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {user.created_date && user.v_created_time && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {user.created_date} at {user.v_created_time}
                      </p>
                    )}
                  </div>
                )}

                {user.user_updated_at && (
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      <Calendar className="h-4 w-4" />
                      Last Updated
                    </div>
                    <p className="text-base text-gray-900 dark:text-white">
                      {new Date(user.user_updated_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {user.v_updated_date && user.v_updated_time && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {user.v_updated_date} at {user.v_updated_time}
                      </p>
                    )}
                  </div>
                )}

                {user.lastLoginAt && (
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      <Calendar className="h-4 w-4" />
                      Last Login
                    </div>
                    <p className="text-base text-gray-900 dark:text-white">
                      {new Date(user.lastLoginAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          {(user.address || (user.latitude && user.longitude)) && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Location</h2>
              </div>

              <div className="space-y-6">
                {user.address && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Address
                    </div>
                    <p className="text-base text-gray-900 dark:text-white leading-relaxed">
                      {user.address}
                    </p>
                  </div>
                )}

                {user.latitude && user.longitude && (
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Latitude
                      </div>
                      <p className="text-base font-mono text-gray-900 dark:text-white">
                        {user.latitude}
                      </p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Longitude
                      </div>
                      <p className="text-base font-mono text-gray-900 dark:text-white">
                        {user.longitude}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

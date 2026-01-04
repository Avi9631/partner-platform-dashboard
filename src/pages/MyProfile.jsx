import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Shield,
  Building2,
  Hash,
  Globe,
  Video,
  Award,
  AlertCircle,
  UserCheck,
  FileText,
} from "lucide-react";

const backendUrl = process.env.VITE_API_URL || "http://localhost:3000";

export default function MyProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: loading } = useAuth();

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
    <div className="min-h-screen  ">
      {/* Hero Section with Profile Header */}
      <div className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white overflow-hidden">

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
              
              {/* Verification Badge */}
              {user.verificationStatus === 'APPROVED' && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white shadow-lg">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
              )}
       
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

              {/* Contact Information & Status */}
              <div className="space-y-4">
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
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
    
          {/* Account Information Card */}
          <Card className="overflow-hidden">
            <CardHeader className="space-y-3 pb-6">
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
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
          

                <InfoItem
                  icon={Hash}
                  label="Partner ID"
                  value={`#${user.userId.toString().padStart(6, '0')}`}
                  className="font-mono"
                />

                <InfoItem
                  icon={User}
                  label="Display Name"
                  value={user.derivedUserName?.trim() || `${user.firstName} ${user.lastName}`}
                />

                {user.nameInitial && (
                  <InfoItem
                    icon={Award}
                    label="Name Initial"
                    value={user.nameInitial}
                  />
                )}

                {/* Phone Verification Status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Phone className="h-4 w-4 text-orange-600" />
                    <span>Phone</span>
                  </div>
                  <div className="pl-6">
                     {user?.phone}
                  </div>
                </div>

                                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail className="h-4 w-4 text-orange-600" />
                    <span>Email</span>
                  </div>
                  <div className="pl-6">
                     {user?.email}
                  </div>
                </div>

                {/* Partner Status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <UserCheck className="h-4 w-4 text-orange-600" />
                    <span>Partner Status</span>
                  </div>
                  <div className="pl-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                      user.verificationStatus === 'APPROVED' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    }`}>
                      {user.verificationStatus === 'APPROVED' ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Active Partner
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4" />
                          Pending Verification
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

 
          {/* Location Information Card */}
          {(user.address || (user.latitude && user.longitude)) && (
            <Card className="overflow-hidden">
              <CardHeader className="space-y-3 pb-6">
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
              </CardHeader>
              <CardContent className="space-y-6">
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
              </CardContent>
            </Card>
          )}
        </div>

        {/* Activity Timeline Card - Full Width */}
        <Card className="mt-6 overflow-hidden">
          <CardHeader className="space-y-3 pb-6">
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
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

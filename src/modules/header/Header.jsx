import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import NavigationMenuDemo from "./nav-menu.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();

  const getInitials = (email) => {
    if (!email) return "U";
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="flex h-14 items-center justify-between bg-white text-black px-4 shadow-md border-b">
        <div className="flex gap-2 items-center">
          

          {/* Logo */}
          <a
            className="text-lg sm:text-2xl md:text-2xl font-medium text-shadow-lg"
            href="/"
            style={{
              fontFamily: "Nosifer",
            }}
          >
            <span className="text-orange-500 text-shadow-lg">PARTNER</span> PLATFORM
          </a>
        </div>

        {/* Desktop Navigation */}
        {/* <div className="hidden md:flex items-center gap-4 ml-4">
          <NavigationMenuDemo />
        </div> */}

        {/* Right-side user menu */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
           {/* <NavigationMenuDemo /> */}
          <Sheet>
            <SheetTrigger asChild>
              <Avatar className="w-10 h-10 cursor-pointer shadow-sm hover:shadow-xl">
                <AvatarFallback className="text-lg sm:text-lg bg-black text-white font-bold">
                  {getInitials(user?.userEmail)}
                </AvatarFallback>
              </Avatar>
            </SheetTrigger>
            <SheetContent side="right" className="p-6 w-80">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-3 pb-4 border-b">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-2xl bg-black text-white font-bold">
                      {getInitials(user?.userEmail)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium">My Account</span>
                    <span className="text-xs text-gray-500">{user?.userEmail}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      window.location.href = '/profile';
                    }}
                  >
                    My Profile
                  </Button>
                  
                  {user?.accountType === 'BUSINESS' ? (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        window.location.href = '/business-profile';
                      }}
                    >
                      My Business Profile
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
                      onClick={() => {
                        window.location.href = '/upgrade-to-business';
                      }}
                    >
                      Upgrade to Business Account
                    </Button>
                  )}
                  
                  <Button
                    onClick={logout}
                    variant="destructive"
                    className="w-full justify-start mt-4"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-4 w-64">
              <div className="flex flex-col gap-4 mt-4">
                {/* <NavigationMenuDemo orientation={"vertical"} /> */}
                <div className="pt-4  ">
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-sm bg-black text-white font-bold">
                        {getInitials(user?.userEmail)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{user?.userEmail}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        window.location.href = '/profile';
                      }}
                    >
                      My Profile
                    </Button>
                    
                    {user?.accountType === 'BUSINESS' ? (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          window.location.href = '/business-profile';
                        }}
                      >
                        My Business Profile
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
                        onClick={() => {
                          window.location.href = '/upgrade-to-business';
                        }}
                      >
                        Upgrade to Business Account
                      </Button>
                    )}
                    
                    <Button
                      onClick={logout}
                      variant="destructive"
                      className="w-full mt-2"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}

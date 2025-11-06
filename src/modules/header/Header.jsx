import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, Grip, Menu, Presentation } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import NavigationMenuDemo from "./nav-menu.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card.jsx";

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);



  return (
    <>
      <header className="flex h-14 items-center justify-between bg-white text-black px-4 shadow-md border-b">
        <div className="flex gap-2 items-center">
          

          {/* Logo */}
          <a
            className="text-2xl sm:text-3xl font-medium text-shadow-lg
 "
            href="/"
            style={{
              fontFamily: "Nosifer",
            }}
          >
            <span className="text-orange-500 text-shadow-lg">PARTNER</span> PLATFORM
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 ml-4">
          <NavigationMenuDemo />
        </div>

        {/* Right-side button */}
        {/* <div className="hidden md:flex items-center gap-2 ml-auto">
          <Link to={`/account-settings/profile`}>

            <Avatar className="w-10 h-10   shadow-sm hover:shadow-xl">
              <AvatarFallback className="text-lg sm:text-lg  bg-black text-white font-bold">
                {userDetail?.nameInitial}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div> */}

        {/* Mobile Hamburger */}
        {/* <div className="flex md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-4 w-64">
              <div className="flex flex-col gap-4 mt-4 ">
                <NavigationMenuDemo orientation={"vertical"} />
                <Link to={`/account-settings/profile`}>
                  <Button variant="secondary" className="w-full">
                    {userDetail?.nameInitial}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div> */}
      </header>
    </>
  );
}

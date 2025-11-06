import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { cn } from "@/lib/utils.js";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu.jsx";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Separator } from "@/components/ui/separator.jsx";

function NavigationMenuDemo({ orientation }) {
  const navigate = useNavigate();
  const [wsSearchDialogOpen, setWsSearchDialogOpen] = useState(false);

  const location = useLocation();

  const handleNavigate = (url) => {
    console.log(url);
    if (url.startsWith("http")) {
      if (url.includes("auth/logout")) {
        localStorage.clear();
        console.log("Storage cleared");
        window.location.href = url;
      } else {
        window.open(url); // External link
      }
    } else {
      navigate(url); // Internal route
    }
  };

  return (
    <NavigationMenu orientation={orientation} className="z-20 w-full">
      <NavigationMenuList
        className={` ${
          orientation === "vertical"
            ? "flex flex-col gap-1 w-full bg"
            : "flex flex-col sm:flex-row gap-1 w-full"
        }`}
      >
        <NavigationMenuItem
          className={
            orientation === "vertical" ? "w-full" : "flex-1 sm:flex-none"
          }
        >
          <Link to="/" className="w-full block ">
            <Button
              className="w-full justify-center  px-2"
              variant={
                location.pathname== "/" ? "secondary" : "ghost"
              }
            >
              DASHBOARD
            </Button>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem
          className={
            orientation === "vertical" ? "w-full" : "flex-1 sm:flex-none"
          }
        >
          <Link to="/list-property" className="w-full block">
            <Button
              className="w-full justify-center px-2  "
              variant={
                location.pathname == "/list-property"
                  ? "secondary"
                  : "ghost"
              }
            >
              LIST PROPERTY
            </Button>
          </Link>
        </NavigationMenuItem>



      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = ({ className, title, children, ...props }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
};

export default NavigationMenuDemo;

import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./modules/header/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FolderKanban, Users, ArrowRight } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const managementCards = [
    {
      title: "Manage Properties",
      description: "Add, edit, and manage property listings",
      icon: Building2,
      path: "/list-property-v2",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      hoverBg: "from-orange-500 to-orange-600",
    },
    {
      title: "Manage Projects",
      description: "Organize and oversee development projects",
      icon: FolderKanban,
      path: "/list-project",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      hoverBg: "from-orange-500 to-orange-600",
    },
    {
      title: "Manage Developers",
      description: "View and manage developer information",
      icon: Users,
      path: "/list-developer",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      hoverBg: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <>
      <div className="min-h-screen ">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white shadow-xl">
          <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Dashboard</h1>
              <p className="text-orange-100 text-sm md:text-base">Manage your listings and projects</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managementCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.path}
                  className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-gray-200 hover:border-orange-400 bg-white hover:-translate-y-2"
                  onClick={() => navigate(card.path)}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.hoverBg} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Decorative background icon */}
                  <div className="absolute top-0 right-0 opacity-5 transform translate-x-6 -translate-y-6 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-300">
                    <Icon className="w-32 h-32 text-orange-500" />
                  </div>
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className={`w-16 h-16 rounded-2xl ${card.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300 shadow-md border-2 border-orange-200`}>
                      <Icon className={`h-8 w-8 ${card.color}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-orange-600 transition-colors">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className={`text-sm font-semibold ${card.color} group-hover:text-orange-700`}>
                        View Details
                      </span>
                      <div className="w-8 h-8 rounded-full bg-orange-100 group-hover:bg-orange-500 flex items-center justify-center transition-all duration-300">
                        <ArrowRight className={`h-4 w-4 ${card.color} group-hover:text-white group-hover:translate-x-1 transition-all duration-300`} />
                      </div>
                    </div>
                  </CardContent>

                  {/* Decorative corner element */}
                  <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                </Card>
              );
            })}
          </div>
        </div>

        <Outlet />
      </div>
    </>
  );
}

export default Dashboard;

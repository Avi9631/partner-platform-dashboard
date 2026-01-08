import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SignIn from "./modules/SignIn.jsx";
import ProfileSetup from "./modules/ProfileSetup/index.jsx";
import ListPropertyV2 from "./modules/ListPropertyV2.jsx";
import ListPgHostelV2 from "./modules/ListPgHostelV2.jsx";
import PgFormPageV2 from "./modules/listPg/v2/components/PgFormPageV2.jsx";
// import ListProjectV2Page from "./modules/ListProjectV2.jsx";
// import ListDeveloperV2Page from "./modules/ListDeveloperV2.jsx";
import Dashboard from "./Dashboard.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import MyBusiness from "./pages/MyBusiness.jsx";
import EditBusiness from "./pages/EditBusiness.jsx";
import WalletManagement from "./pages/WalletManagement.jsx";
import LeadsManagement from "./pages/LeadsManagement.jsx";
import ListDeveloperV2Page from "./modules/ListDeveloperV2.jsx";
import BusinessProfileSetup from "./modules/BusinessProfileSetup/index.jsx";
import { DeveloperFormPageV2 } from "./modules/listDeveloper/v2/index.js";
import ListProjectV2Page from "./modules/ListProjectV2.jsx";
import ProjectFormPageV2 from "./modules/listProject/v2/components/ProjectFormPageV2.jsx";
import { PropertyFormPageV2 } from "./modules/listProperty/v2/index.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "profile-setup",
        element: (
          <ProtectedRoute requireProfileComplete={false}>
            <ProfileSetup />
          </ProtectedRoute>
        ),
      },
      {
        path: "list-pg-hostel/edit/:draftId",
        element: (
          <ProtectedRoute>
            <PgFormPageV2 />
          </ProtectedRoute>
        ),
      },
            {
        path: "list-developer/:draftId",
        element: (
          <ProtectedRoute>
            <DeveloperFormPageV2 />
          </ProtectedRoute>
        ),
      },
      {
        path: "list-project/:draftId",
        element: (
          <ProtectedRoute>
            <ProjectFormPageV2 />
          </ProtectedRoute>
        ),
      },
            {
        path: "list-property/edit/:draftId",
        element: (
          <ProtectedRoute>
            <PropertyFormPageV2 />
          </ProtectedRoute>
        ),
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "upgrade-to-business",
            element: <BusinessProfileSetup />,
          },
          {
            path: "list-developer",
            element: <ListDeveloperV2Page />,
          },
          {
            path: "list-project",
            element: <ListProjectV2Page />,
          },
          {
            path: "list-property",
            element: <ListPropertyV2 />,
          }, 
          {
            path: "list-pg-hostel",
            element: <ListPgHostelV2 />,
          },
          {
            path: "profile",
            element: <MyProfile />,
          },
          {
            path: "edit-profile",
            element: <EditProfile />,
          },
          {
            path: "business-profile",
            element: <MyBusiness />,
          },
          {
            path: "edit-business",
            element: <EditBusiness />,
          },
          {
            path: "wallet-management",
            element: <WalletManagement />,
          },
          {
            path: "leads-management",
            element: <LeadsManagement />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/*<Provider store={store} >*/} {/* Wrap with Provider */}
    <RouterProvider router={router} />
    <Toaster />
    {/*</Provider>*/}
  </StrictMode>
);

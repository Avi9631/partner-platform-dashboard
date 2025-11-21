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
// import ListProjectV2Page from "./modules/ListProjectV2.jsx";
// import ListDeveloperV2Page from "./modules/ListDeveloperV2.jsx";
import Dashboard from "./Dashboard.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import MyBusiness from "./pages/MyBusiness.jsx";
import EditBusiness from "./pages/EditBusiness.jsx";
import ListDeveloperV2Page from "./modules/ListDeveloperV2.jsx";
import BusinessProfileSetup from "./modules/BusinessProfileSetup/index.jsx";

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
        element: (
             <BusinessProfileSetup />
         ),
      },
          {
            path: "list-developer",
            element: <ListDeveloperV2Page />,
          },
          // {
          //   path: "list-project",
          //   element: <ListProjectV2Page />,
          // },
          {
            path: "list-property",
            element: <ListPropertyV2 />,
          },
          {
            path: "list-property-v2",
            element: <ListPropertyV2 />,
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

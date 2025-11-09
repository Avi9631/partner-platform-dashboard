import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
 import { Toaster } from "./components/ui/toaster.jsx";
import ListProperty from "./modules/ListProperty.jsx";
import ListPropertyV2 from "./modules/ListPropertyV2.jsx";

const router = createBrowserRouter([
 

  {
    path: "/",
    element: <App />, 
    children: [
      {
    path: "/list-property",
    element: <ListProperty />,  
  },
  {
    path: "/list-property-v2",
    element: <ListPropertyV2 />,  
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
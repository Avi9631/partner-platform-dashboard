import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./modules/header/Header";
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Header />
      <div className="h-[calc(100vh-64px)] overflow-y-auto">
        <Outlet />
      </div>
      <Toaster 
        position="top-right" 
        richColors 
        expand={false}
        closeButton
      />
    </>
  );
}

export default App;

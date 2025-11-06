import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./modules/header/Header";

function App() {
  return (
    <>
      <Header />
      <div className="h-[calc(100vh-64px)] overflow-y-auto">
        <Outlet />
      </div>
    </>
  );
}

export default App;

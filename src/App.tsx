import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="mt-10 fixed w-full ">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;

import { Outlet } from "react-router-dom";
import "./App.css";
import Signin from "./pages/Signin";
import Land from "./pages/Land";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Outlet />
    </Router>
  );
}

export default App;

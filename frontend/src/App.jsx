import { Outlet } from "react-router-dom";
import "./App.css";
import Signin from "./pages/Signin";
import Land from "./pages/Land";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return (
    <Router>
      <Routes>
        not autho
        {!isLoggedIn && (
          <>
            <Route path="/" element={<Land />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/users/*" element={<Outlet />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;

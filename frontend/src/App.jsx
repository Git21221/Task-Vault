import { Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Signin from "./pages/Signin";
import Land from "./pages/Land";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import ModeratorDashboard from "./pages/moderator/ModeratorDashboard";
import ModeratorLayout from "./pages/moderator/ModeratorLayout";
import UserDashboard from "./pages/user/UserDashboard";
import UserLayout from "./pages/user/UserLayout";
import WrongRoleRoute from "./pages/WrongRoleRoute";
import Validate from "./pages/Validate";
import Home from "./pages/Home";
import UserManagementByAdmin from "./pages/admin/UserManagementByAdmin";
import ModeratorManagementByAdmin from "./pages/admin/ModeratorManagementByAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import ManagePermissions from "./pages/admin/ManagePermissions";
import GetSingleUser from "./pages/admin/GetSingleUser";
import GetSingleMod from "./pages/admin/GetSingleMod";
import Signup from "./pages/Signup";

function App() {
  const { isLoggedIn, userRole } = useSelector((state) => state.auth);
  return (
    <Router>
      <Routes>
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/" element={<Validate />}>
          {/* not authorised */}
          <Route
            path="/signin"
            element={!isLoggedIn ? <Signin /> : <Navigate to={"/"} replace />}
          />
          <Route
            path="/signup"
            element={!isLoggedIn ? <Signup /> : <Navigate to={"/"} replace />}
          />

          {/* authorised */}
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/" element={<Land />} />
            {/* admin routes */}
            <Route
              path="/admin"
              element={
                (userRole === import.meta.env.VITE_ADMIN_ROLE && isLoggedIn) ? (
                  <AdminLayout />
                ) : (
                  <Navigate to={"/wrong-role-route"} replace />
                )
              }
            >
              <Route
                path="admin-dashboard"
                element={
                  isLoggedIn ? (
                    <AdminDashboard />
                  ) : (
                    <Navigate to="/signin" replace />
                  )
                }
              />
              <Route
                path="user-management"
                element={
                  isLoggedIn ? (
                    <UserManagementByAdmin />
                  ) : (
                    <Navigate to="/signin" replace />
                  )
                }
              />
              <Route
                path="user-management/user/:id"
                element={
                  isLoggedIn ? (
                    <GetSingleUser />
                  ) : (
                    <Navigate to="/signin" replace />
                  )
                }
              />
              <Route
                path="mod-management"
                element={
                  isLoggedIn ? (
                    <ModeratorManagementByAdmin />
                  ) : (
                    <Navigate to="/signin" replace />
                  )
                }
              />
              <Route
                path="mod-management/mod/:id"
                element={isLoggedIn ? <GetSingleMod /> : <Navigate to="/signin" replace />}
              />
              <Route
                path="permissions"
                element={
                  isLoggedIn ? (
                    <ManagePermissions />
                  ) : (
                    <Navigate to="/signin" replace />
                  )
                }
              />
              <Route
                path="settings"
                element={
                  isLoggedIn ? (
                    <SettingsAdmin />
                  ) : (
                    <Navigate to="/signin" replace />
                  )
                }
              />
            </Route>

            {/* moderator routes */}
            <Route
              path="/moderator"
              element={
                (userRole === import.meta.env.VITE_MOD_ROLE &&
                isLoggedIn) ? (
                  <ModeratorLayout />
                ) : (
                  <Navigate to={"/wrong-role-route"} replace />
                )
              }
            >
              <Route
                path="moderator-dashboard"
                element={<ModeratorDashboard />}
              />
            </Route>

            {/* user routes */}
            <Route
              path="/user"
              element={
                userRole === import.meta.env.VITE_USER_ROLE && isLoggedIn ? (
                  <UserLayout />
                ) : (
                  <Navigate to={"/wrong-role-route"} replace />
                )
              }
            >
              <Route
                path="user-dashboard"
                element={
                  isLoggedIn ? (
                    <UserDashboard />
                  ) : (
                    <Navigate to={"/signin"} replace />
                  )
                }
              />
            </Route>
            <Route path="/wrong-role-route" element={<WrongRoleRoute />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Signin from "./pages/Signin";
import Land from "./pages/Land";
import { Routes, Route } from "react-router-dom";
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
import ModeratorManagementByAdmin from "./pages/admin/ModeratorManagementByAdmin";
import ManagePermissions from "./pages/admin/ManagePermissions";
import GetSingleUser from "./pages/GetSingleUser";
import GetSingleMod from "./pages/admin/GetSingleMod";
import Signup from "./pages/Signup";
import Loader from "./components/Loader";
import { useEffect } from "react";
import NotesAdmin from "./pages/admin/NotesAdmin";
import Profile from "./pages/Profile";
import UserManagement from "./pages/UserManagement";

function App() {
  const { isLoggedIn, userRole } = useSelector((state) => state.auth);
  const location = useLocation();
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("lastRoute", location.pathname);
    }
  }, [location.pathname, isLoggedIn]);
  const lastRoute = localStorage.getItem("lastRoute") || "/";

  return (
    <div>
      <Loader />
      <Routes>
        <Route path="/" element={<Land />} />
        <Route path="/" element={<Validate />}>
          {/* <Route path="/" element={!isLoggedIn ? <Home /> : <Navigate to="/" />} /> */}
          {/* not authorised */}
          <Route
            path="/signin"
            element={
              !isLoggedIn ? (
                <Signin />
              ) : (
                <Navigate to={lastRoute || "/"} replace />
              )
            }
          />
          <Route
            path="/signup"
            element={!isLoggedIn ? <Signup /> : <Navigate to={"/"} replace />}
          />

          {/* authorised */}
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
            {/* admin routes */}
            <Route
              path="/admin"
              element={
                userRole === import.meta.env.VITE_ADMIN_ROLE && isLoggedIn ? (
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
                    <UserManagement />
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
                element={
                  isLoggedIn ? (
                    <GetSingleMod />
                  ) : (
                    <Navigate to="/signin" replace />
                  )
                }
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
                path="notes"
                element={
                  isLoggedIn ? <NotesAdmin /> : <Navigate to="/signin" replace />
                }
              />
              <Route
                path="profile"
                element={
                  isLoggedIn ? (
                    <Profile />
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
                userRole === import.meta.env.VITE_MOD_ROLE && isLoggedIn ? (
                  <ModeratorLayout />
                ) : (
                  <Navigate to={"/wrong-role-route"} replace />
                )
              }
            >
              <Route
                path="moderator-dashboard"
                element={
                  isLoggedIn ? (
                    <ModeratorDashboard />
                  ) : (
                    <Navigate to="/signin" replace />
                  )
                }
              />
              <Route 
                path="manage-users"
                element={
                  isLoggedIn ? <UserManagement /> : <Navigate to="/signin" replace />
                }
              />
              <Route
                path="manage-users/user/:id"
                element={
                  isLoggedIn ? <GetSingleUser /> : <Navigate to="/signin" replace />
                }
              />
              <Route
                path="profile"
                element={
                  isLoggedIn ? (
                    <Profile />
                  ) : (
                    <Navigate to="/signin" replace />
                  )
                }
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
              <Route
                path="notes"
                element={
                  isLoggedIn ? <Home /> : <Navigate to="/signin" replace />
                }
              />
              <Route
                path="profile"
                element={
                  isLoggedIn ? (
                    <Profile />
                  ) : (
                    <Navigate to="/signin" replace />
                  )
                }
              />
            </Route>
            <Route path="/wrong-role-route" element={<WrongRoleRoute />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;

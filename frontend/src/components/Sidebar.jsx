import React from "react";
import {
  IoLogOutOutline,
  IoHomeOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { NavLink } from "react-router-dom";
import { FaRegLightbulb } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { PiUserGear } from "react-icons/pi";
import { GrInsecure } from "react-icons/gr";

const Sidebar = () => {
  const { userRole } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const menuItems = {
    admin: [
      {
        id: 1,
        label: "Dashboard",
        icon: <MdOutlineDashboard />,
        path: "admin-dashboard",
      },
      {
        id: 2,
        label: "Manage User",
        icon: <FiUsers />,
        path: "user-management",
      },
      {
        id: 3,
        label: "Manage Mods",
        icon: <PiUserGear />,
        path: "mod-management",
      },
      {
        id: 4,
        label: "Permissions",
        icon: <GrInsecure />,
        path: "permissions",
      },
      {
        id: 5,
        label: "Settings",
        icon: <IoSettingsOutline />,
        path: "settings",
      },
    ],
    user: [
      { id: 1, label: "Notes", icon: <FaRegLightbulb />, path: "user-dashboard" },
      { id: 2, label: "Profile", icon: <IoSettingsOutline />, path: "profile" },
    ],
    moderator: [
      { id: 1, label: "Dashboard", icon: <MdOutlineDashboard />, path: "moderator-dashboard" },
      { id: 2, label: "Manage Users", icon: <FiUsers />, path: "manage-users" },
      { id: 2, label: "Settings", icon: <IoSettingsOutline />, path: "settings" },
    ]
  };

  const currentMenuItems = menuItems[userRole] || [];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-64 h-[calc(100vh-62px)] p-4 flex flex-col justify-between">
      {/* Menu Items */}
      <ul className="space-y-2">
        {currentMenuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.id}
            className={({ isActive }) =>
              `flex items-center gap-9 p-3 rounded-lg cursor-pointer ${
                isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
              }`
            }
          >
            <span className="text-xl text-gray-700">{item.icon}</span>
            <span className="text-gray-800 font-medium">{item.label}</span>
          </NavLink>
        ))}
      </ul>

      {/* Logout Button */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-9 p-3 rounded-lg w-full text-gray-800 font-medium hover:bg-red-100 transition"
        >
          <IoLogOutOutline className="text-xl text-red-600" />
          <span className="text-red-600">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

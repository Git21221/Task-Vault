import React from "react";
import { IoBulbOutline, IoNotificationsOutline, IoTrashOutline, IoLogOutOutline } from "react-icons/io5";
import { MdOutlineLabel, MdOutlineArchive, MdEdit } from "react-icons/md";

const Sidebar = () => {
  const menuItems = [
    { id: 1, label: "Notes", icon: <IoBulbOutline />, highlighted: true },
  ];

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
  };

  return (
    <div className="w-64 h-[calc(100vh-62px)] p-4 flex flex-col justify-between">
      {/* Menu Items */}
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`flex items-center gap-9 p-3 rounded-lg cursor-pointer ${
              item.highlighted ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
          >
            <span className="text-xl text-gray-700">{item.icon}</span>
            <span className="text-gray-800 font-medium">{item.label}</span>
          </li>
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

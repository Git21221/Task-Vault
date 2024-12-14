import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";

function AdminLayout() {
  const { count } = useSelector((state) => state.ui);
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div key={count} className="flex-1 p-4 w-full h-[calc(100vh-62px)] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

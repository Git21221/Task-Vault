import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { getCurrentPerson } from "../../redux/authSlice";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function ModeratorLayout() {
  const { user } = useSelector((state) => state.auth);
  const {count} = useSelector((state) => state.ui);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getCurrentPerson({
        dispatch,
        userId: user._id,
        action: import.meta.env.VITE_PROFILE_READ,
      })
    );
  }, [dispatch]);
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

export default ModeratorLayout;

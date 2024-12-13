import React, { useEffect, useRef } from "react";
import { IoMdRefresh } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { toggleSidebar } from "../redux/uiSlice";

function Navbar() {
  const { user, userRole } = useSelector((state) => state.auth);
  const [openProfileModal, setOpenProfileModal] = React.useState(false);
  const [openSearchPopup, setOpenSearchPopup] = React.useState(false);
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const searchPopupRef = useRef(null);

  const handleProfileClick = () => {
    setOpenProfileModal((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSidebar = () => {
    dispatch(toggleSidebar());
  };

  // Close modal or search popup when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpenProfileModal(false);
      }
      if (searchPopupRef.current && !searchPopupRef.current.contains(e.target)) {
        setOpenSearchPopup(false);
      }
    };

    if (openProfileModal || openSearchPopup) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openProfileModal, openSearchPopup]);

  return (
    <div className="w-full flex items-center h-[60px] gap-4 md:gap-10 lg:gap-20 px-4 bg-gray-100 shadow">
      {openProfileModal && (
        <div
          ref={modalRef}
          className="absolute right-4 top-[60px] bg-white shadow-lg rounded-lg p-4 w-64 text-black z-10"
        >
          <div className="text-lg font-semibold mb-2">
            Welcome, {user?.fullName}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            Role: <span className="font-medium">{userRole}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-all duration-300 w-full"
          >
            Logout
          </button>
        </div>
      )}

      {/* Left: Hamburger Menu and Logo */}
      <div className="flex flex-1 items-center gap-4">
        <button onClick={handleSidebar}>
          <RxHamburgerMenu className="text-gray-800 text-[50px] hover:bg-gray-200 p-3 rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 h-8 w-8 flex items-center justify-center rounded">
            <span className="text-white text-xl">T</span>
          </div>
          <span className="text-gray-800 font-medium text-lg">Task</span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex sm:justify-center justify-end w-full">
        {/* Full search bar for larger screens */}
        <div className="hidden sm:flex items-center bg-white rounded-full shadow px-4 py-2 w-[-webkit-fill-available]">
          <IoSearchOutline className="text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 ml-2 outline-none text-gray-700 bg-transparent"
          />
        </div>

        {/* Search icon for smaller screens */}
        <div
          onClick={() => setOpenSearchPopup(true)}
          className="flex sm:hidden items-center justify-center p-2 rounded-full sm:bg-white sm:shadow cursor-pointer"
        >
          <IoSearchOutline className="text-gray-500 text-2xl" />
        </div>
      </div>

      {/* Right: Icons and Profile */}
      <div className="flex flex-1 items-center justify-end gap-6">
        <IoMdRefresh className="text-gray-500 text-5xl hover:bg-gray-200 p-2 rounded-full" />
        <div
          onClick={handleProfileClick}
          className="w-8 h-8 select-none bg-gray-400 rounded-full flex items-center justify-center text-white text-xl cursor-pointer"
        >
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Search Popup for small screens */}
      {openSearchPopup && (
        <div
          ref={searchPopupRef}
          className="absolute top-[60px] left-0 w-full bg-white shadow-lg z-20 px-4 py-3"
        >
          <div className="flex items-center bg-gray-100 rounded-full shadow px-4 py-2">
            <IoSearchOutline className="text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 ml-2 outline-none text-gray-700 bg-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;

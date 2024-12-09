import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCurrentPerson } from "../redux/authSlice";

function Land() {
  const { user, userRole } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getCurrentPerson({
        userId: user?._id,
        action: import.meta.env.VITE_PROFILE_READ,
      })
    );
  }, [dispatch]);
  return (
    <div>
      {/* Land {userRole} <br /> */}
      <Link to={`/${userRole}/${userRole}-dashboard`}>dashboard</Link>
      {/* <Link to={`/admin/admin-dashboard`}>admin dashboard</Link>
      <Link to={`/moderator/moderator-dashboard`}>mod dashboard</Link>
      <Link to={`/user/user-dashboard`}>user dashboard</Link> */}
    </div>
  );
}

export default Land;

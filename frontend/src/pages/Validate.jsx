import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyToken } from "../redux/authSlice";
import { Outlet } from "react-router-dom";

function Validate() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);
  return <Outlet />;
}

export default Validate;

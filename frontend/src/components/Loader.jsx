import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

function Loader() {
  const loading = useSelector((state) => state.ui.loading);
  return (
    <Backdrop
      open={loading}
      style={{ background: "#000", opacity: 0.6, zIndex: 9999 }}
    >
      <CircularProgress color="primary" />
    </Backdrop>
  );
}

export default Loader;

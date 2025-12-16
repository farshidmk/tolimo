import { CircularProgress } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <div className="absolute w-screen h-screen flex justify-center items-center bg-black/50 z-50">
      <CircularProgress size={80} />
    </div>
  );
};

export default Loading;

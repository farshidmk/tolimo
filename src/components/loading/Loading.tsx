import { CircularProgress } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <div className="sticky w-fit h-fit flex justify-center items-center bg-black/50 z-50">
      <CircularProgress size={80} />
    </div>
  );
};

export default Loading;

import WarningIcon from "@mui/icons-material/Warning";
import React from "react";

type Props = {
  errors: string | string[];
};

const ShowErrors = ({ errors }: Props) => {
  const errorList = typeof errors === "string" ? [errors] : errors;

  if (!errorList || errorList.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-3 border border-red-300 bg-red-100 text-red-700 rounded-md text-sm">
      {errorList.map((error, index) => (
        <div key={index} className="flex items-center gap-2">
          <WarningIcon className="w-4 h-4 text-red-500 mt-0.5" />
          <p>{error}</p>
        </div>
      ))}
    </div>
  );
};

export default ShowErrors;

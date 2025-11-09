"use client";
import { useExamStore } from "@/hooks/useExamStore";
import { convertSecondsToTime } from "@/services/timeConvertor";
import { Typography } from "@mui/material";
import React from "react";

const SectionInfoInNavbar = () => {
  const { activeSection, examTimeLeft, sectionTimeLeft } = useExamStore();

  return (
    <div className="flex gap-2 items-center">
      <div className="bg-blue-100 py-2 px-4 rounded-xl flex flex-col gap-1">
        <Typography variant="h6">{activeSection?.title}</Typography>
        <Typography variant="body2">
          زمان: {convertSecondsToTime(sectionTimeLeft)}
        </Typography>
      </div>
      <div className="py-2 px-4 rounded-xl flex flex-col text-white border border-white ">
        <Typography variant="body1">زمان آزمون</Typography>
        <Typography variant="caption">
          {convertSecondsToTime(examTimeLeft)}
        </Typography>
      </div>
    </div>
  );
};

export default SectionInfoInNavbar;

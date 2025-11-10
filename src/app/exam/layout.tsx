"use client";
import { useExamStore } from "@/hooks/useExamStore";
import React from "react";
import SectionInfoInNavbar from "./_components/layout/SectionInfoInNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Typography } from "@mui/material";
import { convertSecondsToTime } from "@/services/timeConvertor";
import ExamButtons from "./_components/layout/ExamButtons";

type Props = {
  children: React.ReactNode;
};
const ExamLayout = ({ children }: Props) => {
  const { examInfo, examTimeLeft } = useExamStore();

  if (!examInfo) return null;

  return (
    <div className="h-full w-full">
      <nav className="h-20 flex bg-primary ">
        <div className="h-full w-full flex items-center px-4">
          <div>
            <ExamButtons />
          </div>
          <div className="flex-1" />
          <SectionInfoInNavbar />
          <div className="flex-1" />
          <div className="py-1 px-4 rounded-xl flex flex-col text-white border border-white ">
            <Typography variant="body1">زمان آزمون</Typography>
            <Typography variant="caption">
              {convertSecondsToTime(examTimeLeft)}
            </Typography>
          </div>
        </div>
      </nav>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default ExamLayout;

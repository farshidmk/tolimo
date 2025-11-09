"use client";
import { useExamStore } from "@/hooks/useExamStore";
import { Typography } from "@mui/material";
import React from "react";
import SectionInfoInNavbar from "./_components/layout/SectionInfoInNavbar";

type Props = {
  children: React.ReactNode;
};
const ExamLayout = ({ children }: Props) => {
  const { examInfo } = useExamStore();

  if (!examInfo) return null;

  return (
    <div className="h-full w-full">
      <nav className="h-24 flex bg-primary ">
        <div className="h-full w-full flex items-center px-4">
          <SectionInfoInNavbar />
          <div className="flex-1" />
          <div className="flex flex-col gap-2 text-white">
            <Typography variant="body1" fontWeight={600}>
              {examInfo.bookletName}
            </Typography>
            <Typography variant="body2" fontSize={14}>
              {examInfo.description}
            </Typography>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default ExamLayout;

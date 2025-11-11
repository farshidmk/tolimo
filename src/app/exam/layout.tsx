"use client";
import { useExamStore } from "@/hooks/useExamStore";
import React from "react";
import SectionInfoInNavbar from "./_components/layout/SectionInfoInNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Typography } from "@mui/material";
import { convertSecondsToTime } from "@/services/timeConvertor";
import ExamButtons from "./_components/layout/ExamButtons";
import useStartQuestionTimes from "./_components/question/_hooks/useStartQuestionTimes";
import { calculatePercentage } from "@/services/percentage";

type Props = {
  children: React.ReactNode;
};
const ExamLayout = ({ children }: Props) => {
  // run timers
  useStartQuestionTimes();
  const { examInfo, examTimeLeft, questionAutoNextTimeLeft, activeQuestion } =
    useExamStore();

  if (!examInfo) return null;

  return (
    <div className="h-full w-full">
      <nav className="h-20 flex bg-primary ">
        <div className="h-full w-full flex items-center px-4">
          {activeQuestion?.nextAfterSeconds && (
            <div className="h-14 w-14 rounded-full bg-white p-1 flex relative justify-center items-center overflow-hidden">
              <div
                className={`absolute w-full bg-amber-300 transition`}
                style={{
                  height: `${
                    100 -
                    calculatePercentage(
                      questionAutoNextTimeLeft!,
                      activeQuestion?.nextAfterSeconds
                    )
                  }%`,
                  bottom: 0, // Set the bottom to 0 to fill from the bottom
                }}
              />
              <span className="z-10 text-center transform -translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2">
                {questionAutoNextTimeLeft?.toLocaleString("fa")}
              </span>
            </div>
          )}
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

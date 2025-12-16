"use client";
import { useExamStore } from "@/hooks/useExamStore";
import { calculatePercentage } from "@/services/percentage";
import { convertSecondsToTime } from "@/services/timeConvertor";
import { Box, Typography } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
import ExamButtons from "./_components/layout/ExamButtons";
import SectionInfoInNavbar from "./_components/layout/SectionInfoInNavbar";
import useStartQuestionTimes from "./_hooks/useStartQuestionTimes";

type Props = {
  children: React.ReactNode;
};
const ExamLayout = ({ children }: Props) => {
  // run timers
  useStartQuestionTimes();
  const {
    examInfo,
    examTimeLeft,
    questionAutoNextTimeLeft,
    activeQuestion,
    endOfSection,
    nextQuestion,
    startExamTimer, // ← Add this
    startActiveSectionTimer,
    stopActiveSectionTimer,
    autoNextQuestionAfter,
    stopExamTimer,
  } = useExamStore();

  // Start timers when component mounts
  // useEffect(() => {
  //   // startActiveSectionTimer()
  //   startExamTimer(); // ← Start exam timer
  //   startActiveSectionTimer(); // ← Start section timer
  // }, []); // Empty deps = run once on mount

  useEffect(() => {
    if (activeQuestion?.stopSectionTimer) {
      stopExamTimer();
      stopActiveSectionTimer();
    } else {
      startExamTimer();
      startActiveSectionTimer();
    }
    if (activeQuestion?.nextAfterSeconds) {
      autoNextQuestionAfter(activeQuestion.nextAfterSeconds);
    }
  }, [
    activeQuestion?.stopSectionTimer,
    activeQuestion?.questionId,
    activeQuestion?.nextAfterSeconds,
    stopExamTimer,
    stopActiveSectionTimer,
    startExamTimer,
    startActiveSectionTimer,
    autoNextQuestionAfter,
  ]);

  if (!examInfo) return null;

  return (
    <div className="h-full w-full flex flex-col overflow-auto">
      <nav className="h-20 flex bg-blue-400 ">
        <div className="h-full w-full flex items-center px-4">
          <div className="flex-1 flex items-center gap-2">
            {activeQuestion && Boolean(activeQuestion?.nextAfterSeconds) && (
              <div className="h-14 w-14 rounded-full bg-white p-1 flex relative justify-center items-center overflow-hidden">
                <div
                  className={`absolute w-full bg-amber-300 transition`}
                  style={{
                    height: `${
                      100 -
                      calculatePercentage(
                        questionAutoNextTimeLeft!,
                        activeQuestion.nextAfterSeconds
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
            <div className="mx-2">
              <ExamButtons />
            </div>
          </div>
          <div className="flex-1">
            <SectionInfoInNavbar />
          </div>

          <div className="flex-1 flex items-center justify-end">
            <div className="w-32 py-1 px-4 rounded-xl flex flex-col text-white border border-white justify-center items-center">
              <Typography variant="body1">زمان آزمون</Typography>
              <Typography variant="caption">
                {convertSecondsToTime(examTimeLeft)}
              </Typography>
            </div>
          </div>
        </div>
        <button onClick={() => endOfSection()}>end of section</button>
        <button onClick={() => nextQuestion()}>next question</button>
        <span dir="ltr" className="text-white text-xs">
          active question Id:
          <span className="mr-2 font-bold">{activeQuestion?.questionId}</span>
        </span>
      </nav>
      <Box className="p-4 flex-1 overflow-auto">{children}</Box>
    </div>
  );
};

export default ExamLayout;

"use client";
import { useExamStore } from "@/hooks/useExamStore";
import { calculatePercentage } from "@/services/percentage";
import { Box } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ExamButtons from "./_components/layout/ExamButtons";
import SectionInfoInNavbar from "./_components/layout/SectionInfoInNavbar";
import TimeOver from "./_components/timeOver/TimeOver";
import useStartQuestionTimes from "./_hooks/useStartQuestionTimes";

type Props = {
  children: React.ReactNode;
};
const ExamLayout = ({ children }: Props) => {
  const [isTimeOver, setIsTimeOver] = useState(false);
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

  useEffect(() => {
    if (examTimeLeft <= 0) {
      setIsTimeOver(true);
    }
  }, [examTimeLeft]);

  if (!examInfo) return null;

  return (
    <div className="h-full w-full flex flex-col overflow-auto">
      <nav
        className="h-20 flex border-b border-sky-900 shadow-md"
        style={{
          backgroundImage:
            "linear-gradient(rgba(3,105,161,0.9), rgba(2,132,199,0.9)), url('/rock-grunge.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="h-full w-full flex items-center px-4">
          <div className="flex-2 flex items-center gap-2">
            {activeQuestion && Boolean(activeQuestion?.nextAfterSeconds) && (
              <div className="h-14 w-14 rounded-full border border-sky-100 bg-white p-1 flex relative justify-center items-center overflow-hidden shadow-sm">
                <div
                  className={`absolute w-full bg-emerald-200 transition`}
                  style={{
                    height: `${
                      100 -
                      calculatePercentage(
                        questionAutoNextTimeLeft!,
                        activeQuestion.nextAfterSeconds,
                      )
                    }%`,
                    bottom: 0, // Set the bottom to 0 to fill from the bottom
                  }}
                />
                <span className="z-10 text-center transform -translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2 font-semibold text-slate-700">
                  {questionAutoNextTimeLeft?.toLocaleString("fa")}
                </span>
              </div>
            )}
            <div className="mx-2 flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-2 py-1">
              <ExamButtons />
            </div>
          </div>
          <div className="flex-1">
            <SectionInfoInNavbar />
          </div>
          <div className="flex-1 flex items-center justify-end">
            <div className="rounded-xl  bg-white/10 px-2 py-1">
              <Image
                src="/logo.png"
                alt="سازمان سنجش آموزش کشور"
                width={44}
                height={44}
                style={{ width: "44px", height: "44px", objectFit: "contain" }}
                priority
              />
            </div>
          </div>

          {/* <div className="flex-1 flex items-center justify-end">
            <div className="w-32 py-1 px-4 rounded-xl flex flex-col text-white border border-white justify-center items-center">
              <Typography variant="body1">زمان آزمون</Typography>
              <Typography variant="caption">
                {convertSecondsToTime(examTimeLeft)}
              </Typography>
            </div>
          </div> */}
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="flex items-center gap-2 px-2 text-xs">
            <button
              className="rounded border border-white/40 bg-white px-2 py-1"
              onClick={() => endOfSection()}
            >
              end of section
            </button>
            <button
              className="rounded border border-white/40 bg-white px-2 py-1"
              onClick={() => nextQuestion()}
            >
              next question
            </button>
            <span dir="ltr" className="text-white">
              active question Id:
              <span className="mr-2 font-bold">
                {activeQuestion?.questionId}
              </span>
            </span>
          </div>
        )}
      </nav>
      <Box className="p-4 flex-1 overflow-auto">
        {isTimeOver ? <TimeOver /> : children}
      </Box>
    </div>
  );
};

export default ExamLayout;

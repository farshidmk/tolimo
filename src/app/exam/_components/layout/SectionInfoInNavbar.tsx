"use client";
import { useExamStore } from "@/hooks/useExamStore";
import { convertSecondsToTime } from "@/services/timeConvertor";
import { Typography } from "@mui/material";
import React from "react";

const SectionInfoInNavbar = () => {
  const { activeSection, sectionTimeLeft, activeQuestion } = useExamStore();
  const currentQuestionIndex =
    activeSection?.questions.findIndex(
      (question) => question.questionId === activeQuestion?.questionId
    ) ?? 0;
  return (
    <div className="flex gap-2 items-center">
      <Typography variant="h6" sx={{ color: "white" }}>
        بخش: {activeSection?.title}
      </Typography>
      <div className="bg-blue-100 py-2 px-4 rounded-xl flex items-center gap-2">
        <Typography variant="body2">
          زمان: {convertSecondsToTime(sectionTimeLeft)}
        </Typography>
      </div>
      <div className="text-white">
        <Typography variant="body1" fontWeight={600}>
          سوال
          <span className="mx-1">
            {(currentQuestionIndex + 1).toLocaleString("fa")}
          </span>
          از
          <span className="mx-1">
            {activeSection?.questions.length?.toLocaleString("fa")}
          </span>
        </Typography>
      </div>
    </div>
  );
};

export default SectionInfoInNavbar;

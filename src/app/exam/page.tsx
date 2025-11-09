"use client";

import { useExamStore } from "@/hooks/useExamStore";
import React from "react";
import ShowQuestion from "./_components/question/ShowQuestion";

const ExamPage = () => {
  const { activeSection, startExamTimer, stopExamTimer } = useExamStore();
  return (
    <div>
      {activeSection?.title}
      <ShowQuestion />
      <button onClick={startExamTimer}>start</button>
      <button onClick={stopExamTimer}>stop</button>
    </div>
  );
};

export default ExamPage;

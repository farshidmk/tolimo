"use client";

import { useExamStore } from "@/hooks/useExamStore";
import React from "react";

const ShowQuestion = () => {
  const { activeQuestion } = useExamStore();

  return (
    <div>
      {activeQuestion?.passages.map((passage) => (
        <div
          key={passage.passageType}
          dangerouslySetInnerHTML={{ __html: passage.text }}
        />
      ))}
    </div>
  );
};

export default ShowQuestion;

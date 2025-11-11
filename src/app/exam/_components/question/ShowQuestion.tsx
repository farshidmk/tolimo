"use client";

import { useExamStore } from "@/hooks/useExamStore";
import React from "react";
import ShowEmbeddedQuestion from "./ShowEmbeddedQuestion";

const ShowQuestion = () => {
  const { activeQuestion } = useExamStore();

  return (
    <div>
      {activeQuestion?.passages.map((passage) => (
        <div key={passage.passageType}>
          <div dangerouslySetInnerHTML={{ __html: passage.text }} />
          {passage.embeddedFiles.map((embeddedFile) => (
            <ShowEmbeddedQuestion
              key={embeddedFile.fileName}
              embeddedFile={embeddedFile}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ShowQuestion;

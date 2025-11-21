import { useExamStore } from "@/hooks/useExamStore";
import { QuestionKind } from "@/types/question";
import React from "react";
import SingleChoiceQuestion from "./singleChoiceQuestion/SingleChoiceQuestion";
import ListeningLecture from "./listening/ListeningLecture";

const RenderQuestionByType = () => {
  const { activeQuestion } = useExamStore();
  switch (activeQuestion?.questionType) {
    case QuestionKind.ViewOnlyPassage:
      return (
        <div>
          {activeQuestion?.passages.map((passage) => (
            <div key={passage.passageType}>
              <div dangerouslySetInnerHTML={{ __html: passage.text }} />
            </div>
          ))}
        </div>
      );
    case QuestionKind.ViewOnlyPassage:
      return (
        <div>
          {activeQuestion?.passages.map((passage) => (
            <div key={passage.passageType}>
              <div dangerouslySetInnerHTML={{ __html: passage.text }} />
            </div>
          ))}
        </div>
      );
    case QuestionKind.SingleChoice:
      return (
        <div>
          {activeQuestion?.passages.map((passage) => (
            <div key={passage.passageType}>
              <div dangerouslySetInnerHTML={{ __html: passage.text }} />
            </div>
          ))}
          <SingleChoiceQuestion />
        </div>
      );
    case QuestionKind.Listening_Lecture:
      return <ListeningLecture />;
  }
  return <div>RenderQuestionByType</div>;
};

export default RenderQuestionByType;

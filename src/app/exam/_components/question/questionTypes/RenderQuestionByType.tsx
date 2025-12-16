import { useExamStore } from "@/hooks/useExamStore";
import { QuestionKind } from "@/types/question";
import React from "react";
import SingleChoiceQuestion from "./singleChoiceQuestion/SingleChoiceQuestion";
import ListeningLecture from "./listening/ListeningLecture";
import RenderChoiceList from "./RenderChoiceList";
import RenderEmbeddedFile from "../embeddedFile/RenderEmbeddedFile";
import RenderCheckboxes from "./RenderCheckboxes";
import RenderWriting from "./RenderWriting";
import RenderVoiceRecorder from "./voiceRecorder/RenderVoiceRecorder";

const RenderQuestionByType = () => {
  const { activeQuestion } = useExamStore();
  switch (activeQuestion?.questionType) {
    case QuestionKind.SectionDirection:
      return (
        <div>
          {activeQuestion?.passages.map((passage) => (
            <div key={passage.passageType}>
              <div dangerouslySetInnerHTML={{ __html: passage.text }} />
            </div>
          ))}
          <RenderEmbeddedFile />
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
    case QuestionKind.Listening_Question:
      return (
        <div>
          {activeQuestion?.passages.map((passage) => (
            <div key={passage.passageType}>
              <div dangerouslySetInnerHTML={{ __html: passage.text }} />
            </div>
          ))}
          <RenderChoiceList choiceList={activeQuestion.choiceList!} />
        </div>
      );
    case QuestionKind.Reading_SingleChoice:
      return (
        <div>
          {activeQuestion?.passages.map((passage) => (
            <div key={passage.passageType}>
              <div dangerouslySetInnerHTML={{ __html: passage.text }} />
            </div>
          ))}
          <RenderCheckboxes choiceList={activeQuestion.choiceList!} />
        </div>
      );
    case QuestionKind.Writing_Lecture:
      return (
        <div>
          {activeQuestion?.passages.map((passage) => (
            <div key={passage.passageType}>
              <div dangerouslySetInnerHTML={{ __html: passage.text }} />
            </div>
          ))}
          <RenderWriting />
        </div>
      );
    case QuestionKind.Speaking:
      return (
        <div>
          {activeQuestion?.passages.map((passage) => (
            <div key={passage.passageType}>
              <div dangerouslySetInnerHTML={{ __html: passage.text }} />
            </div>
          ))}
          <RenderVoiceRecorder />
        </div>
      );
  }
  return <div>RenderQuestionByType {activeQuestion?.questionType}</div>;
};

export default RenderQuestionByType;

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
          <RenderEmbeddedFile />
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
          <RenderEmbeddedFile />
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
          <RenderEmbeddedFile />
        </div>
      );
    case QuestionKind.Reading_SingleChoice:
      return (
        <div className="flex gap-1">
          <div className="flex-1 h-full overflow-auto">
            {activeQuestion?.passages.map((passage) => (
              <div key={passage.passageType}>
                <div dangerouslySetInnerHTML={{ __html: passage.text }} />
              </div>
            ))}
          </div>
          <div className="w-0.5 bg-black items-stretch rounded-xl" />
          <div className="flex-1  overflow-auto flex flex-col items-stretch justify-center">
            <RenderCheckboxes choiceList={activeQuestion.choiceList!} />
            <RenderEmbeddedFile />
          </div>
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
          <RenderEmbeddedFile />
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
          <RenderEmbeddedFile />
          <RenderVoiceRecorder />
        </div>
      );
  }
  return <div>RenderQuestionByType {activeQuestion?.questionType}</div>;
};

export default RenderQuestionByType;

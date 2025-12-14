import { useExamStore } from "@/hooks/useExamStore";
import { FormObjectState, FormObjectType } from "@/types/formObject";
import { Button } from "@mui/material";
import React from "react";

const ExamButtons = () => {
  const {
    activeQuestion,
    reviewQuestions,
    soundControl,
    showHelp,
    prevQuestion,
    nextQuestion,
    continueAction,
    submitAction,
    getQuestionAnswer,
  } = useExamStore();
  const currentAnswer = getQuestionAnswer(activeQuestion?.questionId || "");
  const handleClick = (type: FormObjectType) => {
    switch (type) {
      case FormObjectType.Review:
      case FormObjectType.ReviewTextButton:
      case FormObjectType.ReviewQuestionButton:
        reviewQuestions();
        break;

      case FormObjectType.VolumeButton:
      case FormObjectType.VolumeControl:
        soundControl();
        break;

      case FormObjectType.HelpButton:
        showHelp();
        break;

      case FormObjectType.BackButton:
        prevQuestion();
        break;

      case FormObjectType.NextButton:
        nextQuestion();
        break;

      case FormObjectType.ContinueButton:
        continueAction();
        break;

      case FormObjectType.OkButton:
        submitAction();
        break;

      default:
        console.warn("No action defined for this FormObjectType:", type);
        break;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {activeQuestion?.formObjects.map((formObject) =>
        formObject.state === FormObjectState.NoDisplay ? null : (
          <Button
            key={`${formObject.state}-${formObject.formObjectType}`}
            variant="contained"
            color="secondary"
            disabled={
              currentAnswer?.isSubmited
                ? false
                : formObject.state === FormObjectState.Deactive
            }
            onClick={() => {
              handleClick(formObject.formObjectType);
            }}
          >
            {formObject.label}
          </Button>
        )
      )}
    </div>
  );
};

export default ExamButtons;

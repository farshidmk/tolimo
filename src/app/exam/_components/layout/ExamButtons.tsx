import { useAudioStore } from "@/hooks/useAudioStore";
import { useExamStore } from "@/hooks/useExamStore";
import { convertSecondsToTime } from "@/services/timeConvertor";
import { QuestionAnswer } from "@/types/answer";
import { FormObjectState, FormObjectType } from "@/types/formObject";
import { QuestionKind } from "@/types/question";
import { ServerCall, ServerResponse } from "@/types/server";
import { Box, Button, Popover, Slider, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { useMemo } from "react";
import ReviewQuestions from "./ReviewQuestions";
import { toast } from "react-toastify";

const ExamButtons = () => {
  const {
    activeSection,
    activeQuestion,
    sectionTimeLeft,
    examTimeLeft,
    showHelp,
    prevQuestion,
    nextQuestion,
    continueAction,
    submitAction,
    getQuestionAnswer,
    toggleMarkQuestion,
    showTimer,
    hideTimer,
  } = useExamStore();

  const formObject = useMemo(() => {
    if (activeQuestion?.formObjects && activeQuestion.formObjects.length > 0) {
      return activeQuestion.formObjects;
    }
    return activeSection?.formObjects;
  }, [activeQuestion?.formObjects, activeSection?.formObjects]);

  const { volume, setVolume } = useAudioStore();
  const [showActionDialog, setShowActionDialog] =
    React.useState<LayoutActionDialog | null>(null);
  const { mutate, isPending } = useMutation<
    ServerResponse<string>,
    Error,
    ServerCall<FormData>
  >({});

  const currentAnswer: QuestionAnswer = getQuestionAnswer(
    activeQuestion?.questionId || ""
  ) ?? {
    answer: "",
    isMarked: false,
    isSubmited: false,
    questionId: activeQuestion?.questionId ?? "",
  };
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: FormObjectType
  ) => {
    switch (type) {
      case FormObjectType.Review:
      case FormObjectType.ReviewTextButton:
      case FormObjectType.ReviewQuestionButton:
        // reviewQuestions();

        setShowActionDialog({ type: "review", anchorEl: event.currentTarget });
        break;

      case FormObjectType.VolumeButton:
      case FormObjectType.VolumeControl:
        setShowActionDialog({ type: "sound", anchorEl: event.currentTarget });
        break;

      case FormObjectType.HelpButton:
        showHelp();
        break;

      case FormObjectType.BackButton:
        prevQuestion();
        break;

      case FormObjectType.NextButton:
        // send question
        const formData = new FormData();
        const isSpeaking =
          activeQuestion?.questionType === QuestionKind.Speaking;
        if (isSpeaking) {
          formData.append(
            "file",
            currentAnswer.answer as Blob,
            "recording.webm"
          );
        } else {
          const questionType =
            activeQuestion!.questionType === QuestionKind.Writing_Lecture ||
            activeQuestion!.questionType ===
              QuestionKind.Writing_Lecture_WithAudio
              ? 0
              : 1;
          formData.append("Type", String(questionType));
          formData.append("Answer", String(currentAnswer?.answer || "0")); // send "0" for description section, miss saeid confirmed to send 0
        }

        formData.append("QuestionId", String(activeQuestion!.questionId));
        formData.append(
          "SectionReminigTime",
          String(convertSecondsToTime(sectionTimeLeft))
        );
        formData.append(
          "ExamReminigTime",
          String(convertSecondsToTime(examTimeLeft))
        );

        mutate(
          {
            url: isSpeaking ? "Assessment/SpeakingAnswer" : "Assessment/Answer",
            method: "POST",
            data: formData,

            headers: {
              Accept: "multipart/form-data",
            },
          },
          {
            onSuccess: () => {
              nextQuestion();
            },
            onError: (err) => {
              toast.error(err.message ?? "خطا در برقراری ارتباط با سرور");
            },
          }
        );
        break;

      case FormObjectType.ContinueButton:
        console.log("continue");
        continueAction();
        break;

      case FormObjectType.OkButton:
        submitAction();
        break;
      case FormObjectType.MarkButton:
        toggleMarkQuestion();
        break;
      case FormObjectType.TimerLabel:
        showTimer();
        break;
      case FormObjectType.TimerHideButton:
        hideTimer();
        break;

      default:
        console.warn("No action defined for this FormObjectType:", type);
        break;
    }
  };

  const open = Boolean(showActionDialog);
  const id = open ? "simple-volume-controller" : undefined;

  return (
    <>
      {showActionDialog && showActionDialog.type === "review" && (
        <ReviewQuestions
          anchorEl={showActionDialog.anchorEl}
          type={showActionDialog.type}
          handleClose={() => setShowActionDialog(null)}
        />
      )}
      <Popover
        id={id}
        open={open && showActionDialog?.type === "sound"}
        anchorEl={showActionDialog?.anchorEl}
        onClose={() => setShowActionDialog(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            p: 1,
            height: "220px",
            width: "130px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2" gutterBottom>
            کنترل صدا
          </Typography>

          <Slider
            orientation="vertical"
            value={volume * 100}
            onChange={(_, newValue) => setVolume((newValue as number) / 100)}
            aria-labelledby="volume-slider"
            min={0}
            max={100}
            valueLabelDisplay="on"
            sx={{ height: 180 }}
          />
        </Box>
      </Popover>
      <div className="flex items-center gap-2">
        {formObject?.map((formObject) =>
          formObject.state === FormObjectState.NoDisplay ? null : (
            <Button
              key={`${formObject.state}-${formObject.formObjectType}`}
              variant={
                formObject.formObjectType !== FormObjectType.MarkButton
                  ? "contained"
                  : currentAnswer.isMarked
                  ? "outlined"
                  : "contained"
              }
              color={
                formObject.formObjectType !== FormObjectType.MarkButton
                  ? "secondary"
                  : currentAnswer.isMarked
                  ? "warning"
                  : "secondary"
              }
              loading={isPending}
              disabled={
                currentAnswer?.isSubmited
                  ? false
                  : formObject.state === FormObjectState.Deactive
              }
              onClick={(e) => {
                handleClick(e, formObject.formObjectType);
              }}
            >
              {formObject.label}
            </Button>
          )
        )}
      </div>
    </>
  );
};

export default ExamButtons;

export type LayoutActionDialog = {
  type: "review" | "sound";
  anchorEl: HTMLButtonElement;
};

import { useAudioStore } from "@/hooks/useAudioStore";
import { useExamStore } from "@/hooks/useExamStore";
import { FormObjectState, FormObjectType } from "@/types/formObject";
import { Box, Button, Popover, Slider, Typography } from "@mui/material";
import React, { useState } from "react";

const ExamButtons = () => {
  const {
    activeQuestion,
    reviewQuestions,
    showHelp,
    prevQuestion,
    nextQuestion,
    continueAction,
    submitAction,
    getQuestionAnswer,
  } = useExamStore();

  const { volume, setVolume } = useAudioStore();
  const [volumeAnchorEl, setVolumeAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  const currentAnswer = getQuestionAnswer(activeQuestion?.questionId || "");
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: FormObjectType
  ) => {
    switch (type) {
      case FormObjectType.Review:
      case FormObjectType.ReviewTextButton:
      case FormObjectType.ReviewQuestionButton:
        reviewQuestions();
        break;

      case FormObjectType.VolumeButton:
      case FormObjectType.VolumeControl:
        setVolumeAnchorEl(event.currentTarget);
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

  const open = Boolean(volumeAnchorEl);
  const id = open ? "simple-volume-controller" : undefined;

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={volumeAnchorEl}
        onClose={() => setVolumeAnchorEl(null)}
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

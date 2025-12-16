import { Box, IconButton, Popover, Slider, Typography } from "@mui/material";
import React from "react";
import { LayoutActionDialog } from "./ExamButtons";
import { useExamStore } from "@/hooks/useExamStore";
import { grey } from "@mui/material/colors";

type Props = {
  handleClose: () => void;
} & LayoutActionDialog;

const ReviewQuestions = ({ anchorEl, handleClose, type }: Props) => {
  const { activeSection, answers, activeQuestion, goToQuestion } =
    useExamStore();
  const open = Boolean(anchorEl) && type === "review";
  const id = open ? "review-popover" : undefined;
  if (!open) return null;
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={() => handleClose()}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Box
        sx={{
          p: 1,
          minHeight: "100px",
          width: "300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Typography variant="body2" gutterBottom>
          مرور سوالات
        </Typography>

        <Box className="grid grid-cols-3 gap-2">
          {activeSection?.questions.map((question, index) => {
            const isCurrentQuestion =
              question.questionId === activeQuestion?.questionId;
            const isAnswered = Boolean(
              answers.find(
                (answer) => answer.questionId === question.questionId
              )
            );
            const isMarked = Boolean(
              answers.find(
                (answer) => answer.questionId === question.questionId
              )?.isMarked
            );
            const color = isCurrentQuestion
              ? "info"
              : isMarked
              ? "warning"
              : isAnswered
              ? "primary"
              : "error";
            return (
              <Box
                key={question.questionId}
                className="
                    flex items-center justify-center
                    w-10 h-10
                    rounded-full
                    text-sm font-medium
                    transition
                  "
                sx={{
                  border: (t) => `1px solid ${t.palette[color].main}`,
                  color: (t) =>
                    !isAnswered ? grey[900] : t.palette.common.white,
                  bgcolor: (t) =>
                    !isAnswered ? grey[300] : t.palette[color].main,
                  cursor: "pointer",
                }}
                onClick={() => {
                  goToQuestion(question.questionId);
                  handleClose();
                }}
              >
                {index + 1}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Popover>
  );
};

export default ReviewQuestions;

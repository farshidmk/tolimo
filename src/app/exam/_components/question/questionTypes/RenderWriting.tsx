import { useExamStore } from "@/hooks/useExamStore";
import { QuestionAnswer } from "@/types/answer";
import { TextField } from "@mui/material";
import React from "react";

const RenderWriting = () => {
  const { getQuestionAnswer, answerQuestion, activeQuestion } = useExamStore();
  const currentAnswer = (getQuestionAnswer(
    activeQuestion?.questionId || ""
  ) ?? {
    answer: "",
    isMarked: false,
    isSubmited: false,
    questionId: activeQuestion?.questionId,
  }) as QuestionAnswer;

  return (
    <TextField
      sx={{ mt: 2 }}
      fullWidth
      rows={10}
      multiline
      label={"جواب خود را اینجا بنویسید"}
      value={currentAnswer.answer}
      onChange={(e) => {
        answerQuestion(e.target.value);
      }}
    />
  );
};

export default RenderWriting;

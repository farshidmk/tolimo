import { useExamStore } from "@/hooks/useExamStore";
import { AnswerSelectionMode, ChoiceList } from "@/types/choice";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";

type Props = {
  choiceList: ChoiceList;
};

const RenderChoiceList = ({ choiceList }: Props) => {
  const { getQuestionAnswer, answerQuestion, activeQuestion } = useExamStore();
  const currentAnswer = getQuestionAnswer(activeQuestion?.questionId || "");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedChoiceId = event.target.value;
    answerQuestion(selectedChoiceId);
  };
  if (choiceList.choiceMode === AnswerSelectionMode.SingleChoice) {
    return (
      <FormControl
        component="fieldset"
        key={activeQuestion?.questionId ?? "choice list question"}
      >
        <RadioGroup value={currentAnswer?.answer} onChange={handleChange}>
          {choiceList.choices
            .sort((a, b) => a.order - b.order)
            .map((choice) => {
              return (
                <FormControlLabel
                  key={choice.id}
                  value={choice.id}
                  control={<Radio />}
                  label={choice.text}
                />
              );
            })}
        </RadioGroup>
      </FormControl>
    );
  }
};

export default RenderChoiceList;

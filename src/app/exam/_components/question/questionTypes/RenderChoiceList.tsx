import { AnswerSelectionMode, ChoiceList } from "@/types/choice";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";

type Props = {
  choiceList: ChoiceList;
};

const RenderChoiceList = ({ choiceList }: Props) => {
  if (choiceList.choiceMode === AnswerSelectionMode.SingleChoice) {
    return (
      <FormControl>
        <RadioGroup>
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

import { useExamStore } from "@/hooks/useExamStore";
import { QuestionAnswer } from "@/types/answer";
import { ChoiceList } from "@/types/choice";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

type Props = {
  choiceList: ChoiceList;
};

const RenderCheckboxes = ({ choiceList }: Props) => {
  const { getQuestionAnswer, answerQuestion, activeQuestion } = useExamStore();
  const currentAnswer = (getQuestionAnswer(
    activeQuestion?.questionId || ""
  ) ?? {
    answer: [],
    isMarked: false,
    isSubmited: false,
    questionId: activeQuestion?.questionId,
  }) as QuestionAnswer;

  return (
    <>
      <FormGroup>
        {choiceList.choices
          .sort((a, b) => a.order - b.order)
          .map((choice) => {
            const isChecked = (
              (currentAnswer?.answer ?? []) as Array<string>
            ).includes(String(choice.id));
            return (
              <FormControlLabel
                key={choice.id}
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={() => {
                      let tempAnswer = [
                        ...((currentAnswer?.answer ?? []) as string[]),
                      ];
                      if (isChecked) {
                        tempAnswer = (
                          (currentAnswer?.answer ?? []) as string[]
                        ).filter((answer) => answer !== String(choice.id));
                      } else {
                        tempAnswer.push(String(choice.id));
                      }
                      answerQuestion(tempAnswer);
                    }}
                    name={choice.text}
                  />
                }
                label={choice.text}
              />
            );
          })}
      </FormGroup>
    </>
  );
};

export default RenderCheckboxes;

import { useExamStore } from "@/hooks/useExamStore";
import { ServerCall, ServerResponse } from "@/types/server";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

const useViewQuestion = () => {
  const { activeQuestion, examTimeLeft, sectionTimeLeft } = useExamStore();
  const { mutate } = useMutation<
    ServerResponse<boolean>,
    Error,
    ServerCall<AssessmentView>
  >({});
  useEffect(() => {
    if (activeQuestion && activeQuestion?.questionId) {
      mutate({
        method: "post",
        url: "Assessment/View",
        data: {
          questionId: activeQuestion.questionId,
          sectionReminigTime: String(sectionTimeLeft),
          examReminigTime: String(examTimeLeft),
        },
      });
    }
  }, [activeQuestion?.questionId]);
};

export default useViewQuestion;

export type AssessmentView = {
  questionId: string;
  sectionReminigTime: string;
  examReminigTime: string;
};

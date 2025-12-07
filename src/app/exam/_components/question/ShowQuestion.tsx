"use client";

import { useExamStore } from "@/hooks/useExamStore";
import RenderQuestionByType from "./questionTypes/RenderQuestionByType";
import { useMutation } from "@tanstack/react-query";
import { ServerCall, ServerResponse } from "@/types/server";
import { useEffect } from "react";
import { convertSecondsToTime } from "@/services/timeConvertor";

const ShowQuestion = () => {
  const { activeQuestion, sectionTimeLeft, examTimeLeft } = useExamStore();
  const { mutate } = useMutation<
    ServerResponse<boolean>,
    Error,
    ServerCall<ViewQuestionRequest>
  >({});

  useEffect(() => {
    mutate({
      method: "post",
      url: "Assessment/View",
      data: {
        examReminigTime: convertSecondsToTime(examTimeLeft),
        questionId: activeQuestion?.questionId ?? "",
        sectionReminigTime: convertSecondsToTime(sectionTimeLeft),
      },
    });
  }, [activeQuestion?.questionId]);

  return (
    <>
      <RenderQuestionByType />
    </>
  );
};

export default ShowQuestion;

type ViewQuestionRequest = {
  questionId: string;
  sectionReminigTime: string;
  examReminigTime: string;
};

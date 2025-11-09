"use client";

import { useExamStore } from "@/hooks/useExamStore";
import React from "react";

const ShowQuestion = () => {
  const { activeQuestion } = useExamStore();

  return <div>{activeQuestion?.passages.map((passage) => passage.text)}</div>;
};

export default ShowQuestion;

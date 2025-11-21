import { useExamStore } from "@/hooks/useExamStore";
import React from "react";

/**
 *
 * for question type => Listening_Lecture
 */
const ListeningLecture = () => {
  const { activeQuestion } = useExamStore();
  return <div>ListeningLecture</div>;
};

export default ListeningLecture;

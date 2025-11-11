import { useExamStore } from "@/hooks/useExamStore";
import { useEffect } from "react";

const useStartQuestionTimes = () => {
  const {
    activeQuestion,
    startExamTimer,
    stopExamTimer,
    stopActiveSectionTimer,
    startActiveSectionTimer,
    autoNextQuestionAfter,
  } = useExamStore();
  useEffect(() => {
    if (activeQuestion?.stopSectionTimer) {
      stopExamTimer();
      stopActiveSectionTimer();
    } else {
      startExamTimer();
      startActiveSectionTimer();
    }
    if (activeQuestion?.nextAfterSeconds) {
      autoNextQuestionAfter(activeQuestion.nextAfterSeconds);
    }
  }, [activeQuestion?.stopSectionTimer, activeQuestion?.questionId]);
};

export default useStartQuestionTimes;

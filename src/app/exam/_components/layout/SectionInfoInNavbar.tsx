"use client";
import { useExamStore } from "@/hooks/useExamStore";
import { convertSecondsToTime } from "@/services/timeConvertor";
import { QuestionKind } from "@/types/question";
import { Typography } from "@mui/material";

const SectionInfoInNavbar = () => {
  const { activeSection, activeQuestion, sectionTimeLeft } = useExamStore();
  /**
   * count only question that is really question - not in direction or ... kind
   */
  const realQuestions =
    activeSection?.questions.filter(
      (question) =>
        question.questionType !== QuestionKind.SectionDirection &&
        question.questionType !== QuestionKind.ViewOnlyPassage &&
        question.questionType !== QuestionKind.Listening_Lecture &&
        question.questionType !== QuestionKind.Listening_Fragment
    ) ?? [];
  const currentQuestionIndex =
    realQuestions.findIndex(
      (question) => question.questionId === activeQuestion?.questionId
    ) ?? 0;

  const isRealQuestion = Boolean(
    realQuestions.find((rq) => rq.questionId === activeQuestion?.questionId)
  );
  return (
    <div className="flex gap-2 items-center justify-center w-full">
      <Typography variant="h6" sx={{ color: "white" }}>
        بخش: {activeSection?.title}
      </Typography>
      <div className="bg-blue-100 py-2 px-4 rounded-xl flex items-center gap-2">
        <Typography variant="body2">
          زمان: {convertSecondsToTime(sectionTimeLeft ?? 0)}
        </Typography>
      </div>
      <div className="text-white">
        {isRealQuestion && (
          <Typography variant="body1" fontWeight={600}>
            سوال
            <span className="mx-1">
              {(currentQuestionIndex + 1).toLocaleString("fa")}
            </span>
            از
            <span className="mx-1">
              {realQuestions.length?.toLocaleString("fa")}
            </span>
          </Typography>
        )}
      </div>
    </div>
  );
};

export default SectionInfoInNavbar;

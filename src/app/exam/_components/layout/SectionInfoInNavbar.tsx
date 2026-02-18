"use client";
import { useExamStore } from "@/hooks/useExamStore";
import { convertSecondsToTime } from "@/services/timeConvertor";
import { QuestionKind } from "@/types/question";
import { Typography } from "@mui/material";

const SectionInfoInNavbar = () => {
  const { activeSection, activeQuestion, sectionTimeLeft, isTimerVisible } =
    useExamStore();

  // Count only real questions (exclude section directions and media-only blocks)
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
      <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
        بخش: {activeSection?.title}
      </Typography>

      <div
        className={`bg-white/15 border border-white/30 py-2 px-4 rounded-xl flex items-center gap-2 transition-opacity ${
          isTimerVisible ? "" : "opacity-0"
        }`}
      >
        <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
          زمان: {convertSecondsToTime(sectionTimeLeft ?? 0)}
        </Typography>
      </div>

      <div className="text-white">
        {isRealQuestion && (
          <Typography variant="body1" fontWeight={700}>
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

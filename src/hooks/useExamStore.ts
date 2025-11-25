"use client";
import { convertTimeToSeconds } from "@/services/timeConvertor";
import { Exam, ExamSection, SectionQuestion } from "@/types/exam";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ExamState {
  examInfo: Omit<Exam, "sections"> | null;
  examTimeLeft: number;
  sectionTimeLeft: number;
  sections: ExamSection[];
  activeSectionId: string | null;
  activeSection: ExamSection | null;
  activeQuestion: SectionQuestion | null;
  intervals: {
    exam?: NodeJS.Timeout;
    sections: Record<string, NodeJS.Timeout | undefined>;
    autoNext?: NodeJS.Timeout;
  };

  /** ⏳ Remaining seconds before moving to the next question */
  questionAutoNextTimeLeft: number | null;

  // Actions
  initializeExam: (exam: Exam) => void;
  startExamTimer: () => void;
  stopExamTimer: () => void;
  startActiveSectionTimer: () => void;
  stopActiveSectionTimer: () => void;
  updateAnsweredCount: (sectionId: string, value: number) => void;
  pauseDuringRequest: () => Promise<void>;
  endOfSection: () => void;

  // Question Actions
  reviewQuestions: () => void;
  soundControl: () => void;
  showHelp: () => void;
  prevQuestion: () => void;
  nextQuestion: () => void;
  continueAction: () => void;
  submitAction: () => void;
  /** ⏱️ Starts a countdown and automatically goes to next question */
  autoNextQuestionAfter: (seconds: number) => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      examInfo: null,
      examTimeLeft: 0,
      sectionTimeLeft: 0,
      sections: [],
      activeSectionId: null,
      activeQuestion: null,
      intervals: { sections: {} },
      activeSection: null,
      questionAutoNextTimeLeft: null,

      initializeExam: (exam) => {
        const { sections, ...examInfo } = exam;
        const sortedSections = sections
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((section) => ({
            ...section,
            questions: section.questions
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((q) => ({
                ...q,
                passages: q.passages.sort(
                  (a, b) => a.displayOrder - b.displayOrder
                ),
              })),
            answeredCount: 0,
            isRunning: false,
            timeLeft: convertTimeToSeconds(section.sectionDuration),
          }));

        set({
          examInfo,
          sections: sortedSections,
          examTimeLeft: convertTimeToSeconds(exam.defaultDuration),
          intervals: { sections: {} },
          activeSectionId: sortedSections[0]?.sectionId ?? null,
          activeSection: sortedSections[0] ?? null,
          activeQuestion: sortedSections[0]?.questions[0] ?? null,
        });
      },

      startExamTimer: () => {
        const { intervals } = get();
        if (intervals.exam) return;

        const examInterval = setInterval(() => {
          set((state) => ({
            examTimeLeft: Math.max(state.examTimeLeft - 1, 0),
          }));
        }, 1000);

        set((state) => ({
          intervals: { ...state.intervals, exam: examInterval },
        }));
      },

      stopExamTimer: () => {
        const { intervals } = get();
        if (intervals.exam) {
          clearInterval(intervals.exam);
          set((state) => ({
            intervals: { ...state.intervals, exam: undefined },
          }));
        }
      },

      startActiveSectionTimer: () => {
        const { activeSectionId, intervals } = get();
        if (!activeSectionId) return;
        if (intervals.sections[activeSectionId]) return;

        const sectionInterval = setInterval(() => {
          set((state) => {
            const updatedSections = state.sections.map((s) =>
              s.sectionId === activeSectionId
                ? { ...s, timeLeft: Math.max(s.timeLeft - 1, 0) }
                : s
            );

            const active = updatedSections.find(
              (s) => s.sectionId === activeSectionId
            );
            if (active && active.timeLeft <= 0) {
              clearInterval(sectionInterval);
            }

            return { sections: updatedSections };
          });
        }, 1000);

        set((state) => ({
          intervals: {
            ...state.intervals,
            sections: {
              ...state.intervals.sections,
              [activeSectionId]: sectionInterval,
            },
          },
          sections: state.sections.map((s) =>
            s.sectionId === activeSectionId ? { ...s, isRunning: true } : s
          ),
        }));
      },

      stopActiveSectionTimer: () => {
        const { activeSectionId, intervals } = get();
        if (!activeSectionId) return;

        const current = intervals.sections[activeSectionId];
        if (current) {
          clearInterval(current);
          set((state) => ({
            intervals: {
              ...state.intervals,
              sections: {
                ...state.intervals.sections,
                [activeSectionId]: undefined,
              },
            },
            sections: state.sections.map((s) =>
              s.sectionId === activeSectionId ? { ...s, isRunning: false } : s
            ),
          }));
        }
      },

      updateAnsweredCount: (sectionId, value) => {
        set((state) => ({
          sections: state.sections.map((s) =>
            s.sectionId === sectionId ? { ...s, answeredCount: value } : s
          ),
        }));
      },

      pauseDuringRequest: async () => {
        const { stopActiveSectionTimer, startActiveSectionTimer } = get();

        stopActiveSectionTimer();
        try {
          // Simulate backend request delay
          await new Promise((res) => setTimeout(res, 1500));
        } finally {
          startActiveSectionTimer();
        }
      },

      endOfSection: () => {
        const { sections, activeSectionId } = get();
        if (!activeSectionId) return;

        const currentIndex = sections.findIndex(
          (s) => s.sectionId === activeSectionId
        );
        const nextSection = sections[currentIndex + 1];

        set({
          activeSectionId: nextSection?.sectionId ?? null,
          activeSection: nextSection ?? null,
          activeQuestion: nextSection?.questions[0] ?? null,
        });
      },

      /**
       * Opens a review mode where all questions can be reviewed before submission.
       */
      reviewQuestions: () => {
        console.log("Reviewing questions...");
        // Could set a flag like isReviewMode = true if needed
      },

      /**
       * Toggles the exam sound (e.g., play/pause audio or mute/unmute).
       */
      soundControl: () => {
        console.log("Toggling sound...");
        // Could integrate with an audio controller in the UI
      },

      /**
       * Displays help/instructions related to the current section or question.
       */
      showHelp: () => {
        console.log("Showing help information...");
      },

      /**
       * Navigates to the previous question in the active section.
       */
      prevQuestion: () => {
        const { activeSection, activeQuestion } = get();
        if (!activeSection || !activeQuestion) return;

        const index = activeSection.questions.findIndex(
          (q) => q.questionId === activeQuestion.questionId
        );
        const prev = activeSection.questions[index - 1] ?? activeQuestion;
        set({ activeQuestion: prev });
      },

      nextQuestion: () => {
        const { activeSection, activeQuestion } = get();
        if (!activeSection || !activeQuestion) return;

        const index = activeSection.questions.findIndex(
          (q) => q.questionId === activeQuestion.questionId
        );
        // check if next question exists - if not go to next section
        // go to next section
        if (index + 1 === activeSection.questions.length) {
          get().endOfSection();
        } else {
          const next = activeSection.questions[index + 1] ?? activeQuestion;
          set({ activeQuestion: next });
        }
      },

      /**
       * Continues the exam after a pause or section transition.
       */
      continueAction: () => {
        get().nextQuestion();
        get().startActiveSectionTimer();
      },

      /**
       * Submits the exam to the backend for evaluation.
       */
      submitAction: () => {
        console.log("Submitting exam...");
        get().stopExamTimer();
      },

      /** 🔹 Automatically goes to next question after N seconds */
      autoNextQuestionAfter: (seconds) => {
        const { intervals, nextQuestion } = get();

        // Clear previous auto-next timer if exists
        if (intervals.autoNext) clearInterval(intervals.autoNext);

        set({ questionAutoNextTimeLeft: seconds });

        const interval = setInterval(() => {
          set((state) => {
            if (
              state.questionAutoNextTimeLeft &&
              state.questionAutoNextTimeLeft > 1
            ) {
              return {
                questionAutoNextTimeLeft: state.questionAutoNextTimeLeft - 1,
              };
            } else {
              clearInterval(interval);
              nextQuestion();
              return { questionAutoNextTimeLeft: null };
            }
          });
        }, 1000);

        set((state) => ({
          intervals: { ...state.intervals, autoNext: interval },
        }));
      },
    }),
    {
      name: "exam-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

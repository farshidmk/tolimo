"use client";
import { convertStringTimeToSeconds } from "@/services/timeConvertor";
import { QuestionAnswer } from "@/types/answer";
import { Exam, ExamSection, SectionQuestion } from "@/types/exam";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ExamState {
  // Core State
  examInfo: Omit<Exam, "sections"> | null;
  examTimeLeft: number;
  sectionTimeLeft: number;
  sections: ExamSection[];
  activeSectionId: string | null;
  activeSection: ExamSection | null;
  activeQuestion: SectionQuestion | null;
  questionAutoNextTimeLeft: number | null;

  // Answers (only for active section)
  answers: QuestionAnswer[];

  // Timer References (not persisted)
  intervals: {
    exam?: NodeJS.Timeout;
    sections: Record<string, NodeJS.Timeout | undefined>;
    autoNext?: NodeJS.Timeout;
  };

  // Initialization
  initializeExam: (exam: Exam) => void;

  // Timer Controls
  startExamTimer: () => void;
  stopExamTimer: () => void;
  startActiveSectionTimer: () => void;
  stopActiveSectionTimer: () => void;

  // Navigation
  prevQuestion: () => void;
  nextQuestion: () => void;
  endOfSection: () => void;
  goToQuestion: (questionId: string) => void;

  // Actions
  updateAnsweredCount: (sectionId: string, value: number) => void;
  pauseDuringRequest: () => Promise<void>;
  continueAction: () => void;
  submitAction: () => void;
  reviewQuestions: () => void;
  soundControl: () => void;
  showHelp: () => void;
  autoNextQuestionAfter: (seconds: number) => void;

  // Answer Management
  answerQuestion: (answer: QuestionAnswer["answer"]) => void;
  toggleMarkQuestion: (questionId?: string) => void;
  getQuestionAnswer: (questionId: string) => QuestionAnswer | undefined;
  clearActiveSectionAnswers: () => void;

  // Cleanup
  clearAllTimers: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      // ==================== Initial State ====================
      examInfo: null,
      examTimeLeft: 0,
      sectionTimeLeft: 0,
      sections: [],
      activeSectionId: null,
      activeSection: null,
      activeQuestion: null,
      questionAutoNextTimeLeft: null,
      intervals: { sections: {} },
      answers: [],
      // ==================== Initialization ====================
      initializeExam: (exam) => {
        // Clear any existing timers first
        get().clearAllTimers();

        const { sections, ...examInfo } = exam;

        // Sort and prepare sections with questions
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
            timeLeft: convertStringTimeToSeconds(section.sectionDuration),
          }));

        const firstSection = sortedSections[0];
        const examTime = convertStringTimeToSeconds(exam.defaultDuration);

        set({
          examInfo,
          sections: sortedSections,
          examTimeLeft: examTime,
          sectionTimeLeft: firstSection?.timeLeft ?? 0,
          intervals: { sections: {} },
          activeSectionId: firstSection?.sectionId ?? null,
          activeSection: firstSection ?? null,
          activeQuestion: firstSection?.questions[0] ?? null,
          questionAutoNextTimeLeft: null,
        });

        console.log("Exam initialized:", {
          examTime,
          sectionTime: firstSection?.timeLeft,
          totalSections: sortedSections.length,
        });
      },

      // ==================== Exam Timer ====================
      startExamTimer: () => {
        const { intervals, examTimeLeft } = get();

        // Don't start if already running
        if (intervals.exam) {
          console.log("Exam timer already running");
          return;
        }

        // Don't start if time is already 0
        if (examTimeLeft <= 0) {
          console.log("Exam time is already 0");
          return;
        }

        console.log("Starting exam timer with", examTimeLeft, "seconds");

        const examInterval = setInterval(() => {
          set((state) => {
            const newTime = Math.max(state.examTimeLeft - 1, 0);

            // Auto-submit when exam time runs out
            if (newTime === 0) {
              console.log("Exam time ended!");
              clearInterval(examInterval);
              // Trigger submit action
              setTimeout(() => get().submitAction(), 100);

              return {
                examTimeLeft: 0,
                intervals: { ...state.intervals, exam: undefined },
              };
            }

            return { examTimeLeft: newTime };
          });
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
          console.log("Exam timer stopped");
        }
      },

      // ==================== Section Timer ====================
      startActiveSectionTimer: () => {
        const { activeSectionId, intervals, sections } = get();

        if (!activeSectionId) {
          console.log("No active section to start timer");
          return;
        }

        // Prevent duplicate intervals
        if (intervals.sections[activeSectionId]) {
          console.log("Section timer already running for", activeSectionId);
          return;
        }

        const activeSection = sections.find(
          (s) => s.sectionId === activeSectionId
        );
        if (!activeSection) {
          console.log("Active section not found");
          return;
        }

        // Don't start if time is already 0
        if (activeSection.timeLeft <= 0) {
          console.log("Section time is already 0");
          return;
        }

        console.log(
          "Starting section timer with",
          activeSection.timeLeft,
          "seconds"
        );

        // Create interval
        const sectionInterval = setInterval(() => {
          set((state) => {
            const updatedSections = state.sections.map((s) =>
              s.sectionId === activeSectionId
                ? { ...s, timeLeft: Math.max(s.timeLeft - 1, 0) }
                : s
            );

            const currentSection = updatedSections.find(
              (s) => s.sectionId === activeSectionId
            );

            // Auto-move to next section when time reaches zero
            if (currentSection && currentSection.timeLeft === 0) {
              console.log("Section time ended!");
              clearInterval(sectionInterval);

              // Move to next section after a brief delay
              setTimeout(() => get().endOfSection(), 100);

              return {
                intervals: {
                  ...state.intervals,
                  sections: {
                    ...state.intervals.sections,
                    [activeSectionId]: undefined,
                  },
                },
                sections: updatedSections,
                sectionTimeLeft: 0,
                activeSection: {
                  ...currentSection,
                  timeLeft: 0,
                  isRunning: false,
                },
              };
            }

            return {
              sections: updatedSections,
              sectionTimeLeft:
                currentSection?.timeLeft ?? state.sectionTimeLeft,
              activeSection: currentSection
                ? { ...currentSection, isRunning: true }
                : state.activeSection,
            };
          });
        }, 1000);

        // Save interval reference + mark running
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
          console.log("Section timer stopped");
        }
      },

      // ==================== Navigation ====================
      prevQuestion: () => {
        const { activeSection, activeQuestion } = get();
        if (!activeSection || !activeQuestion) return;

        const index = activeSection.questions.findIndex(
          (q) => q.questionId === activeQuestion.questionId
        );

        if (index > 0) {
          const prev = activeSection.questions[index - 1];
          set({ activeQuestion: prev });
          console.log("Moved to previous question:", prev.questionId);
        }
      },

      nextQuestion: () => {
        const { activeSection, activeQuestion, intervals } = get();
        if (!activeSection || !activeQuestion) return;

        // Clear auto-next timer if exists
        if (intervals.autoNext) {
          clearInterval(intervals.autoNext);
          set((state) => ({
            intervals: { ...state.intervals, autoNext: undefined },
            questionAutoNextTimeLeft: null,
          }));
        }

        const index = activeSection.questions.findIndex(
          (q) => q.questionId === activeQuestion.questionId
        );

        // Check if this is the last question in the section
        if (index + 1 === activeSection.questions.length) {
          console.log("Last question reached, moving to next section");
          get().endOfSection();
        } else {
          const next = activeSection.questions[index + 1];
          set({ activeQuestion: next });
          console.log("Moved to next question:", next.questionId);
        }
      },
      goToQuestion: (questionId: string) => {
        const { activeSection } = get();
        if (!activeSection) return;

        const index = activeSection.questions.findIndex(
          (q) => q.questionId === questionId
        );
        const next = activeSection.questions[index];

        set({ activeQuestion: next });
        console.log("Moved to question:", next.questionId);
      },

      endOfSection: () => {
        const { sections, activeSectionId } = get();

        if (!activeSectionId) return;

        // Stop current section timer
        get().stopActiveSectionTimer();

        const currentIndex = sections.findIndex(
          (s) => s.sectionId === activeSectionId
        );
        const nextSection = sections[currentIndex + 1];

        if (nextSection) {
          console.log("Moving to next section:", nextSection.sectionId);

          // Clear answers from previous section (only keep active section answers)
          get().clearActiveSectionAnswers();

          set({
            activeSectionId: nextSection.sectionId,
            activeSection: nextSection,
            activeQuestion: nextSection.questions[0] ?? null,
            sectionTimeLeft: nextSection.timeLeft,
            answers: [], // Clear answers when moving to new section
          });

          // Start next section timer
          setTimeout(() => get().startActiveSectionTimer(), 100);
        } else {
          console.log("No more sections, ending exam");
          set({
            activeSectionId: null,
            activeSection: null,
            activeQuestion: null,
            sectionTimeLeft: 0,
          });

          // Auto-submit exam
          setTimeout(() => get().submitAction(), 100);
        }
      },

      // ==================== Actions ====================
      updateAnsweredCount: (sectionId, value) => {
        set((state) => ({
          sections: state.sections.map((s) =>
            s.sectionId === sectionId ? { ...s, answeredCount: value } : s
          ),
        }));
      },

      pauseDuringRequest: async () => {
        const {
          stopActiveSectionTimer,
          stopExamTimer,
          startActiveSectionTimer,
          startExamTimer,
        } = get();

        // Pause all timers
        stopActiveSectionTimer();
        stopExamTimer();

        try {
          // Simulate backend request delay
          await new Promise((res) => setTimeout(res, 1500));
        } finally {
          // Resume timers
          startExamTimer();
          startActiveSectionTimer();
        }
      },

      continueAction: () => {
        console.log("Continue action triggered");
        get().nextQuestion();
        get().startActiveSectionTimer();
      },

      // ==================== Answer Management ====================
      answerQuestion(answer) {
        const { activeQuestion, activeSection, answers } = get();

        if (!activeQuestion || !activeSection) {
          console.warn("No active question or section");
          return;
        }

        // Check if section allows answer storage
        // If isForcedToAnswer is true, we don't store the answers
        // if (activeSection.isForcedToAnswer) {
        //   console.log(
        //     "Section has isForcedToAnswer=true, not storing answer locally"
        //   );
        //   return;
        // }

        const questionId = activeQuestion.questionId;
        const existingAnswerIndex = answers.findIndex(
          (a) => a.questionId === questionId
        );

        if (existingAnswerIndex !== -1) {
          // Update existing answer
          const updatedAnswers = [...answers];
          updatedAnswers[existingAnswerIndex] = {
            ...updatedAnswers[existingAnswerIndex],
            answer,
          };
          set({ answers: updatedAnswers });
          console.log("Updated answer for question:", questionId);
        } else {
          // Add new answer
          const newAnswer: QuestionAnswer = {
            questionId,
            answer,
            isMarked: false,
            isSubmited: false,
          };
          set({ answers: [...answers, newAnswer] });
          console.log("Added new answer for question:", questionId);
        }

        //TODO: send request
        // - For speaking: call /Assessment/SpeakingAnswer
        // - For others: call /Assessment/Answer
      },

      toggleMarkQuestion(questionId) {
        const { activeQuestion, answers } = get();
        const targetQuestionId = questionId ?? activeQuestion?.questionId;

        if (!targetQuestionId) {
          console.warn("No question ID provided");
          return;
        }

        const existingAnswerIndex = answers.findIndex(
          (a) => a.questionId === targetQuestionId
        );

        if (existingAnswerIndex !== -1) {
          // Toggle existing answer's mark
          const updatedAnswers = [...answers];
          updatedAnswers[existingAnswerIndex] = {
            ...updatedAnswers[existingAnswerIndex],
            isMarked: !updatedAnswers[existingAnswerIndex].isMarked,
          };
          set({ answers: updatedAnswers });
          console.log(
            "Toggled mark for question:",
            targetQuestionId,
            updatedAnswers[existingAnswerIndex].isMarked
          );
        } else {
          // Create new answer entry with mark
          const newAnswer: QuestionAnswer = {
            questionId: targetQuestionId,
            answer: undefined,
            isMarked: true,
            isSubmited: false,
          };
          set({ answers: [...answers, newAnswer] });
          console.log("Created marked answer for question:", targetQuestionId);
        }
      },

      getQuestionAnswer(questionId) {
        const { answers } = get();
        return answers.find((a) => a.questionId === questionId);
      },

      clearActiveSectionAnswers() {
        set({ answers: [] });
        console.log("Cleared answers for section transition");
      },

      submitAction: () => {
        console.log("Submitting exam...");
        const { answers } = get();

        // Mark all answers as submitted
        const submittedAnswers = answers.map((answer) => ({
          ...answer,
          isSubmited: true,
        }));

        set({ answers: submittedAnswers });

        //TODO: Send all answers to backend
        // - Filter by question type (speaking vs others)
        // - Call appropriate endpoints
        console.log("Exam submitted with answers:", submittedAnswers);
      },

      reviewQuestions: () => {
        console.log("Reviewing questions...");
        // Could set a flag like isReviewMode = true if needed
        // Might want to pause timers during review
      },

      soundControl: () => {
        console.log("Toggling sound...");
        // Could integrate with an audio controller in the UI
      },

      showHelp: () => {
        console.log("Showing help information...");
      },

      // ==================== Auto-Next Question ====================
      autoNextQuestionAfter: (seconds) => {
        const { intervals } = get();

        // Clear previous auto-next timer if exists
        if (intervals.autoNext) {
          clearInterval(intervals.autoNext);
        }

        set({ questionAutoNextTimeLeft: seconds });
        console.log("Auto-next question in", seconds, "seconds");

        const interval = setInterval(() => {
          set((state) => {
            if (
              state.questionAutoNextTimeLeft !== null &&
              state.questionAutoNextTimeLeft > 1
            ) {
              return {
                questionAutoNextTimeLeft: state.questionAutoNextTimeLeft - 1,
              };
            } else {
              clearInterval(interval);
              get().nextQuestion();
              return {
                questionAutoNextTimeLeft: null,
                intervals: { ...state.intervals, autoNext: undefined },
              };
            }
          });
        }, 1000);

        set((state) => ({
          intervals: { ...state.intervals, autoNext: interval },
        }));
      },

      // ==================== Cleanup ====================
      clearAllTimers: () => {
        const { intervals } = get();

        // Clear exam timer
        if (intervals.exam) {
          clearInterval(intervals.exam);
        }

        // Clear all section timers
        Object.values(intervals.sections).forEach((timer) => {
          if (timer) clearInterval(timer);
        });

        // Clear auto-next timer
        if (intervals.autoNext) {
          clearInterval(intervals.autoNext);
        }

        set({
          intervals: { sections: {} },
          sections: get().sections.map((s) => ({ ...s, isRunning: false })),
        });

        console.log("All timers cleared");
      },
    }),
    {
      name: "exam-storage",
      storage: createJSONStorage(() => sessionStorage),
      // Don't persist intervals (they're runtime-only)
      partialize: (state) => ({
        examInfo: state.examInfo,
        examTimeLeft: state.examTimeLeft,
        sectionTimeLeft: state.sectionTimeLeft,
        sections: state.sections,
        activeSectionId: state.activeSectionId,
        activeSection: state.activeSection,
        activeQuestion: state.activeQuestion,
        questionAutoNextTimeLeft: state.questionAutoNextTimeLeft,
        answers: state.answers, // Persist answers for active section
      }),
    }
  )
);

"use client";
import { convertTimeToSeconds } from "@/services/timeConvertor";
import { Exam, ExamSection, SectionQuestion } from "@/types/exam";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ExamState {
  examInfo: Omit<Exam, "sections"> | null;
  examTimeLeft: number; // total exam time in seconds
  sectionTimeLeft: number; // total exam time in seconds
  sections: ExamSection[];
  activeSectionId: string | null;
  activeSection: ExamSection | null;
  activeQuestion: SectionQuestion | null;
  intervals: {
    exam?: NodeJS.Timeout;
    sections: Record<string, NodeJS.Timeout | undefined>;
  };

  // Actions
  initializeExam: (exam: Exam) => void;
  startExamTimer: () => void;
  stopExamTimer: () => void;
  startSectionTimer: (sectionId: string) => void;
  stopSectionTimer: (sectionId: string) => void;
  updateAnsweredCount: (sectionId: string, value: number) => void;
  pauseDuringRequest: (sectionId: string) => Promise<void>;
  endOfSection: (sectionId: string) => void;
}

export const useExamStore = create<ExamState, any>(
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

      initializeExam: (exam) => {
        // const totalTime = exam.sections.reduce((sum, s) => {
        //   const [hours, minutes, seconds] = s.sectionDuration
        //     .split(":")
        //     .map(Number);
        //   return sum + (hours * 3600 + minutes * 60 + seconds);
        // }, 0);

        const { sections, ...examWithoutSection } = exam;
        const sortedSections: ExamSection[] = exam.sections
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((section) => ({
            ...section,
            questions: [
              ...section.questions.map((question) => ({
                ...question,
                passages: [...question.passages].sort(
                  (a, b) => a.displayOrder - b.displayOrder
                ),
              })),
            ].sort((a, b) => a.displayOrder - b.displayOrder),
          }));
        set({
          examTimeLeft: convertTimeToSeconds(exam.defaultDuration),
          sections: sortedSections.map((s) => ({
            ...s,
            // timeLeft: s.sectionDuration.split(':').reduce((acc, time) => (60 * acc) + parseInt(time)), 0), // Convert duration to seconds
            answeredCount: 0,
            isRunning: false,
          })),
          intervals: { sections: {} },
          examInfo: examWithoutSection,
          activeSectionId: sortedSections?.[0].sectiontId ?? null,
          activeSection: sortedSections[0],
          activeQuestion: sortedSections[0].questions[0],
        });
      },

      startExamTimer: () => {
        const { intervals } = get();
        if (intervals.exam) return;

        const examInterval = setInterval(() => {
          set((state) => {
            const newTimeLeft = Math.max(state.examTimeLeft - 1, 0);
            return {
              examTimeLeft: newTimeLeft,
              sections: state.sections.map((section) => ({
                ...section,
                timeLeft: section.isRunning
                  ? Math.max(section.timeLeft - 1, 0)
                  : section.timeLeft,
              })),
            };
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
        }
      },

      startSectionTimer: (sectionId) => {
        const { intervals, sections } = get();
        const section = sections.find((s) => s.sectiontId === sectionId);
        if (!section || intervals.sections[sectionId]) return;

        const sectionInterval = setInterval(() => {
          set((state) => {
            const updatedSections = state.sections.map((s) =>
              s.sectiontId === sectionId
                ? { ...s, timeLeft: Math.max(s.timeLeft - 1, 0) }
                : s
            );

            // const isSectionRunning = updatedSections.find(s => s.sectiontId === sectionId)?.timeLeft > 0 ;
            const isSectionRunning = Boolean(
              updatedSections.find((s) => s.sectiontId === sectionId)?.timeLeft
            );

            return {
              sections: updatedSections,
              activeSectionId: isSectionRunning ? sectionId : null,
            };
          });
        }, 1000);

        set((state) => ({
          intervals: {
            ...state.intervals,
            sections: {
              ...state.intervals.sections,
              [sectionId]: sectionInterval,
            },
          },
          sections: state.sections.map((s) =>
            s.sectiontId === sectionId ? { ...s, isRunning: true } : s
          ),
        }));
      },

      stopSectionTimer: (sectionId) => {
        const { intervals } = get();
        const current = intervals.sections[sectionId];
        if (current) {
          clearInterval(current);
          set((state) => ({
            intervals: {
              ...state.intervals,
              sections: { ...state.intervals.sections, [sectionId]: undefined },
            },
            sections: state.sections.map((s) =>
              s.sectiontId === sectionId ? { ...s, isRunning: false } : s
            ),
          }));
        }
      },

      updateAnsweredCount: (sectionId, value) => {
        set((state) => ({
          sections: state.sections.map((s) =>
            s.sectiontId === sectionId ? { ...s, answeredCount: value } : s
          ),
        }));
      },

      // Pause section timer while waiting for backend confirmation
      pauseDuringRequest: async (sectionId) => {
        const { stopSectionTimer, startSectionTimer } = get();

        stopSectionTimer(sectionId);
        try {
          // Simulate backend request
          await new Promise((res) => setTimeout(res, 1500));
        } finally {
          startSectionTimer(sectionId);
        }
      },

      endOfSection(sectionId) {
        //TODO
      },
    }),
    {
      name: "exam-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

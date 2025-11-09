"use client"
import { Exam, ExamSection } from "@/types/exam";
import { create } from "zustand";



interface ExamState {
  examInfo: Omit<Exam, "sections"> | null
  examTimeLeft: number; // total exam time in seconds
  sections: ExamSection[];
  activeSectionId: string | null;
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
  resetExam: () => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
  examInfo: null,
  examTimeLeft: 0,
  sections: [],
  activeSectionId: null,
  intervals: { sections: {} },

  initializeExam: (exam) => {
      const totalTime = exam.sections.reduce((sum, s) => {
          const [hours, minutes, seconds] = s.sectionDuration.split(':').map(Number);
          return sum + (hours * 3600 + minutes * 60 + seconds);
      }, 0);


const {sections, ...examWithoutSection} = exam
      set({
          examTimeLeft: totalTime,
          sections: exam.sections.sort((a,b) => a.displayOrder - b.displayOrder).map((s) => ({
              ...s,
              // timeLeft: s.sectionDuration.split(':').reduce((acc, time) => (60 * acc) + parseInt(time)), 0), // Convert duration to seconds
              answeredCount: 0,
              isRunning: false,
          })),
          intervals: { sections: {} },
          examInfo: examWithoutSection
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
                  sections: state.sections.map(section => ({
                      ...section,
                      timeLeft: section.isRunning ? Math.max(section.timeLeft - 1, 0) : section.timeLeft,
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
      const section = sections.find(s => s.sectiontId === sectionId);
      if (!section || intervals.sections[sectionId]) return;

      const sectionInterval = setInterval(() => {
          set((state) => {
              const updatedSections = state.sections.map((s) =>
                  s.sectiontId === sectionId
                      ? { ...s, timeLeft: Math.max(s.timeLeft - 1, 0) }
                      : s
              );

              // const isSectionRunning = updatedSections.find(s => s.sectiontId === sectionId)?.timeLeft > 0 ;
              const isSectionRunning = Boolean(updatedSections.find(s => s.sectiontId === sectionId)?.timeLeft )

              return { sections: updatedSections, activeSectionId: isSectionRunning ? sectionId : null };
          });
      }, 1000);

      set((state) => ({
          intervals: {
              ...state.intervals,
              sections: { ...state.intervals.sections, [sectionId]: sectionInterval },
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

  resetExam: () => {
      const { intervals } = get();
      if (intervals.exam) clearInterval(intervals.exam);
      Object.values(intervals.sections).forEach((i) => i && clearInterval(i));
      set({
          examTimeLeft: 0,
          sections: [],
          activeSectionId: null,
          intervals: { sections: {} },
      });
  },
}));
import { create } from 'zustand';

interface ExamState {
  bnsrCode: string;
  isAuthenticated: boolean;
  answers: Record<string, string>;
  isSubmitting: boolean;
  isSuccess: boolean;
  setBnsrCode: (code: string) => void;
  authenticate: () => void;
  setAnswer: (questionId: string, answer: string) => void;
  setIsSubmitting: (status: boolean) => void;
  setSuccess: (status: boolean) => void;
  reset: () => void;
}

export const useExamStore = create<ExamState>((set) => ({
  bnsrCode: '',
  isAuthenticated: false,
  answers: {},
  isSubmitting: false,
  isSuccess: false,
  setBnsrCode: (code) => set({ bnsrCode: code }),
  authenticate: () => set({ isAuthenticated: true }),
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  setIsSubmitting: (status) => set({ isSubmitting: status }),
  setSuccess: (status) => set({ isSuccess: status }),
  reset: () =>
    set({
      bnsrCode: '',
      isAuthenticated: false,
      answers: {},
      isSubmitting: false,
      isSuccess: false,
    }),
}));

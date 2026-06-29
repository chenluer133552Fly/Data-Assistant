import { create } from 'zustand';
import type { Conversation, PipelineStep, QueryResult } from '../types/query';
import { mockPipelineSteps, mockQueryResult } from '../services/mockData';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isProcessing: boolean;
  elapsedTime: number;
  showClarification: boolean;
  showFeedback: boolean;

  submitQuery: (query: string) => void;
  newChat: () => void;
  togglePin: (id: string) => void;
  setShowClarification: (show: boolean) => void;
  setShowFeedback: (show: boolean) => void;
}

let stepTimer: ReturnType<typeof setInterval> | null = null;
let elapsedTimer: ReturnType<typeof setInterval> | null = null;

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  isProcessing: false,
  elapsedTime: 0,
  showClarification: false,
  showFeedback: false,

  submitQuery: (query: string) => {
    const id = Date.now().toString();
    const conversation: Conversation = {
      id,
      query,
      timestamp: new Date(),
      isPinned: false,
      status: 'processing',
      steps: [],
    };

    set((s) => ({
      conversations: [conversation, ...s.conversations],
      activeConversationId: id,
      isProcessing: true,
      elapsedTime: 0,
    }));

    if (elapsedTimer) clearInterval(elapsedTimer);
    elapsedTimer = setInterval(() => {
      set((s) => ({ elapsedTime: s.elapsedTime + 1 }));
    }, 1000);

    const steps = mockPipelineSteps();
    let currentStep = 0;

    if (stepTimer) clearInterval(stepTimer);

    stepTimer = setInterval(() => {
      if (currentStep >= steps.length) {
        if (stepTimer) clearInterval(stepTimer);
        stepTimer = null;
        if (elapsedTimer) clearInterval(elapsedTimer);
        elapsedTimer = null;

        const result: QueryResult = mockQueryResult();

        set((s) => ({
          isProcessing: false,
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, status: 'completed' as const, result } : c,
          ),
        }));
        return;
      }

      const step: PipelineStep = {
        ...steps[currentStep],
        status: 'completed',
      };

      set((s) => ({
        conversations: s.conversations.map((c) =>
          c.id === id ? { ...c, steps: [...c.steps, step] } : c,
        ),
      }));

      currentStep++;
    }, 800);
  },

  newChat: () => {
    if (stepTimer) {
      clearInterval(stepTimer);
      stepTimer = null;
    }
    if (elapsedTimer) {
      clearInterval(elapsedTimer);
      elapsedTimer = null;
    }
    set({ activeConversationId: null, isProcessing: false, elapsedTime: 0 });
  },

  togglePin: (id: string) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c,
      ),
    })),

  setShowClarification: (show) => set({ showClarification: show }),
  setShowFeedback: (show) => set({ showFeedback: show }),
}));

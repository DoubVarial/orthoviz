import { create } from 'zustand';
import { ToothId, ToothFrame, ToothMovement, TreatmentPlan } from '../types/dental';

interface AppStore {
  // View
  activeJaw: 'upper' | 'lower' | 'both';
  selectedToothId: ToothId | null;

  // Tooth frames (populated on GLB load)
  toothFrames: Record<ToothId, ToothFrame>;

  // Playback
  currentStep: number;       // 0-based index into plan.steps
  stepProgress: number;      // 0–1, fraction between currentStep and next
  isPlaying: boolean;

  // Plan
  plan: TreatmentPlan;

  // Actions
  setActiveJaw(jaw: 'upper' | 'lower' | 'both'): void;
  setSelectedTooth(id: ToothId | null): void;
  setToothFrame(id: ToothId, frame: ToothFrame): void;
  setCurrentStep(step: number): void;
  setStepProgress(progress: number): void;
  setPlaying(playing: boolean): void;
  updateMovement(toothId: ToothId, stepIndex: number, delta: Partial<ToothMovement>): void;
  addStep(): void;
  removeStep(stepIndex: number): void;
}

const initialPlan: TreatmentPlan = {
  steps: [
    { movements: {} },
    { movements: {} },
    { movements: {} },
  ],
};

export const useStore = create<AppStore>((set) => ({
  // View
  activeJaw: 'both',
  selectedToothId: null,

  // Tooth frames
  toothFrames: {},

  // Playback
  currentStep: 0,
  stepProgress: 0,
  isPlaying: false,

  // Plan
  plan: initialPlan,

  // Actions
  setActiveJaw: (jaw) => set({ activeJaw: jaw }),

  setSelectedTooth: (id) => set({ selectedToothId: id }),

  setToothFrame: (id, frame) =>
    set((state) => ({
      toothFrames: { ...state.toothFrames, [id]: frame },
    })),

  setCurrentStep: (step) => set({ currentStep: step, stepProgress: 0 }),

  setStepProgress: (progress) => set({ stepProgress: progress }),

  setPlaying: (playing) => set({ isPlaying: playing }),

  updateMovement: (toothId, stepIndex, delta) =>
    set((state) => {
      const steps = [...state.plan.steps];
      const step = steps[stepIndex];
      if (!step) return state;
      steps[stepIndex] = {
        ...step,
        movements: {
          ...step.movements,
          [toothId]: {
            ...step.movements[toothId],
            ...delta,
          },
        },
      };
      return { plan: { ...state.plan, steps } };
    }),

  addStep: () =>
    set((state) => ({
      plan: {
        ...state.plan,
        steps: [...state.plan.steps, { movements: {} }],
      },
    })),

  removeStep: (stepIndex) =>
    set((state) => {
      if (state.plan.steps.length <= 1) return state;
      const steps = state.plan.steps.filter((_, i) => i !== stepIndex);
      const currentStep = Math.min(state.currentStep, steps.length - 1);
      return {
        plan: { ...state.plan, steps },
        currentStep,
      };
    }),
}));

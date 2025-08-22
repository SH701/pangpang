// src/stores/uiStore.ts
import { create } from "zustand";

type UIState = {
  loadingModalOpen: boolean;
  setLoadingModalOpen: (v: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  loadingModalOpen: false,
  setLoadingModalOpen: (v) => set({ loadingModalOpen: v }),
}));

// store/audioStore.ts
import { create } from "zustand";

interface AudioState {
  volume: number;
  setVolume: (value: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  volume: 1,
  setVolume: (value) => set({ volume: value }),
}));

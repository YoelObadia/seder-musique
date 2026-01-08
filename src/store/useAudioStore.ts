import { create } from 'zustand';
import { Release } from '@/lib/types';

interface AudioState {
    currentTrack: Release | null;
    isPlaying: boolean;
    volume: number;
    playTrack: (track: Release) => void;
    pause: () => void;
    resume: () => void;
    setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
    currentTrack: null,
    isPlaying: false,
    volume: 0.8,
    playTrack: (track) => set({ currentTrack: track, isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    resume: () => set({ isPlaying: true }),
    setVolume: (volume) => set({ volume }),
}));

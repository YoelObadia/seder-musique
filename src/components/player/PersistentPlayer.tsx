'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAudioStore } from '@/store/useAudioStore';
import { cn } from '@/lib/utils';
import { LockOpen1Icon, PauseIcon, PlayIcon, SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons'; // Assuming generic icons or using text currently
// For simplicity without installing lucide/radix icons package specifically (unless requested), using text or SVGs directly is safer. 
// I will use SVG paths for icons to be dependency-free.

export default function PersistentPlayer() {
    const { currentTrack, isPlaying, volume, pause, resume } = useAudioStore();
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    // Sync Audio with State
    useEffect(() => {
        if (!audioRef.current || !currentTrack) return;

        if (isPlaying) {
            // Check if source changed or just resuming
            const currentSrc = audioRef.current.src;
            // Mock logic: assumes release has a preview URL or uses external link which won't work in <audio> tag usually.
            // FOR DEMO: We will assume we have a valid MP3 url.
            // Since Release type has streamingLinks not mp3, we'll mock an mp3 for demo purposes or use a property if it existed.
            // Let's assume for this "Zero-DB" structure we might have a `previewUrl` we overlooked or we just mock it.
            const demoMp3 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

            if (audioRef.current.src !== demoMp3) {
                audioRef.current.src = demoMp3;
            }

            audioRef.current.play().catch(e => console.error("Playback failed", e));
        } else {
            audioRef.current.pause();
        }
    }, [currentTrack, isPlaying]);

    // Volume Sync
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);


    // Visualizer Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = () => {
            if (!isPlaying) {
                cancelAnimationFrame(animationRef.current);
                // Clear canvas or draw flat line
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.moveTo(0, canvas.height / 2);
                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.strokeStyle = '#333';
                ctx.stroke();
                return;
            }

            // Fake waveform animation
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);

            for (let i = 0; i < canvas.width; i += 5) {
                const amplitude = Math.random() * 15;
                ctx.lineTo(i, (canvas.height / 2) - amplitude / 2 + (Math.random() * amplitude));
            }

            ctx.strokeStyle = '#7B61FF';
            ctx.lineWidth = 2;
            ctx.stroke();

            animationRef.current = requestAnimationFrame(draw);
        };

        if (isPlaying) {
            draw();
        }

        return () => cancelAnimationFrame(animationRef.current);
    }, [isPlaying]);


    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-500">
            <audio
                ref={audioRef}
                onEnded={pause}
            />

            {/* Cover Art */}
            <div className="h-12 w-12 rounded-md bg-zinc-800 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            </div>

            {/* Track Info */}
            <div className="flex flex-col min-w-[120px]">
                <span className="text-white font-display text-sm truncate">{currentTrack.title}</span>
                <span className="text-gray-400 text-xs truncate">Seder Artist</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => isPlaying ? pause() : resume()}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition active:scale-95"
                >
                    {isPlaying ? (
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.75 12.25V2.75H5.75V12.25H2.75ZM9.25 12.25V2.75H12.25V12.25H9.25Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    ) : (
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    )}
                </button>
            </div>

            {/* Visualizer */}
            <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
                <canvas ref={canvasRef} width={200} height={32} className="w-full h-full" />
            </div>
        </div>
    );
}

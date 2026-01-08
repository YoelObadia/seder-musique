'use client';

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons';

export default function AudioCompare() {
    const [sliderValue, setSliderValue] = useState(50);
    const [isPlaying, setIsPlaying] = useState(false);

    // In a real app we would use two synced <audio> or Web Audio API
    // For visual demo, we simulate the "Mix A / Mix B" visual slider 
    // and maybe just toggle a class or color.

    return (
        <div className="w-full max-w-3xl mx-auto bg-zinc-950 border border-white/10 rounded-xl p-8 relative overflow-hidden">
            {/* Top Bar VST Style */}
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Seder Audio Engine v1.0</span>
                </div>
                <div className="flex gap-2">
                    <span className="font-mono text-xs text-accent">48kHz</span>
                    <span className="font-mono text-xs text-gray-500">|</span>
                    <span className="font-mono text-xs text-accent">24bit</span>
                </div>
            </div>

            {/* Visualizer Area Comparison */}
            <div className="relative h-48 w-full bg-black/50 rounded-lg overflow-hidden border border-white/5 group slider-container select-none">

                {/* Mix A Result (Left) */}
                <div
                    className="absolute inset-0 bg-zinc-900 flex items-center justify-center overflow-hidden"
                    style={{ clipPath: `polygon(0 0, ${sliderValue}% 0, ${sliderValue}% 100%, 0 100%)` }}
                >
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        {/* Fake Waveform A (Rough/Raw) */}
                        <Waveform color="#333" complexity={0.5} />
                    </div>
                    <span className="relative z-10 font-display text-4xl text-gray-700/50 uppercase">Mix A (Raw)</span>
                </div>

                {/* Mix B Result (Right - Revealing) */}
                <div
                    className="absolute inset-0 bg-transparent flex items-center justify-center overflow-hidden"
                    style={{ clipPath: `polygon(${sliderValue}% 0, 100% 0, 100% 100%, ${sliderValue}% 100%)` }}
                >
                    <div className="absolute inset-0 flex items-center justify-center opacity-50">
                        {/* Fake Waveform B (Polished) */}
                        <div className="w-full h-full bg-accent/5" />
                        <Waveform color="#7B61FF" complexity={1} />
                    </div>
                    <span className="relative z-10 font-display text-4xl text-white uppercase drop-shadow-[0_0_15px_rgba(123,97,255,0.5)]">Mix B (Master)</span>
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    style={{ left: `${sliderValue}%` }}
                >
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg transform active:scale-90 transition-transform">
                        <div className="w-1 h-3 border-x border-black/30" />
                    </div>
                </div>

                {/* Interaction Overlay */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-ew-resize z-30"
                />
            </div>

            <div className="flex justify-between mt-4 font-mono text-xs text-gray-500">
                <span>BEFORE</span>
                <span>AFTER</span>
            </div>
        </div>
    );
}

// Simple Fake Waveform Component
function Waveform({ color, complexity }: { color: string, complexity: number }) {
    return (
        <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
            <path
                d="M0 10 Q 5 0, 10 10 T 20 10 T 30 10 T 40 10 T 50 10 T 60 10 T 70 10 T 80 10 T 90 10 T 100 10"
                fill="none"
                stroke={color}
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
                // Simulate complexity by scaling path or adding more points in real app
                style={{ transform: `scaleY(${complexity})`, transformOrigin: 'center' }}
            />
            {/* Simple lines for demo */}
            {Array.from({ length: 50 }).map((_, i) => (
                <rect
                    key={i}
                    x={i * 2}
                    y={10 - (Math.random() * 8 * complexity)}
                    width={1}
                    height={Math.random() * 16 * complexity}
                    fill={color}
                />
            ))}
        </svg>
    );
}

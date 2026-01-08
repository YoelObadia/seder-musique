'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import WebGLCheck from './WebGLCheck';

const BAR_COUNT = 32;

function SpectrumBars({ audioData }: { audioData: Uint8Array }) {
    const groupRef = useRef<THREE.Group>(null);
    const barsRef = useRef<THREE.Mesh[]>([]);

    // Create bar geometries
    const bars = useMemo(() => {
        return Array.from({ length: BAR_COUNT }, (_, i) => {
            const angle = (i / BAR_COUNT) * Math.PI * 2;
            const x = Math.cos(angle) * 2;
            const z = Math.sin(angle) * 2;
            return { x, z, angle };
        });
    }, []);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.002;
        }

        // Update bar heights based on audio data
        barsRef.current.forEach((bar, i) => {
            if (bar) {
                const dataIndex = Math.floor((i / BAR_COUNT) * audioData.length);
                const value = audioData[dataIndex] / 255;
                const targetHeight = 0.2 + value * 2;
                bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, targetHeight, 0.3);
                bar.position.y = bar.scale.y / 2;

                // Color based on intensity
                const material = bar.material as THREE.MeshStandardMaterial;
                const hue = 0.75 - value * 0.3; // Purple to green shift
                material.color.setHSL(hue, 0.8, 0.5 + value * 0.3);
            }
        });
    });

    return (
        <group ref={groupRef}>
            {bars.map((bar, i) => (
                <mesh
                    key={i}
                    ref={(el) => { if (el) barsRef.current[i] = el; }}
                    position={[bar.x, 0.5, bar.z]}
                    rotation={[0, -bar.angle, 0]}
                >
                    <boxGeometry args={[0.15, 1, 0.15]} />
                    <meshStandardMaterial color="#E6E6FA" emissive="#E6E6FA" emissiveIntensity={0.2} />
                </mesh>
            ))}

            {/* Center Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.8, 2.2, 64]} />
                <meshBasicMaterial color="#BFFF00" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}

interface AudioVisualizerProps {
    audioContext?: AudioContext;
    analyser?: AnalyserNode;
}

export default function AudioVisualizer({ audioContext, analyser }: AudioVisualizerProps) {
    const [dpr, setDpr] = useState(1.5);
    const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(64).fill(128));

    useEffect(() => {
        if (!analyser) return;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let animationId: number;

        const updateData = () => {
            analyser.getByteFrequencyData(dataArray);
            setAudioData(new Uint8Array(dataArray));
            animationId = requestAnimationFrame(updateData);
        };

        updateData();
        return () => cancelAnimationFrame(animationId);
    }, [analyser]);

    // Demo mode: generate fake audio data if no analyser
    useEffect(() => {
        if (analyser) return;

        let animationId: number;
        const fakeData = new Uint8Array(64);

        const generateFakeData = () => {
            for (let i = 0; i < fakeData.length; i++) {
                fakeData[i] = Math.sin(Date.now() * 0.005 + i * 0.3) * 100 + 128;
            }
            setAudioData(new Uint8Array(fakeData));
            animationId = requestAnimationFrame(generateFakeData);
        };

        generateFakeData();
        return () => cancelAnimationFrame(animationId);
    }, [analyser]);

    return (
        <WebGLCheck
            fallback={
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                    <div className="flex gap-1 items-end h-32">
                        {Array.from({ length: 16 }).map((_, i) => (
                            <div
                                key={i}
                                className="w-2 bg-accent animate-pulse"
                                style={{ height: `${20 + Math.random() * 60}%` }}
                            />
                        ))}
                    </div>
                </div>
            }
        >
            <div className="w-full h-[400px]">
                <Canvas dpr={dpr} camera={{ position: [0, 3, 5], fov: 50 }}>
                    <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
                    <ambientLight intensity={0.3} />
                    <pointLight position={[0, 5, 0]} intensity={1} color="#BFFF00" />

                    <SpectrumBars audioData={audioData} />
                </Canvas>
            </div>
        </WebGLCheck>
    );
}

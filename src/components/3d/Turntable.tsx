'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cylinder, Ring, PerformanceMonitor, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import WebGLCheck from './WebGLCheck';

function Vinyl({ isScratching }: { isScratching: boolean }) {
    const vinylRef = useRef<THREE.Group>(null);
    const currentRotationSpeed = useRef(0.01);

    useFrame(() => {
        if (vinylRef.current) {
            // Slow down when scratching, normal rotation otherwise
            const targetSpeed = isScratching ? -0.05 : 0.01;
            currentRotationSpeed.current = THREE.MathUtils.lerp(
                currentRotationSpeed.current,
                targetSpeed,
                0.1
            );
            vinylRef.current.rotation.y += currentRotationSpeed.current;
        }
    });

    return (
        <group ref={vinylRef}>
            {/* Main Vinyl Disc */}
            <Cylinder args={[2, 2, 0.05, 128]}>
                <meshStandardMaterial color="#111111" roughness={0.15} metalness={0.8} envMapIntensity={1.5} />
            </Cylinder>

            {/* Label in Center */}
            <Cylinder args={[0.7, 0.7, 0.06, 64]} position={[0, 0.01, 0]}>
                {/* Using a gold/yellow color for the label to contrast with black */}
                <meshStandardMaterial color="#CBA135" roughness={0.4} />
            </Cylinder>

            {/* Rotation Visual: Text on Label */}
            <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.041, 0]}>
                <Text
                    position={[0, 0.4, 0]}
                    rotation={[0, 0, 0]}
                    fontSize={0.15}
                    color="#222"
                    anchorX="center"
                    anchorY="middle"
                // font="/fonts/Inter-Bold.ttf" 
                >
                    R&D
                </Text>
                <Text
                    position={[0, -0.4, 0]}
                    rotation={[0, 0, Math.PI]}
                    fontSize={0.12}
                    color="#222"
                    anchorX="center"
                    anchorY="middle"
                >
                    RECORDS
                </Text>
            </group>

            {/* Cosmetic label rings for rotation visibility */}
            <Ring args={[0.6, 0.62, 64]} position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <meshBasicMaterial color="#BDB76B" side={THREE.DoubleSide} />
            </Ring>
            <Ring args={[0.25, 0.27, 64]} position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <meshBasicMaterial color="#BDB76B" side={THREE.DoubleSide} />
            </Ring>

            {/* Grooves (rings) */}
            {[0.85, 0.95, 1.05, 1.15, 1.25, 1.35, 1.45, 1.55, 1.65, 1.75, 1.85].map((radius, i) => (
                <Ring key={i} args={[radius - 0.01, radius, 128]} position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <meshBasicMaterial color="#222" opacity={0.5} transparent side={THREE.DoubleSide} />
                </Ring>
            ))}
        </group>
    );
}

function FloatingNotes({ isPlaying }: { isPlaying: boolean }) {
    const group = useRef<THREE.Group>(null);
    const [notes, setNotes] = useState<{ id: number; x: number; z: number; speed: number; offset: number }[]>([]);

    useFrame((state) => {
        if (!isPlaying) return;
        // Randomly spawn notes
        if (Math.random() < 0.03) {
            setNotes(prev => [
                ...prev,
                {
                    id: Date.now() + Math.random(),
                    x: (Math.random() - 0.5) * 1,
                    z: (Math.random() - 0.5) * 1,
                    speed: 0.8 + Math.random() * 0.5,
                    offset: Math.random() * 10
                }
            ].slice(-15)); // Keep max 15 notes
        }
    });

    return (
        <group ref={group}>
            {notes.map(note => (
                <Note key={note.id} {...note} />
            ))}
        </group>
    );
}

function Note({ x, z, speed, offset }: { x: number; z: number; speed: number; offset: number }) {
    const ref = useRef<THREE.Group>(null);
    const [dead, setDead] = useState(false);
    const [opacity, setOpacity] = useState(1);

    useFrame((state, delta) => {
        if (ref.current && !dead) {
            ref.current.position.y += speed * delta;
            ref.current.position.x += Math.sin(state.clock.elapsedTime * 3 + offset) * 0.005;

            // Fade out
            if (ref.current.position.y > 1.5) {
                setOpacity(prev => prev - delta * 2);
            }
            if (opacity <= 0) {
                setDead(true);
            }
        }
    });

    if (dead) return null;

    return (
        <group ref={ref} position={[x, 0, z]}>
            <Text
                fontSize={0.25}
                color="#3B82F6"
                anchorX="center"
                anchorY="middle"
                fillOpacity={opacity}
            >
                ♪
            </Text>
        </group>
    );
}

function ToneArm({ isPlaying = true }: { isPlaying?: boolean }) {
    const armRef = useRef<THREE.Group>(null);
    const targetRotation = useRef(0);

    useFrame((state, delta) => {
        if (armRef.current) {
            // Angle to move arm over the record (approx 0.5-0.6 rads) vs "Rest" position (0.8 rads out)
            // Adjusting logic:
            // "Rest" position: Rotation Z around 0.5 (away)
            // "Play" position: Rotation Z around -0.2 (over the record)

            const playAngle = -0.35;
            const restAngle = 0.6;

            const target = isPlaying ? playAngle : restAngle;

            // Smoothly interpolate rotation
            armRef.current.rotation.y = THREE.MathUtils.lerp(
                armRef.current.rotation.y,
                target,
                delta * 2 // Speed of arm movement
            );
        }
    });

    return (
        <group position={[2.4, 0.2, 0]} rotation={[0, 0, 0]}>
            {/* Arm Pivot Base */}
            <Cylinder args={[0.2, 0.25, 0.3, 32]}>
                <meshStandardMaterial color="#EAEAEA" metalness={0.5} roughness={0.2} />
            </Cylinder>

            {/* Rotating Arm Group */}
            <group ref={armRef}>
                {/* The actual arm rod */}
                <group position={[0, 0.2, 0]} rotation={[0, 0, 0]}> {/* Pivot point offset */}
                    {/* Long rod */}
                    <mesh position={[-0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                        {/* Centered relative to mesh, so we offset position to pivot at 0 */}
                        <cylinderGeometry args={[0.08, 0.06, 2.5, 16]} />
                        <meshStandardMaterial color="#FFFFFF" metalness={0.2} roughness={0.1} />
                    </mesh>

                    {/* Headshell / Needle Cartridge */}
                    <group position={[-1.7, -0.05, 0]} rotation={[0, 0, 0.3]}>
                        <mesh>
                            <boxGeometry args={[0.3, 0.15, 0.2]} />
                            <meshStandardMaterial color="#F5F5F5" />
                        </mesh>
                        {/* Needle */}
                        <mesh position={[0.1, -0.1, 0]}>
                            <coneGeometry args={[0.02, 0.1, 8]} />
                            <meshStandardMaterial color="#333" />
                        </mesh>
                    </group>
                </group>
            </group>
        </group>
    );
}

export default function Turntable({ className }: { className?: string }) {
    const [isScratching, setIsScratching] = useState(false);
    const [dpr, setDpr] = useState(1.5);
    const [isPlaying, setIsPlaying] = useState(false);

    // Auto-start playing on mount
    React.useEffect(() => {
        setIsPlaying(true);
    }, []);

    return (
        <WebGLCheck
            fallback={
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-zinc-800 border-4 border-zinc-700" />
                </div>
            }
        >
            <div
                className={`cursor-grab active:cursor-grabbing ${className || 'w-full h-[400px]'}`}
                onMouseDown={() => setIsScratching(true)}
                onMouseUp={() => setIsScratching(false)}
                onMouseLeave={() => setIsScratching(false)}
                onTouchStart={() => setIsScratching(true)}
                onTouchEnd={() => setIsScratching(false)}
            >
                <Canvas dpr={dpr} camera={{ position: [0, 3, 4], fov: 35 }}>
                    <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 10, 7]} intensity={2} />
                    <spotLight position={[0, 5, 0]} intensity={1} angle={0.5} penumbra={1} />
                    <group rotation={[0, 0, 0]} position={[0, 0.5, 0]}> {/* Shifted up to reduce top gap */}
                        <Vinyl isScratching={isScratching} />
                        <ToneArm isPlaying={isPlaying} />
                        <FloatingNotes isPlaying={isPlaying} />

                        {/* Turntable Base */}
                        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <boxGeometry args={[5.5, 4.5, 0.2]} />
                            <meshStandardMaterial color="#f0f0f0" roughness={0.5} />
                        </mesh>

                        {/* Spindle */}
                        <mesh position={[0, 0.05, 0]}>
                            <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
                            <meshStandardMaterial color="#888" metalness={0.8} />
                        </mesh>
                    </group>
                </Canvas>
            </div>
        </WebGLCheck>
    );
}

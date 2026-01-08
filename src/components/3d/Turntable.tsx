'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cylinder, Ring, PerformanceMonitor, useTexture } from '@react-three/drei';
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
            vinylRef.current.rotation.z += currentRotationSpeed.current;
        }
    });

    return (
        <group ref={vinylRef} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Main Vinyl Disc */}
            <Cylinder args={[2, 2, 0.05, 64]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Cylinder>

            {/* Label in Center */}
            <Cylinder args={[0.6, 0.6, 0.06, 32]} position={[0, 0.01, 0]}>
                <meshStandardMaterial color="#E6E6FA" roughness={0.5} />
            </Cylinder>

            {/* Grooves (rings) */}
            {[0.8, 1.0, 1.2, 1.4, 1.6, 1.8].map((radius, i) => (
                <Ring key={i} args={[radius - 0.02, radius, 64]} position={[0, 0.026, 0]}>
                    <meshBasicMaterial color="#333" side={THREE.DoubleSide} />
                </Ring>
            ))}
        </group>
    );
}

function ToneArm() {
    return (
        <group position={[2.2, 0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
            {/* Arm Base */}
            <Cylinder args={[0.1, 0.1, 0.3, 16]}>
                <meshStandardMaterial color="#333" metalness={0.9} roughness={0.2} />
            </Cylinder>
            {/* Arm */}
            <group position={[0, 0.15, -0.8]} rotation={[Math.PI / 2 - 0.3, 0, 0]}>
                <Cylinder args={[0.02, 0.02, 1.8, 8]}>
                    <meshStandardMaterial color="#555" metalness={0.9} roughness={0.2} />
                </Cylinder>
            </group>
        </group>
    );
}

export default function Turntable() {
    const [isScratching, setIsScratching] = useState(false);
    const [dpr, setDpr] = useState(1.5);

    return (
        <WebGLCheck
            fallback={
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-zinc-800 border-4 border-zinc-700" />
                </div>
            }
        >
            <div
                className="w-full h-[400px] cursor-grab active:cursor-grabbing"
                onMouseDown={() => setIsScratching(true)}
                onMouseUp={() => setIsScratching(false)}
                onMouseLeave={() => setIsScratching(false)}
                onTouchStart={() => setIsScratching(true)}
                onTouchEnd={() => setIsScratching(false)}
            >
                <Canvas dpr={dpr} camera={{ position: [0, 3, 4], fov: 45 }}>
                    <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    <spotLight position={[0, 5, 0]} intensity={0.5} angle={0.5} />

                    <Vinyl isScratching={isScratching} />
                    <ToneArm />

                    {/* Turntable Base */}
                    <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <boxGeometry args={[5, 4, 0.2]} />
                        <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
                    </mesh>
                </Canvas>
            </div>
        </WebGLCheck>
    );
}

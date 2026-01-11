'use client';

import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Cylinder, Ring, PerformanceMonitor, Text, Center } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import WebGLCheck from './WebGLCheck';

// --- VISUAL COMPONENTS ---

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

function ToneArm({ isPlaying, setIsPlaying, isScratching }: {
    isPlaying: boolean;
    setIsPlaying: (p: boolean) => void;
    isScratching: boolean;
}) {
    const armRef = useRef<THREE.Group>(null);
    const pivotRef = useRef<THREE.Group>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Config
    const PLAY_ANGLE = -0.35;
    const REST_ANGLE = 0.6;
    const LIFT_HEIGHT = -0.3; // Negative to lift UP

    const { camera, raycaster, pointer } = useThree();
    const planeNormal = new THREE.Vector3(0, 1, 0);
    const planeConstant = 0; // The plane Y level
    const plane = new THREE.Plane(planeNormal, planeConstant);

    useFrame((state, delta) => {
        if (!armRef.current || !pivotRef.current) return;

        // 1. Dragging Logic (Manual Control)
        if (isDragging) {
            raycaster.setFromCamera(pointer, camera);
            const intersection = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, intersection);

            if (intersection) {
                const sensitivity = 0.5;
                const targetY = (pointer.x * sensitivity) + 0.2;
                // Smoothly follow mouse
                pivotRef.current.rotation.y = THREE.MathUtils.lerp(pivotRef.current.rotation.y, -targetY, 0.2);
            }
        }
        // 2. Auto-Play Logic (Automatic Control)
        else if (isPlaying) {
            // Go to Play Angle
            pivotRef.current.rotation.y = THREE.MathUtils.lerp(pivotRef.current.rotation.y, PLAY_ANGLE, delta * 3);
            // Ensure it's down
            pivotRef.current.rotation.z = THREE.MathUtils.lerp(pivotRef.current.rotation.z, 0, delta * 3);
        } else {
            // Return to rest
            pivotRef.current.rotation.y = THREE.MathUtils.lerp(pivotRef.current.rotation.y, REST_ANGLE, delta * 2);
            // Lift up
            pivotRef.current.rotation.z = THREE.MathUtils.lerp(pivotRef.current.rotation.z, LIFT_HEIGHT, delta * 3);
        }
    });

    const handlePointerDown = (e: any) => {
        e.stopPropagation();
        setIsDragging(true);
        setIsPlaying(false); // Stop playing when grabbed
        document.body.style.cursor = 'grabbing';

        // Immediate Lift Animation on Interaction Start
        if (pivotRef.current) {
            gsap.to(pivotRef.current.rotation, {
                z: LIFT_HEIGHT,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    };

    const handleGlobalPointerUp = () => {
        if (isDragging) {
            setIsDragging(false);
            document.body.style.cursor = 'auto';

            // Check position to decide if we play or rest
            if (pivotRef.current) {
                const currentY = pivotRef.current.rotation.y;
                // If dragged closer to record (angle < 0.2 approx)
                if (currentY < 0.3) {
                    setIsPlaying(true);
                } else {
                    setIsPlaying(false);
                }
            }
        }
    };

    useEffect(() => {
        window.addEventListener('pointerup', handleGlobalPointerUp);
        window.addEventListener('touchend', handleGlobalPointerUp);
        return () => {
            window.removeEventListener('pointerup', handleGlobalPointerUp);
            window.removeEventListener('touchend', handleGlobalPointerUp);
        };
    }, [isDragging]);


    return (
        <group position={[2.4, 0.2, 0]}>
            {/* Arm Pivot Base */}
            <Cylinder args={[0.2, 0.25, 0.3, 32]}>
                <meshStandardMaterial color="#EAEAEA" metalness={0.5} roughness={0.2} />
            </Cylinder>

            {/* Rotating Arm Group Container */}
            <group ref={pivotRef} rotation={[0, REST_ANGLE, 0]}>

                {/* The actual arm rod -> This is the clickable part */}
                <group
                    ref={armRef}
                    onPointerDown={handlePointerDown}
                    onPointerOver={() => document.body.style.cursor = 'grab'}
                    onPointerOut={() => !isDragging && (document.body.style.cursor = 'auto')}
                    position={[0, 0.2, 0]}
                >
                    {/* Hitbox for easier grabbing */}
                    <mesh visible={false}>
                        <boxGeometry args={[3, 1, 1]} />
                    </mesh>

                    {/* Long rod */}
                    <mesh position={[-0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                        <cylinderGeometry args={[0.08, 0.06, 2.5, 16]} />
                        <meshStandardMaterial color="#FFFFFF" metalness={0.2} roughness={0.1} />
                    </mesh>

                    {/* Headshell */}
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

// Auto-Fit Camera to ensure object is never cropped
function AutoFitCamera() {
    const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;

    useFrame(() => {
        // Object Dimensions (Turntable Base is approx 5.5 wide, 4.5 tall)
        // Tune these to get the perfect "fill" without cutting off
        const TARGET_WIDTH = 6.2;
        const TARGET_HEIGHT = 5.2;

        const fovRad = (camera.fov * Math.PI) / 180;
        const distForHeight = (TARGET_HEIGHT / 2) / Math.tan(fovRad / 2);
        const distForWidth = (TARGET_WIDTH / 2) / (Math.tan(fovRad / 2) * camera.aspect);

        const targetZ = Math.max(distForHeight, distForWidth);

        // Smoothly interpolate
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
        camera.lookAt(0, 0, 0);
    });

    return null;
}

interface TurntableProps {
    className?: string;
}

export default function Turntable({ className }: TurntableProps) {
    const [isScratching, setIsScratching] = useState(false);
    const [dpr, setDpr] = useState(1.5);
    const [isPlaying, setIsPlaying] = useState(false); // Default false

    // Auto-start animation on mount
    useEffect(() => {
        const timer = setTimeout(() => setIsPlaying(true), 100);
        return () => clearTimeout(timer);
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
                style={{ width: '100%', height: '100%' }}
                // Scratching logic on the container (global for vinyl)
                onMouseDown={() => setIsScratching(true)}
                onMouseUp={() => setIsScratching(false)}
                onMouseLeave={() => setIsScratching(false)}
                onTouchStart={() => setIsScratching(true)}
                onTouchEnd={() => setIsScratching(false)}
            >
                {/* Canvas set to 100% via style on parent, but confirm internal sizing */}
                <Canvas dpr={dpr} camera={{ position: [0, 6, 10], fov: 25 }}>
                    <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />

                    <AutoFitCamera />

                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 10, 7]} intensity={2.5} />
                    <spotLight position={[0, 8, 0]} intensity={2} angle={0.8} penumbra={0.5} />

                    <group rotation={[0, 0, 0]}>
                        <Vinyl isScratching={isScratching} />

                        <ToneArm
                            isPlaying={isPlaying}
                            setIsPlaying={setIsPlaying}
                            isScratching={isScratching}
                        />

                        {/* Floating Notes for poetic touch */}
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

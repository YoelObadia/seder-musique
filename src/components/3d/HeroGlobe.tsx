'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, PerformanceMonitor, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function calcPosFromLatLonRad(lat: number, lon: number, radius: number): [number, number, number] {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return [x, y, z];
}

const LOCATIONS = [
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'Tel Aviv', lat: 32.0853, lon: 34.7818 },
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
];

function Globe({ scrollTriggerRef }: { scrollTriggerRef: React.MutableRefObject<HTMLDivElement | null> }) {
    const groupRef = useRef<THREE.Group>(null);
    const globeRef = useRef<THREE.Mesh>(null);

    const markers = useMemo(() => {
        return LOCATIONS.map(loc => {
            const pos = calcPosFromLatLonRad(loc.lat, loc.lon, 2);
            return { ...loc, position: pos };
        });
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.002;
        }
    });

    useGSAP(() => {
        if (!scrollTriggerRef.current || !groupRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: scrollTriggerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1.5,
            }
        });

        tl.to(groupRef.current.position, { y: -1.5, z: 2, ease: "power2.inOut" });
        tl.to(groupRef.current.scale, { x: 1.8, y: 1.8, z: 1.8, ease: "power2.inOut" }, "<");
    }, { scope: scrollTriggerRef });

    return (
        <group ref={groupRef}>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* 1. La Sphère Filaire - Utilise Digital Lavender (#E6E6FA) */}
                <mesh ref={globeRef}>
                    <sphereGeometry args={[2, 48, 48]} />
                    <meshBasicMaterial
                        color="#E6E6FA"
                        wireframe
                        transparent
                        opacity={0.6}
                    />
                </mesh>

                {/* 2. Coeur interne pour la profondeur */}
                <Sphere args={[1.97, 48, 48]}>
                    <meshBasicMaterial color="#050505" transparent opacity={0.8} />
                </Sphere>

                {/* 3. Marqueurs - Utilise Acid Green (#BFFF00) pour une visibilité maximale */}
                {markers.map((marker, idx) => (
                    <group key={idx} position={marker.position as [number, number, number]}>
                        {/* Le point central */}
                        <Sphere args={[0.06, 16, 16]}>
                            <meshBasicMaterial color="#BFFF00" />
                        </Sphere>
                        {/* L'aura lumineuse du marqueur */}
                        <Sphere args={[0.12, 16, 16]}>
                            <meshBasicMaterial color="#BFFF00" transparent opacity={0.3} />
                        </Sphere>
                    </group>
                ))}
            </Float>
        </group>
    );
}

export default function HeroGlobe() {
    const [dpr, setDpr] = useState(1.2);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Canvas
                dpr={dpr}
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
            >
                <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />

                <Globe scrollTriggerRef={containerRef} />

                {/* LE SECRET DE LA VISIBILITÉ : Post-processing Bloom */}
                <EffectComposer>
                    <Bloom
                        intensity={1.2}
                        luminanceThreshold={0.1}
                        mipmapBlur
                        radius={0.5}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
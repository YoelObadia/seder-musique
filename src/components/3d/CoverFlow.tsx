'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, MeshReflectorMaterial, useScroll, ScrollControls } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import { Release } from '@/lib/types';
import { cn } from '@/lib/utils';
import { releases } from '@/data/releases'; // Using mock data directly for the scene

// Geometry for the card plane
const CardGeometry = new THREE.PlaneGeometry(1, 1);

function Carousel({ radius = 2, count = 5 }) {
    const group = useRef<THREE.Group>(null);
    const scroll = useScroll(); // from ScrollControls

    // We display a subset of releases or loop them if needed. using fixed mock releases.
    // Ensure we have enough data to look good, or repeat.
    const items = releases.slice(0, count);

    useFrame((state, delta) => {
        if (!group.current) return;

        // Calculate offset based on scroll
        // scroll.offset is 0 to 1
        const offset = scroll.offset;

        // Rotate the entire group based on scroll
        // We want 0 to 1 to correspond to full revolution or significant pass
        const rotationY = offset * Math.PI * 2;

        // Smooth rotation
        easing.dampE(group.current.rotation, [0, -rotationY, 0], 0.2, delta);

    });

    return (
        <group ref={group} position={[0, -0.5, -2]}>
            {items.map((release, i) => {
                const angle = (i / count) * Math.PI * 2;
                return (
                    <Card
                        key={release.id}
                        url={release.coverUrl}
                        angle={angle}
                        radius={radius}
                    />
                );
            })}
        </group>
    );
}

function Card({ url, angle, radius }: { url: string, angle: number, radius: number }) {
    const ref = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    // Initial Position on the circle
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    useFrame((state, delta) => {
        if (!ref.current) return;

        // Face center? 
        // Actually, for a cover flow, usually they face forward when in back? 
        // Let's make them face OUTVARDS from center + Math.PI (facing camera when at z front)
        // Or simply lookAt(0,0,0) then flip?

        // Simple circular arrangement forcing outward face
        // ref.current.lookAt(0, 0, 0); 
        // ref.current.rotation.y += Math.PI; // Flip to face out

        // But we want them to rotate slightly as group rotates. 
        // Since they are children of group, they inherit group rotation.
        // We just position them statically in local space.
    });

    return (
        <group position={[x, 0, z]} rotation={[0, angle, 0]}>
            {/* The Image Mesh */}
            <mesh
                ref={ref}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <planeGeometry args={[1.5, 1.5]} />
                {/* Fallback color if image loads slow */}
                <meshBasicMaterial color={hovered ? '#7B61FF' : 'white'} />
                {/* Use Drei Image for optimized texture loading if URL is valid image, 
                     but standard material with texture map is often easier for complex scenes.
                     Here keeping it simple with BasicMaterial color for 'wireframe' feel if no image,
                     or we use Image component from Drei which simplifies texture load.
                 */}
            </mesh>

            {/* Actual Image component for the content */}
            <Image
                url={url}
                transparent
                position={[0, 0, 0.01]} // slight offset to avoid z-fight with base mesh
                scale={[1.4, 1.4]} // slightly smaller than border
                side={THREE.DoubleSide}
                opacity={hovered ? 1 : 0.8}
            />

        </group>
    );
}


function ReflectiveFloor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
            <planeGeometry args={[20, 20]} />
            <MeshReflectorMaterial
                mirror={0.5}
                blur={[300, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={40}
                roughness={1}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#050505"
                metalness={0.5}
            />
        </mesh>
    );
}

export default function CoverFlow({ className }: { className?: string }) {
    return (
        <div className={cn("h-[500px] w-full", className)}>
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

                <ScrollControls pages={2} damping={0.2} horizontal>
                    <Carousel radius={3} count={releases.length} />
                </ScrollControls>

                <ReflectiveFloor />

                <fog attach="fog" args={['#050505', 5, 15]} />
            </Canvas>
        </div>
    );
}

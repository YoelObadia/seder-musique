'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CONFIG = {
    textLine1: "SEDER MUSIC",
    textLine2: "GROUP",
    particleDensity: 4,
    colors: ['#FFD700', '#D4AF37', '#CFB53B', '#F5E6AB'],
    mouseRepulsionRadius: 100,
    mouseRepulsionStrength: 0.8,
    animationDuration: { enter: 2.5, stay: 8, leave: 1.5 }
};

interface Particle {
    x: number; y: number;
    originX: number; originY: number;
    targetX: number; targetY: number;
    size: number; color: string; phase: number;
}

export default function ParticleTextHero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const particles = useRef<Particle[]>([]);
    const animationProgress = useRef({ value: 0 });
    const mouse = useRef({ x: -1000, y: -1000 });
    const requestRef = useRef<number | undefined>(undefined);

    const getTextCoordinates = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        const offCtx = offscreenCanvas.getContext('2d');
        if (!offCtx) return [];

        // 1. DYNAMIC FONT SIZING (Responsive & Safe)
        // We start with a target optimal size, then scale down if needed
        let fontSize1 = width < 768 ? 100 : 240;

        // Prepare context for measurement to ensure it fits
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.font = `900 ${fontSize1}px 'Monument Extended', sans-serif`;

        // Measure "SEDER MUSIC"
        const textMetrics = offCtx.measureText(CONFIG.textLine1);
        const maxWidth = width * 0.85; // Keep 15% margin

        // Scale down if text is too wide
        if (textMetrics.width > maxWidth) {
            fontSize1 = fontSize1 * (maxWidth / textMetrics.width);
        }

        const fontSize2 = fontSize1 * 0.5;
        const gap = fontSize1 * 0.15;

        // 2. POSITIONNEMENT (Responsive Vertical)
        // Mobile: 35% from top to avoid bottom content overlap
        // Desktop: 42% from top for optical center
        const verticalCenter = width < 768 ? height * 0.35 : height * 0.42;

        // Apply styles
        offCtx.fillStyle = 'white';

        // Ligne 1 : SEDER MUSIC
        offCtx.font = `900 ${fontSize1}px 'Monument Extended', sans-serif`;
        offCtx.fillText(CONFIG.textLine1, width / 2, verticalCenter - (fontSize2 / 2) - gap);

        // Ligne 2 : GROUP
        offCtx.font = `900 ${fontSize2}px 'Monument Extended', sans-serif`;
        offCtx.fillText(CONFIG.textLine2, width / 2, verticalCenter + (fontSize1 / 2) + gap);

        const imageData = offCtx.getImageData(0, 0, width, height).data;
        const coordinates: { x: number, y: number }[] = [];
        for (let y = 0; y < height; y += CONFIG.particleDensity) {
            for (let x = 0; x < width; x += CONFIG.particleDensity) {
                const index = (y * width + x) * 4;
                if (imageData[index + 3] > 128) {
                    coordinates.push({ x, y });
                }
            }
        }
        return coordinates;
    };

    const initParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const coords = getTextCoordinates(ctx, width, height);
        particles.current = coords.map(coord => {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 300 + 100;
            return {
                targetX: coord.x,
                targetY: coord.y,
                originX: coord.x + Math.cos(angle) * dist,
                originY: coord.y + Math.sin(angle) * dist,
                x: 0, y: 0,
                size: Math.random() * 2 + 0.5,
                color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
                phase: Math.random() * Math.PI * 2
            };
        });
    };

    const animate = (time: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        const progress = animationProgress.current.value;
        const timeScale = time * 0.001;

        particles.current.forEach(p => {
            let currentX = p.originX + (p.targetX - p.originX) * progress;
            let currentY = p.originY + (p.targetY - p.originY) * progress;

            // Breath animation removed for static stability until hover

            const dx = mouse.current.x - currentX;
            const dy = mouse.current.y - currentY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONFIG.mouseRepulsionRadius) {
                const force = (CONFIG.mouseRepulsionRadius - dist) / CONFIG.mouseRepulsionRadius;
                const angle = Math.atan2(dy, dx);
                currentX -= Math.cos(angle) * force * 40 * progress;
                currentY -= Math.sin(angle) * force * 40 * progress;
            }

            const shimmer = Math.sin(timeScale * 4 + p.phase) * 0.4 + 0.6;
            ctx.globalAlpha = progress * shimmer;
            ctx.fillStyle = p.color;
            ctx.fillRect(currentX, currentY, p.size, p.size);
        });

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const width = window.innerWidth;
                const height = window.innerHeight;
                canvasRef.current.width = width;
                canvasRef.current.height = height;
                setDimensions({ width, height });
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) initParticles(ctx, width, height);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        const handleMouseMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
        window.addEventListener('mousemove', handleMouseMove);
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    useGSAP(() => {
        // Entrée unique : plus de disparition loop
        gsap.to(animationProgress.current, {
            value: 1,
            duration: 3.5,
            ease: "expo.out"
        });
    }, { dependencies: [dimensions] }); // On relance si resize


    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
'use client';

import React, { useState, useEffect, ReactNode } from 'react';

interface WebGLCheckProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export default function WebGLCheck({ children, fallback }: WebGLCheckProps) {
    const [isSupported, setIsSupported] = useState<boolean | null>(null);

    useEffect(() => {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            setIsSupported(!!gl);
        } catch (e) {
            setIsSupported(false);
        }
    }, []);

    // Loading state
    if (isSupported === null) {
        return <div className="w-full h-full bg-surface animate-pulse" />;
    }

    if (!isSupported) {
        return (
            fallback ?? (
                <div className="w-full h-full bg-surface flex items-center justify-center">
                    <p className="text-gray-500 text-sm">3D not supported</p>
                </div>
            )
        );
    }

    return <>{children}</>;
}

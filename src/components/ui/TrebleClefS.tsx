import { useId } from 'react';

export default function TrebleClefS({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
    const maskId = useId();

    return (
        <svg
            className={className}
            viewBox="0 0 100 100" // Arbitrary Aspect Ratio, preserveAspectRatio handles the image
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <mask id={maskId} maskContentUnits="objectBoundingBox">
                    <rect width="1" height="1" fill="white" />
                    {/* 
                        Using the JPG image as a mask.
                        JPG is likely Black Shape on White Background.
                        Luminance Mask: White = Opaque (Keep), Black = Transparent (Cut).
                        We want the BLACK shape to be KEEP (Gold).
                        So we need to INVERT the image: Black->White, White->Black.
                    */}
                    <image
                        href="/images/cle-logo.jpg"
                        width="1"
                        height="1"
                        preserveAspectRatio="xMidYMid contain"
                        style={{ filter: 'invert(1)', mixBlendMode: 'normal' }}
                    />
                </mask>
            </defs>
            {/* Draw a colored rectangle masked by the inverted image */}
            <rect
                width="100%"
                height="100%"
                fill={color}
                mask={`url(#${maskId})`}
                style={{ maskType: 'luminance' } as any} 
            />
        </svg>
    );
}

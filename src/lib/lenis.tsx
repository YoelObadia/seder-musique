'use client';

import { ReactLenis as Lenis } from '@studio-freight/react-lenis';

export function ReactLenis({ root, options, children }: { root?: boolean; options?: any; children: any }) {
    return (
        // @ts-ignore
        <Lenis root={root} options={options}>
            {children as any}
        </Lenis>
    );
}

export default function GridOverlay() {
    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none select-none" aria-hidden="true">
            <div className="container mx-auto h-full grid grid-cols-12 gap-4 px-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-full border-x border-white/[0.05] hidden md:block"
                    />
                ))}
            </div>
        </div>
    );
}

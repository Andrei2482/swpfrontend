/**
 * Extremely subtle background — barely-there warm wisps on white.
 * Much more natural than coloured blobs. Prefers-reduced-motion safe.
 */
export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
            {/* White base */}
            <div className="absolute inset-0 bg-white" />

            {/* Washed-out warm wisp — top-left */}
            <div
                className={[
                    'absolute rounded-full',
                    '-top-[20%] -left-[10%]',
                    'h-[80vmax] w-[80vmax]',
                    'bg-violet-100/60',
                    'blur-[140px]',
                    'motion-safe:animate-blob-1',
                ].join(' ')}
            />

            {/* Washed-out cool wisp — bottom-right */}
            <div
                className={[
                    'absolute rounded-full',
                    '-bottom-[20%] -right-[10%]',
                    'h-[70vmax] w-[70vmax]',
                    'bg-sky-100/50',
                    'blur-[120px]',
                    'motion-safe:animate-blob-2',
                ].join(' ')}
            />
        </div>
    )
}

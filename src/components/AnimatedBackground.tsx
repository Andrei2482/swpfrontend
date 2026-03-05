/**
 * AnimatedBackground
 * Three slowly drifting radial blobs behind the auth pages.
 * Motion is disabled automatically when the user has "reduce motion" enabled –
 * the Tailwind `motion-safe:` prefix handles this.
 */
export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
            {/* Base layer */}
            <div className="absolute inset-0 bg-[#07071a]" />

            {/* Blob 1 — violet, upper-left */}
            <div
                className={[
                    'absolute rounded-full',
                    '-top-[30%] -left-[15%]',
                    'h-[90vmax] w-[90vmax]',
                    'bg-violet-600/[0.08]',
                    'blur-[130px]',
                    'motion-safe:animate-blob-1',
                ].join(' ')}
            />

            {/* Blob 2 — sky-blue, lower-right */}
            <div
                className={[
                    'absolute rounded-full',
                    '-bottom-[25%] -right-[10%]',
                    'h-[75vmax] w-[75vmax]',
                    'bg-sky-500/[0.06]',
                    'blur-[110px]',
                    'motion-safe:animate-blob-2',
                ].join(' ')}
            />

            {/* Blob 3 — indigo, center-right */}
            <div
                className={[
                    'absolute rounded-full',
                    'top-[35%] left-[45%]',
                    'h-[55vmax] w-[55vmax]',
                    'bg-indigo-500/[0.05]',
                    'blur-[90px]',
                    'motion-safe:animate-blob-3',
                ].join(' ')}
            />
        </div>
    )
}

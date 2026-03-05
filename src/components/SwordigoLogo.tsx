interface SwordigoLogoProps {
    size?: number
    showWordmark?: boolean
}

/**
 * SwordigoPlus brand mark — inline SVG sword + plus with gradient,
 * accompanied by the wordmark when showWordmark is true (default).
 */
export function SwordigoLogo({ size = 38, showWordmark = true }: SwordigoLogoProps) {
    return (
        <div className="flex items-center gap-3" role="img" aria-label="SwordigoPlus">
            <svg
                width={size}
                height={size}
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
            >
                <rect width="40" height="40" rx="10" fill="url(#sp-logo-grad)" />
                {/* Sword blade */}
                <path
                    d="M20 6.5 L23.2 10.5 L22.3 27 L20 33 L17.7 27 L16.8 10.5 Z"
                    fill="white"
                    fillOpacity="0.93"
                />
                {/* Cross-guard */}
                <rect x="12.5" y="17.5" width="15" height="4" rx="2" fill="white" fillOpacity="0.85" />
                {/* Plus accent (upper-right) */}
                <line x1="27.5" y1="8" x2="27.5" y2="13" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeOpacity="0.72" />
                <line x1="25" y1="10.5" x2="30" y2="10.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeOpacity="0.72" />
                <defs>
                    <linearGradient id="sp-logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#4338ca" />
                    </linearGradient>
                </defs>
            </svg>

            {showWordmark && (
                <span className="text-[1.25rem] font-semibold tracking-tight leading-none select-none">
                    Swordigo<span className="text-primary">Plus</span>
                </span>
            )}
        </div>
    )
}

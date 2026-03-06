/**
 * src/lib/redirect.ts
 * Safe post-login redirect.
 *
 * The ?redirect= param is an opaque key — never a raw URL.
 * We validate it against an allowlist, so open-redirect attacks are impossible.
 */

// ── Allowlist ────────────────────────────────────────────────────────────────
const REDIRECT_MAP: Record<string, string> = {
    copilot: 'https://copilot.swordigoplus.cf',
}

/**
 * Return the destination URL after a successful login/register.
 * Falls back to '/' if the param is absent or unrecognised.
 */
export function getPostLoginUrl(): string {
    const param = new URLSearchParams(window.location.search).get('redirect') ?? ''
    return REDIRECT_MAP[param] ?? '/'
}

/**
 * Return the current ?redirect= value (used when switching between login ↔ register).
 * Returns '' if not present.
 */
export function getRedirectParam(): string {
    return new URLSearchParams(window.location.search).get('redirect') ?? ''
}

/**
 * Build a path preserving the ?redirect= param.
 * e.g. buildAuthPath('/register') → '/register?redirect=copilot'
 */
export function buildAuthPath(base: string): string {
    const r = getRedirectParam()
    return r ? `${base}?redirect=${encodeURIComponent(r)}` : base
}

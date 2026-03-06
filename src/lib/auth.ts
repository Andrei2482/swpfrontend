/**
 * src/lib/auth.ts
 * Central auth state + silent refresh.
 * Access token lives only in-memory — never localStorage (XSS risk).
 */

const API = import.meta.env.VITE_API_URL as string

export interface AuthUser {
    id: string
    username: string
    email: string
    display_name: string | null
    role: string
}

// ── In-memory token ──────────────────────────────────────────────────────────
// Initialise from sessionStorage so a page refresh within the same tab keeps
// the user logged in without touching the HttpOnly cookie unnecessarily.
let _accessToken: string | null = sessionStorage.getItem('swp_access_token')

export function getAccessToken(): string | null {
    return _accessToken
}

function setAccessToken(token: string): void {
    _accessToken = token
    // sessionStorage — scoped to the tab, wiped when it closes.
    // Never localStorage — that survives XSS across all tabs forever.
    sessionStorage.setItem('swp_access_token', token)
}

function clearAccessToken(): void {
    _accessToken = null
    sessionStorage.removeItem('swp_access_token')
}

// ── Silent token refresh ─────────────────────────────────────────────────────
// Sends the swp_refresh HttpOnly cookie automatically (credentials:'include').
// Returns the new access token, or null if the refresh token has expired.
export async function silentRefresh(): Promise<string | null> {
    try {
        const res = await fetch(`${API}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        })
        if (!res.ok) {
            clearAccessToken()
            return null
        }
        const json = await res.json() as { data: { tokens: { access_token: string } } }
        const token = json.data.tokens.access_token
        setAccessToken(token)
        return token
    } catch {
        clearAccessToken()
        return null
    }
}

// ── Logout ───────────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
    try {
        await fetch(`${API}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: { Authorization: `Bearer ${_accessToken ?? ''}` },
        })
    } finally {
        clearAccessToken()
    }
}

// ── Store tokens from login / register response ───────────────────────────────
export function storeTokens(accessToken: string): void {
    setAccessToken(accessToken)
}

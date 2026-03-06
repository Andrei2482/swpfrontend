/**
 * src/lib/api.ts
 * Authenticated fetch wrapper.
 *
 * • Always sends credentials:'include' (the swp_refresh HttpOnly cookie)
 * • Automatically silently refreshes the access token on 401 TOKEN_EXPIRED
 * • On double-401 (refresh also failed) → hard redirect to login
 */

import { getAccessToken, silentRefresh } from './auth'
import { getRedirectParam } from './redirect'

const API = import.meta.env.VITE_API_URL as string

export class ApiError extends Error {
    constructor(
        public readonly code: string,
        message: string,
        public readonly status: number,
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

/**
 * Low-level fetch — sets JSON headers + Bearer token, never throws on HTTP errors.
 */
function rawFetch(path: string, token: string | null, init: RequestInit): Promise<Response> {
    return fetch(`${API}${path}`, {
        ...init,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(init.headers ?? {}),
        },
    })
}

/**
 * Main fetch wrapper. Handles the silent-refresh dance and provides
 * consistent ApiError objects for callers.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
    let res = await rawFetch(path, getAccessToken(), init)

    // Attempt one silent refresh on 401
    if (res.status === 401) {
        const newToken = await silentRefresh()
        if (!newToken) {
            // Both tokens expired — send to login, keeping the redirect param
            const r = getRedirectParam()
            window.location.href = r
                ? `/login?redirect=${encodeURIComponent(r)}`
                : '/login'
            return res // unreachable but keeps TS happy
        }
        res = await rawFetch(path, newToken, init)
    }

    return res
}

/**
 * Like apiFetch but throws ApiError on non-ok responses.
 * Use when you want one-liner error handling.
 */
export async function apiFetchOrThrow<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await apiFetch(path, init)
    const json = await res.json() as { ok: boolean; data?: T; error?: { code: string; message: string } }
    if (!res.ok || !json.ok) {
        const code = json.error?.code ?? 'UNKNOWN_ERROR'
        const message = json.error?.message ?? 'An unexpected error occurred.'
        throw new ApiError(code, message, res.status)
    }
    return json.data as T
}

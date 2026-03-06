import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

import { AnimatedBackground } from '@/components/AnimatedBackground'
import { SwordigoLogo } from '@/components/SwordigoLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { storeTokens } from '@/lib/auth'
import { getPostLoginUrl, buildAuthPath } from '@/lib/redirect'

const API = import.meta.env.VITE_API_URL as string

const schema = z.object({
    email: z.string().min(1, 'Required').email('Invalid email address'),
    password: z.string().min(1, 'Required'),
})
type FormValues = z.infer<typeof schema>

interface ApiLoginResponse {
    ok: boolean
    data?: {
        tokens: { access_token: string; token_type: string; expires_in: number }
        user: { id: string; username: string; email: string; display_name: string | null; role: string }
    }
    error?: { code: string; message: string }
}

export default function LoginPage() {
    const [showPw, setShowPw] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const navigate = useNavigate()

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: '', password: '' },
        mode: 'onChange',
    })

    async function onSubmit(values: FormValues) {
        setIsLoading(true)
        setServerError(null)
        try {
            const res = await fetch(`${API}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })
            const json = await res.json() as ApiLoginResponse

            if (!res.ok || !json.ok) {
                const code = json.error?.code
                if (code === 'RATE_LIMITED') {
                    setServerError('Too many attempts. Please wait a moment before trying again.')
                } else if (code === 'ACCOUNT_BANNED') {
                    setServerError('Your account has been suspended. Contact support for assistance.')
                } else {
                    setServerError(json.error?.message ?? 'Invalid email or password.')
                }
                return
            }

            storeTokens(json.data!.tokens.access_token)

            const dest = getPostLoginUrl()
            if (dest.startsWith('http')) {
                window.location.href = dest
            } else {
                navigate(dest, { replace: true })
            }
        } catch {
            setServerError('Could not reach the server. Check your connection and try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="relative min-h-dvh flex flex-col items-center justify-center px-6">
            <AnimatedBackground />

            <div className="w-full max-w-sm animate-fade-in">
                <div className="mb-10">
                    <SwordigoLogo />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight mb-1">Welcome back</h1>
                <p className="text-sm text-muted-foreground mb-8">Sign in to your account</p>

                {serverError && (
                    <p role="alert" aria-live="assertive" className="mb-5 text-sm text-destructive">
                        {serverError}
                    </p>
                )}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                        noValidate
                        aria-label="Sign in"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            inputMode="email"
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            autoCapitalize="none"
                                            spellCheck={false}
                                            autoFocus
                                            disabled={isLoading}
                                            aria-required="true"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Password</FormLabel>
                                        <Link
                                            to={buildAuthPath('/forgot-password')}
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm px-0.5"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPw ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                autoComplete="current-password"
                                                disabled={isLoading}
                                                className="pr-10"
                                                aria-required="true"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
                                                onClick={() => setShowPw((v) => !v)}
                                                aria-label={showPw ? 'Hide password' : 'Show password'}
                                                tabIndex={0}
                                            >
                                                {showPw
                                                    ? <EyeOff className="size-4" aria-hidden="true" />
                                                    : <Eye className="size-4" aria-hidden="true" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            {isLoading
                                ? <><Loader2 className="animate-spin" aria-hidden="true" /><span>Signing in…</span></>
                                : 'Sign in'}
                        </Button>
                    </form>
                </Form>

                <p className="mt-8 text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link
                        to={buildAuthPath('/register')}
                        className="text-foreground font-medium hover:text-primary transition-colors"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </main>
    )
}

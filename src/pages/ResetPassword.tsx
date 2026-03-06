import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react'

import { AnimatedBackground } from '@/components/AnimatedBackground'
import { SwordigoLogo } from '@/components/SwordigoLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const API = import.meta.env.VITE_API_URL as string

const schema = z.object({
    password: z
        .string()
        .min(8, 'At least 8 characters')
        .regex(/[A-Z]/, 'One uppercase letter required')
        .regex(/[a-z]/, 'One lowercase letter required')
        .regex(/[0-9]/, 'One number required'),
    confirm_password: z.string().min(1, 'Required'),
}).refine((d) => d.password === d.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
})

type FormValues = z.infer<typeof schema>

interface ApiResponse {
    ok: boolean
    error?: { code: string; message: string }
}

function getStrength(pw: string) {
    if (!pw) return { score: 0, label: '', color: '' }
    let s = 0
    if (pw.length >= 8) s++
    if (pw.length >= 12) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    if (s <= 1) return { score: 20, label: 'Very weak', color: 'text-red-500' }
    if (s === 2) return { score: 40, label: 'Weak', color: 'text-orange-500' }
    if (s === 3) return { score: 60, label: 'Fair', color: 'text-yellow-500' }
    if (s === 4) return { score: 80, label: 'Strong', color: 'text-green-600' }
    return { score: 100, label: 'Very strong', color: 'text-emerald-600' }
}

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const [showPw, setShowPw] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { password: '', confirm_password: '' },
        mode: 'onChange',
    })

    const pw = form.watch('password')
    const strength = getStrength(pw)

    async function onSubmit(values: FormValues) {
        if (!token) return
        setIsLoading(true)
        setServerError(null)
        try {
            const res = await fetch(`${API}/auth/reset-password`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: values.password }),
            })
            const json = await res.json() as ApiResponse

            if (!res.ok || !json.ok) {
                const code = json.error?.code
                if (code === 'TOKEN_EXPIRED' || code === 'TOKEN_REVOKED' || code === 'NOT_FOUND') {
                    setServerError('This link has expired or already been used. Please request a new one.')
                } else if (code === 'RATE_LIMITED') {
                    setServerError('Too many attempts. Please wait before trying again.')
                } else {
                    setServerError(json.error?.message ?? 'Something went wrong. Please try again.')
                }
                return
            }

            setDone(true)
        } catch {
            setServerError('Could not reach the server. Check your connection and try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // Missing / invalid token guard
    if (!token) {
        return (
            <main className="relative min-h-dvh flex flex-col items-center justify-center px-6">
                <AnimatedBackground />
                <div className="w-full max-w-sm animate-fade-in space-y-4">
                    <div className="mb-10"><SwordigoLogo /></div>
                    <h1 className="text-2xl font-semibold tracking-tight">Invalid link</h1>
                    <p className="text-sm text-muted-foreground">This reset link is missing or invalid. Please request a new one.</p>
                    <Link to="/forgot-password" className="text-sm text-foreground font-medium hover:text-primary transition-colors">
                        Request a new link →
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="relative min-h-dvh flex flex-col items-center justify-center px-6">
            <AnimatedBackground />

            <div className="w-full max-w-sm animate-fade-in">
                <div className="mb-10"><SwordigoLogo /></div>

                {done ? (
                    <div className="space-y-4">
                        <ShieldCheck className="size-8 text-foreground" aria-hidden="true" />
                        <h1 className="text-2xl font-semibold tracking-tight">Password updated</h1>
                        <p className="text-sm text-muted-foreground">
                            Your password has been changed. You can now sign in with your new credentials.
                        </p>
                        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-foreground font-medium hover:text-primary transition-colors">
                            <ArrowLeft className="size-3.5" aria-hidden="true" />
                            Go to sign in
                        </Link>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold tracking-tight mb-1">Choose a new password</h1>
                        <p className="text-sm text-muted-foreground mb-8">Make it strong — you won't need to change it often.</p>

                        {serverError && (
                            <p role="alert" aria-live="assertive" className="mb-5 text-sm text-destructive">{serverError}</p>
                        )}

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate aria-label="Set new password">
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type={showPw ? 'text' : 'password'} placeholder="••••••••"
                                                    autoComplete="new-password" disabled={isLoading} className="pr-10" aria-required="true" {...field} />
                                                <button type="button" tabIndex={0} aria-label={showPw ? 'Hide' : 'Show'}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
                                                    onClick={() => setShowPw((v) => !v)}>
                                                    {showPw ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        {pw && (
                                            <div className="space-y-1 pt-0.5" aria-live="polite" aria-label={`Password strength: ${strength.label}`}>
                                                <Progress value={strength.score} className="h-1" aria-hidden="true" />
                                                <p className={`text-xs ${strength.color}`} aria-hidden="true">{strength.label}</p>
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="confirm_password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm new password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
                                                    autoComplete="new-password" disabled={isLoading} className="pr-10" aria-required="true" {...field} />
                                                <button type="button" tabIndex={0} aria-label={showConfirm ? 'Hide' : 'Show'}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
                                                    onClick={() => setShowConfirm((v) => !v)}>
                                                    {showConfirm ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <Button type="submit" className="w-full" size="lg" disabled={isLoading} aria-busy={isLoading}>
                                    {isLoading
                                        ? <><Loader2 className="animate-spin" aria-hidden="true" /><span>Updating…</span></>
                                        : 'Update password'}
                                </Button>
                            </form>
                        </Form>

                        <Link to="/login" className="mt-8 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                            <ArrowLeft className="size-3.5" aria-hidden="true" />
                            Back to sign in
                        </Link>
                    </>
                )}
            </div>
        </main>
    )
}

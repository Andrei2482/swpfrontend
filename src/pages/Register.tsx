import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup, faWandMagicSparkles, faEarthAmericas } from '@fortawesome/free-solid-svg-icons'

import { AnimatedBackground } from '@/components/AnimatedBackground'
import { SwordigoLogo } from '@/components/SwordigoLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import {
    Form, FormControl, FormDescription, FormField,
    FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { storeTokens } from '@/lib/auth'
import { getPostLoginUrl, buildAuthPath } from '@/lib/redirect'

const API = import.meta.env.VITE_API_URL as string

const schema = z.object({
    email: z.string().min(1, 'Required').email('Invalid email address'),
    username: z
        .string()
        .min(3, 'At least 3 characters')
        .max(20, 'Max 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscores only'),
    password: z
        .string()
        .min(8, 'At least 8 characters')
        .regex(/[A-Z]/, 'One uppercase letter required')
        .regex(/[a-z]/, 'One lowercase letter required')
        .regex(/[0-9]/, 'One number required'),
    confirm_password: z.string().min(1, 'Required'),
    terms: z.literal<boolean>(true, {
        errorMap: () => ({ message: 'You must accept the terms to continue' }),
    }),
}).refine((d) => d.password === d.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
})

type FormValues = z.infer<typeof schema>

interface ApiRegisterResponse {
    ok: boolean
    data?: { tokens: { access_token: string }; user: { id: string; username: string } }
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

const BENEFITS = [
    { icon: faLayerGroup, title: 'Mod Framework', description: 'Get access to the latest online features and connect your mods securely.' },
    { icon: faWandMagicSparkles, title: 'Copilot AI', description: 'Access next-generation AI technologies — ask anything about the game.' },
    { icon: faEarthAmericas, title: 'Network', description: 'Access communities, chats, the multiplayer global network and much more.' },
]

export default function RegisterPage() {
    const [showPw, setShowPw] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const navigate = useNavigate()

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: '', username: '', password: '', confirm_password: '', terms: false as unknown as true },
        mode: 'onChange',
    })

    const pw = form.watch('password')
    const strength = getStrength(pw)

    async function onSubmit(values: FormValues) {
        setIsLoading(true)
        setServerError(null)
        try {
            const { confirm_password: _, terms: __, ...payload } = values
            const res = await fetch(`${API}/auth/register`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const json = await res.json() as ApiRegisterResponse

            if (!res.ok || !json.ok) {
                const code = json.error?.code
                if (code === 'EMAIL_TAKEN') setServerError('This email is already registered. Try signing in instead.')
                else if (code === 'USERNAME_TAKEN') setServerError('That username is taken. Please choose another.')
                else if (code === 'RATE_LIMITED') setServerError('Too many attempts. Please wait before trying again.')
                else setServerError(json.error?.message ?? 'Registration failed. Please try again.')
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
        <main className="relative min-h-dvh flex flex-col lg:flex-row">
            <AnimatedBackground />

            {/* Left: Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-14">
                <div className="w-full max-w-sm animate-fade-in">
                    <div className="mb-10"><SwordigoLogo /></div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Create account</h1>
                    <p className="text-sm text-muted-foreground mb-8">Start your journey on SwordigoPlus</p>

                    {serverError && (
                        <p role="alert" aria-live="assertive" className="mb-5 text-sm text-destructive">{serverError}</p>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate aria-label="Create account">
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" inputMode="email" placeholder="you@example.com" autoComplete="email"
                                            autoCapitalize="none" spellCheck={false} autoFocus disabled={isLoading} aria-required="true" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="username" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="yourname" autoComplete="username"
                                            autoCapitalize="none" spellCheck={false} disabled={isLoading} maxLength={20}
                                            aria-required="true" {...field} onChange={(e) => field.onChange(e.target.value.toLowerCase())} />
                                    </FormControl>
                                    <FormDescription>Letters, numbers, underscores · 3–20 chars</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type={showPw ? 'text' : 'password'} placeholder="••••••••"
                                                autoComplete="new-password" disabled={isLoading} className="pr-10"
                                                aria-required="true" {...field} />
                                            <button type="button" tabIndex={0} aria-label={showPw ? 'Hide password' : 'Show password'}
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
                                    <FormLabel>Confirm password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
                                                autoComplete="new-password" disabled={isLoading} className="pr-10"
                                                aria-required="true" {...field} />
                                            <button type="button" tabIndex={0} aria-label={showConfirm ? 'Hide confirmation' : 'Show confirmation'}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
                                                onClick={() => setShowConfirm((v) => !v)}>
                                                {showConfirm ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="terms" render={({ field }) => (
                                <FormItem className="flex flex-row items-start gap-3 space-y-0 pt-1">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange}
                                            disabled={isLoading} aria-required="true" id="terms-checkbox" />
                                    </FormControl>
                                    <div className="leading-snug">
                                        <FormLabel htmlFor="terms-checkbox" className="font-normal text-sm text-muted-foreground cursor-pointer">
                                            I agree to the{' '}
                                            <Link to="/terms" className="text-foreground hover:text-primary underline underline-offset-4 transition-colors" target="_blank" rel="noopener noreferrer">Terms of Service</Link>
                                            {' '}and{' '}
                                            <Link to="/privacy" className="text-foreground hover:text-primary underline underline-offset-4 transition-colors" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
                                        </FormLabel>
                                        <FormMessage className="mt-1" />
                                    </div>
                                </FormItem>
                            )} />

                            <Button type="submit" className="w-full" size="lg" disabled={isLoading} aria-busy={isLoading}>
                                {isLoading
                                    ? <><Loader2 className="animate-spin" aria-hidden="true" /><span>Creating account…</span></>
                                    : 'Create account'}
                            </Button>
                        </form>
                    </Form>

                    <p className="mt-7 text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to={buildAuthPath('/login')} className="text-foreground font-medium hover:text-primary transition-colors">Sign in</Link>
                    </p>
                </div>
            </div>

            {/* Right: Benefits */}
            <aside className="hidden lg:flex lg:w-[400px] xl:w-[460px] flex-col justify-center px-12 xl:px-16 py-14 border-l border-border bg-zinc-50/70"
                aria-label="Why join SwordigoPlus">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Why SwordigoPlus?</p>
                <h2 className="text-2xl font-semibold tracking-tight mb-10">Join the network</h2>
                <ul className="space-y-7" role="list">
                    {BENEFITS.map((b) => (
                        <li key={b.title} className="flex items-start gap-4">
                            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white shadow-sm text-foreground" aria-hidden="true">
                                <FontAwesomeIcon icon={b.icon} className="size-4" />
                            </span>
                            <div>
                                <p className="text-sm font-semibold mb-0.5">{b.title}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </aside>
        </main>
    )
}

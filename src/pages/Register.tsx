import { useState } from 'react'
import { Link } from 'react-router-dom'
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
import { Progress } from '@/components/ui/progress'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

/* ── Schema ─────────────────────────────────────────────────────────────── */
const registerSchema = z
    .object({
        email: z.string().min(1, 'Required').email('Invalid email'),
        username: z
            .string()
            .min(3, 'At least 3 characters')
            .max(20, 'Max 20 characters')
            .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscores only'),
        display_name: z.string().max(40, 'Max 40 characters').optional().or(z.literal('')),
        password: z
            .string()
            .min(8, 'At least 8 characters')
            .regex(/[A-Z]/, 'One uppercase letter required')
            .regex(/[0-9]/, 'One number required'),
        confirm_password: z.string().min(1, 'Required'),
    })
    .refine((d) => d.password === d.confirm_password, {
        message: "Passwords don't match",
        path: ['confirm_password'],
    })

type RegisterValues = z.infer<typeof registerSchema>

/* ── Password strength ──────────────────────────────────────────────────── */
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

/* ── Benefits data ──────────────────────────────────────────────────────── */
const BENEFITS = [
    {
        icon: faLayerGroup,
        title: 'Mod Framework',
        description: 'Get access to the latest online features and connect your mods to the live SwordigoPlus network securely.',
    },
    {
        icon: faWandMagicSparkles,
        title: 'Copilot AI',
        description: 'Access next-generation AI technologies — ask anything about the game and get instant, accurate answers.',
    },
    {
        icon: faEarthAmericas,
        title: 'Network',
        description: 'Access communities and chats, the multiplayer global network, forums, wikis, and much more.',
    },
]

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function RegisterPage() {
    const [showPw, setShowPw] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { email: '', username: '', display_name: '', password: '', confirm_password: '' },
        mode: 'onChange',
    })

    const pw = form.watch('password')
    const strength = getStrength(pw)

    async function onSubmit(_values: RegisterValues) {
        setIsLoading(true)
        setServerError(null)
        try {
            await new Promise((r) => setTimeout(r, 1000))
            // TODO: await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, { method:'POST', ... })
        } catch {
            setServerError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="relative min-h-dvh flex flex-col lg:flex-row">
            <AnimatedBackground />

            {/* ── Left: Form ─────────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 lg:py-12">
                <div className="w-full max-w-sm animate-fade-in">
                    <div className="mb-10">
                        <SwordigoLogo />
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Create account</h1>
                    <p className="text-sm text-muted-foreground mb-8">Start your journey on SwordigoPlus</p>

                    {serverError && (
                        <p role="alert" aria-live="polite" className="mb-5 text-sm text-destructive">
                            {serverError}
                        </p>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="you@example.com" autoComplete="email" autoFocus disabled={isLoading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="yourname"
                                                autoComplete="username"
                                                disabled={isLoading}
                                                maxLength={20}
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                                            />
                                        </FormControl>
                                        <FormDescription>Letters, numbers, underscores · 3–20 chars</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="display_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Display name{' '}
                                            <span className="text-muted-foreground font-normal">(optional)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Your Name" autoComplete="name" disabled={isLoading} maxLength={40} {...field} />
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
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPw ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    autoComplete="new-password"
                                                    disabled={isLoading}
                                                    className="pr-10"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
                                                    onClick={() => setShowPw((v) => !v)}
                                                    aria-label={showPw ? 'Hide password' : 'Show password'}
                                                >
                                                    {showPw ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        {pw && (
                                            <div className="space-y-1 pt-0.5" aria-live="polite">
                                                <Progress value={strength.score} className="h-1" aria-hidden="true" />
                                                <p className={`text-xs ${strength.color}`}>{strength.label}</p>
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirm_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirm ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    autoComplete="new-password"
                                                    disabled={isLoading}
                                                    className="pr-10"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
                                                    onClick={() => setShowConfirm((v) => !v)}
                                                    aria-label={showConfirm ? 'Hide' : 'Show'}
                                                >
                                                    {showConfirm ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full mt-1" size="lg" disabled={isLoading} aria-busy={isLoading}>
                                {isLoading
                                    ? <><Loader2 className="animate-spin" aria-hidden="true" /> Creating account…</>
                                    : 'Create account'}
                            </Button>
                        </form>
                    </Form>

                    <p className="mt-8 text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="text-foreground font-medium hover:text-primary transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* ── Right: Benefits ────────────────────────────────────────────── */}
            <aside
                className="
          hidden lg:flex
          lg:w-[420px] xl:w-[480px] 2xl:w-[520px]
          flex-col justify-center
          px-12 xl:px-16 py-14
          border-l border-border
          bg-zinc-50/60
        "
                aria-label="Platform benefits"
            >
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Why SwordigoPlus?
                </p>
                <h2 className="text-2xl font-semibold tracking-tight mb-10">
                    Join the network
                </h2>

                <ul className="space-y-8" role="list">
                    {BENEFITS.map((b) => (
                        <li key={b.title} className="flex items-start gap-4">
                            {/* Icon */}
                            <span
                                className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-foreground shadow-sm"
                                aria-hidden="true"
                            >
                                <FontAwesomeIcon icon={b.icon} className="size-4" />
                            </span>
                            {/* Text */}
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

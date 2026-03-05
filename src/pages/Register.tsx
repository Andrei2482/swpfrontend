import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, AlertCircle, AtSign, User } from 'lucide-react'

import { AnimatedBackground } from '@/components/AnimatedBackground'
import { SwordigoLogo } from '@/components/SwordigoLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

/* ── Zod schema matching POST /auth/register ────────────────────────────── */
const registerSchema = z
    .object({
        email: z
            .string()
            .min(1, 'Email is required.')
            .email('Please enter a valid email address.'),
        username: z
            .string()
            .min(3, 'Username must be at least 3 characters.')
            .max(20, 'Username must be 20 characters or fewer.')
            .regex(
                /^[a-zA-Z0-9_]+$/,
                'Username may only contain letters, numbers, and underscores.',
            ),
        display_name: z
            .string()
            .max(40, 'Display name must be 40 characters or fewer.')
            .optional()
            .or(z.literal('')),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters.')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
            .regex(/[0-9]/, 'Password must contain at least one number.'),
        confirm_password: z.string().min(1, 'Please confirm your password.'),
    })
    .refine((d) => d.password === d.confirm_password, {
        message: 'Passwords do not match.',
        path: ['confirm_password'],
    })

type RegisterValues = z.infer<typeof registerSchema>

/* ── Password strength ─────────────────────────────────────────────────── */
function getStrength(pw: string): { score: number; label: string; color: string } {
    if (!pw) return { score: 0, label: '', color: '' }
    let s = 0
    if (pw.length >= 8) s++
    if (pw.length >= 12) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    if (s <= 1) return { score: 20, label: 'Very weak', color: 'text-red-400' }
    if (s === 2) return { score: 40, label: 'Weak', color: 'text-orange-400' }
    if (s === 3) return { score: 60, label: 'Fair', color: 'text-yellow-400' }
    if (s === 4) return { score: 80, label: 'Strong', color: 'text-green-400' }
    return { score: 100, label: 'Very strong', color: 'text-emerald-400' }
}

/* ── Page component ─────────────────────────────────────────────────────── */
export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            username: '',
            display_name: '',
            password: '',
            confirm_password: '',
        },
        mode: 'onChange',
    })

    const passwordValue = form.watch('password')
    const strength = getStrength(passwordValue)

    async function onSubmit(_values: RegisterValues) {
        setIsLoading(true)
        setServerError(null)
        try {
            // TODO: replace with real API call
            // const { confirm_password: _, ...payload } = values
            // const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   credentials: 'include',
            //   body: JSON.stringify(payload),
            // })
            await new Promise((r) => setTimeout(r, 1000))
        } catch {
            setServerError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="relative min-h-dvh flex items-center justify-center px-4 py-12 sm:px-6">
            <AnimatedBackground />

            <div className="w-full max-w-[440px] animate-fade-in">
                {/* Brand */}
                <div className="flex justify-center mb-10">
                    <SwordigoLogo />
                </div>

                <Card className="glass-card border-white/[0.06] bg-transparent shadow-2xl">
                    <CardHeader className="space-y-1 pb-5">
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                            Create an account
                        </CardTitle>
                        <CardDescription>
                            Join the SwordigoPlus community today
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Server error banner */}
                        {serverError && (
                            <div
                                role="alert"
                                aria-live="polite"
                                className="mb-5 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive animate-fade-in"
                            >
                                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                                <span>{serverError}</span>
                            </div>
                        )}

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                                noValidate
                                aria-label="Create account form"
                            >
                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    autoComplete="email"
                                                    autoFocus
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Username */}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <AtSign
                                                        className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                                                        aria-hidden="true"
                                                    />
                                                    <Input
                                                        type="text"
                                                        placeholder="yourname"
                                                        autoComplete="username"
                                                        disabled={isLoading}
                                                        className="pl-8"
                                                        maxLength={20}
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(e.target.value.toLowerCase())
                                                        }
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                3–20 characters, letters, numbers and underscores only.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Display name (optional) */}
                                <FormField
                                    control={form.control}
                                    name="display_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Display name{' '}
                                                <span className="text-muted-foreground font-normal">
                                                    (optional)
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User
                                                        className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                                                        aria-hidden="true"
                                                    />
                                                    <Input
                                                        type="text"
                                                        placeholder="Your Name"
                                                        autoComplete="name"
                                                        disabled={isLoading}
                                                        className="pl-8"
                                                        maxLength={40}
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="••••••••"
                                                        autoComplete="new-password"
                                                        disabled={isLoading}
                                                        className="pr-10"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                        onClick={() => setShowPassword((v) => !v)}
                                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    >
                                                        {showPassword
                                                            ? <EyeOff className="size-4" aria-hidden="true" />
                                                            : <Eye className="size-4" aria-hidden="true" />
                                                        }
                                                    </button>
                                                </div>
                                            </FormControl>
                                            {/* Strength meter */}
                                            {passwordValue && (
                                                <div className="space-y-1 pt-0.5" aria-live="polite" aria-label={`Password strength: ${strength.label}`}>
                                                    <Progress
                                                        value={strength.score}
                                                        className="h-1"
                                                        aria-hidden="true"
                                                    />
                                                    <p className={`text-xs font-medium ${strength.color}`}>
                                                        {strength.label}
                                                    </p>
                                                </div>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Confirm password */}
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
                                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                        onClick={() => setShowConfirm((v) => !v)}
                                                        aria-label={showConfirm ? 'Hide password confirmation' : 'Show password confirmation'}
                                                    >
                                                        {showConfirm
                                                            ? <EyeOff className="size-4" aria-hidden="true" />
                                                            : <Eye className="size-4" aria-hidden="true" />
                                                        }
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    className="w-full mt-2"
                                    size="lg"
                                    disabled={isLoading}
                                    aria-busy={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" aria-hidden="true" />
                                            <span>Creating account…</span>
                                        </>
                                    ) : (
                                        'Create account'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                    <CardFooter className="justify-center border-t border-white/[0.05] pt-5">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                <p className="mt-6 text-center text-xs text-muted-foreground/60">
                    By creating an account you agree to our{' '}
                    <Link
                        to="/terms"
                        className="underline underline-offset-4 hover:text-muted-foreground transition-colors"
                    >
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                        to="/privacy"
                        className="underline underline-offset-4 hover:text-muted-foreground transition-colors"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </main>
    )
}

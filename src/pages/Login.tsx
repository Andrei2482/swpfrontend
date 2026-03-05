import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'

import { AnimatedBackground } from '@/components/AnimatedBackground'
import { SwordigoLogo } from '@/components/SwordigoLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

/* ── Zod schema matching POST /auth/login ──────────────────────────────── */
const loginSchema = z.object({
    email: z.string().min(1, 'Email is required.').email('Please enter a valid email address.'),
    password: z.string().min(1, 'Password is required.'),
})

type LoginValues = z.infer<typeof loginSchema>

/* ── Page component ────────────────────────────────────────────────────── */
export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    })

    async function onSubmit(_values: LoginValues) {
        setIsLoading(true)
        setServerError(null)
        try {
            // TODO: replace with real API call
            // const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   credentials: 'include',
            //   body: JSON.stringify(values),
            // })
            await new Promise((r) => setTimeout(r, 900))
            // Simulate a successful login for visual demo
        } catch {
            setServerError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="relative min-h-dvh flex items-center justify-center px-4 py-12 sm:px-6">
            <AnimatedBackground />

            <div className="w-full max-w-[420px] animate-fade-in">
                {/* Brand */}
                <div className="flex justify-center mb-10">
                    <SwordigoLogo />
                </div>

                <Card className="glass-card border-white/[0.06] bg-transparent shadow-2xl">
                    <CardHeader className="space-y-1 pb-5">
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                            Welcome back
                        </CardTitle>
                        <CardDescription>
                            Sign in to your SwordigoPlus account
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
                                aria-label="Sign in form"
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

                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel>Password</FormLabel>
                                                {/* Forgot password — visual only for now */}
                                                <Link
                                                    to="/forgot-password"
                                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
                                                    tabIndex={0}
                                                >
                                                    Forgot password?
                                                </Link>
                                            </div>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="••••••••"
                                                        autoComplete="current-password"
                                                        disabled={isLoading}
                                                        className="pr-10"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                        onClick={() => setShowPassword((v) => !v)}
                                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                        tabIndex={0}
                                                    >
                                                        {showPassword
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
                                            <span>Signing in…</span>
                                        </>
                                    ) : (
                                        'Sign in'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                    <CardFooter className="justify-center border-t border-white/[0.05] pt-5">
                        <p className="text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link
                                to="/register"
                                className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                            >
                                Create one
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                {/* Bottom note */}
                <p className="mt-6 text-center text-xs text-muted-foreground/60">
                    By signing in you agree to our{' '}
                    <Link to="/terms" className="underline underline-offset-4 hover:text-muted-foreground transition-colors">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="underline underline-offset-4 hover:text-muted-foreground transition-colors">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </main>
    )
}

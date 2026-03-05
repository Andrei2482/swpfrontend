import { useState } from 'react'
import { Link } from 'react-router-dom'
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

const loginSchema = z.object({
    email: z.string().min(1, 'Required').email('Invalid email'),
    password: z.string().min(1, 'Required'),
})
type LoginValues = z.infer<typeof loginSchema>

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
            await new Promise((r) => setTimeout(r, 900))
            // TODO: await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, { method:'POST', ... })
        } catch {
            setServerError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="relative min-h-dvh flex flex-col items-center justify-center px-6">
            <AnimatedBackground />

            <div className="w-full max-w-sm animate-fade-in">
                {/* Logo */}
                <div className="mb-10">
                    <SwordigoLogo />
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-semibold tracking-tight mb-1">Welcome back</h1>
                <p className="text-sm text-muted-foreground mb-8">Sign in to your account</p>

                {/* Error */}
                {serverError && (
                    <p role="alert" aria-live="polite" className="mb-5 text-sm text-destructive">
                        {serverError}
                    </p>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
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

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Password</FormLabel>
                                        <Link
                                            to="/forgot-password"
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Forgot?
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
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
                                                onClick={() => setShowPassword((v) => !v)}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword
                                                    ? <EyeOff className="size-4" aria-hidden="true" />
                                                    : <Eye className="size-4" aria-hidden="true" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" size="lg" disabled={isLoading} aria-busy={isLoading}>
                            {isLoading
                                ? <><Loader2 className="animate-spin" aria-hidden="true" /> Signing in…</>
                                : 'Sign in'}
                        </Button>
                    </form>
                </Form>

                <p className="mt-8 text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="text-foreground font-medium hover:text-primary transition-colors">
                        Create one
                    </Link>
                </p>
            </div>
        </main>
    )
}

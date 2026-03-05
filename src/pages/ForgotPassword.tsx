import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react'

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

const schema = z.object({
    email: z.string().min(1, 'Required').email('Invalid email address'),
})
type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: '' },
        mode: 'onChange',
    })

    async function onSubmit(_values: FormValues) {
        setIsLoading(true)
        setServerError(null)
        try {
            await new Promise((r) => setTimeout(r, 900))
            // TODO: await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { method:'POST', ... })
            setSent(true)
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
                <div className="mb-10">
                    <SwordigoLogo />
                </div>

                {sent ? (
                    /* ── Success state ── */
                    <div className="space-y-4">
                        <MailCheck className="size-8 text-foreground" aria-hidden="true" />
                        <h1 className="text-2xl font-semibold tracking-tight">Check your inbox</h1>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            If an account exists for{' '}
                            <span className="font-medium text-foreground">{form.getValues('email')}</span>,
                            we've sent a password reset link. It expires in 15 minutes.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Didn't receive it?{' '}
                            <button
                                type="button"
                                className="text-foreground font-medium hover:text-primary transition-colors"
                                onClick={() => { setSent(false); form.reset() }}
                            >
                                Try again
                            </button>
                        </p>
                    </div>
                ) : (
                    /* ── Request form ── */
                    <>
                        <h1 className="text-2xl font-semibold tracking-tight mb-1">Reset password</h1>
                        <p className="text-sm text-muted-foreground mb-8">
                            Enter your email and we'll send you a reset link.
                        </p>

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
                                aria-label="Request password reset"
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

                                <Button type="submit" className="w-full" size="lg" disabled={isLoading} aria-busy={isLoading}>
                                    {isLoading
                                        ? <><Loader2 className="animate-spin" aria-hidden="true" /><span>Sending…</span></>
                                        : 'Send reset link'}
                                </Button>
                            </form>
                        </Form>
                    </>
                )}

                <Link
                    to="/login"
                    className="mt-8 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                    <ArrowLeft className="size-3.5" aria-hidden="true" />
                    Back to sign in
                </Link>
            </div>
        </main>
    )
}

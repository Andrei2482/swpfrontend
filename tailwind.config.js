/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: { '2xl': '1400px' },
        },
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'blob-drift': {
                    '0%': { transform: 'translate(0, 0) scale(1)' },
                    '33%': { transform: 'translate(40px, -60px) scale(1.08)' },
                    '66%': { transform: 'translate(-30px, 30px) scale(0.93)' },
                    '100%': { transform: 'translate(0, 0) scale(1)' },
                },
                'blob-drift-2': {
                    '0%': { transform: 'translate(0, 0) scale(1)' },
                    '33%': { transform: 'translate(-50px, 40px) scale(1.06)' },
                    '66%': { transform: 'translate(35px, -40px) scale(0.96)' },
                    '100%': { transform: 'translate(0, 0) scale(1)' },
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '20%': { transform: 'translateX(-5px)' },
                    '40%': { transform: 'translateX(5px)' },
                    '60%': { transform: 'translateX(-5px)' },
                    '80%': { transform: 'translateX(5px)' },
                },
            },
            animation: {
                'blob-1': 'blob-drift 22s ease-in-out infinite',
                'blob-2': 'blob-drift-2 28s ease-in-out infinite',
                'blob-3': 'blob-drift 19s ease-in-out infinite reverse',
                'fade-in': 'fade-in 0.45s ease-out both',
                'shake': 'shake 0.4s ease-in-out',
            },
        },
    },
    plugins: [],
}

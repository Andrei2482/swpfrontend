import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        target: 'esnext',
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom', 'react-router-dom'],
                    radix: [
                        '@radix-ui/react-label',
                        '@radix-ui/react-progress',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-slot',
                    ],
                },
            },
        },
    },
})

import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
    },
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/css/app.css'],
            refresh: true,
        }),
        react({
            // Enable Fast Refresh for better development experience
            fastRefresh: true,
        }),
    ],
    build: {
        // Optimize chunk splitting for better caching
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['react', 'react-dom'],
                    'inertia': ['@inertiajs/react'],
                    'heroicons': ['@heroicons/react/24/outline', '@heroicons/react/24/solid'],
                }
            }
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 1000,
        // Use esbuild for faster minification
        minify: 'esbuild',
    },
    // Optimize dependencies
    optimizeDeps: {
        include: ['react', 'react-dom', '@inertiajs/react'],
    },
});

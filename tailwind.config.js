import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'trust-blue': '#1E40AF',
                'growth-green': '#059669',
                'alert-amber': '#D97706',
                'neutral-gray': '#6B7280',
                'family-purple': '#7C3AED',
                'calm-teal': '#0D9488',
                'warm-orange': '#F97316',
            },
        },
    },

    plugins: [forms],
};

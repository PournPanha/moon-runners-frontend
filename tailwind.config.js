/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                moon: "#F5D76E",
                night: "#0B0B0F",
                deep: "#0A1A2F",
                dark: "#05070A",
                gold: "#FFD700",
            },
            fontFamily: {
                'orbitron': ['Orbitron', 'sans-serif'],
                'inter': ['Inter', 'sans-serif'],
                'poppins': ['Poppins', 'sans-serif'],
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'spin-slow': 'spin 8s linear infinite',
                'bounce-slow': 'bounce 2s infinite',
            },
            keyframes: {
                glow: {
                    '0%': { textShadow: '0 0 10px rgba(245, 215, 110, 0.5)' },
                    '100%': { textShadow: '0 0 30px rgba(245, 215, 110, 0.8)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-moon': 'linear-gradient(135deg, #F5D76E 0%, #FFA500 100%)',
            },
        },
    },
    plugins: [],
}
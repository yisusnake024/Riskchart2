/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 10s linear infinite',
      },
      boxShadow: {
        'glow-red': '0 0 25px rgba(239, 68, 68, 0.3)',
        'glow-green': '0 0 25px rgba(16, 185, 129, 0.3)',
        'glow-blue': '0 0 25px rgba(6, 182, 212, 0.2)',
        'glow-purple': '0 0 25px rgba(139, 92, 246, 0.2)',
      }
    },
  },
  plugins: [],
}

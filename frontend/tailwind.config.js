/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-retro-easy',
    'bg-retro-medium',
    'bg-retro-hard',
    'text-retro-easy',
    'text-retro-medium',
    'text-retro-hard',
    'border-retro-easy',
    'border-retro-medium',
    'border-retro-hard',
  ],
  theme: {
    extend: {
      colors: {
        // RetroUI color palette (modernized: deeper contrast, neons)
        retro: {
          bg: '#0a0a0c',      // Deeper, modern dark background
          card: '#16161e',    // Glass-like card background
          text: '#ffffff',
          border: '#30363d',  // Subtle border
          accent: '#fbbf24',  // Amber/Yellow
          muted: '#8b949e',
          disabled: '#484f58',
          // Vibrant Neons for modern feel
          easy: '#10b981',    // Emerald
          medium: '#8b5cf6',  // Violet
          hard: '#ef4444',     // Rose
          glow: 'rgba(251, 191, 36, 0.3)',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neo': '0 0 20px rgba(0,0,0,0.5)',
        'glow-yellow': '0 0 15px rgba(251, 191, 36, 0.4)',
        'glow-green': '0 0 15px rgba(16, 185, 129, 0.4)',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'flicker': 'flicker 0.15s step-end infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 10s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}


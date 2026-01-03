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
        // Retro black & white palette
        retro: {
          bg: '#000000',
          text: '#ffffff',
          border: '#ffffff',
          muted: '#aaaaaa',
          disabled: '#555555',
          // Only allowed colors for difficulty
          easy: '#00ff00',    // Green
          medium: '#ff00ff',  // Purple/Magenta
          hard: '#ff0000',     // Red
        },
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'],
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'flicker': 'flicker 0.15s step-end infinite',
        'jitter': 'jitter 0.1s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
        'fade-in': 'fadeIn 0.3s step-end',
        'border-flash': 'borderFlash 0.2s step-end',
        'glitch': 'glitch 0.3s step-end',
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
        jitter: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-1px, 1px)' },
          '50%': { transform: 'translate(1px, -1px)' },
          '75%': { transform: 'translate(-1px, -1px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        borderFlash: {
          '0%, 100%': { borderColor: '#ffffff' },
          '50%': { borderColor: '#aaaaaa' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
      },
    },
  },
  plugins: [],
}


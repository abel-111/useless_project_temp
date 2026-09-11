/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ghost: {
          black: '#0a0a0c',
          dark: '#111115',
          card: '#161619',
          border: '#222228',
          green: '#00ff88',
          'green-dim': '#00cc6a',
          red: '#ff2244',
          'red-dim': '#cc1133',
          blue: '#4488ff',
          purple: '#8844ff',
          mist: '#aabbcc',
        },
      },
      fontFamily: {
        creepy: ['"Creepster"', 'cursive'],
        typewriter: ['"Special Elite"', 'cursive'],
        mono: ['"Fira Code"', 'monospace'],
      },
      animation: {
        flicker: 'flicker 3s infinite',
        pulse_slow: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        drift: 'drift 20s linear infinite',
        scanline: 'scanline 8s linear infinite',
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        slideUp: 'slideUp 0.5s ease-out forwards',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '41%': { opacity: '1' },
          '42%': { opacity: '0.8' },
          '43%': { opacity: '1' },
          '45%': { opacity: '0.3' },
          '46%': { opacity: '1' },
          '50%': { opacity: '1' },
          '51%': { opacity: '0.6' },
          '52%': { opacity: '1' },
          '90%': { opacity: '1' },
          '91%': { opacity: '0.5' },
          '92%': { opacity: '1' },
        },
        drift: {
          '0%': { transform: 'translateX(-100%) translateY(10%)' },
          '100%': { transform: 'translateX(100%) translateY(-10%)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { textShadow: '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 40px #00ff88' },
          '100%': { textShadow: '0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 80px #00ff88' },
        },
      },
    },
  },
  plugins: [],
};

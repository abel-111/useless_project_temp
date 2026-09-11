/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ghost: {
          black: '#07070a',
          dark: '#0f0f14',
          card: '#14141a',
          border: '#23232e',
          green: '#00ff88',
          'green-dim': '#00cc6a',
          red: '#ff0033',
          'red-dim': '#cc0028',
          blue: '#3b82f6',
          purple: '#9333ea',
          mist: '#c5ced9',
        },
        horror: {
          black: '#040406',
          card: '#0c0c12',
          border: '#33080f',
          red: '#ff0033',
          blood: '#880017',
          crimson: '#ba0624',
          bone: '#e2dfd2',
          toxic: '#00ff66',
        },
      },
      fontFamily: {
        creepy: ['"Creepster"', 'cursive'],
        typewriter: ['"Special Elite"', 'cursive'],
        mono: ['"Fira Code"', 'monospace'],
      },
      animation: {
        flicker: 'flicker 2.5s infinite',
        pulse_slow: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        drift: 'drift 20s linear infinite',
        scanline: 'scanline 8s linear infinite',
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        slideUp: 'slideUp 0.5s ease-out forwards',
        glow: 'glow 2s ease-in-out infinite alternate',
        glitch: 'glitch 1s infinite alternate',
        horror_shake: 'horror_shake 0.4s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '41%': { opacity: '1' },
          '42%': { opacity: '0.8' },
          '43%': { opacity: '1' },
          '45%': { opacity: '0.2' },
          '46%': { opacity: '1' },
          '50%': { opacity: '1' },
          '51%': { opacity: '0.4' },
          '52%': { opacity: '1' },
          '90%': { opacity: '1' },
          '91%': { opacity: '0.3' },
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
          '0%': { textShadow: '0 0 10px #ff0033, 0 0 20px #880017, 0 0 40px #ff0033' },
          '100%': { textShadow: '0 0 20px #ff0033, 0 0 40px #ff0033, 0 0 80px #ba0624' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-1px, -2px)' },
          '60%': { transform: 'translate(2px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
          '100%': { transform: 'translate(0)' },
        },
        horror_shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px) translateY(1px)' },
          '75%': { transform: 'translateX(3px) translateY(-1px)' },
        },
      },
    },
  },
  plugins: [],
};

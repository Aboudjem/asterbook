import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        stardust: {
          DEFAULT: '#fbbf24',
          dark: '#d97706',
        },
        // Asterbook Design System Colors
        aster: {
          cyan: '#00f3ff',
          blue: '#3b82f6',
          gold: '#f59e0b',
          deep: '#020617',
        },
        glass: {
          base: 'rgba(15, 23, 42, 0.60)',
          card: 'rgba(30, 41, 59, 0.45)',
          hover: 'rgba(51, 65, 85, 0.50)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 8s infinite',
        float: 'float 6s ease-in-out infinite',
        shooting: 'shooting 4s linear infinite',
        nebula: 'nebula 18s ease-in-out infinite',
        'gradient-spin': 'gradient-spin 3s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shooting: {
          '0%': { transform: 'translateX(-100%) translateY(-100%)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'translateX(100vw) translateY(100vh)', opacity: '0' },
        },
        nebula: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.5' },
          '50%': { transform: 'scale(1.1) rotate(180deg)', opacity: '0.7' },
        },
        'gradient-spin': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backdropBlur: {
        glass: '12px',
        'glass-lg': '16px',
        'glass-xl': '20px',
      },
      borderRadius: {
        glass: '16px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.37)',
        'glow-cyan': '0 0 20px rgba(0, 243, 255, 0.3)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;

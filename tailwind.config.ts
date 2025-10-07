import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Redefinir blue con verde agua
        blue: {
          50: '#f0faf9',
          100: '#d9f2f0',
          200: '#b3e5e0',
          300: '#9FD5D1',  // Color principal
          400: '#7ec9c4',
          500: '#5fb3ae',
          600: '#4a9d98',
          700: '#3a7e7a',
          800: '#2d6361',
          900: '#1f4544',
          950: '#162f2e',
          DEFAULT: '#9FD5D1'
        },
        primary: {
          50: '#f0faf9',
          100: '#d9f2f0',
          200: '#b3e5e0',
          300: '#9FD5D1',
          400: '#7ec9c4',
          500: '#5fb3ae',
          600: '#4a9d98',
          700: '#3a7e7a',
          800: '#2d6361',
          900: '#1f4544',
          950: '#162f2e',
          DEFAULT: '#9FD5D1',
          foreground: '#ffffff'
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
          DEFAULT: '#a855f7',
          foreground: '#ffffff'
        },
        background: '#0f172a',
        foreground: '#f8fafc',
        muted: {
          DEFAULT: '#1e293b',
          foreground: '#94a3b8'
        },
        border: '#334155',
        input: '#1e293b',
        ring: '#9FD5D1'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      }
    }
  },
  plugins: []
} satisfies Config;
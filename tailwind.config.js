/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,css}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── Named Color Aliases (used throughout templates) ───────────────
        'primary-navy':  '#0f172a',   // Deep Navy (dark text, dark bg sections)
        'primary-royal': '#1e3a8a',   // Royal Blue (buttons, accents)
        'primary-light': '#3b82f6',   // Bright Blue (hover, links)
        'accent-gold':   '#fbbf24',   // Gold (badges, highlights)
        'accent-emerald':'#10b981',   // Emerald (success, icons)
        'accent-cyan':   '#06b6d4',   // Cyan (modern highlights)

        // ─── Extended palettes ──────────────────────────────────────────────
        primary: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a4b8fc',
          400: '#818df8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        navy: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
      },
      fontFamily: {
        sans:    ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        body:    ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold':    '0 6px 20px rgba(251, 191, 36, 0.5)',
        'royal':   '0 6px 20px rgba(30, 58, 138, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce-slow 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '.95', transform: 'scale(1.02)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%':       { transform: 'translateY(5%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

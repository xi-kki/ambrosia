import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        soda: {
          pink: '#fbcfe8', pinkDark: '#f5a8d0',
          dark: '#011411', teal: '#0b8a78', tealDark: '#044e3b',
          blue: '#0b4f8a', blueDark: '#04294e',
        },
      },
      fontFamily: {
        heading: ['var(--font-galada)', 'cursive'],
        sans: ['var(--font-inter)', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'sans-serif'],
      },
      animation: { float: 'float 6s ease-in-out infinite' },
      keyframes: { float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } } },
    },
  },
  plugins: [],
}
export default config
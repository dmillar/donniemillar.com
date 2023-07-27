import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config



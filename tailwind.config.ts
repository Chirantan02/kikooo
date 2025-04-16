import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      ringColor: {
        white: 'rgb(255, 255, 255)',
      },
      ringOpacity: {
        '50': '0.5',
      },
    },
  },
  plugins: [],
}

export default config

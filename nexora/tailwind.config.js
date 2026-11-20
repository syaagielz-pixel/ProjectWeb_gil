/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#05060a',
        carbon: '#0a0c11',
        graphite: '#11141b',
        steel: '#1b1f29',
        silver: '#c9ced8',
        mist: '#8a91a0',
        neon: {
          DEFAULT: '#27d8ff',
          soft: '#8aecff',
          deep: '#0b8ec7',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
        'pulse-glow': 'pulseGlow 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

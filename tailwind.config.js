/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        github: {
          bg: '#0d1117',
          'bg-secondary': '#161b22',
          'bg-tertiary': '#21262d',
          border: '#30363d',
          'border-muted': '#21262d',
          text: '#f0f6fc',
          'text-secondary': '#8b949e',
          'text-muted': '#656d76',
          accent: '#238636',
          'accent-hover': '#2ea043',
          danger: '#da3633',
          'danger-hover': '#dc2626',
          blue: '#2f81f7',
          'blue-hover': '#1f6feb',
        }
      },
      fontFamily: {
        'mono': ['ui-monospace', 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
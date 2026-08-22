/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#0B0C10",
          sidebar: "#13141C",
          panel: "#1A1C26",
          border: "#2A2D3D",
        },
        ink: {
          primary: "#FFFFFF",
          secondary: "#9E9E9E",
        },
        brand: {
          purple: "#8B5CF6",
          green: "#00E599",
          blue: "#3B82F6",
          amber: "#F59E0B",
          red: "#EF4444",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}

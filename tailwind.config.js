/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dayflow dark theme palette
        base: {
          bg: "#0B0D10",      // page background
          panel: "#15181D",   // card / panel background
          sidebar: "#111418", // sidebar background
          border: "#232830",  // hairline borders
        },
        ink: {
          primary: "#E6E8EB",   // main text
          secondary: "#8B93A1", // muted text
        },
        brand: {
          green: "#22C55E",  // present / success
          amber: "#F5A524",  // on leave / warning
          red: "#EF4444",    // absent / danger
          blue: "#3B82F6",   // total / info
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
}

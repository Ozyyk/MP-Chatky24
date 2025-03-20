import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        darkergreen: "#0B2B26",
        darkgreen: "#163832", 
        mygreen: "#235247", 
        lightgreen: "#8EB69B", 
        lightergreen: "#DAF1DE",
      },
    },
  },
  plugins: [],
} satisfies Config;

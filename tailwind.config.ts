import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        white: "rgb(var(--color-white) / <alpha-value>)",
        ink: "#15101f",
        panel: "rgba(255,255,255,0.1)",
        line: "rgba(255,255,255,0.16)",
        muted: "#d9cfdd",
        neon: "#97dadf",
        blush: "#f6b1c9",
        violet: "#b8a5ff",
        rose: "#ff5fb7",
        gold: "#ffd166",
        cream: "#fff8f1",
        ember: "#ff6b8a",
        dusk: "#7c5cff",
      },
      fontFamily: {
        sans: ["Nunito Sans", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"]
      },
      boxShadow: {
        glow: "0 22px 70px rgba(38,22,55,0.28)",
        soft: "0 18px 54px rgba(184,165,255,0.18)",
        scene: "0 32px 120px rgba(0,0,0,0.4)",
        inner: "inset 0 1px 0 rgba(255,255,255,0.08)",
        "glow-violet": "0 0 40px rgba(184, 165, 255, 0.15)",
        "glow-blush": "0 0 40px rgba(246, 177, 201, 0.15)",
        "glow-neon": "0 0 40px rgba(151, 218, 223, 0.15)",
      },
      backgroundImage: {
        aurora: "radial-gradient(circle at 12% 8%, rgba(246,177,201,.22), transparent 34rem), radial-gradient(circle at 86% 12%, rgba(151,218,223,.16), transparent 32rem), linear-gradient(135deg,#15101f 0%,#22182f 55%,#171323 100%)"
      },
      animation: {
        "scene-enter": "scene-enter 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "float": "float 3s ease-in-out infinite",
        "float-up": "float-up 12s linear infinite",
      },
      keyframes: {
        "scene-enter": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "float-up": {
          "0%": { transform: "translateY(100vh) rotate(0deg) scale(0.5)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-10vh) rotate(360deg) scale(1)", opacity: "0" },
        },
      },
    }
  },
  plugins: []
};

export default config;

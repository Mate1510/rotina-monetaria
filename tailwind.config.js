/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primaryOrange: "#EE4B1F",
        orangeDarker: "#B1320F",
        constrastGray: "#D9D9D9",
        constrastBlack: "#1E1E1E",
        textGray: "#A3A3A3",
        success: "#28A745",
        warning: "#FFC107",
        danger: "#DC3545",

        RED: "#ff0000",
        ORANGE: "#ee4b1f",
        PURPLE: "#a020f0",
        PINK: "#ff00ff",
        BLUE: "#0000ff",
        AQUA: "#00ffff",
        GREEN: "#00ff00",
        YELLOW: "#ffff00",
        BLACK: "#0a0a0a",
        WHITE: "#ffffff",
      },
      text: {
        primaryOrange: "#EE4B1F",
        textGrey: "#BFBFBF",
        constrastBlack: "#1E1E1E",
      },
    },
  },
  plugins: [],
};

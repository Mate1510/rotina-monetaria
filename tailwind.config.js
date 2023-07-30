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
        constrastGrey: "#D9D9D9",
        constrastBlack: "#1E1E1E",
        textGrey: "#BFBFBF",
        success: "#28A745",
        warning: "#FFC107",
        danger: "#DC3545",
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

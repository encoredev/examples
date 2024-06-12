export default {
  content: ["**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#dcdee1",
      black: "#111111",
      blue: "#5765f2",
      green: "#4ade80",
      gray: {
        400: "#7e848c",
        500: "#6d6f78",
        700: "#383a40",
        800: "#313338",
        900: "#2b2d31",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

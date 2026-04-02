/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      colors: {
        Green: "#1fdf64",
        Black: "#000",
        DeepNightBlack: "#121212",
        MidNightBlack: "#181818",
        EveningBlack: "#1a1a1a",
        DarkGray: "#282828",
        SlateGray: "#404040",
        LightGray: "#959595",
        SilverGray: "#B3B3B3",
        Snow: "#ffffff",
      },
      fontFamily: {
        'epic-pro': ['epic-pro', 'sans-serif'],
        'cascadia-normal': ['epic-pro', 'sans-serif'],
        'circular': ['epic-pro', 'sans-serif'],
        'circular-light': ['epic-pro', 'sans-serif'],
        'circular-normal': ['epic-pro', 'sans-serif'],
        'circular-medium': ['epic-pro', 'sans-serif'],
        'circular-bold': ['epic-pro', 'sans-serif'],
      }
    },
  },
}
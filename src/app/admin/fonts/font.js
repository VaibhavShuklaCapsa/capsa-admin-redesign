import localFont from 'next/font/local'

export const SatoshiCustom = localFont({
  src: [
    {
      path: "./Satoshi-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Satoshi-Regular.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Satoshi-Italic.woff",
      weight: "500",
      style: "italic",
    },
    {
      path: "./Satoshi-Bold.woff",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-satoshi-custom",
  display: "swap",
});
// Font configuration removed as fonts are loaded via CSS @font-face
// Fonts are served from the public directory and referenced in global.css

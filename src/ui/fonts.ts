import { Geist, Geist_Mono } from "next/font/google";

// next/font downloads the files at build time and serves them from this
// site, so visitors never contact Google.
export const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

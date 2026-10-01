import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Marshall Kilburn II — Portable Bluetooth Speaker | Black & Brass Edition",
  description:
    "Experience the iconic Marshall Kilburn II in Black & Brass. 36W multi-directional Blumlein stereo sound, 20+ hours of portable playtime, analog rotary controls, and rugged roadworthy design.",
  keywords: [
    "Marshall Kilburn II",
    "Marshall Speaker",
    "Portable Bluetooth Speaker",
    "Black and Brass",
    "Rock Audio",
    "Blumlein Stereo",
    "Analog Audio",
  ],
  openGraph: {
    title: "Marshall Kilburn II — Portable Bluetooth Speaker | Black & Brass",
    description:
      "Big sound. Go anywhere. 36W multi-directional sound with unmistakable Marshall character.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans bg-[#050505] text-[#FFFFFF] antialiased selection:bg-[#C9A45C] selection:text-black min-h-screen overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Big_Shoulders, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const poster = Big_Shoulders({
  variable: "--font-poster",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  adjustFontFallback: false,
});

const body = Atkinson_Hyperlegible({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ElezaMD",
  description:
    "Eleza. Don’t diagnose. A waiting-room note the patient shows the nurse. No patient file.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`light ${poster.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}

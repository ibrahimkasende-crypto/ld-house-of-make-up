import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/utils";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

const description = "LD House of Make Up — maquillage professionnel entre la RDC et la France. Prestations, ateliers et demandes de devis.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "LD House of Make Up — Maquillage professionnel",
    template: "%s — LD House of Make Up",
  },
  description,
  applicationName: "LD House of Make Up",
  openGraph: {
    title: "LD House of Make Up",
    description,
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LD House of Make Up",
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}

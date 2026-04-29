import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const rajdhani = Rajdhani({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani" 
});

export const metadata = {
  title: "Team Karad Off-Roaders | India's Best Offroading Event & Competition",
  description: "Official portal for Team Karad Off-Roaders Season 2. Join the premier offroading event and competition in India. Experience elite offroading cars and professional 4x4 challenges in Karad, Maharashtra. Register now for the 2026 Season.",
  keywords: [
    "offroading event in india", 
    "offroading competition in india", 
    "offroading cars", 
    "best offroading event india",
    "offroad championship India", 
    "Team Karad Off-Roaders",
    "offroading Karad", 
    "Karad offroaders", 
    "TKO Season 2", 
    "4x4 competition India", 
    "Mahindra Thar Karad", 
    "Maruti Gypsy Offroad"
  ],
  authors: [{ name: "Team Karad Off-Roaders" }],
  openGraph: {
    title: "Team Karad Off-Roaders | India's Ultimate Off-Road Championship",
    description: "Join the elite lineup of off-roaders in Karad. Season 2 is coming this May 2026. Register now for the best offroading competition in India.",
    url: "https://teamkaradoffroaders.online",
    siteName: "Team Karad Off-Roaders",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Team Karad Off-Roaders Official Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Team Karad Off-Roaders | Season 2",
    description: "India's most thrilling off-road championship. Born from dust, built for glory.",
    images: ["/logo.png"],
  },
  verification: {
    google: "BEOY-T5wKs-pm0veIoGlT_ca5JSFjN0A6iSzZpuk4KI",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className={`${inter.variable} ${rajdhani.variable} font-sans antialiased rally-grid bg-background text-foreground overflow-x-hidden`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

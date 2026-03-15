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
  title: "Team Karad Off-Roaders | India's Ultimate Off-Road Championship",
  description: "Official portal for the Team Karad Off-Roaders Rally 2026. Register now for the biggest off-roading event of the year.",
  verification: {
    google: "BEOY-T5wKs-pm0veIoGlT_ca5JSFjN0A6iSzZpuk4KI",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
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

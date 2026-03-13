import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const rajdhani = Rajdhani({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani" 
});

export const metadata = {
  title: "TKO Rally 2026 | Off-Road Championship",
  description: "Register for the biggest off-roading event of the year. Secure your spot and car number now.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${rajdhani.variable} font-sans antialiased rally-grid bg-background text-foreground`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

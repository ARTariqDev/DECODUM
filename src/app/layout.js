import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DECODUM R3",
  description: "The Website for Round 3 of DECODUM for JT Innoventions'25",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  film-grain-wrapper flex flex-col justify-center space-y-4`}
      >

        <main
          className="min-h-screen"
          style={{
            backgroundColor: "#111111",
            backgroundImage: `radial-gradient(circle, rgba(255, 248, 222, 0.35) 0.8px, transparent 0.8px)`,
            backgroundSize: "22px 22px",
            backgroundPosition: "0 0",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}

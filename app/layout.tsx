import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SignInPrompt } from "@/components/Account";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "Roadmap", template: "%s · Roadmap" },
  description: "Personal learning roadmap: system design, AI and inference engineering, cloud, AWS pricing and Unity VR.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

// Applies the saved theme before paint so there is no flash.
const themeScript = `try{var t=localStorage.getItem("roadmap.theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <SignInPrompt />
      </body>
    </html>
  );
}

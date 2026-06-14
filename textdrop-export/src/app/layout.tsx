import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TextDrop — Partagez vos textes instantanément",
  description:
    "Collez votre texte, obtenez un lien unique partageable et lisible par les humains et les IA.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}

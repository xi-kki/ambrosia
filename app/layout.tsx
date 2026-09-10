import { Metadata } from 'next';
import { Inter, Manrope, Galada } from 'next/font/google';
import './globals.css';
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap', weight: ['400','500','700'] });
const galada = Galada({ subsets: ['latin'], variable: '--font-galada', display: 'swap', weight: ['400'] });

export const metadata: Metadata = { title: 'Ambrosia | Pure Zero Refreshment', description: 'Experience the crisp, clean taste of Ambrosia. Zero sugar, zero compromise.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${galada.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" />
        <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" />
      </head>
      <body className={`${inter.className} ${manrope.className} ${galada.className} font-sans antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

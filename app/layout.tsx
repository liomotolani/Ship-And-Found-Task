import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './tokens.css';
import './globals.css';

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VetReply',
  description: 'AI-assisted reply workflow for veterinary clinics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body className={sourceSans3.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

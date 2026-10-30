import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import FeatureCards from '@/components/FeatureCards';

const title = 'VetReply — Veterinary replies with sources';
const description = 'Grounded veterinary assistant';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    siteName: 'VetReply',
    title,
    description,
    url: '/',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
};

export default function HomePage() {
  return (
    <main style={{ flex: 1 }}>
      <Hero />
      <FeatureCards />
    </main>
  );
}

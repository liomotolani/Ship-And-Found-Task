import Hero from '@/components/Hero';
import FeatureCards from '@/components/FeatureCards';

export default function HomePage() {
  return (
    <main style={{ flex: 1 }}>
      <Hero />
      <FeatureCards />
    </main>
  );
}

import type { Metadata } from 'next';
import EnquiryForm from '@/components/EnquiryForm';

export const metadata: Metadata = {
  title: 'My enquiries',
};

export default function NewEnquiryPage() {
  return (
    <main style={{ flex: 1, padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
        <h1
          style={{
            fontFamily: 'var(--type-headline-large-font-family)',
            fontSize: 'var(--type-headline-large-size)',
            fontWeight: 'var(--type-headline-large-weight)',
            lineHeight: 'var(--type-headline-large-line-height)',
            letterSpacing: 'var(--type-headline-large-letter-spacing)',
            color: 'var(--color-on-background)',
            marginBottom: '2rem',
          }}
        >
          My enquiries
        </h1>
        <EnquiryForm />
      </div>
    </main>
  );
}

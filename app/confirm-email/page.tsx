import type { Metadata } from 'next';
import {
  errorTextStyle,
  linkStyle,
  successTextStyle,
} from '@/components/form-styles';

export const metadata: Metadata = {
  title: 'Confirm email result',
};

type ConfirmEmailPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function ConfirmEmailPage({
  searchParams,
}: ConfirmEmailPageProps) {
  const { error } = await searchParams;
  const confirmed = !error;

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
          Confirm email result
        </h1>

        <p
          role={confirmed ? 'status' : 'alert'}
          style={confirmed ? successTextStyle : errorTextStyle}
        >
          {confirmed
            ? 'Your email is confirmed.'
            : 'This confirmation link is invalid or has expired.'}
        </p>

        <p style={{ marginTop: '1rem' }}>
          <a href="/sign-in" style={linkStyle}>
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}

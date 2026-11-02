import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import VerifyEmailForm from '@/components/VerifyEmailForm';
import { getPendingVerificationEmail } from '@/lib/verification-cookie';

export const metadata: Metadata = {
  title: 'Verify your email',
};

type VerifyEmailPageProps = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const email = await getPendingVerificationEmail();

  if (!email) {
    redirect('/auth?form=signup');
  }

  const { reason } = await searchParams;

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
            marginBottom: '1rem',
          }}
        >
          Verify your email
        </h1>
        <p
          style={{
            fontFamily: 'var(--type-body-large-font-family)',
            fontSize: 'var(--type-body-large-size)',
            fontWeight: 'var(--type-body-large-weight)',
            lineHeight: 'var(--type-body-large-line-height)',
            letterSpacing: 'var(--type-body-large-letter-spacing)',
            color: 'var(--color-on-surface-variant)',
            marginBottom: '2rem',
          }}
        >
          {reason === 'unconfirmed'
            ? `Confirm your email first. We have sent a new code to ${email}.`
            : `Enter the 6-digit code sent to ${email}.`}
        </p>
        <VerifyEmailForm />
      </div>
    </main>
  );
}

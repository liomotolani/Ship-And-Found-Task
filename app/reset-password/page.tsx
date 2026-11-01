import type { Metadata } from 'next';
import ResetPasswordForm from '@/components/ResetPasswordForm';
import { errorTextStyle, linkStyle } from '@/components/form-styles';

export const metadata: Metadata = {
  title: 'Reset password',
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string; error?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token, error } = await searchParams;

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
          Reset password
        </h1>

        {error || !token ? (
          <div>
            <p role="alert" style={errorTextStyle}>
              This reset link is invalid or has expired.
            </p>
            <p style={{ marginTop: '1rem' }}>
              <a href="/forgot-password" style={linkStyle}>
                Forgot password
              </a>
            </p>
          </div>
        ) : (
          <ResetPasswordForm token={token} />
        )}
      </div>
    </main>
  );
}

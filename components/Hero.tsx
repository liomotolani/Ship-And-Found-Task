import type { CSSProperties } from 'react';

const eyebrow: CSSProperties = {
  fontFamily: 'var(--type-label-large-font-family)',
  fontSize: 'var(--type-label-large-size)',
  fontWeight: 'var(--type-label-large-weight)',
  lineHeight: 'var(--type-label-large-line-height)',
  letterSpacing: 'var(--type-label-large-letter-spacing)',
  color: 'var(--color-primary)',
  textTransform: 'uppercase',
  marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
};

const heading: CSSProperties = {
  fontFamily: 'var(--type-display-medium-font-family)',
  fontSize: 'clamp(2rem, 5vw, var(--type-display-medium-size))',
  fontWeight: 'var(--type-display-medium-weight)',
  lineHeight: 1.4,
  letterSpacing: 'var(--type-display-medium-letter-spacing)',
  color: 'var(--color-on-background)',
  maxWidth: '24ch',
  textWrap: 'balance',
  marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
};

const body: CSSProperties = {
  fontFamily: 'var(--type-body-large-font-family)',
  fontSize: 'var(--type-body-large-size)',
  fontWeight: 'var(--type-body-large-weight)',
  lineHeight: 'var(--type-body-large-line-height)',
  letterSpacing: 'var(--type-body-large-letter-spacing)',
  color: 'var(--color-on-surface-variant)',
  maxWidth: '34rem',
  marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
};

const primaryButton: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--type-label-large-font-family)',
  fontSize: 'var(--type-label-large-size)',
  fontWeight: 'var(--type-label-large-weight)',
  lineHeight: 'var(--type-label-large-line-height)',
  letterSpacing: 'var(--type-label-large-letter-spacing)',
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-on-primary)',
  padding: '0.875rem 2rem',
  borderRadius: '0.5rem',
  border: 'none',
  cursor: 'pointer',
  boxShadow: 'var(--shadow-soft)',
  textDecoration: 'none',
};

const secondaryButton: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--type-label-large-font-family)',
  fontSize: 'var(--type-label-large-size)',
  fontWeight: 'var(--type-label-large-weight)',
  lineHeight: 'var(--type-label-large-line-height)',
  letterSpacing: 'var(--type-label-large-letter-spacing)',
  backgroundColor: 'transparent',
  color: 'var(--color-on-primary-container)',
  padding: '0.875rem 2rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--color-outline-variant)',
  cursor: 'pointer',
  textDecoration: 'none',
};

const labelLarge: CSSProperties = {
  fontFamily: 'var(--type-label-large-font-family)',
  fontSize: 'var(--type-label-large-size)',
  fontWeight: 'var(--type-label-large-weight)',
  lineHeight: 'var(--type-label-large-line-height)',
  letterSpacing: 'var(--type-label-large-letter-spacing)',
  color: 'var(--color-on-surface-variant)',
};

const labelMedium: CSSProperties = {
  fontFamily: 'var(--type-label-medium-font-family)',
  fontSize: 'var(--type-label-medium-size)',
  fontWeight: 'var(--type-label-medium-weight)',
  lineHeight: 'var(--type-label-medium-line-height)',
  letterSpacing: 'var(--type-label-medium-letter-spacing)',
};

const sourceChip: CSSProperties = {
  ...labelMedium,
  color: 'var(--color-on-primary-container)',
  backgroundColor: 'var(--color-primary-container)',
  border: '1px solid var(--color-primary-fixed-dim)',
  padding: '0.25rem 0.625rem',
  borderRadius: '999px',
};

const statusPill: CSSProperties = {
  ...labelMedium,
  color: 'var(--color-on-warning-container)',
  backgroundColor: 'var(--color-warning-container)',
  padding: '0.25rem 0.625rem',
  borderRadius: '999px',
  whiteSpace: 'nowrap',
};

const textLine: CSSProperties = {
  display: 'block',
  height: '0.5rem',
  borderRadius: '999px',
  backgroundColor: 'var(--color-surface-container-highest)',
};

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        backgroundColor: 'var(--color-background)',
        borderBottom: '1px solid var(--color-outline-variant)',
        padding: 'clamp(2.5rem, 6vw, 4rem) clamp(1rem, 4vw, 1.5rem)',
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'clamp(1.5rem, 5vw, 3rem)',
        }}
      >
        <div style={{ flex: '1 1 420px', minWidth: 0 }}>
          <p style={eyebrow}>For veterinary practice teams</p>
          <h1 id="hero-heading" style={heading}>
            Every reply grounded in your practice&rsquo;s own documents.
          </h1>
          <p style={body}>
            Draft confident answers from approved practice guidance, see the
            source behind every claim, and let your team approve each reply
            before it reaches a client.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <a href="/sign-up" style={primaryButton}>
              Get started
            </a>
            <a href="#how-it-works" style={secondaryButton}>
              See how it works
            </a>
          </div>
          <p
            style={{
              ...labelLarge,
              marginTop: 'clamp(1rem, 3vw, 1.5rem)',
              color: 'var(--color-on-surface-variant)',
            }}
          >
            Built for receptionists, vets and practice managers.
          </p>
        </div>

        <div style={{ flex: '1 1 340px', minWidth: 0 }}>
          <div
            aria-hidden="true"
            style={{
              backgroundColor: 'var(--color-primary-container)',
              border: '1px solid var(--color-primary-fixed-dim)',
              borderRadius: '24px',
              padding: 'clamp(1rem, 3vw, 1.5rem)',
              boxShadow: 'var(--shadow-medium)',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: '16px',
                padding: 'clamp(1rem, 3vw, 1.5rem)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                }}
              >
                <span style={labelLarge}>Draft reply</span>
                <span style={statusPill}>Awaiting approval</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem',
                }}
              >
                <span style={{ ...textLine, width: '92%' }} />
                <span style={{ ...textLine, width: '100%' }} />
                <span style={{ ...textLine, width: '86%' }} />
                <span style={{ ...textLine, width: '64%' }} />
              </div>

              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--color-outline-variant)',
                }}
              >
                <span
                  style={{
                    ...labelMedium,
                    color: 'var(--color-on-surface-variant)',
                  }}
                >
                  Sources
                </span>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginTop: '0.625rem',
                  }}
                >
                  <span style={sourceChip}>Vaccination schedule</span>
                  <span style={sourceChip}>Opening hours</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '1.25rem',
                  color: 'var(--color-success)',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8.5L6.5 12L13 4.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span style={labelMedium}>Approved by staff before sending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

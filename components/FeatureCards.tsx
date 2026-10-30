import type { CSSProperties, ReactNode } from 'react';

type Feature = {
  title: string;
  description: string;
  icon: ReactNode;
};

const labelLarge: CSSProperties = {
  fontFamily: 'var(--type-label-large-font-family)',
  fontSize: 'var(--type-label-large-size)',
  fontWeight: 'var(--type-label-large-weight)',
  lineHeight: 'var(--type-label-large-line-height)',
  letterSpacing: 'var(--type-label-large-letter-spacing)',
};

const titleLarge: CSSProperties = {
  fontFamily: 'var(--type-title-large-font-family)',
  fontSize: 'clamp(1.25rem, 2.2vw, var(--type-title-large-size))',
  fontWeight: 'var(--type-title-large-weight)',
  lineHeight: 1.5,
  letterSpacing: 'var(--type-title-large-letter-spacing)',
  color: 'var(--color-on-background)',
  marginBottom: '0.5rem',
};

const bodyMedium: CSSProperties = {
  fontFamily: 'var(--type-body-medium-font-family)',
  fontSize: 'var(--type-body-medium-size)',
  fontWeight: 'var(--type-body-medium-weight)',
  lineHeight: 'var(--type-body-medium-line-height)',
  letterSpacing: 'var(--type-body-medium-letter-spacing)',
  color: 'var(--color-on-surface-variant)',
};

const features: Feature[] = [
  {
    title: 'Answers from approved documents',
    description:
      'Every draft is grounded in the practice documents your team has approved, never in guesswork.',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M7 3.5H14L18.5 8V20.5H7V3.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M14 3.5V8H18.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 12.5H16M9.5 16H14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'A source behind every claim',
    description:
      'Staff see exactly which documents informed each answer, so they can check it before they send.',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="10.5"
          cy="10.5"
          r="6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M15 15L20 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 10.5H13M10.5 8V13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Clinical replies wait for a vet',
    description:
      'Clinical content is flagged and only a vet can approve it. Nothing is emailed without staff sign-off.',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 3.5L19 6.5V11.5C19 15.6 16.1 18.9 12 20.5C7.9 18.9 5 15.6 5 11.5V6.5L12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M8.75 11.75L11 14L15.5 9.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function FeatureCards() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="features-heading"
      style={{
        backgroundColor: 'var(--color-surface-container-low)',
        padding: 'clamp(2.5rem, 6vw, 4rem) clamp(1rem, 4vw, 1.5rem)',
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <p
          style={{
            ...labelLarge,
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          Why VetReply
        </p>
        <h2
          id="features-heading"
          style={{
            fontFamily: 'var(--type-headline-large-font-family)',
            fontSize: 'clamp(1.75rem, 3.5vw, var(--type-headline-large-size))',
            fontWeight: 'var(--type-headline-large-weight)',
            lineHeight: 1.5,
            letterSpacing: 'var(--type-headline-large-letter-spacing)',
            color: 'var(--color-on-background)',
            maxWidth: '36rem',
            marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
          }}
        >
          Confident replies, without the guesswork.
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 17rem), 1fr))',
            gap: 'clamp(1rem, 3vw, 1.5rem)',
          }}
        >
          {features.map((feature) => (
            <article
              key={feature.title}
              style={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: '16px',
                padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-primary-container)',
                  color: 'var(--color-primary)',
                  marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)',
                }}
              >
                {feature.icon}
              </div>
              <h3 style={titleLarge}>{feature.title}</h3>
              <p style={bodyMedium}>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

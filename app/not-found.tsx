export default function NotFound() {
  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--type-title-medium-font-family)',
          fontSize: 'var(--type-title-medium-size)',
          fontWeight: 'var(--type-title-medium-weight)',
          lineHeight: 'var(--type-title-medium-line-height)',
          letterSpacing: 'var(--type-title-medium-letter-spacing)',
          color: 'var(--color-on-surface)',
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontFamily: 'var(--type-body-large-font-family)',
          fontSize: 'var(--type-body-large-size)',
          fontWeight: 'var(--type-body-large-weight)',
          lineHeight: 'var(--type-body-large-line-height)',
          letterSpacing: 'var(--type-body-large-letter-spacing)',
          color: 'var(--color-on-surface-variant)',
        }}
      >
        The page you are looking for does not exist.
      </p>
    </main>
  );
}

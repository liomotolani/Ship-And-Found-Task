export default function HomePage() {
  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '16px',
          padding: '3rem 2.5rem',
          maxWidth: '640px',
          width: '100%',
          textAlign: 'center',
          boxShadow: 'var(--shadow-medium)',
          border: '1px solid var(--color-outline-variant)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--type-display-small-font-family)',
            fontSize: 'var(--type-display-small-size)',
            fontWeight: 'var(--type-display-small-weight)',
            lineHeight: 'var(--type-display-small-line-height)',
            letterSpacing: 'var(--type-display-small-letter-spacing)',
            color: 'var(--color-on-surface)',
            marginBottom: '1rem',
          }}
        >
          VetReply
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
          Fast, verified answers and empathetic communication support for veterinary teams.
        </p>
        <div>
          <button
            type="button"
            style={{
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
              padding: '0.875rem 2.25rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            Get started
          </button>
        </div>
      </div>
    </main>
  );
}

export default function Navbar() {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2rem',
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderBottom: '1px solid var(--color-outline-variant)',
        boxShadow: 'var(--shadow-soft)',
      }}
    >
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'var(--type-title-medium-font-family)',
          fontSize: 'var(--type-title-medium-size)',
          fontWeight: 'var(--type-title-medium-weight)',
          lineHeight: 'var(--type-title-medium-line-height)',
          letterSpacing: 'var(--type-title-medium-letter-spacing)',
          color: 'var(--color-primary)',
          textDecoration: 'none',
        }}
      >
        <img
          src="/icon.svg"
          alt=""
          width={32}
          height={32}
          style={{ display: 'block', width: '2rem', height: '2rem' }}
        />
        VetReply
      </a>
      <nav aria-label="Main Navigation">
        <ul
          style={{
            display: 'flex',
            gap: '1.5rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <a
              href="/sign-up"
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
                padding: '0.75rem 1.25rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              Get started
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

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
      <div
        style={{
          fontFamily: 'var(--type-title-medium-font-family)',
          fontSize: 'var(--type-title-medium-size)',
          fontWeight: 'var(--type-title-medium-weight)',
          lineHeight: 'var(--type-title-medium-line-height)',
          letterSpacing: 'var(--type-title-medium-letter-spacing)',
          color: 'var(--color-primary)',
        }}
      >
        VetReply
      </div>
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
              href="/home"
              style={{
                fontFamily: 'var(--type-label-large-font-family)',
                fontSize: 'var(--type-label-large-size)',
                fontWeight: 'var(--type-label-large-weight)',
                lineHeight: 'var(--type-label-large-line-height)',
                letterSpacing: 'var(--type-label-large-letter-spacing)',
                color: 'var(--color-on-surface-variant)',
                textDecoration: 'none',
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              style={{
                fontFamily: 'var(--type-label-large-font-family)',
                fontSize: 'var(--type-label-large-size)',
                fontWeight: 'var(--type-label-large-weight)',
                lineHeight: 'var(--type-label-large-line-height)',
                letterSpacing: 'var(--type-label-large-letter-spacing)',
                color: 'var(--color-on-surface-variant)',
                textDecoration: 'none',
              }}
            >
              About
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

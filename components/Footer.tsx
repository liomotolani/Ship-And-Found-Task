export default function Footer() {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '1.25rem',
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderTop: '1px solid var(--color-outline-variant)',
        fontFamily: 'var(--type-body-small-font-family)',
        fontSize: 'var(--type-body-small-size)',
        fontWeight: 'var(--type-body-small-weight)',
        lineHeight: 'var(--type-body-small-line-height)',
        letterSpacing: 'var(--type-body-small-letter-spacing)',
        color: 'var(--color-on-surface-variant)',
      }}
    >
      &copy; 2026 VetReply. Designed for veterinary practice teams.
    </footer>
  );
}

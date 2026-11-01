import type { Metadata } from 'next';
import type { CSSProperties } from 'react';

export const metadata: Metadata = {
  title: 'Terms and conditions',
};

const heading: CSSProperties = {
  fontFamily: 'var(--type-headline-large-font-family)',
  fontSize: 'var(--type-headline-large-size)',
  fontWeight: 'var(--type-headline-large-weight)',
  lineHeight: 'var(--type-headline-large-line-height)',
  letterSpacing: 'var(--type-headline-large-letter-spacing)',
  color: 'var(--color-on-background)',
  marginBottom: '0.75rem',
};

const lastUpdated: CSSProperties = {
  fontFamily: 'var(--type-body-medium-font-family)',
  fontSize: 'var(--type-body-medium-size)',
  fontWeight: 'var(--type-body-medium-weight)',
  lineHeight: 'var(--type-body-medium-line-height)',
  letterSpacing: 'var(--type-body-medium-letter-spacing)',
  color: 'var(--color-on-surface-variant)',
  marginBottom: '2rem',
};

const sectionTitle: CSSProperties = {
  fontFamily: 'var(--type-title-large-font-family)',
  fontSize: 'var(--type-title-large-size)',
  fontWeight: 'var(--type-title-large-weight)',
  lineHeight: 'var(--type-title-large-line-height)',
  letterSpacing: 'var(--type-title-large-letter-spacing)',
  color: 'var(--color-on-background)',
  marginTop: '2rem',
  marginBottom: '0.75rem',
};

const body: CSSProperties = {
  fontFamily: 'var(--type-body-large-font-family)',
  fontSize: 'var(--type-body-large-size)',
  fontWeight: 'var(--type-body-large-weight)',
  lineHeight: 'var(--type-body-large-line-height)',
  letterSpacing: 'var(--type-body-large-letter-spacing)',
  color: 'var(--color-on-surface-variant)',
  marginBottom: '1rem',
};

const list: CSSProperties = {
  ...body,
  paddingLeft: '1.25rem',
};

export default function TermsPage() {
  return (
    <main style={{ flex: 1, padding: '3rem 1.5rem' }}>
      <article style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <h1 style={heading}>Terms and conditions</h1>
        <p style={lastUpdated}>Last updated: 1 November 2026</p>

        <p style={body}>
          These terms govern your use of VetReply, the enquiry and reply service
          provided by VetReply Practice. By creating an account or using
          VetReply, you agree to these terms. If you do not agree, do not use
          VetReply.
        </p>

        <section>
          <h2 style={sectionTitle}>Who can use VetReply</h2>
          <p style={body}>
            You must be 18 or over to create a client account. Staff accounts
            are created by the practice. You must give accurate information,
            keep your sign-in details secure and tell the practice if you think
            someone else has accessed your account. You are responsible for
            activity under your account.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>What VetReply does</h2>
          <p style={body}>
            VetReply helps the practice answer client enquiries. It drafts
            replies using documents the practice has approved and shows the
            sources used. A member of staff reviews and approves every reply
            before it is emailed. Clinical replies can only be approved by a
            vet.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>AI, veterinary advice and emergencies</h2>
          <p style={body}>
            VetReply uses AI to help draft replies. AI can make mistakes or
            leave things out. A draft is not veterinary advice, a diagnosis or a
            treatment plan. Always follow the advice of the practice&rsquo;s
            vet. If you are worried about an animal&rsquo;s health, contact the
            practice directly.
          </p>
          <p style={body}>
            VetReply is not an emergency service. Online enquiries are not
            monitored for emergencies. If an animal needs urgent help, call the
            practice or an emergency veterinary service now.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>Acceptable use</h2>
          <p style={body}>
            You must use VetReply lawfully and only for its intended purpose.
            You must not:
          </p>
          <ul style={list}>
            <li>try to access another person&rsquo;s account or records;</li>
            <li>upload malicious code or content;</li>
            <li>use VetReply to send spam, harassment or misleading material;</li>
            <li>
              attempt to bypass access controls, rate limits or approval steps;
            </li>
            <li>
              submit information you do not have permission to share.
            </li>
          </ul>
          <p style={body}>
            We may suspend or close an account that breaches these terms.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>Enquiries, documents and sources</h2>
          <p style={body}>
            Documents added to VetReply are supplied by the practice. Replies
            are based on those documents. VetReply may not find an answer if the
            documents do not cover the question. In that case the practice will
            tell you or handle the enquiry another way. Do not rely on VetReply
            for information that is not in the practice&rsquo;s documents.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>Fees, payments and membership</h2>
          <p style={body}>
            Any consultation fee or membership price is shown before you pay.
            Payments are processed by Stripe. A membership renews monthly until
            cancelled through the Stripe customer portal. Only an active
            membership removes the consultation fee. Cancellations and refunds
            follow the policy shown when you book.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>Availability and changes</h2>
          <p style={body}>
            We aim to keep VetReply available, but we do not guarantee
            uninterrupted or error-free service. We may change, suspend or
            withdraw parts of VetReply. We may update these terms; the new
            version will be posted here with a new date. If you continue to use
            VetReply after a change, you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>Suspension and ending use</h2>
          <p style={body}>
            We may suspend or end your access if you breach these terms, if we
            need to protect VetReply or its users, or if the law requires it.
            You may stop using VetReply at any time. Ending access does not
            affect records the practice must keep or rights that already
            arose.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>Liability</h2>
          <p style={body}>
            Nothing in these terms limits liability that cannot be limited by
            law. To the extent permitted by law, we are not liable for indirect
            or consequential loss, or for loss caused by relying on an AI draft
            that was not approved by staff. The practice remains responsible for
            the veterinary care it provides.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>Your information</h2>
          <p style={body}>
            We use your account and enquiry information to provide VetReply,
            including sharing it with service providers that help us run the
            service, such as our AI, payment and email providers. We do not sell
            your personal information. Do not submit information you do not have
            permission to share. Contact the practice if you have questions
            about your information.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>Contact</h2>
          <p style={body}>
            Questions about these terms or VetReply? Contact VetReply Practice
            using the phone number shown on the enquiry and booking pages.
          </p>
        </section>

        <p style={body}>
          These terms are governed by the law of England and Wales, and the
          courts of England and Wales have jurisdiction.
        </p>
      </article>
    </main>
  );
}

'use client';

import type { CSSProperties, FormEvent } from 'react';
import { useState } from 'react';

type EnquiryFormField = 'petName' | 'question';

type EnquiryResponse = {
  id?: string;
  error?: string;
  field?: EnquiryFormField;
};

const genericError =
  'Something went wrong. Nothing was changed. Try again.';

const label: CSSProperties = {
  display: 'block',
  fontFamily: 'var(--type-label-large-font-family)',
  fontSize: 'var(--type-label-large-size)',
  fontWeight: 'var(--type-label-large-weight)',
  lineHeight: 'var(--type-label-large-line-height)',
  letterSpacing: 'var(--type-label-large-letter-spacing)',
  color: 'var(--color-on-surface)',
  marginBottom: '0.5rem',
};

const input: CSSProperties = {
  width: '100%',
  fontFamily: 'var(--type-body-large-font-family)',
  fontSize: 'var(--type-body-large-size)',
  fontWeight: 'var(--type-body-large-weight)',
  lineHeight: 'var(--type-body-large-line-height)',
  letterSpacing: 'var(--type-body-large-letter-spacing)',
  color: 'var(--color-on-surface)',
  backgroundColor: 'var(--color-surface-container-lowest)',
  border: '1px solid var(--color-outline-variant)',
  borderRadius: '8px',
  padding: '0.75rem',
};

const errorText: CSSProperties = {
  fontFamily: 'var(--type-body-medium-font-family)',
  fontSize: 'var(--type-body-medium-size)',
  fontWeight: 'var(--type-body-medium-weight)',
  lineHeight: 'var(--type-body-medium-line-height)',
  letterSpacing: 'var(--type-body-medium-letter-spacing)',
  color: 'var(--color-error)',
  marginTop: '0.5rem',
};

const successText: CSSProperties = {
  fontFamily: 'var(--type-body-medium-font-family)',
  fontSize: 'var(--type-body-medium-size)',
  fontWeight: 'var(--type-body-medium-weight)',
  lineHeight: 'var(--type-body-medium-line-height)',
  letterSpacing: 'var(--type-body-medium-letter-spacing)',
  color: 'var(--color-success)',
  marginBottom: '1rem',
};

const submitButton: CSSProperties = {
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
};

export default function EnquiryForm() {
  const [error, setError] = useState<string>();
  const [field, setField] = useState<EnquiryFormField>();
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setPending(true);
    setSaved(false);
    setError(undefined);
    setField(undefined);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petName: formData.get('petName'),
          question: formData.get('question'),
        }),
      });

      const data = (await response.json().catch(() => ({}))) as EnquiryResponse;

      if (response.status !== 201) {
        setError(data.error ?? genericError);
        setField(data.field);
        return;
      }

      form.reset();
      setSaved(true);
    } catch {
      setError(genericError);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {saved ? (
        <p role="status" style={successText}>
          Enquiry saved.
        </p>
      ) : null}

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="petName" style={label}>
          Pet name
        </label>
        <input
          id="petName"
          name="petName"
          type="text"
          maxLength={50}
          style={input}
          aria-invalid={field === 'petName' ? true : undefined}
          aria-describedby={field === 'petName' ? 'petName-error' : undefined}
        />
        {field === 'petName' && error ? (
          <p id="petName-error" role="alert" style={errorText}>
            {error}
          </p>
        ) : null}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="question" style={label}>
          Your question
        </label>
        <textarea
          id="question"
          name="question"
          required
          minLength={10}
          maxLength={2000}
          rows={8}
          style={input}
          aria-invalid={field === 'question' ? true : undefined}
          aria-describedby={field === 'question' ? 'question-error' : undefined}
        />
        {field === 'question' && error ? (
          <p id="question-error" role="alert" style={errorText}>
            {error}
          </p>
        ) : null}
      </div>

      {error && !field ? (
        <p role="alert" style={errorText}>
          {error}
        </p>
      ) : null}

      <button type="submit" style={submitButton} disabled={pending}>
        Submit enquiry
      </button>
    </form>
  );
}

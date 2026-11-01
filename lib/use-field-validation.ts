'use client';

import { useState } from 'react';

type Validator = (value: string) => string | undefined;

type FieldErrors = Record<string, string | undefined>;
type TouchedFields = Record<string, boolean>;

export function useFieldValidation(validators: Record<string, Validator>) {
  const [touched, setTouched] = useState<TouchedFields>({});
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(field: string, value: string) {
    const message = validators[field]?.(value);

    setErrors((current) => ({ ...current, [field]: message }));
  }

  function handleBlur(field: string, value: string) {
    setTouched((current) => ({ ...current, [field]: true }));
    validate(field, value);
  }

  function handleChange(field: string, value: string) {
    if (touched[field]) {
      validate(field, value);
    }
  }

  return { touched, errors, handleBlur, handleChange };
}

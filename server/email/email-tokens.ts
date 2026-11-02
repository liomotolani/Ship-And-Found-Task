import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type EmailTokens = {
  colorPrimary: string;
  colorOnPrimary: string;
  colorSurface: string;
  colorOnSurface: string;
  colorOnSurfaceVariant: string;
  bodyFontFamily: string;
  headlineFontFamily: string;
};

function parseTokens(css: string) {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const tokens = new Map<string, string>();
  const declaration = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;

  for (const match of withoutComments.matchAll(declaration)) {
    tokens.set(match[1], match[2].trim());
  }

  return tokens;
}

function resolveToken(
  name: string,
  tokens: Map<string, string>,
  stack: string[] = [],
): string {
  if (stack.includes(name)) {
    throw new Error(`Circular design token reference: ${name}`);
  }

  const value = tokens.get(name);

  if (value === undefined) {
    throw new Error(`Missing design token: ${name}`);
  }

  let resolved = value;
  const reference = /var\(\s*(--[a-z0-9-]+)\s*\)/i;
  let match = reference.exec(resolved);

  while (match) {
    const replacement = resolveToken(match[1], tokens, [...stack, name]);
    resolved =
      resolved.slice(0, match.index) +
      replacement +
      resolved.slice(match.index + match[0].length);
    match = reference.exec(resolved);
  }

  if (/var\(/i.test(resolved)) {
    throw new Error(`Unresolved design token: ${name}`);
  }

  return resolved.trim();
}

export function getEmailTokens(): EmailTokens {
  const css = readFileSync(join(process.cwd(), 'app', 'tokens.css'), 'utf8');
  const tokens = parseTokens(css);

  return {
    colorPrimary: resolveToken('--color-primary', tokens),
    colorOnPrimary: resolveToken('--color-on-primary', tokens),
    colorSurface: resolveToken('--color-surface', tokens),
    colorOnSurface: resolveToken('--color-on-surface', tokens),
    colorOnSurfaceVariant: resolveToken('--color-on-surface-variant', tokens),
    bodyFontFamily: resolveToken('--type-body-large-font-family', tokens),
    headlineFontFamily: resolveToken(
      '--type-headline-large-font-family',
      tokens,
    ),
  };
}

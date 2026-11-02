import { createHash } from 'node:crypto';

const PWNED_PASSWORDS_URL = 'https://api.pwnedpasswords.com/range';
const TIMEOUT_MS = 3000;

function failureReason(error: unknown) {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return 'request timed out';
    }

    return error.message || 'unknown error';
  }

  return 'unknown error';
}

export async function isPasswordBreached(
  password: string,
): Promise<{ breached: boolean; count: number }> {
  const hash = createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${PWNED_PASSWORDS_URL}/${prefix}`, {
      headers: { 'Add-Padding': 'true' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const body = await response.text();
    const lines = body.split(/\r?\n/).filter((line) => line.trim() !== '');
    let count = 0;

    for (const line of lines) {
      const [returnedSuffix, returnedCount] = line.trim().split(':');

      if (!returnedSuffix || !returnedCount) {
        continue;
      }

      if (returnedSuffix.toUpperCase() !== suffix) {
        continue;
      }

      const parsedCount = Number.parseInt(returnedCount, 10);

      if (Number.isInteger(parsedCount) && parsedCount > 0) {
        count = parsedCount;
      }

      break;
    }

    const breached = count > 0;

    console.log(
      `[breach-check] prefix ${prefix}, ${lines.length} suffixes returned, breached: ${breached}`,
    );

    return { breached, count };
  } catch (error) {
    console.log(`[breach-check] unavailable: ${failureReason(error)}`);

    return { breached: false, count: 0 };
  } finally {
    clearTimeout(timeout);
  }
}

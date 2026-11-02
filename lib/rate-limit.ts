import { prisma } from '@/server/data/prisma';

type RequestHeaders = {
  get(name: string): string | null;
};

// These headers can be forged by the client.
export function getClientIp(headers: RequestHeaders) {
  const forwarded = headers.get('x-forwarded-for');

  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();

    if (first) {
      return first;
    }
  }

  const realIp = headers.get('x-real-ip');

  if (realIp) {
    return realIp.trim();
  }

  return 'unknown';
}

export function countRecent(key: string, windowMs: number) {
  return prisma.rateLimitAttempt.count({
    where: {
      key,
      createdAt: {
        gte: new Date(Date.now() - windowMs),
      },
    },
  });
}

export function recordAttempt(key: string) {
  return prisma.rateLimitAttempt.create({
    data: { key },
  });
}

export async function isLimited(key: string, max: number, windowMs: number) {
  return (await countRecent(key, windowMs)) >= max;
}

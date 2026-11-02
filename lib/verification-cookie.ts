import { cookies } from 'next/headers';
import {
  VERIFICATION_CODE_TTL_SECONDS,
  VERIFICATION_COOKIE_NAME,
} from '@/config/verification';

export function setPendingVerificationEmail(email: string) {
  return cookies().then((cookieStore) => {
    cookieStore.set(VERIFICATION_COOKIE_NAME, email, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: VERIFICATION_CODE_TTL_SECONDS,
    });
  });
}

export async function getPendingVerificationEmail() {
  return (await cookies()).get(VERIFICATION_COOKIE_NAME)?.value;
}


import { randomInt } from 'node:crypto';
import { betterAuth } from 'better-auth';
import { emailOTP } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { VERIFICATION_CODE_LENGTH, VERIFICATION_CODE_TTL_SECONDS } from '@/config/verification';
import { hashPassword, verifyPassword } from '@/lib/password';
import { prisma } from '@/server/data/prisma';
import { getPracticeName } from '@/server/data/practice-settings';
import { enqueueEmail } from '@/server/email/enqueue-email';
import { sendEmail } from '@/server/email/send-email';
import { confirmEmailCodeTemplate } from '@/server/email/templates/confirm-email-code';
import { resetPasswordTemplate } from '@/server/email/templates/reset-password';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
    transaction: true,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 12,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      const practiceName = await getPracticeName();
      const email = resetPasswordTemplate({
        practiceName,
        url,
        expiresInHours: 1,
      });

      await enqueueEmail({
        type: 'E2',
        to: user.email,
        subject: email.subject,
        text: email.text,
      });
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'CLIENT',
        input: false,
      },
      isActive: {
        type: 'boolean',
        required: false,
        defaultValue: true,
        input: false,
      },
      membershipNumber: {
        type: 'string',
        required: true,
        input: true,
      },
      termsAcceptedAt: {
        type: 'date',
        required: false,
        input: true,
      },
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      '/sign-in/email': { window: 15 * 60, max: 20 },
      '/request-password-reset': { window: 60 * 60, max: 10 },
      '/reset-password': { window: 15 * 60, max: 10 },
    },
  },
  emailVerification: {
    sendOnSignIn: true,
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      otpLength: VERIFICATION_CODE_LENGTH,
      expiresIn: VERIFICATION_CODE_TTL_SECONDS,
      allowedAttempts: 3,
      storeOTP: 'hashed',
      generateOTP: () =>
        randomInt(0, 1_000_000).toString().padStart(6, '0'),
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type !== 'email-verification') {
          return;
        }

        const practiceName = await getPracticeName();
        const emailContent = confirmEmailCodeTemplate({
          practiceName,
          code: otp,
          expiresInMinutes: VERIFICATION_CODE_TTL_SECONDS / 60,
        });

        await sendEmail({
          type: 'E1',
          to: email,
          subject: emailContent.subject,
          text: emailContent.text,
          html: emailContent.html,
        });
      },
    }),
    nextCookies(),
  ],
});

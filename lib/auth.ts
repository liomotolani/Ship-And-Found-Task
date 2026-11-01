import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { prisma } from '@/server/data/prisma';
import { getPracticeName } from '@/server/data/practice-settings';
import { sendEmail } from '@/server/email/send-email';
import { confirmEmailTemplate } from '@/server/email/templates/confirm-email';
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
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      const practiceName = await getPracticeName();
      const email = resetPasswordTemplate({
        practiceName,
        url,
        expiresInHours: 1,
      });

      void sendEmail({
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
    },
  },
  rateLimit: {
    enabled: true,
  },
  emailVerification: {
    expiresIn: 60 * 60,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      const practiceName = await getPracticeName();
      const email = confirmEmailTemplate({
        practiceName,
        url,
        expiresInHours: 1,
      });

      void sendEmail({
        type: 'E1',
        to: user.email,
        subject: email.subject,
        text: email.text,
      });
    },
  },
  plugins: [nextCookies()],
});

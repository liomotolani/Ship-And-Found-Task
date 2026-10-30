import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/server/data/prisma';
import { getPracticeName } from '@/server/data/practice-settings';
import { sendEmail } from '@/server/email/send-email';
import { confirmEmailTemplate } from '@/server/email/templates/confirm-email';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 12,
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
});

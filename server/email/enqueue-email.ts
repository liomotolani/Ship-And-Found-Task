import type { EmailType } from '@prisma/client';
import { prisma } from '@/server/data/prisma';

type EnqueueEmailInput = {
  type: EmailType;
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export function enqueueEmail(input: EnqueueEmailInput) {
  return prisma.emailJob.create({
    data: {
      type: input.type,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      status: 'PENDING',
    },
  });
}

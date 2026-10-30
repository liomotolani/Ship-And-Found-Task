import type { EmailStatus, EmailType } from '@prisma/client';
import { prisma } from '@/server/data/prisma';

type NewEmailLog = {
  type: EmailType;
  recipient: string;
  status: EmailStatus;
  errorCode?: string;
};

export function createEmailLog(input: NewEmailLog) {
  return prisma.emailLog.create({
    data: {
      type: input.type,
      recipient: input.recipient,
      status: input.status,
      errorCode: input.errorCode,
    },
  });
}

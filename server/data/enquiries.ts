import { prisma } from '@/server/data/prisma';

type NewOnlineEnquiry = {
  petName: string | null;
  question: string;
};

export function createOnlineEnquiryRecord(input: NewOnlineEnquiry) {
  return prisma.enquiry.create({
    data: {
      channel: 'ONLINE',
      clientName: 'Client',
      clientEmail: null,
      petName: input.petName,
      question: input.question,
      isClinical: true,
      status: 'NEEDS_CLINICAL',
    },
  });
}

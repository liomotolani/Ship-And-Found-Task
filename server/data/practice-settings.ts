import { prisma } from '@/server/data/prisma';

export async function getPracticeName() {
  const settings = await prisma.practiceSettings.findUnique({
    where: { id: 'default' },
  });

  return settings?.practiceName ?? 'VetReply Practice';
}

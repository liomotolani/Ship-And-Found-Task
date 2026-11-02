import type { EmailJob } from '@prisma/client';
import { prisma } from '../server/data/prisma';
import { sendEmail } from '../server/email/send-email';

const BATCH_SIZE = 10;
const POLL_INTERVAL_MS = 5000;
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MINUTES = [1, 5, 15];

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function claimJobs() {
  const candidates = await prisma.emailJob.findMany({
    where: {
      status: 'PENDING',
      runAfter: { lte: new Date() },
    },
    orderBy: { runAfter: 'asc' },
    take: BATCH_SIZE,
    select: { id: true },
  });

  const claimed: EmailJob[] = [];

  for (const candidate of candidates) {
    const result = await prisma.emailJob.updateMany({
      where: {
        id: candidate.id,
        status: 'PENDING',
      },
      data: { status: 'SENDING' },
    });

    if (result.count === 1) {
      const job = await prisma.emailJob.findUnique({
        where: { id: candidate.id },
      });

      if (job) {
        claimed.push(job);
      }
    }
  }

  return claimed;
}

async function processJob(
  job: EmailJob,
  counts: { sent: number; failed: number; retrying: number },
) {
  let failureCode: string | undefined;

  const sent = await sendEmail(
    {
      type: job.type,
      to: job.to,
      subject: job.subject,
      text: job.text,
      html: job.html ?? undefined,
    },
    {
      onError: (code) => {
        failureCode = code;
      },
    },
  );

  if (sent) {
    await prisma.emailJob.update({
      where: { id: job.id },
      data: {
        status: 'SENT',
        text: '',
        html: null,
        lastError: null,
      },
    });

    counts.sent += 1;
    return;
  }

  const attempts = job.attempts + 1;
  const failed = attempts >= MAX_ATTEMPTS;
  const delayMinutes =
    RETRY_DELAYS_MINUTES[Math.min(attempts, MAX_ATTEMPTS) - 1];

  await prisma.emailJob.update({
    where: { id: job.id },
    data: {
      attempts,
      status: failed ? 'FAILED' : 'PENDING',
      lastError: failureCode ?? 'SEND_FAILED',
      runAfter: new Date(Date.now() + delayMinutes * 60 * 1000),
    },
  });

  if (failed) {
    counts.failed += 1;
  } else {
    counts.retrying += 1;
  }
}

async function runOnce() {
  const jobs = await claimJobs();
  const counts = { sent: 0, failed: 0, retrying: 0 };

  console.log(`[email-worker] start: ${jobs.length} jobs claimed`);

  for (const job of jobs) {
    await processJob(job, counts);
  }

  console.log(
    `[email-worker] finish: ${counts.sent} sent, ${counts.failed} failed, ${counts.retrying} retrying`,
  );
}

async function main() {
  while (true) {
    await runOnce();
    await sleep(POLL_INTERVAL_MS);
  }
}

main();

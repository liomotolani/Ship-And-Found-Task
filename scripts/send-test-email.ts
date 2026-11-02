import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

async function main() {
  const envFile = resolve(process.cwd(), '.env');

  if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }

  const { sendEmail } = await import('../server/email/send-email');
  const to = process.argv[2];

  if (!to) {
    console.error('Usage: send-test-email <recipient>');
    process.exit(1);
  }

  const sent = await sendEmail({
    type: 'E1',
    to,
    subject: 'VetReply SMTP test',
    text: 'This is a VetReply SMTP test email.',
  });

  console.log(sent ? 'Test email sent.' : 'Test email failed.');
  process.exit(sent ? 0 : 1);
}

main();

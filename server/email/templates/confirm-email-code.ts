import { getEmailTokens } from '@/server/email/email-tokens';

type ConfirmEmailCodeTemplateInput = {
  practiceName: string;
  code: string;
  expiresInMinutes: number;
};

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character]);
}

export function confirmEmailCodeTemplate({
  practiceName,
  code,
  expiresInMinutes,
}: ConfirmEmailCodeTemplateInput) {
  const tokens = getEmailTokens();
  const safePracticeName = escapeHtml(practiceName);
  const safeCode = escapeHtml(code);

  return {
    subject: 'Confirm your email',
    text: [
      `Your ${practiceName} verification code is:`,
      '',
      code,
      '',
      `This code expires in ${expiresInMinutes} minutes.`,
      'If you did not create a VetReply account, you can ignore this email.',
    ].join('\n'),
    html: `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Confirm your email</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: ${tokens.colorSurface}; color: ${tokens.colorOnSurface}; font-family: ${tokens.bodyFontFamily};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: ${tokens.colorSurface};">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 560px; background-color: ${tokens.colorSurface};">
            <tr>
              <td style="padding: 8px 0 24px; color: ${tokens.colorPrimary}; font-family: ${tokens.headlineFontFamily}; font-size: 30px; line-height: 1.2;">
                VetReply
              </td>
            </tr>
            <tr>
              <td style="color: ${tokens.colorOnSurface}; font-family: ${tokens.bodyFontFamily}; font-size: 16px; line-height: 1.5;">
                Your ${safePracticeName} verification code is:
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 24px 16px; background-color: ${tokens.colorPrimary}; color: ${tokens.colorOnPrimary}; font-family: ${tokens.headlineFontFamily}; font-size: 36px; line-height: 1.2; letter-spacing: 8px;">
                ${safeCode}
              </td>
            </tr>
            <tr>
              <td style="padding-top: 20px; color: ${tokens.colorOnSurfaceVariant}; font-family: ${tokens.bodyFontFamily}; font-size: 16px; line-height: 1.5;">
                This code expires in ${expiresInMinutes} minutes.
              </td>
            </tr>
            <tr>
              <td style="padding-top: 24px; color: ${tokens.colorOnSurfaceVariant}; font-family: ${tokens.bodyFontFamily}; font-size: 14px; line-height: 1.5;">
                If you did not create a VetReply account, you can ignore this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}

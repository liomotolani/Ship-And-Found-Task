type ConfirmEmailTemplateInput = {
  practiceName: string;
  url: string;
  expiresInHours: number;
};

export function confirmEmailTemplate({
  practiceName,
  url,
  expiresInHours,
}: ConfirmEmailTemplateInput) {
  return {
    subject: 'Confirm your email',
    text: [
      `Confirm your email address for ${practiceName}.`,
      '',
      'Open this link to confirm your email address:',
      url,
      '',
      `This link expires in ${expiresInHours} hour${
        expiresInHours === 1 ? '' : 's'
      }.`,
    ].join('\n'),
  };
}

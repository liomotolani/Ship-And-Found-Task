type ResetPasswordTemplateInput = {
  practiceName: string;
  url: string;
  expiresInHours: number;
};

export function resetPasswordTemplate({
  practiceName,
  url,
  expiresInHours,
}: ResetPasswordTemplateInput) {
  return {
    subject: 'Reset your password',
    text: [
      `Reset your password for ${practiceName}.`,
      '',
      'Open this link to choose a new password:',
      url,
      '',
      `This link expires in ${expiresInHours} hour${
        expiresInHours === 1 ? '' : 's'
      }.`,
    ].join('\n'),
  };
}

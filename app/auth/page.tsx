import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import SignInForm from '@/components/SignInForm';
import SignUpForm from '@/components/SignUpForm';
import { auth } from '@/lib/auth';
import { roleHomePath } from '@/lib/role-home';

type AuthForm = 'signup' | 'signin' | 'forgot';

type AuthPageProps = {
  searchParams: Promise<{ form?: string | string[] }>;
};

function resolveForm(form: string | string[] | undefined): AuthForm {
  if (form === 'signup' || form === 'signin' || form === 'forgot') {
    return form;
  }

  return 'signin';
}

function authTitle(form: AuthForm) {
  if (form === 'signup') {
    return 'Sign up';
  }

  if (form === 'forgot') {
    return 'Forgot password';
  }

  return 'Sign in';
}

export async function generateMetadata({
  searchParams,
}: AuthPageProps): Promise<Metadata> {
  const { form } = await searchParams;

  return {
    title: authTitle(resolveForm(form)),
  };
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const { form } = await searchParams;
  const activeForm = resolveForm(form);

  if (activeForm !== 'forgot') {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session) {
      redirect(roleHomePath(session.user.role));
    }
  }

  return (
    <main style={{ flex: 1, padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
        <h1
          style={{
            fontFamily: 'var(--type-headline-large-font-family)',
            fontSize: 'var(--type-headline-large-size)',
            fontWeight: 'var(--type-headline-large-weight)',
            lineHeight: 'var(--type-headline-large-line-height)',
            letterSpacing: 'var(--type-headline-large-letter-spacing)',
            color: 'var(--color-on-background)',
            marginBottom: '2rem',
          }}
        >
          {authTitle(activeForm)}
        </h1>

        {activeForm === 'signup' ? <SignUpForm /> : null}
        {activeForm === 'forgot' ? <ForgotPasswordForm /> : null}
        {activeForm === 'signin' ? <SignInForm /> : null}
      </div>
    </main>
  );
}

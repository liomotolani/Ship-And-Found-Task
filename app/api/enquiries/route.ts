import { NextResponse } from 'next/server';
import { enquirySchema } from '@/lib/validation/enquiry';
import { createOnlineEnquiry } from '@/server/services/enquiries';

const genericError =
  'Something went wrong. Nothing was changed. Try again.';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: genericError }, { status: 400 });
  }

  const result = enquirySchema.safeParse(body);

  if (!result.success) {
    const issue = result.error.issues[0];

    return NextResponse.json(
      {
        error: issue?.message ?? genericError,
        field: issue?.path[0] === 'petName' ? 'petName' : 'question',
      },
      { status: 400 },
    );
  }

  try {
    const enquiry = await createOnlineEnquiry(result.data);
    return NextResponse.json({ id: enquiry.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: genericError }, { status: 500 });
  }
}

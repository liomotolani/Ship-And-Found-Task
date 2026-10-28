import type { EnquiryInput } from '@/lib/validation/enquiry';
import { createOnlineEnquiryRecord } from '@/server/data/enquiries';

export function createOnlineEnquiry(input: EnquiryInput) {
  return createOnlineEnquiryRecord({
    petName: input.petName ?? null,
    question: input.question,
  });
}

---
trigger: model_decision
description: Apply when working on model calls, prompts, classification, enquiries, drafts or replies. Also Glob `server/ai/**`.
---

# generation-and-clinical-safety.md

Job: control what the model receives and produces, and what may reach a client.

## Rules

1. Keep every prompt in server/ai/. The system instruction is fixed text. Client text goes only inside a block labelled as untrusted client text and is never joined into the instruction.
   Reason: client text is data, not instructions (PRD 7.5).

2. Give the model no tools and no function calls.
   Reason: a model that can only return text cannot act on injected instructions.

3. Validate every model response against its Zod schema. Treat an invalid response as a failure. Drop citations that were not in the provided sources. No valid citation means "No approved information found."
   Reason: unchecked output can claim sources it never used (PRD 7.3).

4. Never let model output decide a role, access level, approval, price, booking or recipient.
   Reason: these are decided by server code only (PRD 7.5).

5. Classify each enquiry inside the request that creates it. Save it as Needs clinical staff unless classification returns non-clinical. A failure counts as clinical.
   Reason: a clinical enquiry must never appear non-clinical, even briefly (FR-019).

6. A clinical label can only make handling stricter. Any staff member can mark an enquiry clinical. Only a vet can mark it non-clinical.
   Reason: moving an enquiry away from a vet needs clinical judgement.

7. Run the pre-send check on the final text of every non-clinical reply before sending. A clinical result or a check failure blocks the send and shows the FR-024 message.
   Reason: staff can type or edit clinical advice into a non-clinical reply (FR-024).

8. Only a vet can approve a clinical reply, checked in the service. Never include clinical draft text in any response sent to a receptionist. The Practice Manager may view it but never approve it.
   Reason: hiding a draft in the page is not enough. It must never leave the server for the wrong role (FR-026, FR-027, SEC-008).

9. Label every clinical draft "Clinical draft. A vet must review every word."
   Reason: the vet must know the text came from the model (FR-025).

10. Apply the timeout and retry in PRD 7.7. On failure show the PRD 7.7 message and keep every non-AI feature working.
    Reason: a Gemini outage must not stop enquiries, booking or payments.

11. Count only quick answers and drafts towards the staff AI limit. Log every model call in ai_call without client text.
    Reason: indexing must not use up a user's limit, and logs must not hold client text (PRD 7.8).
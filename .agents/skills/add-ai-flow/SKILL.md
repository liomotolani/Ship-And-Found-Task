---
name: add-ai-flow
description: Use when adding or changing any model call in VetReply - classification, quick answer, non-clinical draft, clinical draft or pre-send check.
---

# Add an AI flow

Wire one model flow from access levels to a stored, logged result.

## Steps

1. Find the flow's row in docs/vetreply-prd-v2.md section 7.4. Write down its trigger, who can trigger it, the levels it searches, who sees the output and its clinical result. If the flow has no row, stop and ask.
   Check: all five values are written down from the table.

2. If the flow searches documents, call the one retrieval function in server/data/ with the flow name. Follow retrieval-and-access-levels.md. If the flow searches nothing, skip to step 4.
   Check: the flow code contains no other chunk query.

3. If retrieval returns no chunks, return the no-information result and end the flow there.
   Check: a test with no matching chunks shows no call to the AI client double.

4. Add the flow's prompt template and output Zod schema in server/ai/. Follow generation-and-clinical-safety.md.
   Check: the template places client text only inside the untrusted block.

5. Call the AI client through its interface with the timeout and retry from PRD 7.7.
   Check: the service receives the AI client as a dependency, not as an import.

6. Validate the response with the schema from step 4. Remove every citation that was not in the provided sources. If none remain, return the no-information result.
   Check: a test with an invented citation returns no answer.

7. Apply the flow's clinical result from step 1.
   Check: a test with a clinical response produces the clinical result from the 7.4 row.

8. Log the call in ai_call with the user, flow name and outcome. Count it towards the staff limit only for a quick answer or a draft.
   Check: a test shows one ai_call row per call, and no client text in it.

9. Store the result in the table the flow's requirement names: quick_answer, reply or enquiry.
   Check: the stored row holds the cited document titles where the flow produces citations.

10. Write unit tests with the AI client double for four responses: valid, invalid, timeout and clinical.
    Check: four tests exist and pass.

11. Extend the role isolation tests to this flow for every role allowed to trigger it.
    Check: the role isolation run shows 0 leaks.

12. Draft evaluation cases for the flow in tests/eval/ and mark them for the human to approve.
    Check: each new case states role, question, expected source titles and expected outcome.
---
trigger: model_decision
description: Apply when working on documents, indexing, embeddings, retrieval, quick answers or drafts. Also Glob `server/data/**`.
---

# retrieval-and-access-levels.md


Job: control which document text any flow may search.

## Rules

1. Set allowed access levels from the flow and the session role, exactly as PRD 7.2 lists them:

   | Flow | Allowed levels |
   |---|---|
   | Quick answer, receptionist | Reception |
   | Quick answer, vet | Reception, Clinical |
   | Quick answer, Practice Manager | Reception, Clinical, Manager only |
   | Non-clinical draft, any role | Reception |
   | Clinical draft, vet only | Reception, Clinical |
   | Any client action | No retrieval |

   Reason: text that can reach a client never comes from Manager only documents, and non-clinical replies never come from Clinical documents.

2. Keep one retrieval function in server/data/. Every flow calls it with the flow name. No other code queries chunks.
   Reason: one function means one filter to test.

3. Filter by access level and by `chunk.version = document.live_version` inside the SQL query, before ordering by distance. Never filter results afterwards. Never read `document.status` in retrieval.
   Reason: filtering after ranking can pass restricted text to the model, and status changes during re-indexing (PRD 7.1, 7.2).

4. Re-index by writing chunks at live_version + 1, then in one transaction set the new live_version, delete the old chunks and set the document Ready.
   Reason: the document keeps answering from its old version until the new one is complete.

5. Apply the top-k and relevance threshold from PRD 7.2. When no chunk passes, stop with "No approved information found." and make no model call.
   Reason: no source, no answer (PRD 7.2, 7.3).

6. Accept documents only as pasted text or one .txt or .md file within the size limit in FR-009. Parse uploads into text and discard the file.
   Reason: the PRD stores no files and caps size so indexing fits the function time limit (FR-009, 7.1).

7. If indexing fails, set the document Failed and leave the previous live version in use.
   Reason: a failed re-index must never remove a working document (PRD 7.1).
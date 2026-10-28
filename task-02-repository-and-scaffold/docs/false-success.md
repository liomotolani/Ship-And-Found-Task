# False success

## Result
My app did not report a false success. When the database connection was broken, the user saw an error, the server logged a failure, and no row
was created.

## What I did
Broke the connection by pointing DATABASE_URL to "postgresql://nobody:wrong@localhost:9999/none" restarted the server, and submitted "What do Shella eat" as the message in the form.

## What the user saw
A red message: 'Something went wrong. Nothing was changed. Try again.'

![What the user saw with the database down](../evidence/13-write-failed-ui.png)

## What actually happened
- Server log: POST /api/enquiries 500 in 491ms
- Status code: 500, not 201, so nothing was created
- Prisma Studio: no new row 

Full logs: evidence/13-write-failed-logs.txt

## Why my app didn't lie
- The API route only returns 201 after createOnlineEnquiry(result.data);  succeeds src/app/api/enquiries/route.ts, line 32.
- If createOnlineEnquiry(result.data) throws, the catch block returns 500 (line 35).
- The form checks res.ok before showing success A 500 isn't ok, so it shows the error instead.

## How the false success happens (and how a demo would be fooled)
Earlier before I did this task, I created the an enquiry and it returned a 303 in the logs but showed user that the enquiries was saved and when I checked the database it wasn't there but rather on some docker database. 
This can happen when:
- the database is connected to another database and then returns a 303 in the logs and not 201.
- the form shows "success" whenever the request finishes, without checking the status code.

A reviewer clicking through a demo only sees the screen. If the screen says "success", they believe it. Only the logs (no 201) or the database (no row) show the truth.

## The 30-second check
Submit the form and look for a 201 in the server log. No 201 means nothing was created, whatever the screen says.
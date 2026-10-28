# Working tree

## The pipeline
My code moves from my computer (the files I edit), into the local Git store when I commit, to GitHub when I push, and to production when it is deployed. Branches let me build on the side before merging into main.

## Where code becomes visible to users
Production. Until code is deployed, no receptionist can see or use it.

## Where a mistake can no longer be undone quietly
Once it is pushed to main on GitHub. Before that I can amend or reset commits on my laptop and nobody knows. After it, other people and the deploy pipeline may have pulled it, so undoing it means a visible revert or rewriting shared history.

## What breaks when a tree has only one branch
Every change goes straight onto main. Half-finished work sits next to working code, there is nowhere to review a change before it lands, and an urgent fix can't ship without also shipping whatever else is half done.

## Why it matters more after the first deployment
Before deployment, a broken main only affects me. After it, main is what clinics are using, so one bad commit breaks the product for real receptionists during a working day. One branch means no safe place to test a change before users get it.
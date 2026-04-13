# ADR 009: Do not require redundant entry within the same journey

## Status

Accepted

## Date

2026-04-14

## Context

The service is a multi-step intake flow used by the general public, often on mobile devices and sometimes in assisted mode. Requiring users to re-enter information they have already provided increases effort, increases error risk, and can create accessibility barriers.

## Decision

Version 1 will not require users to re-enter information they have already provided within the same journey unless there is a clear legal, safeguarding, or operational reason.

## Consequences

- answers should be replayed, reused, or made selectable where needed rather than requested again
- check-answers and edit flows must preserve existing values
- session and state design must support carrying data forward across steps
- any intentional exception should be explicit and reviewable

## Review trigger

Review if a specific legal, operational, or safeguarding requirement makes repeated entry necessary for a particular field.

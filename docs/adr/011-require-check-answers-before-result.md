# ADR 011: Require a check-answers step before the result

## Status

Accepted

## Date

2026-04-14

## Context

The service is a high-stakes triage journey. Users may be uncertain, may complete the flow with assistance, and may need a final chance to review what they entered before receiving guidance or referral output.

## Decision

Version 1 will include a dedicated check-answers step before the result page.

## Consequences

- the journey includes a review step as a first-class route, not an optional extra
- answers must be replayed in plain language with clear change links
- result generation should use the reviewed state of the journey
- attempts to remove the review step later should require an explicit decision

## Review trigger

Review after user research only if there is strong evidence that the review step adds friction without improving confidence, correction, or outcome quality.

# ADR 001: Treat the service as triage, not determination

## Status

Accepted

## Date

2026-04-14

## Context

The product supports people who may be affected by Spain’s 2026 extraordinary regularisation process, but it is not the official government service and should not present itself as a legal decision-maker.

## Decision

The service will provide cautious triage outcomes and next-step guidance, not formal eligibility determinations.

## Consequences

- result states use language such as “likely in scope” and “needs specialist review”
- the UI must avoid decision-like wording such as “approved”, “rejected”, or “you qualify”
- the UI should prefer route language such as “another route may fit better” over definitive negative labels such as “not eligible”
- complex or uncertain cases are routed towards human support

## Review trigger

Review if official policy, partner workflows, or legal review create a strong need for more definitive outcome wording.

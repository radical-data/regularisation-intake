# ADR 003: Do not require account creation in version 1

## Status

Accepted

## Date

2026-04-14

## Context

The product is an intake and triage service, not an ongoing account-based service. Mandatory accounts would add friction and exclude some users.

## Decision

Version 1 will not require account creation to start or complete the screener.

## Consequences

- save and resume should use a lower-friction mechanism
- summaries should be available without a persistent user account
- future account introduction would require a new ADR

## Review trigger

Review if save-and-resume, cross-device continuity, or partner workflows cannot be supported safely without stronger identity or authentication.

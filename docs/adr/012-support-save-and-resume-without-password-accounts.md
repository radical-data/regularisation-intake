# ADR 012: Support save and resume without password accounts

## Status

Accepted

## Date

2026-04-14

## Context

Many users may need to pause the journey to gather information, switch device, seek help, or return later with a support worker. At the same time, version 1 avoids mandatory account creation because the product is a triage service rather than an ongoing account-based service.

## Decision

Version 1 should support save and resume without requiring a password-based user account.

## Consequences

- continuation should rely on a lower-friction mechanism than full account registration
- save-and-resume design must balance continuity, privacy, and safeguarding
- the service should remain usable for people with limited digital confidence or unstable device access
- stronger identity or authentication requirements later would need a new decision

## Review trigger

Review if cross-device continuity, partner handoff, or privacy controls cannot be supported safely enough without stronger authentication.

# ADR 006: Use SvelteKit server-first form actions as the default interaction model

## Status

Accepted

## Date

2026-04-14

## Context

The product is a step-by-step intake and triage service with high accessibility and resilience requirements. The core journey should work with standard browser form submission, and JavaScript should improve the experience rather than be required for basic completion.

## Decision

Use SvelteKit form actions and normal HTML forms as the default interaction model.

Progressive enhancement may be added where it improves the user experience, but the baseline journey must work without client-side JavaScript.

## Consequences

- validation and branching happen on the server by default
- each step should be representable as a normal POST/redirect or POST/rerender cycle
- client-side enhancement should be optional and additive
- the app should avoid unnecessary client-side state machines for the core journey

## Review trigger

Review if the product later adds complex authenticated workflows, offline-first requirements, or interaction patterns that are materially hindered by the server-first approach.

# ADR 008: Target WCAG 2.2 AA for version 1

## Status

Accepted

## Date

2026-04-14

## Context

The product is a public-facing intake service likely to be used on mobile devices, with assisted completion, varying digital confidence, and potentially high stakes for users.

## Decision

Version 1 will target WCAG 2.2 AA.

This target applies to the core journey, check-answers flow, result pages, and summary outputs under the team's control.

## Consequences

- accessibility must be considered a release criterion, not a later polish task
- semantic HTML and native form controls should be preferred where practical
- grouped inputs must use accessible fieldset and legend structures
- validation and error handling must be screen-reader and keyboard compatible
- progressive enhancement must not break the baseline accessible flow

## Review trigger

Review if legal, partner, or deployment requirements call for a higher accessibility bar, or if user research exposes gaps in the current interpretation of WCAG 2.2 AA.

# ADR 002: Use one question per page as the default journey pattern

## Status

Accepted

## Date

2026-04-14

## Context

This service is aimed at a broad public audience, including assisted users, people with low digital confidence, and people completing a high-stakes journey on mobile devices.

## Decision

The service will use one question per page as the default pattern. Multiple inputs may be grouped only where they are clearly one conceptual answer or where research shows a better outcome.

## Consequences

- the route structure should support step-by-step progression
- validation and recovery are handled per step
- check-answers becomes a distinct review step

## Review trigger

Review after user research if grouped questions clearly improve comprehension or speed without harming accessibility.

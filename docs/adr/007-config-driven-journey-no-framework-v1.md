# ADR 007: Keep the journey config-driven, but do not build a general form framework in v1

## Status

Accepted

## Date

2026-04-14

## Context

The product needs policy-sensitive branching, cautious triage outcomes, and a clear separation between content, routing logic, and rendering. At the same time, version 1 is a single service, not a reusable platform.

## Decision

Version 1 will be implemented as one product with a config-driven journey and separable triage logic.

The team will not build a general-purpose form-building framework or multi-tenant form platform in version 1.

## Consequences

- question definitions, route order, and result rules should be inspectable outside page components
- the codebase should keep reusable seams where extraction is plausible later
- implementation should optimise for the needs of this service first
- any future framework extraction must be justified by real reuse, not anticipated reuse

## Review trigger

Review if multiple real services begin to duplicate the same flow engine, question model, or result-generation logic.

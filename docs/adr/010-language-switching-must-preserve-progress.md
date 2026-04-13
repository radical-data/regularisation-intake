# ADR 010: Language switching must preserve progress

## Status

Accepted

## Date

2026-04-14

## Context

The service is multilingual and will be used by people who may need to switch language to understand legal or technical wording, or to complete the journey with help from another person. Losing progress on language change would increase abandonment and undermine trust.

## Decision

Users must be able to switch language without losing answers already entered in the current journey.

## Consequences

- language selection must be separated from answer storage
- translated content must map to stable underlying question and answer identifiers
- language changes must preserve navigation state where practical
- implementation and testing must treat multilingual continuity as a core behaviour, not an enhancement

## Review trigger

Review if the product later adds language-specific routing, translated answer values, or jurisdiction-specific content that materially changes how state is stored.

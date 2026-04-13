# Triage rules

This document defines the first version of the triage model used by the regularisation intake service.

It is intentionally cautious.

The service is not a legal decision-maker. These rules exist to:

- avoid wasting users' time
- surface uncertainty early
- separate straightforward next steps from cases that need higher-touch support
- keep routing logic inspectable and reviewable outside the UI layer

## Rule design principles

- use as few hard gates as possible
- use specialist-review routing rather than exclusion when facts are uncertain or legally nuanced
- treat reported facts as self-declared signals, not verified truths
- prefer understandable next steps over fine-grained internal scoring
- keep policy-sensitive values configurable

## Inputs used by v1 triage

Version 1 triage uses the following categories of input:

- whether the person is in Spain now
- whether they report living in Spain before 31 December 2025
- approximate residence start
- whether they report mostly living in Spain since then
- asylum or international protection history
- identity-document categories
- evidence categories present
- reported specialist issues
- support needs and safe contact preferences
- routing geography

## Result states

The decision engine can produce one of the following result states:

- `likely_in_scope`
- `possible_but_needs_more_evidence`
- `needs_specialist_review`
- `another_route_may_fit_better`
- `not_enough_information_yet`

## Hard gates

Hard gates should be rare.

They are used only where a confident answer strongly suggests that continuing the standard flow would be unhelpful.

### HG-01 — Not living in Spain before 31 December 2025

If the user gives a confident `no` to living in Spain before 31 December 2025, the default result is:

- `another_route_may_fit_better`

unless a later reviewed policy rule creates an exception path.

### HG-02 — Not currently in Spain

If the user gives a confident `no` to currently being in Spain, the default result is:

- `another_route_may_fit_better`

This is softer than HG-01 because future clarification steps may distinguish temporary absence from living elsewhere.

## Soft gates and specialist-review triggers

Soft gates do not automatically stop the journey. They add flags that influence the final result and summary.

### SG-01 — Uncertain core timeline

Add an uncertainty flag if any of these are `not sure`:

- before-cutoff question
- residence start question
- mostly living in Spain question
- asylum-history question

If multiple core timeline answers are uncertain, prefer:

- `not_enough_information_yet`

unless a stronger specialist route is present.

### SG-02 — Contradictory timeline

Add a contradiction flag if the user reports:

- living in Spain before 31 December 2025
- but then provides a residence start clearly after that date

Contradictions should usually produce:

- `needs_specialist_review`

rather than a hard negative result.

### SG-03 — Continuity concerns

If the user reports not mostly living in Spain since arrival, add a continuity concern flag.

This usually leads to:

- `needs_specialist_review`

unless other answers clearly suggest a more suitable route outside this process.

### SG-04 — Asylum complexity

If the user reports asylum or international protection history and is uncertain about timing, or says they are unsure how it affects the process, add an asylum complexity flag.

Default outcome tendency:

- `needs_specialist_review`

### SG-05 — Missing identity documents

If the user reports no identity documents, add a missing-identity flag.

Default outcome tendency:

- `needs_specialist_review`

### SG-06 — Criminal-record concern

If the user reports a possible criminal-record issue, add a high-priority specialist flag.

Default outcome:

- `needs_specialist_review`

### SG-07 — Identity mismatch

If the user reports mismatched names or dates across documents, add an identity-consistency flag.

Default outcome tendency:

- `needs_specialist_review`

### SG-08 — Safeguarding or urgent support

If the user reports feeling unsafe sharing information digitally, needing urgent human support, or an unsafe contact situation, add a safeguarding flag.

Default outcome:

- `needs_specialist_review`

with a support-led next step.

## Evidence readiness heuristics

Version 1 does not verify documents. It uses broad evidence categories as a rough signal of readiness.

### Stronger evidence signal

Two or more of the following usually indicates at least some evidence readiness:

- padrón certificate
- rental or housing papers
- medical or pharmacy records
- school or education records
- work-related papers
- asylum or immigration papers

### Weaker evidence signal

The following can still be useful, but should not usually count as strong by themselves:

- NGO, church, or community letters
- money transfer or financial receipts
- travel tickets or travel records
- `other` without further detail

### Very limited evidence signal

If the user selects only:

- `I do not have any of these yet`

or otherwise shows little evidence readiness, the default outcome tendency is:

- `possible_but_needs_more_evidence`

unless stronger specialist flags are present.

## Result-state guidance

These rules are intentionally simple and should be easy to reason about.

### likely_in_scope

Use when all of the following are broadly true:

- no hard gate has fired
- no major specialist flag is present
- core timeline answers broadly align
- the person reports living in Spain before the cutoff
- the person reports at least some plausible evidence categories

### possible_but_needs_more_evidence

Use when:

- the timeline broadly aligns
- there are no major specialist flags
- but evidence appears thin, weak, or missing

### needs_specialist_review

Use when any of the following are present and likely material:

- asylum complexity
- criminal-record concern
- identity mismatch
- missing identity documents
- continuity concern
- safeguarding concern
- contradictory core answers

### another_route_may_fit_better

Use when:

- a hard gate fires with a confident answer
- and there is no stronger reason to keep the user in a specialist review path within this process

### not_enough_information_yet

Use when:

- too many core answers are unknown
- and there is not enough information to support any clearer next step

## Priority order

When multiple rules fire, use this priority order:

1. safeguarding-driven specialist review
2. criminal-record or identity-risk specialist review
3. asylum complexity specialist review
4. hard-gate route-out
5. evidence-driven `possible_but_needs_more_evidence`
6. `not_enough_information_yet`
7. `likely_in_scope`

This priority order can be revised after real journey testing.

## Summary outputs

The triage engine should produce more than a single result state.

It should also generate:

- triggered flags
- evidence-readiness signal
- routing geography
- support-needs summary
- next-step suggestions
- whether human review is recommended immediately

## Review triggers

Review these rules when:

- the official policy criteria change
- operational guidance for the process becomes clearer
- partner organisations report misrouting
- user research shows that hard gates are confusing or too aggressive
- evidence questions are not predictive enough to support useful triage

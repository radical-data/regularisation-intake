# Journey v1

This document is the screen-by-screen source of truth for the version 1 intake journey.

It complements, rather than replaces:

- `docs/design-spec.md`
- `docs/policy-context.md`
- `docs/triage-rules.md`

The journey is designed as a **triage flow**, not a legal determination flow.

## Journey principles

- stop early only on a small number of high-confidence hard gates
- prefer routing and explanation over definitive negative outcomes
- screen IDs should remain stable even if route slugs change
- canonical result-state identifiers are defined in `docs/triage-rules.md`

## Route map

```text
/                           Start page
/start                      Start and orientation
/language                   Language
/completion-mode            Self or assisted
/in-spain-now               In Spain now?
/before-cutoff              In Spain before 31 Dec 2025?
/residence-start            Approximate residence start
/mostly-living-in-spain     Continuity / mostly living in Spain
/asylum-history             Asylum or international protection history?
/asylum-before-cutoff       If yes, whether before cutoff
/identity-documents         Identity document categories
/evidence-categories        Evidence categories present
/family-support             Children or dependants needing support?
/specialist-flags           Specialist-review issues
/support-needs              What help is needed?
/safe-contact               Safe contact preference
/province                   Routing geography
/check-answers              Review answers
/result                     Result and next-step plan
```

Exact route names can change during implementation. Screen IDs should remain stable.

## Screen catalogue

### START-01 — Start and orientation

**Route:** `/start`

**Purpose**

Orient the user, reduce fear, and explain what the service is and is not.

**Content**

- this is not the official government application
- this does not decide immigration status
- this helps identify likely next steps and support needs
- it usually takes around 5 to 8 minutes
- answers can be changed later
- the service can be completed with help from another person

**Primary action**

- continue

**Secondary action**

- start in assisted mode, or continue to the completion-mode question

**Notes**

No data is captured here apart from analytics events if enabled.

---

### LANG-01 — Language selection

**Route:** `/language`

**Question**

Which language would you like to use?

**Answer type**

Single choice.

**Initial launch languages**

Implementation can decide the exact initial set. The content model must support multiple languages.

**Validation**

Required.

**Next**

`MODE-01`

**Check-answers**

Not shown.

---

### MODE-01 — Completion mode

**Route:** `/completion-mode`

**Question**

Who are you completing this for?

**Answer type**

Single choice.

**Options**

- for myself
- for someone else with their permission
- I am a support worker or volunteer

**Validation**

Required.

**Next**

`LOC-01`

**Check-answers label**

Who completed this screener

---

### LOC-01 — In Spain now

**Route:** `/in-spain-now`

**Question**

Are you currently in Spain?

**Answer type**

Single choice.

**Options**

- yes
- no
- not sure

**Validation**

Required.

**Gate type**

Soft gate.

**Logic**

- `yes` -> `CUTOFF-01`
- `not sure` -> `CUTOFF-01` and add uncertainty flag
- `no` -> short route-out result unless later implementation adds a temporary-absence clarification step

**Check-answers label**

Currently in Spain

---

### CUTOFF-01 — Before cutoff date

**Route:** `/before-cutoff`

**Question**

Were you living in Spain before 31 December 2025?

**Answer type**

Single choice.

**Options**

- yes
- no
- not sure

**Validation**

Required.

**Gate type**

Hard gate for a confident `no`, subject to asylum-related routing.

**Logic**

- `yes` -> `TIMELINE-01`
- `not sure` -> `TIMELINE-01` and add uncertainty flag
- `no` -> route to `another_route_may_fit_better`, unless asylum logic later creates an exception path

**Check-answers label**

Living in Spain before 31 December 2025

---

### TIMELINE-01 — Residence start

**Route:** `/residence-start`

**Question**

About when did you start living in Spain?

**Answer type**

Month and year, plus `not sure`.

**Validation**

Required, but `not sure` is valid.

**Gate type**

Informational.

**Logic**

- always continue to `CONTINUITY-01`
- if the entered date clearly conflicts with `CUTOFF-01=yes`, add a contradiction flag

**Check-answers label**

Approximate residence start

---

### CONTINUITY-01 — Mostly living in Spain

**Route:** `/mostly-living-in-spain`

**Question**

Since then, have you mostly been living in Spain?

**Answer type**

Single choice.

**Options**

- yes
- mostly yes, with short absences
- no
- not sure

**Validation**

Required.

**Gate type**

Soft gate.

**Logic**

- `yes` or `mostly yes, with short absences` -> `ASYLUM-01`
- `not sure` -> `ASYLUM-01` and add uncertainty flag
- `no` -> `ASYLUM-01` and add specialist-review flag

**Check-answers label**

Mostly living in Spain since arrival

---

### ASYLUM-01 — Asylum or protection history

**Route:** `/asylum-history`

**Question**

Have you applied for asylum or international protection in Spain?

**Answer type**

Single choice.

**Options**

- yes
- no
- not sure

**Validation**

Required.

**Logic**

- `yes` -> `ASYLUM-02`
- `no` -> `ID-01`
- `not sure` -> `ID-01` and add specialist-review flag

**Check-answers label**

Asylum or international protection history

---

### ASYLUM-02 — Asylum before cutoff

**Route:** `/asylum-before-cutoff`

**Question**

Did you apply before 31 December 2025?

**Answer type**

Single choice.

**Options**

- yes
- no
- not sure

**Validation**

Required.

**Gate type**

Specialist-routing signal.

**Logic**

- always continue to `ID-01`
- `yes` strengthens potential in-scope signal
- `no` or `not sure` increases need for review depending on other answers

**Check-answers label**

Applied for asylum before 31 December 2025

---

### ID-01 — Identity documents

**Route:** `/identity-documents`

**Question**

Do you currently have any identity documents?

**Answer type**

Multiple choice.

**Options**

- passport
- national identity card
- expired passport or expired identity document
- asylum document
- no identity documents
- prefer not to say

**Validation**

Require at least one response.

**Logic**

- continue to `EVIDENCE-01`
- `no identity documents` adds specialist-review flag

**Check-answers label**

Identity documents

---

### EVIDENCE-01 — Evidence categories

**Route:** `/evidence-categories`

**Question**

Which of these do you already have that may show you were in Spain?

**Answer type**

Multiple choice.

**Options**

- padrón certificate
- rental contract or housing papers
- utility bills
- medical or pharmacy records
- school or education records
- NGO, church, or community letters
- work-related papers
- money transfer or financial receipts
- travel tickets or travel records
- asylum or immigration papers
- other
- I do not have any of these yet

**Validation**

Require at least one response.

**Logic**

- continue to `FAMILY-01`
- zero or very weak evidence categories contribute to `possible_but_needs_more_evidence`

**Check-answers label**

Evidence categories available

---

### FAMILY-01 — Family support

**Route:** `/family-support`

**Question**

Do you need support for children or dependants too?

**Answer type**

Single choice.

**Options**

- yes
- no
- not sure

**Validation**

Required.

**Logic**

- always continue to `FLAGS-01`
- `yes` adds a family-support note for the summary

**Check-answers label**

Children or dependants needing support

---

### FLAGS-01 — Specialist flags

**Route:** `/specialist-flags`

**Question**

Do any of these apply?

**Answer type**

Multiple choice.

**Options**

- my name or dates do not match across documents
- I may have a criminal-record issue
- I have had a refusal in another procedure and I need help understanding it
- I am not sure how my asylum situation affects this process
- I feel unsafe sharing some information digitally
- I need urgent human support
- none of these

**Validation**

Require at least one response.

**Logic**

- continue to `SUPPORT-01`
- most non-`none of these` responses add specialist-review or safeguarding flags

**Check-answers label**

Issues that may need specialist help

---

### SUPPORT-01 — Support needs

**Route:** `/support-needs`

**Question**

What kind of help would make this easier?

**Answer type**

Multiple choice.

**Options**

- language help
- in-person help
- phone support
- help scanning or printing documents
- help using a phone or computer
- legal review
- help understanding which papers to gather
- I can probably do the next step myself

**Validation**

Require at least one response.

**Logic**

- continue to `CONTACT-01`
- contributes to referral routing and summary

**Check-answers label**

Support needed

---

### CONTACT-01 — Safe contact preference

**Route:** `/safe-contact`

**Question**

How is it safest to contact you?

**Answer type**

Single choice, optionally with a follow-up detail field.

**Options**

- SMS
- WhatsApp
- phone call
- email
- through the organisation helping me
- do not contact me yet

**Validation**

Required.

**Logic**

- continue to `GEO-01`
- contributes to partner handoff and safeguarding

**Check-answers label**

Safe contact preference

---

### GEO-01 — Province

**Route:** `/province`

**Question**

Which province are you in?

**Answer type**

Single choice or autocomplete.

**Validation**

Required.

**Logic**

- continue to `CHECK-01`
- used for referral routing only

**Check-answers label**

Province

---

### CHECK-01 — Check answers

**Route:** `/check-answers`

**Purpose**

Allow users to review and change answers before seeing a result.

**Requirements**

- show answers in plain language
- show all answer values from the current stored journey state
- provide change links per answer or per section
- preserve earlier answers when editing

**Primary action**

- continue to result

---

### RESULT-01 — Result and next-step plan

**Route:** `/result`

**Purpose**

Show a cautious triage outcome, practical next steps, and support direction.

**Outputs**

- one result state from `docs/triage-rules.md`
- short explanation in plain language
- next-step plan
- evidence gaps where relevant
- support recommendation where relevant
- summary identifier if implemented

**Actions**

- print or save summary
- start again
- referral handoff where available

## Notes for implementation

- The first milestone only needs a vertical slice through `START-01`, `CUTOFF-01`, `TIMELINE-01`, `CHECK-01`, and `RESULT-01`.
- The question IDs in this document should remain stable even if route slugs change.
- If policy assumptions change, update `docs/policy-context.md` and `docs/triage-rules.md` before changing this journey.

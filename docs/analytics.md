# Analytics

## Purpose

We use analytics to improve the service, not to maximise tracking.

This is a public-interest service for people navigating a high-stakes process. Our analytics approach is intentionally narrow: we collect only what we need to understand whether the service is working, where users encounter friction, and which parts of the journey need improvement.

We do not use analytics for advertising, profiling, cross-site tracking, or measuring individuals.

## Principles

### Service improvement over surveillance

We measure only what helps improve the service, for example:

- whether people start and complete the journey
- where people drop out or hit validation errors
- which route groups and result states are reached
- whether handover and support features are being used

We avoid collecting data that is interesting but not useful for service improvement.

### Data minimisation

We prefer coarse, operationally useful signals over detailed behavioural tracking.

We do not track more personal detail than we need, and we avoid analytics designs that would make it easy to reconstruct a sensitive individual journey.

### Privacy by design

We prefer privacy-preserving analytics settings by default.

Our aim is to run analytics in a way that is:

- first-party
- cookieless where practical
- transparent to users
- limited to audience measurement and service improvement
- easy to disable locally
- easy to separate from production

### Trust and interpretation

This service may be used by people in vulnerable or uncertain situations. We should therefore be cautious about what we measure, how long we retain it, and who can access it. If an event or dimension creates more user risk than service value, we should not collect it.

Analytics is only one input. We interpret it alongside user research, support feedback, policy changes, and operational observations. We do not make product decisions from event counts alone.

## Tracking scope

### What we track

We track a small number of page and event signals that help answer service questions.

Current examples include:

- locale
- environment
- route group
- step slug
- result state
- recommended route
- selected product events such as validation errors, directory searches, and handover downloads

These help answer questions such as:

- which parts of the journey are used most
- where people struggle
- whether users are reaching an outcome
- whether support-oriented features are being used

### What we do not track

We do not use analytics for:

- ads or marketing attribution
- cross-site tracking
- third-party behavioural profiling
- recording free-text answers
- session replay
- heatmaps
- keystroke capture
- detailed person-level behavioural analysis

## Operating model

### Separation of environments

Production traffic and non-production traffic must never be mixed.

We use separate Matomo sites for production and non-production so that service metrics stay trustworthy and operational decisions are not distorted by testing traffic.

### Default posture

Our default analytics posture is:

- separate production and non-production Matomo sites
- localhost off unless explicitly enabled for testing
- no mixing of test traffic with production reporting
- privacy-preserving Matomo settings enabled where practical
- clear user-facing disclosure in the privacy materials
- an objection or opt-out path where required

### Implementation expectations

The tracker configuration should remain aligned with this document. In practice that means:

- cookies should stay disabled unless there is a reviewed reason to enable them
- IP anonymisation or masking should be enabled in Matomo
- production and non-production must keep separate site IDs
- analytics dimensions should stay small in number and operationally justified
- new analytics events should only be added when they answer a concrete service question
- analytics changes should be reviewed for privacy, user trust, and reporting usefulness

### Practical rule

Use analytics to answer specific service questions, not to collect everything possible.

Use the production Matomo site only for real production traffic. Use the test Matomo site for everything else. Keep localhost off unless you are deliberately testing analytics.

## Matomo setup

Create two websites in Matomo:

1. `Primer Paso`
   - production only
2. `Primer Paso - Test`
   - deploy previews
   - branch deploys
   - other non-production hosts
   - optionally localhost when deliberately testing analytics

### Production site

Set:

- Name: `Primer Paso`
- Known URLs: production domains only, for example:
  - `https://primerpaso.org/`
  - `https://www.primerpaso.org/`

Recommended:

- exclude known internal IPs if stable
- exclude noisy query parameters if they pollute reports

### Test site

Set:

- Name: `Primer Paso - Test`
- Known URLs: non-production domains only, for example:
  - Netlify deploy preview domains
  - Netlify branch deploy domains
  - any other non-production host if used

Do not add production domains here.

Only add localhost-related URLs when you are intentionally testing local analytics.

Recommended:

- exclude your own IPs if useful
- keep this site clearly marked as non-production

## Netlify setup

Manage Matomo variables in the Netlify UI using deploy-context values.

### Production

- `PUBLIC_MATOMO_ENABLED=true`
- `PUBLIC_MATOMO_SITE_ID_PRODUCTION=<production site id>`
- `PUBLIC_MATOMO_SITE_ID_TEST=<test site id>`
- `PUBLIC_MATOMO_LOCAL_ANALYTICS=off`

### Deploy previews

Use the same values as production.

### Branch deploys

Use the same values as production.

### Local development

Default:

- `PUBLIC_MATOMO_LOCAL_ANALYTICS=off`

Only when actively testing localhost tracking:

- set `PUBLIC_MATOMO_LOCAL_ANALYTICS=test`

## Environment variables

- `PUBLIC_MATOMO_SITE_ID_PRODUCTION`: Matomo site ID for production traffic
- `PUBLIC_MATOMO_SITE_ID_TEST`: Matomo site ID for non-production traffic
- `PUBLIC_MATOMO_LOCAL_ANALYTICS`: localhost behaviour, currently `off` or `test`
- `PUBLIC_MATOMO_PRODUCTION_HOSTS`: comma-separated production hostnames

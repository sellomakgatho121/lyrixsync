## Improvements Backlog (Sourced from Awesome Lists)

References: `sindresorhus/awesome`, Awesome Web Performance, Awesome A11y, Awesome PWA, Awesome Analytics, Awesome Observability, Awesome Security, Awesome Testing.

UI/UX & Design System
- Adopt Radix UI primitives + shadcn/ui for accessible components (Awesome Design Systems)
- Introduce Storybook with a11y and interactions addons (Awesome Design Systems)
- Theming: light/dark/high-contrast with prefers-color-scheme (Awesome CSS)

Accessibility (A11y)
- Integrate axe-core CI checks and eslint-plugin-jsx-a11y (Awesome A11y)
- Keyboard-first editor workflows; focus management and roving tabindex
- Color contrast checks via Stark-like tooling; focus-visible styles

Performance & Web Vitals
- Establish performance budgets; Lighthouse CI in GitHub Actions (Awesome Web Performance)
- Code-split editor tools; prefetch critical routes; optimize bundle via Next/Image and React lazy
- Use requestIdleCallback for non-critical analytics and preload audio metadata

PWA & Offline
- Add manifest, Workbox service worker with background sync for edits (Awesome PWA)
- Cache audio metadata and waveform tiles; optimistic UI with offline queue

Editor & Media Precision
- Waveform via Wavesurfer.js; keyboard scrubbing and markers
- Beat/BPM detection (music-tempo, aubio-wasm) for snap-to-grid
- LRC toolkit for import/export; SRT→LRC converter; batch operations

Collaboration
- Presence indicators; CRDT (Y.js/Automerge) document per song over websockets
- Per-line attribution and change history; conflict resolution UI

Security
- Security headers (next-safe-middleware); CSP with nonces (Awesome Security)
- OWASP ZAP scan in CI; dependency auditing; session hardening

Observability & Analytics
- Sentry for errors; OpenTelemetry traces; PostHog for product analytics + session replay (Awesome Observability/Analytics)
- Define SLOs for editor latency and sync accuracy; error budgets

Testing & QA
- Vitest unit tests; Playwright E2E for editor accuracy and a11y (Awesome Testing)
- Synthetic tests for sync accuracy ±10ms and offline scenarios

Onboarding & Education
- Interactive onboarding using Shepherd.js tour; command palette (cmdk)
- In-app tips for shortcuts; demo data mode

Internationalization
- i18next with ICU message format; RTL support; font fallback strategy

Data & Search
- Add Postgres GIN indexes for text search; local fuzzy search with Fuse.js for client-side lists

Release & DX
- Conventional commits + Changesets; automated changelog
- PR templates enforcing rubric checks; preview deployments


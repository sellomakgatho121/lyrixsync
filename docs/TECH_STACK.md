## Tech Stack Justification (LyrixSync)

Primary Stack
- Next.js 15 (App Router) + TypeScript: SSR/SSG, routing, performance; aligns with Core Web Vitals goals.
- Tailwind CSS + Radix Primitives + Headless UI: Accessible, composable UI; accelerates WCAG targets.
- Prisma + PostgreSQL: Reliable relational storage; indexes for search/sort; JSON for editor drafts.
- Socket.IO: Real-time presence and events; upgrade path to CRDT via Y.js or Automerge over websockets.
- PWA (Workbox) + Next PWA: Offline caching, background sync for edits and media metadata.

Audio & Editor
- Web Audio API + Wavesurfer.js (or @wavesurfer/react): Waveform rendering and precise scrubbing.
- Beat/BPM detection (music-tempo, aubio-wasm): Snap-to-grid assistance.
- LRC tooling: lrc-file-parser; custom converters for SRT↔LRC.

DX, Quality, and Observability
- Storybook: Component isolation for editor widgets and states.
- Vitest/Playwright: Unit + E2E for accuracy and a11y; CI gates on Web Vitals via Lighthouse CI.
- ESLint + Prettier + TypeScript strict: Code quality.
- Sentry (or OpenTelemetry + Grafana Tempo): Errors and traces; PostHog for product analytics and session replay.

Security
- NextAuth with Prisma adapter: OAuth; add RBAC via roles on `User`.
- OWASP ZAP in CI; security headers via `next-safe-middleware`.

Data Model Additions
- `Song.createdAt` and `updatedAt` for robust sorting.
- `Lyric.version`, `Lyric.authorId` for attribution; optional CRDT doc per song for collaborative edits.


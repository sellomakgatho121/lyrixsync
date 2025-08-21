## Quality Rubric (LyrixSync)

Quality Dimension | Poor (What Competitors Do) | Good (Base Expectation) | Great (Our Target) | Metric/Test
--- | --- | --- | --- | ---
Sync Accuracy | Visible drift; manual only | Basic timestamp editing | ±10ms highlight accuracy; snap-to-beat grid | Automated playback tests, frame-by-frame checks
Editor UX | Mouse-heavy, few shortcuts | Common shortcuts, basic undo | Full keyboard parity, vim-like nav, scrub wheel, multi-select | SUS usability score ≥85, task time ↓30%
Import/Export | Limited formats | LRC import/export | LRC (enhanced), SRT→LRC, CSV, batch ops | Format test suite; 100% round-trip fidelity
Collaboration | File locking or none | Presence only | Low-latency co-edit with CRDT/OT, per-line attribution | Latency p95 < 150ms; conflict resolution success > 99%
Performance | Long TTI; jank scrolling | Meets Core Web Vitals | TTI < 2s on 3G; no long tasks > 50ms during editing | Lighthouse ≥95, Web Vitals CI gate
Accessibility | Keyboard traps; low contrast | Passes basic checks | WCAG 2.2 AA+, screen reader cues, high-contrast theme | axe clean; manual NVDA/VoiceOver passes
Offline Reliability | No offline | Read-only cache | Full offline edit with autosave, background sync | Airplane-mode test suite; zero data loss
Observability | Minimal logs | Error logging | Traces + RUM + session replay for editor | SLOs met; error budget tracking
Security & Auth | Weak sessions | Standard OAuth | OAuth with device flows, RBAC, audit logs | OWASP ASVS checks; ZAP clean


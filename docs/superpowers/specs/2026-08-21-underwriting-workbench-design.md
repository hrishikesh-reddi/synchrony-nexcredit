# NexCredit Underwriting Workbench Design

## Intent

Redesign the existing dynamic NexCredit dashboard as a premium underwriting workbench inspired by the supplied financial-dashboard reference. Preserve the current React/Spring API behaviour and clearly separate real API data from prototype visual simulations.

## Visual system

- **Canvas:** mist `#F4F6FA`; card `#FFFFFF`; ink `#121826`; muted `#667085`.
- **Brand:** NexCredit navy `#16276F`; electric blue `#2F7DE1`; success `#12B76A`; warning `#F79009`; danger `#F04438`.
- **Layout:** 12-column desktop grid, 24px gaps, rounded 20px white cards, a compact top command bar, and responsive single-column mobile stacking.
- **Signature:** a persistent “Decision trace” card that connects the five underwriting stages to the active portfolio rather than imitating a generic consumer-banking dashboard.

## Page structure

```text
Top command bar: NexCredit / Dashboard / Review / Audit / New application
Welcome + operational summary
┌ Applicant portfolio ───────┬ Decision trace ─────┬ Underwriting pulse ┐
│ table and action           │ 5-stage pipeline    │ approval/review KPIs│
└────────────────────────────┴─────────────────────┴─────────────────────┘
┌ Human review queue ─────────────────┬ Recent audit trail ──────────────┐
└─────────────────────────────────────┴──────────────────────────────────┘
```

## Interaction rules

- Navigation scrolls to the appropriate live section without client-side routing.
- “New application” preserves the existing drawer/form/API workflow.
- Portfolio rows remain live server data; review and audit cards consume existing APIs.
- Status colours are reserved for decision/risk meaning. Decorative cards use neutral blue-gray tones.
- Motion is limited to the already-existing submitted-application trace and small hover/focus feedback.

## Accessibility and integrity

- Use semantic headings, contrast-safe text, visible keyboard focus, and responsive table overflow.
- Do not claim fraud heatmap, document scan, traditional comparison, or agent visualisation are live AI systems.

## Verification

- Existing frontend smoke test asserts workbench content.
- `CI=true npm test -- --watchAll=false` and `npm run build` pass.
- Browser check confirms `localhost:3001` renders without client errors and New application opens.

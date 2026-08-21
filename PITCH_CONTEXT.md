# NexCredit AI — Pitch Context

## One-line pitch

NexCredit AI is an explainable underwriting workbench that helps lenders assess New-to-Credit applicants using consented alternative signals, while making every decision, guardrail, and human-review route visible.

## The problem

Traditional underwriting can depend heavily on formal credit history. That leaves New-to-Credit and thin-file applicants with little opportunity to demonstrate creditworthiness, even when they have useful behavioural and income-related signals.

## Our solution

NexCredit combines mobile-use, transaction-behaviour, social-signal, and income inputs into a transparent prototype decision workflow. Rather than showing a black-box score, it presents:

- the underwriting stages,
- an approval, rejection, or review outcome,
- confidence and fraud-risk context,
- an understandable decision rationale,
- a bias-aware escalation route,
- and an audit record linked to the application.

## Why it is different

Most hackathon credit projects stop at a form and a loan-status label. NexCredit makes the decision inspectable from end to end. In one demo, a reviewer can see the alternative-data profile, the specialised workflow trace, an illustrative conventional-versus-NexCredit comparison, the inclusion impact, fraud signals, a risk radar, review status, and the audit trail.

## The demo narrative

1. Start on the portfolio dashboard to show seeded applicants and the NTC impact metrics.
2. Create a Gig Worker profile: mobile `85`, transactions `80`, social `70`.
3. Show the five-stage underwriting trace: creditworthiness, fraud, decision, explanation, audit.
4. Reveal the explainable approval, low-risk indicator, comparison card, heatmap, and radar.
5. Switch to a low-confidence or high-risk profile to show the human-review path and the age guardrail.
6. Finish with the audit record linked to the newly created application.

## Responsible-AI message

NexCredit is intentionally not presented as a fully autonomous loan-approval system. The prototype uses deterministic, explainable rules and routes uncertain/high-risk/policy-sensitive cases to human review. Its visual document scan, fraud telemetry, and traditional comparison are clearly labelled prototype simulations. A production system would require consented data collection, model governance, fairness testing, monitoring, security controls, and regulatory review.

## Synchrony alignment

The project aligns with a lender’s need to expand access while keeping decisions explainable, controlled, and auditable. Position it as an agent-oriented underwriting workflow—not a claim of deployed autonomous AI—and connect it to Synchrony’s publicly reported investment in data-driven underwriting and AI governance.

## Future roadmap

- Replace deterministic rules with governed, evaluated model services.
- Add consent management and data-source provenance.
- Process actual documents through secure extraction and validation services.
- Stream real-time fraud signals through an event pipeline.
- Add role-based review, reason-code policy controls, fairness monitoring, and immutable audit storage.

# ADR-010 — Temporary Development Provider (NVIDIA NIM)

## Decision

Use NVIDIA NIM as a temporary, dev-only provider for the AI recommendation pipeline while OpenAI billing is unresolved, running `gpt-oss-20b` rather than the larger `gpt-oss-120b`. The smaller model is chosen because the objective right now is validating pipeline mechanics, not maximizing recommendation quality, and its lower latency makes iterative testing faster.

## Scope

This validates streaming mechanics end-to-end: provider integration, `streamObject()` against a real model, schema validation, candidate-set business-rule validation, and the AI error-handling paths. It does not satisfy the Phase 4 / Deliverable 7 milestone gate — a real, live, end-to-end streaming call against the production provider — because `gpt-oss-20b` may differ from OpenAI's model in hallucination rate, `.describe()` adherence, and behavior on the duplicate-`robotId` refine, so that call must still be rerun against OpenAI.

## Review Trigger

Once OpenAI billing is enabled, switch the provider back and rerun the complete end-to-end streaming validation against OpenAI. The NIM-based run is a development aid only and does not count toward satisfying the milestone gate.

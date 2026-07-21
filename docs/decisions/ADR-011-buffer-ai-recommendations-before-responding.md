# ADR-011 — Buffer AI Recommendations Before Responding

## Decision

Buffer generated recommendations until AI generation completes, then perform schema validation and business-rule validation (per ADR-008) before returning the response to the client. The client receives a single complete response, not incremental updates.

## Alternatives Considered

### Validate and stream each recommendation incrementally as it completes

Rejected.

The endpoint returns at most three recommendations. Incremental streaming would require validating and forwarding recommendations one at a time as the model completes each one, adding implementation complexity — partial-object handling, per-item validation ordering, client-side incremental rendering — for a UX benefit that is limited when the total payload is this small.

## Rationale

Buffering guarantees clients only ever receive fully validated recommendations, preserving the guarantees defined in ADR-008 without needing to reconcile "already streamed to the client" against "later found invalid."

This deviates from Deliverable 7's streaming criterion, which states that no acceptable UX sends a response only after the full LLM response arrives. We accept that deviation here because the response is capped at three items — the latency cost of waiting for the full generation before responding is small relative to the complexity incremental delivery would add, and the alternative risks exposing a recommendation to the client that business-rule validation later rejects.

The implementation continues to call `streamObject()` rather than switching to `generateObject()`, even though chunks are buffered rather than forwarded to the client. ADR-010 already scoped `streamObject()` as the mechanism being validated, against both NIM and, eventually, OpenAI; switching to `generateObject()` now would mean re-validating a different function's error handling, retry behavior, and partial-parse semantics for no benefit today. It also works against the Review Trigger below: if incremental delivery is adopted later, the change becomes "start forwarding chunks already being received" rather than "swap the underlying generation call and revalidate its behavior from scratch."

## Consequences

### Positive

- Clients only ever receive recommendations that have passed both validation stages defined in ADR-008.
- Implementation stays simple — no incremental-delivery transport (SSE or streaming response) needs to be built or tested yet.
- `streamObject()` remains the validated generation primitive from ADR-010; no rework of provider-call mechanics is required later.

### Trade-offs

- Clients do not receive incremental recommendation updates during generation — full response latency is paid up front.
- This deviates from Deliverable 7's stated streaming-UX criterion; the deviation is accepted here specifically because the response is capped at three items, not as a general exception to that criterion.
- Chunks are still received via `streamObject()` and discarded/accumulated rather than forwarded, which is unneeded complexity today relative to `generateObject()` — accepted as the cost of keeping the future incremental-delivery path cheap.

## Review Trigger

Revisit if response size, generation latency, or user-experience requirements make incremental streaming worthwhile. Because `streamObject()` remains in place, the revisit is expected to be a transport change (forward chunks to the client as they arrive) rather than a provider-call change.

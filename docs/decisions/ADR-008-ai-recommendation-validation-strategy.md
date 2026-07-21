# ADR-008 — AI Recommendation Validation Strategy

## Decision

Validate AI recommendations in two stages:

1. Validate the LLM response against the Zod schema.
2. Apply business-rule validation to the parsed recommendations.

Recommendations that violate business rules (for example, referencing a `robotId` outside the candidate set) are discarded. Remaining valid recommendations continue through the response pipeline.

If no valid recommendations remain after business validation, treat the AI response as a failure and return the dedicated recommendation error state.

## Alternatives Considered

### Fail the entire response if any recommendation is invalid

Rejected.

A single invalid recommendation should not prevent users from receiving other valid recommendations generated in the same response.

### Accept all recommendations after schema validation

Rejected.

Schema validation cannot verify application-specific business rules such as candidate-set membership. Accepting all recommendations could expose invalid or inconsistent results to users.

## Rationale

Schema validation and business validation solve different problems.

Zod ensures the AI response matches the expected data contract, but it cannot verify rules that depend on application state. Candidate-set membership, for example, requires knowledge of which robots were actually supplied to the model.

Filtering invalid recommendations allows the system to tolerate occasional LLM mistakes while still returning trustworthy results whenever possible. This improves resilience without compromising data integrity.

The validation strategy intentionally favors graceful degradation. Individual recommendation failures do not invalidate the entire response when trustworthy recommendations remain. The response is treated as a failure only after business validation determines that no valid recommendations remain, at which point the frontend displays the dedicated recommendation error state.

## Consequences

### Positive

- More resilient to occasional LLM contract violations.
- Valid recommendations remain usable even if individual recommendations fail validation.
- Clear separation between schema validation and business-rule validation.
- Additional business-rule validators can be added without changing the response schema.

### Trade-offs

- Response processing requires an additional validation stage.
- Invalid recommendations are filtered from the final response.
- Validation failures should be logged to monitor AI quality and identify recurring issues.

## Future Considerations

Additional business validation rules may be introduced alongside candidate-set validation, including duplicate recommendation detection and other application-specific consistency checks. Each rule should be evaluated independently rather than being coupled to schema validation.

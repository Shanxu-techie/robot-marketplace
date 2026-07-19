import { RecommendationCandidate } from '../queries/get-recommendation-candidates'
import { RecommendationRequest } from '../schemas/robot-request'

export function buildRecommendationContext(
  request: RecommendationRequest,
  candidates: RecommendationCandidate[]
): string {
  return [
    '## User Request',
    JSON.stringify(request),
    '',
    '## Candidate List',
    JSON.stringify(candidates),
  ].join('\n')
}

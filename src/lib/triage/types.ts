export type ResultState =
	| 'likely_in_scope'
	| 'possible_but_needs_more_evidence'
	| 'needs_specialist_review'
	| 'another_route_may_fit_better'
	| 'not_enough_information_yet'

export interface TriageResult {
	resultState: ResultState
	flags: string[]
	reason?: string
	evidenceStrength: 'strong' | 'thin' | 'unknown'
	showHowToApply: boolean
	showSupportCta: boolean
	showDocumentCta: boolean
	explanation: string
	nextSteps: string[]
	humanReviewRecommended: boolean
}

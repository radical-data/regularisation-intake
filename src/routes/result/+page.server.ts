import { redirect } from '@sveltejs/kit'
import { getJourneyState } from '$lib/server/journey'
import { runTriage } from '$lib/triage/engine'
import type { PageServerLoad } from './$types'

const resultTitle = {
	likely_in_scope: 'Likely in scope',
	possible_but_needs_more_evidence: 'This route may fit, but you may need more papers first',
	needs_specialist_review: 'Needs specialist review',
	another_route_may_fit_better: 'This probably is not the right route for you',
	not_enough_information_yet: 'We need a bit more information before suggesting a next step'
} as const

export const load: PageServerLoad = ({ cookies }) => {
	const state = getJourneyState(cookies)

	if (!state.answers.province) {
		redirect(303, '/province')
	}

	const result = runTriage(state.answers)

	return {
		result: { ...result, title: resultTitle[result.resultState] },
		province: state.answers.province,
		sessionId: state.sessionId
	}
}

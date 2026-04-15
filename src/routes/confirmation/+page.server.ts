import { getJourneyState } from '$lib/server/journey'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies }) => {
	const state = getJourneyState(cookies)
	return {
		sessionId: state.sessionId,
		submittedAt: state.updatedAt
	}
}

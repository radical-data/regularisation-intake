import { resolveLocale } from '$lib/content'
import { buildHandoverPacket } from '$lib/server/handover'
import { getJourneyState } from '$lib/server/journey'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies }) => {
	const state = getJourneyState(cookies)

	const locale = resolveLocale(state.answers.language)

	return {
		locale,
		packet: buildHandoverPacket(state, locale)
	}
}

import { resolveLocale } from '$lib/content'
import { getJourneyState } from '$lib/server/journey'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies }) => {
	return { locale: resolveLocale(getJourneyState(cookies).answers.language) }
}

import type { Handle } from '@sveltejs/kit'

import { getTextDirection, resolveLocale } from '$lib/content'
import { getJourneyState } from '$lib/server/journey'

export const handle: Handle = async ({ event, resolve }) => {
	const state = getJourneyState(event.cookies)
	const locale = resolveLocale(state.answers.language)
	const dir = getTextDirection(locale)

	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('<html lang="es" dir="ltr">', `<html lang="${locale}" dir="${dir}">`)
	})
}

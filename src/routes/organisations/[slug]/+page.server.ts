import { error } from '@sveltejs/kit'
import { resolveLocale } from '$lib/content'
import { getOrganisationBySlug } from '$lib/organisations/repository'
import { getJourneyState } from '$lib/server/journey'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies, params }) => {
	const locale = resolveLocale(getJourneyState(cookies).answers.language)
	const organisation = getOrganisationBySlug(params.slug)

	if (!organisation) {
		error(404, 'Organisation not found')
	}

	return {
		locale,
		organisation,
		backHref: '/organisations'
	}
}

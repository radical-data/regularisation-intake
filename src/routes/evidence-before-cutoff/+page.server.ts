import { fail, redirect } from '@sveltejs/kit'
import {
	getJourneyState,
	getSafeReturnTo,
	resolveReturnTo,
	updateJourneyAnswers
} from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const valid = [
	'padron_or_registration',
	'housing_papers',
	'health_or_pharmacy',
	'school_or_childcare',
	'work_papers',
	'organisation_or_church_letter',
	'travel_or_transport',
	'something_else_dated_named',
	'none_yet',
	'not_sure'
] as const

export const load: PageServerLoad = ({ cookies, url }) => {
	const state = getJourneyState(cookies)
	return {
		values: state.answers.evidenceBeforeCutoff ?? [],
		returnTo: getSafeReturnTo(url, '/evidence-recent-months')
	}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const selected = formData.getAll('evidenceBeforeCutoff').map(String)
		const values = selected.filter((value): value is (typeof valid)[number] =>
			valid.includes(value as (typeof valid)[number])
		)
		if (values.length === 0) {
			return fail(400, { error: 'Choose at least one option.', values: selected })
		}
		updateJourneyAnswers(cookies, { evidenceBeforeCutoff: values })
		redirect(303, resolveReturnTo(formData.get('returnTo'), '/evidence-recent-months'))
	}
}

import { fail, redirect } from '@sveltejs/kit'
import {
	getJourneyState,
	getSafeReturnTo,
	resolveReturnTo,
	updateJourneyAnswers
} from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const valid = [
	'worked_in_spain',
	'close_family_relevant',
	'vulnerable_situation',
	'none',
	'not_sure'
] as const

export const load: PageServerLoad = ({ cookies, url }) => {
	const state = getJourneyState(cookies)
	if (state.answers.asylumBeforeCutoff === 'yes') {
		redirect(303, '/asylum-documents')
	}
	return {
		values: state.answers.nonAsylumGrounds ?? [],
		returnTo: getSafeReturnTo(url, '/identity-documents')
	}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const selected = formData.getAll('nonAsylumGrounds').map(String)
		const values = selected.filter((value): value is (typeof valid)[number] =>
			valid.includes(value as (typeof valid)[number])
		)
		if (values.length === 0) {
			return fail(400, { error: 'Choose at least one option.', values: selected })
		}
		updateJourneyAnswers(cookies, { nonAsylumGrounds: values })
		redirect(303, resolveReturnTo(formData.get('returnTo'), '/identity-documents'))
	}
}

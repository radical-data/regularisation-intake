import { fail, redirect } from '@sveltejs/kit'
import {
	getJourneyState,
	getSafeReturnTo,
	resolveReturnTo,
	updateJourneyAnswers
} from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const valid = [
	'criminal_record_worry',
	'identity_missing_or_mismatch',
	'asylum_case_not_clear',
	'want_specialist',
	'none'
] as const

export const load: PageServerLoad = ({ cookies, url }) => {
	const state = getJourneyState(cookies)
	return {
		values: state.answers.specialistFlags ?? [],
		returnTo: getSafeReturnTo(url, '/province')
	}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const selected = formData.getAll('specialistFlags').map(String)
		const values = selected.filter((value): value is (typeof valid)[number] =>
			valid.includes(value as (typeof valid)[number])
		)
		if (values.length === 0) {
			return fail(400, { error: 'Choose at least one option.', values: selected })
		}
		updateJourneyAnswers(cookies, { specialistFlags: values })
		redirect(303, resolveReturnTo(formData.get('returnTo'), '/province'))
	}
}

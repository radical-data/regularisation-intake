import { fail, redirect } from '@sveltejs/kit'
import {
	getJourneyState,
	getSafeReturnTo,
	resolveReturnTo,
	updateJourneyAnswers
} from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const valid = [
	'housing_papers',
	'health_or_pharmacy',
	'school_or_childcare',
	'work_papers',
	'organisation_or_church_letter',
	'bank_or_money_transfer',
	'travel_or_dated_receipts',
	'something_else_dated_named',
	'none_yet',
	'not_sure'
] as const

export const load: PageServerLoad = ({ cookies, url }) => {
	const state = getJourneyState(cookies)
	return {
		values: state.answers.evidenceRecentMonths ?? [],
		returnTo: getSafeReturnTo(url, '/specialist-flags')
	}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const selected = formData.getAll('evidenceRecentMonths').map(String)
		const values = selected.filter((value): value is (typeof valid)[number] =>
			valid.includes(value as (typeof valid)[number])
		)
		if (values.length === 0) {
			return fail(400, { error: 'Choose at least one option.', values: selected })
		}
		updateJourneyAnswers(cookies, { evidenceRecentMonths: values })
		redirect(303, resolveReturnTo(formData.get('returnTo'), '/specialist-flags'))
	}
}

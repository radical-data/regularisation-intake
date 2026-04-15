import { fail, redirect } from '@sveltejs/kit'
import {
	getJourneyState,
	getSafeReturnTo,
	resolveReturnTo,
	updateJourneyAnswers
} from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const valid = ['yes', 'no', 'not_sure'] as const
const isValid = (value: string): value is (typeof valid)[number] =>
	valid.includes(value as (typeof valid)[number])

export const load: PageServerLoad = ({ cookies, url }) => {
	const state = getJourneyState(cookies)
	return {
		value: state.answers.asylumBeforeCutoff ?? '',
		returnTo: getSafeReturnTo(url, '/five-month-stay')
	}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const asylumBeforeCutoff = String(formData.get('asylumBeforeCutoff') ?? '')
		if (!isValid(asylumBeforeCutoff)) {
			return fail(400, {
				error:
					'Choose whether you applied for asylum or international protection in Spain before 1 January 2026.',
				value: asylumBeforeCutoff
			})
		}

		updateJourneyAnswers(cookies, { asylumBeforeCutoff })
		redirect(303, resolveReturnTo(formData.get('returnTo'), '/five-month-stay'))
	}
}

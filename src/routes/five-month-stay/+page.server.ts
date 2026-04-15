import { fail, redirect } from '@sveltejs/kit'
import {
	getJourneyState,
	getSafeReturnTo,
	resolveReturnTo,
	updateJourneyAnswers
} from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const valid = ['yes', 'mostly_yes', 'no', 'not_sure'] as const
const isValid = (value: string): value is (typeof valid)[number] =>
	valid.includes(value as (typeof valid)[number])

export const load: PageServerLoad = ({ cookies, url }) => {
	const state = getJourneyState(cookies)
	return { value: state.answers.fiveMonthStay ?? '', returnTo: getSafeReturnTo(url, '/route-next') }
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const fiveMonthStay = String(formData.get('fiveMonthStay') ?? '')
		if (!isValid(fiveMonthStay)) {
			return fail(400, {
				error: 'Choose whether you have been in Spain during the last 5 months.',
				value: fiveMonthStay
			})
		}

		const state = updateJourneyAnswers(cookies, { fiveMonthStay })
		redirect(
			303,
			resolveReturnTo(
				formData.get('returnTo'),
				state.answers.asylumBeforeCutoff === 'yes' ? '/asylum-documents' : '/non-asylum-route'
			)
		)
	}
}

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
		value: state.answers.inSpainNow ?? '',
		returnTo: getSafeReturnTo(url, '/residence-start')
	}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const inSpainNow = String(formData.get('inSpainNow') ?? '')
		if (!isValid(inSpainNow)) {
			return fail(400, { error: 'Choose whether you are in Spain now.', value: inSpainNow })
		}
		updateJourneyAnswers(cookies, { inSpainNow })
		redirect(303, resolveReturnTo(formData.get('returnTo'), '/residence-start'))
	}
}

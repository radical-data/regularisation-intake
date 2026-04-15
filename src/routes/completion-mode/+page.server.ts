import { fail, redirect } from '@sveltejs/kit'
import {
	getJourneyState,
	getSafeReturnTo,
	resolveReturnTo,
	updateJourneyAnswers
} from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const valid = ['self', 'someone_else', 'support_worker'] as const
const isValid = (value: string): value is (typeof valid)[number] =>
	valid.includes(value as (typeof valid)[number])

export const load: PageServerLoad = ({ cookies, url }) => {
	const state = getJourneyState(cookies)
	return {
		value: state.answers.completionMode ?? '',
		returnTo: getSafeReturnTo(url, '/in-spain-now')
	}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const completionMode = String(formData.get('completionMode') ?? '')
		if (!isValid(completionMode)) {
			return fail(400, { error: 'Choose who you are filling this in for.', value: completionMode })
		}
		updateJourneyAnswers(cookies, { completionMode })
		redirect(303, resolveReturnTo(formData.get('returnTo'), '/in-spain-now'))
	}
}

import { fail, redirect } from '@sveltejs/kit'
import {
	getJourneyState,
	getSafeReturnTo,
	resolveReturnTo,
	updateJourneyAnswers
} from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const valid = ['es', 'en', 'ar', 'fr'] as const
const isValid = (value: string): value is (typeof valid)[number] =>
	valid.includes(value as (typeof valid)[number])

export const load: PageServerLoad = ({ cookies, url }) => {
	const set = url.searchParams.get('set')
	if (set && isValid(set)) {
		updateJourneyAnswers(cookies, { language: set })
		redirect(303, '/start')
	}

	const state = getJourneyState(cookies)
	return {
		value: state.answers.language ?? '',
		returnTo: getSafeReturnTo(url, '/completion-mode')
	}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const language = String(formData.get('language') ?? '')
		if (!isValid(language)) {
			return fail(400, { error: 'Choose a language.', value: language })
		}

		updateJourneyAnswers(cookies, { language })
		redirect(303, resolveReturnTo(formData.get('returnTo'), '/completion-mode'))
	}
}

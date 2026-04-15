import { fail, redirect } from '@sveltejs/kit'
import {
	getJourneyState,
	getSafeReturnTo,
	resolveReturnTo,
	updateJourneyAnswers
} from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const valid = [
	'madrid',
	'barcelona',
	'valencia',
	'sevilla',
	'malaga',
	'alicante',
	'bizkaia',
	'zaragoza',
	'murcia',
	'other'
] as const
const isValid = (value: string): value is (typeof valid)[number] =>
	valid.includes(value as (typeof valid)[number])

export const load: PageServerLoad = ({ cookies, url }) => {
	const state = getJourneyState(cookies)
	return { value: state.answers.province ?? '', returnTo: getSafeReturnTo(url, '/check-answers') }
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const province = String(formData.get('province') ?? '')
		if (!isValid(province)) {
			return fail(400, { error: 'Choose a province.', value: province })
		}
		updateJourneyAnswers(cookies, { province })
		redirect(303, resolveReturnTo(formData.get('returnTo'), '/check-answers'))
	}
}

import { fail, redirect } from '@sveltejs/kit'
import { getJourneyState, updateJourneyAnswers } from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const valid = ['contact_me', 'show_options', 'no_thanks'] as const
const isValid = (value: string): value is (typeof valid)[number] =>
	valid.includes(value as (typeof valid)[number])

export const load: PageServerLoad = ({ cookies }) => {
	const state = getJourneyState(cookies)
	return { value: state.answers.referralChoice ?? '' }
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const referralChoice = String(formData.get('referralChoice') ?? '')
		if (!isValid(referralChoice)) {
			return fail(400, { error: 'Choose what kind of help you want next.', value: referralChoice })
		}
		updateJourneyAnswers(cookies, { referralChoice })
		redirect(
			303,
			referralChoice === 'contact_me' || referralChoice === 'show_options'
				? '/support-needs'
				: '/confirmation'
		)
	}
}

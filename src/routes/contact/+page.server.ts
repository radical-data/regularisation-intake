import { fail, redirect } from '@sveltejs/kit'
import { getJourneyState, updateJourneyAnswers } from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const valid = ['sms', 'whatsapp', 'phone', 'email', 'through_organisation'] as const
const isValid = (value: string): value is (typeof valid)[number] =>
	valid.includes(value as (typeof valid)[number])

export const load: PageServerLoad = ({ cookies }) => {
	const state = getJourneyState(cookies)
	if (
		state.answers.referralChoice !== 'contact_me' &&
		state.answers.referralChoice !== 'show_options'
	) {
		redirect(303, '/confirmation')
	}
	return {
		method: state.answers.contactMethod ?? '',
		value: state.answers.contactValue ?? ''
	}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const contactMethod = String(formData.get('contactMethod') ?? '')
		const contactValue = String(formData.get('contactValue') ?? '').trim()
		if (!isValid(contactMethod)) {
			return fail(400, {
				error: 'Choose how we should contact you.',
				method: contactMethod,
				value: contactValue
			})
		}
		if (contactMethod !== 'through_organisation' && !contactValue) {
			return fail(400, {
				error: 'Enter the contact detail for the method you chose.',
				method: contactMethod,
				value: contactValue
			})
		}

		updateJourneyAnswers(cookies, { contactMethod, contactValue })
		redirect(303, '/confirmation')
	}
}

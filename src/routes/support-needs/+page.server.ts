import { fail, redirect } from '@sveltejs/kit'
import { getJourneyState, updateJourneyAnswers } from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const valid = [
	'another_language',
	'in_person_help',
	'help_using_phone_or_computer',
	'help_scanning_or_printing',
	'help_gathering_papers',
	'specialist_advice',
	'not_sure'
] as const

export const load: PageServerLoad = ({ cookies }) => {
	const state = getJourneyState(cookies)
	return { values: state.answers.supportNeeds ?? [] }
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const selected = formData.getAll('supportNeeds').map(String)
		const values = selected.filter((value): value is (typeof valid)[number] =>
			valid.includes(value as (typeof valid)[number])
		)
		if (values.length === 0) {
			return fail(400, { error: 'Choose at least one option.', values: selected })
		}
		updateJourneyAnswers(cookies, { supportNeeds: values })
		redirect(303, '/contact')
	}
}

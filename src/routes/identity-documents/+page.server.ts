import { fail, redirect } from '@sveltejs/kit'
import {
	getJourneyState,
	getSafeReturnTo,
	resolveReturnTo,
	updateJourneyAnswers
} from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const valid = [
	'current_passport',
	'expired_passport',
	'national_identity_card',
	'travel_document',
	'no_identity_documents_now',
	'not_sure'
] as const

export const load: PageServerLoad = ({ cookies, url }) => {
	const state = getJourneyState(cookies)
	return {
		values: state.answers.identityDocuments ?? [],
		returnTo: getSafeReturnTo(url, '/evidence-before-cutoff')
	}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const selected = formData.getAll('identityDocuments').map(String)
		const values = selected.filter((value): value is (typeof valid)[number] =>
			valid.includes(value as (typeof valid)[number])
		)
		if (values.length === 0) {
			return fail(400, { error: 'Choose at least one option.', values: selected })
		}
		updateJourneyAnswers(cookies, { identityDocuments: values })
		redirect(303, resolveReturnTo(formData.get('returnTo'), '/evidence-before-cutoff'))
	}
}

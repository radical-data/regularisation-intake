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
	if (state.answers.asylumBeforeCutoff !== 'yes') {
		redirect(303, '/non-asylum-route')
	}
	return {
		value: state.answers.asylumCaseDocuments ?? '',
		returnTo: getSafeReturnTo(url, '/identity-documents')
	}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const asylumCaseDocuments = String(formData.get('asylumCaseDocuments') ?? '')
		if (!isValid(asylumCaseDocuments)) {
			return fail(400, {
				error: 'Choose whether you have documents about your asylum or protection case.',
				value: asylumCaseDocuments
			})
		}

		updateJourneyAnswers(cookies, { asylumCaseDocuments })
		redirect(303, resolveReturnTo(formData.get('returnTo'), '/identity-documents'))
	}
}

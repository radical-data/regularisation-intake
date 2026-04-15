import { fail, redirect } from '@sveltejs/kit'
import type { MonthValue, ResidenceStartYearBucket } from '$lib/journey/types'
import { MONTH_VALUES, RESIDENCE_START_YEAR_BUCKETS } from '$lib/journey/types'
import {
	getJourneyState,
	getSafeReturnTo,
	resolveReturnTo,
	updateJourneyAnswers
} from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const isValidMonth = (value: string): value is MonthValue =>
	MONTH_VALUES.includes(value as MonthValue)

const isValidYearBucket = (value: string): value is ResidenceStartYearBucket =>
	RESIDENCE_START_YEAR_BUCKETS.includes(value as ResidenceStartYearBucket)

const yearBucketRequiresMonth = (value: ResidenceStartYearBucket) => value === '2025'

export const load: PageServerLoad = ({ cookies, url }) => {
	const state = getJourneyState(cookies)

	return {
		values: {
			yearBucket: state.answers.residenceStart?.yearBucket ?? '',
			month: state.answers.residenceStart?.month ?? '',
			monthUnknown: state.answers.residenceStart?.monthUnknown ?? false
		},
		returnTo: getSafeReturnTo(url, '/asylum-history')
	}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const yearBucket = String(formData.get('yearBucket') ?? '').trim()
		const month = String(formData.get('month') ?? '').trim()
		const monthUnknown = formData.get('monthUnknown') === 'on'

		if (!isValidYearBucket(yearBucket)) {
			return fail(400, {
				error: 'Choose when you started living in Spain.',
				values: { yearBucket, month, monthUnknown }
			})
		}

		if (
			yearBucketRequiresMonth(yearBucket as ResidenceStartYearBucket) &&
			!monthUnknown &&
			!isValidMonth(month)
		) {
			return fail(400, {
				error: 'Choose the month, or say that you are not sure about the month.',
				values: { yearBucket, month, monthUnknown }
			})
		}

		updateJourneyAnswers(cookies, {
			residenceStart: isValidYearBucket(yearBucket)
				? {
						yearBucket,
						...(yearBucket === '2025' && isValidMonth(month) ? { month } : {}),
						...(yearBucket === '2025' ? { monthUnknown } : {})
					}
				: undefined
		})

		redirect(303, resolveReturnTo(formData.get('returnTo'), '/asylum-history'))
	}
}

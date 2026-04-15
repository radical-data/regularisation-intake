import { describe, expect, it } from 'vitest'

import { runTriage } from './engine'

describe('runTriage', () => {
	it('routes out when the person is not in Spain now', () => {
		const result = runTriage({
			inSpainNow: 'no',
			residenceStart: {
				yearBucket: '2024_or_earlier'
			}
		})

		expect(result.resultState).toBe('another_route_may_fit_better')
		expect(result.flags).toContain('not_in_spain_now')
	})

	it('routes out when the residence start is after the cutoff', () => {
		const result = runTriage({
			inSpainNow: 'yes',
			residenceStart: {
				yearBucket: '2026'
			}
		})

		expect(result.resultState).toBe('another_route_may_fit_better')
	})

	it('returns not enough information when the core timeline is uncertain', () => {
		const result = runTriage({
			inSpainNow: 'not_sure',
			residenceStart: { yearBucket: 'not_sure' },
			asylumBeforeCutoff: 'not_sure',
			fiveMonthStay: 'not_sure'
		})

		expect(result.resultState).toBe('not_enough_information_yet')
		expect(result.flags).toContain('uncertain_timeline')
	})

	it('returns specialist review for criminal record concern', () => {
		const result = runTriage({
			inSpainNow: 'yes',
			residenceStart: {
				yearBucket: '2024_or_earlier'
			},
			asylumBeforeCutoff: 'no',
			fiveMonthStay: 'yes',
			specialistFlags: ['criminal_record_worry']
		})

		expect(result.resultState).toBe('needs_specialist_review')
	})

	it('returns evidence weak when timing fits but papers are thin', () => {
		const result = runTriage({
			inSpainNow: 'yes',
			residenceStart: { yearBucket: '2024_or_earlier' },
			asylumBeforeCutoff: 'no',
			fiveMonthStay: 'yes',
			identityDocuments: ['current_passport'],
			evidenceBeforeCutoff: ['organisation_or_church_letter'],
			evidenceRecentMonths: ['travel_or_dated_receipts']
		})

		expect(result.resultState).toBe('possible_but_needs_more_evidence')
	})

	it('returns likely in scope for a 2025 answer with a valid month', () => {
		const result = runTriage({
			inSpainNow: 'yes',
			residenceStart: {
				yearBucket: '2025',
				month: 'november'
			},
			asylumBeforeCutoff: 'no',
			fiveMonthStay: 'yes',
			identityDocuments: ['current_passport'],
			evidenceBeforeCutoff: ['padron_or_registration', 'work_papers'],
			evidenceRecentMonths: ['housing_papers', 'bank_or_money_transfer']
		})

		expect(result.resultState).toBe('likely_in_scope')
	})
})

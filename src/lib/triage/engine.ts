import type {
	EvidenceBeforeCutoffValue,
	EvidenceRecentValue,
	JourneyAnswers,
	MonthValue
} from '$lib/journey/types'

import type { TriageResult } from './types'

const MONTH_NUMBERS: Record<MonthValue, number> = {
	january: 1,
	february: 2,
	march: 3,
	april: 4,
	may: 5,
	june: 6,
	july: 7,
	august: 8,
	september: 9,
	october: 10,
	november: 11,
	december: 12
}

const parseResidenceStart = (answers: JourneyAnswers) => {
	if (!answers.residenceStart) {
		return null
	}

	const { yearBucket, month, monthUnknown } = answers.residenceStart

	switch (yearBucket) {
		case '2024_or_earlier':
			return { yearBucket, month: undefined, monthUnknown: false }
		case '2026':
			return { yearBucket, month: undefined, monthUnknown: false }
		case 'not_sure':
			return { yearBucket, month: undefined, monthUnknown: true }
		case '2025':
			return {
				yearBucket,
				month: month ? MONTH_NUMBERS[month] : undefined,
				monthUnknown: monthUnknown ?? false
			}
		default:
			return null
	}
}

const hasAnyStrongBeforeCutoffEvidence = (values: EvidenceBeforeCutoffValue[] = []) =>
	values.some((value) =>
		[
			'padron_or_registration',
			'housing_papers',
			'health_or_pharmacy',
			'school_or_childcare',
			'work_papers'
		].includes(value)
	)

const hasAnyStrongRecentEvidence = (values: EvidenceRecentValue[] = []) =>
	values.some((value) =>
		[
			'housing_papers',
			'health_or_pharmacy',
			'school_or_childcare',
			'work_papers',
			'bank_or_money_transfer'
		].includes(value)
	)

export const runTriage = (answers: JourneyAnswers): TriageResult => {
	const flags = new Set<string>()
	const residenceStart = parseResidenceStart(answers)
	const inSpainNow = answers.inSpainNow
	const asylumBeforeCutoff = answers.asylumBeforeCutoff
	const fiveMonthStay = answers.fiveMonthStay
	const asylumCaseDocuments = answers.asylumCaseDocuments
	const identityDocuments = answers.identityDocuments ?? []
	const evidenceBeforeCutoff = answers.evidenceBeforeCutoff ?? []
	const evidenceRecentMonths = answers.evidenceRecentMonths ?? []
	const specialistFlags = answers.specialistFlags ?? []

	const hasStrongEvidence =
		hasAnyStrongBeforeCutoffEvidence(evidenceBeforeCutoff) &&
		hasAnyStrongRecentEvidence(evidenceRecentMonths)

	const evidenceStrength =
		evidenceBeforeCutoff.length === 0 || evidenceRecentMonths.length === 0
			? 'unknown'
			: hasStrongEvidence
				? 'strong'
				: 'thin'

	if (inSpainNow === 'no') {
		return {
			resultState: 'another_route_may_fit_better',
			flags: ['not_in_spain_now'],
			reason: 'You said you are not in Spain now.',
			evidenceStrength,
			showHowToApply: false,
			showSupportCta: true,
			showDocumentCta: false,
			explanation: 'Based on your answers, this probably is not the right route for you right now.',
			nextSteps: [
				'Get advice on whether another immigration route fits your situation better.',
				'If your situation changes, you can check this route again later.'
			],
			humanReviewRecommended: false
		}
	}

	if (
		inSpainNow === 'not_sure' ||
		!residenceStart ||
		residenceStart.yearBucket === 'not_sure' ||
		(residenceStart.yearBucket === '2025' && residenceStart.monthUnknown) ||
		asylumBeforeCutoff === 'not_sure' ||
		fiveMonthStay === 'not_sure'
	) {
		flags.add('uncertain_timeline')
	}

	if (fiveMonthStay === 'no') {
		flags.add('five_month_requirement_risk')
	}

	if (residenceStart?.yearBucket === '2026') {
		return {
			resultState: 'another_route_may_fit_better',
			flags: ['hard_gate_after_cutoff'],
			reason: 'You said you started living in Spain in 2026.',
			evidenceStrength,
			showHowToApply: false,
			showSupportCta: true,
			showDocumentCta: false,
			explanation: 'Based on your answers, this route probably is not the best fit.',
			nextSteps: [
				'Get advice on whether another route fits better for your situation.',
				'Keep any documents that show your residence history in Spain.'
			],
			humanReviewRecommended: false
		}
	}

	if (
		specialistFlags.includes('criminal_record_worry') ||
		specialistFlags.includes('identity_missing_or_mismatch') ||
		specialistFlags.includes('asylum_case_not_clear') ||
		specialistFlags.includes('want_specialist') ||
		identityDocuments.includes('no_identity_documents_now') ||
		fiveMonthStay === 'no' ||
		(asylumBeforeCutoff === 'yes' && asylumCaseDocuments !== 'yes')
	) {
		return {
			resultState: 'needs_specialist_review',
			flags: [
				...flags,
				...(specialistFlags.includes('criminal_record_worry') ? ['criminal_record_concern'] : []),
				...(specialistFlags.includes('identity_missing_or_mismatch') ? ['identity_issue'] : []),
				...(specialistFlags.includes('asylum_case_not_clear') ? ['asylum_complexity'] : []),
				...(identityDocuments.includes('no_identity_documents_now')
					? ['missing_identity_documents']
					: []),
				...(fiveMonthStay === 'no' ? ['continuity_concern'] : [])
			],
			reason: 'One or more answers suggest that a specialist should review the next step.',
			evidenceStrength,
			showHowToApply: false,
			showSupportCta: true,
			showDocumentCta: false,
			explanation:
				'Your answers suggest that a specialist should review your situation before the next step.',
			nextSteps: [
				'Speak to a specialist support organisation before you apply.',
				'Keep your identity papers and any dated evidence together for that review.'
			],
			humanReviewRecommended: true
		}
	}

	if (flags.has('uncertain_timeline')) {
		return {
			resultState: 'not_enough_information_yet',
			flags: [...flags],
			reason: 'Some of the key timeline answers are still uncertain.',
			evidenceStrength,
			showHowToApply: false,
			showSupportCta: true,
			showDocumentCta: false,
			explanation: 'There is not enough information yet to suggest the best next step.',
			nextSteps: [
				'Try to confirm roughly when you started living in Spain and whether you have been living here during the last 5 months.',
				'If you are unsure, use assisted completion or ask a support organisation to help you.'
			],
			humanReviewRecommended: false
		}
	}

	if (
		evidenceStrength === 'thin' ||
		evidenceBeforeCutoff.includes('none_yet') ||
		evidenceRecentMonths.includes('none_yet')
	) {
		return {
			resultState: 'possible_but_needs_more_evidence',
			flags: [],
			reason: 'Your route and timing may fit, but the evidence looks thin so far.',
			evidenceStrength,
			showHowToApply: true,
			showSupportCta: true,
			showDocumentCta: true,
			explanation:
				'Based on your answers, this route may fit your situation, but you may need more papers before you apply.',
			nextSteps: [
				'Try to gather dated papers that show you were living in Spain before January 2026.',
				'Also gather recent papers from the last 5 months if you can.'
			],
			humanReviewRecommended: false
		}
	}

	return {
		resultState: 'likely_in_scope',
		flags: [],
		reason: 'Your answers broadly fit the route, timing and evidence pattern for this checker.',
		evidenceStrength,
		showHowToApply: true,
		showSupportCta: true,
		showDocumentCta: false,
		explanation: 'Your answers suggest you may be able to use this regularisation process.',
		nextSteps: [
			'Keep your identity papers and dated residence evidence together.',
			'Use the official application channel before 30 June 2026.'
		],
		humanReviewRecommended: false
	}
}

import { redirect } from '@sveltejs/kit'
import {
	formatCompletionModeAnswer,
	formatEvidenceBeforeCutoffAnswer,
	formatEvidenceRecentAnswer,
	formatFiveMonthStayAnswer,
	formatIdentityDocumentsAnswer,
	formatLanguageAnswer,
	formatNonAsylumGroundsAnswer,
	formatProvinceAnswer,
	formatResidenceStartAnswer,
	formatSpecialistFlagsAnswer,
	formatYesNoNotSureAnswer,
	getJourneyState
} from '$lib/server/journey'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies }) => {
	const state = getJourneyState(cookies)

	if (!state.answers.province) {
		redirect(303, '/province')
	}

	const answers = [
		{
			label: 'Language',
			value: formatLanguageAnswer(state.answers.language),
			changeHref: '/language?returnTo=/check-answers'
		},
		{
			label: 'Who you are filling this in for',
			value: formatCompletionModeAnswer(state.answers.completionMode),
			changeHref: '/completion-mode?returnTo=/check-answers'
		},
		{
			label: 'Are you in Spain now?',
			value: formatYesNoNotSureAnswer(state.answers.inSpainNow),
			changeHref: '/in-spain-now?returnTo=/check-answers'
		},
		{
			label: 'When you started living in Spain',
			value: formatResidenceStartAnswer(state.answers.residenceStart),
			changeHref: '/residence-start?returnTo=/check-answers'
		},
		{
			label: 'Asylum or international protection before 1 January 2026',
			value: formatYesNoNotSureAnswer(state.answers.asylumBeforeCutoff),
			changeHref: '/asylum-history?returnTo=/check-answers'
		},
		{
			label: 'Have you been in Spain during the last 5 months?',
			value: formatFiveMonthStayAnswer(state.answers.fiveMonthStay),
			changeHref: '/five-month-stay?returnTo=/check-answers'
		},
		...(state.answers.asylumBeforeCutoff === 'yes'
			? [
					{
						label: 'Documents about your asylum or protection case',
						value: formatYesNoNotSureAnswer(state.answers.asylumCaseDocuments),
						changeHref: '/asylum-documents?returnTo=/check-answers'
					}
				]
			: [
					{
						label: 'Which of these sounds like you?',
						value: formatNonAsylumGroundsAnswer(state.answers.nonAsylumGrounds),
						changeHref: '/non-asylum-route?returnTo=/check-answers'
					}
				]),
		{
			label: 'Identity papers',
			value: formatIdentityDocumentsAnswer(state.answers.identityDocuments),
			changeHref: '/identity-documents?returnTo=/check-answers'
		},
		{
			label: 'Papers that may show residence before January 2026',
			value: formatEvidenceBeforeCutoffAnswer(state.answers.evidenceBeforeCutoff),
			changeHref: '/evidence-before-cutoff?returnTo=/check-answers'
		},
		{
			label: 'Papers from the last 5 months',
			value: formatEvidenceRecentAnswer(state.answers.evidenceRecentMonths),
			changeHref: '/evidence-recent-months?returnTo=/check-answers'
		},
		{
			label: 'Anything that may need specialist advice',
			value: formatSpecialistFlagsAnswer(state.answers.specialistFlags),
			changeHref: '/specialist-flags?returnTo=/check-answers'
		},
		{
			label: 'Province',
			value: formatProvinceAnswer(state.answers.province),
			changeHref: '/province?returnTo=/check-answers'
		}
	]

	return {
		answers
	}
}

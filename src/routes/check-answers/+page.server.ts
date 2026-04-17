import { getTranslator, renderReference, resolveLocale } from '$lib/content'
import { journeySteps } from '$lib/journey/config'
import { fieldAdapters } from '$lib/journey/field-adapters'
import { getJourneyState } from '$lib/server/journey'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies }) => {
	const state = getJourneyState(cookies)

	const locale = resolveLocale(state.answers.language)
	const tt = getTranslator(locale)

	const answers = journeySteps
		.filter(
			(step) => step.includeInCheckAnswers !== false && (!step.guard || step.guard(state.answers))
		)
		.map((step) => ({
			label: step.checkAnswersLabelKey ? tt(step.checkAnswersLabelKey) : '',
			value: fieldAdapters[step.adapter]
				.format(state.answers, step)
				.map((reference) => renderReference(reference, locale))
				.join(', '),
			changeHref: `/${step.slug}?returnTo=/check-answers`
		}))

	const previousStep = journeySteps
		.filter(
			(step) => step.includeInCheckAnswers !== false && (!step.guard || step.guard(state.answers))
		)
		.at(-1)

	return {
		answers,
		locale,
		backHref: previousStep ? `/${previousStep.slug}` : '/start'
	}
}

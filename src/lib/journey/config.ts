import type { JourneyAnswers } from '$lib/journey/types'

export interface JourneyOption {
	value: string
	label: string
}

export type FieldAdapterName = 'single-choice' | 'multi-choice' | 'select' | 'residence-start'

export type StepResolver = string | ((answers: JourneyAnswers) => string)

export interface BaseStepDefinition {
	id: string
	slug: string
	field: keyof JourneyAnswers
	adapter: FieldAdapterName
	eyebrow?: string
	title: string
	body?: string
	hint?: string
	checkAnswersLabel: string
	back: StepResolver
	next: StepResolver
	guard?: (answers: JourneyAnswers) => boolean
	redirectIfGuardFails?: StepResolver
}

export interface ChoiceStepDefinition extends BaseStepDefinition {
	adapter: 'single-choice' | 'multi-choice' | 'select'
	options: JourneyOption[]
}

export interface ResidenceStartStepDefinition extends BaseStepDefinition {
	adapter: 'residence-start'
}

export type JourneyStepDefinition = ChoiceStepDefinition | ResidenceStartStepDefinition

const steps: JourneyStepDefinition[] = [
	{
		id: 'language',
		slug: 'language',
		field: 'language',
		adapter: 'single-choice',
		eyebrow: 'Session setup',
		title: 'Choose a language',
		body: 'Which language would you like to use?',
		hint: 'You can change language at any time without losing your answers.',
		checkAnswersLabel: 'Language',
		back: '/start',
		next: 'completion-mode',
		options: [
			{ value: 'es', label: 'Español' },
			{ value: 'en', label: 'English' },
			{ value: 'ar', label: 'العربية' },
			{ value: 'fr', label: 'Français' }
		]
	},
	{
		id: 'completion-mode',
		slug: 'completion-mode',
		field: 'completionMode',
		adapter: 'single-choice',
		eyebrow: 'Session setup',
		title: 'Who are you filling this in for?',
		body: 'Who are you filling this in for?',
		hint: 'Choose the option that best matches this session.',
		checkAnswersLabel: 'Who you are filling this in for',
		back: 'language',
		next: 'in-spain-now',
		options: [
			{ value: 'self', label: 'Myself' },
			{ value: 'someone_else', label: 'Someone else, with their permission' },
			{ value: 'support_worker', label: "I'm a support worker or volunteer" }
		]
	},
	{
		id: 'in-spain-now',
		slug: 'in-spain-now',
		field: 'inSpainNow',
		adapter: 'single-choice',
		eyebrow: 'Early eligibility filter',
		title: 'Are you in Spain now?',
		body: 'Are you in Spain now?',
		checkAnswersLabel: 'Are you in Spain now?',
		back: 'completion-mode',
		next: 'residence-start',
		options: [
			{ value: 'yes', label: 'Yes' },
			{ value: 'no', label: 'No' },
			{ value: 'not_sure', label: "I'm not sure" }
		]
	},
	{
		id: 'residence-start',
		slug: 'residence-start',
		field: 'residenceStart',
		adapter: 'residence-start',
		eyebrow: 'Core eligibility',
		title: 'When did you start living in Spain?',
		hint: 'An approximate month is enough.',
		checkAnswersLabel: 'When you started living in Spain',
		back: 'in-spain-now',
		next: 'asylum-history'
	},
	{
		id: 'asylum-history',
		slug: 'asylum-history',
		field: 'asylumBeforeCutoff',
		adapter: 'single-choice',
		eyebrow: 'Route split',
		title: 'Did you apply for asylum or international protection in Spain before 1 January 2026?',
		body: 'Did you apply for asylum or international protection in Spain before 1 January 2026?',
		hint: 'Choose one option.',
		checkAnswersLabel: 'Asylum or international protection before 1 January 2026',
		back: 'residence-start',
		next: 'five-month-stay',
		options: [
			{ value: 'yes', label: 'Yes' },
			{ value: 'no', label: 'No' },
			{ value: 'not_sure', label: "I'm not sure" }
		]
	},
	{
		id: 'five-month-stay',
		slug: 'five-month-stay',
		field: 'fiveMonthStay',
		adapter: 'single-choice',
		eyebrow: 'Core eligibility',
		title: 'Have you been living in Spain during the last 5 months?',
		body: 'Have you been in Spain during the last 5 months?',
		hint: 'Short trips away do not always matter.',
		checkAnswersLabel: 'Have you been in Spain during the last 5 months?',
		back: 'asylum-history',
		next: (answers) =>
			answers.asylumBeforeCutoff === 'yes' ? 'asylum-documents' : 'non-asylum-route',
		options: [
			{ value: 'yes', label: 'Yes' },
			{ value: 'mostly_yes', label: 'Mostly yes, with short absences' },
			{ value: 'no', label: 'No' },
			{ value: 'not_sure', label: "I'm not sure" }
		]
	},
	{
		id: 'asylum-documents',
		slug: 'asylum-documents',
		field: 'asylumCaseDocuments',
		adapter: 'single-choice',
		eyebrow: 'Route-specific: asylum',
		title: 'Do you have any documents about your asylum or protection case?',
		body: 'Do you have any documents about your asylum or protection case?',
		hint: 'For example, a filing receipt, case document, letter or notification.',
		checkAnswersLabel: 'Documents about your asylum or protection case',
		back: 'five-month-stay',
		next: 'identity-documents',
		guard: (answers) => answers.asylumBeforeCutoff === 'yes',
		redirectIfGuardFails: 'non-asylum-route',
		options: [
			{ value: 'yes', label: 'Yes' },
			{ value: 'no', label: 'No' },
			{ value: 'not_sure', label: "I'm not sure" }
		]
	},
	{
		id: 'non-asylum-route',
		slug: 'non-asylum-route',
		field: 'nonAsylumGrounds',
		adapter: 'multi-choice',
		eyebrow: 'Route-specific: non-asylum',
		title: 'Which of these sounds like you?',
		body: 'Which of these sounds like you?',
		hint: 'Choose all that apply.',
		checkAnswersLabel: 'Which of these sounds like you?',
		back: 'five-month-stay',
		next: 'identity-documents',
		guard: (answers) => answers.asylumBeforeCutoff !== 'yes',
		redirectIfGuardFails: 'asylum-documents',
		options: [
			{ value: 'worked_in_spain', label: "I've worked in Spain" },
			{
				value: 'close_family_relevant',
				label: 'I have close family here who may be relevant to this process'
			},
			{
				value: 'vulnerable_situation',
				label: 'I may need support because of a difficult or vulnerable situation'
			},
			{ value: 'none', label: 'None of these' },
			{ value: 'not_sure', label: "I'm not sure" }
		]
	},
	{
		id: 'identity-documents',
		slug: 'identity-documents',
		field: 'identityDocuments',
		adapter: 'multi-choice',
		eyebrow: 'Identity readiness',
		title: 'Which identity papers do you have?',
		body: 'Which identity papers do you have?',
		hint: 'Choose all that apply.',
		checkAnswersLabel: 'Identity papers',
		back: (answers) =>
			answers.asylumBeforeCutoff === 'yes' ? 'asylum-documents' : 'non-asylum-route',
		next: 'evidence-before-cutoff',
		options: [
			{ value: 'current_passport', label: 'Current passport' },
			{ value: 'expired_passport', label: 'Expired passport' },
			{ value: 'national_identity_card', label: 'National identity card' },
			{ value: 'travel_document', label: 'Travel document' },
			{
				value: 'no_identity_documents_now',
				label: 'I do not have any identity documents with me now'
			},
			{ value: 'not_sure', label: "I'm not sure" }
		]
	},
	{
		id: 'evidence-before-cutoff',
		slug: 'evidence-before-cutoff',
		field: 'evidenceBeforeCutoff',
		adapter: 'multi-choice',
		eyebrow: 'Evidence: cut-off date',
		title:
			'Do you have any documents that could help show you were already living in Spain before January 2026?',
		body: 'Do you have any documents that could help show you were already living in Spain before January 2026?',
		hint: 'Choose all that apply.',
		checkAnswersLabel: 'Papers that may show residence before January 2026',
		back: 'identity-documents',
		next: 'evidence-recent-months',
		options: [
			{ value: 'padron_or_registration', label: 'Registration or padrón' },
			{ value: 'housing_papers', label: 'Housing papers' },
			{ value: 'health_or_pharmacy', label: 'Health or pharmacy papers' },
			{ value: 'school_or_childcare', label: 'School or childcare papers' },
			{ value: 'work_papers', label: 'Work papers' },
			{
				value: 'organisation_or_church_letter',
				label: 'Letters from an organisation, church, or social worker'
			},
			{ value: 'travel_or_transport', label: 'Travel or transport papers' },
			{
				value: 'something_else_dated_named',
				label: 'Something else with a date and my name on it'
			},
			{ value: 'none_yet', label: 'I do not have any of these yet' },
			{ value: 'not_sure', label: "I'm not sure" }
		]
	},
	{
		id: 'evidence-recent-months',
		slug: 'evidence-recent-months',
		field: 'evidenceRecentMonths',
		adapter: 'multi-choice',
		eyebrow: 'Evidence: recent months',
		title:
			'Do you have any documents from the last 5 months that could help show you’ve been living here recently?',
		body: 'Do you have any documents from the last 5 months that could help show you’ve been living here recently?',
		hint: 'Choose all that apply.',
		checkAnswersLabel: 'Papers from the last 5 months',
		back: 'evidence-before-cutoff',
		next: 'specialist-flags',
		options: [
			{ value: 'housing_papers', label: 'Housing papers' },
			{ value: 'health_or_pharmacy', label: 'Health or pharmacy papers' },
			{ value: 'school_or_childcare', label: 'School or childcare papers' },
			{ value: 'work_papers', label: 'Work papers' },
			{
				value: 'organisation_or_church_letter',
				label: 'Letters from an organisation, church, or social worker'
			},
			{ value: 'bank_or_money_transfer', label: 'Bank or money transfer records' },
			{ value: 'travel_or_dated_receipts', label: 'Travel or dated receipts' },
			{
				value: 'something_else_dated_named',
				label: 'Something else with a date and my name on it'
			},
			{ value: 'none_yet', label: 'I do not have any of these yet' },
			{ value: 'not_sure', label: "I'm not sure" }
		]
	},
	{
		id: 'specialist-flags',
		slug: 'specialist-flags',
		field: 'specialistFlags',
		adapter: 'multi-choice',
		eyebrow: 'Specialist flag',
		title: 'Is there anything that might mean you need specialist advice before applying?',
		body: 'Is there anything that might mean you need specialist advice before applying?',
		checkAnswersLabel: 'Anything that may need specialist advice',
		back: 'evidence-recent-months',
		next: 'province',
		options: [
			{
				value: 'criminal_record_worry',
				label: "I'm worried about a criminal record or criminal case"
			},
			{
				value: 'identity_missing_or_mismatch',
				label: 'My identity papers are missing or do not match'
			},
			{ value: 'asylum_case_not_clear', label: "I'm not sure what happened with my asylum case" },
			{ value: 'want_specialist', label: "I'd rather talk this through with a specialist" },
			{ value: 'none', label: 'None of these' }
		]
	},
	{
		id: 'province',
		slug: 'province',
		field: 'province',
		adapter: 'select',
		eyebrow: 'Routing',
		title: 'Which province are you in?',
		body: 'Which province are you in?',
		hint: 'This helps us show support options near you.',
		checkAnswersLabel: 'Province',
		back: 'specialist-flags',
		next: '/check-answers',
		options: [
			{ value: 'madrid', label: 'Madrid' },
			{ value: 'barcelona', label: 'Barcelona' },
			{ value: 'valencia', label: 'Valencia' },
			{ value: 'sevilla', label: 'Sevilla' },
			{ value: 'malaga', label: 'Málaga' },
			{ value: 'alicante', label: 'Alicante' },
			{ value: 'bizkaia', label: 'Bizkaia' },
			{ value: 'zaragoza', label: 'Zaragoza' },
			{ value: 'murcia', label: 'Murcia' },
			{ value: 'other', label: 'Another province' }
		]
	}
]

export const journeySteps = steps

export const getJourneyStep = (slug: string) => steps.find((step) => step.slug === slug)

export const resolveStepTarget = (target: StepResolver, answers: JourneyAnswers) => {
	const resolved = typeof target === 'function' ? target(answers) : target
	return resolved.startsWith('/') ? resolved : `/${resolved}`
}

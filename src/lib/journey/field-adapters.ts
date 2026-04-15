import type { JourneyAnswers, MonthValue, ResidenceStartYearBucket } from '$lib/journey/types'
import { MONTH_LABELS, MONTH_VALUES, RESIDENCE_START_YEAR_BUCKETS } from '$lib/journey/types'
import type { JourneyStepDefinition } from './config'

interface ParseSuccess {
	ok: true
	answersPatch: Partial<JourneyAnswers>
	formValue: unknown
}

interface ParseFailure {
	ok: false
	error: string
	formValue: unknown
}

type ParseResult = ParseSuccess | ParseFailure

export interface FieldAdapter {
	getFormValue: (answers: JourneyAnswers, step: JourneyStepDefinition) => unknown
	parse: (formData: FormData, step: JourneyStepDefinition) => ParseResult
	format: (answers: JourneyAnswers, step: JourneyStepDefinition) => string
}

const notAnswered = 'Not answered'

const isValidMonth = (value: string): value is MonthValue =>
	MONTH_VALUES.includes(value as MonthValue)

const isValidYearBucket = (value: string): value is ResidenceStartYearBucket =>
	RESIDENCE_START_YEAR_BUCKETS.includes(value as ResidenceStartYearBucket)

const singleChoiceAdapter: FieldAdapter = {
	getFormValue: (answers, step) => String(answers[step.field] ?? ''),
	parse: (formData, step) => {
		const value = String(formData.get(step.field) ?? '')
		const valid = 'options' in step && step.options.some((option) => option.value === value)

		if (!valid) {
			return {
				ok: false,
				error: `Choose an answer for ${step.title.toLowerCase()}.`,
				formValue: value
			}
		}

		return {
			ok: true,
			answersPatch: { [step.field]: value } as Partial<JourneyAnswers>,
			formValue: value
		}
	},
	format: (answers, step) => {
		const value = answers[step.field]
		if (!value || !('options' in step)) return notAnswered
		return step.options.find((option) => option.value === value)?.label ?? notAnswered
	}
}

const multiChoiceAdapter: FieldAdapter = {
	getFormValue: (answers, step) => {
		const value = answers[step.field]
		return Array.isArray(value) ? value : []
	},
	parse: (formData, step) => {
		const selected = formData.getAll(step.field).map(String)
		const validValues =
			'options' in step ? new Set(step.options.map((option) => option.value)) : new Set()
		const values = selected.filter((value) => validValues.has(value))

		if (values.length === 0) {
			return {
				ok: false,
				error: `Choose at least one option for ${step.title.toLowerCase()}.`,
				formValue: selected
			}
		}

		return {
			ok: true,
			answersPatch: { [step.field]: values } as Partial<JourneyAnswers>,
			formValue: values
		}
	},
	format: (answers, step) => {
		const values = answers[step.field]
		if (!Array.isArray(values) || !('options' in step) || values.length === 0) return notAnswered
		const labels = values
			.map((value) => step.options.find((option) => option.value === value)?.label)
			.filter((value): value is string => Boolean(value))
		return labels.length > 0 ? labels.join(', ') : notAnswered
	}
}

const selectAdapter: FieldAdapter = {
	getFormValue: singleChoiceAdapter.getFormValue,
	parse: (formData, step) => {
		const value = String(formData.get(step.field) ?? '')
		const valid = 'options' in step && step.options.some((option) => option.value === value)

		if (!valid) {
			return {
				ok: false,
				error: `Choose an answer for ${step.title.toLowerCase()}.`,
				formValue: value
			}
		}

		return {
			ok: true,
			answersPatch: { [step.field]: value } as Partial<JourneyAnswers>,
			formValue: value
		}
	},
	format: singleChoiceAdapter.format
}

const residenceStartAdapter: FieldAdapter = {
	getFormValue: (answers) => ({
		yearBucket: answers.residenceStart?.yearBucket ?? '',
		month: answers.residenceStart?.month ?? '',
		monthUnknown: answers.residenceStart?.monthUnknown ?? false
	}),
	parse: (formData, step) => {
		const yearBucket = String(formData.get('yearBucket') ?? '').trim()
		const month = String(formData.get('month') ?? '').trim()
		const monthUnknown = formData.get('monthUnknown') === 'on'
		const formValue = { yearBucket, month, monthUnknown }

		if (!isValidYearBucket(yearBucket)) {
			return { ok: false, error: 'Choose when you started living in Spain.', formValue }
		}

		if (yearBucket === '2025' && !monthUnknown && !isValidMonth(month)) {
			return {
				ok: false,
				error: 'Choose the month, or say that you are not sure about the month.',
				formValue
			}
		}

		return {
			ok: true,
			answersPatch: {
				[step.field]: {
					yearBucket,
					...(yearBucket === '2025' && isValidMonth(month) ? { month } : {}),
					...(yearBucket === '2025' ? { monthUnknown } : {})
				}
			} as Partial<JourneyAnswers>,
			formValue
		}
	},
	format: (answers) => {
		const value = answers.residenceStart
		if (!value) return notAnswered

		switch (value.yearBucket) {
			case '2024_or_earlier':
				return '2024 or earlier'
			case '2026':
				return '2026'
			case 'not_sure':
				return "I'm not sure"
			case '2025':
				if (value.monthUnknown) {
					return '2025 — month not sure'
				}
				return value.month ? `${MONTH_LABELS[value.month]} 2025` : '2025'
			default:
				return notAnswered
		}
	}
}

export const fieldAdapters = {
	'single-choice': singleChoiceAdapter,
	'multi-choice': multiChoiceAdapter,
	select: selectAdapter,
	'residence-start': residenceStartAdapter
} satisfies Record<string, FieldAdapter>

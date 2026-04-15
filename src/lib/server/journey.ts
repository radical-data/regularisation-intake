import type { Cookies } from '@sveltejs/kit'

import type {
	CompletionModeValue,
	ContactMethodValue,
	EvidenceBeforeCutoffValue,
	EvidenceRecentValue,
	FiveMonthStayValue,
	IdentityDocumentValue,
	JourneyAnswers,
	JourneyState,
	LanguageValue,
	MonthValue,
	NonAsylumGroundValue,
	ProvinceValue,
	ReferralChoiceValue,
	ResidenceStartAnswer,
	ResidenceStartYearBucket,
	SpecialistFlagValue,
	SupportNeedValue,
	YesNoNotSureValue
} from '$lib/journey/types'

import {
	COMPLETION_MODE_VALUES,
	CONTACT_METHOD_VALUES,
	EVIDENCE_BEFORE_CUTOFF_VALUES,
	EVIDENCE_RECENT_VALUES,
	FIVE_MONTH_STAY_VALUES,
	IDENTITY_DOCUMENT_VALUES,
	LANGUAGE_VALUES,
	MONTH_LABELS,
	MONTH_VALUES,
	NON_ASYLUM_GROUND_VALUES,
	PROVINCE_VALUES,
	REFERRAL_CHOICE_VALUES,
	RESIDENCE_START_YEAR_BUCKETS,
	SPECIALIST_FLAG_VALUES,
	SUPPORT_NEED_VALUES,
	YES_NO_NOT_SURE_VALUES
} from '$lib/journey/types'

const JOURNEY_COOKIE = 'ri_journey'
const THIRTY_DAYS = 60 * 60 * 24 * 30

const safeRelativePath = (value: string | null, fallback: string) => {
	if (value === '/result') {
		return fallback
	}

	if (!value || !value.startsWith('/') || value.startsWith('//')) {
		return fallback
	}

	return value
}

const createEmptyState = (): JourneyState => ({
	sessionId: crypto.randomUUID(),
	answers: {},
	updatedAt: new Date().toISOString()
})

const isEnumValue =
	<T extends string>(values: readonly T[]) =>
	(value: unknown): value is T =>
		typeof value === 'string' && values.includes(value as T)

const isLanguageValue = isEnumValue(LANGUAGE_VALUES)
const isCompletionModeValue = isEnumValue(COMPLETION_MODE_VALUES)
const isYesNoNotSureValue = isEnumValue(YES_NO_NOT_SURE_VALUES)
const isFiveMonthStayValue = isEnumValue(FIVE_MONTH_STAY_VALUES)
const isNonAsylumGroundValue = isEnumValue(NON_ASYLUM_GROUND_VALUES)
const isIdentityDocumentValue = isEnumValue(IDENTITY_DOCUMENT_VALUES)
const isEvidenceBeforeCutoffValue = isEnumValue(EVIDENCE_BEFORE_CUTOFF_VALUES)
const isEvidenceRecentValue = isEnumValue(EVIDENCE_RECENT_VALUES)
const isSpecialistFlagValue = isEnumValue(SPECIALIST_FLAG_VALUES)
const isProvinceValue = isEnumValue(PROVINCE_VALUES)
const isReferralChoiceValue = isEnumValue(REFERRAL_CHOICE_VALUES)
const isSupportNeedValue = isEnumValue(SUPPORT_NEED_VALUES)
const isContactMethodValue = isEnumValue(CONTACT_METHOD_VALUES)

const isStringArrayOf = <T extends string>(
	value: unknown,
	itemGuard: (entry: unknown) => entry is T
): value is T[] => Array.isArray(value) && value.every(itemGuard)

const formatList = (values: string[]) => {
	if (values.length === 0) return 'Not answered'
	return values.join(', ')
}

const isResidenceStartYearBucket = (value: unknown): value is ResidenceStartYearBucket =>
	typeof value === 'string' &&
	RESIDENCE_START_YEAR_BUCKETS.includes(value as ResidenceStartYearBucket)

const isMonthValue = (value: unknown): value is MonthValue =>
	typeof value === 'string' && MONTH_VALUES.includes(value as MonthValue)

const isResidenceStartAnswer = (value: unknown): value is ResidenceStartAnswer => {
	if (!value || typeof value !== 'object') {
		return false
	}

	const candidate = value as Record<string, unknown>

	return (
		isResidenceStartYearBucket(candidate.yearBucket) &&
		(candidate.month === undefined || isMonthValue(candidate.month)) &&
		(candidate.monthUnknown === undefined || typeof candidate.monthUnknown === 'boolean')
	)
}

const isJourneyState = (value: unknown): value is JourneyState => {
	if (!value || typeof value !== 'object') {
		return false
	}

	const candidate = value as Record<string, unknown>
	const answers = (candidate.answers ?? {}) as Record<string, unknown>
	const contactValueValid =
		answers.contactValue === undefined || typeof answers.contactValue === 'string'

	return (
		typeof candidate.sessionId === 'string' &&
		typeof candidate.updatedAt === 'string' &&
		(candidate.answers === undefined || typeof candidate.answers === 'object') &&
		(answers.language === undefined || isLanguageValue(answers.language)) &&
		(answers.completionMode === undefined || isCompletionModeValue(answers.completionMode)) &&
		(answers.inSpainNow === undefined || isYesNoNotSureValue(answers.inSpainNow)) &&
		(answers.residenceStart === undefined || isResidenceStartAnswer(answers.residenceStart)) &&
		(answers.asylumBeforeCutoff === undefined || isYesNoNotSureValue(answers.asylumBeforeCutoff)) &&
		(answers.fiveMonthStay === undefined || isFiveMonthStayValue(answers.fiveMonthStay)) &&
		(answers.asylumCaseDocuments === undefined ||
			isYesNoNotSureValue(answers.asylumCaseDocuments)) &&
		(answers.nonAsylumGrounds === undefined ||
			isStringArrayOf(answers.nonAsylumGrounds, isNonAsylumGroundValue)) &&
		(answers.identityDocuments === undefined ||
			isStringArrayOf(answers.identityDocuments, isIdentityDocumentValue)) &&
		(answers.evidenceBeforeCutoff === undefined ||
			isStringArrayOf(answers.evidenceBeforeCutoff, isEvidenceBeforeCutoffValue)) &&
		(answers.evidenceRecentMonths === undefined ||
			isStringArrayOf(answers.evidenceRecentMonths, isEvidenceRecentValue)) &&
		(answers.specialistFlags === undefined ||
			isStringArrayOf(answers.specialistFlags, isSpecialistFlagValue)) &&
		(answers.province === undefined || isProvinceValue(answers.province)) &&
		(answers.referralChoice === undefined || isReferralChoiceValue(answers.referralChoice)) &&
		(answers.supportNeeds === undefined ||
			isStringArrayOf(answers.supportNeeds, isSupportNeedValue)) &&
		(answers.contactMethod === undefined || isContactMethodValue(answers.contactMethod)) &&
		contactValueValid
	)
}

export const getJourneyState = (cookies: Cookies) => {
	const raw = cookies.get(JOURNEY_COOKIE)

	if (!raw) {
		return createEmptyState()
	}

	try {
		const parsed = JSON.parse(raw)

		return isJourneyState(parsed) ? parsed : createEmptyState()
	} catch {
		return createEmptyState()
	}
}

export const setJourneyState = (cookies: Cookies, state: JourneyState) => {
	cookies.set(JOURNEY_COOKIE, JSON.stringify(state), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
		maxAge: THIRTY_DAYS
	})
}

export const updateJourneyAnswers = (cookies: Cookies, answers: Partial<JourneyAnswers>) => {
	const current = getJourneyState(cookies)

	const next: JourneyState = {
		...current,
		answers: {
			...current.answers,
			...answers
		},
		updatedAt: new Date().toISOString()
	}

	setJourneyState(cookies, next)

	return next
}

export const clearJourneyState = (cookies: Cookies) => {
	cookies.delete(JOURNEY_COOKIE, {
		path: '/'
	})
}

export const formatResidenceStartAnswer = (value?: ResidenceStartAnswer) => {
	if (!value) {
		return 'Not answered'
	}

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
			return 'Not answered'
	}
}

const labelMap =
	<T extends string>(labels: Record<T, string>) =>
	(value?: T) =>
		value ? labels[value] : 'Not answered'

export const formatLanguageAnswer = labelMap<LanguageValue>({
	es: 'Español',
	en: 'English',
	ar: 'العربية',
	fr: 'Français'
})

export const formatCompletionModeAnswer = labelMap<CompletionModeValue>({
	self: 'Myself',
	someone_else: 'Someone else, with their permission',
	support_worker: "I'm a support worker or volunteer"
})

export const formatYesNoNotSureAnswer = labelMap<YesNoNotSureValue>({
	yes: 'Yes',
	no: 'No',
	not_sure: "I'm not sure"
})

export const formatFiveMonthStayAnswer = labelMap<FiveMonthStayValue>({
	yes: 'Yes',
	mostly_yes: 'Mostly yes, with short absences',
	no: 'No',
	not_sure: "I'm not sure"
})

export const formatNonAsylumGroundsAnswer = (values?: NonAsylumGroundValue[]) =>
	formatList(
		(values ?? []).map(
			(value) =>
				({
					worked_in_spain: "I've worked in Spain",
					close_family_relevant: 'I have close family here who may be relevant to this process',
					vulnerable_situation: 'I may need support because of a difficult or vulnerable situation',
					none: 'None of these',
					not_sure: "I'm not sure"
				})[value]
		)
	)

export const formatIdentityDocumentsAnswer = (values?: IdentityDocumentValue[]) =>
	formatList(
		(values ?? []).map(
			(value) =>
				({
					current_passport: 'Current passport',
					expired_passport: 'Expired passport',
					national_identity_card: 'National identity card',
					travel_document: 'Travel document',
					no_identity_documents_now: 'I do not have any identity documents with me now',
					not_sure: "I'm not sure"
				})[value]
		)
	)

export const formatEvidenceBeforeCutoffAnswer = (values?: EvidenceBeforeCutoffValue[]) =>
	formatList(
		(values ?? []).map(
			(value) =>
				({
					padron_or_registration: 'Registration or padrón',
					housing_papers: 'Housing papers',
					health_or_pharmacy: 'Health or pharmacy papers',
					school_or_childcare: 'School or childcare papers',
					work_papers: 'Work papers',
					organisation_or_church_letter: 'Letters from an organisation, church, or social worker',
					travel_or_transport: 'Travel or transport papers',
					something_else_dated_named: 'Something else with a date and my name on it',
					none_yet: 'I do not have any of these yet',
					not_sure: "I'm not sure"
				})[value]
		)
	)

export const formatEvidenceRecentAnswer = (values?: EvidenceRecentValue[]) =>
	formatList(
		(values ?? []).map(
			(value) =>
				({
					housing_papers: 'Housing papers',
					health_or_pharmacy: 'Health or pharmacy papers',
					school_or_childcare: 'School or childcare papers',
					work_papers: 'Work papers',
					organisation_or_church_letter: 'Letters from an organisation, church, or social worker',
					bank_or_money_transfer: 'Bank or money transfer records',
					travel_or_dated_receipts: 'Travel or dated receipts',
					something_else_dated_named: 'Something else with a date and my name on it',
					none_yet: 'I do not have any of these yet',
					not_sure: "I'm not sure"
				})[value]
		)
	)

export const formatSpecialistFlagsAnswer = (values?: SpecialistFlagValue[]) =>
	formatList(
		(values ?? []).map(
			(value) =>
				({
					criminal_record_worry: "I'm worried about a criminal record or criminal case",
					identity_missing_or_mismatch: 'My identity papers are missing or do not match',
					asylum_case_not_clear: "I'm not sure what happened with my asylum case",
					want_specialist: "I'd rather talk this through with a specialist",
					none: 'None of these'
				})[value]
		)
	)

export const formatProvinceAnswer = labelMap<ProvinceValue>({
	madrid: 'Madrid',
	barcelona: 'Barcelona',
	valencia: 'Valencia',
	sevilla: 'Sevilla',
	malaga: 'Málaga',
	alicante: 'Alicante',
	bizkaia: 'Bizkaia',
	zaragoza: 'Zaragoza',
	murcia: 'Murcia',
	other: 'Another province'
})

export const formatReferralChoiceAnswer = labelMap<ReferralChoiceValue>({
	contact_me: "Yes, I'd like someone to contact me",
	show_options: 'Yes, show me support options near me',
	no_thanks: "No, I'll keep this for now"
})

export const formatSupportNeedsAnswer = (values?: SupportNeedValue[]) =>
	formatList(
		(values ?? []).map(
			(value) =>
				({
					another_language: 'Help in another language',
					in_person_help: 'In-person help',
					help_using_phone_or_computer: 'Help using a phone or computer',
					help_scanning_or_printing: 'Help scanning or printing papers',
					help_gathering_papers: 'Help understanding which papers to gather',
					specialist_advice: 'Specialist advice',
					not_sure: "I'm not sure"
				})[value]
		)
	)

export const formatContactMethodAnswer = labelMap<ContactMethodValue>({
	sms: 'SMS',
	whatsapp: 'WhatsApp',
	phone: 'Phone call',
	email: 'Email',
	through_organisation: 'Through the organisation helping me now'
})

export const getSafeReturnTo = (url: URL, fallback: string) =>
	safeRelativePath(url.searchParams.get('returnTo'), fallback)

export const resolveReturnTo = (candidate: FormDataEntryValue | null, fallback: string) =>
	safeRelativePath(typeof candidate === 'string' ? candidate : null, fallback)

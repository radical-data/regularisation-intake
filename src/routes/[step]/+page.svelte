<script lang="ts">
import ChoiceGroup from '$lib/components/questions/ChoiceGroup.svelte'
import QuestionPage from '$lib/components/questions/QuestionPage.svelte'
import { getTranslator } from '$lib/content'
import { MONTH_VALUES } from '$lib/journey/types'

let { data, form } = $props()
const locale = $derived(data.locale ?? 'es')
const tt = $derived(getTranslator(locale))

type ResidenceStartFormValue = {
	yearBucket: string
	month: string
	monthUnknown: boolean
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

const rawValue = $derived(form?.value ?? data.value)
const scalarValue = $derived(typeof rawValue === 'string' ? rawValue : '')
const multiValue = $derived(
	Array.isArray(rawValue)
		? rawValue.filter((entry): entry is string => typeof entry === 'string')
		: []
)
const residenceValue = $derived.by<ResidenceStartFormValue>(() => {
	if (!isRecord(rawValue)) {
		return { yearBucket: '', month: '', monthUnknown: false }
	}

	const candidate = rawValue

	return {
		yearBucket: typeof candidate.yearBucket === 'string' ? candidate.yearBucket : '',
		month: typeof candidate.month === 'string' ? candidate.month : '',
		monthUnknown: Boolean(candidate.monthUnknown)
	}
})
const showMonthField = $derived(
	data.step.adapter === 'residence-start' && residenceValue.yearBucket === '2025'
)

const contactValue = $derived.by(() => {
	if (!isRecord(rawValue)) {
		return { contactMethod: '', contactValue: '' }
	}

	return {
		contactMethod: typeof rawValue.contactMethod === 'string' ? rawValue.contactMethod : '',
		contactValue: typeof rawValue.contactValue === 'string' ? rawValue.contactValue : ''
	}
})
</script>

<QuestionPage
	eyebrow={data.step.eyebrow}
	title={data.step.title}
	body={data.step.body}
	{locale}
	hint={data.step.hint}
	error={form?.error}
	returnTo={data.returnTo}
	backHref={data.backHref}
>
	{#if data.step.adapter === 'single-choice'}
		<ChoiceGroup
			type="radio"
			name={data.step.field}
			legend={tt('common.choose_one_answer')}
			options={data.step.options}
			value={scalarValue}
		/>
	{:else if data.step.adapter === 'multi-choice'}
		<ChoiceGroup
			type="checkbox"
			legend={tt('common.choose_all_that_apply')}
			name={data.step.field}
			options={data.step.options}
			values={multiValue}
		/>
	{:else if data.step.adapter === 'select'}
		<label class="field">
			<span class="sr-only">{data.step.title}</span>
			<select name={data.step.field}>
				<option value="">{tt('common.choose_an_option')}</option>
				{#each data.step.options as option}
					<option value={option.value} selected={scalarValue === option.value}>
						{option.label}
					</option>
				{/each}
			</select>
		</label>
	{:else if data.step.adapter === 'residence-start'}
		<fieldset class="question-group">
			<legend>{tt('common.choose_one_answer')}</legend>
			{#each [
				{
					value: '2024_or_earlier',
					label: tt('steps.residence_start.options.2024_or_earlier')
				},
				{ value: '2025', label: tt('steps.residence_start.options.2025') },
				{ value: '2026', label: tt('steps.residence_start.options.2026') },
				{ value: 'not_sure', label: tt('steps.residence_start.options.not_sure') }
			] as option}
				<label class="option">
					<input
						type="radio"
						name="yearBucket"
						value={option.value}
						checked={residenceValue.yearBucket === option.value}
					>
					<span>{option.label}</span>
				</label>
			{/each}

			{#if showMonthField}
				<div class="card stack inline-subsection">
					<label class="field">
						<span>{tt('steps.residence_start.month_prompt')}</span>
						<select name="month" autocomplete="bday-month">
							<option value="">{tt('common.choose_month')}</option>
							{#each MONTH_VALUES as month}
								<option value={month} selected={residenceValue.month === month}>
									{tt(`months.${month}` as import('$lib/content').MessageKey)}
								</option>
							{/each}
						</select>
					</label>

					<label class="option">
						<input type="checkbox" name="monthUnknown" checked={residenceValue.monthUnknown}>
						<span>{tt('steps.residence_start.month_unknown')}</span>
					</label>
				</div>
			{/if}
		</fieldset>
	{:else if data.step.adapter === 'contact-preference'}
		<div class="stack">
			<ChoiceGroup
				type="radio"
				legend={tt('common.choose_one_answer')}
				name="contactMethod"
				options={data.step.options}
				value={contactValue.contactMethod}
			/>
			{#if contactValue.contactMethod && contactValue.contactMethod !== 'through_organisation' && contactValue.contactMethod !== 'do_not_contact_yet'}
				<label class="field">
					<span>{tt('steps.contact.detail_label')}</span>
					<input type="text" name="contactValue" value={contactValue.contactValue} dir="auto">
				</label>
			{/if}
		</div>
	{/if}
</QuestionPage>

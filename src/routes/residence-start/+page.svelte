<script lang="ts">
import { MONTH_LABELS, MONTH_VALUES } from '$lib/journey/types'

let { data, form } = $props()

const monthOptions = MONTH_VALUES.map((value) => ({
	value,
	label: MONTH_LABELS[value]
}))

const yearOptions = [
	{ value: '2024_or_earlier', label: 'In 2024 or earlier' },
	{ value: '2025', label: 'In 2025' },
	{ value: '2026', label: 'In 2026' },
	{ value: 'not_sure', label: "I'm not sure" }
]

const values = $derived({
	yearBucket: form?.values?.yearBucket ?? data.values.yearBucket,
	month: form?.values?.month ?? data.values.month,
	monthUnknown: form?.values?.monthUnknown ?? data.values.monthUnknown
})

const showMonthField = $derived(values.yearBucket === '2025')
</script>

<section class="stack">
	<p class="eyebrow">Core eligibility</p>

	<div class="card stack">
		<h1>When did you start living in Spain?</h1>
		<p class="hint">An approximate month is enough.</p>

		{#if form?.error}
			<div class="error-summary" aria-live="assertive">
				<h2>There is a problem</h2>
				<p class="error-text">{form.error}</p>
			</div>
		{/if}

		<form method="POST" class="stack">
			<input type="hidden" name="returnTo" value={data.returnTo}>

			<fieldset class="question-group" aria-describedby="residence-start-hint">
				<legend>Choose one answer</legend>

				{#each yearOptions as option}
					<label class="option">
						<input
							type="radio"
							name="yearBucket"
							value={option.value}
							checked={values.yearBucket === option.value}
						>
						<span>{option.label}</span>
					</label>
				{/each}

				{#if showMonthField}
					<div class="card stack inline-subsection">
						<label class="field">
							<span>Which month was that, roughly?</span>
							<select name="month" autocomplete="bday-month">
								<option value="">Choose month</option>
								{#each monthOptions as option}
									<option value={option.value} selected={values.month === option.value}>
										{option.label}
									</option>
								{/each}
							</select>
						</label>

						<label class="option">
							<input type="checkbox" name="monthUnknown" checked={values.monthUnknown}>
							<span>I'm not sure about the month</span>
						</label>
					</div>
				{/if}
			</fieldset>

			<p class="hint" id="residence-start-hint">
				Use the year if you can. If needed, we ask for the month to keep this lower-burden while
				still useful for triage.
			</p>

			<div class="actions">
				<button class="button" type="submit">Continue</button>
				<a class="button secondary" href="/in-spain-now">Back</a>
			</div>
		</form>
	</div>
</section>

<style>
.inline-subsection {
	padding: 1rem;
}
</style>

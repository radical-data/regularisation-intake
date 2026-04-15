<script lang="ts">
let { data, form } = $props()
const values = $derived(form?.values ?? data.values)
const checked = (value: string) => values.includes(value)
</script>

<section class="stack">
	<p class="eyebrow">Evidence: recent months</p>
	<div class="card stack">
		<h1>
			Do you have any documents from the last 5 months that could help show you’ve been living here
			recently?
		</h1>
		<p>
			Do you have any documents from the last 5 months that could help show you’ve been living here
			recently?
		</p>
		<p class="hint">Choose all that apply.</p>
		{#if form?.error}
			<div class="error-summary"><p class="error-text">{form.error}</p></div>
		{/if}
		<form method="POST" class="stack">
			<input type="hidden" name="returnTo" value={data.returnTo}>
			<fieldset class="question-group">
				<legend>Choose all that apply</legend>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceRecentMonths"
						value="housing_papers"
						checked={checked('housing_papers')}
					><span>Housing papers</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceRecentMonths"
						value="health_or_pharmacy"
						checked={checked('health_or_pharmacy')}
					><span>Health or pharmacy papers</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceRecentMonths"
						value="school_or_childcare"
						checked={checked('school_or_childcare')}
					><span>School or childcare papers</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceRecentMonths"
						value="work_papers"
						checked={checked('work_papers')}
					><span>Work papers</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceRecentMonths"
						value="organisation_or_church_letter"
						checked={checked('organisation_or_church_letter')}
					><span>Letters from an organisation, church, or social worker</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceRecentMonths"
						value="bank_or_money_transfer"
						checked={checked('bank_or_money_transfer')}
					><span>Bank or money transfer records</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceRecentMonths"
						value="travel_or_dated_receipts"
						checked={checked('travel_or_dated_receipts')}
					><span>Travel or dated receipts</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceRecentMonths"
						value="something_else_dated_named"
						checked={checked('something_else_dated_named')}
					><span>Something else with a date and my name on it</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceRecentMonths"
						value="none_yet"
						checked={checked('none_yet')}
					><span>I do not have any of these yet</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceRecentMonths"
						value="not_sure"
						checked={checked('not_sure')}
					><span>I'm not sure</span></label
				>
			</fieldset>
			<p class="hint">
				Keep this separate from the earlier evidence question. It helps with a different
				requirement.
			</p>
			<div class="actions">
				<button class="button" type="submit">Continue</button
				><a class="button secondary" href="/evidence-before-cutoff">Back</a>
			</div>
		</form>
	</div>
</section>

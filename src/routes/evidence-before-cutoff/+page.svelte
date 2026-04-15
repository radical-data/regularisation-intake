<script lang="ts">
let { data, form } = $props()
const values = $derived(form?.values ?? data.values)
const checked = (value: string) => values.includes(value)
</script>

<section class="stack">
	<p class="eyebrow">Evidence: cut-off date</p>
	<div class="card stack">
		<h1>
			Do you have any documents that could help show you were already living in Spain before January
			2026?
		</h1>
		<p>
			Do you have any documents that could help show you were already living in Spain before January
			2026?
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
						name="evidenceBeforeCutoff"
						value="padron_or_registration"
						checked={checked('padron_or_registration')}
					><span>Registration or padrón</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceBeforeCutoff"
						value="housing_papers"
						checked={checked('housing_papers')}
					><span>Housing papers</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceBeforeCutoff"
						value="health_or_pharmacy"
						checked={checked('health_or_pharmacy')}
					><span>Health or pharmacy papers</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceBeforeCutoff"
						value="school_or_childcare"
						checked={checked('school_or_childcare')}
					><span>School or childcare papers</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceBeforeCutoff"
						value="work_papers"
						checked={checked('work_papers')}
					><span>Work papers</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceBeforeCutoff"
						value="organisation_or_church_letter"
						checked={checked('organisation_or_church_letter')}
					><span>Letters from an organisation, church, or social worker</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceBeforeCutoff"
						value="travel_or_transport"
						checked={checked('travel_or_transport')}
					><span>Travel or transport papers</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceBeforeCutoff"
						value="something_else_dated_named"
						checked={checked('something_else_dated_named')}
					><span>Something else with a date and my name on it</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceBeforeCutoff"
						value="none_yet"
						checked={checked('none_yet')}
					><span>I do not have any of these yet</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="evidenceBeforeCutoff"
						value="not_sure"
						checked={checked('not_sure')}
					><span>I'm not sure</span></label
				>
			</fieldset>
			<p class="hint">
				Official guidance requires dated evidence showing residence before the cut-off.
			</p>
			<div class="actions">
				<button class="button" type="submit">Continue</button
				><a class="button secondary" href="/identity-documents">Back</a>
			</div>
		</form>
	</div>
</section>

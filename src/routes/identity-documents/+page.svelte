<script lang="ts">
let { data, form } = $props()
const values = $derived(form?.values ?? data.values)
const checked = (value: string) => values.includes(value)
</script>

<section class="stack">
	<p class="eyebrow">Identity readiness</p>
	<div class="card stack">
		<h1>Which identity papers do you have?</h1>
		<p>Which identity papers do you have?</p>
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
						name="identityDocuments"
						value="current_passport"
						checked={checked('current_passport')}
					><span>Current passport</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="identityDocuments"
						value="expired_passport"
						checked={checked('expired_passport')}
					><span>Expired passport</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="identityDocuments"
						value="national_identity_card"
						checked={checked('national_identity_card')}
					><span>National identity card</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="identityDocuments"
						value="travel_document"
						checked={checked('travel_document')}
					><span>Travel document</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="identityDocuments"
						value="no_identity_documents_now"
						checked={checked('no_identity_documents_now')}
					><span>I do not have any identity documents with me now</span></label
				>
				<label class="option"
					><input
						type="checkbox"
						name="identityDocuments"
						value="not_sure"
						checked={checked('not_sure')}
					><span>I'm not sure</span></label
				>
			</fieldset>
			<div class="actions">
				<button class="button" type="submit">Continue</button
				><a
					class="button secondary"
					href={data.returnTo.includes('check-answers') ? '/check-answers' : (values.length >= 0 ? (data.returnTo) : '/five-month-stay')}
					>Back</a
				>
			</div>
		</form>
	</div>
</section>

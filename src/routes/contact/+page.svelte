<script lang="ts">
let { data, form } = $props()
const method = $derived(form?.method ?? data.method)
const value = $derived(form?.value ?? data.value)
const showField = $derived(method && method !== 'through_organisation')
</script>

<section class="stack">
	<p class="eyebrow">Contact capture</p>
	<div class="card stack">
		<h1>How should we contact you?</h1>
		<p>How should we contact you?</p>
		<p class="hint">Choose the safest way.</p>
		{#if form?.error}
			<div class="error-summary"><p class="error-text">{form.error}</p></div>
		{/if}
		<form method="POST" class="stack">
			<fieldset class="question-group">
				<legend>Choose one answer</legend>
				<label class="option"
					><input type="radio" name="contactMethod" value="sms" checked={method === 'sms'}>
					<span>SMS</span></label
				>
				<label class="option"
					><input
						type="radio"
						name="contactMethod"
						value="whatsapp"
						checked={method === 'whatsapp'}
					><span>WhatsApp</span></label
				>
				<label class="option"
					><input type="radio" name="contactMethod" value="phone" checked={method === 'phone'}>
					<span>Phone call</span></label
				>
				<label class="option"
					><input type="radio" name="contactMethod" value="email" checked={method === 'email'}>
					<span>Email</span></label
				>
				<label class="option"
					><input
						type="radio"
						name="contactMethod"
						value="through_organisation"
						checked={method === 'through_organisation'}
					><span>Through the organisation helping me now</span></label
				>
			</fieldset>
			{#if showField}
				<label class="field">
					<span>Contact detail</span>
					<input type="text" name="contactValue" {value}>
				</label>
			{/if}
			<div class="actions">
				<button class="button" type="submit">Continue</button
				><a class="button secondary" href="/support-needs">Back</a>
			</div>
		</form>
	</div>
</section>

<script lang="ts">
let { data, form } = $props()
const value = $derived(form?.value ?? data.value)
const options = [
	'madrid',
	'barcelona',
	'valencia',
	'sevilla',
	'malaga',
	'alicante',
	'bizkaia',
	'zaragoza',
	'murcia',
	'other'
]
</script>

<section class="stack">
	<p class="eyebrow">Routing</p>
	<div class="card stack">
		<h1>Which province are you in?</h1>
		<p>Which province are you in?</p>
		<p class="hint">This helps us show support options near you.</p>
		{#if form?.error}
			<div class="error-summary"><p class="error-text">{form.error}</p></div>
		{/if}
		<form method="POST" class="stack">
			<input type="hidden" name="returnTo" value={data.returnTo}>
			<label class="field">
				<span class="sr-only">Province</span>
				<select name="province">
					<option value="">Choose a province</option>
					{#each options as option}
						<option value={option} selected={value === option}>
							{option === 'other' ? 'Another province' : option.charAt(0).toUpperCase() + option.slice(1)}
						</option>
					{/each}
				</select>
			</label>
			<div class="actions">
				<button class="button" type="submit">Continue</button
				><a class="button secondary" href="/specialist-flags">Back</a>
			</div>
		</form>
	</div>
</section>

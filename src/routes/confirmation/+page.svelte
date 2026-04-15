<script lang="ts">
let { data } = $props()
</script>

<section class="stack">
	<p class="eyebrow">Confirmation</p>
	<div class="card stack">
		<h1>Your result is ready</h1>
		<p>Keep this page. It includes your reference number and a copy of your answers.</p>
		<div class="stack">
			<p><strong>Reference number:</strong> {data.sessionId}</p>
			<p><strong>Updated:</strong> {new Date(data.submittedAt).toLocaleString()}</p>
		</div>
		<p class="hint">Save, print, or screenshot this page.</p>
		<div class="actions">
			<a class="button" href="/check-answers">View your answers</a>
			<a class="button secondary" href="/result">Back to result</a>
			<a class="button secondary" href="/start?new=1">Start again</a>
		</div>
	</div>
</section>

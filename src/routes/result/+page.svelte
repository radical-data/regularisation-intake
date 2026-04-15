<script lang="ts">
let { data } = $props()

const resultLead = {
	likely_in_scope: 'You may be able to use this route',
	possible_but_needs_more_evidence: 'This route may fit, but you may need more papers first',
	needs_specialist_review: 'You may need specialist help before applying',
	not_enough_information_yet: 'We need a bit more information before suggesting a next step',
	another_route_may_fit_better: 'This probably is not the right route for you'
} as const
</script>

<section class="stack">
	<p class="eyebrow">Result</p>

	<div class="card stack">
		<span class="result-pill">{data.result.title}</span>
		<h1>{resultLead[data.result.resultState]}</h1>
		<p>{data.result.explanation}</p>

		{#if data.result.reason}
			<div class="stack">
				<h2>Why we’re saying this</h2>
				<p>{data.result.reason}</p>
			</div>
		{/if}

		<div class="stack">
			<h2>What this means</h2>
			<ul>
				{#each data.result.nextSteps as step}
					<li>{step}</li>
				{/each}
			</ul>
		</div>

		{#if data.result.showDocumentCta}
			<div class="stack">
				<h2>What to gather next</h2>
				<ul>
					<li>Dated papers that show you were living in Spain before January 2026</li>
					<li>Recent papers from the last 5 months</li>
					<li>Identity papers you already have</li>
				</ul>
			</div>
		{/if}

		{#if data.result.showHowToApply}
			<div class="stack">
				<h2>How to apply</h2>
				<p>
					Use the official government application channel and do not leave it until the last minute.
				</p>
				<p class="hint">The official application window is open until 30 June 2026.</p>
			</div>
		{/if}

		{#if data.result.showSupportCta}
			<div class="stack">
				<h2>Get support</h2>
				<p>
					This checker is not legal advice. Support near you may depend on your province:
					{data.province}.
				</p>
			</div>
		{/if}

		{#if data.result.flags.length > 0}
			<div class="stack">
				<h2>Flags raised</h2>
				<ul>
					{#each data.result.flags as flag}
						<li>{flag}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div class="stack">
			<h2>Keep this reference</h2>
			<p>Reference number: {data.sessionId}</p>
			<p class="hint">Use print, save, email or a screenshot to keep a copy of this result.</p>
		</div>

		<div class="actions">
			<a class="button" href="/referral">Do you want help with the next step?</a>
			<a class="button secondary" href="/check-answers">Back to answers</a>
			<a class="button secondary" href="/start?new=1">Start again</a>
		</div>
	</div>
</section>

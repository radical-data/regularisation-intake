<script lang="ts">
import { Button } from '$lib/components/ui/button'
import { getTranslator } from '$lib/content'

let { data } = $props()

const tt = $derived(getTranslator(data.locale ?? 'es'))
</script>

<section class="stack">
	<p class="eyebrow">{tt('pages.start.eyebrow')}</p>
	<div class="app-card stack">
		<h1 class="page-title">{tt('pages.start.title')}</h1>
		<div class="prose-block">
			<p class="lead-text">{tt('pages.start.lead')}</p>
			<p class="supporting-text">{tt('pages.start.not_official')}</p>
			<p class="supporting-text">{tt('pages.start.window_open')}</p>
			<p class="supporting-text">{tt('pages.start.resume')}</p>
		</div>
		<div class="panel-subtle section-block">
			<h2 class="section-title">{tt('pages.start.what_to_expect_title')}</h2>
			<ul>
				<li>{tt('pages.start.expectation.duration')}</li>
				<li>{tt('pages.start.expectation.one_question')}</li>
				<li>{tt('pages.start.expectation.review')}</li>
				<li>{tt('pages.start.expectation.timeline')}</li>
			</ul>
		</div>
		<div class="actions"><Button href="/language">{tt('pages.start.start_now')}</Button></div>
	</div>
</section>

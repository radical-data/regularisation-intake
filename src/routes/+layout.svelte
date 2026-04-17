<script lang="ts">
import LanguagesIcon from '@lucide/svelte/icons/languages'
import '../app.css'
import { resolve } from '$app/paths'
import { browser } from '$app/environment'
import { invalidateAll } from '$app/navigation'
import { getTranslator } from '$lib/content'

let { children, data } = $props()

const locale = $derived(data.locale ?? 'es')
const textDirection = $derived(data.textDirection ?? 'ltr')
const tt = $derived(getTranslator(locale))
const currentPath = $derived(data.currentPath ?? '/start')

$effect(() => {
	if (!browser) return
	document.documentElement.lang = locale
	document.documentElement.dir = textDirection
})

const languages = [
	{ value: 'es', label: 'Español' },
	{ value: 'en', label: 'English' },
	{ value: 'ar', label: 'العربية' },
	{ value: 'fr', label: 'Français' }
]

const getLanguageHref = (languageValue: string) =>
	`${resolve('/language')}?set=${languageValue}&returnTo=${encodeURIComponent(currentPath)}`

const switchLanguage = async (event: MouseEvent, languageValue: string) => {
	if (!browser) return
	if (languageValue === locale) return
	event.preventDefault()
	const href = getLanguageHref(languageValue)
	try {
		const response = await fetch(href, { method: 'GET', credentials: 'same-origin' })
		if (!response.ok) throw new Error(`Language switch failed: ${response.status}`)
		await invalidateAll()
	} catch {
		window.location.href = href
	}
}
</script>

<svelte:head>
	<title>{tt('chrome.app_title')}</title>
	<meta name="description" content={tt('chrome.meta_description')}>
</svelte:head>

<div class="app-shell">
	<header class="site-header">
		<div class="site-width flex flex-wrap items-center justify-between gap-4">
			<div class="site-header-main">
				<a class="brand" href={resolve('/')}>{tt('chrome.brand')}</a>
				<nav class="service-nav" aria-label="Primary">
					<a class="service-nav-link" href="/">Home</a>
					<a class="service-nav-link" href="/start">Check your next step</a>
					<a class="service-nav-link" href="/organisations">Find organisations</a>
				</nav>
			</div>
			<nav class="language-nav" aria-label={tt('chrome.language_switcher_label')}>
				<p class="language-nav-label compact">
					<span class="inline-flex items-center gap-2">
						<LanguagesIcon class="size-3.5" aria-hidden="true" />

						{tt('chrome.language_switcher_label')}
					</span>
				</p>
				<ul class="language-list">
					{#each languages as language (language.value)}
						<li>
							<a
								class="language-link"
								href={resolve('/language')}
								aria-current={language.value === locale ? 'true' : undefined}
								onclick={(event) => switchLanguage(event, language.value)}
								>{language.label}</a
							>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	</header>
	<main class="site-width py-8 pb-16">{@render children()}</main>
</div>

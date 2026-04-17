<script lang="ts">
import LanguagesIcon from '@lucide/svelte/icons/languages'
import '../app.css'
import { browser } from '$app/environment'
import { invalidateAll } from '$app/navigation'
import { resolve } from '$app/paths'
import { page } from '$app/state'
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

const navigationItems = $derived([
	{ href: '/', label: tt('chrome.nav.home') },
	{ href: '/start', label: tt('chrome.nav.start') },
	{ href: '/organisations', label: tt('chrome.nav.organisations') }
])

const isCurrentNavItem = (href: string) => {
	if (href === '/') return page.url.pathname === '/'
	return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`)
}

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
	<a class="skip-link" href="#main-content">{tt('chrome.skip_to_main')}</a>

	<header class="site-header">
		<div class="site-header-inner site-width">
			<div class="site-header-top">
				<a class="brand" href={resolve('/')}>
					<span class="brand-mark">{tt('chrome.brand')}</span>
					<span class="brand-tagline">{tt('chrome.tagline')}</span>
				</a>
			</div>

			<div class="site-header-main">
				<nav class="service-nav" aria-label={tt('chrome.primary_navigation')}>
					<ul class="service-nav-list">
						{#each navigationItems as item (item.href)}
							<li>
								<a
									class="service-nav-link"
									href={item.href}
									aria-current={isCurrentNavItem(item.href) ? 'page' : undefined}
								>
									{item.label}
								</a>
							</li>
						{/each}
					</ul>
				</nav>

				<nav class="language-nav" aria-label={tt('chrome.language_switcher_label')}>
					<span class="language-nav-label">
						<span class="inline-flex items-center gap-2" aria-hidden="true">
							<LanguagesIcon class="size-3.5" aria-hidden="true" />
						</span>
						{tt('chrome.language_switcher_label')}
					</span>
					<ul class="language-list site-header-actions">
						{#each languages as language (language.value)}
							<li>
								<a
									class="language-link"
									href={getLanguageHref(language.value)}
									aria-current={language.value === locale ? 'true' : undefined}
									onclick={(event) => switchLanguage(event, language.value)}
									>{language.label}</a
								>
							</li>
						{/each}
					</ul>
				</nav>
			</div>
		</div>
	</header>
	<main id="main-content" class="site-width py-8 pb-16">{@render children()}</main>
</div>

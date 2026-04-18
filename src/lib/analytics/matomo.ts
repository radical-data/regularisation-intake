import {
	PUBLIC_MATOMO_DIMENSION_ENVIRONMENT,
	PUBLIC_MATOMO_DIMENSION_LOCALE,
	PUBLIC_MATOMO_DIMENSION_RECOMMENDED_ROUTE,
	PUBLIC_MATOMO_DIMENSION_RESULT_STATE,
	PUBLIC_MATOMO_DIMENSION_ROUTE_GROUP,
	PUBLIC_MATOMO_DIMENSION_STEP_SLUG,
	PUBLIC_MATOMO_ENABLED,
	PUBLIC_MATOMO_LOCAL_ANALYTICS,
	PUBLIC_MATOMO_PRODUCTION_HOSTS,
	PUBLIC_MATOMO_SITE_ID_PRODUCTION,
	PUBLIC_MATOMO_SITE_ID_TEST,
	PUBLIC_MATOMO_URL
} from '$env/static/public'
import type { RecommendedRoute, ResultState } from '$lib/triage/types'

declare global {
	interface Window {
		_paq?: Array<unknown[]>
		__primerPasoMatomoInitialised?: boolean
		__primerPasoMatomoTrackerUrl?: string
		__primerPasoMatomoSiteId?: string
		__primerPasoMatomoPreviousUrl?: string
		__primerPasoMatomoLastTrackedKey?: string
	}
}

export type RouteGroup =
	| 'home'
	| 'start'
	| 'question'
	| 'check_answers'
	| 'result'
	| 'organisations'
	| 'organisation_detail'

export type MatomoEnvironment = 'development' | 'production' | 'test'
export type LocalAnalyticsMode = 'off' | 'test'
interface DimensionIds {
	locale: number | null
	environment: number | null
	routeGroup: number | null
	stepSlug: number | null
	resultState: number | null
	recommendedRoute: number | null
}

export interface PageViewDimensions {
	locale: string
	environment: string
	routeGroup: RouteGroup
	stepSlug?: string
	resultState?: ResultState
	recommendedRoute?: RecommendedRoute
	title: string
	url: string
}

const parseDimensionId = (value: string) => {
	const parsed = Number.parseInt(value, 10)
	return Number.isFinite(parsed) ? parsed : null
}

const dimensionIds: DimensionIds = {
	locale: parseDimensionId(PUBLIC_MATOMO_DIMENSION_LOCALE),
	environment: parseDimensionId(PUBLIC_MATOMO_DIMENSION_ENVIRONMENT),
	routeGroup: parseDimensionId(PUBLIC_MATOMO_DIMENSION_ROUTE_GROUP),
	stepSlug: parseDimensionId(PUBLIC_MATOMO_DIMENSION_STEP_SLUG),
	resultState: parseDimensionId(PUBLIC_MATOMO_DIMENSION_RESULT_STATE),
	recommendedRoute: parseDimensionId(PUBLIC_MATOMO_DIMENSION_RECOMMENDED_ROUTE)
}

const matomoUrl = PUBLIC_MATOMO_URL.trim().replace(/\/+$/, '')
const isEnabledByConfig = PUBLIC_MATOMO_ENABLED === 'true'
const productionHosts = new Set(
	PUBLIC_MATOMO_PRODUCTION_HOSTS.split(',')
		.map((host) => host.trim().toLowerCase())
		.filter(Boolean)
)
const parseLocalAnalyticsMode = (value: string): LocalAnalyticsMode => {
	const normalised = value.trim().toLowerCase()
	return normalised === 'test' ? 'test' : 'off'
}
const localAnalyticsMode = parseLocalAnalyticsMode(PUBLIC_MATOMO_LOCAL_ANALYTICS)
const siteIdsByEnvironment: Record<Exclude<MatomoEnvironment, 'development'>, string> = {
	production: PUBLIC_MATOMO_SITE_ID_PRODUCTION.trim(),
	test: PUBLIC_MATOMO_SITE_ID_TEST.trim()
}

const isLocalHostname = (hostname: string) =>
	hostname === 'localhost' ||
	hostname === '127.0.0.1' ||
	hostname === '[::1]' ||
	hostname.endsWith('.local')

export const inferAnalyticsEnvironment = (hostname: string): MatomoEnvironment => {
	const normalisedHostname = hostname.trim().toLowerCase()

	if (isLocalHostname(normalisedHostname)) {
		return 'development'
	}

	if (productionHosts.has(normalisedHostname)) {
		return 'production'
	}

	return 'test'
}

export const getMatomoSiteIdForEnvironment = (environment: MatomoEnvironment) => {
	if (environment === 'development') {
		return localAnalyticsMode === 'test' ? siteIdsByEnvironment.test : null
	}

	return siteIdsByEnvironment[environment] || null
}

export const isMatomoEnabled = (environment?: MatomoEnvironment) => {
	if (!isEnabledByConfig || !matomoUrl) {
		return false
	}

	if (typeof window === 'undefined') {
		return false
	}

	const resolvedEnvironment = environment ?? inferAnalyticsEnvironment(window.location.hostname)
	if (resolvedEnvironment === 'development' && localAnalyticsMode === 'off') {
		return false
	}

	return Boolean(getMatomoSiteIdForEnvironment(resolvedEnvironment))
}

const getPaq = () => {
	window._paq = window._paq || []
	return window._paq
}

const push = (...commands: unknown[][]) => {
	const paq = getPaq()
	for (const command of commands) {
		paq.push(command)
	}
}

export const getRouteGroup = (pathname: string): RouteGroup => {
	const segments = pathname.split('/').filter(Boolean)
	const routeSegments = segments.slice(1)

	if (routeSegments.length === 0) {
		return 'home'
	}

	const [first, second] = routeSegments

	if (first === 'start') return 'start'
	if (first === 'check-answers') return 'check_answers'
	if (first === 'result') return 'result'
	if (first === 'organisations' && second) return 'organisation_detail'
	if (first === 'organisations') return 'organisations'

	return 'question'
}

const setDimension = (id: number | null, value: string | undefined) => {
	if (!id || !value) return
	push(['setCustomDimension', id, value])
}

const deleteDimension = (id: number | null) => {
	if (!id) return
	push(['deleteCustomDimension', id])
}

export const initMatomo = (environment?: MatomoEnvironment) => {
	const resolvedEnvironment = environment ?? inferAnalyticsEnvironment(window.location.hostname)
	if (!isMatomoEnabled(resolvedEnvironment)) {
		return false
	}

	const siteId = getMatomoSiteIdForEnvironment(resolvedEnvironment)
	if (!siteId) {
		return false
	}

	if (
		window.__primerPasoMatomoInitialised &&
		window.__primerPasoMatomoTrackerUrl === `${matomoUrl}/matomo.php` &&
		window.__primerPasoMatomoSiteId === siteId
	) {
		return true
	}

	push(
		['setTrackerUrl', `${matomoUrl}/matomo.php`],
		['setSiteId', siteId],
		['setDoNotTrack', true],
		['disableCookies'],
		['enableLinkTracking'],
		['enableHeartBeatTimer', 15]
	)

	const script = document.createElement('script')
	script.async = true
	script.src = `${matomoUrl}/matomo.js`
	document.head.append(script)

	window.__primerPasoMatomoInitialised = true
	window.__primerPasoMatomoTrackerUrl = `${matomoUrl}/matomo.php`
	window.__primerPasoMatomoSiteId = siteId

	return true
}

export const trackPageView = (dimensions: PageViewDimensions) => {
	if (!isMatomoEnabled(dimensions.environment as MatomoEnvironment)) {
		return
	}

	const trackingKey = JSON.stringify(dimensions)
	if (window.__primerPasoMatomoLastTrackedKey === trackingKey) {
		return
	}

	initMatomo()

	const previousUrl = window.__primerPasoMatomoPreviousUrl
	if (previousUrl) {
		push(['setReferrerUrl', previousUrl])
	}

	deleteDimension(dimensionIds.routeGroup)
	deleteDimension(dimensionIds.stepSlug)
	deleteDimension(dimensionIds.resultState)
	deleteDimension(dimensionIds.recommendedRoute)

	setDimension(dimensionIds.locale, dimensions.locale)
	setDimension(dimensionIds.environment, dimensions.environment)
	setDimension(dimensionIds.routeGroup, dimensions.routeGroup)
	setDimension(dimensionIds.stepSlug, dimensions.stepSlug)
	setDimension(dimensionIds.resultState, dimensions.resultState)
	setDimension(dimensionIds.recommendedRoute, dimensions.recommendedRoute)

	push(['setCustomUrl', dimensions.url], ['setDocumentTitle', dimensions.title], ['trackPageView'])

	window.__primerPasoMatomoPreviousUrl = new URL(dimensions.url, window.location.origin).toString()
	window.__primerPasoMatomoLastTrackedKey = trackingKey
}

export const trackEvent = (category: string, action: string, name?: string, value?: number) => {
	const environment =
		typeof window === 'undefined' ? undefined : inferAnalyticsEnvironment(window.location.hostname)

	if (!isMatomoEnabled(environment)) {
		return
	}

	initMatomo(environment)

	if (typeof value === 'number') {
		push(['trackEvent', category, action, name, value])
		return
	}

	if (name) {
		push(['trackEvent', category, action, name])
		return
	}

	push(['trackEvent', category, action])
}

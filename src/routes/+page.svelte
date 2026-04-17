<script lang="ts">
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card'
import { Button } from '$lib/components/ui/button'
type SupportedLocale = 'es' | 'en' | 'ar' | 'fr'
const copy: Record<
	SupportedLocale,
	{
		eyebrow: string
		title: string
		lead: string
		choose: string
		quizTitle: string
		quizBody: string
		quizAction: string
		directoryTitle: string
		directoryBody: string
		directoryAction: string
		noteTitle: string
		noteBody: string
	}
> = {
	es: {
		eyebrow: 'Empezar',
		title: 'Elige cómo quieres empezar',
		lead:
			'Puedes usar el orientador para revisar tu siguiente paso o explorar directamente el directorio de organizaciones colaboradoras.',
		choose: 'Elige una opción',
		quizTitle: 'Revisar mi siguiente paso',
		quizBody:
			'Responde unas preguntas para recibir una orientación cautelosa sobre qué vía puede encajar mejor contigo.',
		quizAction: 'Empezar el orientador',
		directoryTitle: 'Buscar una organización colaboradora',
		directoryBody:
			'Explora el directorio sin hacer el formulario. Busca por nombre, provincia o datos de contacto.',
		directoryAction: 'Abrir directorio',
		noteTitle: 'Antes de empezar',
		noteBody:
			'Este servicio ofrece orientación práctica. No sustituye el asesoramiento jurídico ni una decisión oficial.'
	},
	en: {
		eyebrow: 'Getting started',
		title: 'Choose how you want to start',
		lead:
			'You can use the screener to check your next step or go straight to the directory of collaborating organisations.',
		choose: 'Choose an option',
		quizTitle: 'Check my next step',
		quizBody:
			'Answer a few questions to get cautious guidance on which route may fit your situation best.',
		quizAction: 'Start the screener',
		directoryTitle: 'Find a collaborating organisation',
		directoryBody:
			'Browse the directory without completing the form. Search by name, province, or contact details.',
		directoryAction: 'Open directory',
		noteTitle: 'Before you begin',
		noteBody:
			'This service offers practical guidance. It does not replace legal advice or an official decision.'
	},
	ar: {
		eyebrow: 'البدء',
		title: 'اختر كيف تريد أن تبدأ',
		lead: 'يمكنك استخدام الأداة لمعرفة الخطوة التالية أو الذهاب مباشرة إلى دليل الجهات المتعاونة.',
		choose: 'اختر خياراً',
		quizTitle: 'معرفة الخطوة التالية',
		quizBody: 'أجب عن بعض الأسئلة للحصول على توجيه حذر حول المسار الذي قد يناسب حالتك.',
		quizAction: 'ابدأ الأداة',
		directoryTitle: 'البحث عن جهة متعاونة',
		directoryBody: 'تصفح الدليل من دون إكمال النموذج. ابحث بالاسم أو المقاطعة أو بيانات الاتصال.',
		directoryAction: 'فتح الدليل',
		noteTitle: 'قبل أن تبدأ',
		noteBody: 'هذه الخدمة تقدم إرشاداً عملياً ولا تحل محل الاستشارة القانونية أو القرار الرسمي.'
	},
	fr: {
		eyebrow: 'Pour commencer',
		title: 'Choisissez comment commencer',
		lead:
			'Vous pouvez utiliser le questionnaire pour vérifier la prochaine étape ou accéder directement au répertoire des organisations collaboratrices.',
		choose: 'Choisissez une option',
		quizTitle: 'Vérifier ma prochaine étape',
		quizBody:
			'Répondez à quelques questions pour obtenir une orientation prudente sur la voie qui peut le mieux correspondre à votre situation.',
		quizAction: 'Commencer le questionnaire',
		directoryTitle: 'Trouver une organisation collaboratrice',
		directoryBody:
			'Consultez le répertoire sans remplir le formulaire. Recherchez par nom, province ou coordonnées.',
		directoryAction: 'Ouvrir le répertoire',
		noteTitle: 'Avant de commencer',
		noteBody:
			'Ce service fournit une orientation pratique. Il ne remplace ni un conseil juridique ni une décision officielle.'
	}
}
let { data } = $props()
const locale = $derived((data.locale ?? 'es') as SupportedLocale)
const t = $derived(copy[locale] ?? copy.es)
</script>

<section class="stack">
	<p class="eyebrow">{t.eyebrow}</p>
	<div class="app-card stack">
		<div class="section-block">
			<h1 class="page-title">{t.title}</h1>
			<p class="lead-text">{t.lead}</p>
		</div>
		<div class="section-block">
			<h2 class="section-title">{t.choose}</h2>
			<div class="task-grid">
				<Card class="task-card">
					<CardHeader>
						<CardTitle>{t.quizTitle}</CardTitle>
						<CardDescription>{t.quizBody}</CardDescription>
					</CardHeader>
					<CardContent />
					<CardFooter>
						<Button href="/start">{t.quizAction}</Button>
					</CardFooter>
				</Card>
				<Card class="task-card">
					<CardHeader>
						<CardTitle>{t.directoryTitle}</CardTitle>
						<CardDescription>{t.directoryBody}</CardDescription>
					</CardHeader>
					<CardContent />
					<CardFooter>
						<Button href="/organisations" variant="secondary">{t.directoryAction}</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
		<div class="panel-subtle section-block">
			<h2 class="section-title">{t.noteTitle}</h2>
			<p class="supporting-text">{t.noteBody}</p>
		</div>
	</div>
</section>
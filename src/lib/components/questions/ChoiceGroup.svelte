<script lang="ts">
import { Label } from '$lib/components/ui/label'

export interface ChoiceOption {
	value: string
	label: string
}

interface Props {
	type: 'radio' | 'checkbox'
	name: string
	options: ChoiceOption[]
	value?: string
	values?: string[]
	legend: string
}

let { type, name, options, value = '', values = [], legend }: Props = $props()

const isChecked = (optionValue: string) =>
	type === 'radio' ? value === optionValue : values.includes(optionValue)

const optionId = (optionValue: string) => `${name}-${optionValue}`
</script>

<fieldset class="question-group">
	<legend>{legend}</legend>

	{#each options as option}
		<div class="app-option-row">
			<input
				id={optionId(option.value)}
				{type}
				{name}
				value={option.value}
				checked={isChecked(option.value)}
			>
			<Label class="leading-6 cursor-pointer" for={optionId(option.value)}>{option.label}</Label>
		</div>
	{/each}
</fieldset>

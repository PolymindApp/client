<template>
	<div>
		<v-list-item v-for="(param, paramIdx) in value" class="pa-0">
			<v-list-item-title style="flex: 1">
				<span v-text="param.title"></span>
				<span v-if="param.mandatory" class="error--text">&nbsp;*</span>
			</v-list-item-title>
			<div class="d-flex align-center justify-start" style="flex: 1">

				<template v-if="type === 'component'">
					<v-select :readonly="readonly" v-if="param.type === 'select'" v-model="param.value" :items="param.items" :menu-props="{ maxWidth: 300 }" :placeholder="$t('component.parameters.component.selectPlaceholder')" outlined dense flat hide-details>
						<template v-slot:selection="props">
							<div class="text-truncate">
								<v-icon v-if="props.item.icon" :color="props.item.color" class="mr-2">{{ props.item.icon }}</v-icon>
								<span>{{ props.item.text }}</span>
							</div>
						</template>
						<template v-slot:item="props">
							<v-icon v-if="props.item.icon" :color="props.item.color" class="mr-4" x-large>{{ props.item.icon }}</v-icon>
							<div class="py-4">
								<div v-if="props.item.text" class="subtitle-2">{{ props.item.text }}</div>
								<div v-if="props.item.desc" class="caption">{{ props.item.desc }}</div>
							</div>
						</template>
					</v-select>
					<v-switch :readonly="readonly" v-else-if="param.type === 'switch'" v-model="param.value" class="ma-0 mr-n3" inset hide-details></v-switch>
					<v-slider :readonly="readonly" v-else-if="param.type === 'slider'" v-model="param.value" class="ma-0" :min="param.min" :max="param.max" :label="param.value && param.value.toString()" step="5" thumb-label inverse-label hide-details></v-slider>
					<v-alert v-else type="warning" class="text-no-wrap ma-0" dense>
						<div v-text="$t('component.parameters.component.unknownType')"></div>
					</v-alert>
				</template>
				<template v-else-if="type === 'dataset'">
					<v-select :readonly="readonly" v-if="param.type === 'column'" :items="columns" item-text="name" item-value="sort" v-model="param.value" :placeholder="$t('component.parameters.dataset.columnPlaceholder')" outlined dense flat hide-details></v-select>
					<v-alert v-else type="warning" class="text-no-wrap ma-0" dense>
						<div v-text="$t('component.parameters.dataset.unknownType')"></div>
					</v-alert>
				</template>

			</div>
		</v-list-item>
	</div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({
        name: 'Parameters',
        props: {
        	value: {
        		type: Array,
				default: () => [],
			},
			type: {
        		type: String,
				default: 'component',
			},
			readonly: {
        		type: Boolean,
				default: false,
			},
			columns: {
        		type: Array,
				default: () => [],
			},
		},
    });
</script>

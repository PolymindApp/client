<template>
	<div>
		<v-list-item v-for="(param, paramIdx) in parameters" class="pa-0">
			<v-list-item-title style="flex: 1">
				<span v-text="param.title"></span>
				<span v-if="param.mandatory" class="error--text">&nbsp;*</span>
			</v-list-item-title>
			<div class="d-flex align-center justify-start" style="flex: 1">
				<template v-if="type === 'component'">
					<v-select :readonly="readonly" :error="!isValid(param, model)" v-if="param.type === 'select'" v-model="model[param.key]" :items="param.items" :menu-props="{ maxWidth: 300 }" :placeholder="$t('component.parameters.component.selectPlaceholder')" outlined dense flat hide-details>
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
					<v-select :readonly="readonly" :error="!isValid(param, model)" v-else-if="param.type === 'language'" :items="languages" v-model="model[param.key]" :placeholder="$t('component.parameters.component.languagePlaceholder')" outlined dense flat hide-details></v-select>
					<v-switch :readonly="readonly" :error="!isValid(param, model)" v-else-if="param.type === 'switch'" v-model="model[param.key]" class="ma-0 mr-n3" inset hide-details></v-switch>
					<v-slider :readonly="readonly" :error="!isValid(param, model)" v-else-if="param.type === 'slider'" v-model="model[param.key]" class="ma-0" :min="param.min" :max="param.max" :label="model[param.key] && model[param.key].toString()" step="5" thumb-label inverse-label hide-details></v-slider>
					<v-alert v-else type="warning" class="text-no-wrap ma-0" dense>
						<div v-text="$t('component.parameters.component.unknownType')"></div>
					</v-alert>
				</template>
				<template v-else-if="type === 'dataset'">
					<v-select :readonly="readonly" :error="!isValid(param, model)" v-if="param.type === 'column'" :items="columns" item-text="name" item-value="guid" v-model="model[param.key]" :placeholder="$t('component.parameters.dataset.columnPlaceholder')" outlined dense flat hide-details></v-select>
					<v-select :readonly="readonly" :error="!isValid(param, model)" v-else-if="param.type === 'language'" :items="languages" v-model="model[param.key]" :placeholder="$t('component.parameters.dataset.languagePlaceholder')" outlined dense flat hide-details></v-select>
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
    import { LANGUAGES } from '@polymind/sdk-js';
	import StrategyAssemblyParameters from "@polymind/sdk-js/src/models/StrategyAssemblyParameters";

    export default Vue.extend({

        name: 'Parameters',

        props: {
        	value: {
        		type: Object,
				default: () => {},
			},
			parameters: {
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

		created() {
			this.model = this.getDefault(this.value);
		},

		methods: {

        	isValid(param, model) {

        		if (param.mandatory !== true) {
        			return true;
				}

        		if (param.type === 'column') {
					return !!(this.columns.find(column => column.guid === model[param.key]));
				}

				return !!(model[param.key]);
			},

			getDefault(value) {
				const model = {};
				this.parameters.forEach(param => {
					if (param.default !== undefined) {
						model[param.key] = param.default;
					}
				});
				return Object.assign(model, value);
			}
		},

		computed: {

			languages() {
				const items = [];
				LANGUAGES.forEach(lang => {
					items.push({
						text: lang.english,
						value: lang.abbr,
					});
				})
				return items;
			},
		},

		data() {
        	return {
        		model: null,
			}
		},

		watch: {

        	model: {
        		deep: true,
				handler(model) {
					this.$emit('input', model);
				}
			},

        	parameters: {
				deep: true,
				handler(value) {
					const clone = this.$deepClone(this.value);
					Object.assign(this.model, this.getDefault(), clone);
					this.$emit('input', this.model);
				}
			},

        	value: {
        		deep: true,
				handler(value) {
					this.model = value;
				}
			},
		}
    });
</script>

<template>
	<v-row no-gutters class="fill-height">
		<v-col cols="12" md="6">
			<CodeEditorField v-model="schema" lang="yaml" class="fill-height" hide-details></CodeEditorField>
		</v-col>
		<v-col cols="12" md="6" class="scrollable pa-4">
			<div :style="{ height: component.parameters ? 0 : null }" :class="{ 'fill-height': !component.parameters }">

				<EmptyView v-if="!component.parameters" :title="$t('component.parameters.emptyTitle')" :desc="$t('component.parameters.emptyDesc')" />
				<template v-else>

					<!-- VALID YAML -->
					<v-alert prominent v-if="!error" type="info">
						<div v-text="$t('component.parameters.yamlValid')"></div>
					</v-alert>

					<!-- ERROR -->
					<v-alert prominent v-if="error" type="error">
						<div class="subtitle-1 font-weight-bold" v-text="error.name"></div>
						<div class="subtitle-2 text-uppercase" v-text="error.reason"></div>
						<div v-text="$t('component.parameters.yamlErr', error.mark)"></div>
					</v-alert>

					<div v-else-if="preview">

						<!-- COMPONENT -->
						<v-card>
							<v-card-title v-text="$t('component.parameters.component.title')"></v-card-title>
							<v-card-text>
								<EmptyView v-if="preview.component.parameters.length === 0" :title="$t('strategy.assembly.component.noParameterTitle')" :desc="$t('strategy.assembly.component.noParameterDesc')" />
								<ComponentParameters v-else v-model="value.component" :parameters="preview.component.parameters" type="component" />
							</v-card-text>
						</v-card>

						<!-- DATASET -->
						<v-card class="my-4">
							<v-card-title class="d-flex justify-space-between">
								<span v-text="$t('component.parameters.dataset.title')"></span>
								<v-select v-model="selectedDataset" :items="$root.datasets" :label="$t('strategy.assembly.datasetPlaceholder')" item-text="name" style="max-width: 250px" dense outlined return-object hide-details></v-select>
							</v-card-title>
							<v-card-text>
								<EmptyView v-if="preview.dataset.parameters.length === 0" :title="$t('strategy.assembly.dataset.noParameterTitle')" :desc="$t('strategy.assembly.dataset.noParameterDesc')" />
								<ComponentParameters v-else v-model="value.dataset" :parameters="preview.dataset.parameters" type="dataset" :columns="dataset.columns" />
							</v-card-text>
						</v-card>
					</div>
				</template>
			</div>
		</v-col>
	</v-row>
</template>

<script>
    import Vue from 'vue';
    import yaml from 'js-yaml';
    import { ComponentParameters as ComponentParametersModel, Dataset } from '@polymind/sdk-js';
	import CodeEditorField from "../../../components/CodeEditorField";
	import EmptyView from "../../../components/EmptyView";
	import ComponentParameters from "../../../components/ComponentParameters";
	import StrategyAssemblyParameters from "@polymind/sdk-js/src/models/StrategyAssemblyParameters";

	let previewTimer;

    export default Vue.extend({

        name: 'Parameters',

        props: ['component', 'dataset'],

        components: { CodeEditorField, EmptyView, ComponentParameters },

        mounted() {
			this.init();
        },

        destroyed() {

        },

        methods: {

        	init() {
        		this.previewYaml();
			},

        	previewYaml(compile = true) {

        		this.error = null;

        		try {
					const preview = yaml.safeLoad(this.component.parameters, 'utf8');
					this.preview = new ComponentParametersModel(preview);

					if (compile) {
						this.component.compiled_parameters = new ComponentParametersModel(this.$deepClone(this.preview));
					}

					this.value = this.component.getDefaultParameters();
				} catch (e) {
        			console.error(e);
        			this.error = e;
				}
			}
		},

        computed: {

        	schema: {

        		get() {
        			return this.component.parameters;
				},

				set(value) {
					clearTimeout(previewTimer);
					previewTimer = setTimeout(() => {
						this.component.parameters = value;
						this.previewYaml();
						this.$emit('update:component', this.component);
					}, 500);
				},
			}
		},

        data() {
            return {
				error: null,
				selectedDataset: this.dataset,
				value: new StrategyAssemblyParameters(),
				preview: new ComponentParametersModel(),
			};
        },

		watch: {

        	'component.parameters'() {
        		this.previewYaml();
			},

			value(value) {
				this.$emit('value', value);
			},

			'selectedDataset': {
        		deep: true,
				handler(dataset) {
        			this.$emit('update:dataset', dataset);
				}
			}
		}
    });
</script>

<style lang="scss" scoped>

</style>

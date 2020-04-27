<template>
	<v-row no-gutters class="fill-height">
		<v-col cols="12" md="6">
			<CodeEditorField v-model="component.parameters" lang="yaml" class="fill-height" hide-details></CodeEditorField>
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
								<ComponentParameters v-model="preview.component.parameters" type="component" />
							</v-card-text>
						</v-card>

						<!-- DATASET -->
						<v-card class="my-4">
							<v-card-title v-text="$t('component.parameters.dataset.title')"></v-card-title>
							<v-card-text>
								<ComponentParameters v-model="preview.dataset.parameters" type="dataset" :readonly="true" />
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
    import { ComponentParameters as ComponentParametersModel } from '@polymind/sdk-js';
	import CodeEditorField from "../../../components/CodeEditorField";
	import EmptyView from "../../../components/EmptyView";
	import ComponentParameters from "../../../components/ComponentParameters";

	let previewTimer;

    export default Vue.extend({

        name: 'Parameters',

        props: ['component'],

        components: { CodeEditorField, EmptyView, ComponentParameters },

        mounted() {
			this.previewYaml();
        },

        destroyed() {

        },

        methods: {

        	init() {
        		this.previewYaml();
			},

        	previewYaml() {

        		this.error = null;

        		try {
					const preview = yaml.safeLoad(this.component.parameters, 'utf8');
					this.preview = new ComponentParametersModel(preview);
					this.component.compiled_parameters = new ComponentParametersModel(this.$deepClone(this.preview));
				} catch (e) {
        			console.error(e);
        			this.error = e;
				}
			}
		},

        computed: {

		},

        data() {
            return {
				error: null,
				preview: new ComponentParametersModel(),
			};
        },

		watch: {

			'component.parameters'() {
				clearTimeout(previewTimer);
				previewTimer = setTimeout(() => {
					this.previewYaml();
					this.$emit('update:component', this.component);
				}, 1000);
			}
		}
    });
</script>

<style lang="scss" scoped>

</style>

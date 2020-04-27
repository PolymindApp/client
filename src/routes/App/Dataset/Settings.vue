<template>
	<v-card color="transparent" flat tile>

		<v-alert type="info" border="left" text :icon="!isMobile ? 'mdi-information-outline' : false" class="mx-n4 mt-n4" dismissible tile>
			<div v-text="$t('dataset.settings.explanations')"></div>
		</v-alert>

		<v-row>
			<v-col cols="12" sm="6" class="py-0">
				<v-card class="mb-4" outlined>
					<v-card-title class="d-flex justify-space-between">
						<span v-text="$t('dataset.settings.infoSection')"></span>
						<v-checkbox :error-messages="formErrors.is_private" :label="$t('dataset.settings.isPrivateLabel')" v-model="dataset.is_private" color="primary" class="ma-0" hide-details></v-checkbox>
					</v-card-title>
					<v-card-text>
						<v-text-field :error-messages="formErrors.name" :label="$t('dataset.settings.namePlaceholder')" v-model="dataset.name"></v-text-field>
						<HTMLEditorField :error-messages="formErrors.description" :label="$t('dataset.settings.descPlaceholder')" v-model="dataset.description"></HTMLEditorField>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" sm="6" class="py-0">

				<v-card class="mb-4" outlined>
					<v-card-title class="d-flex">
						<v-checkbox :error-messages="formErrors.is_remote" v-model="dataset.is_remote" color="primary" class="ma-0" hide-details></v-checkbox>
						<span v-text="$t('dataset.settings.isRemoteLabel')"></span>
					</v-card-title>
					<v-card-text>
						<v-text-field :disabled="!dataset.is_remote" :error-messages="formErrors.remote_uri" :label="$t('dataset.settings.remoteURIPlaceholder')" v-model="dataset.remote_uri" hide-details></v-text-field>
						<v-checkbox :disabled="!dataset.is_remote" :error-messages="formErrors.is_applying_mapper" :label="$t('dataset.settings.applyMapper')" v-model="dataset.is_applying_mapper" color="primary"></v-checkbox>
						<CodeEditorField :disabled="!dataset.is_applying_mapper || !dataset.is_remote" :error-messages="formErrors.mapper" v-model="dataset.mapper" lang="javascript" :height="200"></CodeEditorField>

						<v-btn @click="testRemoteURI()" :disabled="!dataset.is_remote">
							<v-icon>mdi-play</v-icon>
							<span v-text="$t('dataset.settings.testRemoteURI')"></span>
						</v-btn>

						<v-expand-transition>
							<pre class="mt-4" v-if="remoteTestResponse" v-text="remoteTestResponse"></pre>
						</v-expand-transition>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import Vue from 'vue';
import HTMLEditorField from "../../../components/HTMLEditorField";
import IconListField from "../../../components/IconListField";
import CodeEditorField from "../../../components/CodeEditorField";

export default Vue.extend({

	props: ['dataset', 'formErrors'],

	components: { HTMLEditorField, CodeEditorField, IconListField },

	methods: {

		testRemoteURI() {
			this.remoteTestResponse = null;
			this.$root.isLoading = true;
			fetch(this.dataset.remote_uri)
				.then(response => response.json())
				.then(response => {
					    if (this.dataset.is_applying_mapper) {
					        return this.remoteTestResponse = eval('() => {' + this.dataset.mapper + '}')();
					}

					    return this.remoteTestResponse = response;
				})
				.catch(error => this.remoteTestResponse = error)
				.finally(() => this.$root.isLoading = false);
		}
	},

	computed: {

		isMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		}
	},

	data() {
		return {
			remoteTestResponse: null,
		}
	},

	watch: {

		dataset: {
			deep: true,
			handler(dataset) {
				this.$emit('update:dataset', dataset);
			}
		}
	}
})
</script>

<style lang="scss" scoped>
	pre {
		border-radius: 4px;
		padding: 1rem;
		background-color: rgba(0, 0, 0, 0.1);
		text-align: left;
		max-height: 15rem;
		overflow: auto;
	}
</style>

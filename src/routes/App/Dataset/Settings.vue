<template>
	<v-card flat>

		<v-alert type="info" prominent border="left" text icon="mdi-information-outline">

			<div class="d-flex flex-column flex-md-row align-start align-md-center">
				<div style="flex: 1" v-text="$t('dataset.settings.explanations')"></div>
				<div style="flex: 0">
					<v-btn class="ml-0 ml-md-8 mt-4 mt-md-0" to="/help/dataset">
						<v-icon left>mdi-book-search</v-icon>
						<span class="text-break" v-text="$t('dataset.settings.readDoc')"></span>
					</v-btn>
				</div>
			</div>
		</v-alert>

		<v-row>
			<v-col cols="12" sm="6" class="py-0">
				<v-text-field :error-messages="formErrors.name" :label="$t('dataset.settings.namePlaceholder')" v-model="dataset.name"></v-text-field>
				<HTMLEditorField :error-messages="formErrors.description" :label="$t('dataset.settings.descPlaceholder')" v-model="dataset.description"></HTMLEditorField>
				<IconListField :error-messages="formErrors.icon" :label="$t('dataset.settings.iconPlaceholder')" v-model="dataset.icon" :height="226"></IconListField>
			</v-col>
			<v-col cols="12" sm="6" class="py-0">
				<v-row>
					<v-col cols="8" class="py-0">
						<v-checkbox :error-messages="formErrors.is_remote" :label="$t('dataset.settings.isRemoteLabel')" v-model="dataset.is_remote" color="primary"></v-checkbox>
					</v-col>
					<v-col cols="4" class="py-0">
						<v-checkbox :error-messages="formErrors.is_private" :label="$t('dataset.settings.isPrivateLabel')" v-model="dataset.is_private" color="primary"></v-checkbox>
					</v-col>
				</v-row>

				<div class="mb-4">
					<v-text-field :disabled="!dataset.is_remote" :error-messages="formErrors.remote_uri" :label="$t('dataset.settings.remoteURIPlaceholder')" v-model="dataset.remote_uri"></v-text-field>
					<v-checkbox :disabled="!dataset.is_remote" :error-messages="formErrors.is_applying_mapper" :label="$t('dataset.settings.applyMapper')" v-model="dataset.is_applying_mapper" color="primary"></v-checkbox>
					<CodeEditorField :disabled="!dataset.is_applying_mapper" :error-messages="formErrors.mapper" v-model="dataset.mapper" lang="javascript" :height="200"></CodeEditorField>

					<v-btn @click="testRemoteURI()" :disabled="!dataset.is_remote">
						<v-icon>mdi-play</v-icon>
						<span v-text="$t('dataset.settings.testRemoteURI')"></span>
					</v-btn>

					<v-expand-transition>
						<pre class="mt-4" v-if="remoteTestResponse" v-text="remoteTestResponse"></pre>
					</v-expand-transition>
				</div>
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

	data() {
		return {
			remoteTestResponse: null,
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

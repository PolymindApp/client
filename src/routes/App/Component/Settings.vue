<template>
	<v-card color="transparent" flat tile>

		<v-alert type="info" border="left" text :icon="!isMobile ? 'mdi-information-outline' : false" class="mx-n4 mt-n4" dismissible tile>
			<div v-text="$t('component.settings.explanations')"></div>
		</v-alert>

		<v-row>
			<v-col cols="12" sm="6" class="py-0">
				<v-card class="mb-4" outlined>
					<v-card-title class="d-flex justify-space-between">
						<span v-text="$t('component.settings.informationSection')"></span>
						<v-checkbox :error-messages="formErrors.is_private" :label="$t('component.settings.isPrivateLabel')" v-model="component.is_private" color="primary" class="ma-0" hide-details></v-checkbox>
					</v-card-title>
					<v-card-text>
						<v-text-field :error-messages="formErrors.name" :label="$t('component.settings.namePlaceholder')" v-model="component.name"></v-text-field>
						<IconListField :error-messages="formErrors.icon" :label="$t('component.settings.iconPlaceholder')" v-model="component.icon" />
						<!--				<v-select :error-messages="formErrors.category" :label="$t('component.settings.categoryPlaceholder')" :items="categories" v-model="component.category"></v-select>-->
						<HTMLEditorField :error-messages="formErrors.description" :label="$t('component.settings.descPlaceholder')" v-model="component.description"></HTMLEditorField>

						<v-checkbox :error-messages="formErrors.has_instructions" :label="$t('component.settings.hasInstructionsPlaceholder')" v-model="component.has_instructions" color="primary" class="ma-0" hide-details></v-checkbox>
						<HTMLEditorField :error-messages="formErrors.instructions" :label="$t('component.settings.instructionsPlaceholder')" v-model="component.instructions" :disabled="!component.has_instructions" hide-details></HTMLEditorField>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" sm="6" class="py-0">
				<v-card class="mb-4" outlined>
					<v-card-title class="d-flex justify-space-between">
						<span v-text="$t('component.settings.testSection')"></span>
						<v-switch v-model="component.test_mode" color="primary" class="ma-0 mr-n2" inset hide-details></v-switch>
					</v-card-title>
					<v-card-text>
						<v-text-field :error-messages="formErrors.test_uri" :disabled="!component.test_mode" :label="$t('component.settings.testURIPlaceholder')" v-model="component.test_uri" :hint="$t('component.settings.testURIHint')" persistent-hint></v-text-field>
					</v-card-text>
				</v-card>

				<v-card class="mb-4" outlined>
					<v-card-title v-text="$t('component.settings.gitRepoSection')"></v-card-title>
					<v-card-text>
						<v-text-field :error-messages="formErrors.repo_url" :label="$t('component.settings.repoURLPlaceholder')" v-model="component.repo_url"></v-text-field>
						<v-text-field :error-messages="formErrors.repo_branch" :label="$t('component.settings.repoBranchPlaceholder')" v-model="component.repo_branch"></v-text-field>

						<v-radio-group v-model="component.repo_auth_type">
							<v-radio :label="$t('component.settings.repoAuthNone')" value="none"></v-radio>
							<v-radio :label="$t('component.settings.repoAuthUserPass')" value="user_pass"></v-radio>
<!--							<v-radio :label="$t('component.settings.repoAuthSSHKey')" value="ssh"></v-radio>-->
						</v-radio-group>

						<v-row v-if="component.repo_auth_type === 'user_pass'">
							<v-col cols="12" md="6" class="py-0">
								<v-text-field :error-messages="formErrors.repo_user" :label="$t('component.settings.repoUserPlaceholder')" v-model="component.repo_user" autocomplete="off"></v-text-field>
							</v-col>
							<v-col cols="12" md="6" class="py-0">
								<v-text-field type="password" :error-messages="formErrors.repo_pass" :label="$t('component.settings.repoPassPlaceholder')" v-model="repoPassword" autocomplete="off"></v-text-field>
							</v-col>
						</v-row>

						<v-textarea v-if="component.repo_auth_type === 'ssh'" :error-messages="formErrors.repo_ssh_key" :label="$t('component.settings.repoSSHKeyPlaceholder')" v-model="component.repo_ssh_key" outlined></v-textarea>

						<v-expand-transition>
							<div v-if="isDifferent">
								<div class="pb-4">
									<v-alert type="warning" class="ma-0" dense outlined>
										<span v-text="$t('component.settings.contentDiffersBuild')"></span>
									</v-alert>
								</div>
							</div>
						</v-expand-transition>

						<v-btn @click="build()" color="primary" :loading="buildIsLoading" :disabled="!component.repo_url || isDifferent">
							<v-icon left>mdi-play</v-icon>
							<span v-text="$t('component.settings.build')"></span>
						</v-btn>
					</v-card-text>

					<v-divider class="my-4" />

					<v-card-title>Variables d'environnement</v-card-title>

					<v-card-text>
						<SimpleListBuilder v-model="component.env_variables" :empty-item="emptyEnvVariables">
							<template v-slot:empty>
								<span v-text="$t('component.settings.emptyEnvVar')"></span>
							</template>
							<template v-slot:item="{ item }">
								<v-row>
									<v-col>
										<v-text-field :label="$t('component.settings.envVarKey')" v-model="item.name" outlined hide-details></v-text-field>
									</v-col>
									<v-col>
										<v-text-field :label="$t('component.settings.envVarValue')" v-model="item.value" outlined hide-details></v-text-field>
									</v-col>
								</v-row>
							</template>
						</SimpleListBuilder>
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
import SimpleListBuilder from "../../../components/SimpleListBuilder";
import { ComponentEnvVariable, ComponentService } from "@polymind/sdk-js";

export default Vue.extend({

	props: ['component', 'formErrors', 'isDifferent', 'builds'],

	components: { HTMLEditorField, IconListField, SimpleListBuilder },

	methods: {

		build() {

			this.buildIsLoading = true;
			ComponentService.build(this.component.id, this.repoPassword)
				.then(response => this.$emit('build', response))
				.catch(error => this.$handleError(this, error))
				.finally(() => this.buildIsLoading = false);
		}
	},

	computed: {

		isMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		},
	},

	data() {
		return {
			emptyEnvVariables: new ComponentEnvVariable(),
			repoPassword: '',
			buildIsLoading: false,
            categories: [
				{ text: this.$t('component.categories.general'), value: 'general' },
				{ text: this.$t('component.categories.language'), value: 'language' },
				{ text: this.$t('component.categories.functions'), value: 'functions' },
			],
		}
	},

	watch: {

		component: {
			deep: true,
			handler: function(component) {
				this.$emit('update:component', component);
			}
		}
	}
})
</script>

<style lang="scss" scoped>

</style>

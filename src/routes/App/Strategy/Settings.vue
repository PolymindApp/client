<template>
	<v-card color="transparent" class="pa-4" tile flat>

		<v-alert type="info" border="left" text :icon="!isMobile ? 'mdi-information-outline' : false" class="mx-n4 mt-n4" tile>
			<div v-text="$t('strategy.settings.explanations')"></div>
		</v-alert>

		<v-row>
			<v-col cols="12" sm="6" class="py-0">
				<v-card class="mb-4" outlined>
					<v-card-title class="d-flex justify-space-between">
						<span v-text="$t('strategy.settings.infoSection')"></span>
						<v-checkbox :error-messages="formErrors.is_private" :label="$t('strategy.settings.isPrivateLabel')" v-model="strategy.is_private" color="primary" class="ma-0" hide-details></v-checkbox>
					</v-card-title>
					<v-card-text>
						<v-text-field :error-messages="formErrors.name" :label="$t('strategy.settings.namePlaceholder')" v-model="strategy.name"></v-text-field>
						<v-text-field :error-messages="formErrors.icon" :label="$t('strategy.settings.iconPlaceholder')" v-model="strategy.icon"></v-text-field>
						<HTMLEditorField :error-messages="formErrors.description" :label="$t('strategy.settings.descPlaceholder')" v-model="strategy.description"></HTMLEditorField>
<!--						<HTMLEditorField :error-messages="formErrors.instructions" :label="$t('strategy.settings.instructionsPlaceholder')" v-model="strategy.instructions"></HTMLEditorField>-->
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" sm="6" class="py-0">
				<v-card class="mb-4" outlined>
					<v-card-title>
						<span v-text="$t('strategy.settings.testSection')"></span>
					</v-card-title>
					<v-card-text>
						<div>Essayez votre assemblage sans conséquence sur vos statistiques.</div>

						<div class="mt-4">
							<v-btn target="_blank" color="warning">
								<v-icon left>mdi-launch</v-icon>
								<span v-text="$t('strategy.settings.test')"></span>
							</v-btn>
						</div>
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

export default Vue.extend({

	props: ['strategy', 'formErrors'],

	components: { HTMLEditorField, IconListField },

	methods: {

	},

	computed: {

		isMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		}
	},

	data() {
		return {

		}
	}
})
</script>

<style lang="scss" scoped>

</style>

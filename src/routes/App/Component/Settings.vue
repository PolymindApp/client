<template>
	<v-card flat>

		<v-alert type="info" prominent border="left" text icon="mdi-help-circle">

			<div class="d-flex flex-column flex-md-row align-start align-md-center">
				<div style="flex: 1" v-text="$t('component.settings.explanations')"></div>
				<div style="flex: 0">
					<v-btn class="ml-0 ml-md-8 mt-4 mt-md-0" to="/help/component">
						<v-icon left>mdi-book-search</v-icon>
						<span class="text-break" v-text="$t('component.settings.readDoc')"></span>
					</v-btn>
				</div>
			</div>
		</v-alert>

		<v-row>
			<v-col cols="12" sm="6" class="py-0">
				<v-text-field :error-messages="formErrors.name" :label="$t('component.settings.namePlaceholder')" v-model="component.name"></v-text-field>
				<HTMLEditorField :error-messages="formErrors.description" :label="$t('component.settings.descPlaceholder')" v-model="component.description"></HTMLEditorField>
			</v-col>
			<v-col cols="12" sm="6" class="py-0">
				<v-row>
					<v-col cols="6" class="py-0">
						<v-checkbox :error-messages="formErrors.is_invisible" :label="$t('component.settings.isInvisibleLabel')" v-model="component.is_invisible" color="primary"></v-checkbox>
					</v-col>
					<v-col cols="6" class="py-0">
						<v-checkbox :error-messages="formErrors.is_private" :label="$t('component.settings.isPrivateLabel')" v-model="component.is_private" color="primary"></v-checkbox>
					</v-col>
				</v-row>

				<IconListField :error-messages="formErrors.icon" :label="$t('component.settings.iconPlaceholder')" v-model="component.icon" :height="226"></IconListField>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import Vue from 'vue';
import Page from "../../../components/Page";
import HTMLEditorField from "../../../components/HTMLEditorField";
import IconListField from "../../../components/IconListField";

export default Vue.extend({

	props: ['component', 'formErrors'],

	components: { HTMLEditorField, IconListField },

	methods: {

	},

	data() {
		return {

		}
	}
})
</script>

<style lang="scss" scoped>

</style>

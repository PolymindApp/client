<template>
	<v-card flat>
		<v-row>
			<v-col cols="12" sm="6">
				<v-text-field :error-messages="formErrors.name" :placeholder="$t('strategy.settings.namePlaceholder')" v-model="strategy.name"></v-text-field>
				<HTMLEditorField :error-messages="formErrors.description" :placeholder="$t('strategy.settings.descPlaceholder')" v-model="strategy.description"></HTMLEditorField>
			</v-col>
			<v-col cols="12" sm="6">
				<v-row>
					<v-col cols="6">
						<v-switch :error-messages="formErrors.is_invisible" :label="$t('component.settings.isInvisibleLabel')" v-model="component.is_invisible" color="primary"></v-switch>
					</v-col>
					<v-col cols="6">
						<v-switch :error-messages="formErrors.is_public" :label="$t('component.settings.isPublicLabel')" v-model="component.is_public" color="primary"></v-switch>
					</v-col>
				</v-row>
				<IconListField :error-messages="formErrors.icon" :placeholder="$t('strategy.settings.iconPlaceholder')" v-model="strategy.icon" :height="226"></IconListField>
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

	props: ['strategy', 'formErrors'],

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

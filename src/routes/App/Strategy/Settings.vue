<template>
	<v-card class="pa-4" tile flat>
		<v-row>
			<v-col cols="12" sm="6" class="py-0">
				<v-text-field :error-messages="formErrors.name" :label="$t('strategy.settings.namePlaceholder')" v-model="strategy.name"></v-text-field>
				<HTMLEditorField :error-messages="formErrors.description" :label="$t('strategy.settings.descPlaceholder')" v-model="strategy.description"></HTMLEditorField>
				<HTMLEditorField :error-messages="formErrors.instructions" :label="$t('strategy.settings.instructionsPlaceholder')" v-model="strategy.instructions"></HTMLEditorField>
			</v-col>
			<v-col cols="12" sm="6" class="py-0">
				<v-row>
					<v-col cols="6" class="py-0">
						<v-checkbox :error-messages="formErrors.is_invisible" :label="$t('strategy.settings.isInvisibleLabel')" v-model="strategy.is_invisible" color="primary"></v-checkbox>
					</v-col>
					<v-col cols="6" class="py-0">
						<v-checkbox :error-messages="formErrors.is_private" :label="$t('strategy.settings.isPrivateLabel')" v-model="strategy.is_private" color="primary"></v-checkbox>
					</v-col>
				</v-row>

				<IconListField :error-messages="formErrors.icon" :label="$t('strategy.settings.iconPlaceholder')" v-model="strategy.icon" :height="226"></IconListField>

				<!--				<v-color-picker :error-messages="formErrors.color" :label="$t('strategy.settings.colorPlaceholder')" v-model="strategy.color"></v-color-picker>-->
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

	data() {
		return {

		}
	}
})
</script>

<style lang="scss" scoped>

</style>

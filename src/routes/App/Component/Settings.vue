<template>
	<v-card color="transparent" flat tile>

		<v-alert type="info" :prominent="!isMobile" border="left" text :icon="!isMobile ? 'mdi-help-circle' : false" class="mx-n4 mt-n4" tile>
			<div class="d-block d-md-flex flex-md-row align-md-center">
				<div style="flex: 1">
					<div v-text="$t('component.settings.explanations')"></div>
				</div>
				<div class="text-center" style="flex: 0">
					<v-btn :class="{ 'ml-0 ml-md-8 mt-4 mt-md-0': true, 'text-wrap d-block w-100': isMobile }" :large="isMobile" @click="$help.open('component-general')">
						<v-icon left>mdi-book-search</v-icon>
						<div v-text="$t('component.settings.readDoc')"></div>
					</v-btn>
				</div>
			</div>
		</v-alert>

		<v-row>
			<v-col cols="12" sm="6" class="py-0">
				<v-text-field :error-messages="formErrors.name" :label="$t('component.settings.namePlaceholder')" v-model="component.name"></v-text-field>
				<v-select :error-messages="formErrors.category" :label="$t('component.settings.categoryPlaceholder')" :items="categories" v-model="component.category"></v-select>
				<HTMLEditorField :error-messages="formErrors.description" :label="$t('component.settings.descPlaceholder')" v-model="component.description"></HTMLEditorField>
				<HTMLEditorField :error-messages="formErrors.instructions" :label="$t('component.settings.instructionsPlaceholder')" v-model="component.instructions"></HTMLEditorField>
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

<!--				<v-color-picker :error-messages="formErrors.color" :label="$t('component.settings.colorPlaceholder')" v-model="component.color"></v-color-picker>-->
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

	computed: {

		isMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		}
	},

	data() {
		return {
            categories: [
				{ text: this.$t('component.categories.general'), value: 'general' },
				{ text: this.$t('component.categories.language'), value: 'language' },
				{ text: this.$t('component.categories.functions'), value: 'functions' },
			],
		}
	}
})
</script>

<style lang="scss" scoped>

</style>

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
						<IconListField :error-messages="formErrors.icon" :label="$t('strategy.settings.iconPlaceholder')" v-model="strategy.icon" />
						<HTMLEditorField :error-messages="formErrors.description" :label="$t('strategy.settings.descPlaceholder')" v-model="strategy.description" hide-details></HTMLEditorField>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" sm="6" class="py-0">
				<v-card class="mb-4" outlined>
					<v-card-title class="d-flex justify-space-between">
						<span v-text="$t('strategy.settings.reminder.title')"></span>
						<ColorPicker v-model="strategy.color" />
					</v-card-title>
					<v-card-text>
						<v-checkbox v-model="allDays" :label="$t('strategy.settings.reminder.allDays')" @change="handleAllDays()" hide-details></v-checkbox>
						<v-row no-gutters>
							<v-col cols="6" md="4" :key="day" v-for="day in days">
								<v-checkbox v-model="strategy.reminder" :value="day" :label="$t('date.' + day)" hide-details></v-checkbox>
							</v-col>
						</v-row>

						<v-divider class="my-8 mb-2"></v-divider>

						<v-row>
							<v-col cols="12" md="6">
								<DateField v-model="strategy.start_date" @input="$event > strategy.end_date ? strategy.end_date = $event : null" :label="$t('strategy.settings.startDate')" clearable hide-details />
							</v-col>
							<v-col cols="12" md="6">
								<DateField :min="strategy.start_date" v-model="strategy.end_date" :label="$t('strategy.settings.endDate')" clearable hide-details />
							</v-col>
						</v-row>

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
import ColorPicker from "../../../components/ColorPicker";
import DateField from "../../../components/DateField";
import moment from "moment";

export default Vue.extend({

	props: ['strategy', 'formErrors'],

	components: { HTMLEditorField, IconListField, ColorPicker, DateField },

	methods: {

		handleAllDays() {
			if (this.allDays) {
				this.checkAllDays();
			} else {
				this.uncheckAllDays();
			}
		},

		updateAllDays() {
			const allChecked = this.strategy.reminder.length === this.days.length;
			this.allDays = allChecked;
		},

		uncheckAllDays() {
			this.strategy.reminder = [];
		},

		checkAllDays() {
			this.uncheckAllDays();
			this.days.forEach(day => this.strategy.reminder.push(day));
		},
	},

	computed: {

		isMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		}
	},

	data() {
		return {
			allDays: false,
			days: [
				'monday',
				'tuesday',
				'wednesday',
				'thursday',
				'friday',
				'saturday',
				'sunday',
			]
		}
	},

	watch: {

		strategy: {
			deep: true,
			handler: function(strategy) {
				this.updateAllDays();
				this.$emit('update:strategy', strategy);
			}
		}
	}
})
</script>

<style lang="scss" scoped>

</style>

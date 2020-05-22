<template>
	<v-form ref="form" v-model="valid" lazy-validation>

		<v-alert v-model="sent" type="success" class="mb-6" transition="scale-transition">
			{{$t('contact.success')}}
		</v-alert>

		<v-text-field solo :light="!inputDark" v-model="data.name" :disabled="disabled" :rules="[rules.required]" :label="$t('contact.name')" autofocus required />
		<v-text-field solo :light="!inputDark" v-model="data.email" :disabled="disabled" :rules="[rules.required, rules.email]" :label="$t('contact.email')" required />
		<v-select solo :light="!inputDark" v-model="data.subject" :disabled="disabled" :items="items" :rules="[rules.required]" :label="$t('contact.subject')" required />

		<v-expand-transition>
			<v-row v-if="data.subject === 'other'">
				<v-col class="shrink py-0 d-flex align-center pb-8 pl-8">
					<v-icon>mdi-chevron-right</v-icon>
				</v-col>
				<v-col class="grow py-0">
					<v-text-field ref="other" solo :light="!inputDark" v-model="data.otherSubject" :disabled="disabled" :rules="[rules.required]" :label="$t('contact.subjectOther')" required />
				</v-col>
			</v-row>
		</v-expand-transition>

		<v-textarea solo :light="!inputDark" v-model="data.message" :disabled="disabled" :label="$t('contact.message')" :rules="[rules.required]" auto-grow></v-textarea>
		<v-checkbox v-model="data.sendCopy" :disabled="disabled" :label="$t('contact.sendCopy')" color="primary" required />

		<v-btn :disabled="!valid || disabled" color="primary" class="mr-4" @click="validate">
			<v-icon left>
				mdi-send
			</v-icon>
			{{$t('contact.send')}}
		</v-btn>
	</v-form>
</template>

<script>
import Vue from 'vue';
import { FormService, Rules } from "@polymind/sdk-js";

export default Vue.extend({

	props: {
	    absolute: {
			type: Boolean,
			default: true
		},
		inputDark: {
			type: Boolean,
			default: false
		}
	},

	created() {
		const subject = this.$route.query.subject;
		if (subject) {
			this.data.subject = this.$t('contact.subjects.' + subject);
		}
	},

	methods: {

		validate () {

			if (this.$refs.form.validate()) {
				this.$root.isLoading = true;
				this.disabled = true;

				let data = this.$deepClone(this.data);
				if (data.subject === 'other') {
				    data.subject = data.otherSubject;
				}

				FormService.send('CONTACT', data).then(response => {
					this.sent = true;
					this.$emit('sent');
				}).catch(error => {
					this.$root.error = error;
					this.disabled = false;
				}).finally(() => {
					this.$root.isLoading = false;
				});
			}
		},
	},

	computed: {

		items() {

			return [
				{ text: this.$t('contact.subjects.invitation'), value: this.$t('contact.subjects.invitation') },
				{ text: this.$t('contact.subjects.issue'), value: this.$t('contact.subjects.issue') },
				{ text: this.$t('contact.subjects.feature'), value: this.$t('contact.subjects.feature') },
				{ text: this.$t('contact.subjects.other'), value: 'other' },
			];
		}
	},

	data() {
		return {
			isLoading: false,
			disabled: false,
			sent: false,
			data: {
				name: null,
				email: null,
				subject: null,
				otherSubject: null,
				message: null,
				sendCopy: false,
			},
			rules: {
				required: value => Rules.required(value) || this.$t('rules.required'),
				email: value => Rules.email(value) || this.$t('rules.email'),
			},
			valid: true,
		}
	},

	watch: {

		'data.subject'(value) {
			if (value === 'other') {
				setTimeout(() => {
					this.$refs.other.$el.querySelector('input').focus();
				});
			}
		}
	}
});
</script>

<style lang="scss" scoped>
	.v-form {
		width: 100%;
	}
</style>

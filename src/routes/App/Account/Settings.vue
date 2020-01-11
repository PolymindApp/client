<template>
	<v-form ref="form" @submit="apply" lazy-validation v-model="form">
		<v-row class="mb-4">
			<v-col cols="12" md="6">

				<h2 class="mb-4">
					<v-icon left>mdi-account-settings</v-icon>
					<span v-text="$t('account.settings.generalSectionTitle')"></span>
				</h2>
				<v-card class="py-4 px-8">
					<v-row>
						<v-col cols="4" class="d-flex align-center">
							<label v-text="$t('account.settings.language')"></label>
						</v-col>
						<v-col>
							<LanguageSwitcher v-model="user.locale" />
						</v-col>
					</v-row>

					<v-row>
						<v-col cols="4" class="d-flex align-center">
							<label v-text="$t('account.settings.externalMsg')"></label>
						</v-col>
						<v-col>
							<v-radio-group mandatory hide-details row class="mt-0" v-model="user.settings.externalMsg">
								<v-radio value="public" color="primary" :label="$t('account.settings.externalMsgPublic')" />
<!--								<v-radio value="friends" color="primary" :label="$t('account.settings.externalMsgFriends')" />-->
								<v-radio value="nobody" color="primary" :label="$t('account.settings.externalMsgNobody')" />
							</v-radio-group>
						</v-col>
					</v-row>

				</v-card>

				<h2 class="mb-4 mt-4">
					<v-icon left>mdi-coffee</v-icon>
					<span v-text="$t('account.settings.ideSectionTitle')"></span>
				</h2>
				<v-card class="py-4 px-8">
					<SettingsDevelopment :user="user" />
				</v-card>
			</v-col>
			<v-col cols="12" md="6">

				<h2 class="mb-4">
					<v-icon left>mdi-bell</v-icon>
					<span v-text="$t('account.settings.notificationSectionTitle')"></span>
				</h2>
				<v-card class="pa-4 px-8">
					<v-switch v-model="user.settings.newNotificationSound" inset :label="$t('account.settings.newNotificationSoundLabel')" color="primary"></v-switch>
					<v-divider></v-divider>
					<v-switch v-model="user.settings.newMessageSound" inset :label="$t('account.settings.newMessageSoundLabel')" color="primary"></v-switch>
				</v-card>
			</v-col>
		</v-row>

		<v-btn type="submit" color="primary" :disabled="!isDifferent" large>
			<v-icon left>mdi-content-save</v-icon>
			{{ $t("account.information.applyChanges") }}
		</v-btn>
	</v-form>
</template>

<script>
    import Vue from 'vue';
    import UserService from "../../../services/UserService";
    import LanguageSwitcher from "../../../components/LanguageSwitcher";
    import CodeEditorField from "../../../components/CodeEditorField";
    import SettingsDevelopment from "./SettingsDevelopment";

    export default Vue.extend({

        name: 'Settings',

        props: ['user', 'isDifferent'],

        components: { LanguageSwitcher, CodeEditorField, SettingsDevelopment },

        mounted() {

        },

        destroyed() {

        },

        methods: {

            apply(event) {

                event.preventDefault();

				this.formErrors = {};
                this.$refs.form.resetValidation();
                this.$root.isLoading = true;
                UserService.update.bind(this)(this.user.id, {
                    settings: this.user.settings,
					locale: this.user.locale,
                })
                    .then(response => {
                        this.$root.isSaved = true;
                        this.$emit('update', response.data);
                    })
                    .catch(error => this.$handleError(this, error))
                    .finally(() => this.$root.isLoading = false);
            },
		},

        computed: {

		},

        data() {
            return {
				form: true,
                formErrors: {},
			};
        }
    });
</script>

<style lang="scss" scoped>

</style>

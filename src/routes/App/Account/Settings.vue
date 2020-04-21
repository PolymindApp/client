<template>
	<v-form :class="{ 'white': isMobile }" ref="form" @submit="apply" lazy-validation v-model="form">
		<v-row class="mb-4">
			<v-col cols="12" md="6">

				<!-- GENERAL -->
				<h2 class="mb-4 mt-3 mt-md-0 title px-4 px-md-0">
					<v-icon left>mdi-account-settings</v-icon>
					<span v-text="$t('account.settings.generalSectionTitle')"></span>
				</h2>
				<v-card class="pa-4 px-md-8" :tile="isMobile" :flat="isMobile">
					<v-row>
						<v-col cols="12" md="4" class="d-flex align-center">
							<label v-text="$t('account.settings.language')"></label>
						</v-col>
						<v-col cols="12" md="8">
							<LanguageSwitcher v-model="user.locale" />
						</v-col>
					</v-row>
<!--					<v-row>
						<v-col cols="12" md="4" class="d-flex align-center">
							<label v-text="$t('account.settings.theme.title')"></label>
						</v-col>
						<v-col cols="12" md="8">
							<v-select :items="themes" v-model="user.settings.theme" outlined hide-details></v-select>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" md="4" class="d-flex align-center">
							<label v-text="$t('account.settings.externalMsg')"></label>
						</v-col>
						<v-col cols="12" md="8">
							<v-radio-group mandatory hide-details row class="mt-0" v-model="user.settings.externalMsg">
								<v-radio value="public" color="primary" :label="$t('account.settings.externalMsgPublic')" />
								<v-radio value="friends" color="primary" :label="$t('account.settings.externalMsgFriends')" />
								<v-radio value="nobody" color="primary" :label="$t('account.settings.externalMsgNobody')" />
							</v-radio-group>
						</v-col>
					</v-row>-->
				</v-card>

				<!-- DEVELOPMENT -->
				<h2 class="mb-4 mt-6 title px-4 px-md-0">
					<v-icon left>mdi-coffee</v-icon>
					<span v-text="$t('account.settings.ideSectionTitle')"></span>
				</h2>
				<v-card class="pa-4 px-md-8" :tile="isMobile" :flat="isMobile">
					<SettingsDevelopment :user="user" />
				</v-card>
			</v-col>

			<v-col cols="12" md="6">

				<!-- NOTIFICATIONS -->
				<h2 class="mb-4 title px-4 px-md-0">
					<v-icon left>mdi-bell</v-icon>
					<span v-text="$t('account.settings.notificationSectionTitle')"></span>
				</h2>
				<v-card class="pa-4 px-md-8" :tile="isMobile" :flat="isMobile">
					<v-switch v-model="user.settings.newNotificationSound" inset :label="$t('account.settings.newNotificationSoundLabel')" color="primary"></v-switch>
					<v-divider></v-divider>
					<v-switch v-model="user.settings.newMessageSound" inset :label="$t('account.settings.newMessageSoundLabel')" color="primary"></v-switch>
				</v-card>
			</v-col>
		</v-row>

		<div class="pa-4 pa-md-0">
			<v-btn class="w-100 w-md-auto" type="submit" color="primary" :disabled="!isDifferent" large>
				<v-icon left>mdi-content-save</v-icon>
				{{ $t("account.information.applyChanges") }}
			</v-btn>
		</div>
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

        	isMobile() {
        		return this.$vuetify.breakpoint.smAndDown;
			},
		},

        data() {
            return {
				form: true,
                formErrors: {},
				themes: [
					{ text: this.$t('account.settings.theme.dark'), value: 'dark', },
					{ text: this.$t('account.settings.theme.light'), value: 'light', },
				],
			};
        }
    });
</script>

<style lang="scss" scoped>

</style>

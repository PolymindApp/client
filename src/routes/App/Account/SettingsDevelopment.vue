<template>
    <v-card color="transparent" :disabled="!user.settings.developer" tile flat>
		<v-row>
			<v-col cols="12" md="4" class="d-flex align-center">
				<label v-text="$t('account.settings.theme.title')"></label>
			</v-col>
			<v-col cols="12" md="8">
				<v-select :items="themes" v-model="user.settings.development.theme" outlined hide-details></v-select>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" md="4" class="d-flex align-center">
				<label v-text="$t('account.settings.fontSize')"></label>
			</v-col>
			<v-col cols="12" md="8">
				<v-text-field v-model="user.settings.development.fontSize" type="number" outlined hide-details></v-text-field>
			</v-col>
		</v-row>
		<!--					NOT A GOOD IDEA, BETTER STICK TO 4 BY DEFAULT TO KEEP STANDARDS-->
		<!--					<v-row>-->
		<!--						<v-col cols="4" class="d-flex align-center">-->
		<!--							<label v-text="$t('account.settings.tabSize')"></label>-->
		<!--						</v-col>-->
		<!--						<v-col>-->
		<!--							<v-text-field v-model="user.settings.development.tabSize" type="number" outlined hide-details></v-text-field>-->
		<!--						</v-col>-->
		<!--					</v-row>-->
		<v-row>
			<v-col cols="12" md="4" class="d-flex align-center">
				<label v-text="$t('account.settings.showLines')"></label>
			</v-col>
			<v-col cols="12" md="8">
				<v-radio-group mandatory hide-details row class="mt-0" v-model="user.settings.development.showLines">
					<v-radio :value="true" color="primary" :label="$t('account.settings.yes')" />
					<v-radio :value="false" color="primary" :label="$t('account.settings.no')" />
				</v-radio-group>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'Settings.ide',

        props: ['user'],

        components: {},

        mounted() {

        },

        destroyed() {

        },

        methods: {

		},

        computed: {

		},

        data() {
            return {
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

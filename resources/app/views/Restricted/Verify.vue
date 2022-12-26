<template>
	<v-sheet ref="form" :disabled="loading">

        <template v-if="skeleton">
            <v-progress-circular color="primary" indeterminate></v-progress-circular>
        </template>
        <transition-group v-else name="expand-transition">
            <v-alert key="alreadyVerified" v-if="alreadyVerified" class="text-left" type="warning" prominent>
                <span v-text="$t('registerVerify.alreadyVerified')"></span>
            </v-alert>
            <v-alert key="success" v-else-if="success" class="text-left" type="info" prominent>
                <span v-text="$t('registerVerify.success')"></span>
            </v-alert>
            <v-alert key="error" v-else class="text-left" type="error" prominent>
                <span v-text="$t('registerVerify.error')"></span>
            </v-alert>
        </transition-group>

		<v-btn class="mt-8" tabindex="6" block text :to="{ name: 'login' }">
			<v-icon :left="!$vuetify.rtl" :right="$vuetify.rtl">mdi-arrow-left</v-icon>
			<span v-text="$t('btn.back')"></span>
		</v-btn>
	</v-sheet>
</template>

<script>
import Vue from 'vue'
import Services from '@/utils/Services';
import UserModel from '@/models/UserModel'
import EventBus from "@/utils/EventBus";

export default Vue.extend({
	name: 'Verify',

	data: () => ({
        skeleton: true,
		loading: false,
		success: false,
        alreadyVerified: false,
	}),

	methods: {
		verify(signature) {
            this.loading = true;
            Services.verifyEmail(signature)
                .then(response => {
                    this.$store.commit('user', new UserModel(response.user));
                    EventBus.publish('RENDER_APP');
                    this.success = true;
                })
                .catch(reason => {
                    if (reason.message === 'ALREADY_VERIFIED') {
                        this.alreadyVerified = true;
                    } else {
                        this.$handleError(reason, this.formErrors, false);
                    }
                })
                .finally(() => {
                    this.loading = false;
                    this.skeleton = false;
                });
        }
	},

	created() {
		this.verify(this.$route.query.signature);
	},
})
</script>

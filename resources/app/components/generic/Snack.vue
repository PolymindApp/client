<template>
	<v-snackbar v-model="visible" v-bind="$attrs" v-on="$listeners">
        <v-icon v-if="icon" v-text="icon" :left="!$vuetify.rtl" :right="$vuetify.rtl"></v-icon>
        <span v-text="body" class="mr-4"></span>

        <template #action="{ attrs }">
            <v-btn icon @click="visible = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
	</v-snackbar>
</template>

<script>
export default {
	name: "Snack",

	props: {
		value: {
			type: Boolean,
            default: false,
		},
		icon: {
			type: String,
            default: null,
		},
		body: {
            required: true,
			type: String,
            default: null,
		},
	},

    data: () => ({
        visible: false,
    }),

    watch: {
        visible(value) {
            if (!value) {
                this.$emit('input', value);
            }
        },
        value(value) {
            if (value) {
                this.visible = true;
            }
        },
    },
}
</script>

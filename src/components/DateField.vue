<template>
	<v-dialog ref="dialog" v-model="menu" :return-value="date" persistent width="290px">
		<template v-slot:activator="{ on }">
			<v-text-field v-model="date" prepend-icon="mdi-calendar-month-outline" readonly v-on="on" v-bind="$attrs"></v-text-field>
		</template>
		<v-date-picker v-model="newDate" :min="min" :max="max" color="primary" scrollable>
			<v-spacer></v-spacer>
			<v-btn text color="primary" @click="apply()" v-text="$t('modal.apply')"></v-btn>
			<v-btn text @click="menu = false" v-text="$t('modal.cancel')"></v-btn>
		</v-date-picker>
	</v-dialog>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'DateField',

        props: ['value', 'min', 'max'],

        components: {},

        mounted() {

        },

        destroyed() {

        },

        methods: {

        	apply() {
        		this.update();
        		this.menu = false;
			},

			update() {
				this.$emit('input', this.newDate);
			}

		},

        computed: {

		},

		data() {
			return {
				menu: false,
				newDate: this.value,
				date: this.value,
			};
		},

		watch: {

			value(value) {
				this.date = value;
			},

        	menu(value) {
        		if (value) {
        			this.newDate = this.value;
				}
			}
		}
    });
</script>

<style lang="scss" scoped>

</style>

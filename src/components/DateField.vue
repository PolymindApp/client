<template>
	<v-dialog ref="dialog" v-model="menu" :return-value="date" persistent :width="width">
		<template v-slot:activator="{ on }">
			<v-text-field v-model="date" readonly v-on="on" v-bind="$attrs"></v-text-field>
		</template>
		<v-date-picker v-model="newDate" :min="min" :max="max" color="primary" :range="range" full-width scrollable>
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

		props: {
        	value: null,
			range: null,
			min: {
				type: String,
				default: null
			},
			max: {
				type: String,
				default: null
			},
			width: {
        		type: String,
        		default: '290px'
			}
		},

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

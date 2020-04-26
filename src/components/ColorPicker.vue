<template>
	<v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
		<template v-slot:activator="{ on }">
			<v-btn :color="color" v-on="on" icon>
				<v-icon>mdi-circle</v-icon>
			</v-btn>
		</template>
		<v-card>
			<v-color-picker @input="update()" v-model="color" mode="hexa" show-swatches hide-inputs hide-canvas></v-color-picker>
		</v-card>
	</v-menu>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'ColorPicker',

        props: ['value'],

        components: {},

        mounted() {

        },

        destroyed() {

        },

        methods: {

        	update() {
        		this.$emit('input', this.color);
			}
		},

        computed: {

		},

        data() {
            return {
				menu: false,
				color: this.value,
			};
        },

		watch: {
        	value(value) {
        		this.color = value;
			}
		}
    });
</script>

<style lang="scss" scoped>

</style>

<template>
	<v-menu offset-y>
		<template v-slot:activator="{ on }">
			<v-btn :disabled="comments.length < 2" v-on="on" text>
				<v-icon left>mdi-sort-variant</v-icon>
				<span v-text="sortByItems[currentSortBy].text"></span>
			</v-btn>
		</template>
		<v-list>
			<v-list-item-group v-model="currentSortBy" color="primary">
				<v-list-item v-for="(item, index) in sortByItems" :key="index" @click="$emit('sortBy', item.value)">
					<v-list-item-title>{{ item.text }}</v-list-item-title>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-menu>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'Sorting',

        props: ['comments', 'sortBy'],

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
				currentSortBy: 0,
				sortByItems: [
					{ text: this.$t('sortBy.mostRecent'), value: '-id' },
					{ text: this.$t('sortBy.oldest'), value: 'id' },
					{ text: this.$t('sortBy.thumbsUp'), value: '-comment_thumb_up' },
					{ text: this.$t('sortBy.thumbsDown'), value: '-comment_thumb_down' },
				],
			};
        }
    });
</script>

<style lang="scss" scoped>

</style>

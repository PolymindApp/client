<template>
	<v-navigation-drawer fixed right temporary touchless v-model="sidebar.opened" width="450" color="transparent" style="z-index: 7">
		<v-card tile class="fill-height" color="grey lighten-3">
			<Comments class="d-flex flex-column fill-height" v-if="sidebar.opened" ref="comments" :collection="collection" :id="id" autofocus>
				<template slot="empty">
					<EmptyView :title="$t('comment.emptyTitle')" :desc="$t('comment.emptyDesc')" />
				</template>
			</Comments>
		</v-card>
	</v-navigation-drawer>
</template>

<script>
    import Vue from 'vue';
    import Comments from "./Comments";
	import EmptyView from "./EmptyView";

    export default Vue.extend({

        name: 'CommentDrawer',

        components: { Comments, EmptyView },

		methods: {

			open(id, collection) {
				this.id = id;
				this.collection = collection;
				this.sidebar.opened = true;
			},

			close() {
				this.sidebar.opened = false;
			},
		},

        data() {
            return {
            	id: null,
            	collection: null,
                sidebar: {
                    opened: false,
				},
			};
        }
    });
</script>

<style lang="scss" scoped>

</style>

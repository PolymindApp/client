<template>
	<v-dialog v-model="visible" fullscreen hide-overlay transition="dialog-bottom-transition">
		<v-card color="transparent" class="d-flex flex-column fill-height grey lighten-2">
			<v-toolbar style="flex: 0" dark color="primary" class="default-gradient">
				<v-icon left>mdi-book</v-icon>
				<v-toolbar-title v-text="$t('help.title')"></v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn icon dark @click="$root.help.visible = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
<!--				<v-toolbar-items>-->
<!--					<v-btn dark text @click="$root.help.visible = false" v-text="$t('help.close')"></v-btn>-->
<!--				</v-toolbar-items>-->
			</v-toolbar>
			<v-row style="flex: 1" no-gutters>
				<v-col cols="6" md="3" class="pa-4 inner-shadow">
					<v-treeview
						v-model="tree"
						:open="open"
						:active.sync="active"
						:items="items"
						item-key="name"
						rounded
						activatable
						open-on-click
						return-object
					>
						<template v-slot:prepend="{ item, open }">
							<v-icon v-if="item.type === 'cat'">
								{{ open ? 'mdi-folder-open' : 'mdi-folder' }}
							</v-icon>
							<v-icon v-else>
								{{ types[item.type] }}
							</v-icon>
						</template>
					</v-treeview>
				</v-col>
				<v-col cols="6" md="9" class="white d-flex">
					<v-scroll-y-transition mode="out-in">
						<v-card v-if="active.length > 0" :key="active[0].name" color="transparent" tile flat class="pa-8 align-self-start">
							{{ active[0].content }}
						</v-card>
						<v-card v-else color="transparent" tile flat class="pa-8 d-flex align-center flex-column align-self-center text-center w-100">
							<img src="../assets/images/logo-color.svg" height="128" width="128" />
							<div class="very-limited-content">
								<h2 class="display-1" v-text="$t('help.noSelectTitle')"></h2>
								<p class="overline" v-text="$t('help.noSelectDesc')"></p>
							</div>
						</v-card>
					</v-scroll-y-transition>
				</v-col>
			</v-row>
		</v-card>
	</v-dialog>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'Help',

        props: ['visible'],

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
                open: ['Components'],
                tree: [],
                active: [],
                types: {
                    doc: 'mdi-file-outline',
				},
                items: [
					{ name: 'Components', type: 'cat', children: [
                            { name: 'Sous fichier', type: 'doc', content: '123' }
						]},
					{ name: 'Petit fichier', type: 'doc', content: 'abc' }
				]
			};
        }
    });
</script>

<style lang="scss" scoped>
	.inner-shadow {
		box-shadow: inset -1rem 0 0.5rem -1rem rgba(0, 0, 0, 0.25);
	}
</style>

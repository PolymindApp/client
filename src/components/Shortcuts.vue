<template>
	<div @click="$root.shortcuts.visible = false">
		<v-overlay class="shortcuts" :value="visible" opacity="0.7" z-index="10">
			<v-container :class="{ 'fill-height': true, 'small': columnLength <= 1 }">

				<v-btn class="close" icon @click="$root.shortcuts.visible = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>

				<v-row class="ma-auto">
					<v-col cols="12" :md="columnLength <= 1 ? 12 : 6" :key="groupKey" v-for="(group, groupKey) in groups">
						<h2 class="title" v-text="$t('shortcuts.groupTitles.' + groupKey)"></h2>
						<v-card class="mt-4">
							<template v-for="(shortcut, index) in group">
								<v-divider v-if="index !== 0" :key="index + '_sep'"></v-divider>
								<v-list-item :key="index">
									<v-row>
										<v-col cols="6" md="5" class="d-flex align-center justify-center">
											<template v-for="(key, keyIdx) in shortcut.keys">
												<v-chip :key="keyIdx" label>
													<span>{{ key.toUpperCase() }}</span>
												</v-chip>
												<v-icon :key="keyIdx + '_plus'" v-if="keyIdx < shortcut.keys.length - 1" class="mx-2">mdi-plus</v-icon>
											</template>
										</v-col>
										<v-col cols="6" md="7">
											<v-list-item-content>
												<v-list-item-title v-text="shortcut.title"></v-list-item-title>
												<v-list-item-subtitle v-text="shortcut.desc"></v-list-item-subtitle>
											</v-list-item-content>
										</v-col>
									</v-row>
								</v-list-item>
							</template>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</v-overlay>
	</div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'Shortcuts',

        props: ['visible'],

        components: {},

        mounted() {

            this.groups = this.getGroups();
        },

        destroyed() {

        },

        methods: {

            getGroups() {

                let items = {};
                for (let key in this.$shortcuts.list) {
                    const shortcuts = this.$shortcuts.list[key];
                    shortcuts.forEach(shortcut => {

                        if (!items[shortcut.group]) {
                            items[shortcut.group] = [];
						}

                        items[shortcut.group].push({
                            title: shortcut.name,
                            desc: shortcut.desc,
                            keys: typeof shortcut.keys === 'string' ? [shortcut.keys] : shortcut.keys,
                        });
					});
                }

                return items;
            },
		},

        computed: {

            columnLength() {
                return Object.keys(this.groups).length;
			}
		},

        data() {
            return {
                groups: {},
			};
        },

		watch: {
            visible(visible) {
                if (visible) {
                	this.groups = this.getGroups();
				}
			}
		}
    });
</script>

<style lang="scss" scoped>

	.small {
		width: 40rem;
	}

	.shortcuts {

		.close {
			top: 1rem;
			right: 1rem;
			position: absolute;
		}

		& >>> .v-overlay__scrim {
			position: fixed;
		}

		& >>> .v-overlay__content {
			width: 100%;
			height: 100%;
		}
	}
</style>

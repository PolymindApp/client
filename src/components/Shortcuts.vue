<template>
	<v-overlay class="shortcuts" :value="visible" absolute>
		<v-container class="fill-height">

			<v-btn class="close" icon @click="$root.shortcuts.visible = false">
				<v-icon>mdi-close</v-icon>
			</v-btn>

			<v-row class=" ma-auto">
				<v-col cols="12" md="6">
					<h2 class="title" v-text="$t('shortcuts.availableTitle')"></h2>
					<v-card class="mt-4">
						<template v-for="(shortcut, index) in shortcuts">
							<v-divider v-if="index !== 0" :key="index + '_sep'"></v-divider>
							<v-list-item :key="index">
								<v-row>
									<v-col cols="6" md="5" class="d-flex align-center justify-center">
										<template v-for="(key, keyIdx) in shortcut.keys">
											<v-chip :key="keyIdx" label>
												<span>{{ key.toUpperCase() }}</span>
											</v-chip>
											<v-icon :key="keyIdx + '_plus'" v-if="keyIdx <= shortcuts.keys.length" class="mx-2">mdi-plus</v-icon>
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
				<v-col cols="12" md="6">
					<h2 class="title" v-text="$t('shortcuts.generalTitle')"></h2>
					<v-card class="mt-4">
						<template v-for="(shortcut, index) in shortcuts">
							<v-divider v-if="index !== 0" :key="index + '_sep'"></v-divider>
							<v-list-item :key="index">
								<v-row>
									<v-col cols="6" md="5" class="d-flex align-center justify-center">
										<template v-for="(key, keyIdx) in shortcut.keys">
											<v-chip :key="keyIdx" label>
												<span>{{ key.toUpperCase() }}</span>
											</v-chip>
											<v-icon :key="keyIdx + '_plus'" v-if="keyIdx <= shortcuts.keys.length" class="mx-2">mdi-plus</v-icon>
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
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'Shortcuts',

        props: ['visible'],

        components: {},

        mounted() {

        },

        destroyed() {

        },

        methods: {

		},

        computed: {

            shortcuts() {

                return [
                    { title: 'Quit', desc: 'Exit the app', keys: ['ctrl', 'a'] },
                    { title: 'Open', desc: 'Exit the app', keys: ['ctrl', 'n'] },
                    { title: 'Allow', desc: 'Exit the app', keys: ['ctrl', 'a'] },
                    { title: 'Quit', desc: 'Exit the app', keys: ['ctrl', 'a'] },
                ];
            },
		},

        data() {
            return {

			};
        }
    });
</script>

<style lang="scss" scoped>

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

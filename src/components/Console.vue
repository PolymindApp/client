<template>
	<v-card :dark="isDark" :class="{ 'main-container fill-height d-flex flex-column': true, 'grey lighten-4': !isDark }" ref="container" tile flat>
		<v-toolbar class="no-select" style="flex: 0" dense>

			<v-text-field prepend-inner-icon="mdi-chevron-right" class="command-input pa-0 ma-0 ml-n2" v-model="command" :label="$t('components.console.runCommand')" @keydown="handleKeyDown" @update="run()"autocomplete="off" clearable :outlined="!isDark" :solo-inverted="isDark" :light="!isDark" dense hide-details></v-text-field>

			<v-spacer></v-spacer>

			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn @click="toggleFilter('log')" v-on="on" :disabled="counts.log === 0" :color="filters.by === 'log' ? 'primary' : null" small icon>
						<v-badge :value="counts.log" :content="counts.log" color="grey" overlap>
							<v-icon small>mdi-console</v-icon>
						</v-badge>
					</v-btn>
				</template>
				<span v-text="$tc('components.console.total.log', counts.log, { total: counts.log })"></span>
			</v-tooltip>
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn @click="toggleFilter('error')" v-on="on" :disabled="counts.error === 0" :color="filters.by === 'error' ? 'primary' : null" class="ml-4" small icon>
						<v-badge :value="counts.error" :content="counts.error" color="error" overlap>
							<v-icon small>mdi-close</v-icon>
						</v-badge>
					</v-btn>
				</template>
				<span v-text="$tc('components.console.total.error', counts.error, { total: counts.error })"></span>
			</v-tooltip>
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn @click="toggleFilter('warning')" v-on="on" :disabled="counts.warning === 0" :color="filters.by === 'warning' ? 'primary' : null" class="ml-4" small icon>
						<v-badge :value="counts.warning" :content="counts.warning" color="warning" overlap>
							<v-icon small>mdi-alert</v-icon>
						</v-badge>
					</v-btn>
				</template>
				<span v-text="$tc('components.console.total.warning', counts.warning, { total: counts.warning })"></span>
			</v-tooltip>
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn @click="toggleFilter('info')" v-on="on" :disabled="counts.info === 0" :color="filters.by === 'info' ? 'primary' : null" class="ml-4" small icon>
						<v-badge :value="counts.info" :content="counts.info" color="primary" overlap>
							<v-icon small>mdi-information-outline</v-icon>
						</v-badge>
					</v-btn>
				</template>
				<span v-text="$tc('components.console.total.info', counts.info, { total: counts.info })"></span>
			</v-tooltip>

			<v-spacer></v-spacer>

			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn @click="clear()" v-on="on" :disabled="value.length === 0" small icon>
						<v-icon small>mdi-delete-sweep-outline</v-icon>
					</v-btn>
				</template>
				<span v-text="$t('components.console.clear')"></span>
			</v-tooltip>
		</v-toolbar>

		<v-fade-transition leave-absolute>
			<EmptyView style="flex: 1" :title="$t('components.console.emptyTitle')" :desc="$t('components.console.emptyDesc')" :image="false" v-if="filteredLogs.length === 0" />
		</v-fade-transition>

		<div class="pa-2 console-container scrollable" ref="scrollable" style="flex: 1" v-if="filteredLogs.length > 0">
			<v-slide-x-transition group>
				<div :key="index" v-for="(item, index) in filteredLogs">
					<ConsoleItem :dark="isDark" :value="item" />
				</div>
			</v-slide-x-transition>
		</div>
	</v-card>
</template>

<script>
import Vue from 'vue';
import EmptyView from "./EmptyView";
import ConsoleItem from "./Console/Item";

export default Vue.extend({

	props: {
		value: {
			type: Array,
			default: []
		},
		color: {
			type: String,
		},
		reference: {
			type: Object,
			default: () => console,
		},
	},

	components: { EmptyView, ConsoleItem },

	methods: {

		handleKeyDown(event) {

			let newIndex = this.commandHistoryIndex;
			switch (event.code) {
				case 'ArrowUp':
					newIndex--;
					if (newIndex < 0) {
						newIndex = 0;
					}
					if (newIndex !== this.commandHistoryIndex) {

						if (this.commandHistoryIndex === this.commandHistory.length) {
							this.memoryCommand = this.command;
						}

						this.command = this.commandHistory[newIndex];
						this.commandHistoryIndex = newIndex;
					}

					event.preventDefault();
					event.stopPropagation();
					break;
				case 'ArrowDown':
					newIndex++;
					if (newIndex > this.commandHistory.length - 1) {
						this.commandHistoryIndex = this.commandHistory.length;
						this.command = this.memoryCommand;
						this.memoryCommand = null;
					} else if (newIndex !== this.commandHistoryIndex) {
						this.command = this.commandHistory[newIndex];
						this.commandHistoryIndex = newIndex;
					}

					event.preventDefault();
					event.stopPropagation();
					break;
				case 'Enter':
					this.run();
					break;
			}
		},

		toggleFilter(by) {
			this.filters.by = this.filters.by === by ? null : by;
			setTimeout(() => {
				this.goDown();
			});
		},

		goDown() {
			if (this.$refs.scrollable) {
				this.$refs.scrollable.scrollTop = this.$refs.scrollable.scrollHeight;
			}
		},

		clear() {
			this.$emit('clear');
		},

		run() {

			const trimmedCommand = (this.command || '').trim();
			if (this.command === null || trimmedCommand === '') {
				return;
			}

			this.$emit('command', trimmedCommand);
			this.commandHistory.push(trimmedCommand);
			this.commandHistoryIndex = this.commandHistory.length;
			this.command = null;

			if (this.commandHistory.length > 100) {
				this.commandHistory.splice(0, this.commandHistory.length - 100);
			}
		}
	},

	computed: {

		isDark() {
			return this.$attrs.dark !== false && this.$attrs.dark !== undefined;
		},

		filteredLogs() {
			let logs = [];
			this.value.forEach(value => {
				if (
					this.filters.by === null
					|| (value.error && this.filters.by === 'error')
					|| (value.warning && this.filters.by === 'warning')
					|| (value.info && this.filters.by === 'info')
					|| (value.log && this.filters.by === 'log')
				) {
					logs.push(value);
				}
			})
			return logs;
		},

		counts() {
			const counts = {
				log: 0,
				error: 0,
				warning: 0,
				info: 0,
			};
			this.value.forEach(value => {
				if (value.error) {
					counts.error++;
				} else if (value.info) {
					counts.info++;
				} else if (value.warning) {
					counts.warning++;
				} else {
					counts.log++;
				}
			});
			return counts;
		}
	},

	data() {
		return {
			commandHistory: [],
			commandHistoryIndex: 0,
			command: null,
			memoryCommand: null,
			filters: {
				by: null,
			},
		};
	},

	watch: {
		value() {
			setTimeout(() => {
				this.goDown();
			});
		}
	}
});
</script>

<style lang="scss" scoped>

	.main-container.theme--dark {

		.command-input:not(.v-input--is-focused) ::v-deep .v-input__slot {
			background: rgba(0, 0, 0, 0.333) !important;
		}
		.command-input ::v-deep i,
		.command-input ::v-deep label {
			color: rgba(255, 255, 255, 0.5);
		}
	}
</style>

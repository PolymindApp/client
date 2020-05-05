<template>
	<div class="d-flex flex-column fill-height">
		<v-sheet class="d-flex pa-4 scrollable-x no-select" style="flex: 0; min-height: 18rem">
			<draggable v-model="assemblies" v-bind="dragOptions" class="d-flex" @start="dragStart()" @end="dragEnd()">
				<template v-for="(assembly, assemblyIdx) in assemblies">
					<div :key="assembly.guid" class="d-flex">

						<!-- ASSEMBLY CARD -->
						<v-card @mousedown="select(assemblyIdx)" :min-width="minWidth" class="pa-4 text-center fill-height d-flex align-center justify-center" v-bind="getAttributes(assembly, assemblyIdx)">
							<div class="absolute d-flex align-center" style="right: 0.25rem; top: 0.25rem">

								<!-- WARNING -->
								<v-tooltip color="secondary" bottom>
									<template v-slot:activator="{ on }">
										<v-icon v-show="!isValid(assembly)" color="error" v-on="on">mdi-alert-outline</v-icon>
									</template>
									<span>{{$t('strategy.assembly.warningTooltip')}}</span>
								</v-tooltip>

								<!-- TEST -->
								<v-tooltip bottom>
									<template v-slot:activator="{ on }">
										<v-btn v-show="isValid(assembly)" class="ml-2" @mousedown.stop="test(assembly)" :loading="linkLoading[assembly.guid]" target="_blank" v-on="on" icon>
											<v-icon>mdi-play</v-icon>
										</v-btn>
									</template>
									<span>{{$t('strategy.assembly.testTooltip')}}</span>
								</v-tooltip>

								<!-- MORE ... -->
								<v-menu transition="slide-y-transition" left bottom>
									<template v-slot:activator="{ on: menu }">
										<v-tooltip bottom>
											<template v-slot:activator="{ on: tooltip }">
												<v-btn class="ml-2" v-on="{ ...tooltip, ...menu }" @mousedown="$event.stopPropagation()" icon>
													<v-icon>mdi-dots-vertical</v-icon>
												</v-btn>
											</template>
											<span>{{$t('strategy.assembly.options.title')}}</span>
										</v-tooltip>
									</template>
									<v-list>
										<v-list-item @click="remove(assemblyIdx)">
											<v-icon left>mdi-close</v-icon>
											<v-list-item-title>{{$t('strategy.assembly.options.remove')}}</v-list-item-title>
										</v-list-item>
									</v-list>
								</v-menu>
							</div>

							<!-- CONTENT -->
							<div>
								<div class="mb-2">
									<v-icon :class="assemblyIdx === selectedIdx ? null : 'primary--text'" v-if="assembly.component" size="64">{{ getComponent(assembly.component).icon }}</v-icon>
									<v-icon v-else size="64">mdi-selection-ellipse mdi-dark mdi-inactive</v-icon>
								</div>

								<div class="title">
									<span :class="assemblyIdx === selectedIdx ? null : 'primary--text'" v-if="assembly.name" v-text="assembly.name"></span>
									<span :class="assemblyIdx === selectedIdx ? null : 'primary--text'" v-else-if="assembly.component" v-text="(getComponent(assembly.component) || {}).name"></span>
									<span v-else v-text="$t('strategy.assembly.noComponent')"></span>
								</div>

								<div class="">
									<span v-if="assembly.dataset" v-text="(getDataset(assembly.dataset) || {}).name"></span>
									<span v-else v-text="$t('strategy.assembly.noDataset')"></span>
								</div>

								<div class="mt-4 overline">
									<span :class="assemblyIdx === selectedIdx ? null : 'primary--text'" v-if="assembly.duration" v-text="$t('strategy.assembly.duration', { duration: assembly.duration })"></span>
									<span v-else v-text="$t('strategy.assembly.noDuration')"></span>
								</div>
							</div>
						</v-card>

						<!-- NEXT ICON -->
						<div :key="'_next' + assemblyIdx" class="d-flex align-center justify-center mx-2">
							<v-icon x-large>mdi-chevron-right</v-icon>
						</div>
					</div>
				</template>
			</draggable>

			<!-- ADD NEW ASSEMBLY BUTTON -->
			<v-card @click="add()" class="pa-4 text-center d-flex align-center justify-center grey lighten-4" :min-width="minWidth" style="border-style: dashed; border-radius: 1.5rem" outlined>
				<v-icon x-large>mdi-plus</v-icon>
			</v-card>

			<!-- HACK TO GIVE PADDING-RIGHT IN HORIZONTAL SCROLLING -->
			<div class="pl-4">
				<span></span>
			</div>
		</v-sheet>

		<div class="pa-4" style="flex: 1">

			<EmptyView v-if="assemblies.length === 0" :title="$t('strategy.assembly.emptyTitle')" :desc="$t('strategy.assembly.emptyDesc')" />
			<EmptyView v-else-if="selected === null" :title="$t('strategy.assembly.emptySelectionTitle')" :desc="$t('strategy.assembly.emptySelectionDesc')" />

			<v-row class="fill-height" v-else>

				<!-- ASSEMBLY CONFIGURATION -->
				<v-col cols="12" md="4">
					<v-card class="fill-height">
						<v-card-title class="primary--text">{{ $t('strategy.assembly.general.title') }}</v-card-title>
						<v-card-text>

							<!-- NAME -->
							<v-text-field v-model="selected.name" :label="$t('strategy.assembly.general.name')"></v-text-field>

							<!-- COMPONENT -->
							<v-select v-model="selected.component" :error="!getComponent(selected.component)" :label="$t('strategy.assembly.general.component')" item-value="id" item-text="name" :items="components">
								<template v-slot:item="props">
									<div class="d-flex align-center">
										<v-icon left>{{ props.item.icon }}</v-icon>
										<span v-text="props.item.name"></span>
									</div>
								</template>
							</v-select>

							<!-- DATASET -->
							<v-select v-model="selected.dataset" :error="!getDataset(selected.dataset)" :label="$t('strategy.assembly.general.dataset')" item-value="id" item-text="name" :items="datasets"></v-select>

							<!-- DURATION -->
							<v-row>
								<v-col>
									<v-slider v-model="selected.duration" :label="$t('strategy.assembly.general.duration')" min="0" max="60" step="5" thumb-label hide-details></v-slider>
								</v-col>
								<v-col class="shrink text-no-wrap d-flex align-center">
									<span v-if="selected.duration > 0" v-text="$t('strategy.assembly.duration', { duration: selected.duration })"></span>
									<span v-else v-text="$t('strategy.assembly.noDuration')"></span>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>

				<!-- COMPONENT PARAMETERS -->
				<v-col cols="12" md="4">
					<v-card class="fill-height d-flex flex-column" :disabled="!parameters">
						<EmptyView v-if="!parameters" :title="$t('strategy.assembly.component.emptyTitle')" :desc="$t('strategy.assembly.component.emptyDesc')" />
						<template v-else>
							<v-card-title class="primary--text">{{ $t('strategy.assembly.component.title') }}</v-card-title>
							<v-card-text style="flex: 1">
								<EmptyView v-if="parameters.component.parameters.length === 0" :title="$t('strategy.assembly.component.noParameterTitle')" icon="mdi-check-circle" color="success" :size="64" :desc="$t('strategy.assembly.component.noParameterDesc')" />
								<ComponentParameters v-else v-model="selected.parameters.component" :parameters="parameters.component.parameters" type="component" />
							</v-card-text>
						</template>
					</v-card>
				</v-col>

				<!-- DATASET PARAMETERS -->
				<v-col cols="12" md="4">
					<v-card class="fill-height d-flex flex-column" :disabled="!parameters || !columns">
						<EmptyView v-if="!parameters || !columns" :title="$t('strategy.assembly.dataset.emptyTitle')" :desc="$t('strategy.assembly.dataset.emptyDesc')" />
						<template v-else>
							<v-card-title class="primary--text">{{ $t('strategy.assembly.dataset.title') }}</v-card-title>
							<v-card-text style="flex: 1">
								<EmptyView v-if="parameters.dataset.parameters.length === 0" :title="$t('strategy.assembly.dataset.noParameterTitle')" icon="mdi-check-circle" color="success" :size="64" :desc="$t('strategy.assembly.dataset.noParameterDesc')" />
								<ComponentParameters v-else v-model="selected.parameters.dataset" :parameters="parameters.dataset.parameters" type="dataset" :columns="columns" />
							</v-card-text>
						</template>
					</v-card>
				</v-col>
			</v-row>
		</div>
	</div>
</template>

<script>
    import Vue from 'vue';
	import EmptyView from "../../../components/EmptyView";
	import draggable from "vuedraggable";
	import {StrategyAssembly, ComponentService, DatasetService, Hash, LinkService} from "@polymind/sdk-js";
	import ComponentParameters from "../../../components/ComponentParameters";

    export default Vue.extend({

        name: 'Assembly',

        props: ['strategy', 'components', 'datasets'],

        components: { EmptyView, draggable, ComponentParameters },

        created() {
			this.init();
        },

        destroyed() {

        },

        methods: {

        	init() {
        		this.selected = null;
        		this.selectedIdx = null;

				if (this.assemblies.length > 0) {
					this.select(0);
				}

				this.updateParameters();
				this.$forceUpdate();
			},

			add(assembly) {
        		const newAssembly = new StrategyAssembly();
				this.assemblies.push(newAssembly);

				this.select(this.assemblies.indexOf(newAssembly));
			},

			select(index) {
				this.selectedIdx = index;
				this.selected = this.assemblies[this.selectedIdx];
			},

			updateParameters() {

				this.parameters = null;
				this.columns = null;

				const component = this.components.find(component => this.selected.component === component.id);
				if (component) {
					this.parameters = component.compiled_parameters;
				}
				const dataset = this.datasets.find(dataset => this.selected.dataset === dataset.id);
				if (dataset) {
					this.columns = dataset.columns;
				}

				this.component = component;
				this.dataset = dataset;
			},

			remove(index) {
				this.assemblies.splice(index, 1);

				const maxIndex = this.assemblies.length - 1;
				if (this.selectedIdx > maxIndex) {
					this.select(maxIndex);
				}
			},

			getAttributes(assembly, index) {
        		return {
        			color: index === this.selectedIdx ? 'primary' : 'white',
        			dark: index === this.selectedIdx,
				};
			},

			isValid(assembly) {
        		return assembly.isValid(this.getComponent(assembly.component), this.getDataset(assembly.dataset));
			},

			getComponent(id) {
				return this.components.find(component => component.id === id);
			},

			getDataset(id) {
				return this.datasets.find(dataset => dataset.id === id);
			},

			dragStart() {

			},

			dragEnd() {
				this.select(this.assemblies.indexOf(this.selected));
			},

			test(assembly) {

				const testUri = this.playerHost + '/assembly/' + assembly.guid + '/test';

				this.linkLoading[assembly.guid] = true;
				LinkService.generate('TEST_ASSEMBLY', assembly)
						.then(link => {
							this.linkLoading[assembly.guid] = false;
							this.$forceUpdate();
							const win = window.open(this.playerHost + '/assembly/' + link.hash + '/test', '_blank');
							win.focus();
						});
			}
		},

		computed: {

			assemblies: {

				get() {
					return this.strategy.assemblies;
				},

				set(assemblies) {
					this.strategy.assemblies = assemblies;
					this.$emit('update:strategy', this.strategy);
				},
			},

			dragOptions() {
				return {
					animation: 200,
					group: this.group || Hash.guid(),
					dragoverBubble: true,
					ghostClass: "ghost"
				};
			},
		},

        data() {
            return {
            	playerHost: process.env.VUE_APP_PLAYER_URL,
            	parameters: null,
				columns: null,
				linkLoading: {},
				minWidth: '15rem',
				selectedIdx: null,
				selected: new StrategyAssembly(),
			};
        },

		watch: {

        	selected: {
        		deep: true,
				handler(value) {
					this.updateParameters();
					this.$emit('update:strategy', this.strategy);
				}
			},

        	strategy() {
        		this.init();
			},
		}
    });
</script>

<style lang="scss" scoped>

</style>

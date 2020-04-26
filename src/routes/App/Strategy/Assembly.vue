<template>
	<div class="d-flex flex-column fill-height">
		<v-sheet class="d-flex pa-4 scrollable-x no-select" style="flex: 0; min-height: 18rem">
			<draggable v-model="strategy.assemblies" v-bind="dragOptions" class="d-flex" @start="dragStart()" @end="dragEnd()">
				<template v-for="(assembly, assemblyIdx) in strategy.assemblies">
					<div class="d-flex">
						<v-card :key="assembly.guid" @click="select(assemblyIdx)" :min-width="minWidth" class="pa-4 text-center fill-height d-flex align-center justify-center" v-bind="getAttributes(assembly, assemblyIdx)" shaped>
							<div class="absolute d-flex align-center" style="right: 0.25rem; top: 0.25rem">
								<template v-if="!assembly.isValid()">
									<v-tooltip color="secondary" bottom>
										<template v-slot:activator="{ on }">
											<v-icon color="error" v-on="on">mdi-alert-outline</v-icon>
										</template>
										<span>{{$t('strategy.assembly.warningTooltip')}}</span>
									</v-tooltip>
								</template>
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

							<div>
								<div class="mb-2">
									<v-icon :class="assemblyIdx === selectedIdx ? null : 'primary--text'" v-if="assembly.component.id" size="64">{{ assembly.component.icon }}</v-icon>
									<v-icon v-else size="64">mdi-selection-ellipse mdi-dark mdi-inactive</v-icon>
								</div>

								<div class="title">
									<span :class="assemblyIdx === selectedIdx ? null : 'primary--text'" v-if="assembly.component.id" v-text="assembly.component.name"></span>
									<span v-else v-text="$t('strategy.assembly.noComponent')"></span>
								</div>

								<div class="">
									<span v-if="assembly.dataset.id" v-text="assembly.dataset.name"></span>
									<span v-else v-text="$t('strategy.assembly.noDataset')"></span>
								</div>

								<div class="mt-4 overline">
									<span :class="assemblyIdx === selectedIdx ? null : 'primary--text'" v-if="assembly.duration" v-text="$t('strategy.assembly.duration', { duration: assembly.duration })"></span>
									<span v-else v-text="$t('strategy.assembly.noDuration')"></span>
								</div>
							</div>
						</v-card>
						<div :key="'_next' + assemblyIdx" class="d-flex align-center justify-center mx-2">
							<v-icon x-large>mdi-chevron-right</v-icon>
						</div>
					</div>
				</template>
			</draggable>

			<v-card @click="add()" class="pa-4 text-center d-flex align-center justify-center grey lighten-4" :min-width="minWidth" style="border-style: dashed; border-radius: 1.5rem" outlined>
				<v-icon x-large>mdi-plus</v-icon>
			</v-card>

			<!-- HACK TO GIVE PADDING-RIGHT IN HORIZONTAL SCROLLING -->
			<div class="pl-4">
				<span></span>
			</div>
		</v-sheet>

		<div class="pa-4" style="flex: 1">

			<EmptyView v-if="strategy.assemblies.length === 0" :title="$t('strategy.assembly.emptyTitle')" :desc="$t('strategy.assembly.emptyDesc')" />
			<EmptyView v-else-if="selected === null" :title="$t('strategy.assembly.emptySelectionTitle')" :desc="$t('strategy.assembly.emptySelectionDesc')" />

			<v-row class="fill-height" v-else>
				<v-col cols="12" md="4">
					<v-card class="fill-height">
						<v-card-title class="primary--text">{{ $t('strategy.assembly.general.title') }}</v-card-title>
						<v-card-text>
							<v-select v-model="selected.component" :label="$t('strategy.assembly.general.component')" item-text="name" :items="components" return-object>
								<template v-slot:item="props">
									<div class="d-flex align-center">
										<v-icon left>{{ props.item.icon }}</v-icon>
										<span v-text="props.item.name"></span>
									</div>
								</template>
							</v-select>
							<v-select v-model="selected.dataset" :label="$t('strategy.assembly.general.dataset')" item-text="name" :items="datasets" return-object></v-select>
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
				<v-col cols="12" md="4">
					<v-card class="fill-height" :disabled="!selected.component.id">
						<EmptyView v-if="!selected.component.id" :title="$t('strategy.assembly.component.emptyTitle')" :desc="$t('strategy.assembly.component.emptyDesc')" />
						<template v-else>
							<v-card-title class="primary--text">{{ $t('strategy.assembly.component.title') }}</v-card-title>
							<v-card-text>
								TBD
							</v-card-text>
						</template>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="fill-height" :disabled="!selected.dataset.id">
						<EmptyView v-if="!selected.dataset.id" :title="$t('strategy.assembly.dataset.emptyTitle')" :desc="$t('strategy.assembly.dataset.emptyDesc')" />
						<template v-else>
							<v-card-title class="primary--text">{{ $t('strategy.assembly.dataset.title') }}</v-card-title>
							<v-card-text>
								<v-select v-model="selected.component" label="Colonne à épeller" item-text="name" :items="selected.dataset.columns" return-object></v-select>
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
	import {StrategyAssembly, ComponentService, DatasetService, Hash} from "@polymind/sdk-js";

    export default Vue.extend({

        name: 'Assembly',

        props: ['strategy'],

        components: { EmptyView, draggable },

        created() {

			ComponentService.getByUser(this.$root.user.id)
					.then(response => this.components = response.data);
			DatasetService.getByUser(this.$root.user.id)
					.then(response => this.datasets = response.data);

			this.init();
        },

        destroyed() {

        },

        methods: {

        	init() {
        		this.selectedIdx = null;
				this.selected = new StrategyAssembly();

				if (this.strategy.assemblies.length > 0) {
					this.select(0);
				}
			},

			add(assembly) {
        		const newAssembly = new StrategyAssembly();
				this.strategy.assemblies.push(newAssembly);

				this.select(newAssembly);
			},

			select(index) {
				this.selectedIdx = index;
				this.selected = this.strategy.assemblies[index];
			},

			remove(index) {
				this.strategy.assemblies.splice(index, 1);
			},

			getAttributes(assembly, index) {
        		return {
        			color: index === this.selectedIdx ? 'primary' : 'white',
        			dark: index === this.selectedIdx,
				};
			},

			dragStart() {

			},

			dragEnd() {
				this.select(this.strategy.assemblies.indexOf(this.selected));
			},
		},

		computed: {

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
				components: [],
				datasets: [],
				minWidth: '15rem',
				selectedIdx: null,
				selected: null,
			};
        },
    });
</script>

<style lang="scss" scoped>

</style>

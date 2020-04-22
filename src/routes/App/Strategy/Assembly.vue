<template>
	<div>
		<v-sheet class="pa-4">
			<EmptyView v-if="strategy.assemblies.length === 0" title="Votre programme est vide" desc="Ajouter des composantes" />
		</v-sheet>

		<div class="pa-4">
			<v-card :class="{ 'px-4 py-2': true, 'mt-4': assemblyIdx > 0 }" :key="assemblyIdx" v-for="(assembly, assemblyIdx) in assemblies">
				<v-row class="align-center">
					<v-col>
						<v-select label="Composante" v-model="assembly.component" :items="components" outlined hide-details></v-select>
					</v-col>
					<v-col>
						<v-select label="Duration" v-model="assembly.duration" :items="durations" outlined hide-details></v-select>
					</v-col>
					<v-col class="shrink">
						<v-btn>
							Settings
						</v-btn>
					</v-col>
					<v-col class="shrink">
						<v-btn v-if="assembly.isNew" @click="add(assembly)" color="primary">
							Ajouter
						</v-btn>
						<v-btn v-else @click="remove(assemblyIdx)" color="secondary">
							Enlever
						</v-btn>
					</v-col>
				</v-row>
			</v-card>
		</div>
	</div>
</template>

<script>
    import Vue from 'vue';
	import EmptyView from "../../../components/EmptyView";
	import { StrategyAssembly } from "@polymind/sdk-js";

    export default Vue.extend({

        name: 'Assembly',

        props: ['strategy'],

        components: { EmptyView },

        mounted() {

        },

        destroyed() {

        },

        methods: {

        	init() {

			},

			add(assembly) {
				this.strategy.assemblies.push(new StrategyAssembly(assembly));
			},

			remove(index) {
				this.strategy.assemblies.splice(index, 1);
			}
		},

        computed: {

        	assemblies() {
        		const items = [];
				this.strategy.assemblies.forEach(assembly => {
					items.push(new StrategyAssembly(assembly));
				});

				items.push(new StrategyAssembly());
				items[items.length - 1].isNew = true;

				return items;
			},
		},

        data() {
            return {
				components: [],
				durations: [
					{ text: '1 minute', value: 60 * 1000 },
					{ text: '5 minutes', value: 5 * 60 * 1000 },
					{ text: '10 minutes', value: 10 * 60 * 1000 },
					{ text: '15 minutes', value: 15 * 60 * 1000 },
					{ text: '20 minutes', value: 20 * 60 * 1000 },
					{ text: '30 minutes', value: 30 * 60 * 1000 },
					{ text: '45 minutes', value: 45 * 60 * 1000 },
					{ text: '1 hour', value: 60 * 60 * 1000 },
				]
			};
        }
    });
</script>

<style lang="scss" scoped>

</style>

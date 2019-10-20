<template>
	<v-card :class="{ 'flex-column': tabDirection === 'horizontal', 'd-flex fill-height source': true }" flat>

		<v-navigation-drawer temporary right absolute v-model="console.opened" width="300">
			<Console v-model="logs" />
		</v-navigation-drawer>

		<v-row v-if="!component.is_invisible" class="preview blueprint-grid" no-gutters :style="{ flex: tabDirection === 'vertical' ? 1 : 1 }">

			<div class="options">
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" v-if="$vuetify.breakpoint.mdAndUp && !component.is_invisible" dark @click="switchView()" text>
							<v-icon v-if="tabDirection === 'horizontal'">mdi-view-sequential</v-icon>
							<v-icon v-if="tabDirection === 'vertical'">mdi-view-week</v-icon>
						</v-btn>
					</template>
					<span>{{$t('component.source.viewTooltip')}}</span>
				</v-tooltip>

<!--				<v-tooltip bottom>-->
<!--					<template v-slot:activator="{ on }">-->
<!--						<v-btn v-on="on" dark @click="openConsole()" class="ml-1" text>-->
<!--							<v-badge>-->
<!--								<template v-if="console.lastCount > 0" v-slot:badge>{{ console.lastCount }}</template>-->
<!--								<v-icon>mdi-console</v-icon>-->
<!--							</v-badge>-->
<!--						</v-btn>-->
<!--					</template>-->
<!--					<span>{{$t('component.source.consoleTooltip')}}</span>-->
<!--				</v-tooltip>-->
			</div>

			<v-col class="d-flex align-center justify-center" cols="12">
				<div class="dynamic-component" ref="component">
					<component :is="dynamicComponent" />
				</div>
			</v-col>
		</v-row>

		<div class="d-flex flex-column" :style="{ flex: tabDirection === 'vertical' ? 1 : 2 }">
			<v-row v-if="showTabs" no-gutters style="flex: 0">
				<v-col cols="12">
					<v-tabs dark show-arrows v-model="tab" grow>
						<v-tab v-if="!component.is_invisible">HTML</v-tab>
						<v-tab>JS</v-tab>
						<v-tab v-if="!component.is_invisible">CSS</v-tab>
					</v-tabs>
				</v-col>
			</v-row>
			<v-row no-gutters style="flex: 2">
				<v-col v-if="(!showTabs || tab === 0) && !component.is_invisible" cols="12" :md="showTabs || component.is_invisible ? 12 : 4" ref="columnA" class="d-flex flex-column">
					<div v-if="!showTabs" class="code-title overline pa-1">HTML</div>
					<CodeEditorField hide-details ref="html" v-model="component.html" lang="html" class="input-html fill-height"></CodeEditorField>
				</v-col>
				<v-col v-if="!showTabs || tab === 1 || component.is_invisible" cols="12" :md="showTabs || component.is_invisible ? 12 : 4" ref="columnB" class="d-flex flex-column">
					<div v-if="!showTabs && !component.is_invisible" class="code-title overline pa-1">JS</div>
					<CodeEditorField hide-details ref="js" v-model="component.js" lang="javascript" class="input-js fill-height"></CodeEditorField>
				</v-col>
				<v-col v-if="(!showTabs || tab === 2) && !component.is_invisible" cols="12" :md="showTabs || component.is_invisible ? 12 : 4" ref="columnC" class="d-flex flex-column">
					<div v-if="!showTabs" class="code-title overline pa-1">CSS</div>
					<CodeEditorField hide-details ref="scss" v-model="component.scss" lang="css" class="input-scss fill-height"></CodeEditorField>
				</v-col>
			</v-row>
		</div>
	</v-card>
</template>

<script>
import Vue from 'vue';
import CodeEditorField from "../../../components/CodeEditorField";
import Console from "../../../components/Console";
import interact from "interactjs";
import VBtn from "vuetify/lib/components/VBtn/VBtn";
import VIcon from "vuetify/lib/components/VIcon/VIcon";
import VSheet from "vuetify/lib/components/VSheet/VSheet";
import VCard from "vuetify/lib/components/VCard/VCard";
import VProgressCircular from "vuetify/lib/components/VProgressCircular/VProgressCircular";

let originalConsoleLog = console.log;

export default Vue.extend({

	name: 'ComponentSource',
	props: ['component', 'formErrors'],

	components: { CodeEditorField, Console },

	mounted() {
		    const vm = this;
		// console.log = function(...params) {
		//
		//     let log = {
		//         timestamp: new Date(),
		//         params: params,
		//     };
		//
		//     vm.console.lastCount++;
		//     vm.logs.push(log);
		//     originalConsoleLog(log);
		// };
		this.init();
	},

	destroyed() {
		    console.log = originalConsoleLog;
	},

	methods: {

		init() {

			// const selectors = [this.$refs.columnA, this.$refs.columnB, this.$refs.columnC];
			//
			// const onStart = event => {};
			// const onMove = event => {
			//     let target = event.target;
			//     let x = (parseFloat(target.getAttribute('data-x')) || 0);
			//     target.style.width = event.rect.width + 'px';
			//     x += event.deltaRect.left;
			//     target.setAttribute('data-x', x);
			// };
			// const onEnd = event => {};
			//
			// selectors.forEach((selector, index) => {
			//     interact(selector).unset();
			//     interact(selector).resizable({
			//         edges: {
			//             left: index > 0,
			//             right: index < selectors.length - 1,
			//             bottom: false,
			//             top: false,
			//         },
			//     })
			//         .on('resizestart', onStart)
			//         .on('resizemove', onMove)
			//         .on('resizeend', onEnd);
			// });
		},

		switchView() {
			this.view = this.view === 'horizontal' ? 'vertical' : 'horizontal';
		},

		openConsole() {
			this.console.lastCount = 0;
			this.console.opened = true;
		},
	},

	computed: {

		    tabDirection() {
			return this.$vuetify.breakpoint.mdAndUp && this.view === 'vertical'
				? 'vertical'
				: 'horizontal';
		},

		showTabs() {
			return (this.$vuetify.breakpoint.smAndDown || this.view === 'vertical') && !this.component.is_invisible;
		},

		dynamicComponent() {
			try {
				let js = eval(this.component.js);
				let structure = Object.assign(js, {
					components: { VBtn, VIcon, VSheet, VCard, VProgressCircular },
					template: '<div class="polycomp">'
							+ (this.component.is_invisible ? '' : this.component.html)
						+ '</div>',
				});

				let oldData = structure.data;
				structure.data = () => {
					return {
						parameters: structure.parameters,
                        	events: structure.events,
						...oldData(),
					}
				};

				let $comp = this.$refs.component;
				let style = $comp.querySelector('style');
				if (!style) {
					style = document.createElement('style');
					style.setAttribute('scoped', true);
					$comp.prepend(style);
				}
				style.innerHTML = this.component.is_invisible ? '' : this.component.scss;

				return Vue.component('preview', structure);
			} catch (e) {
				return this.emptyComp;
			}
		},
	},

	data() {
		return {
			logs: [],
			tab: 0,
			view: 'horizontal',
			originalConsoleLog: console.log,
			emptyComp: {
				components: { VIcon },
				template: `<div class="text-center white--text">
						<v-icon color="error" style="font-size: 3rem">mdi-alert</v-icon>
						<br />There's an issue with your code
					</div>`,
				data: () => {
					return {};
				},
			},
			console: {
				lastCount: 0,
				opened: false,
			},
		}
	},

	watch: {
		    view() {
			setTimeout(() => {
				const event = new Event('resize');
				window.dispatchEvent(event);
			});
		}
	}
})
</script>

<style lang="scss" scoped>
	.code-title {
		text-align: center;
		background-color: black;
		color: white;
		background-image: linear-gradient(#444, #111);
	}
	.source {
		overflow: hidden;
	}
	.v-navigation-drawer .console >>> fieldset {
		border-top: 0;
		border-right: 0;
		border-bottom: 0;
		border-radius: 0;
	}
	.options {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 1;
	}
	.v-card {
		border-radius: 0;
	}
	.preview {
		position: relative;
		overflow: auto;
		padding: 1rem;
		background-position: -1px -1px;
	}
	.input-html >>> fieldset {
		border-radius: 0;
		border: 0;
	}
	.input-js >>> fieldset {
		border-radius: 0;
		border: 0;
	}
	.input-scss >>> fieldset {
		border: 0;
		border-radius: 0;
	}
</style>

<template>
	<v-card color="transparent" :class="{ 'flex-column': tabDirection === 'horizontal', 'd-flex fill-height source': true, 'theme--dark dark-scrollbar': dark, 'grey lighten-3': !dark, 'fullscreen': fullscreen.active }" tile flat>

		<DeleteDialog ref="deleteModal" :title="$t('component.source.injectorDelete.' + injectorDeleteClaimant.type + 'Title')" :desc="$t('component.source.injectorDelete.' + injectorDeleteClaimant.type + 'Desc')" @delete="removeInjector(injectorDeleteClaimant.type, injectorDeleteClaimant.list, injectorDeleteClaimant.index, true)" />

		<!-- MODAL: SETTINGS -->
		<v-dialog v-model="settingsModal.visible" scrollable persistent max-width="500px">
			<v-card :dark="dark">
				<v-card-title>
					<v-icon color="primary" slot="icon" size="36" left>mdi-settings-outline</v-icon>
					{{$t('component.source.settingsModal.title')}}
				</v-card-title>

				<v-card-text>
					<SettingsDevelopment :user="user" />
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn color="primary" @click="applySettings()" :disabled="!settingsIsDifferent">
						<v-icon left>mdi-content-save</v-icon>
						{{$t('modal.apply')}}
					</v-btn>

					<v-btn @click="settingsModal.visible = false">
						{{$t('modal.cancel')}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- MODAL: INJECTORS -->
		<v-dialog v-model="injectorModal.visible" scrollable persistent max-width="800px">
			<v-card :dark="dark">
				<v-card-title>
					<v-icon v-if="injectorModal.type === 'hook'" color="primary" slot="icon" size="36" left>mdi-flash</v-icon>
					<v-icon v-else-if="injectorModal.type === 'parameter'" color="primary" slot="icon" size="36" left>mdi-code-parentheses-box</v-icon>
					<v-icon v-else-if="injectorModal.type === 'function'" color="primary" slot="icon" size="36" left>mdi-function</v-icon>
					<v-icon v-else-if="injectorModal.type === 'test'" color="primary" slot="icon" size="36" left>mdi-bug</v-icon>
					<span v-if="injectorModal.isNew">{{ $t('component.source.injectorModal.' + injectorModal.type + 'NewTitle') }}</span>
					<span v-else>{{ $t('component.source.injectorModal.' + injectorModal.type + 'Title') }}</span>
				</v-card-title>

				<v-card-text>
					<div v-if="injectorModal.type === 'hook'">
						<v-text-field ref="injectorModalName" :label="$t('component.source.injectorModal.labels.name')" v-model="injectorModal.data.name"></v-text-field>
						<CodeEditorField v-model="injectorModal.data.js" lang="javascript" style="height: 300px" hide-details></CodeEditorField>
					</div>
					<div v-else-if="injectorModal.type === 'parameter'">
						<v-text-field ref="injectorModalName" :label="$t('component.source.injectorModal.labels.name')" v-model="injectorModal.data.name"></v-text-field>
						<CodeEditorField v-model="injectorModal.data.defaultValue" lang="javascript" style="height: 300px" hide-details></CodeEditorField>
					</div>
					<div v-else-if="injectorModal.type === 'function'">
						<v-text-field ref="injectorModalName" :label="$t('component.source.injectorModal.labels.name')" v-model="injectorModal.data.name"></v-text-field>
					</div>
					<div v-else-if="injectorModal.type === 'test'">
						<v-text-field ref="injectorModalName" :label="$t('component.source.injectorModal.labels.name')" v-model="injectorModal.data.name"></v-text-field>
						<CodeEditorField v-model="injectorModal.data.js" lang="javascript" style="height: 300px" hide-details></CodeEditorField>
					</div>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn color="primary" @click="applyInjector()" :disabled="!isDifferent(injectorModal.originalData, injectorModal.data)">
						<v-icon v-if="injectorModal.isNew" left>mdi-plus</v-icon>
						<v-icon v-else left>mdi-content-save</v-icon>
						<span v-if="injectorModal.isNew">{{$t('modal.add')}}</span>
						<span v-else>{{$t('modal.apply')}}</span>
					</v-btn>

					<v-btn @click="injectorModal.visible = false">
						{{$t('modal.cancel')}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- PROPERTIES -->
		<v-expand-x-transition>
			<v-card class="injection fill-height scrollable-y not-scrollable-x no-select" v-if="properties.opened" style="width: 20vw" :dark="dark" tile flat>
				<div style="height: 0; min-width: 20vw">
					<v-list color="transparent" class="pa-2">
						<v-subheader>
							<span style="flex: 1">
								<span v-text="$t('component.source.hooks.title')"></span>
								<span v-if="component.hooks.length > 0"> ({{ component.hooks.length }})</span>
							</span>
							<v-tooltip bottom>
								<template v-slot:activator="{ on }">
									<v-btn class="ml-2 mr-n1" icon v-on="on" @click="addInjector('hook')" icon color="primary">
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</template>
								<span v-text="$t('component.source.hooks.add')"></span>
							</v-tooltip>
						</v-subheader>
						<v-slide-x-transition leave-absolute>
							<v-alert v-if="component.hooks.length === 0" text tile type="warning" class="ma-0">
								<span v-text="$t('component.source.hooks.empty')"></span>
							</v-alert>
						</v-slide-x-transition>
						<v-slide-x-transition leave-absolute group>
							<v-list-item v-for="(hook, index) in component.hooks" :key="index">
								<v-list-item-icon>
									<v-icon>mdi-flash</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title v-text="hook.name"></v-list-item-title>
								</v-list-item-content>
								<v-list-item-action>
									<div>
										<v-tooltip bottom>
											<template v-slot:activator="{ on }">
												<v-btn class="mr-2" @click.stop="editInjector('hook', hook)" v-on="on" small icon>
													<v-icon small>mdi-pencil</v-icon>
												</v-btn>
											</template>
											<span v-text="$t('component.source.injection.edit')"></span>
										</v-tooltip>
										<v-tooltip bottom>
											<template v-slot:activator="{ on }">
												<v-btn @click.stop="removeInjector('hook', component.hooks, index)" v-on="on" small icon>
													<v-icon small>mdi-delete</v-icon>
												</v-btn>
											</template>
											<span v-text="$t('component.source.injection.remove')"></span>
										</v-tooltip>
									</div>
								</v-list-item-action>
							</v-list-item>
						</v-slide-x-transition>
					</v-list>

					<v-divider></v-divider>

					<v-list color="transparent" class="pa-2">
						<v-subheader>
							<span style="flex: 1">
								<span v-text="$t('component.source.parameters.title')"></span>
								<span v-if="component.parameters.length > 0"> ({{ component.parameters.length }})</span>
							</span>
							<v-tooltip bottom>
								<template v-slot:activator="{ on }">
									<v-btn class="ml-2 mr-n1" icon v-on="on" @click="addInjector('parameter')" icon color="primary">
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</template>
								<span v-text="$t('component.source.parameters.add')"></span>
							</v-tooltip>
						</v-subheader>
						<v-slide-x-transition leave-absolute>
							<v-alert v-if="component.parameters.length === 0" text tile type="warning" class="ma-0">
								<span v-text="$t('component.source.parameters.empty')"></span>
							</v-alert>
						</v-slide-x-transition>
						<v-slide-x-transition leave-absolute group>
							<v-list-item v-for="(parameter, index) in component.parameters" :key="index">
								<v-list-item-icon>
									<v-icon>mdi-code-parentheses-box</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title v-text="parameter.name"></v-list-item-title>
								</v-list-item-content>
								<v-list-item-action>
									<div>
										<v-tooltip bottom>
											<template v-slot:activator="{ on }">
												<v-btn class="mr-2" @click.stop="editInjector('parameter', parameter)" v-on="on" small icon>
													<v-icon small>mdi-pencil</v-icon>
												</v-btn>
											</template>
											<span v-text="$t('component.source.injection.edit')"></span>
										</v-tooltip>
										<v-tooltip bottom>
											<template v-slot:activator="{ on }">
												<v-btn @click.stop="removeInjector('parameter', component.parameters, index)" v-on="on" small icon>
													<v-icon small>mdi-delete</v-icon>
												</v-btn>
											</template>
											<span v-text="$t('component.source.injection.remove')"></span>
										</v-tooltip>
									</div>
								</v-list-item-action>
							</v-list-item>
						</v-slide-x-transition>
					</v-list>

					<v-divider></v-divider>

					<v-list color="transparent" class="pa-2">
						<v-subheader>
							<span style="flex: 1">
								<span v-text="$t('component.source.functions.title')"></span>
								<span v-if="component.functions.length > 0"> ({{ component.functions.length }})</span>
							</span>
							<v-tooltip bottom>
								<template v-slot:activator="{ on }">
									<v-btn class="ml-2 mr-n1" icon v-on="on" @click="addInjector('function')" icon color="primary">
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</template>
								<span v-text="$t('component.source.functions.add')"></span>
							</v-tooltip>
						</v-subheader>
						<v-slide-x-transition leave-absolute>
							<v-alert v-if="component.functions.length === 0" text tile type="warning" class="ma-0">
								<span v-text="$t('component.source.functions.empty')"></span>
							</v-alert>
						</v-slide-x-transition>
						<v-slide-x-transition leave-absolute group>
							<v-list-item v-for="(func, index) in component.functions" :key="index">
								<v-list-item-icon>
									<v-icon>mdi-function</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title v-text="func.name"></v-list-item-title>
								</v-list-item-content>
								<v-list-item-action>
									<div>
										<v-tooltip bottom>
											<template v-slot:activator="{ on }">
												<v-btn class="mr-2" @click.stop="editInjector('function', func)" v-on="on" small icon>
													<v-icon small>mdi-pencil</v-icon>
												</v-btn>
											</template>
											<span v-text="$t('component.source.injection.edit')"></span>
										</v-tooltip>
										<v-tooltip bottom>
											<template v-slot:activator="{ on }">
												<v-btn @click.stop="removeInjector('function', component.functions, index)" v-on="on" small icon>
													<v-icon small>mdi-delete</v-icon>
												</v-btn>
											</template>
											<span v-text="$t('component.source.injection.remove')"></span>
										</v-tooltip>
									</div>
								</v-list-item-action>
							</v-list-item>
						</v-slide-x-transition>
					</v-list>

					<v-divider></v-divider>

					<v-list color="transparent" class="pa-2">
						<v-subheader>
							<span style="flex: 1">
								<span v-text="$t('component.source.tests.title')"></span>
								<span v-if="component.tests.length > 0"> ({{ component.tests.length }})</span>
							</span>
							<v-tooltip bottom>
								<template v-slot:activator="{ on }">
									<v-btn class="ml-2 mr-n1" icon v-on="on" @click="addInjector('test')" icon color="primary">
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</template>
								<span v-text="$t('component.source.tests.add')"></span>
							</v-tooltip>
						</v-subheader>
						<v-slide-x-transition leave-absolute>
							<v-alert v-if="component.tests.length === 0" text tile type="warning" class="ma-0">
								<span v-text="$t('component.source.tests.empty')"></span>
							</v-alert>
						</v-slide-x-transition>
						<v-slide-x-transition leave-absolute group>
							<v-list-item v-for="(test, index) in component.tests" :key="index">
								<v-list-item-icon>
									<v-icon>mdi-bug</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title v-text="test.name"></v-list-item-title>
								</v-list-item-content>
								<v-list-item-action>
									<div>
										<v-tooltip bottom>
											<template v-slot:activator="{ on }">
												<v-btn class="mr-2 primary" @click.stop="runTest(test)" v-on="on" small icon>
													<v-icon color="white" small>mdi-play</v-icon>
												</v-btn>
											</template>
											<span v-text="$t('component.source.injection.run')"></span>
										</v-tooltip>
										<v-tooltip bottom>
											<template v-slot:activator="{ on }">
												<v-btn class="mr-2" @click.stop="editInjector('test', test)" v-on="on" small icon>
													<v-icon small>mdi-pencil</v-icon>
												</v-btn>
											</template>
											<span v-text="$t('component.source.injection.edit')"></span>
										</v-tooltip>
										<v-tooltip bottom>
											<template v-slot:activator="{ on }">
												<v-btn @click.stop="removeInjector('test', component.tests, index)" v-on="on" small icon>
													<v-icon small>mdi-delete</v-icon>
												</v-btn>
											</template>
											<span v-text="$t('component.source.injection.remove')"></span>
										</v-tooltip>
									</div>
								</v-list-item-action>
							</v-list-item>
						</v-slide-x-transition>
					</v-list>
				</div>
			</v-card>
		</v-expand-x-transition>

		<!-- PREVIEW / CONSOLE -->
		<div ref="previewContainer" class="d-flex flex-column preview-container" :style="{ flex: tabDirection === 'vertical' ? 1 : 1, width: !fullscreen.active ? '30%' : null }">

			<!-- TOOLBAR -->
			<v-toolbar ref="previewToolbar" class="preview-toolbar no-select" style="flex: 0" :dark="dark" dense>

				<!-- PROPERTIES -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="mr-2" v-on="on" :disabled="fullscreen.active" :color="properties.opened ? null : 'primary'" @click="toggleProperties()" icon>
							<v-icon>mdi-card-bulleted-settings-outline</v-icon>
						</v-btn>
					</template>
					<span>{{$t('component.source.propertiesTooltip')}}</span>
				</v-tooltip>

				<!-- CONSOLE -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="mr-2" v-on="on" :disabled="component.is_invisible || !preview.opened || fullscreen.active" :color="console.opened ? null : 'primary'" @click="toggleConsole()" icon>
							<v-badge :value="console.lastCount && !console.opened" :content="console.lastCount" overlap>
								<v-icon>mdi-console</v-icon>
							</v-badge>
						</v-btn>
					</template>
					<span>{{$t('component.source.consoleTooltip')}}</span>
				</v-tooltip>

				<!-- PREVIEW -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="mr-2" v-on="on" :disabled="component.is_invisible || !console.opened || fullscreen.active" :color="preview.opened ? null : 'primary'" @click="togglePreview()" icon>
							<v-icon>mdi-eye-circle-outline</v-icon>
						</v-btn>
					</template>
					<span>{{$t('component.source.previewTooltip')}}</span>
				</v-tooltip>

				<!-- CODE -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="mr-2" v-on="on" :disabled="fullscreen.active" :color="code.opened ? null : 'primary'" @click="toggleCode()" icon>
							<v-icon>mdi-code-tags</v-icon>
						</v-btn>
					</template>
					<span>{{$t('component.source.codeTooltip')}}</span>
				</v-tooltip>

				<v-spacer></v-spacer>

				<!-- ZOOM IN -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="ml-2" v-on="on" @click="setZoom(-1)" :disabled="dynamicComponentStyle.zoom === zoomRange[0] || !preview.opened" icon>
							<v-icon>mdi-magnify-minus-outline</v-icon>
						</v-btn>
					</template>
					<span>{{$t('component.source.zoomOut')}}</span>
				</v-tooltip>

				<span :class="{ 'text-center': true, 'white--text': dark }" style="width: 3rem">{{ (dynamicComponentStyle.zoom * 100) }}%</span>

				<!-- ZOOM OUT -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" @click="setZoom(1)" :disabled="dynamicComponentStyle.zoom === zoomRange[zoomRange.length - 1] || !preview.opened" icon>
							<v-icon>mdi-magnify-plus-outline</v-icon>
						</v-btn>
					</template>
					<span>{{$t('component.source.zoomIn')}}</span>
				</v-tooltip>

				<!-- FULLSCREEN -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="ml-2" v-on="on" :disabled="!preview.opened" @click="toggleFullscreen()" icon>
							<v-icon v-if="!fullscreen.active">mdi-fullscreen</v-icon>
							<v-icon v-else>mdi-fullscreen-exit</v-icon>
						</v-btn>
					</template>
					<span>
						<span v-if="!fullscreen.active">{{$t('component.source.fullscreenOn')}}</span>
						<span v-else>{{$t('component.source.fullscreenOff')}}</span>
					</span>
				</v-tooltip>
			</v-toolbar>

			<!-- COMPONENT -->
			<div class="fill-height" v-show="!component.is_invisible && preview.opened">
				<v-expand-transition>
					<div ref="preview" @wheel="handleWheel" :class="{ 'd-flex align-center justify-center fill-height preview blueprint-grid scrollable allow-contextual-menu': true, 'opened': preview.opened }">
						<div class="dynamic-component dc-container" ref="component" :style="formattedDynamicComponentStyle">
							<component :is="dynamicComponent" />
						</div>
					</div>
				</v-expand-transition>
			</div>

			<!-- CONSOLE -->
			<div v-if="!fullscreen.active">
				<v-expand-transition>
					<div ref="console" v-if="console.opened" :style="{ height: preview.opened && !component.is_invisible ? '30vh' : $refs.previewContainer.offsetHeight - $refs.previewToolbar.$el.offsetHeight + 'px' }" class="d-flex console fill-height">
						<Console class="w-100 fill-height" :reference="pmConsole" v-model="console.logs" :dark="dark" @clear="clearConsole()" @command="runCommand" />
					</div>
				</v-expand-transition>
			</div>
		</div>

		<!-- CODE -->
		<v-expand-x-transition>
			<div v-show="code.opened" class="fill-height" :style="{ width: '40%' }">

				<div class="d-flex flex-column code fill-height" :style="{ minWidth: '40%' }">
					<v-row v-if="showTabs" no-gutters style="flex: 0">
						<v-col cols="12">
							<v-tabs :dark="dark" show-arrows v-model="tab" grow>
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
					<v-toolbar :dark="dark" dense flat tile style="flex: 0">

						<v-switch v-model="$root.user.settings.development.autoUpdate" :label="$t('component.source.autoUpdate')" class="mr-4" color="primary" inset hide-details></v-switch>

						<v-spacer></v-spacer>

						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-btn v-on="on" @click="applyChanges()" :disabled="$root.user.settings.development.autoUpdate" small color="primary">
									<v-icon>mdi-play</v-icon>
								</v-btn>
							</template>
							<span>{{$t('component.source.executeTooltip')}}</span>
						</v-tooltip>

						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-btn class="ml-2" v-on="on" :disabled="fullscreen.active" @click="openSettings()" icon>
									<v-icon>mdi-settings-outline</v-icon>
								</v-btn>
							</template>
							<span>{{$t('component.source.settingsTooltip')}}</span>
						</v-tooltip>
					</v-toolbar>
				</div>
			</div>
		</v-expand-x-transition>
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
import SettingsDevelopment from "../Account/SettingsDevelopment";
import UserService from "../../../services/UserService";
import User from "../../../models/User";
import DeleteDialog from "../../../components/DeleteDialog";
import ComponentHook from "../../../models/Component.Hook";
import ComponentTest from "../../../models/Component.Test";
import ComponentFunction from "../../../models/Component.Function";
import ComponentParameter from "../../../models/Component.Parameter";

const pmConsole = {};
// const originalConsoleLog = console.log;
// const originalConsoleError = console.error;
// const originalConsoleWarn = console.warn;
// const originalConsoleInfo = console.info;
// const originalConsoleClear = console.clear;

export default Vue.extend({

	name: 'ComponentSource',
	props: ['component', 'formErrors'],

	components: { CodeEditorField, Console, SettingsDevelopment, DeleteDialog },

	mounted() {
		const vm = this;
		pmConsole.log = function(...params) {

		    let log = {
		        timestamp: new Date(),
		        params: params,
				log: true,
		    };

		    vm.console.lastCount++;
		    vm.console.logs.push(log);
			console.log(...params);
		    // originalConsole.log(...params);
		};
		pmConsole.error = function(...params) {

		    let error = {
		        timestamp: new Date(),
		        params: params,
				error: true,
		    };

		    vm.console.lastCount++;
		    vm.console.logs.push(error);
			console.error(...params);
		    // originalConsole.error(...params);
		};
		pmConsole.warn = function(...params) {

		    let warning = {
		        timestamp: new Date(),
		        params: params,
				warning: true,
		    };

		    vm.console.lastCount++;
		    vm.console.logs.push(warning);
			console.info(...params);
		    // originalConsole.info(...params);
		};
		pmConsole.info = function(...params) {

		    let info = {
		        timestamp: new Date(),
		        params: params,
				info: true,
		    };

		    vm.console.lastCount++;
		    vm.console.logs.push(info);
			console.warn(...params);
		    // originalConsole.warn(...params);
		};
		pmConsole.clear = function(...params) {
		    vm.console.lastCount = 0;
		    vm.console.logs = [{
				timestamp: new Date(),
				cleared: true,
			}];
		    console.clear(...params);
			// originalConsole.clear(...params);
		};

		this.applyChanges();

		this.$shortcuts.add(this.$t('shortcuts.componentSource.zoomReset.title'), this.$t('shortcuts.componentSource.zoomReset.desc'), 'componentSource', ['ControlLeft', 'Digit0'], this.shortcutZoomReset);
		this.$shortcuts.add(this.$t('shortcuts.componentSource.zoomIn.title'), this.$t('shortcuts.componentSource.zoomIn.desc'), 'componentSource', ['ControlLeft', 'Equal'], this.shortcutZoomIn);
		this.$shortcuts.add(this.$t('shortcuts.componentSource.zoomOut.title'), this.$t('shortcuts.componentSource.zoomOut.desc'), 'componentSource', ['ControlLeft', 'Minus'], this.shortcutZoomOut);
		this.$shortcuts.add(this.$t('shortcuts.componentSource.fullscreen.title'), this.$t('shortcuts.componentSource.fullscreen.desc'), 'componentSource', ['AltLeft', 'KeyF'], this.shortcutFullscreen);
		this.$shortcuts.add(this.$t('shortcuts.componentSource.switchHtml.title'), this.$t('shortcuts.componentSource.switchHtml.desc'), 'componentSource', ['AltLeft', 'Digit1'], this.shortcutSwitchHtml);
		this.$shortcuts.add(this.$t('shortcuts.componentSource.switchJs.title'), this.$t('shortcuts.componentSource.switchJs.desc'), 'componentSource', ['AltLeft', 'Digit2'], this.shortcutSwitchJs);
		this.$shortcuts.add(this.$t('shortcuts.componentSource.switchCss.title'), this.$t('shortcuts.componentSource.switchCss.desc'), 'componentSource', ['AltLeft', 'Digit3'], this.shortcutSwitchCss);
		this.$shortcuts.add(this.$t('shortcuts.componentSource.applyChanges.title'), this.$t('shortcuts.componentSource.applyChanges.desc'), 'componentSource', ['AltLeft', 'Enter'], this.shortcutApplyChanges);
		this.$shortcuts.add(this.$t('shortcuts.componentSource.clearConsole.title'), this.$t('shortcuts.componentSource.clearConsole.desc'), 'componentSource', ['AltLeft', 'KeyC'], this.shortcutClearConsole);

	},

	destroyed() {
		// console.log = originalConsoleLog;
		// console.error = originalConsoleError;
		// console.warn = originalConsoleWarn;
		// console.info = originalConsoleInfo;
		// console.clear = originalConsoleClear;

		this.$shortcuts.remove(this.shortcutZoomReset);
		this.$shortcuts.remove(this.shortcutZoomIn);
		this.$shortcuts.remove(this.shortcutZoomOut);
		this.$shortcuts.remove(this.shortcutFullscreen);
		this.$shortcuts.remove(this.shortcutSwitchHtml);
		this.$shortcuts.remove(this.shortcutSwitchJs);
		this.$shortcuts.remove(this.shortcutSwitchCss);
		this.$shortcuts.remove(this.shortcutApplyChanges);
		this.$shortcuts.remove(this.shortcutClearConsole);
	},

	methods: {

		shortcutZoomReset(event) {
			this.dynamicComponentStyle.zoom = 1;
		},

		shortcutZoomIn(event) {
			this.setZoom(1);
		},

		shortcutZoomOut(event) {
			this.setZoom(-1);
		},

		shortcutFullscreen() {
			this.toggleFullscreen();
		},

		shortcutSwitchHtml(event) {
			this.tab = 0;
		},

		shortcutSwitchJs(event) {
			this.tab = 1;
		},

		shortcutSwitchCss(event) {
			this.tab = 2;
		},

		shortcutApplyChanges() {
			this.applyChanges();
		},

		shortcutClearConsole() {
			this.clearConsole();
		},

		handleWheel(event) {
			if (event.ctrlKey) {
				const delta = Math.sign(event.deltaY);
				this.setZoom(-delta);
				event.preventDefault();

			}
		},

		openSettings() {
            this.user = this.$deepClone(this.$root.user);
            this.settingsModal.visible = true;
		},

		applySettings() {

            this.$root.isLoading = true;
            UserService.update.bind(this)(this.$root.user.id, {
                settings: this.user.settings,
            })
                .then(response => {
                    this.$root.isSaved = true;
                    this.$root.user.settings = this.$deepClone(this.user.settings);
                    this.settingsModal.visible = false;
                })
                .catch(error => this.$handleError(this, error))
                .finally(() => this.$root.isLoading = false);
		},

		switchView() {
			this.view = this.view === 'horizontal' ? 'vertical' : 'horizontal';
		},

		toggleFullscreen() {
			this.fullscreen.active = !this.fullscreen.active;
		},

		toggleCode() {
			this.code.opened = !this.code.opened;
		},

		toggleConsole() {
			this.console.lastCount = 0;
			this.console.opened = !this.console.opened;
		},

		togglePreview() {
			this.preview.opened = !this.preview.opened;
		},

		toggleProperties() {
			this.properties.opened = !this.properties.opened;
		},

		getDynamicComponent() {

			if (this.componentHadError) {
				this.dynamicComponent = this.emptyComp;
				return;
			}

		    if (!this.component) {
		        this.dynamicComponent = this.defaultComponent;
		        return;
			}

			try {
		    	const jsStr = this.component.js.replace(/console[.]/gim, 'pmConsole.');
				let js = eval(jsStr);

				if (!(js instanceof Object) || Array.isArray(js)) {
					js = {};
				}
				let structure = Object.assign(js, {
					components: { VBtn, VIcon, VSheet, VCard, VProgressCircular },
					template: '<div class="polycomp">'
						+ (this.component.is_invisible ? '' : this.component.html)
						+ '</div>',
				});

				const hooks = {};
				this.component.hooks.forEach(hook => {
					hooks[hook.name] = () => {
						eval('(() => {' + hook.js.replace(/console[.]/gim, 'pmConsole.') + '})()');
					};
				});

				const parameters = {};
				this.component.parameters.forEach(parameter => {
					parameters[parameter.name] = eval('(() => {' + parameter.defaultValue + '})()');
				});

				const functions = {};
				this.component.functions.forEach(func => {
					functions[func.name] = {};
				});

				const oldData = structure.data || (() => {});
				structure.data = function() {
					return {
						hooks,
						parameters,
						functions,
						...oldData(),
					};
				};

				const vm = this;
				const oldMounted = structure.mounted;
				structure.mounted = function() {

					if (oldMounted) {
						oldMounted.bind(this)();
					}

					const cmpVm = this;
					vm.$on('__PM_TEST', test => {
						let func = function(js) {
							js = js.replace(/console[.]/gim, 'pmConsole.');
							try {
								let value = eval('(() => {' + js + '})()');
								if (value instanceof Promise) {
									value.catch(err => pmConsole.error);
								}
								else if (value) {
									pmConsole.log(value);
								}
							} catch (e) {
								pmConsole.error(e);
							}
						}.call(cmpVm, test.js);
					});
					vm.$on('__PM_COMMAND', command => {
						let func = function(js) {
							js = js.replace(/console[.]/gim, 'pmConsole.');
							try {
								let value = eval(js);
								if (value !== undefined) {
									pmConsole.log(value);
								}
							} catch (e) {
								let tryCommand = js.trim();
								const tryCommandParamPos = tryCommand.indexOf('(');
								if (tryCommandParamPos === -1 && cmpVm[tryCommand] !== undefined) {
									try {
										pmConsole.log(cmpVm[tryCommand]);
									} catch(tryErr) {
										pmConsole.error(e); // Just return the previous error.. (we were only trying in *this* context)
									}
								} else if (tryCommandParamPos !== -1) {
									try {
										eval('this.' + tryCommand);
									} catch(tryErr) {
										pmConsole.error(e); // Just return the previous error.. (we were only trying in *this* context)
									}
								} else {
									pmConsole.error(e);
								}
							}
						}.call(cmpVm, command);
					});
				};
				const oldDestroyed = structure.destroyed;
				structure.destroyed = function() {

					if (oldDestroyed) {
						oldDestroyed.bind(this)();
					}

					vm.$off('__PM_TEST');
					vm.$off('__PM_COMMAND');
				};

				if (!this.component.is_invisible) {
					let $comp = this.$refs.component;
					let style = $comp.querySelector('style');
					if (!style) {
						style = document.createElement('style');
						style.setAttribute('scoped', true);
						$comp.prepend(style);
					}
					style.innerHTML = this.component.is_invisible ? '' : this.component.scss;
				}

				structure.renderError = function(err, vm, info) {
					this.componentHadError = true;
					this.dynamicComponent = this.emptyComp;

					this.$nextTick(() => {
						pmConsole.error(vm);
					});
					return false;
				};

				return Vue.component('preview', structure);
			} catch (e) {
				pmConsole.error(e);
				return this.emptyComp;
			}
		},

		addInjector(type) {

			switch (type) {
				case 'hook':
					const hook = new ComponentHook();
					this.editInjector(type, hook, true,(data) => {
						this.component.hooks.push(data);
					});
					break;
				case 'parameter':
					const parameter = new ComponentParameter();
					this.editInjector(type, parameter, true, (data) => {
						this.component.parameters.push(data);
					});
					break;
				case 'function':
					const func = new ComponentFunction();
					this.editInjector(type, func, true, (data) => {
						this.component.functions.push(data);
					});
					break;
				case 'test':
					const test = new ComponentTest();
					this.editInjector(type, test, true, (data) => {
						this.component.tests.push(data);
					});
					break;
			}
		},

		editInjector(type, data, isNew, callback = false) {
			this.injectorModal.isNew = isNew;
			this.injectorModal.callback = callback;
			this.injectorModal.type = type;
			this.injectorModal.originalData = data;
			this.injectorModal.data = this.$deepClone(data);
			this.injectorModal.visible = true;

			setTimeout(() => {
				this.$refs.injectorModalName.$el.querySelector('input').focus();
			});
		},

		removeInjector(type, list, index, force = false) {

			if (!force) {
				this.injectorDeleteClaimant.type = type;
				this.injectorDeleteClaimant.list = list;
				this.injectorDeleteClaimant.index = index;
				this.$refs.deleteModal.show();
			} else {
				list.splice(index, 1);
				this.$refs.deleteModal.hide();
			}
		},

		applyInjector() {
			Object.assign(this.injectorModal.originalData, this.injectorModal.data);

			if (this.injectorModal.callback) {
				this.injectorModal.callback(this.injectorModal.data);
			}

			this.injectorModal.visible = false;
		},

		runTest(test) {
			this.$emit('__PM_TEST', test);
		},

		runCommand(command) {
			this.$emit('__PM_COMMAND', command);
		},

		setZoom(direction = 1) {
			const index = this.zoomRange.indexOf(this.dynamicComponentStyle.zoom);
			const newZoom = this.zoomRange[index + direction];
			if (index !== -1 && newZoom !== undefined) {
				this.dynamicComponentStyle.zoom = newZoom;
			}
		},

		applyChanges() {
			this.componentHadError = false;
			this.dynamicComponent = this.getDynamicComponent();
		},

		clearConsole() {
			this.console.logs = [];
			this.console.lastCount = 0;
		},

		isDifferent(originalData, data) {
			return JSON.stringify(originalData) !== JSON.stringify(data);
		},

	},

	computed: {

		layout() {
return {};
			let values = {
				preview: {
					height: 100 + 'px',
				},
				console: {
					height: 100 + 'px',
				},
			};

			const container = this.$refs.previewContainer;
			const toolbar = this.$refs.previewToolbar;

			if (!container || !toolbar) {
				console.log(123);
				return values;
			}

			const totalHeight = container.offsetHeight - toolbar.$el.offsetHeight;

			if (this.preview.opened) {
				values.preview.height = 0.7 * totalHeight + 'px';
				values.console.height = 0.3 * totalHeight + 'px';
			} else {
				values.preview.height = totalHeight + 'px';
				values.console.height = totalHeight + 'px';
			}

			console.log(values);

			return values;
		},

	    settingsIsDifferent() {
	        return JSON.stringify(this.$root.user.settings.development) !== JSON.stringify(this.user.settings.development);
		},

		tabDirection() {
			return this.$vuetify.breakpoint.mdAndUp && this.view === 'vertical'
				? 'vertical'
				: 'horizontal';
		},

		showTabs() {
			return (this.$vuetify.breakpoint.smAndDown || this.view === 'vertical') && !this.component.is_invisible;
		},

		formattedDynamicComponentStyle() {
	    	return {
	    		transform: 'scale(' + this.dynamicComponentStyle.zoom + ')',
			}
		},
	},

	data() {

	    const defaultComponent = {
            components: { VProgressCircular },
            template: `<div class="text-center white--text">
					<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
				</div>`,
            data: () => {
                return {};
            },
        };

		return {
            settingsModal: {
                visible: false,
			},
			injectorModal: {
            	type: 'hook',
				visible: false,
				data: new ComponentHook(),
				originalData: new ComponentHook(),
				isNew: true,
            	callback: null,
			},
			zoomRange: [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 6, 8],
			user: this.$deepClone(this.$root.user),
		    dark: this.$root.user.settings.development.theme === 'dark',
			tab: 0,
			injectorDeleteClaimant: { type: 'hook', list: null, index: null },
			view: 'vertical',
			originalConsoleLog: console.log,
            dynamicComponent: defaultComponent,
			defaultComponent: defaultComponent,
			emptyComp: {
				components: { VIcon },
				template: `<div class="text-center white--text">
						<v-icon color="error" style="font-size: 3rem">mdi-alert</v-icon>
						<br /><span v-text="$t('component.source.codeIssue')"></span>
					</div>`,
				data: () => {
					return {};
				},
			},
			componentHadError: false,
			console: {
				lastCount: 0,
				opened: true,
				logs: [],
			},
			dynamicComponentStyle: {
            	zoom: 1,
			},
			properties: {
				opened: true,
			},
			code: {
				opened: true,
			},
			preview: {
				opened: true,
			},
			fullscreen: {
            	active: false,
			},
			pmConsole: pmConsole,
		}
	},

	watch: {

		view() {
			setTimeout(() => {
				const event = new Event('resize');
				window.dispatchEvent(event);
			});
		},

		'component.id'() {
			this.applyChanges();
		},

		component: {
			deep: true,
			handler: function(component) {
				if (this.$root.user.settings.development.autoUpdate) {
					this.applyChanges();
				}
			},
		},

		'$root.user.settings.development.theme'(theme) {
			this.dark = theme === 'dark';
		},

		'$root.user.settings.development.autoUpdate'(value) {
			if (value) {
				this.applyChanges();
			}
		},
	}
})
</script>

<style lang="scss" scoped>

	.code-title {
		text-align: center;
		background-image: linear-gradient(#fff, #ddd);
	}
	.v-card {
		border-radius: 0;
	}

	.preview {
		position: relative;
		background-position: -1px -1px;
		border: #174977 solid 2px;

		&:not(.opened) {
			border: 0 !important;
		}

		.dc-container {
			/*transform-origin: 0 0;*/
			transition: transform 300ms ease;
		}
	}

	.console {
		/*transition: height 200ms ease;*/
	}

	.fullscreen {
		.preview-container {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 6;
		}
	}

	.theme--dark {

		.code-title {
			background-color: black;
			color: white;
			background-image: linear-gradient(#444, #111);
		}

		.preview {
			border: rgb(84, 103, 167) solid 2px;
		}
	}

	.input-html::v-deep fieldset {
		border-radius: 0;
		border: 0;
	}
	.input-js::v-deep fieldset {
		border-radius: 0;
		border: 0;
	}
	.input-scss::v-deep fieldset {
		border: 0;
		border-radius: 0;
	}
</style>

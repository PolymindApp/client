<template>
	<div ref="container" :class="containerClasses">

		<!-- MAIN CONTENT -->
		<div class="d-flex flex-column fill-height preview-container grey lighten-3" style="flex: 1">
			<v-toolbar ref="previewToolbar" class="preview-toolbar no-select" :dark="dark" style="flex: 0; z-index: 1;" :max-width="this.fullscreen.active ? null : viewportStyle.width" dense>

				<!-- TOOLS -->
				<v-btn-toggle v-model="selectedToolIdx" mandatory tile color="primary" group>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn class="double-icon" v-on="on" icon>
								<v-icon>mdi-cursor-default-outline</v-icon>
								<v-icon>mdi-arrow-all</v-icon>
							</v-btn>
						</template>
						<span>{{$t('strategy.interface.tooltips.pointer')}}</span>
					</v-tooltip>
<!--					<v-tooltip bottom>-->
<!--						<template v-slot:activator="{ on }">-->
<!--							<v-btn v-on="on" icon>-->
<!--								<v-icon>mdi-selection</v-icon>-->
<!--							</v-btn>-->
<!--						</template>-->
<!--						<span>{{$t('strategy.interface.tooltips.select')}}</span>-->
<!--					</v-tooltip>-->
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn v-on="on" icon>
								<v-icon>mdi-plus-thick</v-icon>
							</v-btn>
						</template>
						<span>{{$t('strategy.interface.tooltips.draw')}}</span>
					</v-tooltip>
<!--					<v-tooltip bottom>-->
<!--						<template v-slot:activator="{ on }">-->
<!--							<v-btn v-on="on" icon>-->
<!--								<v-icon>mdi-format-rotate-90</v-icon>-->
<!--							</v-btn>-->
<!--						</template>-->
<!--						<span>{{$t('strategy.interface.tooltips.rotate')}}</span>-->
<!--					</v-tooltip>-->
				</v-btn-toggle>

				<v-divider vertical></v-divider>

				<!-- ORIENTATION -->
				<v-select style="max-width: 14rem" v-model="orientation" :placeholder="$t('strategy.interface.orientation')" :items="orientations" item-text="name" flat return-object solo dense hide-details></v-select>

				<v-spacer></v-spacer>

				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" icon>
							<v-icon>mdi-format-horizontal-align-center</v-icon>
						</v-btn>
					</template>
					<span>{{$t('strategy.interface.tooltips.horizontalAlign')}}</span>
				</v-tooltip>

				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" icon>
							<v-icon>mdi-format-vertical-align-center</v-icon>
						</v-btn>
					</template>
					<span>{{$t('strategy.interface.tooltips.verticalAlign')}}</span>
				</v-tooltip>

				<v-spacer></v-spacer>

				<!-- UNDO -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="ml-2" v-on="on" @click="undo()" :disabled="historyIdx < 0" icon>
							<v-icon>mdi-undo</v-icon>
						</v-btn>
					</template>
					<span>{{$t('strategy.interface.tooltips.undo')}}</span>
				</v-tooltip>

				<!-- REDO -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="ml-2" v-on="on" @click="redo()" :disabled="histories.length === 0 || historyIdx === histories.length - 1" icon>
							<v-icon>mdi-redo</v-icon>
						</v-btn>
					</template>
					<span>{{$t('strategy.interface.tooltips.redo')}}</span>
				</v-tooltip>

				<div class="ml-4"></div>

				<!-- ZOOM IN -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="ml-2" v-on="on" @click="setZoom(-1)" :disabled="canvas.zoom === zoomRange[0]" icon>
							<v-icon>mdi-magnify-minus-outline</v-icon>
						</v-btn>
					</template>
					<span>{{$t('strategy.interface.tooltips.zoomOut')}}</span>
				</v-tooltip>

				<span :class="{ 'text-center': true, 'white--text': dark }" style="width: 3rem">{{ (canvas.zoom * 100) }}%</span>

				<!-- ZOOM OUT -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" @click="setZoom(1)" :disabled="canvas.zoom === zoomRange[zoomRange.length - 1]" icon>
							<v-icon>mdi-magnify-plus-outline</v-icon>
						</v-btn>
					</template>
					<span>{{$t('strategy.interface.tooltips.zoomIn')}}</span>
				</v-tooltip>

				<!-- FULLSCREEN -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="ml-2" v-on="on" @click="toggleFullscreen()" icon>
							<v-icon v-if="!fullscreen.active">mdi-fullscreen</v-icon>
							<v-icon v-else>mdi-fullscreen-exit</v-icon>
						</v-btn>
					</template>
					<span>
						<span v-if="!fullscreen.active">{{$t('strategy.interface.tooltips.fullscreenOn')}}</span>
						<span v-else>{{$t('strategy.interface.tooltips.fullscreenOff')}}</span>
					</span>
				</v-tooltip>
			</v-toolbar>

			<div @wheel="handleWheel" @mousedown="handleMouseDown" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" class="grid-container perspective no-select scrollable d-flex" :style="viewportStyle">
				<div class="grid-padding relative">
					<div :ref="'grid_' + gridIdx" :key="gridIdx" v-for="(grid, gridIdx) in layers.data" v-on="getGridEvents(grid, gridIdx)" :class="getGridClasses(grid, gridIdx)" :style="getGridStyle(grid, gridIdx)">
						<v-fade-transition group>
							<div class="item" :key="itemIdx" v-on="getItemEvents(item, itemIdx)" :class="getItemClasses(item, itemIdx)" :style="getItemStyle(item, itemIdx)" v-for="(item, itemIdx) in items">

							</div>
						</v-fade-transition>

						<div class="side-left"></div>
						<div class="side-bottom"></div>

						<div class="drawing-handler" :style="drawingHandlerStyle"></div>
						<div class="drawing-ghost" :style="drawingGhostStyle"></div>
					</div>
				</div>
			</div>

			<!-- LAYERS -->
			<v-speed-dial absolute left bottom v-model="layers.enabled" direction="top">
				<template v-slot:activator>
					<v-tooltip left>
						<template v-slot:activator="{ tooltip }">
							<v-btn v-on="tooltip" v-model="layers.enabled" fab>
								<v-icon v-if="layers.enabled">mdi-close</v-icon>
								<v-icon v-else>mdi-layers-triple-outline</v-icon>
							</v-btn>
						</template>
						<span>{{$t('strategy.interface.tooltips.layers')}}</span>
					</v-tooltip>
				</template>
				<v-btn @click.stop="addLayer()" color="primary" dark small>
					<v-icon>mdi-plus</v-icon>
<!--					<span v-text="$t('strategy.interface.addLayer')"></span>-->
				</v-btn>
				<div class="d-flex align-center" :key="layerIdx" v-for="(layer, layerIdx) in layers.data">
					<v-btn class="ml-12" @click="setLayer(layerIdx)" :dark="layerIdx === layers.currentIdx" small>
<!--						<span v-text="layer.name"></span>-->
						<span>L{{ layerIdx }}</span>
					</v-btn>
					<v-btn @click.stop="removeLayer(layerIdx)" v-if="layers.data.length > 0" icon small>
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</div>
			</v-speed-dial>
		</div>

		<!-- SIDEBAR -->
		<v-navigation-drawer :width="sidebar.width" :style="drawerStyle" class="no-select">
			<div class="fill-height d-flex flex-column">
				<v-tabs style="flex: 0" v-model="drawer.tab" show-arrows grow>
					<v-tab v-text="$t('strategy.interface.stencils')"></v-tab>
<!--					<v-tab v-text="$t('strategy.interface.components')"></v-tab>-->
					<v-tab v-text="$t('strategy.interface.hierarchy')"></v-tab>
				</v-tabs>
				<div class="scrollable grey lighten-4 fill-height" style="flex: 1">
					<v-tabs-items class="fill-height" style="background-color: transparent" v-model="drawer.tab">
						<v-tab-item>
							<v-row class="pa-2" no-gutters>
								<v-col cols="3" class="pa-2" v-for="(stencil, stencilIdx) in stencils" :key="stencilIdx">
									<v-card :color="stencil.active ? 'primary' : null" :dark="stencil.active" class="pa-2 text-center">
										<v-icon x-large>{{ stencil.icon }}</v-icon>
										<div class="overline">{{ stencil.name }}</div>
									</v-card>
								</v-col>
							</v-row>
						</v-tab-item>
						<v-tab-item class="fill-height">
							<EmptyView v-if="itemLayers.length === 0" title="Aucune élément" desc="Dessiner de nouveau élément dans la grille" />
							<v-treeview v-else :items="itemLayers"></v-treeview>
						</v-tab-item>
						<v-tab-item>
							<v-row>
								<v-col v-for="(component, componentIdx) in components" :key="componentIdx">
									<span v-text="component.name"></span>
								</v-col>
							</v-row>
						</v-tab-item>
					</v-tabs-items>

<!--					<pre class="pa-4" v-text="drawingHandler"></pre>-->
<!--					<pre class="pa-4" v-text="mouseEvent.startPos"></pre>-->
<!--					<pre class="pa-4" v-text="items"></pre>-->
				</div>
			</div>
		</v-navigation-drawer>
	</div>
</template>

<script>
import Vue from 'vue';
import Page from "../../../components/Page";
import Hash from "../../../utils/Hash";
import EmptyView from "../../../components/EmptyView";

export default Vue.extend({

	props: ['strategy', 'formErrors', 'dark'],

	components: { EmptyView },

	created() {
		this.orientation = this.orientations[0];
	},

	mounted() {
		window.addEventListener('resize', this.handleWindowResize);
		document.addEventListener('mousemove', this.handleMouseMove);
		document.addEventListener('mouseup', this.handleMouseUp);

		this.$shortcuts.add(this.$t('shortcuts.strategyInterface.layers.title'), this.$t('shortcuts.strategyInterface.layers.desc'), 'strategyInterface', ['KeyL'], this.shortcutToggleLayer);
		this.$shortcuts.add(this.$t('shortcuts.strategyInterface.remove.title'), this.$t('shortcuts.strategyInterface.remove.desc'), 'strategyInterface', ['Delete'], this.shortcutItemRemove);
		this.$shortcuts.add(this.$t('shortcuts.strategyInterface.select.title'), this.$t('shortcuts.strategyInterface.select.desc'), 'strategyInterface', ['KeyS'], this.shortcutToolSelect);
		this.$shortcuts.add(this.$t('shortcuts.strategyInterface.draw.title'), this.$t('shortcuts.strategyInterface.draw.desc'), 'strategyInterface', ['KeyD'], this.shortcutToolDraw);
		this.$shortcuts.add(this.$t('shortcuts.strategyInterface.undo.title'), this.$t('shortcuts.strategyInterface.undo.desc'), 'strategyInterface', ['ControlLeft', 'KeyZ'], this.shortcutUndo);
		this.$shortcuts.add(this.$t('shortcuts.strategyInterface.redo.title'), this.$t('shortcuts.strategyInterface.redo.desc'), 'strategyInterface', ['ControlLeft', 'KeyY'], this.shortcutRedo);
		this.$shortcuts.add(this.$t('shortcuts.strategyInterface.zoomReset.title'), this.$t('shortcuts.strategyInterface.zoomReset.desc'), 'strategyInterface', ['ControlLeft', 'Digit0'], this.shortcutZoomReset);
		this.$shortcuts.add(this.$t('shortcuts.strategyInterface.zoomIn.title'), this.$t('shortcuts.strategyInterface.zoomIn.desc'), 'strategyInterface', ['ControlLeft', 'Equal'], this.shortcutZoomIn);
		this.$shortcuts.add(this.$t('shortcuts.strategyInterface.zoomOut.title'), this.$t('shortcuts.strategyInterface.zoomOut.desc'), 'strategyInterface', ['ControlLeft', 'Minus'], this.shortcutZoomOut);
		this.$shortcuts.add(this.$t('shortcuts.strategyInterface.fullscreen.title'), this.$t('shortcuts.strategyInterface.fullscreen.desc'), 'strategyInterface', ['AltLeft', 'KeyF'], this.shortcutFullscreen);

		this.handleWindowResize();
	},

	destroyed() {
		window.removeEventListener('resize', this.handleWindowResize);
		document.removeEventListener('mousemove', this.handleMouseMove);
		document.removeEventListener('mouseup', this.handleMouseUp);

		this.$shortcuts.remove(this.shortcutToggleLayer);
		this.$shortcuts.remove(this.shortcutItemRemove);
		this.$shortcuts.remove(this.shortcutToolSelect);
		this.$shortcuts.remove(this.shortcutToolDraw);
		this.$shortcuts.remove(this.shortcutUndo);
		this.$shortcuts.remove(this.shortcutRedo);
		this.$shortcuts.remove(this.shortcutZoomReset);
		this.$shortcuts.remove(this.shortcutZoomIn);
		this.$shortcuts.remove(this.shortcutZoomOut);
		this.$shortcuts.remove(this.shortcutFullscreen);
	},

	methods: {

		shortcutToggleLayer() {
			this.layers.enabled = !this.layers.enabled;
		},

		shortcutItemRemove() {
			this.removeItem(this.selectedItemIdx);
		},

		shortcutToolSelect() {
			this.setTool('select');
		},

		shortcutToolDraw() {
			this.setTool('draw');
		},

		shortcutUndo() {
			this.undo();
		},

		shortcutRedo() {
			this.redo();
		},

		shortcutZoomReset(event) {
			this.canvas.zoom = 1;
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

		handleWindowResize() {
			if (this.$refs.container) {
				this.rect.container = this.$refs.container.getBoundingClientRect();
			}
		},

		handleWheel(event) {
			if (event.ctrlKey) {
				const delta = Math.sign(event.deltaY);
				this.setZoom(-delta);
				event.preventDefault();

			}
		},

		handleMouseDown(event) {

			const pos = this.getSnapCoords(event.clientX, event.clientY);
			Object.assign(this.mouseEvent, {
				startPos: this.$deepClone(pos),
				currentPos: this.$deepClone(pos),
				endPos: this.$deepClone(pos),
				startClient: { x: event.clientX, y: event.clientY },
				currentClient: { x: event.clientX, y: event.clientY },
				endClient: { x: event.clientX, y: event.clientY },
			});

			this.handleToolSelectMouseDown(event, pos);
			this.handleToolDrawMouseDown(event, pos);
		},

		handleMouseMove(event) {

			if(this.mouseEvent.lastAnimationFrame) {
				cancelAnimationFrame(this.mouseEvent.lastAnimationFrame);
			}

			this.mouseEvent.lastAnimationFrame = window.requestAnimationFrame(() => {

				const pos = this.getSnapCoords(event.clientX, event.clientY);
				Object.assign(this.mouseEvent, {
					currentPos: this.$deepClone(pos),
					currentPosDelta: { x: pos.x - this.mouseEvent.currentPos.x, y: pos.y - this.mouseEvent.currentPos.y },
					currentClient: { x: event.clientX, y: event.clientY },
					currentClientDelta: { x: event.clientX - this.mouseEvent.currentClient.x, y: event.clientY - this.mouseEvent.currentClient.y },
				});

				if (event.buttons) {
					Object.assign(this.mouseEvent, {
						endPos: this.$deepClone(pos),
						endClient: { x: event.clientX, y: event.clientY },
					});
				}

				this.handleToolSelectMouseMove(event, pos);
				this.handleToolDrawMouseMove(event, pos);

				this.mouseEvent.lastAnimationFrame = null;
			});
		},

		handleMouseUp(event) {

			const pos = this.getSnapCoords(event.clientX, event.clientY);
			Object.assign(this.mouseEvent, {
				endPos: this.$deepClone(pos),
				endClient: { x: event.clientX, y: event.clientY },
			});

			this.handleToolSelectMouseUp(event, pos);
			this.handleToolDrawMouseUp(event, pos);
		},

		handleMouseEnter() {

			if (this.selectedTool === 'draw') {
				this.drawingHandler.visible = true;
			}
		},

		handleMouseLeave() {

			if (this.selectedTool === 'draw') {
				this.drawingHandler.visible = false;
			}
		},

		handleToolDrawMouseDown() {
			if (this.selectedTool === 'draw') {
				this.drawingHandler.isDrawing = true;
			}
		},

		handleToolDrawMouseMove(event, pos) {

			if (this.selectedTool === 'draw' && this.drawingHandler.visible) {

				if (!pos) {
					pos = this.getSnapCoords(event.clientX, event.clientY);
				}

				pos = this.applyCoordsLimit(pos);

				Object.assign(this.drawingHandler, {
					x: pos.x, y: pos.y,
					// isColliding: this.isColliding()
				});
			}
		},

		handleToolDrawMouseUp(event, pos) {
			if (this.drawingHandler.isDrawing) {

				const startPos = this.applyCoordsLimit(this.mouseEvent.startPos);
				const endPos = this.applyCoordsLimit(this.mouseEvent.endPos);

				this.addItem(startPos, endPos);

				Object.assign(this.drawingHandler, {
					isDrawing: false,
				});
			}
		},

		handleToolSelectMouseDown(event, pos) {

			if (this.selectedTool === 'move' && this.selectedItemIdx !== null) {

				const item = this.items[this.selectedItemIdx];
				const itemPos = item.orientation[this.orientation.key].pos;

				this.toolSelectStartItemPos = this.$deepClone(itemPos);
			}
		},

		handleToolSelectMouseMove(event, pos) {

			if (this.selectedTool === 'move' && event.buttons && this.selectedItemIdx !== null) {

				const item = this.items[this.selectedItemIdx];
				const itemPos = item.orientation[this.orientation.key].pos;

				const diffX = this.mouseEvent.currentPosDelta.x;
				const diffY = this.mouseEvent.currentPosDelta.y;

				if (diffX === 0 && diffY === 0) {
					return;
				}

				itemPos.startX += diffX;
				itemPos.startY += diffY;
				itemPos.endX += diffX;
				itemPos.endY += diffY;
			}
		},

		handleToolSelectMouseUp(event, pos) {

			if (this.selectedTool === 'move' && this.selectedItemIdx !== null) {

				const item = this.items[this.selectedItemIdx];
				const itemPos = item.orientation[this.orientation.key].pos;

				if (JSON.stringify(itemPos) === JSON.stringify(this.toolSelectStartItemPos)) {
					return;
				}

				const newPos = this.$deepClone(itemPos);

				this.addHistory(() => {
					Object.assign(itemPos, newPos);
				}, () => {
					Object.assign(itemPos, this.toolSelectStartItemPos);
				}, false);
			}
		},

		handleItemMouseDown(event, item, itemIdx) {

			if (this.selectedItemIdx !== itemIdx) {
				this.selectedItemIdx = itemIdx;
			}
		},

		handleItemClick(event, item, itemIdx) {

			if (this.selectedItemIdx === itemIdx) {
				this.selectedItemIdx = null;
			}
		},

		handleGridClick(event, grid, gridIdx) {
			this.layers.currentIdx = gridIdx;
			this.closeLayerMode();
		},

		handleGridMouseEnter(event, grid, gridIdx) {
			this.layers.hoveredIdx = gridIdx;

			event.stopPropagation();
		},

		handleGridMouseMove(event, grid, gridIdx) {
			event.stopPropagation();
		},

		handleGridMouseLeave(event, grid, gridIdx) {
			this.layers.hoveredIdx = this.layers.currentIdx;

			event.stopPropagation();
		},

		toggleFullscreen() {
			this.fullscreen.active = !this.fullscreen.active;
			setTimeout(() => {
				window.dispatchEvent(new Event('resize'));
			});
		},

		setZoom(direction = 1) {
			const index = this.zoomRange.indexOf(this.canvas.zoom);
			const newZoom = this.zoomRange[index + direction];
			if (index !== -1 && newZoom !== undefined) {
				this.canvas.zoom = newZoom;
			}

			// if (this.drawingHandler.visible) {
			// 	const pos = this.getSnapCoords(this.mouseEvent.currentClient.x, this.mouseEvent.currentClient.y);
			// 	Object.assign(this.mouseEvent, {
			// 		currentPos: this.$deepClone(pos),
			// 	});
			// 	Object.assign(this.drawingHandler, {
			// 		x: pos.x, y: pos.y,
			// 		// isColliding: this.isColliding()
			// 	});
			// }
		},

		getSnapCoords(x, y, limited = false) {

			const currentGrid = this.$refs['grid_' + this.layers.currentIdx][0];

			if (!currentGrid) {
				return {
					x: 0,
					y: 0,
				};
			}
			const coords = [
				Math.round((x - currentGrid.getBoundingClientRect().left) / this.snapSize) * this.snapSize,
				Math.round((y - currentGrid.getBoundingClientRect().top) / this.snapSize) * this.snapSize,
			];

			let pos = {
				x: coords[0],
				y: coords[1],
			};

			if (limited) {
				pos = this.applyCoordsLimit(pos);
			}

			return pos;
		},

		applyCoordsLimit(pos) {

			const newPos = this.$deepClone(pos);
			const maxX = this.orientation.snap.x * this.snapSize;
			const maxY = this.orientation.snap.y * this.snapSize;

			if (newPos.x < 0) { newPos.x = 0; }
			else if (newPos.x > maxX) { newPos.x = maxX; }
			if (newPos.y < 0) { newPos.y = 0; }
			else if (newPos.y > maxY) { newPos.y = maxY; }

			return newPos;
		},

		getItemClasses(item, itemIdx) {

			return {
				selected: this.selectedItemIdx === itemIdx
			};
		},

		getItemStyle(item, itemIdx) {
			const itemOrientation = item.orientation[this.orientation.key];
			if (!itemOrientation) {
				return {};
			}
			const pos = itemOrientation.pos;
			return {
				outlineColor: this.selectedItemIdx === itemIdx ? this.$vuetify.theme.themes.light.secondary : this.$vuetify.theme.themes.light.primary,
				backgroundColor: this.selectedItemIdx === itemIdx ? 'rgba(255, 115, 131, 0.1)' : 'rgba(27, 142, 138, 0.1)',
				left: (pos.startX * this.canvas.zoom) + 'px',
				top: (pos.startY * this.canvas.zoom) + 'px',
				width: ((pos.endX - pos.startX) * this.canvas.zoom) + 'px',
				height: ((pos.endY - pos.startY) * this.canvas.zoom) + 'px',
			};
		},

		getItemEvents(item, itemIdx) {
			const events = {};

			switch (this.selectedTool) {
				case 'move':
					events.mousedown = event => this.handleItemMouseDown(event, item, itemIdx);
					events.click = event => this.handleItemClick(event, item, itemIdx);
					break;
			}

			return events;
		},

		addItem(startPos, endPos) {

			const orientation = {};

			const x = [startPos.x, endPos.x].sort((a, b) => a - b);
			const y = [startPos.y, endPos.y].sort((a, b) => a - b);

			if (x[0] === x[1] || y[0] === y[1]) {
				return;
			}

			orientation[this.orientation.key] = { pos: { startX: x[0] / this.canvas.zoom, startY: y[0] / this.canvas.zoom, endX: x[1] / this.canvas.zoom, endY: y[1] / this.canvas.zoom } };

			this.addHistory(() => {
				this.items.push({
					guid: Hash.guid(),
					name: 'Item #' + this.items.length,
					orientation,
					layer: this.layers.currentIdx,
				});
			}, () => {
				this.items.splice(this.items.length - 1, 1);
			});
		},

		isColliding(firstPos, secondPos) {
			return !(
				(firstPos.endY < secondPos.startY) ||
				(firstPos.startY > secondPos.endY) ||
				(firstPos.endX < secondPos.startX) ||
				(firstPos.startX > secondPos.endX)
			);
		},

		setTool(tool) {

			this.selectedToolIdx = this.tools.indexOf(tool);
		},

		addHistory(forward = () => {}, backward = () => {}, run = true) {

			this.histories.splice(this.historyIdx + 1, this.histories.length);
			this.histories.push({ forward: () => {
				forward();
				this.historyIdx++;
			}, backward: () => {
				backward();
				this.historyIdx--;
			} });

			if (run) {
				this.histories[this.histories.length - 1].forward();
			} else {
				this.historyIdx++;
			}
		},

		undo() {
			if (this.historyIdx < 0) {
				return;
			}

			this.histories[this.historyIdx].backward();
		},

		redo() {
			if (this.historyIdx === this.histories.length - 1) {
				return;
			}

			this.histories[this.historyIdx + 1].forward();
		},

		removeItem(itemIdx) {

			const item = this.items[itemIdx];
			const itemClone = this.$deepClone(item);
			if (item) {
				this.addHistory(() => {
					this.items.splice(itemIdx, 1);
				}, () => {
					this.items.splice(itemIdx, 0, itemClone);
				});
			}
		},

		closeLayerMode() {
			this.layers.enabled = false;
		},

		setLayer(layerIdx) {
			this.layers.currentIdx = layerIdx;
		},

		removeLayer(layerIdx) {
			this.layers.data.splice(layerIdx, 1);
		},

		addLayer() {

			this.layers.data.push({
				name: 'Layer ' + (this.layers.data.length + 1)
			});
		},

		getGridEvents(grid, gridIdx) {
			const events = {};

			if (this.layers.enabled) {
				events.click = event => this.handleGridClick(event, grid, gridIdx);
				events.mouseenter = event => this.handleGridMouseEnter(event, grid, gridIdx);
				events.mousemove = event => this.handleGridMouseMove(event, grid, gridIdx);
				events.mouseleave = event => this.handleGridMouseLeave(event, grid, gridIdx);
			}

			return events;
		},

		getGridClasses(grid, gridIdx) {
			return {
				'grid white perspective': true,
				current: this.layers.currentIdx === gridIdx,
				hovered: this.layers.hoveredIdx === gridIdx,
			};
		},

		getGridStyle(grid, gridIdx) {
			return {
				backgroundSize: this.snapSize + 'px ' + this.snapSize + 'px',
				width: this.orientation.snap.x * this.snapSize + 'px',
				height: this.orientation.snap.y * this.snapSize + 'px',
				top: this.layers.enabled ? 'calc(-8rem * ' + gridIdx + ' * ' +  this.zoomSize + ')' : null,
				left: this.layers.enabled ? 'calc(2.5rem * ' + gridIdx + ' * ' +  this.zoomSize + ')' : null,
			};
		},
	},

	computed: {

		itemLayers() {
			const items = [];
			this.items.forEach(item => {
				items.push({
					id: item.guid,
					name: item.name,
				});
			});
			return items;
		},

		containerClasses() {

			const classes = {
				'layer-mode': this.layers.enabled,
				'main-container': true,
				'd-flex fill-height': true,
				fullscreen: this.fullscreen.active,
			};

			classes['tool-' + this.selectedTool] = true;

			return classes;
		},

		selectedTool() {
			return this.tools[this.selectedToolIdx];
		},

		viewportStyle() {

			return {
				width: (this.rect.container.width - this.sidebar.width) + 'px',
				height: '100%',
			};
		},

		drawerStyle() {
			return {
				zIndex: 1,
				borderLeft: '#ccc solid 1px',
				// minWidth: this.sidebar.width + 'px',
			};
		},

		snapSize() {
			return this.orientation.snap.size * this.zoomSize;
		},

		zoomSize() {
			return this.layers.enabled ? 0.5 : this.canvas.zoom * this.orientation.snap.zoom;
		},

		gridPaddingStyle() {
			return {
				width: this.orientation.snap.x * this.snapSize + 'px',
				height: this.orientation.snap.y * this.snapSize + 'px',
			};
		},

		drawingHandlerStyle() {
			const scale = this.drawingHandler.isDrawing ? 0 : 1;
			return {
				opacity: this.drawingHandler.visible ? 1 : 0,
				backgroundColor: this.$vuetify.theme.themes.light.primary,
				transform: 'translateX(' + this.drawingHandler.x + 'px) translateY(' + this.drawingHandler.y + 'px) scale(' + scale + ')',
			};
		},

		drawingGhostStyle() {

			const startPos = this.applyCoordsLimit(this.mouseEvent.startPos);
			const endPos = this.applyCoordsLimit(this.mouseEvent.endPos);

			const x = [startPos.x, endPos.x].sort((a, b) => a - b);
			const y = [startPos.y, endPos.y].sort((a, b) => a - b);

			return {
				opacity: this.drawingHandler.isDrawing ? 0.25 : 0,
				backgroundColor: this.$vuetify.theme.themes.light.primary,
				top: y[0] + 'px',
				left: x[0] + 'px',
				width: (x[1] - x[0]) + 'px',
				height: (y[1] - y[0]) + 'px',
			};
		},
	},

	data() {
		return {
			selectedToolIdx: 0,
			selectedItemIdx: null,
			rect: {
				container: {},
			},
			zoomRange: [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 6, 8],
			selectedItem: {
				index: null,
				originalPos: { x: 0, y: 0, },
			},
			mouseEvent: {
				startPos: { x: 0, y: 0, },
				currentPos: { x: 0, y: 0, },
				endPos: { x: 0, y: 0, },
				startClient: { x: 0, y: 0, },
				currentClient: { x: 0, y: 0, },
				endClient: { x: 0, y: 0, },
				lastAnimationFrame: null,
			},
			drawingHandler: {
				visible: false,
				isDrawing: false,
				x: 0,
				y: 0,
			},
			drawer: {
				tab: null,
			},
			fullscreen: {
				active: false,
			},
			canvas: {
				zoom: 1,
			},
			layers: {
				data: [
					{ guid: Hash.guid(), name: 'Layer 1' },
				],
				currentIdx: 0,
				hoveredIdx: 0,
				enabled: false,
			},
			sidebar: {
				width: 400,
			},
			historyIdx: -1,
			histories: [],
			tools: ['move', 'draw'],
			// tools: ['move', 'select', 'draw'],
			orientation: null,
			toolSelectStartItemPos: { x: 0, y: 0 },
			orientations: [
				{ key: '16/9', name: this.$t('strategy.interface.orientations._16_9'), snap: { size: 20, x: 16 * 4, y: 9 * 4, zoom: 0.5 } }, // Desktop landscape
				{ key: '9/16', name: this.$t('strategy.interface.orientations._9_16'), snap: { size: 20, x: 9 * 4, y: 16 * 4, zoom: 0.5 } }, // Mobile portrait
				{ key: '4/3', name: this.$t('strategy.interface.orientations._4_3') , snap: { size: 20, x: 4 * 8, y: 3 * 8, zoom: 1 } }, // Tablet landscape
				{ key: '3/4', name: this.$t('strategy.interface.orientations._3_4') , snap: { size: 20, x: 3 * 8, y: 4 * 8, zoom: 1 } }, // Tablet portrait
			],
			stencils: [
				{ active: true, icon: 'mdi-rectangle-outline', name: 'Zone', },
				{ icon: 'mdi-text', name: 'Text', },
				{ icon: 'mdi-image-outline', name: 'Image', },
				{ icon: 'mdi-textbox', name: 'Input', },
				{ icon: 'mdi-video-outline', name: 'Video', },
				{ icon: 'mdi-view-list', name: 'List', },
			],
			components: [],
			items: [],
		}
	},

	watch: {

		'layers.enabled'(visible) {
			if (visible) {
				this.layers.hoveredIdx = this.layers.currentIdx;
			}
		}
	}
})
</script>

<style lang="scss" scoped>

	.main-container.tool-pointer {
		.grid-container {
			.item.selected {
				/*cursor: grab;*/
			}
		}
	}

	.main-container.tool-draw {
		.grid-container {
			cursor: cell;
		}
	}

	.main-container.layer-mode {

		.grid-container {

			.grid {
				background: none;
				cursor: pointer;

				&:not(.hovered) {
					opacity: 0.25;
					pointer-events: auto;

					&:hover {
						opacity: 1;
						cursor: pointer;
					}

					.side-left,
					.side-bottom {
						opacity: 1;
					}
				}

				&.current {

					.side-left,
					.side-bottom {
						/*background-color: blue;*/
					}
				}

				transform: rotateX(60deg) rotateY(0) rotateZ(-30deg);

				.side-left {
					left: -0.55rem;
					top: 0.6rem;
					width: 0.5rem;
					transform: skew(0deg, -60deg);
				}
				.side-bottom {
					left: -0.3rem;
					bottom: -1.1rem;
					height: 1rem;
					transform: skew(-30deg, 0deg);
				}
			}
		}
	}

	.grid-container {

		.grid-padding {
			margin: auto;
			padding: 1rem;
			transition: transform 300ms ease;
			box-sizing: border-box;
			position: relative;
		}

		.grid {
			margin-bottom: 0;
			position: relative;
			border-bottom: rgba(0, 0, 0, 0.15) solid 1px !important;
			border-right: rgba(0, 0, 0, 0.15) solid 1px !important;
			transition: all 300ms ease;

			&:not(.hovered) {
				opacity: 0;
				pointer-events: none;

				.side-left,
				.side-bottom {
					opacity: 0;
				}
			}

			&:not(.current) {
				top: 1rem;
				left: 1rem;
				position: absolute;
			}

			.side-left {
				position: absolute;
				left: 0;
				top: 0;
				width: 0;
				height: 100%;
				background-color: #ccc;
				transition: all 300ms ease;
			}

			.side-bottom {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 0;
				background-color: #ddd;
				transition: all 300ms ease;
				transform: skew(10deg, 0deg);
			}
		}

		.item {
			position: absolute;
			outline-offset: -1px;
			outline-style: solid;
			outline-width: 2px;
			transition: all 300ms ease;

			&.selected {
				transition: none !important;
			}

			&.selected {
				outline-width: 4px;
			}
		}
	}

	.layer-toolbar {
		bottom: 1rem;
		left: 1rem;
	}

	.double-icon {
		.mdi:nth-child(1) {
			margin-top: -0.5rem;
			margin-right: -0.25rem;
		}
		.mdi:nth-child(2) {
			margin-bottom: -0.5rem;
			margin-left: -0.25rem;
		}
	}

	.fullscreen {

		.grid-container {
			width: 100% !important;
		}

		.preview-container {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 6;
		}
	}

	.drawing-handler {
		position: absolute;
		pointer-events: none;
		border-radius: 100%;
		width: 1rem;
		height: 1rem;
		margin-top: -0.5rem;
		margin-left: -0.5rem;
		transition: opacity 500ms ease, transform 50ms ease;
	}
	.drawing-ghost {
		position: absolute;
		pointer-events: none;
		transition: opacity 300ms ease;
	}

	.v-tabs-items::v-deep .v-window__container {
		height: 100%;
	}
</style>

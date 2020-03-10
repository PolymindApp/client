<template>
	<div ref="container" :class="{ 'd-flex fill-height': true, 'fullscreen': fullscreen.active }">

		<!-- MAIN CONTENT -->
		<div class="d-flex flex-column fill-height preview-container" style="flex: 1">
			<v-toolbar ref="previewToolbar" class="preview-toolbar no-select" :dark="dark" style="flex: 0; z-index: 1;" dense>

				<v-spacer></v-spacer>

				<!-- UNDO -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="ml-2" v-on="on" @click="undo()" :disabled="historyIdx < 0" icon>
							<v-icon>mdi-undo</v-icon>
						</v-btn>
					</template>
					<span>{{$t('strategy.interface.undo')}}</span>
				</v-tooltip>

				<!-- REDO -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="ml-2" v-on="on" @click="redo()" :disabled="histories.length === 0 || historyIdx === histories.length - 1" icon>
							<v-icon>mdi-redo</v-icon>
						</v-btn>
					</template>
					<span>{{$t('strategy.interface.redo')}}</span>
				</v-tooltip>

				<div class="ml-4"></div>

				<!-- ZOOM IN -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="ml-2" v-on="on" @click="setZoom(-1)" :disabled="canvas.zoom === zoomRange[0]" icon>
							<v-icon>mdi-magnify-minus-outline</v-icon>
						</v-btn>
					</template>
					<span>{{$t('strategy.workflow.zoomOut')}}</span>
				</v-tooltip>

				<span :class="{ 'text-center': true, 'white--text': dark }" style="width: 3rem">{{ (canvas.zoom * 100) }}%</span>

				<!-- ZOOM OUT -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" @click="setZoom(1)" :disabled="canvas.zoom === zoomRange[zoomRange.length - 1]" icon>
							<v-icon>mdi-magnify-plus-outline</v-icon>
						</v-btn>
					</template>
					<span>{{$t('strategy.workflow.zoomIn')}}</span>
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
						<span v-if="!fullscreen.active">{{$t('strategy.workflow.fullscreenOn')}}</span>
						<span v-else>{{$t('strategy.workflow.fullscreenOff')}}</span>
					</span>
				</v-tooltip>
			</v-toolbar>

			<div @wheel="handleWheel" @mousedown="handleMouseDown" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" class="grid-container no-select scrollable grey lighten-3 d-flex" :style="viewportStyle">
				<div class="grid-padding">
					<div ref="grid" class="grid white" :style="gridStyle">
						<svg class="fill-height no-select w-100">
							<g :ref="'item_' + itemIdx" @contextmenu="handleContextMenu($event, item, itemIdx)" @dblclick="handleDblClick($event, item, itemIdx)" @mouseenter="handleMouseEnter($event, item, itemIdx)" @mouseleave="handleMouseLeave($event, item, itemIdx)" @mousedown="handleMouseDown($event, item, itemIdx)" :style="item.style" :class="item.classes" :key="itemIdx" v-for="(item, itemIdx) in items">
								<svg :x="item.x - 5" :y="item.y - 5">
									<rect x="5" y="5" width="100" height="100" stroke="#529fca" stroke-width="3" fill="white" />

									<rect x="0" y="0" width="10" height="10" fill="#529fca" />
									<rect x="50" y="0" width="10" height="10" fill="#529fca" />
									<rect x="100" y="0" width="10" height="10" fill="#529fca" />

									<rect x="0" y="50" width="10" height="10" fill="#529fca" />
									<rect x="100" y="50" width="10" height="10" fill="#529fca" />

									<rect x="0" y="100" width="10" height="10" fill="#529fca" />
									<rect x="50" y="100" width="10" height="10" fill="#529fca" />
									<rect x="100" y="100" width="10" height="10" fill="#529fca" />

									<text x="30" y="60" text-rendering="optimizeLegibility" v-text="item.name"></text>
								</svg>
							</g>
						</svg>

						<div class="drawing-handler" :style="drawingHandlerStyle"></div>
						<div class="drawing-ghost" :style="drawingGhostStyle"></div>
					</div>
				</div>
			</div>
		</div>

		<!-- SIDEBAR -->
		<v-navigation-drawer :width="sidebar.width" style="z-index: 1; border-left: #ccc solid 1px" class="no-select">
			<div class="fill-height d-flex flex-column">
				<v-tabs style="flex: 0" v-model="drawer.tab" show-arrows grow>
					<v-tab v-text="$t('strategy.workflow.components')"></v-tab>
					<v-tab v-text="$t('strategy.workflow.datasets')"></v-tab>
					<v-tab v-text="$t('strategy.workflow.documents')"></v-tab>
				</v-tabs>
				<div class="scrollable grey lighten-4" style="flex: 1">
					<v-tabs-items style="background-color: transparent" v-model="drawer.tab">
						<v-tab-item>
							<v-row class="pa-2" no-gutters>
								<v-col cols="6" class="pa-2" v-for="(stencil, stencilIdx) in stencils" :key="stencilIdx">
									<v-card :color="stencil.active ? 'primary' : null" :dark="stencil.active" class="pa-8 text-center">
										<v-icon x-large>{{ stencil.icon }}</v-icon>
									</v-card>
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

export default Vue.extend({

	props: ['strategy', 'formErrors', 'dark'],

	mounted() {
		window.addEventListener('resize', this.handleWindowResize);
		document.addEventListener('mousemove', this.handleMouseMove);
		document.addEventListener('mouseup', this.handleMouseUp);

		this.$shortcuts.add(this.$t('shortcuts.strategyWorkflow.undo.title'), this.$t('shortcuts.strategyWorkflow.undo.desc'), 'strategyWorkflow', ['ControlLeft', 'KeyZ'], this.shortcutUndo);
		this.$shortcuts.add(this.$t('shortcuts.strategyWorkflow.redo.title'), this.$t('shortcuts.strategyWorkflow.redo.desc'), 'strategyWorkflow', ['ControlLeft', 'KeyY'], this.shortcutRedo);
		this.$shortcuts.add(this.$t('shortcuts.strategyWorkflow.zoomReset.title'), this.$t('shortcuts.strategyWorkflow.zoomReset.desc'), 'strategyWorkflow', ['ControlLeft', 'Digit0'], this.shortcutZoomReset);
		this.$shortcuts.add(this.$t('shortcuts.strategyWorkflow.zoomIn.title'), this.$t('shortcuts.strategyWorkflow.zoomIn.desc'), 'strategyWorkflow', ['ControlLeft', 'Equal'], this.shortcutZoomIn);
		this.$shortcuts.add(this.$t('shortcuts.strategyWorkflow.zoomOut.title'), this.$t('shortcuts.strategyWorkflow.zoomOut.desc'), 'strategyWorkflow', ['ControlLeft', 'Minus'], this.shortcutZoomOut);
		this.$shortcuts.add(this.$t('shortcuts.strategyWorkflow.fullscreen.title'), this.$t('shortcuts.strategyWorkflow.fullscreen.desc'), 'strategyWorkflow', ['AltLeft', 'KeyF'], this.shortcutFullscreen);

		this.handleWindowResize();

		for (let i = 0; i < 10; i++) {
			this.items.push({
				name: 'Item #' + i,
				y: Math.round((Math.random() * 500) / this.snapSize) * this.snapSize,
				x: Math.round((Math.random() * 800) / this.snapSize) * this.snapSize,
			});
		}
	},

	destroyed() {
		window.removeEventListener('resize', this.handleWindowResize);
		document.removeEventListener('mousemove', this.handleMouseMove);
		document.removeEventListener('mouseup', this.handleMouseUp);

		this.$shortcuts.remove(this.shortcutUndo);
		this.$shortcuts.remove(this.shortcutRedo);
		this.$shortcuts.remove(this.shortcutZoomReset);
		this.$shortcuts.remove(this.shortcutZoomIn);
		this.$shortcuts.remove(this.shortcutZoomOut);
		this.$shortcuts.remove(this.shortcutFullscreen);
	},

	methods: {

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

		handleMouseDown(event, item, itemIdx) {
			Object.assign(this.selectedItem, {
				index: itemIdx,
				startPos: { x: event.clientX, y: event.clientY },
				originalPos: { x: item.x, y: item.y },
			});
		},

		handleMouseMove(event) {

			if(this.selectedItem.lastAnimationFrame) {
				cancelAnimationFrame(this.selectedItem.lastAnimationFrame);
			}

			this.selectedItem.lastAnimationFrame = window.requestAnimationFrame(() => {
				if (this.selectedItem.index !== null) {
					const item = this.items[this.selectedItem.index];
					let [x, y] = [
						Math.round((this.selectedItem.originalPos.x + (event.clientX - this.selectedItem.startPos.x)) / this.snapSize) * this.snapSize,
						Math.round((this.selectedItem.originalPos.y + (event.clientY - this.selectedItem.startPos.y)) / this.snapSize) * this.snapSize,
					];
					if (x < 0) {
						x = 0;
					}
					if (y < 0) {
						y = 0;
					}
					Object.assign(item, {x, y});
				}

				this.selectedItem.lastAnimationFrame = null;
			});
		},

		handleMouseUp(event) {
			if (this.selectedItem.index !== null) {
				this.selectedItem.index = null;
			}
		},

		handleMouseEnter(event, item, itemIdx) {

		},

		handleMouseLeave(event, item, itemIdx) {

		},

		handleDblClick(event, item, itemIdx) {

		},

		handleContextMenu(event, item, itemIdx) {

		},


		toggleFullscreen() {
			this.fullscreen.active = !this.fullscreen.active;
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
	},

	computed: {

		viewportStyle() {

			return {
				width: (this.rect.container.width - this.sidebar.width) + 'px',
				height: '100%',
			};
		},

		snapSize() {
			return this.orientation.snap.size * this.zoomSize;
		},

		zoomSize() {
			return this.canvas.zoom * this.orientation.snap.zoom;
		},

		gridStyle() {
			return {
				backgroundSize: this.snapSize + 'px ' + this.snapSize + 'px',
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

			const x = [this.mouseEvent.startPos.x, this.mouseEvent.endPos.x].sort((a, b) => a - b);
			const y = [this.mouseEvent.startPos.y, this.mouseEvent.endPos.y].sort((a, b) => a - b);

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
			rect: {
				container: {},
			},
			snapSize: 20,
			selectedItem: {
				index: null,
				lastAnimationFrame: null,
				startPos: { x: 0, y: 0, },
				originalPos: { x: 0, y: 0, },
			},
			drawer: {
				tab: null,
			},
			stencils: {
				components: [],
				datasets: [],
				documents: [],
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
			sidebar: {
				width: 400,
			},
			stencils: [
				{ icon: 'mdi-transit-connection-variant' },
				{ active: true, icon: 'mdi-rectangle-outline' },
				{ icon: 'mdi-ellipse-outline' },
				{ icon: 'mdi-triangle-outline' },
				{ icon: 'mdi-pentagon-outline' },
			],
			items: [],
			orientation: { key: '16/9', snap: { size: 20, x: 16 * 4, y: 9 * 4, zoom: 0.5 } },
			zoomRange: [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 6, 8],
			mouseEvent: {
				startPos: { x: 0, y: 0, },
				currentPos: { x: 0, y: 0, },
				endPos: { x: 0, y: 0, },
				lastAnimationFrame: null,
			},
			fullscreen: {
				active: false,
			},
			canvas: {
				zoom: 1,
			},
			historyIdx: -1,
			histories: [],
		}
	}
})
</script>

<style lang="scss" scoped>

	.grid-container {

		position: relative;

		.grid-padding {
			margin: auto;
			padding: 1rem;
		}

		.grid {
			position: relative;
			border-bottom: rgba(0, 0, 0, 0.15) solid 1px !important;
			border-right: rgba(0, 0, 0, 0.15) solid 1px !important;
			transition: all 300ms ease;
		}

		svg {

			g {
				cursor: grab;
			}
			svg {
				transition: x .5s ease;
			}
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
</style>

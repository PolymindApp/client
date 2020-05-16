<template>
	<v-menu v-model="show" v-bind="$attrs" max-height="400" color="white">
		<v-list dense>

			<template v-for="(item, index) in items">

				<ContextualMenu v-if="show && item.childState" :items="item.childs" :visible="item.childState.visible" :position-x="item.childState.x" :position-y="item.childState.y" :deepnest="deepnest + 1" absolute offset-y />

				<v-list-item v-if="item.text" :class="{ 'v-list-item--active primary--text': item.isActive && item.isActive() }" :disabled="item.disabled()" :key="index" v-on="getEvents(item)">
					<v-list-item-icon class="mr-2">
						<v-icon v-if="typeof item.icon === 'function'" v-text="item.icon()" small></v-icon>
						<v-icon v-else v-text="item.icon" small></v-icon>
					</v-list-item-icon>
					<v-list-item-title>
						<template v-if="item.select">
							<v-select :label="item.text" v-on="item.select.listeners" v-bind="item.select.attrs" dense solo flat hide-details></v-select>
						</template>
						<template v-else>
							{{ item.text }}
						</template>
					</v-list-item-title>
					<v-list-item-action v-if="item.childs" class="ml-2">
						<v-icon small>mdi-chevron-right</v-icon>
					</v-list-item-action>
				</v-list-item>

				<v-divider class="my-2" v-else :key="index"></v-divider>
			</template>
		</v-list>
	</v-menu>
</template>

<script>
    import Vue from 'vue';
	import { Hash } from "@polymind/sdk-js";

    export default Vue.extend({

        name: 'ContextualMenu',

        props: {
        	items: {
        		type: Array,
				default: () => [],
			},
        	visible: {
        		type: Boolean,
				default: false,
			},
        	deepnest: {
        		type: Number,
				default: 0,
			},
		},

        components: {},

        mounted() {

        },

        destroyed() {

        },

        methods: {

        	getEvents(item) {

        		if (!item.guid) {
					item.guid = Hash.guid();
				}

        		const group = {
        			click: [],
        			mouseenter: [],
        			mousedown: [],
        			mouseup: [],
        			mouseleave: [],
				};
        		if (item.click) {
					group.click.push(item.click);
				}
				group.mouseenter.push(event => {
        			this.items.forEach(otherItem => {
        				if (otherItem.guid === item.guid) {
        					return;
						}
        				if (otherItem.hideMenu) {
        					otherItem.hideMenu(0);
						}
					});
				});
        		if (item.childs) {
					group.mouseenter.push(event => {

        				if (!item.childState) {
							item.childState = {};
							item.cancelHideMenu = () => {
								clearTimeout(item.hideMenuTimeout);
							};
							item.hideMenu = (timeout = 500) => {
								item.hideMenuTimeout = setTimeout(() => {
									Object.assign(item.childState, {
										visible: false,
									});
									this.$forceUpdate();
								}, timeout);
							};
							item.showMenu = event => {
								item.cancelHideMenu();
								const target = event.currentTarget;
								const boundingBox = target.getBoundingClientRect();
								Object.assign(item.childState, {
									visible: true,
									x: boundingBox.left + boundingBox.width,
									y: boundingBox.top - 8,
								});
								this.$forceUpdate();
							};
						}

						item.showMenu(event);
					});
				}

				const events = {
					click: event => group.click.map(click => click(event)),
					mouseenter: event => group.mouseenter.map(mouseenter => mouseenter(event)),
					mousedown: event => group.mousedown.map(mousedown => mousedown(event)),
					mouseup: event => group.mouseup.map(mouseup => mouseup(event)),
					mouseleave: event => group.mouseleave.map(mouseleave => mouseleave(event)),
				};

        		return events;
			},
		},

        computed: {

		},

        data() {
            return {
				show: this.visible,
			};
        },

		watch: {

        	visible(val) {
				this.show = val;
			},

        	show(val) {
				this.$emit('update:visible', val);
			},
		}
    });
</script>

<style lang="scss" scoped>

</style>

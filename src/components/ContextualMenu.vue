<template>
	<v-menu v-model="show" v-bind="$attrs" v-on="$listeners">
		<v-list dense>
			<template v-for="(item, index) in items">

				<ContextualMenu v-if="show && item.childState" :items="item.childs" :visible="item.childState.visible" :position-x="item.childState.x" :position-y="item.childState.y" absolute offset-y />

				<v-list-item v-if="item.text" :class="{ 'v-list-item--active primary--text': item.isActive && item.isActive() }" :disabled="item.disabled()" :key="index" v-on="getEvents(item)">
					<v-list-item-icon class="mr-2">
						<v-icon v-if="typeof item.icon === 'function'" v-text="item.icon()" small></v-icon>
						<v-icon v-else v-text="item.icon" small></v-icon>
					</v-list-item-icon>
					<v-list-item-title>{{ item.text }}</v-list-item-title>
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

    export default Vue.extend({

        name: 'ContextualMenu',

        props: ['items', 'visible'],

        components: {},

        mounted() {

        },

        destroyed() {

        },

        methods: {

        	getEvents(item) {
        		const events = {};
        		if (item.click) {
        			events.click = item.click;
				}
        		if (item.childs) {
        			events.mouseleave = event => {
        				// item.hideMenu();
					};
        			events.mouseenter = event => {

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
								const target = event.currentTarget;
								const boundingBox = target.getBoundingClientRect();
								Object.assign(item.childState, {
									visible: true,
									x: boundingBox.left + boundingBox.width,
									y: boundingBox.top - 8,
								});
								this.$forceUpdate();
							};
							item.showMenu(event);
						}

						item.cancelHideMenu();
					};
					events.click = event => {
						item.showMenu(event);
						event.stopPropagation();
					};
				}
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

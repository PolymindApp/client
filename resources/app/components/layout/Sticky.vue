<template>
	<v-sheet v-resize="onResize" :style="style" v-bind="$attrs" v-on="$listeners">
		<slot></slot>
	</v-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Sticky extends Vue {
    @Prop({ type: Boolean, default: false }) value: boolean;

    stickyTop = '64px';
    maxHeight = '100vh';

    get style() {
        return this.value ? {
            top: this.stickyTop,
            position: 'sticky',
            maxHeight: this.maxHeight,
            overflow: 'auto',
            zIndex: 3,
        } : null;
    }

    onResize() {
        const appBarHeight = document.getElementsByClassName('v-app-bar')[0].clientHeight || this.$vuetify.application.top || 64;
        this.stickyTop = appBarHeight + 'px';
        this.maxHeight = window.innerHeight - (appBarHeight || parseInt(this.stickyTop)) + 'px';
    }

	mounted() {
		setTimeout(this.onResize);
	}
}
</script>

<template>
    <div id="tourify">
        <v-fade-transition>
            <div v-if="_value" ref="container" class="tourify-overlay-container">
                <slot name="overlay">
                    <div class="tourify-overlay-item" :style="{
                        boxShadow: 'rgb(33 33 33 / ' + (_opacity * 100) + '%) 0 0 0 5000px',
                    }"></div>
                </slot>
            </div>
        </v-fade-transition>
        <div class="tourify-content" ref="content">
            <slot name="content">
                <Modal v-model="_value" v-bind="$attrs" hide-overlay>
                    <template #body>
                        <v-carousel v-model="_index" hide-delimiter-background hide-delimiters height="auto" :show-arrows="false">
                            <v-carousel-item :key="stepIdx" v-for="(step, stepIdx) in steps">
                                <slot :name="step.key" v-bind="step"></slot>
                            </v-carousel-item>
                        </v-carousel>
                    </template>
                    <template #actions>
                        <slot :name="'action_' + currentStep.key">
                            <v-btn v-if="index === (steps.length - 1)" color="primary" block x-large @click="handleDoneClick">
                                <span v-text="$t('btn.done')"></span>
                            </v-btn>
                            <v-btn v-else color="primary" block x-large @click="handleNextClick">
                                <span v-text="$t('btn.ok')"></span>
                            </v-btn>
                        </slot>
                    </template>
                </Modal>
            </slot>
        </div>
    </div>
</template>

<script lang="ts">
import Modal from '@/components/generic/Modal.vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
    components: { Modal }
})
export default class Tour extends Vue {
    @Prop({ type: Boolean, default: false }) value: boolean;
    @Prop({ type: Number, default: 0 }) index: number;
    @Prop({ type: Number, default: 0.5 }) opacity: number;
    @Prop({ type: Array, default: () => ([]) }) steps: Array<any>;

    @Watch('index', { immediate: true })
    onIndexChanged() {
        this.updateBoundingBox();
        this.updateRoutes();
    }

    get _value() {
        return this.value;
    }

    set _value(value) {
        this.$emit('input', value);
    }

    get _index() {
        return this.index;
    }

    set _index(value) {
        this.$emit('update:index', value);
    }

    get _opacity() {
        return this.currentStep.opacity !== undefined
            ? this.currentStep.opacity
            : this.opacity || 0;
    }

    get currentStep() {
        return this.steps[this.index];
    }

    handleNextClick() {
        this._index++;
    }

    handleDoneClick() {
        this._value = false;
    }

    updateBoundingBox() {
        if (this.currentStep.selector) {
            const element = document.querySelector(this.currentStep.selector);
            // @ts-ignore
            const overlay = this.$refs.container && this.$refs.container.firstChild;
            if (element && overlay) {
                const rect = element.getBoundingClientRect();
                Object.assign(overlay.style, {
                    top: rect.top + 'px',
                    left: rect.left + 'px',
                    width: rect.width + 'px',
                    height: rect.height + 'px',
                });
            }
        }
    }

    updateRoutes() {
        if (this.currentStep.route && this.$route.name !== this.currentStep.route.name) {
            this.$router.replace(this.currentStep.route);
        }
    }

    created() {
        window.addEventListener('resize', this.updateBoundingBox);
    }

    destroyed() {
        window.removeEventListener('resize', this.updateBoundingBox);
    }
}
</script>

<style type="scss" scoped>
.tourify-overlay-container {
    z-index: 98;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.tourify-overlay-container > * {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    transition: top 300ms ease-in-out,
                left 300ms ease-in-out,
                width 300ms ease-in-out,
                height 300ms ease-in-out;
}
.tourify-content {
    z-index: 99;
    position: absolute;
    top: 0;
    left: 0;
    transition: top 300ms ease-in-out,
        left 300ms ease-in-out,
        width 300ms ease-in-out,
        height 300ms ease-in-out;
}
</style>

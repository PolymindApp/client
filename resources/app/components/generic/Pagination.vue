<template>
    <div>
        <slot name="items" :items="_items"></slot>
        <v-pagination
            v-if="length > 1"
            v-model="_value"
            class="mt-8"
            :length="length"
            :total-visible="totalVisible"
        ></v-pagination>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Pagination extends Vue {
    @Prop({ type: Number, default: 1 }) value: number
    @Prop({ type: Array, default: () => ([]) }) readonly items: any
    @Prop({ type: Number, default: 10 }) readonly itemsPerPage: number;

    get _value() {
        return this.value;
    }

    set _value(value) {
        this.$emit('input', value);
    }

    get length(): number {
        return Math.ceil(this.items.length / this.itemsPerPage);
    }

    get totalVisible(): number {
        return this.$vuetify.breakpoint.mdAndUp ? 7 : 3;
    }

    get _items(): Array<any> {
        const start = (this.value - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.items.slice(start, end);
    }
}
</script>

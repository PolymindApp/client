<template>
    <v-menu max-height="80vh" left>
        <template #activator="{ attrs: menuAttrs, on: menuOn }">
            <v-tooltip bottom>
                <template #activator="{ attrs: tooltipAttrs, on: tooltipOn }">
                    <v-btn v-bind="{ ...menuAttrs, ...tooltipAttrs, ...btnAttrs }" v-on="{ ...menuOn, ...tooltipOn, ...btnOn }" icon>
                        <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                </template>
                <span v-text="$t('chevronSelector.selectTooltip')"></span>
            </v-tooltip>
        </template>
        <v-list>
            <v-list-item :key="item[itemValue]" v-for="item in items" @click="_value = item.code">
                <v-list-item-title v-text="item[itemText]"></v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
export default {
    name: "ChevronSelector",

    props: {
        value: {
            type: Object,
            default: null,
        },
        items: {
            type: Array,
            default: () => ([]),
        },
        itemText: {
            type: String,
            default: 'name'
        },
        itemValue: {
            type: String,
            default: 'id'
        },
        btnAttrs: {
            type: [String,Object,Array],
            default: null,
        },
        btnOn: {
            type: [String,Object,Array],
            default: null,
        },
    },

    computed: {
        _value: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
    },
}
</script>

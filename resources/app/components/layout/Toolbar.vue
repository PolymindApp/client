<template>
    <v-app-bar v-bind="$attrs" v-on="$listeners">
        <v-btn icon @click="$emit('drawer')">
            <v-icon>mdi-menu</v-icon>
        </v-btn>

        <v-spacer v-if="$vuetify.breakpoint.smAndDown" />

        <div class="d-flex align-center mr-3 px-md-6 no-select" x-large text>
            <v-img :src="logo" width="2rem" class="mr-3" />
            <div class="title mb-n1">Polymind</div>
        </div>

        <template v-if="$vuetify.breakpoint.mdAndUp">
            <portal-target name="desktop_nav"></portal-target>
        </template>

        <v-spacer />

        <v-menu left>
            <template #activator="{ attrs: menuAttrs, on: menuOn }">
                <v-tooltip bottom>
                    <template #activator="{ attrs: tooltipAttrs, on: tooltipOn }">
                        <v-btn v-bind="{ ...menuAttrs, ...tooltipAttrs }" v-on="{ ...menuOn, ...tooltipOn }" icon>
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>
                    <span v-text="$t('btn.options')"></span>
                </v-tooltip>
            </template>
            <v-list class="text-no-wrap">
                <portal-target name="options"></portal-target>
                <v-list-item @click="handleSwitchThemeClick">
                    <v-list-item-icon>
                        <v-icon>mdi-theme-light-dark</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content v-text="$t('toolbar.themeSwitchTooltip')"></v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script>
import logoLight from '@/assets/images/polymind-light.svg'
import logoDark from '@/assets/images/polymind-dark.svg'

export default {
    name: "Toolbar",

    data: () => ({}),

    computed: {
        logo() {
            return this.$vuetify.breakpoint.smAndDown || this.$vuetify.theme.dark ? logoLight : logoDark;
        },
    },

    methods: {
        handleSwitchThemeClick() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            localStorage.setItem('dark', this.$vuetify.theme.dark);
        },
    },
}
</script>

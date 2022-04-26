<template>
    <v-app-bar v-bind="$attrs" v-on="$listeners">
        <v-btn icon @click="$emit('drawer')" :class="{
            'mr-3': !$vuetify.rtl,
            'ml-3': $vuetify.rtl,
        }">
            <v-icon>mdi-menu</v-icon>
        </v-btn>

        <v-spacer v-if="$vuetify.breakpoint.smAndDown" />

        <div v-if="$vuetify.breakpoint.mdAndUp" :class="{
            'd-flex align-center no-select ml-3': true,
            'ml-3 pr-md-6': !$vuetify.rtl,
            'mr-3 pl-md-6': $vuetify.rtl,
        }" style="gap: 1rem">
            <v-img :src="logo" width="2rem" />
            <div class="title mb-n1">Polymind</div>
        </div>

        <template v-if="$vuetify.breakpoint.mdAndUp">
            <portal-target name="desktop_nav" slim></portal-target>
        </template>

        <portal-target v-if="$vuetify.breakpoint.smAndDown" name="title" slim>
            <v-app-bar-title>
                <span>Polymind</span>
            </v-app-bar-title>
        </portal-target>

        <v-spacer />

        <v-menu left>
            <template #activator="{ attrs: menuAttrs, on: menuOn }">
                <v-tooltip bottom>
                    <template #activator="{ attrs: tooltipAttrs, on: tooltipOn }">
                        <v-btn v-bind="{ ...menuAttrs, ...tooltipAttrs }" v-on="{ ...menuOn, ...tooltipOn }" :class="{
                            'ml-3': !$vuetify.rtl,
                            'mr-3': $vuetify.rtl,
                        }" icon>
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

    computed: {
        logo() {
            return this.$vuetify.breakpoint.smAndDown ? logoLight : logoDark;
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

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

        <template v-if="$vuetify.breakpoint.mdAndUp">
            <div v-if="syncing" class="d-flex align-center" style="gap: 1rem">
                <v-progress-circular color="primary" size="16" width="2" indeterminate />
                <span class="overline" v-text="$t('toolbar.syncing')"></span>
            </div>
            <v-btn v-else class="mr-3" small text :disabled="!canSync" @click="handleSyncClick">
                <v-icon color="success" left>mdi-check</v-icon>
                <span v-text="$t('toolbar.synced')"></span>
            </v-btn>
        </template>

        <portal-target name="toolbar_right">

        </portal-target>

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
import Services from "@/utils/Services";

export default {
    name: "Toolbar",

    data: () => ({
        syncing: false,
        canSync: true,
    }),

    computed: {
        logo() {
            return this.$vuetify.breakpoint.smAndDown ? logoLight : logoDark;
        },
    },

    methods: {
        handleSyncClick() {
            this.syncData();
        },
        handleSwitchThemeClick() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            localStorage.setItem('dark', this.$vuetify.theme.dark);
            this.applyColorScheme();
        },
        applyColorScheme() {
            const preferredTheme = this.$vuetify.theme.dark ? 'dark' : 'light';
            document.documentElement.style.setProperty("color-scheme", preferredTheme);
        },
        syncData() {
            this.syncing = true;
            return Services.syncData()
                .then(() => {
                    this.canSync = false;
                    setTimeout(() => {
                        this.canSync = true;
                    }, 1000 * 60 * 5); // 5 minutes
                })
                .finally(() => this.syncing = false);
        },
    },
    created() {
        this.applyColorScheme();
    },
}
</script>

<style lang="scss">
:root {
    color-scheme: dark;
}
</style>

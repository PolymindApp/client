<template>
    <v-container v-bind="$attrs" v-on="$listeners">

        <!-- TITLE -->
        <portal to="title">
            <v-app-bar-title>
                <span v-text="_title"></span>
            </v-app-bar-title>
        </portal>

        <!-- DESKTOP NAV -->
        <portal to="desktop_nav">
            <DesktopNav background-color="transparent" hide-slider />
        </portal>

        <!-- MAIN CONTENT -->
        <slot></slot>

        <!-- FOOTER -->
        <div class="w-100" style="flex: 0">
            <slot name="footer">

                <!-- MOBILE FOOTER -->
                <MobileNav
                    v-if="showMobileNav"
                    :loading="loading"
                />
            </slot>
        </div>
    </v-container>
</template>

<script lang="ts">
import DesktopNav from '@/components/layout/DesktopNav.vue';
import MobileNav from '@/components/layout/MobileNav.vue';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import globalVariables from "@/global";
import { TranslateResult } from "vue-i18n";

@Component({
    components: {
        DesktopNav,
        MobileNav,
    }
})
export default class Page extends Vue {
    @Prop({ type: Boolean, default: false }) loading: boolean;
    @Prop({ default: null }) title: string | TranslateResult;

    @Watch('$i18n.locale')
    @Watch('_title')
    onLocaleChanged() {
        document.title = <string>this._title;
    }

    get _title(): string | TranslateResult {
        return this.title || this.$i18n.t('route.' + this.$route.name);
    }

    get showMobileNav() {
        return this.$vuetify.breakpoint.smAndDown
            && !globalVariables.inputFocused
            && !globalVariables.lockFocus
            && globalVariables.orientation === 'portrait';
    }

    created() {
        document.title = <string>this._title;
    }
}
</script>

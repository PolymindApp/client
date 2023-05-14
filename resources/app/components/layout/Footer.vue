<template>
    <v-footer v-bind="$attrs" v-on="$listeners" class="justify-space-between py-3 py-md-2">
        <div class="d-flex flex-wrap order-last order-md-first mt-4 mt-md-0 justify-center justify-md-start align-center caption opacity-75 text-center">
            <span v-text="$t('footer.copyright', {
                name: 'Polymind',
                version,
            })"></span>
            &nbsp;<span v-text="$t('footer.allRights')"></span>
        </div>
        <div class="d-flex flex-wrap order-first order-md-last justify-center justify-md-start align-center" style="gap: 1rem">
            <v-btn v-if="appUrl" :href="appUrl" class="caption" target="_blank" text>
                <v-icon left>mdi-open-in-new</v-icon>
                <span v-text="$t('footer.visitWebsite')"></span>
            </v-btn>
            <v-btn v-if="bugUrl" :href="bugUrl" class="caption" target="_blank" text>
                <v-icon left>mdi-bug-outline</v-icon>
                <span v-text="$t('footer.declareBug')"></span>
            </v-btn>
            <div v-if="socialLinks.length > 0" class="d-flex align-center justify-center">
                <v-tooltip :key="linkIdx" v-for="(link, linkIdx) in socialLinks" top>
                    <template #activator="{ attrs, on }">
                        <v-btn :href="link.href" target="_blank" v-bind="attrs" v-on="on" icon>
                            <v-icon color="secondaryDark" v-text="link.icon"></v-icon>
                        </v-btn>
                    </template>
                    <span v-text="link.tooltip"></span>
                </v-tooltip>
            </div>
            <div style="max-width: 12rem">
                <LanguageSwitcher v-model="$i18n.locale" btn-class="px-0" color="secondaryDark" outlined dense hide-details @input="handleLanguageSwitch" />
            </div>
        </div>
    </v-footer>
</template>

<script>
import LanguageSwitcher from '@/components/LanguageSwitcher';
import packageJson from '../../../../package.json';
import EventBus from "@/utils/EventBus";

export default {
    name: "Footer",

    components: { LanguageSwitcher },

    props: {
        socialLinks: {
            type: Array,
            default: () => ([]),
        },
    },

    data: () => ({
        year: new Date().getFullYear(),
        version: packageJson.version,
        appUrl: process.env.APP_URL,
        bugUrl: process.env.DECLARE_BUG_URL || 'https://github.com/PolymindApp/client/issues',
    }),

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

    methods: {
        handleLanguageSwitch(value) {
            EventBus.publish('LANGUAGE_SWITCH', value);
        },
    }
}
</script>

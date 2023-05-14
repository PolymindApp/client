<template>
    <Page :title="title" class="fill-height pa-0 d-flex flex-column" v-scroll="onScroll" fluid>
        <div :class="{
            'w-100 pa-0': true,
            'overflow-y-auto': $vuetify.breakpoint.smAndDown,
        }" :style="{
            flexGrow: $vuetify.breakpoint.smAndDown ? 1 : null,
            height: $vuetify.breakpoint.smAndDown ? 0 : null,
        }">
            <v-img :src="background" :height="parallaxHeight" class="w-100 text-center" position="50% 50%">
                <template #placeholder>
                    <v-skeleton-loader type="image" :height="parallaxHeight"></v-skeleton-loader>
                </template>
                <v-container style="position: relative; z-index: 6">
                    <div class="pa-4" style="position: absolute; left: 0; top: 0">
                        <v-btn text x-large :to="{ name: 'dictionary' }" dark exact>
                            <v-icon left>mdi-chevron-left</v-icon>
                            <span v-text="$t('btn.back')"></span>
                        </v-btn>
                    </div>
                    <div class="pa-4" style="position: absolute; right: 0; top: 0">
                        <v-btn :color="isBookmarked ? 'third' : null" icon x-large dark exact @click="onToggleBookmark">
                            <v-icon v-if="isBookmarked">mdi-star</v-icon>
                            <v-icon v-else>mdi-star-outline</v-icon>
                        </v-btn>
                    </div>
                </v-container>

                <v-overlay class="align-end d-flex" opacity="0.7" absolute>
                    <v-container :style="{
                        maxWidth: '50rem',
                        width: '80vw',
                        paddingTop: '5rem',
                        paddingBottom: 'calc(1rem + 97.5px)',
                    }">
                        <div class="text-center" :style="{
                            opacity: 1 - (percentageScrolled * 1.5 / 100),
                            transform: 'translateY(' + percentageScrolled + 'px)',
                        }">
                            <template v-if="skeleton">
                                <v-skeleton-loader type="heading" />
                                <v-skeleton-loader type="paragraph" class="mt-4" />
                            </template>
                            <template v-else>
                                <h1 class="text-h4 text-md-h3" v-text="title"></h1>
                                <p v-if="body" class="opacity-75 mt-2" v-text="body"></p>
                            </template>

                            <v-btn class="mt-3" color="primary" :disabled="loading" :block="$vuetify.breakpoint.smAndDown" x-large @click="onStartSession">
                                <v-icon left>mdi-headphones</v-icon>
                                <span v-text="$t('btn.startSession')"></span>
                            </v-btn>
                        </div>
                    </v-container>
                </v-overlay>
            </v-img>

            <v-container class="mb-md-12" style="margin-top: -97.5px; z-index: 1; position: relative">
                <v-card>
                    <v-card-text>

                        <!-- SEARCH FIELD -->
                        <v-text-field
                            v-model="search"
                            id="card_listing_search_mobile"
                            :placeholder="$t('table.searchPlaceholder')"
                            prepend-inner-icon="mdi-magnify"
                            class="w-100"
                            outlined
                            dense
                            hide-details
                        ></v-text-field>

                        <!-- LANGUAGES: DESKTOP -->
                        <div v-if="$vuetify.breakpoint.mdAndUp" class="mt-3 d-flex justify-center flex-wrap" style="gap: 0.5rem">
                            <v-chip-group v-model="selectedLanguages" color="primary" column multiple>
                                <v-chip :value="i18n.data.language.data.code" :key="i18n.id" v-for="i18n in allLanguages" label outlined small>
                                    <span v-text="i18n.data.language.data.name"></span>
                                </v-chip>
                            </v-chip-group>
                        </div>

                        <!-- ITEMS: DESKTOP -->
                        <Table
                            v-if="$vuetify.breakpoint.mdAndUp"
                            v-model="selected"
                            :items="items"
                            :headers="headers"
                            :search.sync="search"
                            :loading="loading"
                            :skeleton="skeleton"
                            :page="page"
                            :items-per-page="10"
                            item-key="data.id"
                            class="mx-n4 mb-n4"
                            sort-by="created_at"
                            sort-desc
                            show-select
                            hide-search
                            flat
                            tile
                        >
                            <template #[slot.key]="{ item }" v-for="slot in slots">
                                <SynthesizedTableItem
                                    v-model="item.data.i18n[slot.index].data.text"
                                    :audio="item.data.i18n[slot.index].data.text_synthesized"
                                />
                            </template>
                            <template #item.data.language="{ item }">
                                <span class="opacity-33" v-text="$t('dictionary.view.noLanguageCell')"></span>
                            </template>
                            <template #item.data.cover.data.url="{ item }">
                                <v-avatar tile size="48">
                                    <v-img v-if="item.data.cover.data.id" :src="item.data.cover.data.url">
                                        <template #placeholder>
                                            <v-skeleton-loader type="image" height="48"></v-skeleton-loader>
                                        </template>
                                    </v-img>
                                </v-avatar>
                            </template>
                            <template #item.data.created_at="{ item }">
                                <span>{{ item.data.created_at | humanDate }}</span>
                            </template>
                            <template #footer.prepend>
                                <v-btn color="primary" :disabled="loading" @click="onStartSession">
                                    <v-icon left>mdi-headphones</v-icon>
                                    <span v-text="$t('btn.startSession')"></span>
                                </v-btn>
                            </template>
                        </Table>

                        <!-- ITEMS: MOBILE -->
                        <template v-else>

                            <!-- LANGUAGES: MOBILE -->
                            <v-select
                                v-model="selectedLanguages"
                                :placeholder="$t('label.languages')"
                                :items="allLanguages"
                                class="my-3"
                                item-text="data.language.data.name"
                                item-value="data.language.data.code"
                                outlined
                                multiple
                                hide-details
                            />

                            <v-alert v-if="selectedLanguages.length === 0" class="mb-0 caption" text outlined>
                                Please select at least one language first.
                            </v-alert>
                            <Pagination v-else v-model="page" :items="_items" :items-per-page="10">
                                <template #items="{ items }">
                                    <v-list outlined>
                                        <v-list-item-group v-model="selected" multiple>
                                            <v-list-item :value="item" :key="item.data.id" v-for="(item, itemIdx) in _items">
                                                <v-list-item-avatar tile size="48">
                                                    <v-img v-if="item.data.cover.data.id" :src="item.data.cover.data.url">
                                                        <template #placeholder>
                                                            <v-skeleton-loader type="image" height="48"></v-skeleton-loader>
                                                        </template>
                                                    </v-img>
                                                </v-list-item-avatar>
                                                <v-list-item-content>
                                                    <div :key="languageIdx" v-for="languageIdx in selectedLanguagesIdx">
                                                        <SynthesizedTableItem
                                                            v-model="item.data.i18n[languageIdx].data.text"
                                                            :audio="item.data.i18n[languageIdx].data.text_synthesized"
                                                            :selected="isSelected(item)"
                                                        />
                                                    </div>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list-item-group>
                                    </v-list>
                                </template>
                            </Pagination>
                        </template>
                    </v-card-text>
                </v-card>
            </v-container>
        </div>
    </Page>
</template>

<script lang="ts">
import Page from '@/components/layout/Page.vue';
import Table from '@/components/generic/Table.vue';
import Pagination from '@/components/generic/Pagination.vue';
import SynthesizedTableItem from '@/components/generic/SynthesizedTableItem.vue';
import Services from "@/utils/Services";
import { Component, Watch, Vue } from 'vue-property-decorator';
import {IDictionarySettings} from "@/models/SettingsModel";
import DictionaryModel from "@/models/DictionaryModel";
import DictionaryItemModel from "@/models/DictionaryItemModel";
import {DictionaryI18n} from "@/database";
import DictionaryI18nModel from "@/models/DictionaryI18nModel";

@Component({
    components: {
        Page,
        Table,
        Pagination,
        SynthesizedTableItem,
    }
})
export default class DictionaryView extends Vue {

    loading = false
    skeleton = true
    scrollY = window.scrollY
    search = ''
    items = []
    page = 1
    selected: Array<any> = []
    selectedLanguages: Array<string> = []
    dictionary: DictionaryModel = new DictionaryModel();

    @Watch('selectedLanguages')
    onSelectedLanguagesChanged(selectedLanguages: Array<any>) {
        if (selectedLanguages.length > 2) {
            this.$confirm(
                this.$i18n.t('dictionary.view.selectedLanguagesMax.title'),
                this.$i18n.t('dictionary.view.selectedLanguagesMax.body'),
                this.$i18n.t('btn.gotIt'),
            );
            this.selectedLanguages.pop();
            return;
        }
        this.$store.commit('setDictionaryLanguages', {
            uuid: this.dictionary.data.id,
            languages: selectedLanguages,
        });
    }

    get title(): string {
        return this.dictionary.data.i18n.length > 0 && (this.dictionary.data.i18n.find((i18n: DictionaryI18nModel) => i18n.data.type === 'title') || { data: {} }).data.text || this.$i18n.t('state.loading').toString();
    }

    get body(): string {
        return this.dictionary.data.i18n.length > 0 && (this.dictionary.data.i18n.find((i18n: DictionaryI18nModel) => i18n.data.type === 'body') || { data: {} }).data.text || this.$i18n.t('state.loading').toString();
    }

    get background(): string {
        return this.dictionary.data.cover.data.id && this.dictionary.data.cover.data.url;
    }

    get parallaxHeight(): number {
        return 500;
    }

    get allLanguages(): Array<any> {
        return this.dictionary.data.i18n.filter((i18n: DictionaryI18nModel) => i18n.data.type === 'title');
    }

    get languageIdx(): number {
        let languageIdx = this.allLanguages.findIndex(i18n => i18n.data.language.data.code.substring(0, 2) === this.$i18n.locale.substring(0, 2));
        languageIdx = languageIdx === -1
            ? this.allLanguages.findIndex(i18n => i18n.data.language.data.code.substring(0, 2) === 'en')
            : languageIdx;
        return languageIdx === -1
            ? 0
            : languageIdx;
    }

    get language(): any {
        return this.allLanguages[this.languageIdx];
    }

    get slots(): Array<{ key: string, index: number }> {
        return this.selectedLanguagesIdx.map(idx => ({
            key: 'item.i18n[' + idx + '].data.text',
            index: idx,
        }));
    }

    get selectedLanguagesIdx(): Array<number> {
        const indexes: Array<number> = [];
        this.selectedLanguages.forEach(selectedLanguage => {
            const index = this.allLanguages.findIndex(i18n => i18n.data.language.data.code === selectedLanguage);
            if (index >= 0) {
                indexes.push(index);
            }
        });
        return indexes;
    }

    get percentageScrolled(): number {
        const percentage = this.scrollY / this.parallaxHeight * 100;
        return percentage > 100 ? 100 : percentage;
    }

    get headers(): Array<any> {
        const headers: Array<any> = [
            { text: this.$i18n.t('header.image'), value: 'data.cover.data.url', class: 'text-no-wrap', width: 0, sortable: false }
        ];
        this.selectedLanguages.forEach(selectedLanguage => {
            const i18nIdx = this.allLanguages.findIndex(i18n => i18n.data.language.data.code === selectedLanguage);
            if (i18nIdx !== -1) {
                const i18n = this.allLanguages[i18nIdx];
                headers.push(
                    { text: i18n.data.language.data.name, value: 'data.i18n[' + i18nIdx + '].data.text' }
                );
            }
        })
        if (this.selectedLanguages.length === 0) {
            headers.push(
                { text: this.$i18n.t('header.language'), value: 'data.language', sortable: false }
            );
        }
        headers.push(
            { text: this.$i18n.t('header.createdAt'), value: 'data.created_at', class: 'text-no-wrap', cellClass: 'text-no-wrap', width: 0 },
        );
        return headers;
    }

    get canStartSession(): boolean {
        return this.selectedLanguages.length > 0;
    }

    get isBookmarked(): boolean {
        return (this.$store.state.settings.dictionary_settings.find((dictionary: IDictionarySettings) => dictionary.uuid === this.$route.params.uuid) || {}).bookmarked;
    }

    get sessionParams(): any {
        return {
            lang_front: this.selectedLanguages[0],
            lang_back: this.selectedLanguages[1],
        }
    }

    get _items(): Array<DictionaryItemModel> {
        return this.items.filter((item: DictionaryItemModel) => {
            for (let i = 0; i < this.selectedLanguagesIdx.length; i++) {
                const index = this.selectedLanguagesIdx[i];
                if (item.data.i18n[index].data.text.trim().toLowerCase().indexOf(this.search.toLowerCase()) !== -1) {
                    return true;
                }
            }
            return false;
        });
    }

    onScroll(): void {
        this.scrollY = window.scrollY;
    }

    onToggleBookmark() {
        this.$store.commit('toggleDictionaryBookmark', this.dictionary.data.id);
        if (this.$store.state.settings.dictionary_settings.indexOf((dictionary: IDictionarySettings) => dictionary.uuid === this.dictionary.data.id) === -1) {
            this.$snack(this.$i18n.t('dictionary.view.removedFromBookmark').toString());
        } else {
            this.$snack(this.$i18n.t('dictionary.view.addedToBookmark').toString());
        }
    }

    onStartSession() {
        if (!this.canStartSession) {
            this.$confirm(
                this.$i18n.t('dictionary.view.mustSelectLanguage.title'),
                this.$i18n.t('dictionary.view.mustSelectLanguage.body'),
                this.$i18n.t('btn.gotIt'),
            );
        } else {
            this.$router.push({ name: 'session.dictionary', params: this.sessionParams });
        }
    }

    isSelected(item: any) {
        return this.selected.findIndex(selectedItem => selectedItem.id === item.id) !== -1;
    }

    load(): Promise<any> {
        this.loading = true;
        return Promise.all([
            Services.getDictionary(this.$route.params.uuid),
            Services.getDictionaryItems(this.$route.params.uuid),
        ])
            .then(([dictionary, items]) => {
                Object.assign(this, { dictionary, items });
                this.skeleton = false;
            })
            .catch(this.$handleError)
            .finally(() =>  this.loading = false);
    }

    created(): void {
        this.$store.commit('navigation', {
            type: 'dictionary',
            params: this.$route.params.uuid,
        });
        this.selectedLanguages = (this.$store.state.settings.dictionary_settings.find((settings: IDictionarySettings) => settings.uuid === this.$route.params.uuid) || {}).languages || [];
        this.load();
    }

}
</script>

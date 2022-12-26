<template>
    <Page class="pa-0 d-flex d-md-block flex-column fill-height" :loading="loading">

        <!-- OPTIONS -->
        <portal to="options">
            <template v-if="$vuetify.breakpoint.mdAndDown">
                <v-list-item @click="onShowFiltersClick">
                    <v-list-item-icon>
                        <v-icon>mdi-filter-variant</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content v-text="$t('btn.filters')"></v-list-item-content>
                </v-list-item>
                <v-divider class="my-2" />
            </template>
        </portal>

        <!-- FILTERS -->
        <DictionaryFiltersModal
            v-model="filtersModal.data"
            :visible.sync="filtersModal.visible"
            :dictionaries="dictionaries"
            :languages="languages"
            :categories="availableCategories"
            :skeleton="skeleton"
            @update="onFiltersUpdate"
        />

        <div :class="{
            'w-100 px-md-0 pb-3': true,
            'overflow-y-auto': $vuetify.breakpoint.smAndDown,
        }" :style="{
            flexGrow: $vuetify.breakpoint.smAndDown ? 1 : null,
            height: $vuetify.breakpoint.smAndDown ? 0 : null,
        }">
            <Sticky
                v-if="$vuetify.breakpoint.mdAndUp"
                v-model="$vuetify.breakpoint.mdAndUp !== false"
                color="background"
            >
                <v-container class="d-flex align-center justify-space-between pb-0 pt-4 pt-md-12 mb-md-4" style="gap: 1rem">
                    <!-- FILTERS -->
                    <DictionaryFilters
                        v-model="$store.state.settings"
                        :dictionaries="dictionaries"
                        :languages="languages"
                        :categories="availableCategories"
                        :skeleton="skeleton"
                        class="d-flex align-center"
                        style="flex: 1; gap: 1rem"
                    />

                    <!-- SORTING -->
                    <DictionarySorting
                        v-model="$store.state.settings"
                    />
                </v-container>
            </Sticky>

            <v-container>

                <!-- SKELETON LOADERS -->
                <template v-if="skeleton">
                    <div :key="groupIdx" v-for="groupIdx in 3">
                        <v-row :dense="$vuetify.breakpoint.smAndDown">
                            <v-col :key="indexIdx" v-for="indexIdx in skeletonItems" cols="6" sm="4" md="3" xl="2">
                                <v-skeleton-loader type="card" />
                            </v-col>
                        </v-row>
                    </div>
                </template>

                <!-- EMPTY -->
                <v-alert v-else-if="hasFilters && filteredDictionaries.length === 0" type="info" prominent text>
                    <span v-text="$t('dictionary.noItemFound')"></span>
                </v-alert>

                <!-- DICTIONARIES -->
                <Pagination v-model="page" :items="updatedFilteredAndOrderedDictionaries" :items-per-page="itemsPerPage">
                    <template #items="{ items }">
                        <v-row :dense="$vuetify.breakpoint.smAndDown">
                            <v-col cols="6" sm="4" md="3" lg="2" :key="item.id" v-for="(item, itemIdx) in items">
                                <v-card :to="{ name: 'dictionary.view', params: { uuid: item.id } }">
                                    <v-img :src="item.cover.url" aspect-ratio="0.65" class="align-end" style="position: relative">
                                        <template #placeholder>
                                            <v-skeleton-loader height="100%" type="image"></v-skeleton-loader>
                                        </template>
                                        <v-overlay class="py-2 px-2 d-block" opacity="0" z-index="1" absolute>
                                            <div style="flex: 1" class="w-100 d-flex align-center justify-space-between">
                                                <v-chip v-if="item.created_at > minDateNew" color="secondary" pill small>
                                                    <span v-text="$t('label.new')"></span>
                                                </v-chip>
                                                <div class="ma-n3">
                                                    <v-btn :color="isBookmarked(item) ? 'third' : null" icon x-large dark exact @click.stop.prevent="onToggleBookmark(item)">
                                                        <v-icon v-if="isBookmarked(item)">mdi-star</v-icon>
                                                        <v-icon v-else>mdi-star-outline</v-icon>
                                                    </v-btn>
                                                </div>
                                            </div>
                                        </v-overlay>
                                        <v-overlay class="pa-2 text-center" style="height: auto; position: relative" z-index="2" opacity="0.8" color="primary" absolute>
                                            <p class="overline text-overflow-l2 mb-0" style="line-height: 1rem" v-text="item.label"></p>
                                            <p class="caption opacity-75 mb-0">
                                                <span v-text="$tc('dictionary.totalItems', item.total_items, {
                                                    amount: item.total_items
                                                })"></span>
                                                | <span v-text="$tc('dictionary.totalLanguages', item.total_languages, {
                                                    amount: item.total_languages
                                                })"></span>
                                            </p>
                                        </v-overlay>
                                    </v-img>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>
                </Pagination>
            </v-container>
        </div>
    </Page>
</template>

<script>
import MobileNav from '@/components/layout/MobileNav';
import DesktopNav from '@/components/layout/DesktopNav';
import Page from '@/components/layout/Page';
import Modal from '@/components/generic/Modal';
import Pagination from '@/components/generic/Pagination';
import Sticky from '@/components/layout/Sticky';
import SettingsModel from '@/models/SettingsModel';
import DictionaryFilters from '@/components/dictionary/DictionaryFilters';
import DictionarySorting from '@/components/dictionary/DictionarySorting';
import DictionaryFiltersModal from '@/components/dictionary/DictionaryFiltersModal';
import Services from "@/utils/Services";

export default {
    name: "DictionaryIndex",

    components: {
        MobileNav,
        DesktopNav,
        Pagination,
        Sticky,
        DictionaryFilters,
        DictionarySorting,
        DictionaryFiltersModal,
        Page,
        Modal,
    },

    data: () => ({
        loading: false,
        skeleton: true,
        minDateNew: new Date(),
        languages: [],
        dictionaries: [],
        categories: [],
        updatedFilteredAndOrderedDictionaries: [],
        page: 1,
        filtersModal: {
            visible: false,
            data: {},
        },
    }),

    watch: {
        filteredAndOrderedDictionaries() { // Little hack so Pagination can update
            this.updatedFilteredAndOrderedDictionaries = this.filteredAndOrderedDictionaries;
       },
    },

    computed: {
        filteredDictionaries() {
            const search = (this.$store.state.settings.dictionary_search || '').trim().toLowerCase();
            return this.dictionaries.filter(dictionary => {
                return (!search || dictionary.label.toLowerCase().indexOf(search) !== -1)
                    && (
                        this.selectedCategoriesIdx.length === 0
                        || this.selectedCategoriesIdx.indexOf(dictionary.dictionary_category_id) !== -1
                    )
                    && (
                        this.$store.state.settings.dictionary_languages.length === 0
                        || dictionary.i18n.find(i18n => this.$store.state.settings.dictionary_languages.indexOf(i18n.language.code.substring(0, 2)) !== -1)
                    );
            });
        },

        filteredAndOrderedDictionaries() {
            return this.filteredDictionaries.map(dictionary => ({
                ...dictionary,
                total_languages: dictionary.i18n.filter(i18n => i18n.type === 'title').length,
            })).sort((a, b) => {
                const { first, second } = this.$store.state.settings.dictionary_sort_order === 'asc' ? { first: a, second: b } : { first: b, second: a };
                switch (this.$store.state.settings.dictionary_sort_by) {
                    case 'created_at': return first.created_at > second.created_at ? 1 : -1;
                    case 'label': return first.label > second.label ? 1 : -1;
                    case 'total_items': return first.total_items > second.total_items ? 1 : -1;
                    case 'languages': return first.total_languages > second.total_languages ? 1 : -1;
                }
            });
        },

        selectedCategoriesIdx() {
            return this.$store.state.settings.dictionary_categories.map(index => this.availableCategories[index].id);
        },

        availableCategories() {
            return this.categories.filter(category => {
                return this.dictionaries.find(dictionary => category.id === dictionary.dictionary_category_id);
            });
        },

        skeletonItems() {
            return this.$vuetify.breakpoint.xl
                ? 6
                : this.$vuetify.breakpoint.mdAndUp
                    ? 4
                    : this.$vuetify.breakpoint.smAndUp
                        ? 3
                        : 4;
        },

        itemsPerPage() {
            return this.$vuetify.breakpoint.xl
                ? 12
                : this.$vuetify.breakpoint.mdAndUp
                    ? 12
                    : this.$vuetify.breakpoint.smAndUp
                        ? 9
                        : 24;
        },

        hasFilters() {
            const search = (this.$store.state.settings.dictionary_search || '').trim().toLowerCase();
            return search || this.$store.state.settings.dictionary_languages.length > 0 || this.$store.state.settings.dictionary_categories.length > 0;
        },
    },

    methods: {
        onFiltersUpdate(filters) {
            this.$store.commit('settings', new SettingsModel(filters));
        },
        onShowFiltersClick() {
            Object.assign(this.filtersModal, {
                visible: true,
                data: this.$deepClone(this.$store.state.settings),
            });
        },
        onToggleBookmark(dictionary) {
            this.$store.commit('toggleDictionaryBookmark', dictionary.id);
        },
        isBookmarked(dictionary) {
            return this.$store.state.settings.dictionary_settings.findIndex(item => item.uuid === dictionary.id && item.bookmarked) !== -1;
        },
        load() {
            this.loading = true;
            return Promise.all([
                Services.getLanguages(),
                Services.getDictionaries(),
                Services.getDictionaryCategories(),
            ])
                .then(([languages, dictionaries, categories]) => {
                    Object.assign(this, { languages, dictionaries, categories });
                    this.mapLabels();
                    this.skeleton = false;
                })
                .catch(this.$handleError)
                .finally(() =>  this.loading = false);
        },

        mapLabels() {
            this.categories = this.categories.map(category => ({
                ...category,
                label: category.i18n[0].text,
            }));
            this.dictionaries = this.dictionaries.map(dictionary => ({
                ...dictionary,
                label: dictionary.i18n[0].text,
                created_at: new Date(dictionary.created_at),
            }));
        }
    },

    created() {
        this.$store.commit('navigation', {
            type: 'dictionary',
            params: null,
        });
        this.minDateNew.setDate(this.minDateNew.getDate() - 14);
        this.load();
    },
}
</script>

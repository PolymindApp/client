<template>
    <v-row>
        <v-col cols="12" md="6" class="d-flex flex-column" style="gap: 1.5rem">
            <v-card>
                <v-card-title>
                    <v-icon left>mdi-cards</v-icon>
                    <span v-text="$tc('profile.publicDeckTitle', profile.decks.length, {
                        total: profile.decks.length
                    })"></span>
                </v-card-title>
                <v-card-text>
                    <v-progress-linear
                        v-if="loading"
                        indeterminate
                    />
                    <v-alert
                        v-else-if="profile.decks.length === 0"
                        type="info"
                        text
                        border="left"
                        class="mb-0"
                    >
                        <span v-text="$t('profile.noPublicDeck')"></span>
                    </v-alert>
                    <v-expansion-panels>
                        <v-expansion-panel v-for="deck in profile.decks" :key="deck.data.id">
                            <v-expansion-panel-header>
                                <v-avatar style="flex: 0">
                                    <v-img v-if="deck.data.media.data.id" :src="deck.data.media.data.url">
                                        <template #placeholder>
                                            <v-skeleton-loader type="image" />
                                        </template>
                                    </v-img>
                                    <v-icon v-else>mdi-cards-variant</v-icon>
                                </v-avatar>
                                <div class="ml-4">
                                    <div v-text="deck.data.name"></div>
                                    <div class="text--disabled caption mt-1 mr-3">
                                        <i18n :path="'profile.deckDesc' + (deck.data.single ? 'Single' : '')" tag="span">
                                            {{ deck.data.total_card }}
                                            <strong v-text="deck.data.default_front_voice.data.language.data.name"></strong>
                                            <strong v-text="deck.data.default_back_voice.data.language.data.name"></strong>
                                        </i18n>
                                    </div>
                                </div>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <div class="text--secondary">
                                    <div><span v-text="$t('profile.frontVoice:')"></span> {{ deck.data.default_front_voice.data.name }}</div>
                                    <div v-if="!deck.data.single"><span v-text="$t('profile.backVoice:')"></span> {{ deck.data.default_back_voice.data.name }}</div>
                                    <div v-text="$t('profile.createdOn', { date: $options.filters.humanDate(deck.data.created_at) })"></div>
                                </div>

                                <div class="d-flex align-center mt-4" style="gap: 1rem">
                                    <v-btn
                                        :to="{ name: 'session', params: { uuid: deck.data.id } }"
                                        color="primary"
                                        style="flex: 1"
                                    >
                                        <span v-text="$t('btn.startSession')"></span>
                                    </v-btn>
                                    <v-btn
                                        :disabled="isSameUser"
                                        outlined
                                        style="flex: 1"
                                        @click="() => onCloneDeckClick(deck)"
                                    >
                                        <span v-text="$t('btn.clone')"></span>
                                    </v-btn>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="6" class="d-flex flex-column" style="gap: 1.5rem">
            <v-card>
                <v-card-title>
                    <v-icon left>mdi-clipboard-list-outline</v-icon>
                    <span v-text="$t('profile.latestActivities')"></span>
                </v-card-title>
                <v-card-text>
                    <v-progress-linear
                        v-if="loading"
                        indeterminate
                    />
                    <v-alert
                        v-else-if="profile.logs.length === 0"
                        type="info"
                        text
                        border="left"
                        class="mb-0"
                    >
                        <span v-text="$t('profile.noActivities')"></span>
                    </v-alert>
                    <v-list v-else dense>
                        <v-list-item v-for="log in profile.logs" :key="log.data.id">
                            <v-list-item-icon>
                                <v-icon v-text="log.getIcon()"></v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-text="$t('log.type.' + log.data.type.toLowerCase(), log.data.meta)"></v-list-item-title>
                                <v-list-item-subtitle v-text="$options.filters.humanDate(log.data.created_at)"></v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import UserModel from '@/models/UserModel';
import DeckModel from '@/models/DeckModel';
import LogModel from '@/models/LogModel';
import NotificationModel from '@/models/NotificationModel';
import Query from '@/utils/Query';

@Component
export default class ProfileIndex extends Vue {

    @Prop() profile!: {
        user: UserModel,
        decks: Array<DeckModel>,
        logs: Array<LogModel>,
        notifications: Array<NotificationModel>,
    }

    @Prop({ type: Boolean, default: false }) loading!: boolean

    get isSameUser(): boolean {
        return this.$store.state.user.data.id === this.$route.params.uuid;
    }

    onCloneDeckClick(deck: DeckModel): void {
        this.$confirm(
            this.$i18n.t('profile.cloneDeck.title'),
            this.$i18n.t('profile.cloneDeck.body'),
            this.$i18n.t('btn.clone'),
            (modal, btn) => {
                modal.disabled = true;
                btn.attrs.loading = true;
                btn.attrs.disabled = true;

                Query.post('/deck/' + deck.data.id + '/clone')
                    .then(response => {
                        this.$router.push({ name: 'custom', params: { uuid: response.id } })
                        this.$snack(this.$i18n.t('profile.snack.deckCloned'));
                        modal.visible = false;
                    })
                    .catch(this.$handleError)
                    .finally(() => {
                        modal.disabled = false;
                        btn.attrs.loading = false;
                        btn.attrs.disabled = false;
                    });
            }
        );
    }

}
</script>

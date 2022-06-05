<template>
    <Modal v-if="section === 'welcome'" v-model="showModal" max-width="500" persistent hide-header overlay-color="primary" overlay-opacity="1" light>
        <template #body>
            <v-carousel v-model="welcomeStep" height="auto" hide-delimiters hide-delimiter-background :show-arrows="false">
                <v-carousel-item>
                    <div class="text-center">
                        <v-img :src="tour1" class="mx-auto my-8" max-width="400" max-height="250" aspect-ratio="1.5" contain position="center center"></v-img>
                        <h1 class="primary--text text-h4 font-weight-normal" v-text="$t('tour.first.step1.title')"></h1>
                        <p class="mb-0 mt-2" v-text="$t('tour.first.step1.body')"></p>
                    </div>
                </v-carousel-item>
                <v-carousel-item>
                    <div class="text-center">
                        <v-img :src="tour2" class="mx-auto my-8" max-width="400" max-height="250" aspect-ratio="1.5" contain position="center center"></v-img>
                        <h1 class="primary--text text-h4 font-weight-normal" v-text="$t('tour.first.step2.title')"></h1>
                        <p class="mb-0 mt-2" v-text="$t('tour.first.step2.body')"></p>
                    </div>
                </v-carousel-item>
                <v-carousel-item>
                    <div class="text-center">
                        <v-carousel v-model="situationStep" class="my-8" height="250" :show-arrows="false" hide-delimiters hide-delimiter-background continuous cycle interval="3000">
                            <v-carousel-item :key="situationIdx" v-for="(situation, situationIdx) in situations" transition="fade">
                                <v-img :src="situation" class="mx-auto" max-width="400" max-height="250" aspect-ratio="1.5" contain position="center center"></v-img>
                            </v-carousel-item>
                        </v-carousel>
                        <h1 class="primary--text text-h4 font-weight-normal" v-text="$t('tour.first.step3.title')"></h1>
                        <p class="mb-0 mt-2" v-text="$t('tour.first.step3.body')"></p>
                    </div>
                </v-carousel-item>
                <v-carousel-item>
                    <div class="text-center">
                        <v-img :src="tour4" class="mx-auto my-8" max-width="400" max-height="250" aspect-ratio="1.5" contain position="center center"></v-img>
                        <h1 class="primary--text text-h4 font-weight-normal" v-text="$t('tour.first.step4.title')"></h1>
                        <p class="mb-0 mt-2" v-text="$t('tour.first.step4.body')"></p>
                    </div>
                </v-carousel-item>
            </v-carousel>
        </template>
        <template #actions>
            <v-btn color="primary" block x-large @click="() => welcomeStep === 3 ? handleShowInterface() : handleWelcomeContinue()">
                <span v-if="welcomeStep === 0" v-text="$t('btn.letsGo')"></span>
                <span v-else-if="welcomeStep === 1" v-text="$t('btn.ok')"></span>
                <span v-else-if="welcomeStep === 2" v-text="$t('btn.willDo')"></span>
                <span v-else-if="welcomeStep === 3" v-text="$t('btn.gotIt')"></span>
            </v-btn>
        </template>
    </Modal>
    <Tour v-else-if="section === 'interface'" v-model="showModal" :index.sync="step" :steps="steps" max-width="500" persistent hide-header overlay-opacity="0" light>
        <template #first="props">
            <div class="text-center">
                <v-img :src="interfaceImg" class="mx-auto my-8" max-width="400" max-height="250" aspect-ratio="1.5" contain position="center center"></v-img>
                <h1 class="primary--text text-h4 font-weight-normal" v-text="$t('tour.interface.title')"></h1>
                <p class="mb-0 mt-2" v-text="$t('tour.interface.body')"></p>
            </div>
        </template>
        <template #nav_dictionary="props">
            <div class="text-center">
                <p class="mb-0" v-text="$t('tour.nav_dictionary.body')"></p>
            </div>
        </template>
        <template #nav_edit="props">
            <div class="text-center">
                <p class="mb-0" v-text="$t('tour.nav_edit.body')"></p>
            </div>
        </template>
        <template #nav_play="props">
            <div class="text-center">
                <p class="mb-0" v-text="$t('tour.nav_play.body')"></p>
            </div>
        </template>
    </Tour>
</template>

<script type="ts">
import tour1 from '@/assets/images/tour1.png';
import tour2 from '@/assets/images/tour2.png';
import tour4 from '@/assets/images/tour4.png';
import interfaceImg from '@/assets/images/interface.png';
import driving from '@/assets/images/situations/driving.jpg';
import sleeping from '@/assets/images/situations/sleeping.jpg';
import working from '@/assets/images/situations/working.jpg';
import Modal from '@/components/generic/Modal';
import Tour from '@/components/Tour.vue';
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
    components: { Modal, Tour }
})
export default class Intro extends Vue {
    @Prop({ type: Boolean, default: false }) first;

    tour1 = tour1 //https://www.shutterstock.com/pt/image-vector/girl-headphones-listening-audiobook-audio-books-1907922415
    tour2 = tour2 //https://www.shutterstock.com/pt/image-vector/flat-style-icon-book-flower-glasses-283361375
    situations = [working, driving, sleeping]
    tour4 = tour4 //https://www.shutterstock.com/pt/image-vector/young-woman-writing-notebook-take-notes-1868903101
    situationStep = 0
    interfaceImg = interfaceImg //https://www.shutterstock.com/pt/image-vector/concept-searching-opportunities-decisions-new-business-1874619907
    welcomeStep = 0
    showModal = true
    section = null
    step = 0
    steps = [
        { key: 'first', opacity: 0 },
        { key: 'nav_dictionary', route: { name: 'dictionary' }, delay: 2000, selector: '#nav_dictionary' },
        { key: 'nav_edit', route: { name: 'custom' }, delay: 2000, selector: '#nav_edit' },
        { key: 'nav_play', route: { name: 'session' }, delay: 2000, selector: '#nav_play' },
    ]

    get _first() {
        return this.first;
    }

    set _first(value) {
        this.$emit('update:first', value);
    }

    handleWelcomeContinue() {
        this.welcomeStep++;
    }

    handleShowInterface() {
        this.showModal = false;
        setTimeout(() => {
            this.section = 'interface';
            this.showModal = true;
        }, 1500);
    }

    created() {
        this.$router.replace({ name: 'welcome' });
        this.section = this._first ? 'welcome' : 'tour';
    }
}
</script>




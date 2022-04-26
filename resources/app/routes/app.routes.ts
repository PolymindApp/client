import Edit from "@/views/App/Deck/Edit.vue";
import Play from "@/views/App/Deck/Play.vue";

export default [
    { path: '/', name: 'home', redirect: '/deck/unclassified/edit' },
    { path: '/deck/:uuid/edit', name: 'deck.edit', component: Edit },
    { path: '/deck/:uuid/play', name: 'deck.play', component: Play },
    { path: '*', redirect: '/' },
];

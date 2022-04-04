import Home from "@/views/App/Home.vue";
import Play from "@/views/App/Deck/Play.vue";

export default [
    { path: '/', name: 'home', component: Home },
    { path: '/deck/:uuid/edit', name: 'deck.edit', component: Home },
    { path: '/deck/:uuid/play', name: 'deck.play', component: Play },
    { path: '*', redirect: '/' },
];

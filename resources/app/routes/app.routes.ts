import Edit from "@/views/App/Custom.vue";
import Play from "@/views/App/Session.vue";
import Welcome from "@/views/App/Welcome.vue";
import Dictionary from "@/views/App/Dictionary.vue";
import DictionaryIndex from "@/views/App/Dictionary/Index.vue";
import DictionaryView from "@/views/App/Dictionary/View.vue";

export default [
    { path: '/', name: 'home', redirect: { name: 'dictionary' } },
    { path: '/welcome', name: 'welcome', component: Welcome },
    { path: '/dictionary', name: 'dictionary', redirect: { name: 'dictionary.index' }, component: Dictionary, children: [
        { path: '', name: 'dictionary.index', component: DictionaryIndex },
        { path: ':uuid', name: 'dictionary.view', component: DictionaryView },
    ] },
    { path: '/custom/:uuid', name: 'custom', component: Edit },
    { path: '/session/:uuid', name: 'session', component: Play, children: [
        { path: 'dictionary/:lang_front/:lang_back?', name: 'session.dictionary', component: Play },
    ] },
    { path: '*', redirect: { name: 'home' } },
];

import Deck from "@/views/App/Deck.vue";
import Session from "@/views/App/Session.vue";
import Profile from "@/views/App/Profile.vue";
import Welcome from "@/views/App/Welcome.vue";
import Dictionary from "@/views/App/Dictionary.vue";
import DictionaryIndex from "@/views/App/Dictionary/Index.vue";
import DictionaryView from "@/views/App/Dictionary/View.vue";
import ProfileIndex from '@/views/App/Profile/Index.vue';
import ProfileSettings from '@/views/App/Profile/Settings.vue';
import ProfileNotifications from '@/views/App/Profile/Notifications.vue';

export default [
    { path: '/', name: 'home', redirect: { name: 'dictionary' } },
    { path: '/profile/:uuid', redirect: { name: 'profile.index' }, name: 'profile', component: Profile, children: [
        { path: 'index', name: 'profile.index', component: ProfileIndex },
        { path: 'settings', name: 'profile.settings', component: ProfileSettings },
        { path: 'notifications', name: 'profile.notifications', component: ProfileNotifications },
    ] },
    { path: '/welcome', name: 'welcome', component: Welcome },
    { path: '/dictionary', name: 'dictionary', redirect: { name: 'dictionary.index' }, component: Dictionary, children: [
        { path: '', name: 'dictionary.index', component: DictionaryIndex },
        { path: ':uuid', name: 'dictionary.view', component: DictionaryView },
    ] },
    { path: '/deck/:uuid', name: 'custom', component: Deck },
    { path: '/session/:uuid', name: 'session', component: Session, children: [
        { path: 'dictionary/:lang_front?/:lang_back?', name: 'session.dictionary', component: Session },
    ] },
    { path: '*', redirect: { name: 'home' } },
];

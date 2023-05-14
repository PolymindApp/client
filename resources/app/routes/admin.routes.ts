import Users from "@/views/Admin/Users.vue";
import Dictionaries from "@/views/Admin/Dictionaries.vue";
import Voices from "@/views/Admin/Voices.vue";
import Languages from "@/views/Admin/Languages.vue";

export default [
    { path: '/admin/users', name: 'admin.users', component: Users },
    { path: '/admin/dictionaries', name: 'admin.dictionaries', component: Dictionaries },
    { path: '/admin/voices', name: 'admin.voices', component: Voices },
    { path: '/admin/languages', name: 'admin.languages', component: Languages },
];

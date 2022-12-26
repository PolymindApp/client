import Users from "@/views/Admin/Users.vue";
import Dictionaries from "@/views/Admin/Dictionaries.vue";

export default [
    { path: '/admin/users', name: 'admin.users', component: Users },
    { path: '/admin/dictionaries', name: 'admin.dictionaries', component: Dictionaries },
];

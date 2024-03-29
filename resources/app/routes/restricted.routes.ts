import Login from "@/views/Restricted/Login.vue";
import Register from "@/views/Restricted/Register.vue";
import Verify from "@/views/Restricted/Verify.vue";
import ForgotPassword from "@/views/Restricted/ForgotPassword.vue";
import ResetPassword from "@/views/Restricted/ResetPassword.vue";

export default [
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/register/verify', name: 'verify', component: Verify },
    { path: '/password/forgot', name: 'forgot_password', component: ForgotPassword },
    { path: '/password/reset/:token', name: 'reset_password', component: ResetPassword },
    { path: '*', redirect: '/login' },
];

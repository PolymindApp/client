import Vue from 'vue';

const onMouseInactive = (args: any) => {
    clearTimeout(args.timeout);
    args.timeout = setTimeout(args.callback, args.delay);
};
Vue.directive('onMouseInactive', {
    bind: (el, binding, vnode) => {
        el.addEventListener('mousemove', onMouseInactive.bind(this, binding.value))
    },
    unbind: (el, binding, vnode) => {
        el.removeEventListener('mousemove', onMouseInactive.bind(this, binding.value))
    },
});

Vue.directive('windowFocus', {
    bind: (el, binding, vnode) => {
        window.addEventListener('focus', binding.value);
    },
    unbind: (el, binding, vnode) => {
        window.removeEventListener('focus', binding.value);
    },
});

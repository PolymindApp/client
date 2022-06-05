import { registerRoute, NavigationRoute, Route } from 'workbox-routing';
import { precacheAndRoute } from 'workbox-precaching';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { RangeRequestsPlugin } from 'workbox-range-requests';

const FALLBACK_URL = '/';

// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (event: any) => {
    event.waitUntil(
        caches.open('navigations').then((cache) => cache.add(FALLBACK_URL)),
    );
});

registerRoute(new NavigationRoute(new StaleWhileRevalidate({
    cacheName: 'navigations'
})));

registerRoute(new Route(({ request }) => {
    return request.destination === 'image'
}, new CacheFirst({
    cacheName: 'images'
})));

registerRoute(new Route(({ request }) => {
    return request.destination === 'script';
}, new CacheFirst({
    cacheName: 'scripts',
})));

registerRoute(new Route(({ request }) => {
    return request.destination === 'style';
}, new CacheFirst({
    cacheName: 'styles'
})));

registerRoute(({ request }) => {
    return ['video', 'audio'].indexOf(request.destination) !== -1;
}, new CacheFirst({
    cacheName: 'medias',
    plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
        new RangeRequestsPlugin(),
    ],
}));

self.onmessage = function(event: MessageEvent) {
    if (event.data.type === 'settings') {
        localStorage.setItem('settings', JSON.stringify(event.data));
    }
};

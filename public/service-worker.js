importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const HTML_CACHE = "html";
const JS_CACHE = "javascript";
const STYLE_CACHE = "stylesheets";
const IMAGE_CACHE = "images";
const FONT_CACHE = "fonts";
const AUDIO_CACHE = 'audio';

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

workbox.loadModule('workbox-cacheable-response');
workbox.loadModule('workbox-range-requests');

workbox.routing.registerRoute(
    ({event}) => event.request.destination === 'document',
    new workbox.strategies.NetworkFirst({
        cacheName: HTML_CACHE,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 10,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    ({event}) => event.request.destination === 'script',
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: JS_CACHE,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 15,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    ({event}) => event.request.destination === 'style',
    new workbox.strategies.CacheFirst({
        cacheName: STYLE_CACHE,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 15,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    ({event}) => event.request.destination === 'image',
    new workbox.strategies.CacheFirst({
        cacheName: IMAGE_CACHE,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 15,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    ({event}) => event.request.destination === 'font',
    new workbox.strategies.CacheFirst({
        cacheName: FONT_CACHE,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 15,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /.*\.mp3/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: AUDIO_CACHE,
        plugins: [
            new workbox.cacheableResponse.CacheableResponsePlugin({statuses: [200]}),
            new workbox.rangeRequests.RangeRequestsPlugin(),
        ],
    }),
);

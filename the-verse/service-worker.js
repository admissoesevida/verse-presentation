const version = "0.0.4";

const cacheName = `the-verse-${version}`;

self.addEventListener('install', e => {
  caches.open(cacheName).then(cache => {
    return cache.addAll([
      `.`,
      `./index.html`,
      `./styles/page.css`,
      `../js/main.min.js`,
      `../css/`,
      `../css/fonts/`,
      `../css/icon/`,
      `../css/svg/`,
      `./img/`,
    ])
    .then(() => self.skipWaiting());
  });
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

const version = "0.0.5";

const cacheName = `the-verse-${version}`;

self.addEventListener('install', e => {
  caches.open(cacheName).then(cache => {
    return cache.addAll([
      `.`,
      `./index.html`,
      `./styles/page.css`,
      `../js/`,
      `../js/ajax.js`,
      `../js/font-awesome.js`,
      `../js/loader.js`,
      `../js/prototypes.js`,
      `../js/jquery-3.3.1.min.js`,
      `../js/navigation.js`,
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

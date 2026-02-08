// Simple service worker for Readify (cache-first)
// Keeps the site available offline after first visit.

var CACHE_NAME = 'readify-cache-v1';

var ASSETS = [
  './',
  './index.html',
  './home.html',
  './explorer.html',
  './tracker.html',
  './recommender.html',
  './flow.html',
  './feedback.html',
  './css/main.css',
  './css/js/common.js',
  './css/js/data.js',
  './css/js/books.js',
  './css/js/home.js',
  './css/js/explorer.js',
  './css/js/tracker.js',
  './css/js/recommender.js',
  './css/js/flow.js',
  './css/js/feedback.js',
  './favicon.svg',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/books/b1.jpg',
  './assets/books/b2.jpg',
  './assets/books/b3.jpg',
  './assets/books/b4.jpg',
  './assets/books/b5.jpg',
  './assets/books/b6.jpg',
  './assets/sounds/cozy1.wav'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.map(function(k){
          if(k !== CACHE_NAME){
            return caches.delete(k);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(cached){
      if(cached) return cached;
      return fetch(event.request).then(function(resp){
        // Cache new GET requests
        if(event.request.method === 'GET'){
          var copy = resp.clone();
          caches.open(CACHE_NAME).then(function(cache){
            cache.put(event.request, copy);
          });
        }
        return resp;
      }).catch(function(){
        // If offline and not cached, fallback to home
        return caches.match('./index.html');
      });
    })
  );
});

const CACHE_NAME = 'task-journey-tracker-v1';
const TIMEOUT = 5000; // 5 second timeout

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
];

// Helper function to timeout fetch requests
const timeoutFetch = (request, timeout) => {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch(error => console.error('Cache installation failed:', error))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    timeoutFetch(event.request, TIMEOUT)
      .then(response => {
        // Clone the response as it can only be used once
        const responseToCache = response.clone();
        
        // Only cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            })
            .catch(error => console.error('Cache update failed:', error));
        }
        
        return response;
      })
      .catch(error => {
        console.log('Fetch failed, falling back to cache:', error);
        return caches.match(event.request)
          .then(response => {
            return response || new Response('Network error happened', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .catch(error => console.error('Cache cleanup failed:', error))
  );
});

// Periodic cache cleanup
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cleanup-cache') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          // Remove cached responses older than 7 days
          const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          return cache.keys().then(requests =>
            Promise.all(
              requests.map(request =>
                cache.match(request).then(response => {
                  if (response && response.headers.get('date')) {
                    const cachedDate = new Date(response.headers.get('date')).getTime();
                    if (cachedDate < oneWeekAgo) {
                      return cache.delete(request);
                    }
                  }
                })
              )
            )
          );
        })
    );
  }
});
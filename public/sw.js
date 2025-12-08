/**
 * Service Worker for TES Property
 * Issue 25: Basic service worker for offline support
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `tes-property-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icon-192x192.png',
  '/assets/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Service worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('tes-property-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated successfully');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('[SW] Activation failed:', error);
      })
  );
});

// Fetch event - network-first strategy for data, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Network-first strategy for HTML pages and API calls
  if (
    request.headers.get('accept')?.includes('text/html') ||
    url.pathname.includes('/api/')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response before caching
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline page if available
            return caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // Cache-first strategy for static assets (CSS, JS, images)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          // Don't cache if not successful
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response before caching
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch((error) => {
          console.error('[SW] Fetch failed:', error);
          // Return placeholder image for failed image requests
          if (request.destination === 'image') {
            return caches.match('/assets/placeholder.png');
          }
          throw error;
        });
    })
  );
});

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('tes-property-'))
            .map((name) => caches.delete(name))
        );
      })
    );
  }

  if (event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.keys().then((keys) => {
          return keys.length;
        });
      })
    );
  }
});

// Background sync event (for future implementation)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[SW] Syncing data in background...');
  // TODO: Implement background data sync when backend is available
}

// Push notification event (for future implementation)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'TES Property';
  const options = {
    body: data.body || 'New update available',
    icon: '/assets/icon-192x192.png',
    badge: '/assets/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'default',
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if no existing window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

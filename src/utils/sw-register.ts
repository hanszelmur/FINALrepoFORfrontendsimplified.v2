/**
 * Service Worker Registration
 * Issue 25: Register and manage service worker
 */

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service workers are not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[SW] Service worker registered successfully:', registration.scope);

    // Check for updates periodically
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('[SW] New service worker found, installing...');

      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] New service worker installed, update available');
            showUpdateNotification(registration);
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('[SW] Service worker registration failed:', error);
    return null;
  }
}

/**
 * Show update notification to user
 */
function showUpdateNotification(registration: ServiceWorkerRegistration): void {
  const notification = document.createElement('div');
  notification.className = 'sw-update-notification';
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'assertive');
  notification.innerHTML = `
    <div class="sw-update-content">
      <p>A new version of TES Property is available!</p>
      <button class="btn btn-primary btn-sm" id="sw-update-btn">Update Now</button>
      <button class="btn btn-secondary btn-sm" id="sw-dismiss-btn">Later</button>
    </div>
  `;

  document.body.appendChild(notification);

  // Handle update button click
  document.getElementById('sw-update-btn')?.addEventListener('click', () => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  });

  // Handle dismiss button click
  document.getElementById('sw-dismiss-btn')?.addEventListener('click', () => {
    notification.remove();
  });
}

/**
 * Unregister service worker (for debugging)
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('[SW] Service worker unregistered');
    return true;
  } catch (error) {
    console.error('[SW] Failed to unregister service worker:', error);
    return false;
  }
}

/**
 * Check if service worker is active
 */
export function isServiceWorkerActive(): boolean {
  return !!navigator.serviceWorker?.controller;
}

/**
 * Send message to service worker
 */
export function sendMessageToServiceWorker(message: { type: string; [key: string]: unknown }): void {
  if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
}

/**
 * Clear service worker cache
 */
export function clearServiceWorkerCache(): void {
  sendMessageToServiceWorker({ type: 'CLEAR_CACHE' });
}

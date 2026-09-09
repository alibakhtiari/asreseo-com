// Clean up and unregister any legacy or orphaned Service Worker
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration
      .unregister()
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => {
        for (const client of clients) {
          if (client.url && 'navigate' in client) {
            client.navigate(client.url);
          }
        }
      })
  );
});

// Motor en segundo plano de WasaPedro para ChromeOS
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Escucha eventos en segundo plano
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { emisor: 'WasaPedro', texto: 'Tienes un mensaje nuevo.' };
  
  event.waitUntil(
    self.registration.showNotification(`WasaPedro: ${data.emisor}`, {
      body: data.texto,
      icon: 'https://cdn-icons-png.flaticon.com/512/134/134937.png'
    })
  );
});

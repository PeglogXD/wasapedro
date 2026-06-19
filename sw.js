// sw.js - Versión de escucha en segundo plano
importScripts('https://cdnjs.cloudflare.com/ajax/libs/mqtt/4.3.7/mqtt.min.js');

let clienteMqttBackground = null;

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    self.clients.claim().then(() => {
      // Intentar iniciar el bot de escucha en segundo plano
      iniciarEscuchaFondo();
    })
  );
});

function iniciarEscuchaFondo() {
    // Si ya existe una conexión, no duplicar
    if (clienteMqttBackground && clienteMqttBackground.connected) return;

    // Recuperar el nombre del usuario guardado
    // Nota: En los service workers no se puede usar localStorage directamente, 
    // pero intentamos conectar al broker global de WasaPedro
    clienteMqttBackground = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

    clienteMqttBackground.on('connect', () => {
        // Escucha un canal global de alertas de WasaPedro para despertar la app
        clienteMqttBackground.subscribe('wasapedro/v2/alertas/global');
    });

    clienteMqttBackground.on('message', (topico, mensaje) => {
        const data = JSON.parse(mensaje.toString());
        
        // Mostrar la notificación nativa en la esquina de la Chromebook
        self.registration.showNotification(`WasaPedro Alerta`, {
            body: "Tienes mensajes nuevos esperando en la app.",
            icon: 'https://cdn-icons-png.flaticon.com/512/134/134937.png',
            badge: 'https://cdn-icons-png.flaticon.com/512/134/134937.png',
            tag: 'wasapedro-alerta',
            renotify: true
        });
    });
}

// Revivir la conexión si el sistema operativo intenta apagar el proceso
self.addEventListener('periodicsync', (event) => {
    iniciarEscuchaFondo();
});

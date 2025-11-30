let socket = null;
let listener = null;

const isDev = process.env.NODE_ENV === 'development';

// Función para imprimir logs de forma controlada
const log = {
  debug: (...args) => isDev && console.debug('[🐛 DEBUG]', ...args),
  info: (...args) => isDev && console.info('[ℹ️ INFO]', ...args),
  warn: (...args) => isDev && console.warn('[⚠️ WARN]', ...args),

};

// Conectar al WebSocket
export const connectToHiveWS = (mac_raspberry) => {
  if (socket) {
    socket.close();
  }

  const wsUrl = `wss://socket-bee.danielsa.icu/ws?account=${mac_raspberry}`;
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    log.info(`WebSocket conectado para Hive ${mac_raspberry}`);
    log.debug(`URL: ${wsUrl}`);
  };

  socket.onerror = (err) => {
    log.error(`Error en WebSocket para Hive ${mac_raspberry}:`, err);
  };

  socket.onclose = (event) => {
    log.warn(`WebSocket cerrado para Hive ${mac_raspberry}. Motivo:`, event.reason || 'Sin especificar');
  };
};

// Suscribirse a actualizaciones y procesar sensores
export const subscribeToHiveUpdates = (callback) => {
  listener = callback;

  if (socket) {
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { sender, receiver, content } = data;

        log.debug(`[${sender} ➡️ ${receiver}] Mensaje crudo:`, data);

        // Procesar contenido
        const parsedContent = {};
        for (const key in content) {
          if (content.hasOwnProperty(key)) {
            const cleanKey = key.trim().toLowerCase(); // Ej: "Temperatura " => "temperatura"
            parsedContent[cleanKey] = content[key].trim();
          }
        }

        log.info("📡 Datos parseados:", parsedContent);

        // Enviar al callback
        if (listener) {
          listener(parsedContent);
        }

      } catch (err) {
        log.error("Error al parsear mensaje WebSocket:", err);
      }
    };
  } else {
    log.warn("WebSocket no inicializado al momento de suscribirse.");
  }
};

// Desconectar WebSocket
export const disconnectFromHiveWS = () => {
  if (socket) {
    socket.close();
    socket = null;
    log.info("🔌 WebSocket desconectado");
  }
  listener = null;
};

/**
 * SerenBot - Chatbot Inteligente para Apoyo Emocional
 * Versión mejorada con optimizaciones de rendimiento, i18n, manejo de errores,
 * persistencia de datos, seguridad y accesibilidad
 */

class SerenBot {
  constructor(config = {}) {
    // Configuración inicial
    this.config = {
      maxHistorySize: config.maxHistorySize || 100,
      sessionTimeout: config.sessionTimeout || 3600000, // 1 hora
      language: config.language || 'es',
      enableEncryption: config.enableEncryption || false,
      cacheSize: config.cacheSize || 50,
      debugMode: config.debugMode || false,
      ...config
    };

    // Estado interno
    this.messageHistory = [];
    this.userPreferences = {};
    this.sessionData = {};
    this.cache = new Map();
    this.isInitialized = false;
    this.currentLanguage = this.config.language;
    
    // Inicialización
    this.init();
  }

  /**
   * Inicialización del chatbot
   */
  async init() {
    try {
      this.log('Inicializando SerenBot...');
      
      // Cargar configuración de idioma
      await this.loadLanguageConfig();
      
      // Cargar datos persistentes
      await this.loadPersistedData();
      
      // Configurar manejadores de errores
      this.setupErrorHandlers();
      
      // Limpiar memoria si es necesario
      this.cleanupMemory();
      
      this.isInitialized = true;
      this.log('SerenBot inicializado correctamente');
      
    } catch (error) {
      this.handleError('Error durante la inicialización', error);
    }
  }

  /**
   * Sistema de internacionalización (i18n)
   */
  async loadLanguageConfig() {
    try {
      // Configuración de idiomas embebida para evitar dependencias externas
      this.i18n = {
        es: {
          welcome: '¡Hola! Soy SerenBot, tu asistente de apoyo emocional. ¿En qué puedo ayudarte hoy?',
          error: 'Lo siento, ha ocurrido un error. ¿Podrías intentar reformular tu mensaje?',
          notUnderstood: 'No estoy seguro de entender tu mensaje. ¿Podrías ser más específico?',
          sessionExpired: 'Tu sesión ha expirado por seguridad. Comencemos de nuevo.',
          dataCleared: 'Los datos han sido limpiados por tu privacidad.',
          crisis: 'Detecté que podrías estar pasando por un momento difícil. ¿Te gustaría que te ayude con algunas técnicas de apoyo?',
          emergency: 'Si estás en crisis, por favor contacta inmediatamente: 0800 345 1435 - Centro de Asistencia al Suicida'
        },
        en: {
          welcome: 'Hello! I\'m SerenBot, your emotional support assistant. How can I help you today?',
          error: 'Sorry, an error occurred. Could you try rephrasing your message?',
          notUnderstood: 'I\'m not sure I understand your message. Could you be more specific?',
          sessionExpired: 'Your session has expired for security reasons. Let\'s start over.',
          dataCleared: 'Data has been cleared for your privacy.',
          crisis: 'I detected you might be going through a difficult time. Would you like me to help you with some support techniques?',
          emergency: 'If you\'re in crisis, please contact immediately: Emergency Mental Health Services'
        }
      };
      
      this.log(`Configuración de idioma cargada: ${this.currentLanguage}`);
    } catch (error) {
      this.handleError('Error cargando configuración de idioma', error);
    }
  }

  /**
   * Manejo de errores mejorado
   */
  setupErrorHandlers() {
    // Manejador global de errores no capturados
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError('Promise rechazada no manejada', event.reason);
      event.preventDefault();
    });

    window.addEventListener('error', (event) => {
      this.handleError('Error global capturado', event.error);
    });
  }

  handleError(context, error) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      context: context,
      message: error?.message || 'Error desconocido',
      stack: error?.stack || 'No disponible',
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId()
    };

    // Log del error (sin datos sensibles)
    this.log(`ERROR: ${context}`, errorInfo);

    // Respuesta amigable al usuario
    const errorMessage = this.getMessage('error');
    this.addMessage('bot', errorMessage, { isError: true });

    // Opcional: enviar error a servicio de monitoreo (sin datos sensibles)
    if (this.config.errorReporting) {
      this.reportError(errorInfo);
    }
  }

  /**
   * Persistencia de datos segura
   */
  async loadPersistedData() {
    try {
      // Cargar preferencias del usuario
      const encryptedPreferences = localStorage.getItem('serenbot_preferences');
      if (encryptedPreferences) {
        this.userPreferences = this.config.enableEncryption 
          ? this.decrypt(encryptedPreferences)
          : JSON.parse(encryptedPreferences);
      }

      // Cargar historial de sesión (limitado por seguridad)
      const encryptedHistory = localStorage.getItem('serenbot_history');
      if (encryptedHistory) {
        const history = this.config.enableEncryption 
          ? this.decrypt(encryptedHistory)
          : JSON.parse(encryptedHistory);
        
        // Solo cargar historial reciente
        this.messageHistory = history.slice(-this.config.maxHistorySize);
      }

      // Cargar datos de sesión
      this.sessionData = {
        sessionId: this.generateSessionId(),
        startTime: Date.now(),
        language: this.userPreferences.language || this.config.language
      };

      this.log('Datos persistentes cargados correctamente');
    } catch (error) {
      this.handleError('Error cargando datos persistentes', error);
    }
  }

  async savePersistedData() {
    try {
      // Guardar preferencias (anonimizadas)
      const anonymizedPreferences = this.anonymizeData(this.userPreferences);
      const preferencesData = this.config.enableEncryption 
        ? this.encrypt(anonymizedPreferences)
        : JSON.stringify(anonymizedPreferences);
      
      localStorage.setItem('serenbot_preferences', preferencesData);

      // Guardar historial limitado (anonimizado)
      const recentHistory = this.messageHistory.slice(-this.config.maxHistorySize);
      const anonymizedHistory = recentHistory.map(msg => this.anonymizeMessage(msg));
      const historyData = this.config.enableEncryption 
        ? this.encrypt(anonymizedHistory)
        : JSON.stringify(anonymizedHistory);
      
      localStorage.setItem('serenbot_history', historyData);

      this.log('Datos persistentes guardados correctamente');
    } catch (error) {
      this.handleError('Error guardando datos persistentes', error);
    }
  }

  /**
   * Seguridad: Anonimización de datos
   */
  anonymizeData(data) {
    const anonymized = { ...data };
    
    // Eliminar datos sensibles
    delete anonymized.name;
    delete anonymized.email;
    delete anonymized.phone;
    delete anonymized.address;
    
    // Hash de identificadores
    if (anonymized.userId) {
      anonymized.userId = this.hashString(anonymized.userId);
    }
    
    return anonymized;
  }

  anonymizeMessage(message) {
    return {
      ...message,
      content: message.content ? this.sanitizeContent(message.content) : '',
      timestamp: message.timestamp,
      type: message.type,
      metadata: message.metadata ? { ...message.metadata, sensitive: undefined } : {}
    };
  }

  sanitizeContent(content) {
    // Eliminar información personal potencial
    return content
      .replace(/\b\d{4,}\b/g, '[NÚMERO]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
      .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[TELÉFONO]');
  }

  /**
   * Cifrado simple para datos locales (no para producción)
   */
  encrypt(data) {
    if (!this.config.enableEncryption) return JSON.stringify(data);
    
    // Implementación básica - en producción usar bibliotecas dedicadas
    const jsonString = JSON.stringify(data);
    return btoa(jsonString);
  }

  decrypt(encryptedData) {
    if (!this.config.enableEncryption) return JSON.parse(encryptedData);
    
    try {
      const jsonString = atob(encryptedData);
      return JSON.parse(jsonString);
    } catch (error) {
      this.handleError('Error descifrando datos', error);
      return {};
    }
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a entero de 32 bits
    }
    return hash.toString(36);
  }

  /**
   * Optimización de rendimiento
   */
  cleanupMemory() {
    // Limpiar historial antiguo
    if (this.messageHistory.length > this.config.maxHistorySize) {
      this.messageHistory = this.messageHistory.slice(-this.config.maxHistorySize);
    }

    // Limpiar cache antigua
    if (this.cache.size > this.config.cacheSize) {
      const entries = Array.from(this.cache.entries());
      const oldEntries = entries.slice(0, entries.length - this.config.cacheSize);
      oldEntries.forEach(([key]) => this.cache.delete(key));
    }

    // Verificar tiempo de sesión
    if (Date.now() - this.sessionData.startTime > this.config.sessionTimeout) {
      this.clearSession();
    }
  }

  clearSession() {
    this.messageHistory = [];
    this.sessionData = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      language: this.currentLanguage
    };
    this.addMessage('bot', this.getMessage('sessionExpired'), { isSystem: true });
  }

  /**
   * Procesamiento de mensajes con cache
   */
  async processMessage(userMessage, options = {}) {
    try {
      if (!this.isInitialized) {
        await this.init();
      }

      // Verificar cache
      const cacheKey = this.generateCacheKey(userMessage);
      if (this.cache.has(cacheKey)) {
        const cachedResponse = this.cache.get(cacheKey);
        this.log('Respuesta desde cache');
        return cachedResponse;
      }

      // Agregar mensaje del usuario
      this.addMessage('user', userMessage, options);

      // Procesar mensaje
      const response = await this.generateResponse(userMessage, options);

      // Agregar respuesta del bot
      this.addMessage('bot', response.content, response.metadata);

      // Guardar en cache
      this.cache.set(cacheKey, response);

      // Limpiar memoria periódicamente
      if (this.messageHistory.length % 10 === 0) {
        this.cleanupMemory();
      }

      // Guardar datos
      await this.savePersistedData();

      return response;

    } catch (error) {
      this.handleError('Error procesando mensaje', error);
      return {
        content: this.getMessage('error'),
        metadata: { isError: true }
      };
    }
  }

  /**
   * Generación de respuestas mejorada
   */
  async generateResponse(message, options = {}) {
    const lowerMessage = message.toLowerCase();
    
    // Detección de crisis
    const crisisKeywords = ['suicidio', 'morir', 'acabar', 'crisis', 'no puedo más', 'help', 'ayuda urgente', 'suicide', 'kill myself', 'end it all', 'want to die', 'can\'t go on', 'thoughts of suicide'];
    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        content: this.getMessage('emergency'),
        metadata: { 
          isCrisis: true, 
          priority: 'high',
          ariaLabel: 'Mensaje de emergencia - Información de contacto para crisis'
        }
      };
    }

    // Detección de estado emocional
    const emotionalKeywords = ['triste', 'ansioso', 'preocupado', 'deprimido', 'estresado'];
    if (emotionalKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        content: this.getMessage('crisis'),
        metadata: { 
          isEmotionalSupport: true,
          ariaLabel: 'Respuesta de apoyo emocional'
        }
      };
    }

    // Respuestas generales basadas en patrones
    const responses = this.getResponsePatterns();
    
    for (const pattern of responses) {
      if (pattern.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return {
          content: this.getRandomResponse(pattern.responses),
          metadata: {
            category: pattern.category,
            ariaLabel: `Respuesta sobre ${pattern.category}`
          }
        };
      }
    }

    // Respuesta por defecto
    return {
      content: this.getMessage('notUnderstood'),
      metadata: { 
        isDefault: true,
        ariaLabel: 'Respuesta de aclaración'
      }
    };
  }

  getResponsePatterns() {
    const patterns = {
      es: [
        {
          category: 'saludo',
          keywords: ['hola', 'hello', 'hi', 'buenos días', 'buenas tardes', 'buenas noches'],
          responses: [
            this.getMessage('welcome'),
            '¡Hola! Me alegra que estés aquí. ¿Cómo te sientes hoy?',
            'Bienvenido/a. Estoy aquí para acompañarte. ¿En qué puedo ayudarte?'
          ]
        },
        {
          category: 'respiracion',
          keywords: ['respirar', 'respira', 'ansiedad', 'pánico', 'nervioso'],
          responses: [
            'Te guío en un ejercicio de respiración: Inhala por 4 segundos, mantén por 4, exhala por 6. ¿Lo intentamos juntos?',
            'La respiración consciente puede ayudarte. ¿Te gustaría que practiquemos una técnica de respiración?',
            'Cuando sientes ansiedad, respirar profundamente puede calmarte. ¿Quieres que te enseñe una técnica?'
          ]
        },
        {
          category: 'mindfulness',
          keywords: ['mindfulness', 'meditación', 'presente', 'aquí y ahora'],
          responses: [
            'El mindfulness puede ayudarte a centrarte en el presente. ¿Te gustaría practicar un ejercicio de atención plena?',
            'Estar presente es una habilidad poderosa. ¿Quieres que hagamos un ejercicio de conexión con el momento actual?'
          ]
        }
      ]
    };

    return patterns[this.currentLanguage] || patterns.es;
  }

  /**
   * Utilidades
   */
  addMessage(sender, content, metadata = {}) {
    const message = {
      id: this.generateMessageId(),
      sender,
      content,
      timestamp: Date.now(),
      metadata: {
        sessionId: this.sessionData.sessionId,
        ...metadata
      }
    };

    this.messageHistory.push(message);
    
    // Emitir evento para la UI
    this.emit('messageAdded', message);
    
    return message;
  }

  getMessage(key) {
    return this.i18n[this.currentLanguage]?.[key] || this.i18n.es[key] || key;
  }

  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  generateCacheKey(message) {
    return this.hashString(message.toLowerCase().trim());
  }

  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSessionId() {
    return this.sessionData.sessionId;
  }

  /**
   * Event emitter simple
   */
  emit(eventName, data) {
    if (this.listeners && this.listeners[eventName]) {
      this.listeners[eventName].forEach(callback => callback(data));
    }
  }

  on(eventName, callback) {
    if (!this.listeners) this.listeners = {};
    if (!this.listeners[eventName]) this.listeners[eventName] = [];
    this.listeners[eventName].push(callback);
  }

  /**
   * Accesibilidad
   */
  setAccessibilityOptions(options) {
    this.userPreferences.accessibility = {
      ...this.userPreferences.accessibility,
      ...options
    };
    
    // Aplicar configuraciones de accesibilidad
    if (options.fontSize) {
      document.documentElement.style.setProperty('--chat-font-size', options.fontSize);
    }
    
    if (options.highContrast) {
      document.body.classList.toggle('high-contrast', options.highContrast);
    }
    
    if (options.reduceMotion) {
      document.body.classList.toggle('reduce-motion', options.reduceMotion);
    }
  }

  /**
   * Cambio de idioma
   */
  async setLanguage(language) {
    if (this.i18n[language]) {
      this.currentLanguage = language;
      this.userPreferences.language = language;
      await this.savePersistedData();
      this.log(`Idioma cambiado a: ${language}`);
    }
  }

  /**
   * Limpieza y privacidad
   */
  clearAllData() {
    this.messageHistory = [];
    this.userPreferences = {};
    this.cache.clear();
    localStorage.removeItem('serenbot_preferences');
    localStorage.removeItem('serenbot_history');
    this.addMessage('bot', this.getMessage('dataCleared'), { isSystem: true });
  }

  /**
   * Logging
   */
  log(message, data = null) {
    if (this.config.debugMode) {
      console.log(`[SerenBot] ${message}`, data);
    }
  }

  /**
   * API pública
   */
  getMessageHistory() {
    return [...this.messageHistory];
  }

  getUserPreferences() {
    return { ...this.userPreferences };
  }

  getSessionInfo() {
    return {
      sessionId: this.sessionData.sessionId,
      startTime: this.sessionData.startTime,
      language: this.currentLanguage,
      messageCount: this.messageHistory.length
    };
  }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SerenBot;
}

// Disponible globalmente en el navegador
if (typeof window !== 'undefined') {
  window.SerenBot = SerenBot;
}
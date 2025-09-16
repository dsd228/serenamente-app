/**
 * Configuración de idiomas para SerenBot
 * Sistema de internacionalización (i18n) externo
 */

const i18nConfig = {
  // Idioma por defecto
  defaultLanguage: 'es',
  
  // Idiomas soportados
  supportedLanguages: ['es', 'en', 'pt'],
  
  // Configuraciones específicas de idioma
  languages: {
    es: {
      name: 'Español',
      code: 'es',
      direction: 'ltr',
      messages: {
        // Mensajes del sistema
        welcome: '¡Hola! Soy SerenBot, tu asistente de apoyo emocional. ¿En qué puedo ayudarte hoy?',
        error: 'Lo siento, ha ocurrido un error. ¿Podrías intentar reformular tu mensaje?',
        notUnderstood: 'No estoy seguro de entender tu mensaje. ¿Podrías ser más específico?',
        sessionExpired: 'Tu sesión ha expirado por seguridad. Comencemos de nuevo.',
        dataCleared: 'Los datos han sido limpiados por tu privacidad.',
        crisis: 'Detecté que podrías estar pasando por un momento difícil. ¿Te gustaría que te ayude con algunas técnicas de apoyo?',
        emergency: 'Si estás en crisis, por favor contacta inmediatamente al 0800 345 1435 - Centro de Asistencia al Suicida (disponible 8 a 00 hs)',
        
        // Respuestas de apoyo emocional
        support: {
          breathing: 'Te guío en un ejercicio de respiración: Inhala por 4 segundos, mantén por 4, exhala por 6. ¿Lo intentamos juntos?',
          mindfulness: 'El mindfulness puede ayudarte a centrarte en el presente. ¿Te gustaría practicar un ejercicio de atención plena?',
          grounding: 'Probemos una técnica de conexión: Nombra 5 cosas que puedes ver, 4 que puedes tocar, 3 que puedes oír, 2 que puedes oler y 1 que puedes saborear.',
          positivity: 'Recordá que esta situación es temporal. Has superado desafíos antes y podés hacerlo de nuevo. ¿Qué te ha ayudado en el pasado?'
        },
        
        // Técnicas específicas
        techniques: {
          anxiety: 'Para la ansiedad, podemos probar respiración diafragmática, relajación muscular progresiva o técnicas de grounding. ¿Cuál te interesa más?',
          depression: 'Cuando te sentís deprimido/a, pequeñas acciones pueden ayudar: salir al sol, hacer ejercicio suave, o conectar con alguien querido. ¿Qué te parece más accesible hoy?',
          stress: 'El estrés puede manejarse con técnicas de relajación, organización de tareas y autocuidado. ¿En qué área te gustaría enfocarte?',
          grief: 'El duelo es un proceso natural. Es importante permitirte sentir y buscar apoyo. ¿Te gustaría hablar sobre lo que estás sintiendo?'
        },
        
        // Interfaz de usuario
        ui: {
          send: 'Enviar',
          clear: 'Limpiar chat',
          settings: 'Configuración',
          language: 'Idioma',
          accessibility: 'Accesibilidad',
          privacy: 'Privacidad',
          typing: 'SerenBot está escribiendo...',
          offline: 'Sin conexión',
          reconnecting: 'Reconectando...'
        },
        
        // Accesibilidad
        accessibility: {
          chatRegion: 'Región de chat',
          messageFrom: 'Mensaje de',
          sendButton: 'Enviar mensaje',
          clearButton: 'Limpiar historial de chat',
          settingsButton: 'Abrir configuración',
          closeButton: 'Cerrar',
          emergencyAlert: 'Alerta de emergencia: Información de contacto para crisis'
        }
      }
    },
    
    en: {
      name: 'English',
      code: 'en',
      direction: 'ltr',
      messages: {
        // System messages
        welcome: 'Hello! I\'m SerenBot, your emotional support assistant. How can I help you today?',
        error: 'Sorry, an error occurred. Could you try rephrasing your message?',
        notUnderstood: 'I\'m not sure I understand your message. Could you be more specific?',
        sessionExpired: 'Your session has expired for security reasons. Let\'s start over.',
        dataCleared: 'Data has been cleared for your privacy.',
        crisis: 'I detected you might be going through a difficult time. Would you like me to help you with some support techniques?',
        emergency: 'If you\'re in crisis, please contact immediately: Emergency Mental Health Services or call your local emergency number',
        
        // Emotional support responses
        support: {
          breathing: 'Let me guide you through a breathing exercise: Inhale for 4 seconds, hold for 4, exhale for 6. Shall we try it together?',
          mindfulness: 'Mindfulness can help you center in the present. Would you like to practice a mindful awareness exercise?',
          grounding: 'Let\'s try a grounding technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.',
          positivity: 'Remember that this situation is temporary. You\'ve overcome challenges before and you can do it again. What has helped you in the past?'
        },
        
        // Specific techniques
        techniques: {
          anxiety: 'For anxiety, we can try diaphragmatic breathing, progressive muscle relaxation, or grounding techniques. Which interests you most?',
          depression: 'When feeling depressed, small actions can help: getting sunlight, gentle exercise, or connecting with someone you care about. What feels most accessible today?',
          stress: 'Stress can be managed with relaxation techniques, task organization, and self-care. Which area would you like to focus on?',
          grief: 'Grief is a natural process. It\'s important to allow yourself to feel and seek support. Would you like to talk about what you\'re experiencing?'
        },
        
        // User interface
        ui: {
          send: 'Send',
          clear: 'Clear chat',
          settings: 'Settings',
          language: 'Language',
          accessibility: 'Accessibility',
          privacy: 'Privacy',
          typing: 'SerenBot is typing...',
          offline: 'Offline',
          reconnecting: 'Reconnecting...'
        },
        
        // Accessibility
        accessibility: {
          chatRegion: 'Chat region',
          messageFrom: 'Message from',
          sendButton: 'Send message',
          clearButton: 'Clear chat history',
          settingsButton: 'Open settings',
          closeButton: 'Close',
          emergencyAlert: 'Emergency alert: Crisis contact information'
        }
      }
    },
    
    pt: {
      name: 'Português',
      code: 'pt',
      direction: 'ltr',
      messages: {
        // Mensagens do sistema
        welcome: 'Olá! Eu sou o SerenBot, seu assistente de apoio emocional. Como posso ajudá-lo hoje?',
        error: 'Desculpe, ocorreu um erro. Você poderia tentar reformular sua mensagem?',
        notUnderstood: 'Não tenho certeza se entendo sua mensagem. Você poderia ser mais específico?',
        sessionExpired: 'Sua sessão expirou por segurança. Vamos começar novamente.',
        dataCleared: 'Os dados foram limpos por sua privacidade.',
        crisis: 'Detectei que você pode estar passando por um momento difícil. Gostaria que eu te ajudasse com algumas técnicas de apoio?',
        emergency: 'Se você está em crise, entre em contato imediatamente com os serviços de emergência de saúde mental',
        
        // Respostas de apoio emocional
        support: {
          breathing: 'Vou te guiar em um exercício de respiração: Inspire por 4 segundos, segure por 4, expire por 6. Vamos tentar juntos?',
          mindfulness: 'A atenção plena pode ajudá-lo a se centrar no presente. Gostaria de praticar um exercício de consciência plena?',
          grounding: 'Vamos tentar uma técnica de ancoragem: Nomeie 5 coisas que você pode ver, 4 que pode tocar, 3 que pode ouvir, 2 que pode cheirar e 1 que pode saborear.',
          positivity: 'Lembre-se de que esta situação é temporária. Você superou desafios antes e pode fazer isso novamente. O que te ajudou no passado?'
        },
        
        // Técnicas específicas
        techniques: {
          anxiety: 'Para ansiedade, podemos tentar respiração diafragmática, relaxamento muscular progressivo ou técnicas de ancoragem. Qual te interessa mais?',
          depression: 'Quando se sente deprimido, pequenas ações podem ajudar: tomar sol, fazer exercícios leves ou conectar-se com alguém especial. O que parece mais acessível hoje?',
          stress: 'O estresse pode ser gerenciado com técnicas de relaxamento, organização de tarefas e autocuidado. Em qual área você gostaria de se concentrar?',
          grief: 'O luto é um processo natural. É importante permitir-se sentir e buscar apoio. Gostaria de falar sobre o que está sentindo?'
        },
        
        // Interface do usuário
        ui: {
          send: 'Enviar',
          clear: 'Limpar chat',
          settings: 'Configurações',
          language: 'Idioma',
          accessibility: 'Acessibilidade',
          privacy: 'Privacidade',
          typing: 'SerenBot está digitando...',
          offline: 'Offline',
          reconnecting: 'Reconectando...'
        },
        
        // Acessibilidade
        accessibility: {
          chatRegion: 'Região do chat',
          messageFrom: 'Mensagem de',
          sendButton: 'Enviar mensagem',
          clearButton: 'Limpar histórico do chat',
          settingsButton: 'Abrir configurações',
          closeButton: 'Fechar',
          emergencyAlert: 'Alerta de emergência: Informações de contato para crise'
        }
      }
    }
  }
};

// Función para obtener configuración de idioma
function getLanguageConfig(languageCode) {
  return i18nConfig.languages[languageCode] || i18nConfig.languages[i18nConfig.defaultLanguage];
}

// Función para obtener mensaje específico
function getMessage(languageCode, key, fallback = null) {
  const config = getLanguageConfig(languageCode);
  const keys = key.split('.');
  let value = config.messages;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
  
  return value || fallback || key;
}

// Función para obtener idiomas disponibles
function getAvailableLanguages() {
  return Object.keys(i18nConfig.languages).map(code => ({
    code,
    name: i18nConfig.languages[code].name
  }));
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    i18nConfig,
    getLanguageConfig,
    getMessage,
    getAvailableLanguages
  };
}

// Disponible globalmente en el navegador
if (typeof window !== 'undefined') {
  window.I18nConfig = {
    i18nConfig,
    getLanguageConfig,
    getMessage,
    getAvailableLanguages
  };
}
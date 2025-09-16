/**
 * SerenBot - Advanced Chatbot for Serenamente App
 * Provides contextual emotional support, therapeutic techniques, and wellness guidance
 */
class SerenBot {
  constructor() {
    this.userName = '';
    this.currentMood = 'neutral';
    this.conversationHistory = [];
    this.lastInteraction = Date.now();
    this.reminderInterval = null;
    this.isActive = false;
    
    // Knowledge base with therapeutic techniques and responses
    this.knowledgeBase = {
      greetings: [
        "¡Hola! Soy SerenBot, tu compañero de bienestar emocional. ¿Cómo te sentís hoy?",
        "¡Bienvenido/a! Me alegra verte por aquí. ¿En qué puedo ayudarte hoy?",
        "Hola, es un placer acompañarte en tu proceso de bienestar. ¿Cómo está tu ánimo?",
        "¡Qué bueno que estés aquí! Estoy para apoyarte. ¿Qué tal tu día?"
      ],
      
      moodResponses: {
        ansiedad: {
          responses: [
            "Entiendo que estés sintiendo ansiedad. Es una respuesta natural de tu cuerpo. ¿Te gustaría que practiquemos una técnica de respiración juntos?",
            "La ansiedad puede ser abrumadora, pero hay técnicas que pueden ayudarte a manejarla. ¿Prefieres ejercicios de respiración o técnicas de grounding?",
            "Reconocer tu ansiedad es el primer paso. ¿Has notado qué situaciones específicas la desencadenan?"
          ],
          techniques: [
            "respiracion_4_7_8",
            "tecnica_5_4_3_2_1",
            "respiracion_diafragmatica"
          ]
        },
        
        depresion: {
          responses: [
            "La depresión puede hacer que todo se sienta pesado. Quiero que sepas que no estás solo/a en esto. ¿Te parece si exploramos algunas técnicas que pueden ayudarte?",
            "Entiendo lo difícil que puede ser cuando te sentís así. Cada pequeño paso cuenta. ¿Hay alguna actividad pequeña que solías disfrutar?",
            "Es valiente de tu parte buscar ayuda. ¿Te gustaría que practiquemos algunos ejercicios de activación conductual?"
          ],
          techniques: [
            "activacion_conductual",
            "reestructuracion_cognitiva",
            "diario_gratitud"
          ]
        },
        
        estres: {
          responses: [
            "El estrés es muy común en estos tiempos. Tu cuerpo está reaccionando a las demandas del entorno. ¿Te ayudo con técnicas de relajación?",
            "Cuando estamos estresados, nuestro sistema nervioso se activa. Podemos trabajar juntos para calmarlo. ¿Prefieres relajación muscular o mindfulness?",
            "Reconocer el estrés es importante. ¿Has identificado las principales fuentes de tu estrés últimamente?"
          ],
          techniques: [
            "relajacion_muscular_progresiva",
            "mindfulness_body_scan",
            "tecnica_lugar_seguro"
          ]
        },
        
        trauma: {
          responses: [
            "Lidiar con un trauma requiere mucha fortaleza. Estoy aquí para acompañarte con técnicas suaves. ¿Te sentís seguro/a en este momento?",
            "El trauma puede manifestarse de muchas formas. Es importante ir paso a paso. ¿Te parece si empezamos con técnicas de grounding?",
            "Buscar ayuda después de un trauma muestra tu valentía. ¿Hay alguna técnica específica que te haga sentir más seguro/a?"
          ],
          techniques: [
            "grounding_trauma",
            "respiracion_segura",
            "ventana_tolerancia"
          ]
        },
        
        panico: {
          responses: [
            "Los ataques de pánico pueden ser muy intensos, pero son temporales. Estás seguro/a. ¿Podemos practicar respiración juntos?",
            "En este momento, tu cuerpo está en modo de alerta, pero no hay peligro real. ¿Te ayudo a reconectar con el presente?",
            "Reconocer que es pánico y no peligro real es importante. ¿Prefieres técnicas de respiración o de anclaje en el presente?"
          ],
          techniques: [
            "respiracion_diafragmatica",
            "anclaje_presente",
            "reestructuracion_panico"
          ]
        },
        
        suicida: {
          responses: [
            "Me preocupa mucho cómo te sentís. Quiero que sepas que tu vida tiene valor y que hay ayuda disponible. ¿Podés contactar al 0800 345 1435 ahora?",
            "Estos pensamientos pueden ser muy dolorosos. No tenés que enfrentarlos solo/a. Es crucial que hables con un profesional. ¿Tenés a alguien de confianza cerca?",
            "Tu seguridad es lo más importante. Por favor, contactá inmediatamente al Centro de Asistencia al Suicida: 0800 345 1435. ¿Estás en un lugar seguro?"
          ],
          techniques: [
            "plan_seguridad",
            "conexion_presente_crisis",
            "caja_herramientas_supervivencia"
          ]
        }
      },
      
      techniques: {
        respiracion_4_7_8: {
          name: "Respiración 4-7-8",
          description: "Técnica de respiración profunda que activa el sistema nervioso parasimpático",
          steps: [
            "Colócate en una posición cómoda",
            "Inhalá por la nariz durante 4 segundos",
            "Mantené la respiración durante 7 segundos",
            "Exhalá lentamente por la boca durante 8 segundos",
            "Repetí este ciclo 4 veces"
          ],
          duration: "2-3 minutos"
        },
        
        tecnica_5_4_3_2_1: {
          name: "Técnica 5-4-3-2-1",
          description: "Ejercicio de grounding para conectar con el presente",
          steps: [
            "Identificá 5 cosas que podés VER a tu alrededor",
            "Identificá 4 cosas que podés TOCAR",
            "Identificá 3 cosas que podés OÍR",
            "Identificá 2 cosas que podés OLER",
            "Identificá 1 cosa que podés SABOREAR"
          ],
          duration: "3-5 minutos"
        },
        
        relajacion_muscular_progresiva: {
          name: "Relajación Muscular Progresiva",
          description: "Técnica que alterna tensión y relajación de grupos musculares",
          steps: [
            "Tensá los músculos de tus pies durante 5 segundos, luego relajá",
            "Subí a las piernas: tensá 5 segundos, relajá 10 segundos",
            "Continuá con glúteos, abdomen, pecho",
            "Seguí con brazos, manos, cuello y rostro",
            "Terminá con una respiración profunda y escaneo corporal"
          ],
          duration: "15-20 minutos"
        }
      },
      
      keywords: {
        greetings: ['hola', 'buenas', 'hey', 'saludos', 'buenos días', 'buenas tardes', 'buenas noches'],
        help: ['ayuda', 'ayúdame', 'socorro', 'no sé qué hacer', 'necesito ayuda'],
        emotions: ['me siento', 'estoy', 'siento', 'tengo miedo', 'estoy triste', 'ansioso', 'deprimido'],
        techniques: ['técnica', 'ejercicio', 'respiración', 'relajación', 'meditación'],
        crisis: ['suicidio', 'matarme', 'no quiero vivir', 'acabar con todo', 'no puedo más']
      }
    };
    
    this.init();
  }
  
  init() {
    this.setupNotifications();
    this.startReminderSystem();
  }
  
  // Detección de nombre del usuario
  detectUserName(message) {
    const namePatterns = [
      /(?:me llamo|soy|mi nombre es)\s+([a-záéíóúñ]+)/i,
      /(?:llámame|decime)\s+([a-záéíóúñ]+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match) {
        this.userName = match[1];
        return true;
      }
    }
    return false;
  }
  
  // Detección de estado emocional
  detectMood(message) {
    const moodKeywords = {
      ansiedad: ['ansioso', 'ansiosa', 'ansiedad', 'nervioso', 'nerviosa', 'preocupado', 'preocupada'],
      depresion: ['deprimido', 'deprimida', 'triste', 'vacío', 'sin esperanza', 'desesperanzado'],
      estres: ['estresado', 'estresada', 'agobiado', 'agobiada', 'presión', 'tensión'],
      trauma: ['trauma', 'traumático', 'flashback', 'pesadillas', 'revivir'],
      panico: ['pánico', 'ataque de pánico', 'no puedo respirar', 'corazón acelerado'],
      suicida: ['suicidio', 'matarme', 'acabar con todo', 'no quiero vivir', 'no puedo más']
    };
    
    const messageLower = message.toLowerCase();
    
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        this.currentMood = mood;
        return mood;
      }
    }
    
    return null;
  }
  
  // Procesamiento principal de mensajes
  processMessage(message) {
    this.lastInteraction = Date.now();
    
    // Agregar al historial
    this.conversationHistory.push({
      timestamp: Date.now(),
      message: message,
      type: 'user'
    });
    
    // Detectar nombre si no lo tenemos
    if (!this.userName) {
      this.detectUserName(message);
    }
    
    // Detectar estado emocional
    const detectedMood = this.detectMood(message);
    
    // Generar respuesta
    const response = this.generateResponse(message, detectedMood);
    
    // Agregar respuesta al historial
    this.conversationHistory.push({
      timestamp: Date.now(),
      message: response.text,
      type: 'bot',
      techniques: response.techniques || [],
      mood: detectedMood
    });
    
    return response;
  }
  
  // Generación de respuestas contextuales
  generateResponse(message, detectedMood) {
    const messageLower = message.toLowerCase();
    
    // Manejo de crisis
    if (detectedMood === 'suicida' || this.isCrisisMessage(message)) {
      return this.handleCrisisResponse();
    }
    
    // Saludos
    if (this.containsKeywords(messageLower, this.knowledgeBase.keywords.greetings)) {
      return this.handleGreeting();
    }
    
    // Respuesta basada en estado emocional detectado
    if (detectedMood && this.knowledgeBase.moodResponses[detectedMood]) {
      return this.handleMoodResponse(detectedMood);
    }
    
    // Solicitud de técnicas
    if (this.containsKeywords(messageLower, this.knowledgeBase.keywords.techniques)) {
      return this.suggestTechniques();
    }
    
    // Solicitud de ayuda general
    if (this.containsKeywords(messageLower, this.knowledgeBase.keywords.help)) {
      return this.handleHelpRequest();
    }
    
    // Respuesta general empática
    return this.generateEmpathicResponse(message);
  }
  
  // Manejo de crisis
  isCrisisMessage(message) {
    return this.containsKeywords(message.toLowerCase(), this.knowledgeBase.keywords.crisis);
  }
  
  handleCrisisResponse() {
    const crisisResponses = this.knowledgeBase.moodResponses.suicida.responses;
    const response = this.getRandomElement(crisisResponses);
    
    // Enviar notificación de crisis
    this.sendCrisisNotification();
    
    return {
      text: response,
      type: 'crisis',
      urgency: 'high',
      actions: [
        {
          text: "Llamar línea de crisis: 0800 345 1435",
          action: "call_crisis_line"
        },
        {
          text: "Ver plan de seguridad",
          action: "show_safety_plan"
        }
      ]
    };
  }
  
  // Manejo de saludos
  handleGreeting() {
    const greeting = this.getRandomElement(this.knowledgeBase.greetings);
    const personalizedGreeting = this.userName ? 
      greeting.replace('¡Hola!', `¡Hola ${this.userName}!`) : greeting;
    
    return {
      text: personalizedGreeting,
      type: 'greeting'
    };
  }
  
  // Manejo de respuestas por estado de ánimo
  handleMoodResponse(mood) {
    const moodData = this.knowledgeBase.moodResponses[mood];
    const response = this.getRandomElement(moodData.responses);
    const techniques = moodData.techniques;
    
    return {
      text: response,
      type: 'mood_response',
      mood: mood,
      techniques: techniques,
      suggestedActions: [
        {
          text: "Ver técnicas recomendadas",
          action: "show_techniques",
          data: techniques
        }
      ]
    };
  }
  
  // Sugerencia de técnicas
  suggestTechniques() {
    const currentMoodTechniques = this.currentMood !== 'neutral' && 
      this.knowledgeBase.moodResponses[this.currentMood] ?
      this.knowledgeBase.moodResponses[this.currentMood].techniques : [];
    
    const generalTechniques = ['respiracion_4_7_8', 'tecnica_5_4_3_2_1', 'relajacion_muscular_progresiva'];
    const techniques = currentMoodTechniques.length > 0 ? currentMoodTechniques : generalTechniques;
    
    return {
      text: "Tengo varias técnicas que pueden ayudarte. ¿Te gustaría que te guíe paso a paso con alguna?",
      type: 'technique_suggestion',
      techniques: techniques,
      suggestedActions: techniques.map(tech => ({
        text: this.knowledgeBase.techniques[tech]?.name || tech,
        action: "start_guided_exercise",
        data: tech
      }))
    };
  }
  
  // Solicitud de ayuda general
  handleHelpRequest() {
    const userName = this.userName ? `, ${this.userName}` : '';
    return {
      text: `Estoy aquí para ayudarte${userName}. Puedo guiarte con técnicas de relajación, ejercicios de respiración, o simplemente escuchar cómo te sentís. ¿Qué te gustaría hacer?`,
      type: 'help_response',
      suggestedActions: [
        { text: "Técnicas de respiración", action: "show_breathing_techniques" },
        { text: "Ejercicios de relajación", action: "show_relaxation_techniques" },
        { text: "Hablar sobre mis sentimientos", action: "mood_check" }
      ]
    };
  }
  
  // Respuesta empática general
  generateEmpathicResponse(message) {
    const empathicResponses = [
      "Te escucho. ¿Podés contarme un poco más sobre cómo te sentís?",
      "Entiendo que puede ser difícil. Estoy aquí para acompañarte.",
      "Agradezco que compartas esto conmigo. ¿Hay algo específico en lo que pueda ayudarte?",
      "Es normal sentirse así a veces. ¿Te gustaría que exploremos algunas técnicas juntos?"
    ];
    
    return {
      text: this.getRandomElement(empathicResponses),
      type: 'empathic_response'
    };
  }
  
  // Ejercicios guiados
  startGuidedExercise(techniqueId) {
    const technique = this.knowledgeBase.techniques[techniqueId];
    
    if (!technique) {
      return {
        text: "Lo siento, no encontré esa técnica. ¿Te gustaría que te sugiera otras?",
        type: 'error'
      };
    }
    
    return {
      text: `Perfecto, vamos a practicar: ${technique.name}. ${technique.description}`,
      type: 'guided_exercise_start',
      technique: technique,
      steps: technique.steps,
      currentStep: 0
    };
  }
  
  // Notificaciones del navegador
  setupNotifications() {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }
  
  sendWellnessReminder() {
    if ('Notification' in window && Notification.permission === 'granted') {
      const reminders = [
        "¿Cómo te sentís? Recordá que estoy aquí si necesitás hablar.",
        "Es un buen momento para una pausa. ¿Te gustaría hacer un ejercicio de respiración?",
        "Recordá cuidar tu bienestar emocional. ¿Hay algo en lo que pueda ayudarte?",
        "¿Qué tal si tomamos un momento para conectar con el presente?"
      ];
      
      const reminder = this.getRandomElement(reminders);
      
      new Notification('SerenBot - Recordatorio de Bienestar', {
        body: reminder,
        icon: '/favicon.ico', // Asumiendo que hay un favicon
        badge: '/favicon.ico'
      });
    }
  }
  
  sendCrisisNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('SerenBot - Apoyo Urgente', {
        body: 'Detecté que podrías necesitar ayuda inmediata. Recordá: 0800 345 1435',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: true
      });
    }
  }
  
  // Sistema de recordatorios
  startReminderSystem() {
    // Recordatorio cada 30 minutos si no hay interacción
    const thirtyMinutes = 30 * 60 * 1000;
    this.reminderInterval = setInterval(() => {
      const timeSinceLastInteraction = Date.now() - this.lastInteraction;
      
      if (timeSinceLastInteraction > thirtyMinutes && this.isActive) {
        this.sendWellnessReminder();
      }
    }, thirtyMinutes);
  }
  
  // Activar/desactivar bot
  activate() {
    this.isActive = true;
    this.lastInteraction = Date.now();
  }
  
  deactivate() {
    this.isActive = false;
    if (this.reminderInterval) {
      clearInterval(this.reminderInterval);
    }
  }
  
  // Utilidades
  containsKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  }
  
  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  // Obtener estadísticas de la conversación
  getConversationStats() {
    return {
      totalMessages: this.conversationHistory.length,
      userMessages: this.conversationHistory.filter(msg => msg.type === 'user').length,
      botMessages: this.conversationHistory.filter(msg => msg.type === 'bot').length,
      detectedMoods: [...new Set(this.conversationHistory.filter(msg => msg.mood).map(msg => msg.mood))],
      conversationDuration: this.conversationHistory.length > 0 ? 
        Date.now() - this.conversationHistory[0].timestamp : 0
    };
  }
  
  // Exportar historial de conversación
  exportConversationHistory() {
    return {
      userName: this.userName,
      currentMood: this.currentMood,
      conversationHistory: this.conversationHistory,
      stats: this.getConversationStats(),
      exportDate: new Date().toISOString()
    };
  }
  
  // Limpiar historial
  clearHistory() {
    this.conversationHistory = [];
    this.currentMood = 'neutral';
  }
}

// Exportar la clase para uso global
if (typeof window !== 'undefined') {
  window.SerenBot = SerenBot;
}

// Para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SerenBot;
}
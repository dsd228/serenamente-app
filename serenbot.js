/**
 * SerenBot - Chatbot para la aplicación Serenamente
 * Proporciona asistencia básica, respuestas a preguntas frecuentes y ayuda de navegación
 */

class SerenBot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.currentContext = 'general';
    this.waitingForInput = false;
    
    // Conocimiento base de preguntas frecuentes
    this.knowledgeBase = {
      saludos: {
        triggers: ['hola', 'hey', 'buenas', 'buenos días', 'buenas tardes', 'buenas noches', 'hi'],
        responses: [
          '¡Hola! Soy SerenBot, tu asistente virtual en Serenamente. ¿En qué puedo ayudarte hoy?',
          '¡Hola! Estoy aquí para ayudarte a navegar por Serenamente. ¿Qué necesitas?',
          '¡Hola! Bienvenido/a. ¿Te gustaría que te ayude con alguna función específica de la app?'
        ]
      },
      ayuda: {
        triggers: ['ayuda', 'help', 'qué puedes hacer', 'que puedes hacer', 'funciones', 'comandos'],
        responses: [
          `¡Estoy aquí para ayudarte! Puedo:
          
• Responder preguntas sobre cómo usar Serenamente
• Explicarte las diferentes técnicas disponibles
• Ayudarte a navegar por las secciones
• Darte información sobre ejercicios de respiración
• Orientarte sobre meditaciones y actividades

¿Sobre qué te gustaría saber más?`
        ]
      },
      tecnicas: {
        triggers: ['técnicas', 'tecnicas', 'ejercicios', 'métodos', 'metodos', 'herramientas'],
        responses: [
          `Serenamente ofrece técnicas profesionales basadas en evidencia científica:

🧠 **Técnicas Cognitivas**: Reestructuración de pensamientos
🫁 **Ejercicios de Respiración**: Técnicas 4-7-8, respiración diafragmática
🧘 **Mindfulness**: Meditaciones guiadas y atención plena
💝 **Autocompasión**: Técnicas del Dr. Kristin Neff
📝 **Diario Emocional**: Registro de pensamientos y emociones

¿Te interesa alguna técnica en particular?`
        ]
      },
      navegacion: {
        triggers: ['navegar', 'ir a', 'cómo llego', 'como llego', 'dónde está', 'donde esta', 'encontrar', 'buscar'],
        responses: [
          `Te ayudo a navegar por Serenamente:

🏠 **Inicio**: Estado de ánimo y evaluación inicial
🛠️ **Técnicas**: Herramientas de apoyo emocional específicas
🧘 **Meditaciones**: Ejercicios guiados de relajación
🎵 **Audioterapia**: Sonidos curativos y terapéuticos
📚 **Actividades**: Ejercicios de bienestar y autoconocimiento
📝 **Diario**: Registro personal de pensamientos y emociones
📊 **Progreso**: Seguimiento de tu bienestar emocional

¿A qué sección te gustaría ir?`
        ]
      },
      respiracion: {
        triggers: ['respiración', 'respiracion', 'respiro', 'ansiedad', 'pánico', 'panico', 'calmarme', 'relajarme'],
        responses: [
          `Los ejercicios de respiración son muy efectivos:

🌬️ **Respiración 4-7-8**: Inhala 4, mantén 7, exhala 8
🫁 **Respiración Diafragmática**: Respira desde el abdomen
🔄 **Respiración Consciente**: Atención plena en la respiración

Puedes encontrar ejercicios guiados en la sección "Meditaciones". ¿Te gustaría que te guíe hacia allí?`
        ]
      },
      crisis: {
        triggers: ['crisis', 'suicidio', 'emergencia', 'mal', 'muy mal', 'ayuda urgente', 'no puedo más'],
        responses: [
          `🆘 **Si estás en crisis, busca ayuda inmediata:**

📞 **Centro de Asistencia al Suicida**: 0800 345 1435
📞 **Línea de prevención suicide**: 135
🏥 **Emergencias**: 911

Serenamente no reemplaza la atención profesional. Por favor, contacta con un profesional de salud mental.

¿Necesitas que te ayude a encontrar técnicas de apoyo inmediato?`
        ]
      },
      diario: {
        triggers: ['diario', 'escribir', 'registrar', 'pensamientos', 'emociones', 'sentimientos'],
        responses: [
          `El diario emocional es una herramienta poderosa:

📝 **Beneficios**:
• Procesamiento de emociones
• Identificación de patrones
• Reducción del estrés
• Autoconocimiento

Puedes acceder al diario desde la sección "Actividades" o "Diario Personal". ¿Te gustaría que te muestre cómo usarlo?`
        ]
      },
      progreso: {
        triggers: ['progreso', 'avance', 'estadísticas', 'estadisticas', 'seguimiento', 'mejora'],
        responses: [
          `Tu progreso es importante. En Serenamente puedes ver:

📊 **Métricas de Bienestar**:
• Días de uso de la aplicación
• Entradas en el diario
• Técnicas practicadas
• Actividades completadas

📈 **Análisis de Estado de Ánimo**:
• Gráficos de evolución emocional
• Patrones de bienestar
• Indicadores de riesgo

¿Te gustaría revisar tu progreso actual?`
        ]
      }
    };

    // Respuestas por defecto
    this.defaultResponses = [
      'Entiendo tu consulta. ¿Podrías ser más específico sobre qué necesitas?',
      'No estoy seguro de entender completamente. ¿Podrías reformular tu pregunta?',
      'Esa es una buena pregunta. ¿Te refieres a alguna función específica de Serenamente?',
      'Puedo ayudarte mejor si me das más detalles. ¿Qué exactamente necesitas saber?'
    ];

    // Sugerencias rápidas
    this.quickSuggestions = [
      '¿Cómo uso las técnicas?',
      '¿Dónde están las meditaciones?',
      'Ayuda con respiración',
      'Explicar el diario',
      'Ver mi progreso'
    ];
  }

  init() {
    this.createChatInterface();
    this.addWelcomeMessage();
    this.bindEvents();
  }

  createChatInterface() {
    // Crear el contenedor del chat
    const chatContainer = document.createElement('div');
    chatContainer.id = 'serenbot-container';
    chatContainer.className = 'serenbot-container';
    
    chatContainer.innerHTML = `
      <!-- Botón flotante del chat -->
      <div id="serenbot-toggle" class="serenbot-toggle">
        <i class="fas fa-robot"></i>
        <div class="serenbot-notification" id="serenbot-notification">1</div>
      </div>

      <!-- Ventana del chat -->
      <div id="serenbot-window" class="serenbot-window hidden">
        <div class="serenbot-header">
          <div class="serenbot-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="serenbot-title">
            <h3>SerenBot</h3>
            <span class="serenbot-status">Asistente Virtual</span>
          </div>
          <button id="serenbot-close" class="serenbot-close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div id="serenbot-messages" class="serenbot-messages"></div>

        <div class="serenbot-suggestions" id="serenbot-suggestions">
          ${this.quickSuggestions.map(suggestion => 
            `<button class="serenbot-suggestion" data-suggestion="${suggestion}">${suggestion}</button>`
          ).join('')}
        </div>

        <div class="serenbot-input-container">
          <input 
            type="text" 
            id="serenbot-input" 
            class="serenbot-input" 
            placeholder="Escribe tu mensaje..."
            maxlength="500"
          />
          <button id="serenbot-send" class="serenbot-send">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(chatContainer);
    this.addChatStyles();
  }

  addChatStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .serenbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        font-family: 'Inter', sans-serif;
      }

      .serenbot-toggle {
        width: 60px;
        height: 60px;
        background: var(--gradient, linear-gradient(135deg, #4361ee, #3a0ca3));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
        transition: all 0.3s ease;
        position: relative;
      }

      .serenbot-toggle:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(67, 97, 238, 0.4);
      }

      .serenbot-notification {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ef4444;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: bold;
      }

      .serenbot-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .dark-mode .serenbot-window {
        background: #1e293b;
        border: 1px solid #334155;
      }

      .serenbot-window.hidden {
        opacity: 0;
        transform: translateY(20px);
        pointer-events: none;
      }

      .serenbot-header {
        background: var(--gradient, linear-gradient(135deg, #4361ee, #3a0ca3));
        color: white;
        padding: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .serenbot-avatar {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
      }

      .serenbot-title {
        flex: 1;
      }

      .serenbot-title h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .serenbot-status {
        font-size: 0.8rem;
        opacity: 0.9;
      }

      .serenbot-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
        transition: background 0.2s ease;
      }

      .serenbot-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .serenbot-messages {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        background: #f8fafc;
      }

      .dark-mode .serenbot-messages {
        background: #0f172a;
      }

      .serenbot-message {
        margin-bottom: 15px;
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }

      .serenbot-message.user {
        flex-direction: row-reverse;
      }

      .serenbot-message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
        flex-shrink: 0;
      }

      .serenbot-message.bot .serenbot-message-avatar {
        background: var(--gradient, linear-gradient(135deg, #4361ee, #3a0ca3));
        color: white;
      }

      .serenbot-message.user .serenbot-message-avatar {
        background: #e2e8f0;
        color: #64748b;
      }

      .dark-mode .serenbot-message.user .serenbot-message-avatar {
        background: #334155;
        color: #cbd5e1;
      }

      .serenbot-message-content {
        background: white;
        padding: 10px 12px;
        border-radius: 12px;
        max-width: 250px;
        line-height: 1.4;
        font-size: 0.9rem;
        border: 1px solid #e2e8f0;
      }

      .dark-mode .serenbot-message-content {
        background: #334155;
        border-color: #475569;
        color: #e2e8f0;
      }

      .serenbot-message.user .serenbot-message-content {
        background: var(--gradient, linear-gradient(135deg, #4361ee, #3a0ca3));
        color: white;
        border: none;
      }

      .serenbot-suggestions {
        padding: 10px 15px;
        background: white;
        border-top: 1px solid #e2e8f0;
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }

      .dark-mode .serenbot-suggestions {
        background: #1e293b;
        border-color: #334155;
      }

      .serenbot-suggestion {
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 6px 10px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .dark-mode .serenbot-suggestion {
        background: #334155;
        border-color: #475569;
        color: #e2e8f0;
      }

      .serenbot-suggestion:hover {
        background: #e0f2fe;
        border-color: var(--primary, #4361ee);
      }

      .dark-mode .serenbot-suggestion:hover {
        background: #475569;
      }

      .serenbot-input-container {
        display: flex;
        padding: 15px;
        background: white;
        border-top: 1px solid #e2e8f0;
        gap: 8px;
      }

      .dark-mode .serenbot-input-container {
        background: #1e293b;
        border-color: #334155;
      }

      .serenbot-input {
        flex: 1;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 0.9rem;
        outline: none;
        transition: border-color 0.2s ease;
      }

      .dark-mode .serenbot-input {
        background: #334155;
        border-color: #475569;
        color: #e2e8f0;
      }

      .serenbot-input:focus {
        border-color: var(--primary, #4361ee);
      }

      .serenbot-send {
        background: var(--gradient, linear-gradient(135deg, #4361ee, #3a0ca3));
        color: white;
        border: none;
        border-radius: 8px;
        width: 40px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.2s ease;
      }

      .serenbot-send:hover {
        opacity: 0.9;
      }

      .serenbot-typing {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px 12px;
        font-style: italic;
        color: #64748b;
        font-size: 0.85rem;
      }

      .serenbot-typing-dots {
        display: flex;
        gap: 2px;
      }

      .serenbot-typing-dot {
        width: 4px;
        height: 4px;
        background: #64748b;
        border-radius: 50%;
        animation: serenbot-pulse 1.4s infinite both;
      }

      .serenbot-typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .serenbot-typing-dot:nth-child(2) { animation-delay: -0.16s; }

      @keyframes serenbot-pulse {
        0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
      }

      /* Responsive design */
      @media (max-width: 600px) {
        .serenbot-container {
          bottom: 10px;
          right: 10px;
        }

        .serenbot-window {
          width: calc(100vw - 20px);
          height: calc(100vh - 120px);
          bottom: 70px;
          right: -10px;
        }

        .serenbot-toggle {
          width: 50px;
          height: 50px;
          font-size: 1.3rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  bindEvents() {
    const toggle = document.getElementById('serenbot-toggle');
    const close = document.getElementById('serenbot-close');
    const input = document.getElementById('serenbot-input');
    const send = document.getElementById('serenbot-send');
    const suggestions = document.getElementById('serenbot-suggestions');

    toggle.addEventListener('click', () => this.toggleChat());
    close.addEventListener('click', () => this.closeChat());
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
    
    send.addEventListener('click', () => this.sendMessage());

    // Sugerencias rápidas
    suggestions.addEventListener('click', (e) => {
      if (e.target.classList.contains('serenbot-suggestion')) {
        const suggestion = e.target.dataset.suggestion;
        this.sendMessage(suggestion);
      }
    });
  }

  toggleChat() {
    const window = document.getElementById('serenbot-window');
    const notification = document.getElementById('serenbot-notification');
    
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      window.classList.remove('hidden');
      notification.style.display = 'none';
      // Enfocar input
      setTimeout(() => {
        document.getElementById('serenbot-input').focus();
      }, 300);
    } else {
      window.classList.add('hidden');
    }
  }

  closeChat() {
    const window = document.getElementById('serenbot-window');
    window.classList.add('hidden');
    this.isOpen = false;
  }

  addWelcomeMessage() {
    const welcomeMessage = `¡Hola! Soy SerenBot 🤖

Estoy aquí para ayudarte a navegar por Serenamente y responder tus preguntas sobre:

• Técnicas de apoyo emocional
• Ejercicios de respiración y relajación  
• Navegación por la aplicación
• Información sobre funciones disponibles

¿En qué puedo ayudarte hoy?`;

    this.addMessage(welcomeMessage, 'bot');
  }

  sendMessage(text = null) {
    const input = document.getElementById('serenbot-input');
    const message = text || input.value.trim();
    
    if (!message) return;

    // Agregar mensaje del usuario
    this.addMessage(message, 'user');
    
    // Limpiar input
    if (!text) input.value = '';

    // Mostrar indicador de escritura
    this.showTyping();

    // Procesar respuesta después de un breve delay
    setTimeout(() => {
      this.hideTyping();
      const response = this.processMessage(message);
      this.addMessage(response, 'bot');
    }, 1000 + Math.random() * 1000); // Delay variable para parecer más natural
  }

  processMessage(message) {
    const normalizedMessage = message.toLowerCase().trim();
    
    // Buscar en la base de conocimiento
    for (const [category, data] of Object.entries(this.knowledgeBase)) {
      const triggers = data.triggers;
      
      if (triggers.some(trigger => normalizedMessage.includes(trigger))) {
        const responses = data.responses;
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Agregar contexto para respuestas de seguimiento
        this.currentContext = category;
        
        return randomResponse;
      }
    }

    // Si no encuentra coincidencia, respuesta por defecto
    const defaultResponse = this.defaultResponses[Math.floor(Math.random() * this.defaultResponses.length)];
    return defaultResponse + '\n\nPuedes probar preguntándome sobre:\n• Técnicas de relajación\n• Cómo navegar por la app\n• Información sobre meditaciones\n• Uso del diario emocional';
  }

  addMessage(text, sender) {
    const messagesContainer = document.getElementById('serenbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `serenbot-message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'serenbot-message-avatar';
    avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const content = document.createElement('div');
    content.className = 'serenbot-message-content';
    content.innerHTML = text.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Guardar mensaje en historial
    this.messages.push({ text, sender, timestamp: new Date() });
  }

  showTyping() {
    const messagesContainer = document.getElementById('serenbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'serenbot-typing-indicator';
    typingDiv.className = 'serenbot-message bot';
    
    typingDiv.innerHTML = `
      <div class="serenbot-message-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="serenbot-message-content">
        <div class="serenbot-typing">
          SerenBot está escribiendo
          <div class="serenbot-typing-dots">
            <div class="serenbot-typing-dot"></div>
            <div class="serenbot-typing-dot"></div>
            <div class="serenbot-typing-dot"></div>
          </div>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTyping() {
    const typingIndicator = document.getElementById('serenbot-typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Métodos para extensibilidad
  addKnowledgeCategory(category, triggers, responses) {
    this.knowledgeBase[category] = {
      triggers: triggers,
      responses: responses
    };
  }

  updateQuickSuggestions(suggestions) {
    this.quickSuggestions = suggestions;
    const suggestionsContainer = document.getElementById('serenbot-suggestions');
    suggestionsContainer.innerHTML = suggestions.map(suggestion => 
      `<button class="serenbot-suggestion" data-suggestion="${suggestion}">${suggestion}</button>`
    ).join('');
  }

  // Navegación asistida
  navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      // Ocultar todas las secciones
      document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
      // Mostrar la sección solicitada
      section.classList.remove('hidden');
      window.scrollTo(0, 0);
      return true;
    }
    return false;
  }

  // Obtener estadísticas de uso
  getUsageStats() {
    return {
      totalMessages: this.messages.length,
      userMessages: this.messages.filter(m => m.sender === 'user').length,
      botMessages: this.messages.filter(m => m.sender === 'bot').length,
      currentContext: this.currentContext,
      isActive: this.isOpen
    };
  }
}

// Inicializar SerenBot cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Verificar si ya existe una instancia
  if (!window.serenBot) {
    window.serenBot = new SerenBot();
    window.serenBot.init();
  }
});

// Exportar para uso modular
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SerenBot;
}
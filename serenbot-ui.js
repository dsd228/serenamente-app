/**
 * SerenBot UI - Interface integration for the Serenamente app
 */
class SerenBotUI {
  constructor() {
    this.serenBot = null;
    this.isOpen = false;
    this.isTyping = false;
    this.currentExercise = null;
    this.messageId = 0;
    
    this.init();
  }
  
  init() {
    this.serenBot = new SerenBot();
    this.createChatInterface();
    this.setupEventListeners();
    this.serenBot.activate();
    
    // Mostrar mensaje de bienvenida después de un breve delay
    setTimeout(() => {
      this.addBotMessage(this.serenBot.getRandomElement(this.serenBot.knowledgeBase.greetings));
    }, 1000);
  }
  
  createChatInterface() {
    // Crear botón flotante
    const toggleButton = document.createElement('button');
    toggleButton.className = 'serenbot-toggle';
    toggleButton.innerHTML = '<i class="fas fa-comments"></i>';
    toggleButton.setAttribute('aria-label', 'Abrir chat de SerenBot');
    
    // Crear contenedor del chat
    const chatContainer = document.createElement('div');
    chatContainer.className = 'serenbot-container';
    chatContainer.innerHTML = `
      <div class="serenbot-header">
        <div class="serenbot-title">
          <i class="fas fa-robot"></i>
          <span>SerenBot</span>
        </div>
        <button class="serenbot-close" aria-label="Cerrar chat">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="serenbot-messages" id="serenbot-messages">
        <!-- Los mensajes se agregarán aquí dinámicamente -->
      </div>
      
      <div class="serenbot-input-area">
        <div class="input-container">
          <textarea 
            class="message-input" 
            id="message-input"
            placeholder="Escribí tu mensaje..."
            rows="1"
            aria-label="Escribir mensaje a SerenBot"
          ></textarea>
          <button class="send-button" id="send-button" aria-label="Enviar mensaje">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;
    
    // Agregar elementos al DOM
    document.body.appendChild(toggleButton);
    document.body.appendChild(chatContainer);
    
    // Guardar referencias
    this.toggleButton = toggleButton;
    this.chatContainer = chatContainer;
    this.messagesContainer = document.getElementById('serenbot-messages');
    this.messageInput = document.getElementById('message-input');
    this.sendButton = document.getElementById('send-button');
  }
  
  setupEventListeners() {
    // Toggle del chat
    this.toggleButton.addEventListener('click', () => {
      this.toggleChat();
    });
    
    // Cerrar chat
    this.chatContainer.querySelector('.serenbot-close').addEventListener('click', () => {
      this.closeChat();
    });
    
    // Enviar mensaje
    this.sendButton.addEventListener('click', () => {
      this.sendMessage();
    });
    
    // Enter para enviar mensaje
    this.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // Auto-resize del textarea
    this.messageInput.addEventListener('input', () => {
      this.autoResizeTextarea();
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeChat();
      }
    });
  }
  
  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }
  
  openChat() {
    this.isOpen = true;
    this.chatContainer.classList.add('open');
    this.toggleButton.classList.add('chat-open');
    this.toggleButton.innerHTML = '<i class="fas fa-times"></i>';
    this.messageInput.focus();
    
    // Scroll al último mensaje
    this.scrollToBottom();
  }
  
  closeChat() {
    this.isOpen = false;
    this.chatContainer.classList.remove('open');
    this.toggleButton.classList.remove('chat-open');
    this.toggleButton.innerHTML = '<i class="fas fa-comments"></i>';
  }
  
  sendMessage() {
    const message = this.messageInput.value.trim();
    if (!message) return;
    
    // Agregar mensaje del usuario
    this.addUserMessage(message);
    
    // Limpiar input
    this.messageInput.value = '';
    this.autoResizeTextarea();
    
    // Mostrar indicador de escritura
    this.showTypingIndicator();
    
    // Procesar mensaje con el bot
    setTimeout(() => {
      const response = this.serenBot.processMessage(message);
      this.hideTypingIndicator();
      this.handleBotResponse(response);
    }, 1000 + Math.random() * 1500); // Delay realista
  }
  
  addUserMessage(message) {
    const messageElement = this.createMessageElement('user', message);
    this.messagesContainer.appendChild(messageElement);
    this.scrollToBottom();
  }
  
  addBotMessage(message, type = 'text', extraData = null) {
    const messageElement = this.createMessageElement('bot', message, type, extraData);
    this.messagesContainer.appendChild(messageElement);
    this.scrollToBottom();
  }
  
  createMessageElement(sender, content, type = 'text', extraData = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.setAttribute('data-message-id', this.messageId++);
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Agregar clases especiales según el tipo
    if (extraData?.type === 'crisis') {
      messageContent.classList.add('crisis-message');
    } else if (extraData?.type === 'guided_exercise_start') {
      messageContent.classList.add('technique-message');
    }
    
    // Contenido del mensaje
    messageContent.innerHTML = this.formatMessage(content);
    
    // Agregar elementos adicionales según el tipo de respuesta
    if (extraData) {
      this.addExtraContent(messageContent, extraData);
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    return messageDiv;
  }
  
  formatMessage(message) {
    // Formatear texto básico (enlaces, negritas, etc.)
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(\d{4} \d{3} \d{4})/g, '<strong>$1</strong>'); // Números de teléfono
  }
  
  addExtraContent(messageContent, extraData) {
    // Botones de acción rápida
    if (extraData.suggestedActions && extraData.suggestedActions.length > 0) {
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'quick-actions';
      
      extraData.suggestedActions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'quick-action-btn';
        button.textContent = action.text;
        button.addEventListener('click', () => {
          this.handleQuickAction(action);
        });
        actionsDiv.appendChild(button);
      });
      
      messageContent.appendChild(actionsDiv);
    }
    
    // Técnicas sugeridas
    if (extraData.techniques && extraData.techniques.length > 0) {
      const techniquesDiv = document.createElement('div');
      techniquesDiv.className = 'technique-suggestions';
      
      extraData.techniques.forEach(techniqueId => {
        const technique = this.serenBot.knowledgeBase.techniques[techniqueId];
        if (technique) {
          const suggestionDiv = document.createElement('div');
          suggestionDiv.className = 'technique-suggestion';
          suggestionDiv.innerHTML = `
            <div class="technique-icon">
              <i class="fas fa-spa"></i>
            </div>
            <div class="technique-info">
              <div class="technique-name">${technique.name}</div>
              <div class="technique-duration">${technique.duration}</div>
            </div>
          `;
          
          suggestionDiv.addEventListener('click', () => {
            this.startGuidedExercise(techniqueId);
          });
          
          techniquesDiv.appendChild(suggestionDiv);
        }
      });
      
      messageContent.appendChild(techniquesDiv);
    }
    
    // Ejercicio guiado
    if (extraData.type === 'guided_exercise_start') {
      this.createGuidedExercise(messageContent, extraData);
    }
    
    // Botones de crisis
    if (extraData.actions) {
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'quick-actions';
      
      extraData.actions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'quick-action-btn';
        button.style.background = '#ef4444';
        button.style.color = 'white';
        button.style.borderColor = '#ef4444';
        button.textContent = action.text;
        button.addEventListener('click', () => {
          this.handleCrisisAction(action);
        });
        actionsDiv.appendChild(button);
      });
      
      messageContent.appendChild(actionsDiv);
    }
  }
  
  createGuidedExercise(messageContent, exerciseData) {
    const exerciseDiv = document.createElement('div');
    exerciseDiv.className = 'guided-exercise';
    
    const header = document.createElement('div');
    header.className = 'exercise-header';
    header.innerHTML = `
      <i class="fas fa-play-circle"></i>
      <span>${exerciseData.technique.name}</span>
    `;
    
    const stepsList = document.createElement('ol');
    stepsList.className = 'exercise-steps';
    
    exerciseData.steps.forEach((step, index) => {
      const stepDiv = document.createElement('li');
      stepDiv.className = 'exercise-step';
      stepDiv.innerHTML = `
        <div class="step-number">${index + 1}</div>
        <div class="step-text">${step}</div>
      `;
      stepsList.appendChild(stepDiv);
    });
    
    exerciseDiv.appendChild(header);
    exerciseDiv.appendChild(stepsList);
    messageContent.appendChild(exerciseDiv);
  }
  
  handleBotResponse(response) {
    if (response.type === 'crisis') {
      // Enviar notificación de crisis
      this.serenBot.sendCrisisNotification();
    }
    
    this.addBotMessage(response.text, 'text', response);
  }
  
  handleQuickAction(action) {
    switch (action.action) {
      case 'show_techniques':
        this.addUserMessage('Quiero ver técnicas recomendadas');
        this.showTypingIndicator();
        setTimeout(() => {
          this.hideTypingIndicator();
          const response = this.serenBot.suggestTechniques();
          this.handleBotResponse(response);
        }, 1000);
        break;
        
      case 'start_guided_exercise':
        this.startGuidedExercise(action.data);
        break;
        
      case 'show_breathing_techniques':
        this.addUserMessage('Mostrame técnicas de respiración');
        this.showBreathingTechniques();
        break;
        
      case 'show_relaxation_techniques':
        this.addUserMessage('Quiero técnicas de relajación');
        this.showRelaxationTechniques();
        break;
        
      case 'mood_check':
        this.addUserMessage('Quiero hablar sobre mis sentimientos');
        this.startMoodCheck();
        break;
    }
  }
  
  handleCrisisAction(action) {
    switch (action.action) {
      case 'call_crisis_line':
        window.open('tel:08003451435', '_self');
        break;
        
      case 'show_safety_plan':
        this.showSafetyPlan();
        break;
    }
  }
  
  startGuidedExercise(techniqueId) {
    this.addUserMessage(`Quiero hacer la técnica: ${this.serenBot.knowledgeBase.techniques[techniqueId]?.name}`);
    this.showTypingIndicator();
    
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.serenBot.startGuidedExercise(techniqueId);
      this.handleBotResponse(response);
    }, 1000);
  }
  
  showBreathingTechniques() {
    const breathingTechniques = ['respiracion_4_7_8', 'respiracion_diafragmatica'];
    const response = {
      text: "Aquí tienes algunas técnicas de respiración que pueden ayudarte:",
      type: 'technique_suggestion',
      techniques: breathingTechniques
    };
    
    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();
      this.handleBotResponse(response);
    }, 1000);
  }
  
  showRelaxationTechniques() {
    const relaxationTechniques = ['relajacion_muscular_progresiva', 'tecnica_5_4_3_2_1'];
    const response = {
      text: "Te recomiendo estas técnicas de relajación:",
      type: 'technique_suggestion',
      techniques: relaxationTechniques
    };
    
    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();
      this.handleBotResponse(response);
    }, 1000);
  }
  
  startMoodCheck() {
    const response = {
      text: "Me alegra que quieras compartir cómo te sentís. Tomate tu tiempo para contarme qué está pasando por tu mente.",
      type: 'empathic_response'
    };
    
    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();
      this.handleBotResponse(response);
    }, 1000);
  }
  
  showSafetyPlan() {
    const safetyPlanResponse = {
      text: "Tu seguridad es lo más importante. Aquí tienes recursos inmediatos:",
      type: 'safety_plan',
      actions: [
        { text: "Llamar 0800 345 1435", action: "call_crisis_line" },
        { text: "Llamar 135 (Línea Nacional)", action: "call_national_line" }
      ]
    };
    
    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();
      this.handleBotResponse(safetyPlanResponse);
    }, 800);
  }
  
  showTypingIndicator() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-message';
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="typing-indicator">
        <span>SerenBot está escribiendo</span>
        <div class="typing-dots">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    
    this.messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }
  
  hideTypingIndicator() {
    const typingMessage = this.messagesContainer.querySelector('.typing-message');
    if (typingMessage) {
      typingMessage.remove();
    }
    this.isTyping = false;
  }
  
  autoResizeTextarea() {
    this.messageInput.style.height = 'auto';
    this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 80) + 'px';
  }
  
  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 100);
  }
  
  // Métodos públicos para integración
  sendNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico'
      });
    }
  }
  
  updateUserInfo(name, mood) {
    if (name) this.serenBot.userName = name;
    if (mood) this.serenBot.currentMood = mood;
  }
  
  getConversationData() {
    return this.serenBot.exportConversationHistory();
  }
  
  clearConversation() {
    this.serenBot.clearHistory();
    this.messagesContainer.innerHTML = '';
    this.messageId = 0;
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
      this.addBotMessage(this.serenBot.getRandomElement(this.serenBot.knowledgeBase.greetings));
    }, 500);
  }
}

// Función de inicialización global
function initSerenBot() {
  // Verificar que SerenBot esté disponible
  if (typeof SerenBot === 'undefined') {
    console.error('SerenBot class not found. Make sure serenbot.js is loaded first.');
    return;
  }
  
  // Crear instancia global
  window.serenBotUI = new SerenBotUI();
  
  // Integración con la aplicación existente
  integrateWithSerenamenteApp();
}

// Integración con la aplicación Serenamente existente
function integrateWithSerenamenteApp() {
  // Detectar cuando el usuario establece su nombre
  const originalSaveName = window.saveName;
  if (typeof originalSaveName === 'function') {
    window.saveName = function() {
      const result = originalSaveName.apply(this, arguments);
      const userName = document.getElementById('userName')?.value;
      if (userName && window.serenBotUI) {
        window.serenBotUI.updateUserInfo(userName, null);
      }
      return result;
    };
  }
  
  // Detectar cuando el usuario selecciona un estado de ánimo
  document.addEventListener('click', function(e) {
    if (e.target.closest('.mood') && window.serenBotUI) {
      const moodElement = e.target.closest('.mood');
      const mood = moodElement.dataset.value;
      if (mood) {
        setTimeout(() => {
          window.serenBotUI.updateUserInfo(null, mood);
        }, 100);
      }
    }
  });
  
  // Solicitar permisos de notificación
  if ('Notification' in window && Notification.permission === 'default') {
    setTimeout(() => {
      Notification.requestPermission();
    }, 3000);
  }
}

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSerenBot);
} else {
  initSerenBot();
}
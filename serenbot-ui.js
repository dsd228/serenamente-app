/**
 * SerenBot UI Integration
 * Componente de interfaz para integrar SerenBot con la aplicación existente
 */

class SerenBotUI {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container element with id "${containerId}" not found`);
    }

    this.options = {
      showTimestamps: true,
      enableVoice: false,
      theme: 'light',
      position: 'bottom-right',
      ...options
    };

    // Inicializar SerenBot
    this.bot = new SerenBot({
      language: this.getStoredLanguage() || 'es',
      debugMode: this.options.debugMode || false,
      enableEncryption: this.options.enableEncryption || false
    });

    this.isOpen = false;
    this.isTyping = false;
    
    this.init();
  }

  async init() {
    try {
      // Crear estructura HTML
      this.createChatInterface();
      
      // Configurar eventos
      this.setupEventListeners();
      
      // Aplicar configuraciones de accesibilidad almacenadas
      this.applyStoredAccessibilitySettings();
      
      // Cargar configuración de idioma
      await this.loadLanguageSettings();
      
      // Inicializar bot
      await this.bot.init();
      
      // Mostrar mensaje de bienvenida
      this.addBotMessage(this.bot.getMessage('welcome'));
      
      console.log('SerenBot UI inicializado correctamente');
      
    } catch (error) {
      console.error('Error inicializando SerenBot UI:', error);
      this.showError('Error de inicialización');
    }
  }

  createChatInterface() {
    this.container.innerHTML = `
      <div class="serenbot-widget" role="complementary" aria-label="Chat de apoyo emocional">
        <!-- Botón flotante -->
        <button class="serenbot-toggle" 
                id="serenbot-toggle" 
                aria-label="Abrir chat de apoyo"
                aria-expanded="false">
          <i class="fas fa-comments" aria-hidden="true"></i>
          <span class="serenbot-badge" id="serenbot-badge" style="display: none;">1</span>
        </button>

        <!-- Ventana de chat -->
        <div class="serenbot-chat" id="serenbot-chat" style="display: none;" role="dialog" aria-labelledby="serenbot-title">
          <!-- Header -->
          <div class="serenbot-header">
            <div class="serenbot-header-content">
              <div class="serenbot-avatar">
                <i class="fas fa-robot" aria-hidden="true"></i>
              </div>
              <div class="serenbot-info">
                <h3 id="serenbot-title">SerenBot</h3>
                <span class="serenbot-status" id="serenbot-status">En línea</span>
              </div>
            </div>
            <div class="serenbot-header-actions">
              <button class="serenbot-settings-btn" 
                      id="serenbot-settings" 
                      aria-label="Configuración">
                <i class="fas fa-cog" aria-hidden="true"></i>
              </button>
              <button class="serenbot-close-btn" 
                      id="serenbot-close" 
                      aria-label="Cerrar chat">
                <i class="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div class="serenbot-messages" 
               id="serenbot-messages" 
               role="log" 
               aria-live="polite" 
               aria-label="Historial de mensajes">
          </div>

          <!-- Typing indicator -->
          <div class="serenbot-typing" id="serenbot-typing" style="display: none;">
            <div class="serenbot-typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span class="serenbot-typing-text">SerenBot está escribiendo...</span>
          </div>

          <!-- Input -->
          <div class="serenbot-input-container">
            <div class="serenbot-input-wrapper">
              <textarea class="serenbot-input" 
                       id="serenbot-input" 
                       placeholder="Escribe tu mensaje..."
                       rows="1"
                       aria-label="Escribir mensaje"
                       maxlength="500"></textarea>
              <button class="serenbot-send-btn" 
                      id="serenbot-send" 
                      aria-label="Enviar mensaje"
                      disabled>
                <i class="fas fa-paper-plane" aria-hidden="true"></i>
              </button>
            </div>
            <div class="serenbot-input-footer">
              <span class="serenbot-char-count" id="serenbot-char-count">0/500</span>
              <button class="serenbot-clear-btn" 
                      id="serenbot-clear" 
                      aria-label="Limpiar conversación">
                <i class="fas fa-trash" aria-hidden="true"></i> Limpiar
              </button>
            </div>
          </div>
        </div>

        <!-- Settings Panel -->
        <div class="serenbot-settings-panel" id="serenbot-settings-panel" style="display: none;">
          <div class="serenbot-settings-header">
            <h4>Configuración</h4>
            <button class="serenbot-settings-close" id="serenbot-settings-close" aria-label="Cerrar configuración">
              <i class="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
          <div class="serenbot-settings-content">
            <!-- Language Settings -->
            <div class="serenbot-setting-group">
              <label for="serenbot-language">Idioma:</label>
              <select id="serenbot-language" class="serenbot-select">
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>

            <!-- Accessibility Settings -->
            <div class="serenbot-setting-group">
              <h5>Accesibilidad</h5>
              
              <label class="serenbot-checkbox-label">
                <input type="checkbox" id="serenbot-high-contrast"> Alto contraste
              </label>
              
              <label class="serenbot-checkbox-label">
                <input type="checkbox" id="serenbot-reduce-motion"> Reducir animaciones
              </label>
              
              <label for="serenbot-font-size">Tamaño de texto:</label>
              <select id="serenbot-font-size" class="serenbot-select">
                <option value="small">Pequeño</option>
                <option value="medium" selected>Mediano</option>
                <option value="large">Grande</option>
                <option value="extra-large">Extra grande</option>
              </select>
            </div>

            <!-- Privacy Settings -->
            <div class="serenbot-setting-group">
              <h5>Privacidad</h5>
              <label class="serenbot-checkbox-label">
                <input type="checkbox" id="serenbot-save-history"> Guardar historial
              </label>
              <button class="serenbot-btn serenbot-btn-danger" id="serenbot-clear-data">
                Eliminar todos los datos
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Agregar estilos CSS
    this.injectStyles();
  }

  injectStyles() {
    if (document.getElementById('serenbot-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'serenbot-styles';
    styles.textContent = `
      .serenbot-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .serenbot-toggle {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4361ee, #3a0ca3);
        border: none;
        box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        position: relative;
      }

      .serenbot-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(67, 97, 238, 0.4);
      }

      .serenbot-toggle i {
        color: white;
        font-size: 24px;
      }

      .serenbot-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #f87171;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
      }

      .serenbot-chat {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 400px;
        height: 600px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s ease;
      }

      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      .serenbot-header {
        background: linear-gradient(135deg, #4361ee, #3a0ca3);
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .serenbot-header-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .serenbot-avatar {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .serenbot-info h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .serenbot-status {
        font-size: 12px;
        opacity: 0.8;
      }

      .serenbot-header-actions {
        display: flex;
        gap: 8px;
      }

      .serenbot-header-actions button {
        background: none;
        border: none;
        color: white;
        padding: 8px;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .serenbot-header-actions button:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .serenbot-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .serenbot-message {
        display: flex;
        gap: 8px;
        max-width: 85%;
        animation: messageAppear 0.3s ease;
      }

      @keyframes messageAppear {
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      .serenbot-message.user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }

      .serenbot-message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        flex-shrink: 0;
      }

      .serenbot-message.bot .serenbot-message-avatar {
        background: linear-gradient(135deg, #4361ee, #3a0ca3);
        color: white;
      }

      .serenbot-message.user .serenbot-message-avatar {
        background: #e5e7eb;
        color: #374151;
      }

      .serenbot-message-content {
        background: #f3f4f6;
        padding: 12px 16px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
      }

      .serenbot-message.bot .serenbot-message-content {
        background: #f3f4f6;
        color: #374151;
      }

      .serenbot-message.user .serenbot-message-content {
        background: linear-gradient(135deg, #4361ee, #3a0ca3);
        color: white;
      }

      .serenbot-message.error .serenbot-message-content {
        background: #fee2e2;
        color: #dc2626;
        border: 1px solid #fecaca;
      }

      .serenbot-message.crisis .serenbot-message-content {
        background: #fef3c7;
        color: #d97706;
        border: 1px solid #fde68a;
        font-weight: 500;
      }

      .serenbot-typing {
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #6b7280;
        font-size: 14px;
      }

      .serenbot-typing-dots {
        display: flex;
        gap: 4px;
      }

      .serenbot-typing-dots span {
        width: 8px;
        height: 8px;
        background: #6b7280;
        border-radius: 50%;
        animation: typingDot 1.4s infinite;
      }

      .serenbot-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
      .serenbot-typing-dots span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes typingDot {
        0%, 60%, 100% { opacity: 0.3; }
        30% { opacity: 1; }
      }

      .serenbot-input-container {
        border-top: 1px solid #e5e7eb;
        padding: 16px;
      }

      .serenbot-input-wrapper {
        display: flex;
        gap: 8px;
        align-items: flex-end;
      }

      .serenbot-input {
        flex: 1;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        padding: 12px 16px;
        font-size: 14px;
        resize: none;
        outline: none;
        transition: border-color 0.2s;
        font-family: inherit;
      }

      .serenbot-input:focus {
        border-color: #4361ee;
        box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
      }

      .serenbot-send-btn {
        background: linear-gradient(135deg, #4361ee, #3a0ca3);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .serenbot-send-btn:disabled {
        background: #d1d5db;
        cursor: not-allowed;
      }

      .serenbot-send-btn:not(:disabled):hover {
        transform: scale(1.1);
      }

      .serenbot-input-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        font-size: 12px;
        color: #6b7280;
      }

      .serenbot-clear-btn {
        background: none;
        border: 1px solid #d1d5db;
        color: #6b7280;
        padding: 4px 8px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
      }

      .serenbot-clear-btn:hover {
        background: #f3f4f6;
        border-color: #9ca3af;
      }

      /* Settings Panel */
      .serenbot-settings-panel {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 300px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        animation: slideUp 0.3s ease;
      }

      .serenbot-settings-header {
        background: #f8fafc;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e5e7eb;
      }

      .serenbot-settings-header h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .serenbot-settings-close {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 4px;
      }

      .serenbot-settings-content {
        padding: 16px;
      }

      .serenbot-setting-group {
        margin-bottom: 20px;
      }

      .serenbot-setting-group h5 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
      }

      .serenbot-setting-group label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        color: #374151;
      }

      .serenbot-select {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        background: white;
      }

      .serenbot-checkbox-label {
        display: flex !important;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px !important;
        cursor: pointer;
      }

      .serenbot-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .serenbot-btn-danger {
        background: #dc2626;
        color: white;
      }

      .serenbot-btn-danger:hover {
        background: #b91c1c;
      }

      /* Accessibility */
      .high-contrast .serenbot-chat {
        border: 2px solid #000;
      }

      .high-contrast .serenbot-message-content {
        border: 1px solid #000;
      }

      .reduce-motion * {
        animation-duration: 0.001s !important;
        transition-duration: 0.001s !important;
      }

      /* Font sizes */
      .font-small { --chat-font-size: 12px; }
      .font-medium { --chat-font-size: 14px; }
      .font-large { --chat-font-size: 16px; }
      .font-extra-large { --chat-font-size: 18px; }

      .serenbot-messages {
        font-size: var(--chat-font-size, 14px);
      }

      /* Mobile responsive */
      @media (max-width: 480px) {
        .serenbot-widget {
          bottom: 10px;
          right: 10px;
          left: 10px;
        }

        .serenbot-chat {
          width: 100%;
          height: 70vh;
          bottom: 70px;
          right: 0;
        }

        .serenbot-settings-panel {
          width: 100%;
          right: 0;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  setupEventListeners() {
    // Toggle chat
    document.getElementById('serenbot-toggle').addEventListener('click', () => {
      this.toggleChat();
    });

    // Close chat
    document.getElementById('serenbot-close').addEventListener('click', () => {
      this.closeChat();
    });

    // Send message
    document.getElementById('serenbot-send').addEventListener('click', () => {
      this.sendMessage();
    });

    // Input events
    const input = document.getElementById('serenbot-input');
    input.addEventListener('input', () => {
      this.handleInputChange();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Clear conversation
    document.getElementById('serenbot-clear').addEventListener('click', () => {
      this.clearConversation();
    });

    // Settings
    document.getElementById('serenbot-settings').addEventListener('click', () => {
      this.toggleSettings();
    });

    document.getElementById('serenbot-settings-close').addEventListener('click', () => {
      this.toggleSettings();
    });

    // Language change
    document.getElementById('serenbot-language').addEventListener('change', (e) => {
      this.changeLanguage(e.target.value);
    });

    // Accessibility settings
    document.getElementById('serenbot-high-contrast').addEventListener('change', (e) => {
      this.toggleHighContrast(e.target.checked);
    });

    document.getElementById('serenbot-reduce-motion').addEventListener('change', (e) => {
      this.toggleReduceMotion(e.target.checked);
    });

    document.getElementById('serenbot-font-size').addEventListener('change', (e) => {
      this.changeFontSize(e.target.value);
    });

    // Clear data
    document.getElementById('serenbot-clear-data').addEventListener('click', () => {
      this.clearAllData();
    });

    // Bot events
    this.bot.on('messageAdded', (message) => {
      if (message.sender === 'bot') {
        this.displayBotMessage(message);
      }
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const chat = document.getElementById('serenbot-chat');
    const toggle = document.getElementById('serenbot-toggle');
    const badge = document.getElementById('serenbot-badge');

    if (this.isOpen) {
      chat.style.display = 'flex';
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar chat de apoyo');
      badge.style.display = 'none';
      this.scrollToBottom();
    } else {
      chat.style.display = 'none';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir chat de apoyo');
    }
  }

  closeChat() {
    this.isOpen = false;
    document.getElementById('serenbot-chat').style.display = 'none';
    document.getElementById('serenbot-toggle').setAttribute('aria-expanded', 'false');
  }

  async sendMessage() {
    const input = document.getElementById('serenbot-input');
    const message = input.value.trim();

    if (!message) return;

    // Add user message to UI
    this.addUserMessage(message);
    input.value = '';
    this.handleInputChange();

    // Show typing indicator
    this.showTyping();

    try {
      // Process message with bot
      await this.bot.processMessage(message);
    } catch (error) {
      this.hideTyping();
      this.addBotMessage(this.bot.getMessage('error'), { isError: true });
    }

    this.hideTyping();
  }

  addUserMessage(content) {
    const messagesContainer = document.getElementById('serenbot-messages');
    const messageEl = this.createMessageElement('user', content);
    messagesContainer.appendChild(messageEl);
    this.scrollToBottom();
  }

  addBotMessage(content, metadata = {}) {
    const messagesContainer = document.getElementById('serenbot-messages');
    const messageEl = this.createMessageElement('bot', content, metadata);
    messagesContainer.appendChild(messageEl);
    this.scrollToBottom();

    // Show notification if chat is closed
    if (!this.isOpen) {
      this.showNotification();
    }
  }

  displayBotMessage(message) {
    this.addBotMessage(message.content, message.metadata);
  }

  createMessageElement(sender, content, metadata = {}) {
    const messageEl = document.createElement('div');
    messageEl.className = `serenbot-message ${sender}`;
    
    if (metadata.isError) messageEl.classList.add('error');
    if (metadata.isCrisis) messageEl.classList.add('crisis');

    const avatar = document.createElement('div');
    avatar.className = 'serenbot-message-avatar';
    avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

    const contentEl = document.createElement('div');
    contentEl.className = 'serenbot-message-content';
    contentEl.textContent = content;

    // Accessibility
    if (metadata.ariaLabel) {
      contentEl.setAttribute('aria-label', metadata.ariaLabel);
    }

    messageEl.appendChild(avatar);
    messageEl.appendChild(contentEl);

    return messageEl;
  }

  showTyping() {
    document.getElementById('serenbot-typing').style.display = 'flex';
    this.scrollToBottom();
  }

  hideTyping() {
    document.getElementById('serenbot-typing').style.display = 'none';
  }

  handleInputChange() {
    const input = document.getElementById('serenbot-input');
    const sendBtn = document.getElementById('serenbot-send');
    const charCount = document.getElementById('serenbot-char-count');

    const length = input.value.length;
    charCount.textContent = `${length}/500`;
    sendBtn.disabled = length === 0 || length > 500;

    // Auto-resize textarea
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }

  scrollToBottom() {
    const messages = document.getElementById('serenbot-messages');
    messages.scrollTop = messages.scrollHeight;
  }

  showNotification() {
    const badge = document.getElementById('serenbot-badge');
    badge.style.display = 'flex';
  }

  clearConversation() {
    if (confirm('¿Estás seguro de que quieres limpiar la conversación?')) {
      document.getElementById('serenbot-messages').innerHTML = '';
      this.bot.clearAllData();
      this.addBotMessage(this.bot.getMessage('welcome'));
    }
  }

  toggleSettings() {
    const panel = document.getElementById('serenbot-settings-panel');
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
  }

  async changeLanguage(language) {
    await this.bot.setLanguage(language);
    localStorage.setItem('serenbot-language', language);
    
    // Update UI text
    this.updateUILanguage();
    
    // Add system message
    this.addBotMessage(this.bot.getMessage('welcome'), { isSystem: true });
  }

  updateUILanguage() {
    // Update placeholder and labels based on current language
    const input = document.getElementById('serenbot-input');
    const language = this.bot.currentLanguage;
    
    if (language === 'en') {
      input.placeholder = 'Type your message...';
    } else if (language === 'pt') {
      input.placeholder = 'Digite sua mensagem...';
    } else {
      input.placeholder = 'Escribe tu mensaje...';
    }
  }

  toggleHighContrast(enabled) {
    document.body.classList.toggle('high-contrast', enabled);
    this.bot.setAccessibilityOptions({ highContrast: enabled });
    localStorage.setItem('serenbot-high-contrast', enabled);
  }

  toggleReduceMotion(enabled) {
    document.body.classList.toggle('reduce-motion', enabled);
    this.bot.setAccessibilityOptions({ reduceMotion: enabled });
    localStorage.setItem('serenbot-reduce-motion', enabled);
  }

  changeFontSize(size) {
    document.body.className = document.body.className.replace(/font-\w+/g, '');
    document.body.classList.add(`font-${size}`);
    this.bot.setAccessibilityOptions({ fontSize: size });
    localStorage.setItem('serenbot-font-size', size);
  }

  clearAllData() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
      this.bot.clearAllData();
      localStorage.removeItem('serenbot-language');
      localStorage.removeItem('serenbot-high-contrast');
      localStorage.removeItem('serenbot-reduce-motion');
      localStorage.removeItem('serenbot-font-size');
      
      // Reset UI
      document.getElementById('serenbot-messages').innerHTML = '';
      this.addBotMessage('Todos los datos han sido eliminados. Comencemos de nuevo.');
      
      // Reset settings
      document.getElementById('serenbot-language').value = 'es';
      document.getElementById('serenbot-high-contrast').checked = false;
      document.getElementById('serenbot-reduce-motion').checked = false;
      document.getElementById('serenbot-font-size').value = 'medium';
    }
  }

  getStoredLanguage() {
    return localStorage.getItem('serenbot-language');
  }

  applyStoredAccessibilitySettings() {
    // High contrast
    const highContrast = localStorage.getItem('serenbot-high-contrast') === 'true';
    if (highContrast) {
      document.getElementById('serenbot-high-contrast').checked = true;
      this.toggleHighContrast(true);
    }

    // Reduce motion
    const reduceMotion = localStorage.getItem('serenbot-reduce-motion') === 'true';
    if (reduceMotion) {
      document.getElementById('serenbot-reduce-motion').checked = true;
      this.toggleReduceMotion(true);
    }

    // Font size
    const fontSize = localStorage.getItem('serenbot-font-size') || 'medium';
    document.getElementById('serenbot-font-size').value = fontSize;
    this.changeFontSize(fontSize);
  }

  async loadLanguageSettings() {
    const storedLanguage = this.getStoredLanguage();
    if (storedLanguage) {
      document.getElementById('serenbot-language').value = storedLanguage;
      await this.bot.setLanguage(storedLanguage);
    }
  }

  showError(message) {
    this.addBotMessage(message, { isError: true });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SerenBotUI;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
  window.SerenBotUI = SerenBotUI;
}
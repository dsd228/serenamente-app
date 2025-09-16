/**
 * SerenBot - Advanced Mental Health Chatbot
 * Implements performance optimization, i18n, error handling, data persistence, security, and accessibility
 */

class SerenBot {
    constructor() {
        this.currentLanguage = 'es';
        this.messageHistory = [];
        this.userPreferences = {};
        this.responseData = {};
        this.maxHistorySize = 100; // Limit to prevent memory issues
        this.isTyping = false;
        this.encryptionEnabled = false;
        
        this.init();
    }

    async init() {
        try {
            await this.loadResponses();
            this.loadUserData();
            this.setupErrorHandling();
            this.createChatInterface();
            this.setupAccessibility();
            this.addEventListeners();
            
            // Show welcome message
            this.addMessage('bot', this.getResponse('welcome'));
        } catch (error) {
            this.handleError('initialization', error);
        }
    }

    /**
     * 2. INTERNATIONALIZATION (i18n) - Load responses from external JSON
     */
    async loadResponses() {
        try {
            // Create default responses if file doesn't exist
            const defaultResponses = {
                es: {
                    welcome: "¡Hola! Soy SerenBot, tu asistente de bienestar emocional. ¿Cómo te sientes hoy?",
                    error: "Lo siento, no pude procesar tu mensaje. ¿Podrías reformularlo?",
                    goodbye: "Cuídate mucho. Recuerda que siempre estoy aquí para ayudarte.",
                    crisis: "Entiendo que estás pasando por un momento muy difícil. Por favor, considera contactar al 0800 345 1435 - Centro de Asistencia al Suicida (8 a 24 hs). Tu vida es valiosa.",
                    notUnderstood: "No estoy seguro de entender completamente. ¿Podrías explicarme un poco más?",
                    typing: "SerenBot está escribiendo...",
                    techniques: {
                        breathing: "Te propongo una técnica de respiración: Inhala durante 4 segundos, mantén durante 7 segundos, y exhala durante 8 segundos. ¿Te gustaría que te guíe?",
                        grounding: "Probemos la técnica 5-4-3-2-1: Nombra 5 cosas que ves, 4 que puedes tocar, 3 que escuchas, 2 que hueles y 1 que saboreas."
                    },
                    emotions: {
                        sad: "Veo que te sientes triste. Es normal sentirse así a veces. ¿Hay algo específico que te está afectando?",
                        anxious: "La ansiedad puede ser muy abrumadora. ¿Te gustaría que practiquemos algunas técnicas de relajación?",
                        angry: "Entiendo que estés enojado/a. Es una emoción válida. ¿Qué crees que la está causando?",
                        happy: "Me alegra saber que te sientes bien. ¿Qué está contribuyendo a este sentimiento positivo?"
                    }
                },
                en: {
                    welcome: "Hello! I'm SerenBot, your emotional wellness assistant. How are you feeling today?",
                    error: "I'm sorry, I couldn't process your message. Could you rephrase it?",
                    goodbye: "Take care. Remember, I'm always here to help you.",
                    crisis: "I understand you're going through a very difficult time. Please consider contacting a crisis helpline in your area. Your life is valuable.",
                    notUnderstood: "I'm not sure I fully understand. Could you explain a bit more?",
                    typing: "SerenBot is typing...",
                    techniques: {
                        breathing: "Let me suggest a breathing technique: Inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds. Would you like me to guide you?",
                        grounding: "Let's try the 5-4-3-2-1 technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste."
                    },
                    emotions: {
                        sad: "I see you're feeling sad. It's normal to feel this way sometimes. Is there something specific affecting you?",
                        anxious: "Anxiety can be very overwhelming. Would you like to practice some relaxation techniques?",
                        angry: "I understand you're angry. It's a valid emotion. What do you think is causing it?",
                        happy: "I'm glad to know you're feeling good. What's contributing to this positive feeling?"
                    }
                }
            };

            // Try to load from external file, fallback to defaults
            try {
                const response = await fetch('./responses.json');
                if (response.ok) {
                    this.responseData = await response.json();
                } else {
                    throw new Error('Responses file not found');
                }
            } catch (error) {
                this.responseData = defaultResponses;
                console.warn('Using default responses:', error.message);
            }
        } catch (error) {
            this.handleError('loadResponses', error);
        }
    }

    getResponse(key, params = {}) {
        try {
            const langData = this.responseData[this.currentLanguage] || this.responseData['es'];
            const keys = key.split('.');
            let response = langData;
            
            for (const k of keys) {
                response = response[k];
                if (!response) break;
            }
            
            if (!response) {
                return langData.error || "Error retrieving response";
            }
            
            // Replace parameters in response
            if (typeof response === 'string' && Object.keys(params).length > 0) {
                Object.keys(params).forEach(param => {
                    response = response.replace(`{${param}}`, params[param]);
                });
            }
            
            return response;
        } catch (error) {
            this.handleError('getResponse', error);
            return "Lo siento, ha ocurrido un error procesando la respuesta.";
        }
    }

    /**
     * 4. DATA PERSISTENCE - Load and save user data
     */
    loadUserData() {
        try {
            // Load user preferences
            const savedPreferences = this.getFromStorage('serenbot_preferences');
            if (savedPreferences) {
                this.userPreferences = savedPreferences;
                this.currentLanguage = this.userPreferences.language || 'es';
            }

            // Load message history (limit size for performance)
            const savedHistory = this.getFromStorage('serenbot_history');
            if (savedHistory && Array.isArray(savedHistory)) {
                this.messageHistory = savedHistory.slice(-this.maxHistorySize);
            }
        } catch (error) {
            this.handleError('loadUserData', error);
        }
    }

    saveUserData() {
        try {
            // Save preferences
            this.setToStorage('serenbot_preferences', this.userPreferences);
            
            // Save history (keep only recent messages for performance)
            const recentHistory = this.messageHistory.slice(-this.maxHistorySize);
            this.setToStorage('serenbot_history', recentHistory);
        } catch (error) {
            this.handleError('saveUserData', error);
        }
    }

    /**
     * 5. SECURITY - Data anonymization and encryption helpers
     */
    anonymizeData(data) {
        try {
            if (typeof data !== 'object') return data;
            
            const anonymized = { ...data };
            
            // Remove or hash sensitive information
            const sensitiveFields = ['name', 'email', 'phone', 'address'];
            sensitiveFields.forEach(field => {
                if (anonymized[field]) {
                    anonymized[field] = this.hashString(anonymized[field]);
                }
            });
            
            return anonymized;
        } catch (error) {
            this.handleError('anonymizeData', error);
            return data;
        }
    }

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return `hash_${Math.abs(hash)}`;
    }

    /**
     * 1. PERFORMANCE OPTIMIZATION - Storage management
     */
    getFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            // Fallback to sessionStorage
            try {
                const data = sessionStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            } catch (fallbackError) {
                this.handleError('getFromStorage', fallbackError);
                return null;
            }
        }
    }

    setToStorage(key, value) {
        try {
            const data = JSON.stringify(value);
            localStorage.setItem(key, data);
        } catch (error) {
            // If localStorage is full, try sessionStorage
            try {
                const data = JSON.stringify(value);
                sessionStorage.setItem(key, data);
            } catch (fallbackError) {
                // If both fail, clear old data and try again
                this.clearOldData();
                try {
                    const data = JSON.stringify(value);
                    localStorage.setItem(key, data);
                } catch (finalError) {
                    this.handleError('setToStorage', finalError);
                }
            }
        }
    }

    clearOldData() {
        try {
            // Clear old message history but keep preferences
            const preferences = this.getFromStorage('serenbot_preferences');
            localStorage.clear();
            if (preferences) {
                this.setToStorage('serenbot_preferences', preferences);
            }
        } catch (error) {
            this.handleError('clearOldData', error);
        }
    }

    /**
     * 3. ERROR HANDLING - Comprehensive error management
     */
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleError('global', event.error);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError('promise', event.reason);
        });
    }

    handleError(context, error) {
        console.error(`SerenBot Error [${context}]:`, error);
        
        // Log error for debugging (in production, send to monitoring service)
        const errorLog = {
            context,
            message: error.message || error,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        // Store error log (anonymized)
        try {
            const errorLogs = this.getFromStorage('serenbot_errors') || [];
            errorLogs.push(this.anonymizeData(errorLog));
            
            // Keep only last 10 errors
            const recentErrors = errorLogs.slice(-10);
            this.setToStorage('serenbot_errors', recentErrors);
        } catch (storageError) {
            console.warn('Could not store error log:', storageError);
        }
        
        // Show user-friendly error message
        this.showUserFriendlyError(context);
    }

    showUserFriendlyError(context) {
        const errorMessages = {
            initialization: "Hubo un problema al inicializar SerenBot. Recarga la página e intenta nuevamente.",
            processing: "No pude procesar tu mensaje correctamente. ¿Podrías intentar de nuevo?",
            network: "Parece que hay un problema de conexión. Verifica tu internet e intenta nuevamente.",
            storage: "Hay un problema guardando tus datos. Algunos ajustes podrían no persistir.",
            global: "Ha ocurrido un error inesperado. SerenBot seguirá funcionando, pero algunos aspectos podrían verse afectados."
        };
        
        const message = errorMessages[context] || errorMessages.global;
        this.addMessage('bot', message, 'error');
    }

    /**
     * CHAT INTERFACE CREATION
     */
    createChatInterface() {
        try {
            // Check if interface already exists
            if (document.getElementById('serenbot-container')) {
                return;
            }

            const chatContainer = document.createElement('div');
            chatContainer.id = 'serenbot-container';
            chatContainer.innerHTML = `
                <div class="serenbot-header" role="banner">
                    <div class="serenbot-title">
                        <i class="fas fa-robot" aria-hidden="true"></i>
                        <span>SerenBot</span>
                    </div>
                    <div class="serenbot-controls">
                        <button id="serenbot-language" class="serenbot-btn" aria-label="Cambiar idioma" title="Cambiar idioma">
                            <i class="fas fa-language" aria-hidden="true"></i>
                        </button>
                        <button id="serenbot-minimize" class="serenbot-btn" aria-label="Minimizar chat" title="Minimizar chat">
                            <i class="fas fa-minus" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                <div class="serenbot-messages" id="serenbot-messages" role="log" aria-live="polite" aria-label="Historial de conversación">
                </div>
                <div class="serenbot-typing" id="serenbot-typing" aria-hidden="true">
                    <span class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                    <span class="typing-text">SerenBot está escribiendo...</span>
                </div>
                <div class="serenbot-input-container" role="region" aria-label="Área de entrada de mensaje">
                    <input 
                        type="text" 
                        id="serenbot-input" 
                        class="serenbot-input" 
                        placeholder="Escribe tu mensaje aquí..."
                        aria-label="Mensaje para SerenBot"
                        maxlength="500"
                        autocomplete="off"
                    >
                    <button id="serenbot-send" class="serenbot-send-btn" aria-label="Enviar mensaje" title="Enviar mensaje">
                        <i class="fas fa-paper-plane" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="serenbot-suggestions" id="serenbot-suggestions" role="region" aria-label="Respuestas sugeridas">
                </div>
            `;

            // Add CSS styles
            this.addStyles();
            
            // Insert into page
            document.body.appendChild(chatContainer);
            
            // Restore chat history
            this.restoreChatHistory();
            
        } catch (error) {
            this.handleError('createChatInterface', error);
        }
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #serenbot-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 350px;
                max-width: calc(100vw - 40px);
                height: 500px;
                max-height: calc(100vh - 40px);
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                z-index: 10000;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                border: 1px solid #e5e7eb;
                transition: all 0.3s ease;
            }

            .dark-mode #serenbot-container {
                background: #1f2937;
                border-color: #374151;
                color: #f9fafb;
            }

            .serenbot-header {
                background: linear-gradient(135deg, #4361ee, #3a0ca3);
                color: white;
                padding: 16px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-height: 60px;
            }

            .serenbot-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 600;
                font-size: 1.1rem;
            }

            .serenbot-controls {
                display: flex;
                gap: 8px;
            }

            .serenbot-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 8px;
                padding: 8px;
                color: white;
                cursor: pointer;
                transition: background 0.2s ease;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .serenbot-btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .serenbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                scroll-behavior: smooth;
            }

            .serenbot-message {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                max-width: 85%;
                animation: messageSlideIn 0.3s ease;
            }

            @keyframes messageSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .serenbot-message.user {
                align-self: flex-end;
                flex-direction: row-reverse;
            }

            .serenbot-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                flex-shrink: 0;
            }

            .serenbot-avatar.bot {
                background: linear-gradient(135deg, #4361ee, #3a0ca3);
                color: white;
            }

            .serenbot-avatar.user {
                background: #e5e7eb;
                color: #374151;
            }

            .dark-mode .serenbot-avatar.user {
                background: #374151;
                color: #f9fafb;
            }

            .serenbot-message-content {
                background: #f3f4f6;
                border-radius: 16px;
                padding: 12px 16px;
                line-height: 1.5;
                font-size: 0.95rem;
                word-wrap: break-word;
            }

            .serenbot-message.user .serenbot-message-content {
                background: linear-gradient(135deg, #4361ee, #3a0ca3);
                color: white;
            }

            .serenbot-message.error .serenbot-message-content {
                background: #fef2f2;
                border: 1px solid #fecaca;
                color: #dc2626;
            }

            .dark-mode .serenbot-message-content {
                background: #374151;
                color: #f9fafb;
            }

            .dark-mode .serenbot-message.error .serenbot-message-content {
                background: #7f1d1d;
                border-color: #dc2626;
                color: #fca5a5;
            }

            .serenbot-typing {
                padding: 20px;
                display: none;
                align-items: center;
                gap: 12px;
                color: #6b7280;
            }

            .typing-indicator {
                display: flex;
                gap: 4px;
            }

            .typing-indicator span {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #6b7280;
                animation: typingDot 1.4s infinite ease-in-out;
            }

            .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
            .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

            @keyframes typingDot {
                0%, 80%, 100% {
                    transform: scale(0);
                }
                40% {
                    transform: scale(1);
                }
            }

            .serenbot-input-container {
                padding: 20px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                gap: 12px;
                align-items: center;
            }

            .dark-mode .serenbot-input-container {
                border-color: #374151;
            }

            .serenbot-input {
                flex: 1;
                border: 1px solid #d1d5db;
                border-radius: 12px;
                padding: 12px 16px;
                font-size: 0.95rem;
                outline: none;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
                font-family: inherit;
                background: white;
                color: #374151;
            }

            .serenbot-input:focus {
                border-color: #4361ee;
                box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
            }

            .dark-mode .serenbot-input {
                background: #374151;
                border-color: #4b5563;
                color: #f9fafb;
            }

            .serenbot-send-btn {
                background: linear-gradient(135deg, #4361ee, #3a0ca3);
                border: none;
                border-radius: 12px;
                padding: 12px;
                color: white;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .serenbot-send-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
            }

            .serenbot-send-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            .serenbot-suggestions {
                padding: 0 20px 20px;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .serenbot-suggestion {
                background: #f3f4f6;
                border: 1px solid #e5e7eb;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 0.85rem;
                color: #4b5563;
                cursor: pointer;
                transition: all 0.2s ease;
                user-select: none;
            }

            .serenbot-suggestion:hover {
                background: #e5e7eb;
                transform: translateY(-1px);
            }

            .dark-mode .serenbot-suggestion {
                background: #374151;
                border-color: #4b5563;
                color: #d1d5db;
            }

            .dark-mode .serenbot-suggestion:hover {
                background: #4b5563;
            }

            .serenbot-minimized {
                height: 60px !important;
            }

            .serenbot-minimized .serenbot-messages,
            .serenbot-minimized .serenbot-typing,
            .serenbot-minimized .serenbot-input-container,
            .serenbot-minimized .serenbot-suggestions {
                display: none !important;
            }

            /* Responsive design */
            @media (max-width: 768px) {
                #serenbot-container {
                    width: calc(100vw - 20px);
                    height: calc(100vh - 20px);
                    bottom: 10px;
                    right: 10px;
                }
            }

            /* High contrast support */
            @media (prefers-contrast: high) {
                #serenbot-container {
                    border: 2px solid #000;
                }
                
                .serenbot-message-content {
                    border: 1px solid #000;
                }
            }

            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 6. ACCESSIBILITY - Enhanced accessibility features
     */
    setupAccessibility() {
        try {
            // Set up ARIA live region for announcements
            const messagesContainer = document.getElementById('serenbot-messages');
            if (messagesContainer) {
                messagesContainer.setAttribute('aria-live', 'polite');
                messagesContainer.setAttribute('aria-label', 'Historial de conversación con SerenBot');
            }

            // Set up keyboard navigation
            this.setupKeyboardNavigation();
            
            // Set up screen reader announcements
            this.setupScreenReaderSupport();
            
            // Set up focus management
            this.setupFocusManagement();
            
        } catch (error) {
            this.handleError('setupAccessibility', error);
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            // Alt + S to focus on SerenBot input
            if (event.altKey && event.key === 's') {
                event.preventDefault();
                const input = document.getElementById('serenbot-input');
                if (input) {
                    input.focus();
                    this.announceToScreenReader('SerenBot input enfocado');
                }
            }
            
            // Escape to minimize/maximize chat
            if (event.key === 'Escape' && event.target.closest('#serenbot-container')) {
                event.preventDefault();
                this.toggleMinimize();
            }
        });
    }

    setupScreenReaderSupport() {
        // Create hidden announcer for screen readers
        const announcer = document.createElement('div');
        announcer.id = 'serenbot-announcer';
        announcer.setAttribute('aria-live', 'assertive');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(announcer);
    }

    announceToScreenReader(message) {
        const announcer = document.getElementById('serenbot-announcer');
        if (announcer) {
            announcer.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }

    setupFocusManagement() {
        // Ensure proper focus handling for modal-like behavior
        const container = document.getElementById('serenbot-container');
        if (container) {
            container.addEventListener('keydown', (event) => {
                if (event.key === 'Tab') {
                    this.handleTabNavigation(event);
                }
            });
        }
    }

    handleTabNavigation(event) {
        const container = document.getElementById('serenbot-container');
        const focusableElements = container.querySelectorAll(
            'button, input, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    /**
     * EVENT LISTENERS
     */
    addEventListeners() {
        try {
            const input = document.getElementById('serenbot-input');
            const sendBtn = document.getElementById('serenbot-send');
            const minimizeBtn = document.getElementById('serenbot-minimize');
            const languageBtn = document.getElementById('serenbot-language');

            if (input && sendBtn) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.sendMessage();
                    }
                });

                input.addEventListener('input', () => {
                    const hasText = input.value.trim().length > 0;
                    sendBtn.disabled = !hasText || this.isTyping;
                });

                sendBtn.addEventListener('click', () => this.sendMessage());
            }

            if (minimizeBtn) {
                minimizeBtn.addEventListener('click', () => this.toggleMinimize());
            }

            if (languageBtn) {
                languageBtn.addEventListener('click', () => this.toggleLanguage());
            }

        } catch (error) {
            this.handleError('addEventListeners', error);
        }
    }

    /**
     * CORE CHAT FUNCTIONALITY
     */
    async sendMessage() {
        try {
            const input = document.getElementById('serenbot-input');
            const sendBtn = document.getElementById('serenbot-send');
            
            if (!input || this.isTyping) return;
            
            const message = input.value.trim();
            if (!message) return;

            // Add user message
            this.addMessage('user', message);
            
            // Clear input and disable send button
            input.value = '';
            sendBtn.disabled = true;
            
            // Show typing indicator
            this.showTyping();
            
            // Process message and get response
            const response = await this.processMessage(message);
            
            // Hide typing indicator
            this.hideTyping();
            
            // Add bot response
            this.addMessage('bot', response);
            
            // Update suggestions
            this.updateSuggestions(message);
            
            // Save to history
            this.saveUserData();
            
            // Re-enable send button
            sendBtn.disabled = false;
            
            // Announce new message to screen reader
            this.announceToScreenReader(`SerenBot respondió: ${response}`);
            
        } catch (error) {
            this.handleError('sendMessage', error);
            this.hideTyping();
            this.addMessage('bot', this.getResponse('error'), 'error');
        }
    }

    async processMessage(message) {
        try {
            const normalizedMessage = message.toLowerCase().trim();
            
            // Crisis detection
            const crisisKeywords = ['suicidio', 'matarme', 'muerte', 'morir', 'no puedo más', 'kill myself', 'suicide', 'die'];
            if (crisisKeywords.some(keyword => normalizedMessage.includes(keyword))) {
                return this.getResponse('crisis');
            }
            
            // Emotion detection
            const emotions = {
                'triste': ['triste', 'tristeza', 'deprimido', 'depresión', 'llorar', 'sad', 'depressed'],
                'ansioso': ['ansiedad', 'ansioso', 'nervioso', 'preocupado', 'anxiety', 'anxious', 'worried'],
                'enojado': ['enojado', 'furioso', 'ira', 'rabia', 'angry', 'mad', 'rage'],
                'feliz': ['feliz', 'contento', 'alegre', 'bien', 'happy', 'good', 'great']
            };
            
            for (const [emotion, keywords] of Object.entries(emotions)) {
                if (keywords.some(keyword => normalizedMessage.includes(keyword))) {
                    const emotionKey = emotion === 'ansioso' ? 'anxious' : 
                                     emotion === 'enojado' ? 'angry' : 
                                     emotion === 'feliz' ? 'happy' : 'sad';
                    return this.getResponse(`emotions.${emotionKey}`);
                }
            }
            
            // Technique requests
            const techniqueKeywords = ['respirar', 'respiración', 'calmar', 'relajar', 'breathing', 'relax', 'calm'];
            if (techniqueKeywords.some(keyword => normalizedMessage.includes(keyword))) {
                return this.getResponse('techniques.breathing');
            }
            
            const groundingKeywords = ['presente', 'aquí', 'ahora', 'grounding', 'concentrar', 'focus'];
            if (groundingKeywords.some(keyword => normalizedMessage.includes(keyword))) {
                return this.getResponse('techniques.grounding');
            }
            
            // Greetings
            const greetings = ['hola', 'hello', 'hi', 'buenos días', 'buenas tardes', 'buenas noches'];
            if (greetings.some(greeting => normalizedMessage.includes(greeting))) {
                return this.getResponse('welcome');
            }
            
            // Goodbye
            const goodbyes = ['adiós', 'chau', 'bye', 'goodbye', 'hasta luego', 'nos vemos'];
            if (goodbyes.some(goodbye => normalizedMessage.includes(goodbye))) {
                return this.getResponse('goodbye');
            }
            
            // Default response for unrecognized messages
            return this.getResponse('notUnderstood');
            
        } catch (error) {
            this.handleError('processMessage', error);
            return this.getResponse('error');
        }
    }

    addMessage(sender, text, type = 'normal') {
        try {
            const messagesContainer = document.getElementById('serenbot-messages');
            if (!messagesContainer) return;

            const messageElement = document.createElement('div');
            messageElement.className = `serenbot-message ${sender} ${type}`;
            messageElement.setAttribute('role', 'article');
            
            const avatar = document.createElement('div');
            avatar.className = `serenbot-avatar ${sender}`;
            avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot" aria-hidden="true"></i>' : '<i class="fas fa-user" aria-hidden="true"></i>';
            
            const content = document.createElement('div');
            content.className = 'serenbot-message-content';
            content.textContent = text;
            content.setAttribute('aria-label', `${sender === 'bot' ? 'SerenBot' : 'Usuario'}: ${text}`);
            
            messageElement.appendChild(avatar);
            messageElement.appendChild(content);
            
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Store in history
            const messageData = {
                sender,
                text,
                type,
                timestamp: new Date().toISOString()
            };
            
            this.messageHistory.push(messageData);
            
            // Limit history size for performance
            if (this.messageHistory.length > this.maxHistorySize) {
                this.messageHistory = this.messageHistory.slice(-this.maxHistorySize);
            }
            
        } catch (error) {
            this.handleError('addMessage', error);
        }
    }

    showTyping() {
        try {
            this.isTyping = true;
            const typingElement = document.getElementById('serenbot-typing');
            const sendBtn = document.getElementById('serenbot-send');
            
            if (typingElement) {
                typingElement.style.display = 'flex';
                typingElement.setAttribute('aria-hidden', 'false');
            }
            
            if (sendBtn) {
                sendBtn.disabled = true;
            }
            
            // Simulate natural typing delay
            const delay = Math.random() * 2000 + 1000; // 1-3 seconds
            setTimeout(() => {
                // Typing will be hidden when response is ready
            }, delay);
            
        } catch (error) {
            this.handleError('showTyping', error);
        }
    }

    hideTyping() {
        try {
            this.isTyping = false;
            const typingElement = document.getElementById('serenbot-typing');
            const sendBtn = document.getElementById('serenbot-send');
            const input = document.getElementById('serenbot-input');
            
            if (typingElement) {
                typingElement.style.display = 'none';
                typingElement.setAttribute('aria-hidden', 'true');
            }
            
            if (sendBtn && input) {
                sendBtn.disabled = input.value.trim().length === 0;
            }
            
        } catch (error) {
            this.handleError('hideTyping', error);
        }
    }

    updateSuggestions(lastMessage) {
        try {
            const suggestionsContainer = document.getElementById('serenbot-suggestions');
            if (!suggestionsContainer) return;
            
            const suggestions = [
                "¿Cómo me puedes ayudar?",
                "Enséñame una técnica de respiración",
                "Me siento ansioso/a",
                "Necesito calmarme"
            ];
            
            suggestionsContainer.innerHTML = '';
            
            suggestions.forEach(suggestion => {
                const suggestionElement = document.createElement('button');
                suggestionElement.className = 'serenbot-suggestion';
                suggestionElement.textContent = suggestion;
                suggestionElement.setAttribute('role', 'button');
                suggestionElement.setAttribute('aria-label', `Respuesta sugerida: ${suggestion}`);
                
                suggestionElement.addEventListener('click', () => {
                    const input = document.getElementById('serenbot-input');
                    if (input) {
                        input.value = suggestion;
                        input.focus();
                        this.sendMessage();
                    }
                });
                
                suggestionsContainer.appendChild(suggestionElement);
            });
            
        } catch (error) {
            this.handleError('updateSuggestions', error);
        }
    }

    restoreChatHistory() {
        try {
            if (this.messageHistory.length === 0) return;
            
            const messagesContainer = document.getElementById('serenbot-messages');
            if (!messagesContainer) return;
            
            // Show last few messages
            const recentMessages = this.messageHistory.slice(-10);
            recentMessages.forEach(message => {
                this.addMessageToDOM(message.sender, message.text, message.type);
            });
            
        } catch (error) {
            this.handleError('restoreChatHistory', error);
        }
    }

    addMessageToDOM(sender, text, type = 'normal') {
        try {
            const messagesContainer = document.getElementById('serenbot-messages');
            if (!messagesContainer) return;

            const messageElement = document.createElement('div');
            messageElement.className = `serenbot-message ${sender} ${type}`;
            
            const avatar = document.createElement('div');
            avatar.className = `serenbot-avatar ${sender}`;
            avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
            
            const content = document.createElement('div');
            content.className = 'serenbot-message-content';
            content.textContent = text;
            
            messageElement.appendChild(avatar);
            messageElement.appendChild(content);
            
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
        } catch (error) {
            this.handleError('addMessageToDOM', error);
        }
    }

    /**
     * UI CONTROLS
     */
    toggleMinimize() {
        try {
            const container = document.getElementById('serenbot-container');
            const minimizeBtn = document.getElementById('serenbot-minimize');
            
            if (!container || !minimizeBtn) return;
            
            const isMinimized = container.classList.contains('serenbot-minimized');
            
            if (isMinimized) {
                container.classList.remove('serenbot-minimized');
                minimizeBtn.innerHTML = '<i class="fas fa-minus" aria-hidden="true"></i>';
                minimizeBtn.setAttribute('aria-label', 'Minimizar chat');
                this.announceToScreenReader('Chat expandido');
            } else {
                container.classList.add('serenbot-minimized');
                minimizeBtn.innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i>';
                minimizeBtn.setAttribute('aria-label', 'Expandir chat');
                this.announceToScreenReader('Chat minimizado');
            }
            
        } catch (error) {
            this.handleError('toggleMinimize', error);
        }
    }

    toggleLanguage() {
        try {
            this.currentLanguage = this.currentLanguage === 'es' ? 'en' : 'es';
            this.userPreferences.language = this.currentLanguage;
            this.saveUserData();
            
            // Update UI text
            this.updateUILanguage();
            
            // Announce language change
            const langName = this.currentLanguage === 'es' ? 'Español' : 'English';
            this.announceToScreenReader(`Idioma cambiado a ${langName}`);
            
            // Send language change message
            this.addMessage('bot', this.getResponse('welcome'));
            
        } catch (error) {
            this.handleError('toggleLanguage', error);
        }
    }

    updateUILanguage() {
        try {
            const input = document.getElementById('serenbot-input');
            const typingText = document.querySelector('.typing-text');
            
            if (input) {
                input.placeholder = this.currentLanguage === 'es' ? 
                    'Escribe tu mensaje aquí...' : 'Type your message here...';
            }
            
            if (typingText) {
                typingText.textContent = this.getResponse('typing');
            }
            
        } catch (error) {
            this.handleError('updateUILanguage', error);
        }
    }

    /**
     * PUBLIC API
     */
    destroy() {
        try {
            const container = document.getElementById('serenbot-container');
            if (container) {
                container.remove();
            }
            
            const announcer = document.getElementById('serenbot-announcer');
            if (announcer) {
                announcer.remove();
            }
            
            // Clear intervals
            if (this.typingInterval) {
                clearInterval(this.typingInterval);
            }
            
        } catch (error) {
            this.handleError('destroy', error);
        }
    }

    getStats() {
        return {
            messagesCount: this.messageHistory.length,
            currentLanguage: this.currentLanguage,
            preferences: { ...this.userPreferences },
            isTyping: this.isTyping
        };
    }
}

// Initialize SerenBot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check if SerenBot should be initialized
        if (!window.serenBot) {
            window.serenBot = new SerenBot();
        }
    } catch (error) {
        console.error('Failed to initialize SerenBot:', error);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SerenBot;
}
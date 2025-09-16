# SerenBot - Guía de Integración y Uso

## Descripción General

SerenBot es un chatbot inteligente diseñado específicamente para la aplicación Serenamente. Proporciona asistencia básica a los usuarios, responde preguntas frecuentes y ayuda en la navegación de la aplicación.

## Características Principales

### 🤖 Funcionalidades Básicas
- **Respuestas Inteligentes**: Base de conocimiento con respuestas predefinidas
- **Navegación Asistida**: Ayuda a los usuarios a moverse por la aplicación
- **Interfaz Amigable**: Diseño responsive que se adapta al tema de Serenamente
- **Sugerencias Rápidas**: Botones con preguntas frecuentes para facilitar la interacción

### 💬 Áreas de Conocimiento
1. **Técnicas de Apoyo Emocional**: Información sobre ejercicios disponibles
2. **Navegación**: Orientación sobre cómo usar diferentes secciones
3. **Respiración y Relajación**: Guías sobre ejercicios de respiración
4. **Diario Emocional**: Ayuda con el registro de pensamientos
5. **Progreso**: Información sobre el seguimiento del bienestar
6. **Crisis**: Información de contactos de emergencia

## Instalación e Integración

### Instalación Básica

1. **Incluir el archivo JavaScript**:
```html
<script src="serenbot.js"></script>
```

2. **Inicialización automática**:
El chatbot se inicializa automáticamente cuando el DOM está listo.

### Integración Manual

```javascript
// Crear instancia manual
const serenBot = new SerenBot();
serenBot.init();
```

## Configuración y Personalización

### Añadir Nuevas Categorías de Conocimiento

```javascript
// Ejemplo: Añadir información sobre una nueva funcionalidad
serenBot.addKnowledgeCategory('nueva_funcionalidad', 
  ['nueva función', 'nueva feature', 'actualización'], // triggers
  ['Explicación de la nueva funcionalidad...'] // responses
);
```

### Personalizar Sugerencias Rápidas

```javascript
const nuevasSugerencias = [
  '¿Cómo meditar?',
  'Ejercicios de respiración',
  'Contactos de emergencia',
  'Ver mi progreso'
];

serenBot.updateQuickSuggestions(nuevasSugerencias);
```

### Integración con Temas

SerenBot se adapta automáticamente al modo oscuro de Serenamente:

```css
/* Los estilos se ajustan automáticamente */
.dark-mode .serenbot-window {
  background: #1e293b;
  border: 1px solid #334155;
}
```

## API de SerenBot

### Métodos Principales

#### `init()`
Inicializa el chatbot y crea la interfaz de usuario.

```javascript
serenBot.init();
```

#### `addKnowledgeCategory(category, triggers, responses)`
Añade una nueva categoría de conocimiento.

```javascript
serenBot.addKnowledgeCategory('ejercicios', 
  ['ejercicio', 'actividad física'], 
  ['Los ejercicios son importantes para la salud mental...']
);
```

#### `navigateToSection(sectionId)`
Navega a una sección específica de la aplicación.

```javascript
serenBot.navigateToSection('meditation-section');
```

#### `getUsageStats()`
Obtiene estadísticas de uso del chatbot.

```javascript
const stats = serenBot.getUsageStats();
console.log(stats);
// { totalMessages: 10, userMessages: 5, botMessages: 5, currentContext: 'general', isActive: true }
```

### Propiedades Configurables

#### `knowledgeBase`
Objeto que contiene todas las categorías de conocimiento:

```javascript
serenBot.knowledgeBase = {
  categoria: {
    triggers: ['palabra1', 'palabra2'],
    responses: ['Respuesta 1', 'Respuesta 2']
  }
};
```

#### `defaultResponses`
Array de respuestas por defecto cuando no se encuentra una coincidencia:

```javascript
serenBot.defaultResponses = [
  'No entiendo completamente, ¿puedes ser más específico?',
  'Esa es una buena pregunta. ¿Podrías dar más detalles?'
];
```

#### `quickSuggestions`
Array de sugerencias rápidas mostradas en la interfaz:

```javascript
serenBot.quickSuggestions = [
  'Ayuda con respiración',
  'Ver técnicas disponibles',
  'Información de contacto'
];
```

## Extensibilidad

### Añadir Nuevas Funcionalidades

1. **Extender la clase SerenBot**:
```javascript
class SerenBotExtended extends SerenBot {
  constructor() {
    super();
    this.nuevaFuncionalidad = true;
  }
  
  nuevaFuncion() {
    // Implementar nueva funcionalidad
  }
}
```

2. **Modificar el procesamiento de mensajes**:
```javascript
// Sobrescribir el método processMessage
SerenBot.prototype.processMessage = function(message) {
  // Lógica personalizada
  if (message.includes('comando especial')) {
    return 'Respuesta especial';
  }
  
  // Llamar al método original
  return this.constructor.prototype.processMessage.call(this, message);
};
```

### Integración con APIs Externas

```javascript
// Ejemplo: Integrar con un servicio de análisis de sentimientos
SerenBot.prototype.analyzeMessage = async function(message) {
  try {
    const response = await fetch('/api/sentiment', {
      method: 'POST',
      body: JSON.stringify({ text: message }),
      headers: { 'Content-Type': 'application/json' }
    });
    const sentiment = await response.json();
    
    // Ajustar respuesta basada en el sentimiento
    if (sentiment.negative > 0.7) {
      return this.getCrisisResponse();
    }
  } catch (error) {
    console.log('Error en análisis de sentimientos:', error);
  }
};
```

## Personalización de Estilos

### Variables CSS Principales

```css
:root {
  --serenbot-primary: #4361ee;
  --serenbot-secondary: #3a0ca3;
  --serenbot-bg: #ffffff;
  --serenbot-text: #1e293b;
  --serenbot-border: #e2e8f0;
}
```

### Modificar Apariencia

```css
/* Cambiar colores del botón flotante */
.serenbot-toggle {
  background: linear-gradient(135deg, #custom-color1, #custom-color2);
}

/* Personalizar ventana del chat */
.serenbot-window {
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* Modificar mensajes */
.serenbot-message-content {
  font-family: 'Custom Font', sans-serif;
  border-radius: 20px;
}
```

## Eventos y Callbacks

### Escuchar Eventos del Chatbot

```javascript
// Evento cuando se envía un mensaje
serenBot.onMessageSent = function(message) {
  console.log('Mensaje enviado:', message);
  // Lógica personalizada
};

// Evento cuando se abre/cierra el chat
serenBot.onToggle = function(isOpen) {
  console.log('Chat toggled:', isOpen);
  // Analytics o lógica personalizada
};
```

## Mejores Prácticas

### 1. Rendimiento
- El chatbot es ligero y no afecta la carga de la página principal
- Los estilos se cargan dinámicamente para evitar bloqueo de renderizado
- Las respuestas tienen un delay artificial para mejorar la experiencia del usuario

### 2. Accesibilidad
- Uso de roles ARIA apropiados
- Navegación por teclado completa
- Contraste adecuado en modo oscuro y claro

### 3. Responsive Design
- Se adapta automáticamente a pantallas móviles
- Interfaz optimizada para touch devices
- Posicionamiento que no interfiere con el contenido principal

### 4. Mantenimiento
- Código modular y bien documentado
- Base de conocimiento fácil de actualizar
- Logging de interacciones para análisis

## Solución de Problemas

### Problemas Comunes

1. **El chatbot no aparece**:
   - Verificar que `serenbot.js` se carga correctamente
   - Comprobar la consola para errores de JavaScript

2. **Estilos no se aplican correctamente**:
   - Verificar conflictos con CSS existente
   - Comprobar especificidad de selectores

3. **Respuestas no relevantes**:
   - Revisar y actualizar los triggers en `knowledgeBase`
   - Añadir más variaciones de palabras clave

### Debug Mode

```javascript
// Activar modo debug
serenBot.debugMode = true;

// Ver todas las interacciones
serenBot.messages.forEach(msg => console.log(msg));
```

## Futuras Mejoras

### Funcionalidades Planificadas
- Integración con APIs de procesamiento de lenguaje natural
- Análisis de sentimientos en tiempo real
- Personalización de respuestas basada en el historial del usuario
- Soporte multiidioma
- Integración con calendarios para recordatorios de bienestar

### Contribuciones
Para contribuir al desarrollo de SerenBot:
1. Fork del repositorio
2. Crear feature branch
3. Implementar mejoras manteniendo la compatibilidad
4. Documentar cambios
5. Crear pull request

## Contacto y Soporte

Para soporte técnico o sugerencias sobre SerenBot, contactar al equipo de desarrollo de Serenamente.

---

**Versión**: 1.0.0  
**Última actualización**: 2025  
**Compatibilidad**: Serenamente App v1.0.0+
# Serenamente App

Una aplicación de notas con almacenamiento local usando React y localStorage.

## 📝 Características

- **Agregar notas**: Crea notas de texto con múltiples líneas
- **Almacenamiento local**: Las notas se guardan automáticamente en localStorage
- **Persistencia**: Las notas permanecen después de cerrar y reabrir la aplicación
- **Eliminar notas**: Elimina notas individuales o todas a la vez
- **Interfaz intuitiva**: Diseño limpio y fácil de usar

## 🏗️ Estructura del Proyecto

```
├── public/
│   ├── index.html          # Página principal
│   ├── main.jsx           # Punto de entrada de React
│   ├── manifest.json      # Manifiesto PWA
│   └── service-worker.js  # Service worker
├── src/
│   ├── App.jsx            # Componente principal
│   └── Notes.jsx          # Componente de gestión de notas
├── package.json           # Dependencias y configuración
└── README.md             # Este archivo
```

## 🚀 Cómo usar

### Componente Notes.jsx

El componente `Notes.jsx` implementa toda la funcionalidad de gestión de notas:

```jsx
import Notes from './Notes.jsx';

function App() {
  return (
    <div>
      <Notes />
    </div>
  );
}
```

### Funciones principales del localStorage

- **Guardar notas**: `localStorage.setItem(key, JSON.stringify(data))`
- **Cargar notas**: `JSON.parse(localStorage.getItem(key))`
- **Eliminar notas**: `localStorage.removeItem(key)`

## 💾 localStorage

### ¿Cómo funciona?

El localStorage es una característica del navegador que permite almacenar datos localmente:

- **Persistencia**: Los datos permanecen guardados hasta que se limpien manualmente
- **Capacidad**: Aproximadamente 5-10MB por dominio
- **Sincronización**: No se sincroniza entre dispositivos
- **Formato**: Solo puede almacenar strings (usamos JSON.stringify/parse)
- **Acceso**: Solo JavaScript del mismo dominio puede acceder a los datos

### Implementación en el código

```javascript
// Clave para identificar nuestros datos
const STORAGE_KEY = 'serenamente-notes';

// Guardar notas
const saveNotesToStorage = (notes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

// Cargar notas
const loadNotesFromStorage = () => {
  const savedNotes = localStorage.getItem(STORAGE_KEY);
  return savedNotes ? JSON.parse(savedNotes) : [];
};

// Eliminar todas las notas
const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};
```

## 🎯 Funcionalidades implementadas

- [x] Agregar notas con texto multilínea
- [x] Mostrar lista de notas guardadas
- [x] Eliminar notas individuales con confirmación
- [x] Limpiar todas las notas con confirmación
- [x] Contador de notas
- [x] Persistencia automática en localStorage
- [x] Carga automática al iniciar la aplicación
- [x] Interfaz responsive y amigable
- [x] Comentarios explicativos sobre localStorage
- [x] Manejo de errores en operaciones de storage

## 🔧 Tecnologías utilizadas

- **React 18**: Framework de JavaScript para la interfaz
- **localStorage**: API del navegador para almacenamiento local
- **JSX**: Sintaxis extendida de JavaScript
- **CSS inline**: Estilos integrados en el componente

import React, { useState, useEffect } from 'react';

function Notes() {
  // Estado para almacenar las notas en memoria durante la sesión
  const [notes, setNotes] = useState([]);
  // Estado para el texto de la nueva nota
  const [newNote, setNewNote] = useState('');

  // Clave para localStorage - permite identificar nuestros datos
  const STORAGE_KEY = 'serenamente-notes';

  // Función para cargar notas desde localStorage
  const loadNotesFromStorage = () => {
    try {
      // localStorage.getItem() obtiene datos del almacenamiento local del navegador
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      if (savedNotes) {
        // JSON.parse() convierte el string guardado de vuelta a un array
        return JSON.parse(savedNotes);
      }
    } catch (error) {
      console.error('Error al cargar notas desde localStorage:', error);
    }
    // Si no hay notas guardadas o hay error, retorna array vacío
    return [];
  };

  // Función para guardar notas en localStorage
  const saveNotesToStorage = (notesToSave) => {
    try {
      // JSON.stringify() convierte el array a string para guardarlo
      // localStorage.setItem() guarda los datos en el almacenamiento local
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notesToSave));
    } catch (error) {
      console.error('Error al guardar notas en localStorage:', error);
    }
  };

  // useEffect se ejecuta cuando el componente se monta (primera vez que se renderiza)
  useEffect(() => {
    // Cargar notas existentes al inicializar el componente
    const savedNotes = loadNotesFromStorage();
    setNotes(savedNotes);
  }, []); // El array vacío significa que solo se ejecuta una vez

  // Función para agregar una nueva nota
  const addNote = () => {
    if (newNote.trim() === '') {
      alert('Por favor escribe una nota antes de agregar');
      return;
    }

    // Crear nueva nota con id único (timestamp) y el texto
    const note = {
      id: Date.now(), // Usar timestamp como ID único
      text: newNote.trim(),
      createdAt: new Date().toLocaleString() // Fecha y hora de creación
    };

    // Crear nuevo array con la nota agregada
    const updatedNotes = [...notes, note];
    
    // Actualizar el estado en memoria
    setNotes(updatedNotes);
    
    // Guardar en localStorage para persistencia
    saveNotesToStorage(updatedNotes);
    
    // Limpiar el campo de texto
    setNewNote('');
  };

  // Función para eliminar una nota
  const deleteNote = (noteId) => {
    // Confirmar antes de eliminar
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      // Filtrar todas las notas excepto la que queremos eliminar
      const updatedNotes = notes.filter(note => note.id !== noteId);
      
      // Actualizar el estado en memoria
      setNotes(updatedNotes);
      
      // Actualizar localStorage
      saveNotesToStorage(updatedNotes);
    }
  };

  // Función para limpiar todas las notas
  const clearAllNotes = () => {
    if (notes.length === 0) {
      alert('No hay notas para eliminar');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar todas las notas?')) {
      // Limpiar estado en memoria
      setNotes([]);
      
      // Limpiar localStorage - removeItem() elimina la clave completamente
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#34495e', marginBottom: '20px' }}>
        📝 Gestor de Notas con localStorage
      </h2>
      
      {/* Explicación sobre localStorage */}
      <div style={{ 
        backgroundColor: '#ecf0f1', 
        padding: '15px', 
        borderRadius: '5px', 
        marginBottom: '20px',
        fontSize: '14px',
        color: '#2c3e50'
      }}>
        <strong>💡 Sobre el almacenamiento local:</strong> Las notas se guardan automáticamente 
        en el localStorage de tu navegador. Esto significa que permanecerán disponibles 
        incluso después de cerrar y reabrir la aplicación, siempre que uses el mismo navegador.
      </div>

      {/* Formulario para agregar nueva nota */}
      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Escribe tu nota aquí..."
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '10px',
            border: '2px solid #bdc3c7',
            borderRadius: '5px',
            fontSize: '14px',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
          onKeyDown={(e) => {
            // Permitir agregar nota con Ctrl+Enter
            if (e.ctrlKey && e.key === 'Enter') {
              addNote();
            }
          }}
        />
        
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button
            onClick={addNote}
            style={{
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ➕ Agregar Nota
          </button>
          
          <button
            onClick={clearAllNotes}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🗑️ Limpiar Todo
          </button>
        </div>
        
        <small style={{ color: '#7f8c8d', marginTop: '5px', display: 'block' }}>
          💡 Tip: Usa Ctrl+Enter para agregar rápidamente
        </small>
      </div>

      {/* Mostrar contador de notas */}
      <div style={{ marginBottom: '15px', color: '#7f8c8d' }}>
        Total de notas: <strong>{notes.length}</strong>
        {notes.length > 0 && (
          <span> | Guardadas en localStorage ✅</span>
        )}
      </div>

      {/* Lista de notas */}
      {notes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          color: '#6c757d'
        }}>
          <h3>📋 No hay notas guardadas</h3>
          <p>Agrega tu primera nota usando el formulario de arriba</p>
        </div>
      ) : (
        <div>
          {notes.map(note => (
            <div
              key={note.id}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '15px',
                marginBottom: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '10px'
              }}>
                <small style={{ color: '#7f8c8d' }}>
                  📅 {note.createdAt}
                </small>
                <button
                  onClick={() => deleteNote(note.id)}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  title="Eliminar nota"
                >
                  🗑️
                </button>
              </div>
              
              <p style={{
                margin: 0,
                lineHeight: '1.5',
                color: '#2c3e50',
                whiteSpace: 'pre-wrap' // Preserva saltos de línea
              }}>
                {note.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional sobre localStorage */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#e8f5e8',
        borderRadius: '5px',
        fontSize: '13px',
        color: '#2c3e50'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>🔍 Información técnica sobre localStorage:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>Persistencia:</strong> Los datos permanecen guardados hasta que se limpien manualmente</li>
          <li><strong>Capacidad:</strong> Aproximadamente 5-10MB por dominio</li>
          <li><strong>Sincronización:</strong> No se sincroniza entre dispositivos</li>
          <li><strong>Formato:</strong> Solo puede almacenar strings (usamos JSON.stringify/parse)</li>
          <li><strong>Acceso:</strong> Solo JavaScript del mismo dominio puede acceder a los datos</li>
        </ul>
      </div>
    </div>
  );
}

export default Notes;
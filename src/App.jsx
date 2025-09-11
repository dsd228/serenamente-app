import React from 'react';
import Notes from './Notes.jsx';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50' }}>Serenamente App</h1>
        <p style={{ color: '#7f8c8d' }}>Aplicación de notas con almacenamiento local</p>
      </header>
      
      <main>
        {/* Integración del componente Notes que maneja localStorage */}
        <Notes />
      </main>
    </div>
  );
}

export default App;
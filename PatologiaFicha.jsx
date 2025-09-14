import React, { useState } from "react";

// Base de datos de fichas (puedes ampliar cada área con funciones/test/ejercicios)
const fichas = [
  {
    key: "ansiedad",
    titulo: "Ansiedad (GAD, pánico, TOC)",
    descripcion: "Ansiedad excesiva, miedos, ataques de pánico o rituales.",
    tecnicas: [
      "TCC: psicoeducación, registro de síntomas, reestructuración cognitiva, exposición gradual.",
      "ERP para TOC: exposición + prevención de respuesta.",
      "Relajación y mindfulness."
    ],
    ejercicios: [
      "Respiración diafragmática guiada.",
      "Registro de pensamientos.",
      "Ejercicio 5-4-3-2-1 (anclaje al presente)."
    ],
    test: [
      { pregunta: "¿Sientes preocupación excesiva por cosas cotidianas?", opciones: ["Nunca", "A veces", "Frecuente", "Siempre"] },
      { pregunta: "¿Has tenido ataques de pánico en el último mes?", opciones: ["No", "1 vez", "2-3 veces", "Más de 3"] },
      { pregunta: "¿Evitas lugares/situaciones por miedo o ansiedad?", opciones: ["No", "Pocas veces", "Frecuente", "Siempre"] }
    ],
    farmacologia: ["ISRS/SNRI", "Benzodiacepinas en crisis"],
    otras: "Hospitalización si riesgo suicida. Psicoeducación familiar.",
    alarma: ["Ideación suicida", "Ataques graves", "Incapacidad funcional"],
    fuente: "NICE, WHO"
  },
  {
    key: "depresion",
    titulo: "Depresión / Bipolaridad",
    descripcion: "Tristeza profunda, anhedonia, alteración del ánimo.",
    tecnicas: ["TCC", "Activación conductual", "TIP", "IPSRT"],
    ejercicios: ["Agenda de actividades", "Registro emocional", "Mindfulness guiado"],
    test: [
      { pregunta: "¿Ha disminuido tu interés en actividades?", opciones: ["No", "Leve", "Moderado", "Severo"] },
      { pregunta: "¿Has tenido pensamientos suicidas?", opciones: ["Nunca", "Rara vez", "A menudo", "Diariamente"] }
    ],
    farmacologia: ["ISRS", "Litio", "Valproato", "Antipsicóticos"],
    otras: "ECT, rTMS, hospitalización.",
    alarma: ["Ideación suicida", "Deterioro funcional grave"],
    fuente: "NICE, NIMH"
  }
  // ...agrega más según tu JSON
];

// Modal básico para React
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(60,60,90,.17)", zIndex: 900,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: "2em", padding: "2em", maxWidth: "430px",
        boxShadow: "0 8px 36px #ecebff", position: "relative"
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "0.8em", right: "1em", fontSize: "1.5em",
          background: "none", border: "none", color: "#A81E3A"
        }}>×</button>
        <h3 style={{ marginBottom: "1em" }}>{title}</h3>
        <div>{children}</div>
      </div>
    </div>
  );
}

// Test rápido por ficha
function TestPatologia({ test }) {
  const [respuestas, setRespuestas] = useState(Array(test.length).fill(null));
  const [terminado, setTerminado] = useState(false);

  function handleChange(idx, value) {
    const nuevo = [...respuestas];
    nuevo[idx] = value;
    setRespuestas(nuevo);
  }

  function enviarTest() {
    setTerminado(true);
    // Aquí puedes poner lógica de puntaje, derivación, feedback, etc.
  }

  return (
    <div>
      {test.map((q, idx) => (
        <div key={idx} style={{ marginBottom: "1em" }}>
          <strong>{q.pregunta}</strong>
          <div>
            {q.opciones.map((op, i) => (
              <label key={i} style={{ marginRight: "1em" }}>
                <input
                  type="radio"
                  name={`test${idx}`}
                  value={op}
                  checked={respuestas[idx] === op}
                  onChange={() => handleChange(idx, op)}
                /> {op}
              </label>
            ))}
          </div>
        </div>
      ))}
      {!terminado ? (
        <button onClick={enviarTest} style={{ background: "#AEE6E6", color: "#2d3b6a", padding: "0.6em 1.2em", borderRadius: "1em", fontWeight: "bold" }}>Enviar test</button>
      ) : (
        <div style={{ marginTop: "1em", color: "#2d3b6a" }}>
          <strong>¡Test completado!</strong> {respuestas.includes("Severo") || respuestas.includes("Siempre") || respuestas.includes("Diariamente")
            ? "Te recomendamos consultar con un profesional." : "Tus respuestas no indican alerta grave, pero si persisten los síntomas consulta con tu médico."}
        </div>
      )}
    </div>
  );
}

// Ficha individual
function FichaPatologia({ ficha }) {
  const [modal, setModal] = useState({ open: false, title: "", content: null });

  function exportarPDF() {
    if (!window.jspdf) return alert("jsPDF no cargado.");
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Ficha: " + ficha.titulo, 20, 20);
    doc.setFontSize(12);
    doc.text("¿Qué es? " + ficha.descripcion, 20, 35);
    doc.text("Técnicas/Terapias Psicológicas:", 20, 50);
    doc.text(ficha.tecnicas.join('\n'), 20, 57);
    doc.text("Ejercicios prácticos:", 20, 72);
    doc.text(ficha.ejercicios.join('\n'), 20, 79);
    doc.text("Farmacología:", 20, 94);
    doc.text(ficha.farmacologia.join('\n'), 20, 101);
    doc.text("Otras intervenciones: " + ficha.otras, 20, 116);
    doc.text("Señales de alarma:", 20, 124);
    doc.text(ficha.alarma.join('\n'), 20, 131);
    doc.text("Guía/Fuente: " + ficha.fuente, 20, 146);
    doc.save(`ficha_${ficha.key}.pdf`);
  }

  function enviarMail() {
    let body = `Ficha: ${ficha.titulo}\n\n¿Que es?: ${ficha.descripcion}\n\nTécnicas:\n- ${ficha.tecnicas.join('\n- ')}\n\nEjercicios:\n- ${ficha.ejercicios.join('\n- ')}\n\nFarmacología:\n- ${ficha.farmacologia.join('\n- ')}\n\nOtras intervenciones:\n${ficha.otras}\n\nSeñales de alarma:\n- ${ficha.alarma.join('\n- ')}\n\nGuía/Fuente: ${ficha.fuente}`;
    let subject = `Ficha Salud Mental: ${ficha.titulo}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function derivacionAlarma() {
    alert(`Derivación/Alarma para ${ficha.titulo}:\n- ${ficha.alarma.join('\n- ')}\n\nContactar servicios de emergencia o profesional de salud mental.`);
    // Integra con tu sistema de notificaciones o backend aquí.
  }

  return (
    <div style={{
      background: "linear-gradient(110deg,#AEE6E6 60%,#ecebff 100%)",
      borderRadius: "1.5rem", padding: "1.5rem", marginBottom: "1.5rem",
      boxShadow: "0 4px 24px #ecebff"
    }}>
      <h2 style={{ color: "#2d3b6a", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
        {ficha.titulo}
      </h2>
      <div><b>¿Qué es?</b> {ficha.descripcion}</div>
      <div style={{ marginTop: "0.7em" }}>
        <b>Técnicas/Terapias Psicológicas:</b>
        <ul>{ficha.tecnicas.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </div>
      <div style={{ marginTop: "0.7em" }}>
        <b>Farmacología:</b>
        <ul>{ficha.farmacologia.map((f, i) => <li key={i}>{f}</li>)}</ul>
      </div>
      <div style={{ marginTop: "0.7em" }}>
        <b>Otras intervenciones:</b> {ficha.otras}
      </div>
      <div style={{ marginTop: "0.7em" }}>
        <b>Señales de alarma:</b>
        <ul>{ficha.alarma.map((a, i) => <li key={i}>{a}</li>)}</ul>
      </div>
      <div style={{ marginTop: "0.7em", color: "#6366F1" }}>
        <b>Guía/Fuente:</b> {ficha.fuente}
      </div>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "1em", marginTop: "1.2em"
      }}>
        <button
          style={{background:"linear-gradient(90deg,#AEE6E6,#B9AEDC)",color:"#2d3b6a",border:"none",padding:"0.7em 1.2em",borderRadius:"1em",fontWeight:"bold",cursor:"pointer"}}
          onClick={() => setModal({ open: true, title: "Técnicas", content: <ul>{ficha.tecnicas.map((t,i)=><li key={i}>{t}</li>)}</ul>})}
        >Ver técnicas</button>
        <button
          style={{background:"linear-gradient(90deg,#C2E9D3,#ecebff)",color:"#2d3b6a",border:"none",padding:"0.7em 1.2em",borderRadius:"1em",fontWeight:"bold",cursor:"pointer"}}
          onClick={() => setModal({ open: true, title: "Ejercicios prácticos", content: <ul>{ficha.ejercicios.map((t,i)=><li key={i}>{t}</li>)}</ul>})}
        >Ejercicios prácticos</button>
        <button
          style={{background:"linear-gradient(90deg,#B9AEDC,#A7C7E7)",color:"#2d3b6a",border:"none",padding:"0.7em 1.2em",borderRadius:"1em",fontWeight:"bold",cursor:"pointer"}}
          onClick={exportarPDF}
        >Exportar ficha PDF</button>
        <button
          style={{background:"linear-gradient(90deg,#F7D6E0,#AEE6E6)",color:"#a81e3a",border:"none",padding:"0.7em 1.2em",borderRadius:"1em",fontWeight:"bold",cursor:"pointer"}}
          onClick={derivacionAlarma}
        >Derivación / Alarma</button>
        <button
          style={{background:"linear-gradient(90deg,#C2E9D3,#F7D6E0)",color:"#2d3b6a",border:"none",padding:"0.7em 1.2em",borderRadius:"1em",fontWeight:"bold",cursor:"pointer"}}
          onClick={enviarMail}
        >Enviar por mail</button>
        <button
          style={{background:"#ecebff",color:"#2d3b6a",border:"none",padding:"0.7em 1.2em",borderRadius:"1em",fontWeight:"bold",cursor:"pointer"}}
          onClick={() => setModal({open:true,title:"Test de autoevaluación",content:<TestPatologia test={ficha.test}/>})}
        >Test rápido</button>
      </div>
      <Modal
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        title={modal.title + " (" + ficha.titulo + ")"}
      >
        {modal.content}
      </Modal>
    </div>
  );
}

// Componente principal para listado de fichas
export default function PatologiaFichas() {
  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      {fichas.map(f => (
        <FichaPatologia key={f.key} ficha={f} />
      ))}
    </div>
  );
}

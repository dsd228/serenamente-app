function exportMultiFichaPDF(fichasArray) {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) return alert("jsPDF no cargado.");
  let doc = new jsPDF();
  fichasArray.forEach((ficha, idx) => {
    if(idx > 0) doc.addPage();
    doc.text("Ficha: " + ficha.titulo, 20, 20);
    doc.text("¿Qué es? " + ficha.descripcion, 20, 35);
    doc.text("Técnicas/Terapias Psicológicas:\n" + ficha.tecnicas.join('\n'), 20, 50);
    doc.text("Farmacología:\n" + ficha.farmacologia.join('\n'), 20, 80);
    doc.text("Otras intervenciones:\n" + ficha.otras, 20, 95);
    doc.text("Señales de alarma:\n" + ficha.alarma.join('\n'), 20, 110);
    doc.text("Guía/Fuente: " + ficha.fuente, 20, 125);
  });
  doc.save("fichas_salud_mental.pdf");
}
// Ejemplo de uso:
const fichas = [
  {
    titulo: "Ansiedad (GAD, pánico, TOC)",
    descripcion: "Ansiedad excesiva, miedos, ataques de pánico o rituales.",
    tecnicas: ["TCC", "Exposición", "ERP (TOC)", "Mindfulness", "Relajación"],
    farmacologia: ["ISRS/SNRI", "Benzodiacepinas (crisis)"],
    otras: "Hospitalización si riesgo grave.",
    alarma: ["Ideación suicida", "Ataques graves"],
    fuente: "NICE, WHO"
  },
  // ...más fichas
];

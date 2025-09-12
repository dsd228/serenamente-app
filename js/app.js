// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtener todas las tarjetas de área
    const areaCards = document.querySelectorAll('.area-card');
    
    // Añadir evento a cada tarjeta
    areaCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevenir la navegación por ahora (para demostración)
            e.preventDefault();
            
            // Obtener el tema de la tarjeta
            const theme = this.getAttribute('data-theme');
            
            // Cambiar el tema del body
            document.body.className = theme;
            
            // También podríamos guardar la preferencia en localStorage
            localStorage.setItem('theme', theme);
            
            // Redirigir a la página correspondiente (descomentar cuando las páginas existan)
            // window.location.href = this.getAttribute('href');
        });
    });
    
    // Al cargar la página, verificar si hay un tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.className = savedTheme;
    }
});

// Marca el enlace activo
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split('/').pop();
  navLinks.forEach(link => {
    if (link.getAttribute('href').split('/').pop() === currentPath) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

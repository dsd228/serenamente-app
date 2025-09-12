document.querySelectorAll('.nav-link').forEach(link=>{
  link.addEventListener('click', function(){
    document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
    this.classList.add('active');
    // Si usas SPA, aquí puedes cargar dinámicamente el contenido del área
  });
});

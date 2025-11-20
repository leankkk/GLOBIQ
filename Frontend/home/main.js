let usuario = sessionStorage.getItem("usuario");
let ayudaBtn = document.querySelector('.ayuda'); 
let cerrarBtn = document.querySelector('.cerrar'); 
let cuentaBtn = document.getElementById("cuentaBtn");  
let popup = document.getElementById("popup");  
let btnMostrarPopup = document.getElementById("btnMostrarPopup");  
let popupContent = document.querySelector('.popup-content'); 


cuentaBtn.addEventListener("click", () => {
  console.log(usuario);
  if (usuario === "Sin usuario" || !usuario) {
    window.location.href = "/Frontend/pantalla 6 (login)/index.html";
  } else {
    window.location.href = "/Frontend/cuenta/index.html";
  }
});


ayudaBtn.addEventListener('click', () => {
  popup.style.display = "flex";  
});


cerrarBtn.addEventListener('click', () => {
  popup.style.display = "none";  
});


window.addEventListener('click', (e) => {
  if (e.target === popup) {  
    popup.style.display = "none";
  }
});

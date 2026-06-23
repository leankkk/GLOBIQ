let usuario = sessionStorage.getItem("usuario");
let ayudaBtn = document.querySelector('.ayuda'); 
let cerrarBtn = document.querySelector('.cerrar'); 
let cuentaBtn = document.getElementById("cuentaBtn");  
let popup = document.getElementById("popup");  
let btnMostrarPopup = document.getElementById("btnMostrarPopup");  
let popupContent = document.querySelector('.popup-content'); 
let cuentaTooltip = document.getElementById("cuentaTooltip");
let bienvenidaBanner = document.getElementById("bienvenidaBanner");
let bienvenidaTexto = document.getElementById("bienvenidaTexto");
let cerrarBienvenida = document.getElementById("cerrarBienvenida");

cuentaTooltip.textContent = usuario || "Ver cuenta";

function ocultarBienvenida() {
  bienvenidaBanner.classList.remove("visible");
}

if (sessionStorage.getItem("mostrarBienvenida") === "true" && usuario) {
  bienvenidaTexto.textContent = `Bienvenido, ${usuario}`;
  bienvenidaBanner.classList.add("visible");
  sessionStorage.removeItem("mostrarBienvenida");
  setTimeout(ocultarBienvenida, 4000);
}

cerrarBienvenida.addEventListener("click", ocultarBienvenida);


cuentaBtn.addEventListener("click", () => {
  window.location.href = "../cuenta/index.html";
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

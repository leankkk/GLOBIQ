
let nombreUsuario = document.getElementById("nombreUsuario");
let usuario = sessionStorage.getItem("usuario") || "Sin usuario";

// Si no está logueado, mostrar mensaje y ocultar stats
if (!sessionStorage.getItem("usuario")) {
  nombreUsuario.textContent = "Sin iniciar sesión";
  document.getElementById("cardsContainer").style.display = "none";
  document.getElementById("btnLogout").style.display = "none";
  
  let mensaje = document.createElement("p");
  mensaje.textContent = "Iniciá sesión para ver tus estadísticas.";
  mensaje.style.color = "#555";
  mensaje.style.fontSize = "2vh";
  mensaje.style.marginTop = "3vh";
  document.querySelector(".stats-container").appendChild(mensaje);
  
  let btnLogin = document.createElement("button");
  btnLogin.textContent = "Iniciar sesión";
  btnLogin.className = "btn-logout";
  btnLogin.style.backgroundColor = "#007a66";
  btnLogin.addEventListener("click", () => {
    window.location.href = "../pantalla 6 (login)/index.html";
  });
  document.querySelector(".stats-container").appendChild(btnLogin);
} else {
  postEvent("enviarStatsAlFront", { nombre: usuario }, mostrarStats);
}
nombreUsuario.textContent = usuario;
 
let listaDiario = document.getElementById("listaDiario");
let listaMayorMenor = document.getElementById("listaMayorMenor");
let listaBloques = document.getElementById("listaBloques");
 
function formatearString(string) {
  const result = string.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}
 
function esMostrable(valor) {
  if (valor === null) return false;
  if (Array.isArray(valor) && valor.length === 0) return false;
  if (typeof valor === "object" && !valor.label) return false;
  return true;
}
 
function llenarLista(listaDOM, infoObj) {
  Object.entries(infoObj).forEach(([clave, valor]) => {
    if (esMostrable(valor)) {
      let li = document.createElement("li");
      let texto = (typeof valor === "object" && valor.label) ? valor.label : valor;
      li.textContent = formatearString(clave) + ": " + texto;
      listaDOM.appendChild(li);
    }
  });
}
 
function mostrarStats(data) {
  llenarLista(listaDiario, data.stats.diario);
  llenarLista(listaMayorMenor, data.stats.mayormenor);
  llenarLista(listaBloques, data.stats.bloques);
}
  
document.getElementById("btnLogout").addEventListener("click", function () {
  sessionStorage.removeItem("usuario");
  window.location.href = "../pantalla 6 (login)/index.html";
});
 

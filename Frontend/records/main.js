

let usuario = sessionStorage.getItem("usuario") || "Sin usuario";
 
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
 
function llenarLista(listaDOM, infoArr) {
  if (!Array.isArray(infoArr) || infoArr.length === 0) {
    let li = document.createElement("li");
    li.className = "record-vacio";
    li.textContent = "Todavía no hay récords para mostrar.";
    listaDOM.appendChild(li);
    return;
  }

  infoArr.forEach(({ nombre, usuario, valor }) => {
    if (esMostrable(valor)) {
      let li = document.createElement("li");
      let nombreDOM = document.createElement("span");
      let valorDOM = document.createElement("strong");
      let usuarioDOM = document.createElement("span");

      nombreDOM.className = "record-nombre";
      valorDOM.className = "record-valor";
      usuarioDOM.className = "record-usuario";
      nombreDOM.textContent = formatearString(nombre);
      valorDOM.textContent = valor;
      usuarioDOM.textContent = usuario;

      li.append(nombreDOM, valorDOM, usuarioDOM);
      listaDOM.appendChild(li);
    }
  });
}
 function mostrarStats(data) {
  llenarLista(listaDiario, data.records?.diario);
  llenarLista(listaMayorMenor, data.records?.mayormenor);
  llenarLista(listaBloques, data.records?.bloques);
}
 
getEvent("enviarRecordsAlFront", mostrarStats);
 

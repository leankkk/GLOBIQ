

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
  infoArr.forEach(({ nombre, usuario, valor }) => {
    if (esMostrable(valor)) {
      let li = document.createElement("li");
      li.textContent =
        `${formatearString(nombre)} (${usuario}): ${valor}`;
      listaDOM.appendChild(li);
    }
  });
}
 
function mostrarStats(data) {
  llenarLista(listaDiario, data.records.diario);
  llenarLista(listaMayorMenor, data.records.mayormenor);
  llenarLista(listaBloques, data.records.bloques);
}
 
getEvent("enviarRecordsAlFront", mostrarStats);
 
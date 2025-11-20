connect2Server(3001);
let input = document.getElementById('input');
let boton = document.getElementById('enviar');
let listaPistas = document.getElementById('listaPistas');
let popup = document.getElementById('popup');
let btnOk = document.getElementById('btn-ok');
let intentosDOM = document.getElementById("cantidaddeintentosDOM");
let usuario = sessionStorage.getItem("usuario") ?? "Sin usuario";
let btnCambiarCategoria = document.getElementById("btnCambiarCategoria");
let rendirseBtn = document.getElementById("rendirseBtn");
let popupRendirse = document.getElementById("popupRendirse");
let paisCorrectoDOM = document.getElementById("paisCorrectoDOM");
let btnVolver = document.getElementById("btn-volver");
let popupAyuda = document.getElementById("popupAyuda");
let cerrarBtn = document.querySelector('.cerrar');




let intentosHechos = 0;
let intentosFallidos = [];  


let paisDiario;
let intentos = 0;



function calcularPromedioPuntaje(stats){
let sumatoria = 0;
for (let i = 0; i < stats.stats.diario.listaPuntajes.length; i++){
  sumatoria += stats.stats.diario.listaPuntajes[i]
}
return sumatoria / stats.stats.diario.listaPuntajes.length;
}

async function enviarstats(){
  console.log("envio de stats iniciado");
  postEvent("enviarStatsAlFront", { nombre: usuario }, getStats);
}


function getStats(data) {
  stats = data;
  console.log(stats);
  stats.stats.diario ??= {};
  let puntaje = stats.stats.diario.puntaje ?? Math.min(intentos, stats.stats.diario.puntaje);
  stats.stats.diario.puntaje ??= intentos;
  stats.stats.diario.puntaje = Math.min(intentos, stats.stats.diario.puntaje);
  console.log(puntaje, intentos, stats.stats.diario.puntaje);
  stats.stats.diario.puntaje ??= puntaje;

  stats.stats.diario.intentosHechos += intentosHechos;
  stats.stats.diario.listaPuntajes.push(intentos);
  stats.stats.diario.promedioPuntajes = calcularPromedioPuntaje(stats);
  stats.stats.diario.rondasGanadas = stats.stats.diario.listaPuntajes.length;
  postEvent("guardarStatsEnElBack", stats, guardarStats);
}


function guardarStats() {}


function establecerPaisDiario(data) {
  paisDiario = data.label;
}


function mostrarPista(data) {
  let nuevaPista = document.createElement('div');
  nuevaPista.classList.add('pista-item');
  intentos++;
  nuevaPista.textContent = intentos + ". " + data.label + ": " + data.valor;
  listaPistas.appendChild(nuevaPista);
  listaPistas.scrollTop = listaPistas.scrollHeight; 
}


getEvent("obtenerPaisDiario", establecerPaisDiario);



boton.addEventListener('click', () => {
  let respuesta = input.value.trim().toLowerCase();
  intentosHechos++;

  if (respuesta === paisDiario.toLowerCase()) {
    intentosDOM.innerText = "Cantidad de pistas:  " + intentos;
    popup.style.display = "flex";
    enviarstats();
    input.disabled = "disabled";
  } else {
    postEvent("obtenerPista", {}, mostrarPista);
    intentosFallidos.push(respuesta);
    mostrarIntentos();
  }

  input.value = ""; 
});


input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    boton.click(); 
  }
});



function mostrarIntentos() {
  let listaIntentos = document.getElementById('listaIntentos');
  listaIntentos.innerHTML = ''; 


  
  intentosFallidos.forEach((intento, index) => {
    let nuevoIntento = document.createElement('div');
    nuevoIntento.classList.add('intento-item');
    nuevoIntento.textContent = (index + 1) + ". " + intento; 
    listaIntentos.appendChild(nuevoIntento); 
  });
}


btnOk.addEventListener('click', () => {
  popup.style.display = "none";
  window.location.href = "../home/index.html";
});





rendirseBtn.addEventListener("click", () => {
  window.location.href = "../home/index.html";
});


cuentaBtn.addEventListener("click", () => {
  console.log(usuario);
  if (usuario === "Sin usuario" || !usuario) {
    window.location.href = "/Frontend/pantalla 6 (login)/index.html";
  } else {
    window.location.href = "/Frontend/cuenta/index.html";
  }
});



ayudaBtn.addEventListener("click", () => {
    console.log("CLICK EN AYUDA");
    popupAyuda.style.display = "flex";
});

document.querySelector(".cerrar").addEventListener("click", () => {
  popupAyuda.style.display = "none";
});

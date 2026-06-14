// connect2Server ya no es necesario, lo maneja rest.js

let input = document.getElementById('input');
let boton = document.getElementById('enviar');
let listaPistas = document.getElementById('listaPistas');
let popup = document.getElementById('popup');
let btnOk = document.getElementById('btn-ok');
let intentosDOM = document.getElementById("cantidaddeintentosDOM");
let usuario = sessionStorage.getItem("usuario") ?? "Sin usuario";
let popupAyuda = document.getElementById("popupAyuda");
let ayudaBtn = document.getElementById("ayudaBtn");
let cerrarBtn = document.querySelector(".cerrar");
let cuentaBtn = document.getElementById("cuentaBtn");
let btnRendirse = document.getElementById("btnRendirse");
let popupRendirse = document.getElementById("popupRendirse");
let respuestaRendirse = document.getElementById("respuestaRendirse");

let intentosHechos = 0;
let intentosFallidos = [];
let paisDiario;
let intentos = 0;

function calcularPromedioPuntaje(stats) {
  let sumatoria = 0;

  for (let i = 0; i < stats.stats.diario.listaPuntajes.length; i++) {
    sumatoria += stats.stats.diario.listaPuntajes[i];
  }

  return sumatoria / stats.stats.diario.listaPuntajes.length;
}

async function enviarstats() {
  postEvent("enviarStatsAlFront", { nombre: usuario }, getStats);
}

function getStats(data) {
  let stats = data;

  stats.stats.diario ??= {};
  stats.stats.diario.puntaje ??= intentos;
  stats.stats.diario.intentosHechos ??= 0;
  stats.stats.diario.listaPuntajes ??= [];

 let puntajeActual = Math.round(1000 / Math.max(intentos, 1));

  stats.stats.diario.puntaje = Math.max(
    puntajeActual,
    stats.stats.diario.puntaje
  );

  stats.stats.diario.intentosHechos += intentosHechos;
  stats.stats.diario.listaPuntajes.push(intentos);
  stats.stats.diario.promedioPuntajes = calcularPromedioPuntaje(stats);
  stats.stats.diario.rondasGanadas = stats.stats.diario.listaPuntajes.length;

  // Racha de días
  let hoy = new Date().toISOString().split("T")[0];
  let ayer = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  stats.stats.diario.rachaDias ??= 0;
  stats.stats.diario.ultimoDiaJugado ??= null;

  if (stats.stats.diario.ultimoDiaJugado === ayer) {
    stats.stats.diario.rachaDias++;
  } else if (stats.stats.diario.ultimoDiaJugado !== hoy) {
    stats.stats.diario.rachaDias = 1;
  }

  stats.stats.diario.ultimoDiaJugado = hoy;

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

  nuevaPista.textContent =
    intentos + ". " + data.label + ": " + data.valor;

  listaPistas.appendChild(nuevaPista);

  setTimeout(() => {
    nuevaPista.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }, 50);
}

// Al cargar la página, traemos el país diario y la primera pista
getEvent("obtenerPaisDiario", establecerPaisDiario);

function normalizarTexto(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatearPais(texto) {
  texto = texto.trim().toLowerCase();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

boton.addEventListener('click', () => {

  let respuestaOriginal = input.value.trim();
  let respuesta = normalizarTexto(respuestaOriginal);
  let paisCorrecto = normalizarTexto(paisDiario);

  if (respuesta === "") return;

  intentosHechos++;

  if (respuesta === paisCorrecto) {

let puntaje = Math.round(1000 / Math.max(intentos, 1));

    intentosDOM.innerText =
      "Cantidad de pistas: " +
      intentos +
      "\nPuntaje: " +
      puntaje;

    popup.style.display = "flex";

    input.disabled = true;

    enviarstats();

  } else {

    postEvent("obtenerPista", {}, mostrarPista);

    intentosFallidos.push(
      formatearPais(respuestaOriginal)
    );

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

  let listaIntentos =
    document.getElementById('listaIntentos');

  listaIntentos.innerHTML = '';

  intentosFallidos.forEach((intento, index) => {

    let nuevoIntento =
      document.createElement('div');

    nuevoIntento.classList.add('intento-item');

    nuevoIntento.textContent =
      (index + 1) + ". " + intento;

    listaIntentos.appendChild(nuevoIntento);
  });

  let ultimo = listaIntentos.lastElementChild;

  if (ultimo) {
    setTimeout(() => {
      ultimo.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 50);
  }
}

btnOk.addEventListener('click', () => {
  popup.style.display = "none";
  window.location.href = "../home/index.html";
});

btnRendirse.addEventListener("click", () => {
  respuestaRendirse.textContent = paisDiario || "Cargando...";
  popupRendirse.style.display = "flex";
});

document.getElementById("btnInicioRendirse").addEventListener("click", () => {
  window.location.href = "../home/index.html";
});

if (cuentaBtn) {

  cuentaBtn.addEventListener("click", () => {

    if (
      usuario === "Sin usuario" ||
      !usuario
    ) {

      window.location.href =
        "/pantalla 6 (login)/index.html";

    } else {

      window.location.href =
        "/cuenta/index.html";
    }
  });
}

ayudaBtn.addEventListener("click", () => {
  popupAyuda.style.display = "flex";
});

cerrarBtn.addEventListener("click", () => {
  popupAyuda.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === popupAyuda) {
    popupAyuda.style.display = "none";
  }
});

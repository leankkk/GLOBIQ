connect2Server(3001);

let modal = document.getElementById("myModal");
let mensajeResultado = document.getElementById("mensajeResultado");
let bloquesContainer = document.getElementById('bloques');
let bloque1 = document.getElementById('bloque1');
let bloque2 = document.getElementById('bloque2');
let bloque3 = document.getElementById('bloque3');
let bloque4 = document.getElementById('bloque4');
let bloque5 = document.getElementById('bloque5');
let slots = document.querySelectorAll('.slot');
let respuesta = document.getElementById("respuestaDiv");
let inputAdivinarPais = document.getElementById('inputFinal');
let labelPaisObjetivo;
let dragged = null;
let input = {};
let intentosPreguntas = 0;
let intentosDeAdivinar = 0;
let paisobjetivo;
let listadescartados;
let listaposibles;
let usuario = sessionStorage.getItem("usuario") ?? "Sin usuario";
let categoriasPreguntadas = [];
let listaValores = [];
let valoresPreguntados = [];

function mostrarPopUp(preguntas,adivinar) {
  mensajeResultado.innerText = "¡Adivinaste el país (" + labelPaisObjetivo + ")! Te llevó " + adivinar + " intentos y "+preguntas+" preguntas.";
  modal.style.display = "block";
}
  
document.getElementById("btnJugar").addEventListener("click", () => {
  location.reload();
});

document.getElementById("btnPrincipal").addEventListener("click", () => {
  window.location.href = "../home/index.html";
});

//FUNCIÓN DE STATS LISTAS CATEGORIAS Y PAISES
function compararListasAcertados(info,esCategoria){
//version para categorias
    if (esCategoria){
console.log(esCategoria,info)
let categoriasEnStats = info.stats.bloques.categoriasPreguntadas;
//hasta aca td bien
for (let i = 0; i < categoriasPreguntadas.length; i++){ //loop para ver cuales se repiten entre nuestra lista y la otra
    console.log("Se pasó a la categoría "+(i+1)+" de las acertadas actuales: ",categoriasPreguntadas[i]);
    let existe = false;
    for (let c = 0; c < categoriasEnStats.length; c++){
        if (categoriasEnStats[c].dato === categoriasPreguntadas[i].dato){
            categoriasEnStats[c].cantidad += categoriasPreguntadas[i].cantidad;
            console.log(categoriasEnStats[c].cantidad);
            existe = true;
        }
        console.log("c =",c)
    }
    if (existe === false) categoriasEnStats.push(categoriasPreguntadas[i]);

}
return categoriasEnStats;
}
if (!esCategoria){
    console.log(esCategoria,info)
    let valoresEnStats = info.stats.mayormenor.valoresPreguntados ?? [];
    //hasta aca td bien
    for (let i = 0; i < valoresPreguntados.length; i++){ //loop para ver cuales se repiten entre nuestra lista y la otra
        console.log("Se pasó a la categoría "+(i+1)+" de las acertadas actuales: ",valoresPreguntados[i]);
        let existe = false;
        for (let c = 0; c < valoresEnStats.length; c++){
            if (valoresEnStats[c].valor === valoresPreguntados[i].valor){
                valoresEnStats[c].cantidad += valoresPreguntados[i].cantidad;
                console.log(valoresEnStats[c].cantidad);
                existe = true;
            }
            console.log("c =",c)
        }
        if (existe === false) valoresEnStats.push(valoresPreguntados[i]);
    
    }
    return valoresEnStats;
    }
}



function actualizarCategorias(data) {
  categorias = data;
  bloque1.innerText = categorias[0].label;
  bloque2.innerText = categorias[1].label;
  bloque3.innerText = categorias[2].label;
  bloque4.innerText = categorias[3].label;
  bloque5.innerText = categorias[4].label;
};

function evaluarRespuestaFront(data) {
  listadescartados = data.listadescartados;
  listaposibles = data.listaposibles;
  intentosPreguntas = data.intentos;

  if (data.victoria) {
    mostrarPopUp(intentosPreguntas,intentosDeAdivinar);
    enviarstats();
    document.getElementById("btnAdivinar").disabled = true;
    getEvent("iniciarBloques", establecerVariablesInicio);
  } else {
    respuesta.classList.remove("invisible");
    respuesta.innerText = "Respuesta: " + data.respuesta;

    actualizarListasFront(data.listaposibles, data.listadescartados);

    actualizarMapa(data.listaposibles, data.listadescartados);

    postEvent("obtenerCategorias", { pais: paisobjetivo }, actualizarCategorias);
  }
}

function calcularMasPreguntado(lista){
  let indiceDelMayor = 0;
  for (let i = 1; i < lista.length; i++){
    if (lista[i].cantidad > lista[indiceDelMayor].cantidad) indiceDelMayor = i;
  }
  return lista[indiceDelMayor];
}


async function enviarstats() {
  console.log("envio de stats iniciado");
  postEvent("enviarStatsAlFront", { nombre: usuario }, getStats);
}

function getStats(data) {
  stats = data;
  console.log(stats);
  if (!stats) stats = {};
  stats.stats ??= {};
  stats.stats.bloques ??= {};

  let prevIntentos = Number(stats.stats.bloques.puntaje);
  if (!Number.isFinite(prevIntentos)) prevIntentos = 0;
  let currentIntentos = Number(intentosPreguntas);
  if (!Number.isFinite(currentIntentos)) currentIntentos = 0;

  let statintentos = Math.min(currentIntentos, prevIntentos || currentIntentos);

  stats.stats.bloques.puntaje = statintentos;
  console.log(intentosPreguntas, prevIntentos, stats.stats.bloques.puntaje);
  stats.stats.bloques.puntaje ??= statintentos;
stats.stats.bloques.listaPuntajes.push(currentIntentos);
stats.stats.bloques.promedioPuntajes = calcularPromedioRacha(stats);
stats.stats.bloques.rondasGanadas++;
stats.stats.bloques.preguntasHechas += intentosPreguntas;
let statvaloresPreguntados = compararListasAcertados(stats,false) ?? valoresPreguntados;
 let statcategoriasPreguntadas = compararListasAcertados(stats,true) ?? categoriasPreguntadas;
 stats.stats.bloques.categoriasPreguntadas = statcategoriasPreguntadas;
 stats.stats.bloques.valoresPreguntados = statvaloresPreguntados;
 stats.stats.bloques.valorPromedio = calcularPromedioRacha(stats,true)
stats.stats.bloques.listaValoresPreguntados.push(...listaValores);
console.log(calcularMasPreguntado(stats.stats.bloques.categoriasPreguntadas));
stats.stats.bloques.categoriasPreguntadas = calcularMasPreguntado(stats.stats.bloques.categoriasPreguntadas);
  postEvent("guardarStatsEnElBack", stats, guardarStats);
}

function guardarStats() { };


function calcularPromedioRacha(stats,esValorPromedio){
  if (esValorPromedio){
     let sumatoria = 0;
    for (let i = 0; i < stats.stats.bloques.valoresPreguntados.length; i++){
      sumatoria += stats.stats.bloques.valoresPreguntados[i]
    }
    return sumatoria / stats.stats.bloques.valoresPreguntados.length;
    }
    else {
  let sumatoria = 0;
    for (let i = 0; i < stats.stats.bloques.listaPuntajes.length; i++){
      sumatoria += stats.stats.bloques.listaPuntajes[i]
    }
    return sumatoria / stats.stats.bloques.listaPuntajes.length;}
    }

function establecerVariablesInicio(data) {
  intentosPreguntas = 0; // debe empezar con 3, no con 0
  paisobjetivo = data.pais;
  labelPaisObjetivo = data.labelPaisObjetivo;
  listadescartados = [];
  listaposibles = data.listaposibles;
  categorias = data.categorias;
  bloque1.innerText = categorias[0].label;
  bloque2.innerText = categorias[1].label;
  bloque3.innerText = categorias[2].label;
  bloque4.innerText = categorias[3].label;
  bloque5.innerText = categorias[4].label;
}


getEvent("iniciarBloques", establecerVariablesInicio);
// --- BLOQUES ARRASTRABLES --- //
document.querySelectorAll('.bloque').forEach(bloque => {
  bloque.addEventListener('dragstart', e => {
    dragged = e.target;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => bloque.style.opacity = "0.3", 0);
  });

  bloque.addEventListener('dragend', () => {
    dragged.style.opacity = "1";
    dragged = null;
  });
});

// --- SLOTS (permiten soltar) --- //
slots.forEach(slot => {
  slot.addEventListener('dragover', e => {
    e.preventDefault();

    // Restricciones específicas del bloque MOM
    if (dragged && dragged.id === "MOM" && slot.id !== "slot2") return;
    if (dragged && dragged.id !== "MOM" && slot.id === "slot2") return;

    slot.classList.add('hovered');
  });

  slot.addEventListener('dragleave', () => {
    slot.classList.remove('hovered');
  });

  slot.addEventListener('drop', e => {
    e.preventDefault();
    slot.classList.remove('hovered');

    // Restricciones específicas del bloque MOM
    if (dragged && dragged.id === "MOM" && slot.id !== "slot2") return;
    if (dragged && dragged.id !== "MOM" && slot.id === "slot2") return;

    // Si el slot ya tiene algo, lo devuelve al contenedor de bloques
    if (slot.firstChild) {
      bloquesContainer.appendChild(slot.firstChild);
    }

    slot.appendChild(dragged);
    dragged.style.margin = "0";
  });
});

// --- NUEVO: PERMITIR SACAR BLOQUES DE LOS SLOTS --- //
bloquesContainer.addEventListener('dragover', e => e.preventDefault());
bloquesContainer.addEventListener('drop', e => {
  e.preventDefault();

  // 🧩 CAMBIO: ahora también devuelve bloques que estaban en un slot
  if (dragged) {
    bloquesContainer.appendChild(dragged);
    dragged.style.margin = "5px";
  }
});

// 🧩 NUEVO: también permitir soltar en el body (espacio libre)
document.body.addEventListener('dragover', e => e.preventDefault());
document.body.addEventListener('drop', e => {
  // Si se suelta fuera de slots o del contenedor, lo devuelve igual
  if (dragged && !e.target.classList.contains('slot') && !e.target.classList.contains('bloque')) {
    bloquesContainer.appendChild(dragged);
    dragged.style.margin = "5px";
  }
});


let valorSlot1 = "";
let valorSlot2 = "";
let valorInputFinal = 0;

document.getElementById('btnAdivinar').addEventListener('click', () => {
  valorSlot1 = document.querySelector('#slot1').textContent.trim();
  valorSlot2 = document.querySelector('#slot2').textContent.trim();
  valorInputFinal = document.querySelector('#inputFinal').value.trim();

  // Validar que todo esté completo
  if (!valorSlot1 || !valorSlot2 || !valorInputFinal) {
    mostrarError("Debes completar todos los campos antes de adivinar.");
    return;
  }

  input = {
    comparacion: valorSlot2,
    valor: parseInt(valorInputFinal),
    categoria: valorSlot1
  };

  listaValores.push(input.valor);

let existente = categoriasPreguntadas.find(obj => obj.dato === input.categoria);
if (existente) {
  existente.cantidad++;
} else {
  categoriasPreguntadas.push({dato:input.categoria, cantidad: 1 });
}

let existente2 = valoresPreguntados.find(obj => obj.valor === input.valor);
if (existente2) {
  existente2.cantidad++;
} else {
  valoresPreguntados.push({valor:input.valor, cantidad: 1 });
}

  postEvent("evaluarRespuestaBloques", {
    input: input,
    paisobjetivo: paisobjetivo,
    intentos: intentosPreguntas,
    listadescartados: listadescartados,
    listaposibles: listaposibles,
  }, evaluarRespuestaFront);
});


function actualizarListasFront(posibles, descartados) {
  const ulPosibles = document.getElementById("ulPosibles");
  const ulDescartados = document.getElementById("ulDescartados");

  ulPosibles.innerHTML = "";
  ulDescartados.innerHTML = "";

  posibles.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.label || p.pais;
    ulPosibles.appendChild(li);
  });

  descartados.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.label || p.pais;
    ulDescartados.appendChild(li);
  });

  document.getElementById("posiblesHTMLTexto").innerText = "Posibles (" + posibles.length + ")";
  document.getElementById("descartadosHTMLTexto").innerText = "Descartados (" + descartados.length + ")";
}

function actualizarMapa(posibles, descartados) {
  // Quitar colores previos
  document.querySelectorAll("svg .land").forEach(pais => {
    pais.classList.remove("posible", "descartado");
  });

  // Pintar los posibles de azul
  posibles.forEach(p => {
    if (p.codigo) {
      const el = document.getElementById(p.codigo);
      if (el) el.classList.add("posible");
    }
  });

  // Pintar los descartados de rojo
  descartados.forEach(p => {
    if (p.codigo) {
      const el = document.getElementById(p.codigo);
      if (el) el.classList.add("descartado");
    }
  });
}


// Función para mostrar popup de error
function mostrarError(mensaje) {
  const errorModal = document.getElementById("errorModal");
  const errorMensaje = document.getElementById("errorMensaje");
  errorMensaje.innerText = mensaje;
  errorModal.style.display = "block";
}

// Cerrar el popup
document.getElementById("cerrarError").addEventListener("click", () => {
  document.getElementById("errorModal").style.display = "none";
});

// También cerrar si se hace clic fuera
window.addEventListener("click", (e) => {
  const modal = document.getElementById("errorModal");
  if (e.target === modal) modal.style.display = "none";
});


document.getElementById("btnAdivinarPais").addEventListener("click", () => {
  const inputPais = document.getElementById("inputAdivinarPais").value.trim();

  if (!inputPais) {
    mostrarError("Debes ingresar un país antes de adivinar.");
    return;
  }

  // Si ya se quedó sin intentos
  if (intentosDeAdivinar >= 3) {
    mostrarError("No te quedan más intentos.");
    document.getElementById("btnAdivinarPais").disabled = true;
    return;
  }

  // Comparar con el país objetivo
  if (inputPais.toLowerCase() === labelPaisObjetivo.toLowerCase()) {
    intentosDeAdivinar++;
    mostrarPopUp(intentosPreguntas,intentosDeAdivinar);
    enviarstats();
    document.getElementById("btnAdivinarPais").disabled = true;
    document.getElementById("btnAdivinar").disabled = true;
  } else {
    intentosDeAdivinar++;
    if (intentosDeAdivinar !== 3) {
      mostrarError(`Incorrecto. Te quedan ${3-intentosDeAdivinar} intento${3-intentosDeAdivinar === 1 ? "" : "s"}.`);
    } else {
      mostrarError("Incorrecto. No te quedan más intentos.");
      document.getElementById("btnAdivinarPais").disabled = true;
      //document.getElementById("btnAdivinar").disabled = true;
    }
  }
});

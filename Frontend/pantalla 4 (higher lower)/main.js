let modo = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("popupModo").style.display = "flex";
});

document.getElementById("btnFacil").addEventListener("click", () => {
  modo = "facil";
  document.getElementById("popupModo").style.display = "none";
  postEvent("iniciarMayorMenor", { modo }, iniciarMayorMenor);
});

document.getElementById("btnMedio").addEventListener("click", () => {
  modo = "medio";
  document.getElementById("popupModo").style.display = "none";
  postEvent("iniciarMayorMenor", { modo }, iniciarMayorMenor);
});

document.getElementById("btnDificil").addEventListener("click", () => {
  modo = "dificil";
  document.getElementById("popupModo").style.display = "none";
  postEvent("iniciarMayorMenor", { modo }, iniciarMayorMenor);
});

let flag1 = document.getElementById("flag1");
let flag2 = document.getElementById("flag2");
let paisInicialNombre = document.getElementById("nombrePaisIZQ");
let pais2Nombre = document.getElementById("nombrePaisDER");
let paisInicialDato = document.getElementById("paisInicialDato");
let botonMayor = document.getElementById("btnMayor");
let botonMenor = document.getElementById("btnMenor");
let btnCambiarCategoria = document.getElementById("btnCambiarCategoria");
let rachaContador = document.getElementById("rachaContador");
let comparacionesHechas = 0;
let ayudaBtn = document.querySelector('.ayuda');
let popupAyuda = document.getElementById("popup");
let cerrarBtn = document.querySelector('.cerrar'); 
let usuario = sessionStorage.getItem("usuario");

let infousuario;
let categoriasAcertadas = [];
let paisesAcertados = [];

let intentosCambiarCategoria = 3;
let paisInicial;
let labelpaisInicial;
let labelpais2;
let pais2;
let dato;
let valorInicial;
let labelvalorInicial;
let label;
let timer;

let racha = 0;
let puntaje = 0;
let paises = [];  

function compararListasAcertados(info, esCategoria){
    if (esCategoria){
        let categoriasEnStats = info.stats.mayormenor.categoriasAcertadas;
        for (let i = 0; i < categoriasAcertadas.length; i++){
            let existe = false;
            for (let c = 0; c < categoriasEnStats.length; c++){
                if (categoriasEnStats[c].dato === categoriasAcertadas[i].dato){
                    categoriasEnStats[c].cantidad += categoriasAcertadas[i].cantidad;
                    existe = true;
                }
            }
            if (existe === false) categoriasEnStats.push(categoriasAcertadas[i]);
        }
        return categoriasEnStats;
    }
    if (!esCategoria){
        let paisesEnStats = info.stats.mayormenor.paisesAcertados;
        for (let i = 0; i < paisesAcertados.length; i++){
            let existe = false;
            for (let c = 0; c < paisesEnStats.length; c++){
                if (paisesEnStats[c].pais === paisesAcertados[i].pais){
                    paisesEnStats[c].cantidad += paisesAcertados[i].cantidad;
                    existe = true;
                }
            }
            if (existe === false) paisesEnStats.push(paisesAcertados[i]);
        }
        return paisesEnStats;
    }
}

function establecerBandera(codigo, inicial) {
  const num = inicial ? 1 : 2;
  const bandera = document.getElementById("flag" + num);

  if (!bandera) return;

  bandera.innerHTML =
      `<span class="fi fi-${codigo.toLowerCase()}" style="scale:4;"></span>`;
}

function calcularMasAcertado(lista){
  let indiceDelMayor = 0;
  for (let i = 1; i < lista.length; i++){
    if (lista[i].cantidad > lista[indiceDelMayor].cantidad) indiceDelMayor = i;
  }
  return lista[indiceDelMayor];
}

function calcularPromedioRacha(stats){
    let sumatoria = 0;
    for (let i = 0; i < stats.stats.mayormenor.listaRachas.length; i++){
      sumatoria += stats.stats.mayormenor.listaRachas[i];
    }
    return sumatoria / stats.stats.mayormenor.listaRachas.length;
}

function cambiarCategoria(){
    if (intentosCambiarCategoria > 0){
        postEvent("cambiarCategoria", {
            paisInicial, labelpaisInicial, pais2, labelpais2,
            dato, valorInicial, labelvalorInicial, label, timer, modo
        }, iniciarMayorMenor);
        intentosCambiarCategoria--;
        btnCambiarCategoria.innerText = "Cambiar de categoría (" + intentosCambiarCategoria + ")";
    }
    else if (intentosCambiarCategoria === 0) btnCambiarCategoria.disabled = true;
}

function iniciarMayorMenor(data) {
    paisInicial = data.paisInicial; 
    labelpaisInicial = data.labelpaisInicial;
    pais2 = data.pais2;
    labelpais2 = data.labelpais2;
    dato = data.dato;
    valorInicial = data.valorInicial;
    labelvalorInicial = data.labelvalorInicial;
    label = data.label;
    timer = data.timer;
    modo = data.modo ?? modo;
    paisInicialNombre.innerText = labelpaisInicial;
    paisInicialDato.innerText = labelvalorInicial;
    pais2Nombre.innerText = labelpais2;
    categoriaNombre.innerText = label;
    establecerBandera(data.idPaisInicial, true);
    establecerBandera(data.idPais2, false);
}

async function enviarstats(){
  if (modo !== "facil"){
    let nombreAGuardar = usuario || "Sin usuario";
    postEvent("enviarStatsAlFront", {nombre: nombreAGuardar}, getStats);
  }}

function getStats(data){
    infousuario = data;
    let racha = (Math.max(timer, infousuario.stats.mayormenor.racha)) ?? timer;
    infousuario.stats.mayormenor.racha = racha;
    let statpaisesAcertados = compararListasAcertados(infousuario, false) ?? paisesAcertados;
    let statcategoriasAcertadas = compararListasAcertados(infousuario, true) ?? categoriasAcertadas;
    infousuario.stats.mayormenor.categoriasAcertadas = statcategoriasAcertadas;
    infousuario.stats.mayormenor.paisesAcertados = statpaisesAcertados;
    infousuario.stats.mayormenor.listaRachas.push(timer);
    infousuario.stats.mayormenor.promedioRachas = calcularPromedioRacha(infousuario);
    infousuario.stats.mayormenor.categoriaMasAcertada = calcularMasAcertado(statcategoriasAcertadas);
    infousuario.stats.mayormenor.paisMasAcertado = calcularMasAcertado(statpaisesAcertados);
    infousuario.stats.mayormenor.rondasJugadas++;
    infousuario.stats.mayormenor.comparacionesHechas += comparacionesHechas;
    postEvent("guardarStatsEnElBack", infousuario, guardarStats);
}

function guardarStats(){};

function evaluarResultado(data){
    if (data.victoria) {
        paisInicial = data.paisInicial; 
        pais2 = data.pais2;
        dato = data.dato;
        labelpaisInicial = data.labelpaisInicial;
        labelvalorInicial = data.labelvalorInicial;
        timer = data.timer;
        modo = data.modo ?? modo;
        paisInicialNombre.innerText = data.labelpaisInicial;
        paisInicialDato.innerText = data.labelvalorInicial;
        pais2Nombre.innerText = data.labelpais2;
        categoriaNombre.innerText = data.label;
        rachaContador.innerText = timer;

        let existente = categoriasAcertadas.find(obj => obj.dato === dato);
        if (existente) existente.cantidad++;
        else categoriasAcertadas.push({ dato, cantidad: 1, label: data.label });

        let existente2 = paisesAcertados.find(obj => obj.pais === paisInicial);
        if (existente2) existente2.cantidad++;
        else paisesAcertados.push({pais: paisInicial, cantidad: 1, label: data.labelpaisInicial});

        establecerBandera(data.idPaisInicial, true);
        establecerBandera(data.idPais2, false);
    }
    else {
        mostrarPopUp(data.timer);
        if (timer >= 1) enviarstats();
        pais2Nombre.innerText = labelpais2 + ": " + data.valorPais2;
    }
}

botonMayor.addEventListener("click", () => {
    postEvent("evaluarRespuesta", {input: false, timer, paisInicial, labelpaisInicial, pais2, labelpais2, dato, valorInicial, modo}, evaluarResultado);
    comparacionesHechas++;
});

botonMenor.addEventListener("click", () => {
    postEvent("evaluarRespuesta", {input: true, timer, paisInicial, labelpaisInicial, pais2, labelpais2, dato, valorInicial, modo}, evaluarResultado);
    comparacionesHechas++;
});

let modal = document.getElementById("myModal");
let mensajeResultado = document.getElementById("mensajeResultado");
let btnJugar = document.getElementById("btnJugar");
let btnPrincipal = document.getElementById("btnPrincipal");

function mostrarPopUp(puntaje) {
    mensajeResultado.innerText = "¡Perdiste! Tu puntaje es: " + puntaje;
    modal.style.display = "block"; 
}

btnCambiarCategoria.addEventListener("click", cambiarCategoria);

ayudaBtn.addEventListener('click', () => {
  popupAyuda.style.display = "flex";
});

document.querySelector(".cerrar").addEventListener("click", () => {
  popupAyuda.style.display = "none";
});

btnJugar.onclick = function() {
    modal.style.display = "none";
    location.reload();  
}

btnPrincipal.onclick = function() {
    window.location.href = "../home/index.html";  
}

cuentaBtn.addEventListener("click", () => {
  if (usuario === "Sin usuario" || !usuario) {
    window.location.href = "/login";
  } else {
    window.location.href = "/cuenta";
  }
});

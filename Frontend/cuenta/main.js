connect2Server(3001);

// mostrar usuario logueado
let nombreUsuario = document.getElementById("nombreUsuario");
let usuario = sessionStorage.getItem("usuario") || "Sin usuario";
nombreUsuario.textContent = usuario;

// referencias a los contenedores de stats
let statsDiario = document.getElementById("statsDiario");
let statsHL = document.getElementById("statsHL");
let statsBloques = document.getElementById("statsBloques");
let listaDiario = document.getElementById("listaDiario");
let listaMayorMenor = document.getElementById("listaMayorMenor");
let listaBloques = document.getElementById("listaBloques");
let infoDiario;
let infoMayorMenor;
let infoBloques;
let listaObjDiario;
let listaObjMayorMenor;
let listaObjBloques;
let elementosLiDOM = [];

function formatearString(string) {
    const result = string.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

//importar stats para mostrar en pantalla
function mostrarStats(data){
    //guardando las variables
    infoDiario = data.stats.diario;
    infoMayorMenor = data.stats.mayormenor;
    infoBloques = data.stats.bloques;
    
    //armar los elementos de cada lista de stats
    //diario
    let listaObjDiario = Object.entries(infoDiario)
    for (let i = 0; i < listaObjDiario.length; i++) {
    console.log(listaObjDiario)
    if (!((Array.isArray(listaObjDiario[i][1]) && listaObjDiario[i][1].length === 0) ||
        listaObjDiario[i][1] === null || typeof listaObjDiario[i][1] === "object" && !listaObjDiario[i][1].label)){
    let li = document.createElement("li");
    let valor = typeof listaObjDiario[i][1] === "object" && listaObjDiario[i][1].label ? listaObjDiario[i][1].label : listaObjDiario[i][1];
    li.textContent = formatearString(listaObjDiario[i][0]) + ": " + valor;
    listaDiario.appendChild(li);
    }
    }
    
    //mayormenor
    let listaObjMayorMenor = Object.entries(infoMayorMenor)
    for (let i = 0; i < listaObjMayorMenor.length; i++) {
    console.log(listaObjMayorMenor)
    if (!((Array.isArray(listaObjMayorMenor[i][1]) && listaObjMayorMenor[i][1].length === 0) ||
        listaObjMayorMenor[i][1] === null || typeof listaObjMayorMenor[i][1] === "object" && !listaObjMayorMenor[i][1].label)){
    let li = document.createElement("li");
    let valor = typeof listaObjMayorMenor[i][1] === "object" && listaObjMayorMenor[i][1].label ? listaObjMayorMenor[i][1].label : listaObjMayorMenor[i][1];
    li.textContent = formatearString(listaObjMayorMenor[i][0]) + ": " + valor;
    listaMayorMenor.appendChild(li);
    }
    }
    
    //bloques
    let listaObjBloques = Object.entries(infoBloques)
    for (let i = 0; i < listaObjBloques.length; i++) {
    console.log(listaObjBloques)
    if (!((Array.isArray(listaObjBloques[i][1]) && listaObjBloques[i][1].length === 0) ||
        listaObjBloques[i][1] === null || typeof listaObjBloques[i][1] === "object" && !listaObjBloques[i][1].label)){
    let li = document.createElement("li");
    let valor = typeof listaObjBloques[i][1] === "object" && listaObjBloques[i][1].label ? listaObjBloques[i][1].label : listaObjBloques[i][1];
    li.textContent = formatearString(listaObjBloques[i][0]) + ": " + valor;
    listaBloques.appendChild(li);
    }
    }
    
    }
    

postEvent("enviarStatsAlFront",{nombre: usuario}, mostrarStats);
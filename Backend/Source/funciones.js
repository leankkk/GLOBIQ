//Importando datos
import fs, { Stats } from "fs";
let data = JSON.parse(fs.readFileSync("./Datos/factbook_clean.json","utf-8"));
import { listapaises , listadatos , listadias , listalabels, listadatosB, listalabelsB, listalabelsPaises, listaCodigosPaises} from "./listas.js";
import path from "path";
let cuentas = JSON.parse(fs.readFileSync("./Datos/cuentas.json","utf-8"));
let quemados = JSON.parse(fs.readFileSync("./Datos/datos_quemados.json","utf-8"));

//Declarando funciones útiles

export function truedatorandom(){
    return listadatosB[Math.floor(Math.random() * listadatosB.length)]; 
}



export function paisrandom() {
    let numero = Math.round(Math.random() * listapaises.length);
    return listapaises[numero];
    }
   
   
export function paisdiario() {
   let diferencia = (new Date) - (new Date("2025-01-01"));
   diferencia = Math.floor(diferencia / 86400000);
   if (diferencia >= listapaises.length) diferencia -= listapaises.length;
   return listapaises[listadias[diferencia]];  
   }

export function paisdiariofront() {
    let diferencia = (new Date) - (new Date("2025-01-01"));
    diferencia = Math.floor(diferencia / 86400000);
    if (diferencia >= listapaises.length) diferencia -= listapaises.length;
    return {pais:listapaises[listadias[diferencia]],label:listalabelsPaises[listadias[diferencia]]};  
    }
 


export function traerlabel(dato) {
    for (let i = 0; i < listadatosB.length; i++){ 
        if (listadatosB[i] === dato) return listalabelsB[i];   
       }
}

export function traerlabelCodigoPais(pais) {
    for (let i = 0; i < listapaises.length; i++){ 
        if (listapaises[i] === pais) return listaCodigosPaises[i];   
       }
}

export function traerlabelpais(pais) {
    for (let i = 0; i < listapaises.length; i++){ 
        if (listapaises[i] === pais) return listalabelsPaises[i];   
       }
}
   
export function traerlabelvalor(num) {
    if (typeof num !== "number") return undefined;
    if (Number.isInteger(num) && num / 1000 < 1) return String(num);
    const sufijos = ["", "K", "M", "B", "T"];
    let indiceSufijo = 0;

    while (num >= 1000 && indiceSufijo < sufijos.length - 1) {
        num /= 1000;
        indiceSufijo++;
    }

    const partes = num.toFixed(2).split(".");
    const parteEntera = partes[0];
    let parteDecimal = partes[1];

    if (parteDecimal === "00") parteDecimal = "";
    else parteDecimal = "," + parteDecimal;

    return `${parteEntera}${parteDecimal}${sufijos[indiceSufijo]}`;
}



export function traer(pais, dato, label) {
    let datoog = dato;
    dato = dato.split(".");
    
    for (let i = 0; i < dato.length; i++) {
      if (typeof dato[i] === "string" && dato[i].includes("[")) {
        let [nombrelista, indicelista] = dato[i].split("[");
        indicelista = parseInt(indicelista.replace("]", ""), 10);
        dato.splice(i, 1, nombrelista, indicelista);
      }
    }
  
    let actual = data[pais];
    
    for (let i = 0; i < dato.length; i++) {
      if (actual === undefined) break;
      actual = actual[dato[i]];
    }
  
    if (actual && typeof actual === "object") {
      if ("value" in actual) {
        actual = actual.value;
      } else if (Array.isArray(actual) && actual[0]?.value !== undefined) {
        actual = actual[0].value;
      }
    }
  
    if (label === true) {
      return {
        dato: actual,
        label: traerlabel(datoog),
        labelpais: traerlabelpais(pais)
      };   
    }
  
    return actual;
  }
    

    export function datorandom(){
        let dato = truedatorandom();
        let datolista = dato.split(".");
        for (let i = 0; i < listadatosB.length; i++){ 
        if (datolista[datolista.length-1] === "unit" || datolista[datolista.length-1] === "units" || datolista[datolista.length-1] === "note" || datolista[datolista.length-1] === "date" || typeof traer("argentina",dato) === "object" || (typeof traer("argentina",dato) === "string" && traer("argentina",dato).length > 15)) {
            dato = truedatorandom();
            datolista = dato.split(".");
        } else break;   
        }
    return dato;
    }

export function datorandomnum(){
    let dato = truedatorandom();
    let datolista = dato.split(".");
    for (let i = 0; i < listadatosB.length; i++){ 
    if (datolista[datolista.length-1] === "unit" || datolista[datolista.length-1] === "units" || datolista[datolista.length-1] === "note" || datolista[datolista.length-1] === "date" || typeof traer("argentina",dato) !== "number") {
        dato = truedatorandom();
        datolista = dato.split(".");
    } else break;   
    }
return dato;
}

export function contienedato(pais,dato) {
    if (traer(pais,dato) != undefined){
        return true;
    }
    else {
        return false;
    }
}

export function comparar(pais1,pais2,dato){
    if (traer(pais1,dato) > traer(pais2,dato)){
        return true;
    }
    else {
        return false;
    }
}

export function elegirpista(data){
    console.log(data)
    let pais = data.pais;
    let dato = data.dato;
    let valor;
    let resultado = undefined;
    if (data.dato === undefined){
        dato = datorandom();
    }
    if (data.pais === undefined){
        pais = paisdiario();
    }
    console.log("1er paso hecho")

/*for (let i = 0; i < quemados.length; i++){    
if (quemados[i].dato === dato){
dato = datorandom();
i = 0;
}
}*/
for (let i = 0; i < listadatosB.length; i++){
    console.log(i);
    valor = traer(pais,dato);
    console.log(valor)
    if (typeof valor === "number"){
    if (valor === true) valor = "Verdadero";
    if (valor === false) valor = "Falso";
        resultado = {valor:valor,label:traerlabel(dato),pais:pais,labelpais:traerlabelpais(pais),dato:dato};
    break;
} 
else {console.log(dato); dato = datorandom();}
}
console.log(resultado)
return resultado;
}



export function iniciarMayorMenor(data){
let timer = 0;

let paisInicial;
if (data.paisInicial === undefined) paisInicial = paisdiario();
else paisInicial = data.paisInicial;

    let pais2 = paisInicial;
    while (pais2 === paisInicial){
    pais2 = paisrandom();
    }    

let dato = datorandomnum();
while (traer(paisInicial,dato) === undefined) dato = datorandomnum();

let valorInicial = traer(paisInicial,dato);


if (data.timer === undefined) timer = 0;
else data.timer += 1;



return {
    paisInicial: paisInicial, 
    labelpaisInicial: traerlabelpais(paisInicial),
    idPaisInicial: traerlabelCodigoPais(paisInicial),
    pais2: pais2, 
    labelpais2: traerlabelpais(pais2),
    idPais2: traerlabelCodigoPais(pais2),
    dato: dato,
    valorInicial: valorInicial,
    labelvalorInicial: traerlabelvalor(valorInicial),
    label: traerlabel(dato),
    timer: timer
        };
}





/*
let pais2mayor;
let pais2menor;
let victoria;
let input = data.input;



if (comparar(paisInicial,pais2,dato) === true){
    //el de la derecha es mayor
    pais2mayor = true;
    pais2menor = false;
    }
    else {
    //el de izquierda es mayor
    pais2mayor = false;
    pais2menor = true;
    }
if (data.input === pais2mayor) victoria = true;
else if (data.input === pais2menor) victoria = false;

return {paisInicial: paisInicial, labelpaisInicial: traerlabelpais(paisInicial), pais2: pais2, labelpais2: traerlabelpais(pais2), dato: dato, valor: valor,label: traerlabel(dato), victoria:victoria, timer: timer};
}

*/



export function compararMayorMenor(data){
//definir rapido las variables
let timer = data.timer;
if (data.timer === undefined || data.timer === null) timer = 0;
let victoria;
let valorInicial = data.valorInicial;
let paisInicial = data.paisInicial;
//let labelpaisInicial = data.labelpaisInicial;
let pais2 = data.pais2;
//let labelpais2 = data.labelpais2;
let dato = data.dato;
let input = data.input; //si el pais derecho es mayor deberia ser positivo, si menor negativo




//comparación entre los dos paises
victoria = (input === comparar(paisInicial,pais2,dato));

if (victoria === true) {
paisInicial = pais2;
timer++;
if (timer % 5 === 0) dato = datorandomnum();

valorInicial = traer(paisInicial, dato);
if (valorInicial === undefined) {
  paisInicial = paisrandom();
  valorInicial = traer(paisInicial, dato);
}

for (pais2 = paisInicial; pais2 === paisInicial; pais2 = paisrandom());

return {victoria:victoria, timer: timer, paisInicial: paisInicial, idPaisInicial: traerlabelCodigoPais(paisInicial), labelpaisInicial: traerlabelpais(paisInicial),valorInicial: valorInicial, labelvalorInicial: traerlabelvalor(valorInicial), pais2: pais2, labelpais2: traerlabelpais(pais2), idPais2: traerlabelCodigoPais(pais2), dato: dato, label: traerlabel(dato)}
}
else return {victoria: victoria, timer: timer, valorPais2: traer(pais2,dato)}
}

export function iniciarBloques(){
    let listaposibles = [] //poner todos los paises
for (let i = 0; i < listapaises.length; i++){
    listaposibles.push({
pais: listapaises[i],
label: traerlabelpais(listapaises[i]),
codigo: traerlabelCodigoPais(listapaises[i]),
esundefined: (traer(listapaises[i],datorandomnum()) === undefined)
    });
}
    let pais = paisrandom();
    let categorias = enviarCategorias({pais:pais});
    return {pais:pais,labelPaisObjetivo: traerlabelpais(pais),listaposibles:listaposibles,categorias:categorias};
}

export function recibirInputBloques(data){
    /* 
    - fijarse en que rango entra el país (mayor o menor)
    - responder la pregunta
    - poner en descartados todos los que están en el rango opuesto
    - poner en posibles los que conviven en el rango con el pais objetivo
    */
    let input = data.input;
    let victoria = false;
    let paisobjetivo = data.paisobjetivo;
    let intentos = data.intentos;
    let respuestatexto;
    if (intentos === undefined) intentos = 0;
    let listadescartados = [];
    if (data.listadescartados !== undefined){
        listadescartados = data.listadescartados;
    }
    let listaposibles = [];
    if (data.listaposibles !== undefined){
        listaposibles = data.listaposibles;
    }
    let categoria = traerDatoPorLabel(input.categoria);
    console.log(categoria); //FUNCIONA BIEN
    //data = input, pais, intentos, lista restantes
    //input = {valor,comparacion,categoria,categorialabel}
    
    let valorobjetivo = traer(paisobjetivo,categoria);
    console.log(valorobjetivo, paisobjetivo,categoria); //FALLA ESTO

    // Determinar en qué rango está el país objetivo
    let esMayor = valorobjetivo > input.valor;
    let esMenor = valorobjetivo < input.valor;

    for (let i = listaposibles.length - 1; i >= 0; i--){
        let busqueda = traer(listaposibles[i].pais,categoria); 
        console.log(busqueda);
        let packpais = {
            pais: listaposibles[i].pais, // REVISAR ESTO
            label: traerlabelpais(listaposibles[i].pais),
            codigo: traerlabelCodigoPais(listaposibles[i].pais),
            esundefined: (busqueda === undefined)
        }
        
        if (packpais.esundefined) {
    // si no tiene datos, descartarlo directamente
    if (!listadescartados.some(p => p.pais === packpais.pais)) listadescartados.push(packpais);
    listaposibles.splice(i,1);
    i--;
    console.log("El país no tiene datos: "+packpais.label);
    continue;
}
        if (busqueda === undefined) continue;

        // AHORA ESTÁ PUESTO PARA QUE SOLO VAYA SACANDO DE LISTAPOSIIBES, QUE NUNCA SUME
        if ((esMayor && busqueda > input.valor) || (esMenor && busqueda < input.valor) || (!esMayor && !esMenor && busqueda === input.valor)){
            //listaposibles.push(packpais);
            console.log("El país puede ser: "+packpais.label);
        } else {
           if ((!listadescartados.some(p => p.pais === packpais.pais) || listaposibles[i].esundefined)) listadescartados.push(packpais);
           if (listaposibles.some(p => p.pais === packpais.pais)) listaposibles.splice(i,1);
            i--;
            console.log("El país no es: "+packpais.label);
        }
    }
    
    if (listaposibles.length === 1 && listaposibles.some(p => p.pais === paisobjetivo)) victoria = true;
    //armar respuesta
    if ((esMayor && input.comparacion === "Mayor") || (esMenor && input.comparacion === "Menor")) respuestatexto = "Sí";
    else respuestatexto = "No";

    console.log(listaposibles[0],listadescartados[0], listaposibles.length,listadescartados.length)
    return {
        victoria: victoria,
        respuesta: respuestatexto,
        listaposibles: listaposibles,
        listadescartados: listadescartados,
        pais: paisobjetivo,
        intentos: intentos+1,
    };
}

    
export function traerDatoPorLabel(label){
        for (let i = 0; i < listalabelsB.length; i++){ 
            if (listalabelsB[i] === label) return listadatosB[i];   
           }
}


export function enviarCategorias(data){
let opcionescategorias = [];
let dato;
let busqueda;
let pais = data.pais ?? "";
let cantidad = 5;
console.log(data.pais ?? "");
while (opcionescategorias.length < cantidad){
dato = datorandomnum();
busqueda = traer(pais,dato);
if (typeof busqueda === "number" && !opcionescategorias.includes({dato: dato, label: traerlabel(dato)})) opcionescategorias.push({dato: dato, label: traerlabel(dato)})
}
return opcionescategorias;
}


export function cuentaexiste(nombre){
if (cuentas[nombre] != undefined) return true;
else return false;
    }

export function crearcuenta(data){
if (!cuentaexiste(data.nombre)){ 
cuentas[data.nombre] = {
    nombre: data.nombre,
    contraseña: data.contraseña,
    stats: {
        diario: {
            puntaje: null,
            rondasGanadas: 0,
            promedioPuntajes: null,
            listaPuntajes: [],
            intentosHechos: 0
        },
        mayormenor: {
            racha: 0,
            rondasJugadas: 0,
            promedioRachas: null,
            listaRachas: [],
            categoriasAcertadas: [],
            paisesAcertados: [],
            categoriaMasAcertada: {},
            paisMasAcertado: {},
            comparacionesHechas: 0
        },
        bloques: {
            puntaje: null,
            rondasGanadas: null,
            promedioPuntajes: null,
            listaPuntajes: [],
            categoriasPreguntadas: [],
            valoresPreguntados: [],
            listaValoresPreguntados: [],
            valorPromedio: null,
            categoriaMasPreguntada: {},
            preguntasHechas: 0
        }
    }
}
fs.writeFileSync("./Datos/cuentas.json",JSON.stringify(cuentas,null,2))
return {ok:true}
}
else return {ok:false,mensaje:"La cuenta ya existe."}
}

export function revisarlogin(data){
if (data.contraseña === undefined || data.nombre === undefined || cuentas[data.nombre] === undefined) return {login:false};;
if (data.contraseña === cuentas[data.nombre].contraseña) return {login:true};
else return {login:false};
}

export function actualizarstats(data){
cuentas = JSON.parse(fs.readFileSync("./Datos/cuentas.json", "utf-8"));
//if (!cuentas[data.nombre]) cuentas[data.nombre] = {}; 
//if (!cuentas[data.nombre].stats) cuentas[data.nombre].stats = {};
console.log("Cuentas: "+cuentas);
cuentas[data.nombre] = data;
console.log("Nombre: "+data.nombre,", Info editada: ",cuentas[data.nombre]);
console.log(JSON.stringify(data, null, 2))
fs.writeFileSync("./Datos/cuentas.json",JSON.stringify(cuentas,null,2));
} 
    

export function enviarStats(data){
let database = JSON.parse(fs.readFileSync("./Datos/cuentas.json", "utf-8"));
return database[data.nombre];
}

export function cambiarCategoria(data){
let categoriaAEvitar = data.dato;
let categoriaNueva = categoriaAEvitar;
while (categoriaNueva === categoriaAEvitar){
categoriaNueva = datorandomnum();
}
data.dato = categoriaNueva;
data.label = traerlabel(categoriaNueva);
data.valorInicial = traer(data.paisInicial,categoriaNueva);
data.labelvalorInicial = traerlabelvalor(data.valorInicial)
data.idPaisInicial = traerlabelCodigoPais(data.paisInicial);
data.idPais2 = traerlabelCodigoPais(data.pais2);
return data;
}
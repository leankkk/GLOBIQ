//Importando datos
import { coleccionCuentas } from "./db.js";
import fs from "fs";
let data = JSON.parse(fs.readFileSync("./Datos/factbook_clean.json","utf-8"));
import { listapaises, listadatos, listadias, listalabels, listadatosB, listalabelsB, listalabelsPaises, listaCodigosPaises} from "./listas.js";
import path from "path";
let quemados = JSON.parse(fs.readFileSync("./Datos/datos_quemados.json","utf-8"));

// ─── LISTAS DE CATEGORÍAS POR MODO ───────────────────────────────────────────

const categoriasFaciles = [
  "people.population.total",
  "geography.area.total.value",
  "economy.inflation_rate.annual_values[0].value"
];

const categoriasMedias = [
  "people.population.total",
  "geography.area.total.value",
  "economy.inflation_rate.annual_values[0].value",
  "people.median_age.total.value",
  "people.life_expectancy_at_birth.total_population.value",
  "people.birth_rate.births_per_1000_population",
  "people.death_rate.deaths_per_1000_population",
  "people.urbanization.urban_population.value",
  "geography.elevation.highest_point.elevation.value",
  "geography.coastline.value",
  "people.literacy.total_population.value",
  "people.infant_mortality_rate.total.value",
  "government.capital.geographic_coordinates.latitude.degrees",
  "government.capital.geographic_coordinates.longitude.degrees"
];

// Países conocidos para modo fácil del diario
const paisesFaciles = [
  "china", "india", "united_states", "indonesia", "pakistan",
  "brazil", "nigeria", "bangladesh", "russia", "ethiopia",
  "mexico", "japan", "philippines", "egypt", "democratic_republic_of_the_congo",
  "vietnam", "iran", "turkey", "germany", "thailand",
  "united_kingdom", "france", "tanzania", "south_africa", "italy",
  "myanmar", "kenya", "colombia", "spain", "ukraine",
  "argentina", "algeria", "sudan", "iraq", "afghanistan",
  "poland", "canada", "morocco", "saudi_arabia", "uzbekistan",
  "peru", "angola", "malaysia", "ghana", "mozambique",
  "venezuela", "australia", "chile", "netherlands", "portugal"
];

// ─── HELPER: elegir dato según modo ──────────────────────────────────────────

function datorandompormodo(modo) {
  if (modo === "facil") {
    return categoriasFaciles[Math.floor(Math.random() * categoriasFaciles.length)];
  } else if (modo === "medio") {
    return categoriasMedias[Math.floor(Math.random() * categoriasMedias.length)];
  } else {
    return datorandomnum();
  }
}

// ─── FUNCIONES ÚTILES ────────────────────────────────────────────────────────

export function truedatorandom(){
    return listadatosB[Math.floor(Math.random() * listadatosB.length)]; 
}

export function paisrandom() {
    let numero = Math.round(Math.random() * listapaises.length);
    return listapaises[numero];
}

export function paisrandomfacil() {
    return paisesFaciles[Math.floor(Math.random() * paisesFaciles.length)];
}

export function paisdiario() {
   let diferencia = (new Date) - (new Date("2025-01-01"));
   diferencia = Math.floor(diferencia / 86400000);
   diferencia = diferencia % listapaises.length;
   return listapaises[listadias[diferencia]];  
}

export function paisdiariofront() {
    let diferencia = (new Date) - (new Date("2025-01-01"));
    diferencia = Math.floor(diferencia / 86400000);
    diferencia = diferencia % listapaises.length;
    return {pais:listapaises[listadias[diferencia]],label:listalabelsPaises[listadias[diferencia]]};  
}

export function paisdiariofacil() {
    let diferencia = (new Date) - (new Date("2025-01-01"));
    diferencia = Math.floor(diferencia / 86400000);
    diferencia = diferencia % paisesFaciles.length;
    return { pais: paisesFaciles[diferencia], label: traerlabelpais(paisesFaciles[diferencia]) };
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
    return traer(pais,dato) != undefined;
}

export function comparar(pais1,pais2,dato){
    return traer(pais1,dato) > traer(pais2,dato);
}

export function elegirpista(data){
    let pais = data.pais;
    let dato = data.dato;
    let valor;
    let resultado = undefined;
    if (data.dato === undefined) dato = datorandom();
    if (data.pais === undefined) pais = paisdiario();

    for (let i = 0; i < listadatosB.length; i++){
        valor = traer(pais,dato);
        if (typeof valor === "number"){
            if (valor === true) valor = "Verdadero";
            if (valor === false) valor = "Falso";
            resultado = {valor:valor,label:traerlabel(dato),pais:pais,labelpais:traerlabelpais(pais),dato:dato};
            break;
        } 
        else dato = datorandom();
    }
    return resultado;
}

// ─── MAYOR O MENOR ───────────────────────────────────────────────────────────

export function iniciarMayorMenor(data){
    let timer = 0;
    let modo = data.modo ?? "dificil";

    let paisInicial;
    if (data.paisInicial === undefined) paisInicial = paisdiario();
    else paisInicial = data.paisInicial;

    let pais2 = paisInicial;
    while (pais2 === paisInicial) pais2 = paisrandom();

    let dato = datorandompormodo(modo);
    while (traer(paisInicial,dato) === undefined) dato = datorandompormodo(modo);

    let valorInicial = traer(paisInicial,dato);

    if (data.timer === undefined) timer = 0;
    else data.timer += 1;

    return {
        paisInicial, 
        labelpaisInicial: traerlabelpais(paisInicial),
        idPaisInicial: traerlabelCodigoPais(paisInicial),
        pais2, 
        labelpais2: traerlabelpais(pais2),
        idPais2: traerlabelCodigoPais(pais2),
        dato,
        valorInicial,
        labelvalorInicial: traerlabelvalor(valorInicial),
        label: traerlabel(dato),
        timer,
        modo
    };
}

export function compararMayorMenor(data){
    let timer = data.timer;
    if (data.timer === undefined || data.timer === null) timer = 0;
    let modo = data.modo ?? "dificil";
    let victoria;
    let valorInicial = data.valorInicial;
    let paisInicial = data.paisInicial;
    let pais2 = data.pais2;
    let dato = data.dato;
    let input = data.input;

    victoria = (input === comparar(paisInicial,pais2,dato));

    if (victoria === true) {
        paisInicial = pais2;
        timer++;
        if (timer % 5 === 0) dato = datorandompormodo(modo);

        valorInicial = traer(paisInicial, dato);
        if (valorInicial === undefined) {
            paisInicial = paisrandom();
            valorInicial = traer(paisInicial, dato);
        }

        for (pais2 = paisInicial; pais2 === paisInicial; pais2 = paisrandom());

        return {
            victoria, timer,
            paisInicial, idPaisInicial: traerlabelCodigoPais(paisInicial), labelpaisInicial: traerlabelpais(paisInicial),
            valorInicial, labelvalorInicial: traerlabelvalor(valorInicial),
            pais2, labelpais2: traerlabelpais(pais2), idPais2: traerlabelCodigoPais(pais2),
            dato, label: traerlabel(dato), modo
        };
    }
    else return {victoria, timer, valorPais2: traer(pais2,dato), modo};
}

export function cambiarCategoria(data){
    let modo = data.modo ?? "dificil";
    let categoriaAEvitar = data.dato;
    let categoriaNueva = categoriaAEvitar;
    while (categoriaNueva === categoriaAEvitar) categoriaNueva = datorandompormodo(modo);
    data.dato = categoriaNueva;
    data.label = traerlabel(categoriaNueva);
    data.valorInicial = traer(data.paisInicial,categoriaNueva);
    data.labelvalorInicial = traerlabelvalor(data.valorInicial);
    data.idPaisInicial = traerlabelCodigoPais(data.paisInicial);
    data.idPais2 = traerlabelCodigoPais(data.pais2);
    data.labelpais2 = traerlabelpais(data.pais2);
    return data;
}

// ─── BLOQUES ─────────────────────────────────────────────────────────────────

export function iniciarBloques(){
    let listaposibles = [];
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
    return {pais,labelPaisObjetivo: traerlabelpais(pais),listaposibles,categorias};
}

export function recibirInputBloques(data){
    let input = data.input;
    let victoria = false;
    let paisobjetivo = data.paisobjetivo;
    let intentos = data.intentos;
    let respuestatexto;
    if (intentos === undefined) intentos = 0;
    let listadescartados = data.listadescartados ?? [];
    let listaposibles = data.listaposibles ?? [];

    let categoria = traerDatoPorLabel(input.categoria);
    let valorobjetivo = traer(paisobjetivo,categoria);

    let esMayor = valorobjetivo > input.valor;
    let esMenor = valorobjetivo < input.valor;

    for (let i = listaposibles.length - 1; i >= 0; i--){
        let busqueda = traer(listaposibles[i].pais,categoria); 
        let packpais = {
            pais: listaposibles[i].pais,
            label: traerlabelpais(listaposibles[i].pais),
            codigo: traerlabelCodigoPais(listaposibles[i].pais),
            esundefined: (busqueda === undefined)
        };
        
        if (packpais.esundefined) {
            if (!listadescartados.some(p => p.pais === packpais.pais)) listadescartados.push(packpais);
            listaposibles.splice(i,1);
            i--;
            continue;
        }
        if (busqueda === undefined) continue;

        if ((esMayor && busqueda > input.valor) || (esMenor && busqueda < input.valor) || (!esMayor && !esMenor && busqueda === input.valor)){
            // sigue siendo posible
        } else {
            if (!listadescartados.some(p => p.pais === packpais.pais) || listaposibles[i].esundefined) listadescartados.push(packpais);
            if (listaposibles.some(p => p.pais === packpais.pais)) listaposibles.splice(i,1);
            i--;
        }
    }
    
    if (listaposibles.length === 1 && listaposibles.some(p => p.pais === paisobjetivo)) victoria = true;
    if ((esMayor && input.comparacion === "Mayor") || (esMenor && input.comparacion === "Menor")) respuestatexto = "Sí";
    else respuestatexto = "No";

    return { victoria, respuesta: respuestatexto, listaposibles, listadescartados, pais: paisobjetivo, intentos: intentos+1 };
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
    while (opcionescategorias.length < cantidad){
        dato = datorandomnum();
        busqueda = traer(pais,dato);
        if (typeof busqueda === "number" && !opcionescategorias.includes({dato, label: traerlabel(dato)})) {
            opcionescategorias.push({dato, label: traerlabel(dato)});
        }
    }
    return opcionescategorias;
}

// ─── CUENTAS ─────────────────────────────────────────────────────────────────

export async function cuentaexiste(nombre) {
  const col = await coleccionCuentas();
  const cuenta = await col.findOne({ nombre });
  return cuenta != null;
}

export async function crearcuenta(data) {
  if (!(await cuentaexiste(data.nombre))) {
    const col = await coleccionCuentas();
    await col.insertOne({
      nombre: data.nombre,
      contraseña: data.contraseña,
      stats: {
        diario: { puntaje: null, rondasGanadas: 0, promedioPuntajes: null, listaPuntajes: [], intentosHechos: 0, rachaDias: 0, ultimoDiaJugado: null },
        mayormenor: { racha: 0, rondasJugadas: 0, promedioRachas: null, listaRachas: [], categoriasAcertadas: [], paisesAcertados: [], categoriaMasAcertada: {}, paisMasAcertado: {}, comparacionesHechas: 0 },
        bloques: { puntaje: null, rondasGanadas: null, promedioPuntajes: null, listaPuntajes: [], categoriasPreguntadas: [], valoresPreguntados: [], listaValoresPreguntados: [], valorPromedio: null, categoriaMasPreguntada: {}, preguntasHechas: 0 }
      }
    });
    return { ok: true };
  } else {
    return { ok: false, mensaje: "La cuenta ya existe." };
  }
}

export async function revisarlogin(data) {
  if (!data.contraseña || !data.nombre) return { login: false };
  const col = await coleccionCuentas();
  const cuenta = await col.findOne({ nombre: data.nombre });
  if (!cuenta) return { login: false };
  if (data.contraseña === cuenta.contraseña) return { login: true };
  return { login: false };
}

export async function actualizarstats(data) {
  const col = await coleccionCuentas();
  const { _id, ...datasinid } = data;
  await col.replaceOne({ nombre: data.nombre }, datasinid, { upsert: true });
}

export async function enviarStats(data) {
  const col = await coleccionCuentas();
  return await col.findOne({ nombre: data.nombre });
}

// ─── RÉCORDS ─────────────────────────────────────────────────────────────────

export async function crearRecords() {
  const col = await coleccionCuentas();
  const todasLasCuentas = await col.find({}).toArray();
  if (todasLasCuentas.length === 0) return { records: {} };
  let modos = ["diario", "mayormenor", "bloques"];
  let records = {};
  let keys = {};
  for (let a = 0; a < 3; a++) {
    keys[modos[a]] = Object.keys(todasLasCuentas[0].stats[modos[a]]);
    records[modos[a]] = [];
    for (let c = 0; c < keys[modos[a]].length; c++) {
      let nombrecat = keys[modos[a]][c];
      let valormax = 0;
      let holder = "";
      let catapta = true;
      for (let i = 0; i < todasLasCuentas.length && catapta; i++) {
        let nombrecuenta = todasLasCuentas[i].nombre;
        let valor = todasLasCuentas[i].stats[modos[a]][keys[modos[a]][c]];
        if (Array.isArray(valor)) { catapta = false; break; }
        if (valor > valormax && nombrecuenta !== "Sin usuario") { valormax = valor; holder = nombrecuenta; }
      }
      if (!catapta || valormax === 0) continue;
      records[modos[a]].push({ nombre: nombrecat, usuario: holder, valor: valormax });
    }
  }
  return { records };
}

export function actualizarRecords(){}

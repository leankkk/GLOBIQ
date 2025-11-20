import fs from "fs";
//import { subscribeGETEvent, subscribePOSTEvent, startServer } from "soquetic";
import { traer, contienedato, comparar, iniciarBloques, paisrandom, paisdiario, datorandom, cuentaexiste, crearcuenta, revisarlogin, actualizarstats, elegirpista, compararMayorMenor, iniciarMayorMenor, traerlabelvalor, traerlabel, recibirInputBloques, enviarCategorias, datorandomnum, traerDatoPorLabel } from "./Source/funciones.js";
import { listadatos, listapaises, listadias, listalabels, listadatosB, listalabelsB} from "./Source/listas.js";
let data = JSON.parse(fs.readFileSync("./Datos/factbook_clean.json","utf-8"));


let i = 0;
function funciontest(){
let dato = datorandom();
if (contienedato("argentina",dato)){
console.log(traer("argentina",dato,true));
return;
}
else return funciontest();
i++;
}

//console.log(elegirpista({pais:"afghanistan"}))

/*for (i = 0; i < listadatosB.length; i++){
if (!typeof(traer("argentina",listadatosB[i])) === "string" && !Array.isArray(traer("argentina",listadatosB[i])) && traer)
console.log(listalabelsB[i],listadatosB[i],traer("argentina",listadatosB[i]),"\n");*/
console.log(listapaises[17],listapaises[10]);

console.log(traer("argentina",traerDatoPorLabel("Población de 55 a 64 años")),traer("argentina",traerDatoPorLabel("Población de 55 a 64 años en mujeres")));
import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, startServer } from "soquetic";
import { traer, contienedato, comparar, paisrandom, paisdiario, iniciarBloques, cambiarCategoria, paisdiariofront, datorandom, cuentaexiste, crearcuenta, revisarlogin, actualizarstats, elegirpista, iniciarMayorMenor, compararMayorMenor, enviarCategorias, enviarStats, recibirInputBloques} from "./Source/funciones.js";
import { listadatos, listapaises, listadias, listalabels, listalabelsPaises} from "./Source/listas.js";

//PANTALLA 3 (adivinar pais)
subscribeGETEvent("iniciarBloques",iniciarBloques);
subscribePOSTEvent("evaluarRespuestaBloques",recibirInputBloques);

//PANTALLA 4 (higher or lower)
subscribePOSTEvent("iniciarMayorMenor",iniciarMayorMenor);
subscribePOSTEvent("obtenerCategorias",enviarCategorias);
subscribePOSTEvent("evaluarRespuesta",compararMayorMenor);
subscribePOSTEvent("guardarStatsEnElBack",actualizarstats);
subscribePOSTEvent("enviarStatsAlFront",enviarStats);
subscribePOSTEvent("cambiarCategoria",cambiarCategoria);
//subscribeGETEvent("obtenerPaisDiario",paisdiariofront);

//PANTALLA 5 (diario)
subscribeGETEvent("obtenerPaisDiario",paisdiariofront);
subscribePOSTEvent("obtenerPista",elegirpista);
//subscribePOSTEvent("guardarStats",actualizarstats);

//PANTALLA 6 (login)
subscribePOSTEvent("iniciarSesion",revisarlogin);

//PANTALLA 7 (registro)
subscribePOSTEvent("crearCuenta",crearcuenta);


startServer(3001);
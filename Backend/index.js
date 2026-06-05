import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  traer, contienedato, comparar, paisrandom, paisdiario,
  iniciarBloques, cambiarCategoria, paisdiariofront, datorandom,
  cuentaexiste, crearcuenta, revisarlogin, actualizarstats,
  elegirpista, iniciarMayorMenor, compararMayorMenor,
  enviarCategorias, enviarStats, recibirInputBloques,
  crearRecords, recordsFront
} from "./Source/funciones.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

// PANTALLA 3 (juego bloques)
app.get("/iniciarBloques", (req, res) => {
  res.json(iniciarBloques());
});
app.post("/evaluarRespuestaBloques", (req, res) => {
  res.json(recibirInputBloques(req.body));
});

// PANTALLA 4 (higher or lower)
app.post("/iniciarMayorMenor", (req, res) => {
  res.json(iniciarMayorMenor(req.body));
});
app.post("/obtenerCategorias", (req, res) => {
  res.json(enviarCategorias(req.body));
});
app.post("/evaluarRespuesta", (req, res) => {
  res.json(compararMayorMenor(req.body));
});
app.post("/guardarStatsEnElBack", async (req, res) => {
  await actualizarstats(req.body);
  res.json({ ok: true });
});
app.post("/enviarStatsAlFront", async (req, res) => {
  res.json(await enviarStats(req.body));
});
app.post("/cambiarCategoria", (req, res) => {
  res.json(cambiarCategoria(req.body));
});

// PANTALLA 5 (modo diario)
app.get("/obtenerPaisDiario", (req, res) => {
  res.json(paisdiariofront());
});
app.post("/obtenerPista", (req, res) => {
  res.json(elegirpista(req.body));
});

// PANTALLA 6 (login)
app.post("/iniciarSesion", async (req, res) => {
  res.json(await revisarlogin(req.body));
});

// PANTALLA 7 (registro)
app.post("/crearCuenta", async (req, res) => {
  res.json(await crearcuenta(req.body));
});
 
// RÉCORDS
app.get("/enviarRecordsAlFront", async (req, res) => {
  res.json(await crearRecords());
});
// Servir el frontend (VA AL FINAL)
app.use(express.static(path.join(__dirname, "..", "Frontend")));

// Ruta raíz → redirige al home
app.get("/", (req, res) => {
  res.redirect("/home/index.html");
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});

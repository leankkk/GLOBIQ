// connect2Server ya no es necesario, lo maneja rest.js

let botonlogin = document.getElementById("loginBtn");
let placeholderContraseña = document.getElementById("password");
let placeholderUsuario = document.getElementById("usuario");
let botonregistro = document.getElementById("registroBtn");

function togglePassword(id) {
  let input = document.getElementById(id);
  let icono = input.nextElementSibling;
  if (input.type === "password") {
    input.type = "text";
    icono.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/565/565655.png')";
  } else {
    input.type = "password";
    icono.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/159/159604.png')";
  }
}

function realizarinicio(data) {
  if (data.login) {
    sessionStorage.setItem("usuario", placeholderUsuario.value);
    sessionStorage.setItem("mostrarBienvenida", "true");
    window.location.href = "../home/index.html";
  } else {
    alert("Usuario o contraseña incorrectos.");
  }
}

botonlogin.addEventListener("click", () => {
  let usuario = placeholderUsuario.value.trim();
  let contraseña = placeholderContraseña.value.trim();
  if (usuario === "" || contraseña === "") {
    alert("Completa todos los campos.");
    return;
  }
  let infocuenta = { nombre: usuario, contraseña: contraseña };
  postEvent("iniciarSesion", infocuenta, realizarinicio);
});

placeholderContraseña.addEventListener("keydown", (event) => {
  if (event.key === "Enter") botonlogin.click();
});

botonregistro.addEventListener("click", () => {
  window.location.href = "../pantalla 7 (registro)/index.html";
});

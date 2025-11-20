connect2Server(3001);
let botonlogin = document.getElementById("loginBtn"); 
let placeholderContraseña = document.getElementById("password");
let placeholderUsuario = document.getElementById("usuario");
let botonregistro = document.getElementById("registroBtn");
let popup = document.getElementById("popupBienvenida");
let mensaje = document.getElementById("mensajeBienvenida");
let botonAceptar = document.getElementById("btnAceptarPopup");
let input = document.getElementById(id);
let icono = input.nextElementSibling;

function togglePassword(id) {
 

  if (input.type === "password") {
    input.type = "text";
    icono.style.backgroundImage =
      "url('https://cdn-icons-png.flaticon.com/512/565/565655.png')";
  } else {
    input.type = "password";
    icono.style.backgroundImage =
      "url('https://cdn-icons-png.flaticon.com/512/159/159604.png')";
  }
}

function realizarinicio(data) {
    if (data.login) {
        
        sessionStorage.setItem("usuario", placeholderUsuario.value);
        mensaje.textContent = `¡Bienvenido, ${placeholderUsuario.value}!`;
        popup.style.display = "flex";

        botonAceptar.addEventListener("click", () => {
            popup.style.display = "none";
            window.location.href = "../home/index.html";
        });
    } else {
        alert("Usuario o contraseña incorrecto.");
    }
}



botonlogin.addEventListener("click", () => {
    let infocuenta = {
        nombre: placeholderUsuario.value,
        contraseña: placeholderContraseña.value
    };
    console.log("Se activó el botón");
    postEvent("iniciarSesion", infocuenta, realizarinicio);
});

botonregistro.addEventListener("click", () => {
    window.location.href = "../pantalla 7 (registro)/index.html"; 
});

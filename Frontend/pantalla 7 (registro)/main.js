connect2Server(3001);

function togglePassword(id) {
 
let input = document.getElementById(id);
let icono = input.nextElementSibling;
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
document.addEventListener('DOMContentLoaded', () => {
  let contraseña1 = document.getElementById('password');
  let contraseña2 = document.getElementById('password2');
  let botonRegistrar = document.getElementById('loginBtn');
  let usuarioInput = document.getElementById('usuario');
  let popup = document.getElementById('popupBienvenida');
  let mensaje = document.getElementById('mensajeBienvenida');
  let botonAceptar = document.getElementById('btnAceptarPopup');

  if (!botonRegistrar) {
    console.error("No se encontró el botón de registrarse.");
    return;
  }

  botonRegistrar.addEventListener('click', () => {
    console.log("Botón clickeado");

    let password1 = contraseña1.value.trim();
    let password2 = contraseña2.value.trim();
    let usuario = usuarioInput.value.trim();

    if (!usuario || !password1 || !password2) {
      alert("Por favor completá todos los campos.");
      return;
    }

    if (password1 !== password2) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    let data = {
      nombre: usuario,
      contraseña: password1
    };

    postEvent("crearCuenta", data, (respuesta) => {
      if (respuesta.ok) {
        
        sessionStorage.setItem("usuario", usuario);
        mensaje.textContent = `¡Bienvenido, ${usuario}!`;
        popup.style.display = "flex";

        botonAceptar.addEventListener("click", () => {
          popup.style.display = "none";
          window.location.href = "../home/index.html";
        });
      } else {
        alert("Error: " + respuesta.mensaje);
      }
    });
  });
});

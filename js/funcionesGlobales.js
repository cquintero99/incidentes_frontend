/**
 * Actualiza el nombre del usuario en el elemento HTML correspondiente.
 */
try {
  const nombreInicio = document.getElementById("nombreInicio");
  let usuario = JSON.parse(localStorage.getItem("data"));
  nombreInicio.textContent = usuario.nombre + " " + usuario.apellido;
} catch (error) {
  // Manejo de errores (si corresponde)
}

/**
* Agrega un event listener al botón "Salir" para limpiar el almacenamiento local y redireccionar al inicio.
*/
try {
  const btnSalir = document.getElementById("btnSalir");
  btnSalir.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = "../index.html";
  });
} catch (error) {
  // Manejo de errores (si corresponde)
}

/**
* Muestra el spinner de carga en el documento HTML.
*/
function mostrarSpinner() {
  document.getElementById("sppiner").innerHTML = `<div id="spinner-container" class="d-flex justify-content-center align-items-center ">
      <div class="spinner-border text-danger" role="status">
          <span class="sr-only">Cargando...</span>
      </div>
  </div>`;
}

/**
* Oculta el spinner de carga en el documento HTML.
*/
function ocultarSpinner() {
  document.getElementById("sppiner").innerHTML = "";
}

/**
* Función de ejemplo para salir. Puede ser personalizada según las necesidades.
*/
function salir() {
  alert("salir");
}

//CONEXION CON EL BACKEND 
const urlBasic = "https://incidentesbackend-production.up.railway.app"

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
try {
  const token=localStorage.getItem("token")
  if(!token){
    window.location.href = "../index.html";
  }
  
} catch (error) {
  
}


/**
* Muestra el spinner de carga en el documento HTML.
*/
function mostrarSpinner() {
  document.getElementById("sppiner").innerHTML = `<div id="spinner-container" class="d-flex justify-content-center align-items-center ">
      <div class="spinner-border text-primary" role="status">
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

function cargarDatosPerfil(){
  const persona=JSON.parse(localStorage.getItem("data"))
  console.log(persona)
  let fechaR = persona.fechaNacimiento
        const fecha = new Date(fechaR);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = fecha.toLocaleDateString('es-ES', options);
  document.getElementById("nombres").textContent=persona.nombre+" "+persona.apellido
  document.getElementById("cedula").textContent=persona.cedula
  document.getElementById("email").textContent=persona.sub
  document.getElementById("genero").textContent=persona.genero
  document.getElementById("fechaNacimiento").textContent=fechaFormateada
}


async function descargarPDF(id){
  
  let token=localStorage.getItem("token")
    const result=await fetch(urlBasic+"/generar/pdf/"+id,{
      headers:{
        "Authorization":"Bearer "+token
      }
    })
    return result;
  
}
 function generarPDF(){
    mostrarSpinner()
    let id=sessionStorage.getItem("incidenteId")
    descargarPDF(id)
    .then(res=>res.blob())
    .then(blob=>{
      console.log("descarga"+blob)
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'incidente'+id+'.pdf';
      document.body.appendChild(a);
      a.click();
      
    })
    .catch(err=>{
      console.log(err)
      ocultarSpinner()
    })
    .finally(final=>{
      ocultarSpinner()
    })
    

}

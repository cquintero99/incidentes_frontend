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
      sessionStorage.clear();
     // window.location.href = "../index.html";
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

function cargarDescripcion(){
    listaCategoria()
    .then(response=>response.json())
    .then(data=>{
      let body=""
      for (let i = 0; i < data.length; i++) {
        body+=` <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
          <div class="fw-bold  text-primary">${data[i].nombre} </div>
          
          ${data[i].descripcion}
        </div>
        <span class="badge border border-info rounded-pill text-primary">ID :${data[i].id}</span>
      </li>
      `
        
      }
      document.getElementById("listaCategoriasIncidente").innerHTML=body;
    })
    .catch(err=>{
      console.log(err)
    })
    .finally(final=>{

    })
    listaEstados()
    .then(response=>response.json())
    .then(data=>{
      let body2=""
      for (let i = 0; i < data.length; i++) {
        body2+=` <li class="list-group-item d-flex justify-content-center align-items-start">
        <div class="ms-2 me-auto">
          <div class="fw-bold  text-primary">${data[i].nombre} 
          </div>
         
          ${data[i].descripcion}
        </div>
        <span class="badge border border-info rounded-pill text-primary">ID :${data[i].id}</span>
      </li>
      `
        
      }
      document.getElementById("listaEstadosIncidente").innerHTML=body2;
    })
    .catch(err=>{
      console.log(err)
    })
    .finally(final=>{

    })
  }

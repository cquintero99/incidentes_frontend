/**
 * Obtiene la lista de prioridades desde el servidor.
 * @returns {Promise<Response>} Promesa que resuelve con la respuesta de la solicitud.
 */
async function listaPrioridad() {
    let token = localStorage.getItem("token");
    const result = await fetch(urlBasic + "/prioridad", {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token,
            "Content-type": "application/json"
        }
    });
    return result;
}
/**
 * Obtiene la lista de categorías del backend.
 * @returns {Promise} - Promesa que resuelve con la respuesta de la solicitud.
 */
async function listaCategoria() {
    let token = localStorage.getItem("token");
    const result = await fetch(urlBasic + "/categoria/lista", {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token,
            "Content-type": "application/json"
        }
    });
    return result;
}
/**
 * Obtiene la lista de incidentes asociados al usuario actual desde el servidor.
 * @returns {Promise<Response>} Promesa que resuelve con la respuesta de la solicitud.
 */
async function listaIncidentes() {
    let token = localStorage.getItem("token");
    let id = JSON.parse(localStorage.getItem("data")).id;
    const result = await fetch(urlBasic + "/incidente/" + id + "/usuario", {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token,
            "Content-type": "application/json"
        }
    });
    return result;
}
/**
 * Obtiene la lista de estados desde el servidor.
 * @returns {Promise<Response>} Promesa que resuelve con la respuesta de la solicitud.
 */
async function listaEstados() {
    let token = localStorage.getItem("token");
    const result = await fetch(urlBasic + "/estado", {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token,
            "Content-type": "application/json"
        }
    });
    return result;
}
/**
 * Carga las categorías en un elemento select del HTML.
 */
function cargarCategorias() {
    listaCategoria()
        .then(response => response.json())
        .then(categorias => {
            const selectCategoria = document.getElementById('categoria');

            // Agregar opciones al select
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.innerHTML = `${categoria.nombre} `;
                selectCategoria.appendChild(option);
            });
        })
        .catch(err => {
            console.log(err);
        })
        .finally(final => {
            // Código a ejecutar después de cargar las categorías, si es necesario
        });
}
/**
 * Carga las opciones de estados en un elemento select del formulario.
 */
function cargarEstados() {
    listaEstados()
        .then(response => response.json())
        .then(prioridades => {
            // Elemento select
            const selectPrioridad = document.getElementById('estados');

            // Agregar opciones al select
            prioridades.forEach(prioridad => {
                const option = document.createElement('option');
                option.value = prioridad.id;
                option.innerHTML = `${prioridad.nombre} `;
                selectPrioridad.appendChild(option);
            });
        })
        .catch(err => {
            console.log(err);
        })
        .finally(final => {
            // Código a ejecutar después de la carga de las estados
        });
}
/**
 * Carga las opciones de prioridad en un elemento select del formulario.
 */
function cargarPrioridades() {
    listaPrioridad()
        .then(response => response.json())
        .then(prioridades => {
            // Elemento select
            const selectPrioridad = document.getElementById('selectPrioridad');

            // Agregar opciones al select
            prioridades.forEach(prioridad => {
                const option = document.createElement('option');
                option.value = prioridad.id;
                option.innerHTML = `${prioridad.nombre} `;
                selectPrioridad.appendChild(option);
            });
        })
        .catch(err => {
            console.log(err);
        })
        .finally(final => {
            // Código a ejecutar después de la carga de las prioridades
        });
}

/**
 * Muestra la lista de incidentes del usuario en el documento HTML.
 */
function verIncidentes() {
    mostrarSpinner()
    vaciarSelect()
    //Busco la lista de incidentes del usuario
    listaIncidentes()
        .then(response => response.json())
        .then(data => {
            //Guardo la lista de incidentes en la session 
            sessionStorage.setItem("incidentesU", JSON.stringify(data))
            mostrarListadoIncidentes(data)
        })
        .catch(err => {
            console.log(err)
            ocultarSpinner()
        })
        .finally(final => {
            ocultarSpinner()
        })
    //Cargo las categorias en el select filtrar categoria

    cargarCategorias()
    cargarPrioridades()
    cargarEstados()


}
function mostrarListadoIncidentes(data) {
    if (data.length > 0) {
        document.getElementById("noHayIncidentes").innerHTML = ""
    }else{
        
        document.getElementById("noHayIncidentes").innerHTML = `<h1>No hay Reportes</h1>
        <br>
        <p>El usuario no tiene registrado ningun Incidente</p>
        <hr>`

    }

    let body = ""
    //Recorro la lista de incidentes y los muestro del mas reciente al mas antiguo
    for (let i = data.length - 1; i >= 0; i--) {
        //Muestro los datos de cada incidente que el usuario registro
        let nEstado = data[i].estados.length
        let ultimoEstado = data[i].estados[nEstado - 1].nombre
        let fechaR = data[i].fechaRegistro
        const fecha = new Date(fechaR);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = fecha.toLocaleDateString('es-ES', options);
        body += `
        <div class="card mb-4 py-3 border-left-warning">
    <div class="card-body">
    <div class="card-header text-center">
    <h3 class="text-uppercase fw-bold fs-6 ">Título : ${data[i].titulo} </h3>
    </div>
        <div class="card-body">
            <div class="container text-center">
            <div class="row align-items-center">
                    
                    <div class="col-xl-6 ">
                        <h3 class="text-uppercase fw-bold fs-6">Categoría</h3>
                        <p class="fs-6">${data[i].categoriaId.nombre}</p>
                    </div>
                    
                    <div class="col-xl-2 ">
                       
                        <h3 class="text-uppercase fw-bold fs-6 ">Estado </h3>
                        
                        <p class="fs-6">${ultimoEstado}</p>
                    </div>
                   
                    <div class="col-xl-2 ">
                        <h3 class="text-uppercase fw-bold fs-6 ">Prioridad</h3>
                        <p class="fs-6">${data[i].prioridadId.nombre}</p>
                    </div>
                    <div class="col-xl-2">
                        <div class="my-2"></div>
                        <a href="#" class="btn btn-info btn-icon-split" onclick="datosIncidente('${data[i].id}')">
                            <span class="icon text-white-50">
                                <i class="fas fa-info-circle"></i>
                            </span>
                            <span class="text" data-bs-toggle="modal" data-bs-target="#staticBackdrop3">Informacion</span>
                        </a>
                    </div>
                </div>
               
            </div>
            
        </div>
        <div class="card-footer text-center">
            <h3 class="text-uppercase fw-bold fs-6">Fecha Registro ${fechaFormateada}</h3>
                    
             </div>
    </div>
</div>

`

    }
    //agrego la lista el documento html

    document.getElementById("listaIncidentes").innerHTML = body
    
}
/**
 * Carga los datos del incidente seleccionado en el modal.
 * @param {string} id - ID del incidente seleccionado.
 */
function datosIncidente(id) {
    //RESOLVER PARA MOSTRAR CUANDO ES USUARIO Y CUANDO ES ADMIN
   // 
    if(verificarURLAdmin()){
       
    }else{
        datosDelUsuario()
    }
    // Obtengo la lista de incidentes del usuario
    const incidentes = JSON.parse(sessionStorage.getItem('incidentesU'));

    for (let i = 0; i < incidentes.length; i++) {
        // Busco el incidente por ID
        if (incidentes[i].id == id) {
            sessionStorage.setItem("incidenteId",id)
            // Cargo los datos del incidente en el modal
            let fechaI = incidentes[i].fechaIncidente;
            const fecha = new Date(fechaI);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const fechaFormateada = fecha.toLocaleDateString('es-ES', options);

            document.getElementById('categoriaI').textContent = incidentes[i].categoriaId.nombre;
            document.getElementById('prioridad').textContent = incidentes[i].prioridadId.nombre;
            document.getElementById('descripcionCategoria').textContent = incidentes[i].categoriaId.descripcion;
            document.getElementById('tituloI').textContent = incidentes[i].titulo;
            document.getElementById('descripcionI').textContent = incidentes[i].descripcion;
            document.getElementById('lugarI').textContent = incidentes[i].lugar;
            document.getElementById('fechaIncidenteI').textContent = fechaFormateada;

            const estadosIncidente = document.getElementById("estadosIncidente")
            let body = ""
            for (let j = incidentes[i].estados.length - 1; j >= 0; j--) {
                let fechaEstado = incidentes[i].fechaIncidente;
                const fecha = new Date(fechaEstado);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const fechaFormateada = fecha.toLocaleDateString('es-ES', options);
                body += `<li class="timeline-sm-item ">
                <h5 class="mt-0 mb-1 fw-bold">${incidentes[i].estados[j].nombre} </h5>
                        <span class=" ">${fechaFormateada}</span>
                    </li>`

            }
            estadosIncidente.innerHTML = body;
        }
    }

}

/**
 * Muestra los datos del usuario en el documento HTML.
 */
function datosDelUsuario() {
    let usuario = JSON.parse(localStorage.getItem("data"));

    document.getElementById('nombre').textContent = usuario.nombre + " " + usuario.apellido;
    document.getElementById('cedula').textContent = usuario.cedula;
    document.getElementById('email').textContent = usuario.sub;
}
function verificarURLAdmin() {
    var url = window.location.href;
    var partesURL = url.split("/");
    var ruta = partesURL[partesURL.length - 1]; // Obtener la última parte de la URL
   
    if (url.includes("admin")) {
      return true;
    } else {
      return false;
    }
  }
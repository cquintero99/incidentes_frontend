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
 
    //Busco la lista de incidentes del usuario
    listaIncidentes()
        .then(response => response.json())
        .then(data => {
            if(data.length>0){
                document.getElementById("noHayIncidentes").innerHTML=""
            }
            //Guardo la lista de incidentes en la session 
            sessionStorage.setItem("incidentesU", JSON.stringify(data))
            let body = ""
            //Recorro la lista de incidentes y los muestro del mas reciente al mas antiguo
            for (let i = data.length - 1; i >= 0; i--) {
                //Muestro los datos de cada incidente que el usuario registro
                let fechaR = data[i].fechaRegistro
                const fecha = new Date(fechaR);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const fechaFormateada = fecha.toLocaleDateString('es-ES', options);
                body += `<div class="card mb-4 py-3 border-left-warning">
            <div class="card-body">
                <div class="card-body">
                    <div class="container text-center">
                        <div class="row align-items-center">
                           
                            <div class="col-xl">
                                <h3 class="text-uppercase fw-bold fs-6">Título </h3>
                                <p class="fs-6">${data[i].titulo}</p>
                            </div>
                            <div class="col-xl">
                                <h3 class="text-uppercase fw-bold fs-6">Descripcion </h3>
                                <p class="fs-6">${data[i].descripcion}</p>
                            </div>
                            <div class="col-xl">
                                <h3 class="text-uppercase fw-bold fs-6">Prioridad</h3>
                                <p class="fs-6">${data[i].prioridadId.nombre}</p>
                            </div>
                            <div class="col-xl">
                                <h3 class="text-uppercase fw-bold fs-6">Categoría</h3>
                                <p class="fs-6">${data[i].categoriaId.nombre}</p>
                            </div>
                            <div class="col-xl">
                                <h3 class="text-uppercase fw-bold fs-6">Registro</h3>
                                <p class="fs-6">${fechaFormateada}</p>
                            </div>
                            <div class="col-xl">
                                <div class="my-2"></div>
                                <a href="#" class="btn btn-info btn-icon-split" onclick="datosIncidente('${data[i].id}')">
                                    <span class="icon text-white-50">
                                        <i class="fas fa-info-circle"></i>
                                    </span>
                                    <span class="text" data-bs-toggle="modal" data-bs-target="#staticBackdrop3">Detalles</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        `

            }
            //agrego la lista el documento html

            document.getElementById("listaIncidentes").innerHTML = body
        })
        .catch(err => {
            console.log(err)
        })
        .finally(final => {

        })
           //Cargo las categorias en el select filtrar categoria
    
        cargarCategorias()
        cargarPrioridades()


}

/**
 * Carga los datos del incidente seleccionado en el modal.
 * @param {string} id - ID del incidente seleccionado.
 */
function datosIncidente(id) {
    datosDelUsuario();

    // Obtengo la lista de incidentes del usuario
    const incidentes = JSON.parse(sessionStorage.getItem('incidentesU'));

    for (let i = 0; i < incidentes.length; i++) {
        // Busco el incidente por ID
        if (incidentes[i].id == id) {
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

/**
 * Obtiene la lista de estados desde el servidor.
 * @returns {Promise<Response>} Promesa que resuelve con la respuesta de la solicitud.
 */
async function listaIncidentesEstadoActivo() {
    let token = localStorage.getItem("token")

    const result = await fetch(urlBasic + "/estado/activo/incidentes", {
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + token
        }

    })
    return result;
}
/**
 * Obtiene la lista de estados desde el servidor.
 * @returns {Promise<Response>} Promesa que resuelve con la respuesta de la solicitud.
 */
async function saveNewEstadoActivo(incidenteEstado) {
    let token = localStorage.getItem("token")

    const result = await fetch(urlBasic + "/incidente/estado/save", {
        method: 'POST',
        body: JSON.stringify(incidenteEstado),
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + token
        }

    })
    return result;
}
/**
 * Obtiene la lista de estados desde el servidor.
 * @returns {Promise<Response>} Promesa que resuelve con la respuesta de la solicitud.
 */
async function incidenteListaDeEstados(id) {
    let token = localStorage.getItem("token")

    const result = await fetch(urlBasic + "/incidente/estado/" + id + "/lista", {
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + token
        }

    })
    return result;
}
function limpiarFiltroActivos(){
    selectElement.innerHTML=` <option selected>Categoría</option>`
    selectEstados.innerHTML=` <option selected>Estados</option>`
    selectPrioridad.innerHTML=` <option selected>Prioridad</option>`
    verListaIncidentesActivos()
}
function verListaIncidentesActivos() {
    mostrarSpinner()
    listaIncidentesEstadoActivo()
        .then(response => response.json())
        .then(data => {
            const newLista = data.filter(item => item.estados.some(e => e.nombre === "Reportado"));
            //Guardo la lista de incidentes en la session 
            sessionStorage.setItem("incidentesU", JSON.stringify(data))
            mostrarListadoIncidentes(newLista)
        })
        .catch(err => {
            ocultarSpinner()
            console.log(err)
        })
        .finally(final => {
            ocultarSpinner()

        })
    cargarCategorias()
    cargarPrioridades()
    cargarEstados()

}
function actualizarEstado() {

    let incidenteId = sessionStorage.getItem("incidenteId")
    let selectElement = document.getElementById("estadosActivos");
    let selectedOption = selectElement.value;
    let errorElement = document.getElementById("errorMensaje");
    errorElement.textContent = ""
    if (selectedOption != "Estados") {
        Swal.fire({
            title: 'Actualizar Estado?',
            text: "Quieres actualizar el estado del incidente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Actualizar'
        }).then((result) => {
            const incidenteEstado = {
                incidenteId,
                estadoId: selectedOption
            }
            saveNewEstadoActivo(incidenteEstado)
                .then(response => response.json())
                .then(data => {
                    let modalElement = document.getElementById('staticBackdrop3');
                    let modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();
                    if (result.isConfirmed) {
                        Swal.fire(
                            'Actualizado!',
                            'El estado del incidente se actualizo.',
                            'success'
                        )
                    }
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(final => {
                    verListaIncidentesActivos()
                })

        })


    } else {
        errorElement.textContent = "Por favor, seleccione un estado"
    }
}

try {
    const selectEstados = document.getElementById('estados');
    // Obtener referencia al modal
    let modal = document.getElementById('staticBackdrop3');

    // Agregar evento de apertura al modal
    modal.addEventListener('show.bs.modal', function () {
        // Mostrar el mensaje deseado
        estadosIncidentesActivos()
        // Puedes reemplazar "console.log" con cualquier otra función o código para mostrar el mensaje en la forma deseada
    });

    // Obtener el botón de cierre del modal por su clase
    var closeButton = document.querySelector('.btn-close');

    // Agregar un event listener al botón de cierre
    closeButton.addEventListener('click', function () {
        // Aquí puedes agregar el código que deseas ejecutar cuando se cierra el modal


    })

} catch (error) {

}
/**
 * estadosIncidentesActivos - Función que obtiene los estados de incidentes activos y los agrega a un elemento select en el DOM.
 */
function estadosIncidentesActivos() {
    // Vaciar el contenido del elemento select
    let selectEstados=document.getElementById("estadosActivos")
    selectEstados.innerHTML = "";

    // Obtener la lista de estados
    listaEstados()
        .then(response => response.json())
        .then(estados => {
            // Agregar una opción por defecto al elemento select
            const option = document.createElement('option');
            option.innerHTML = "Estados";
            selectEstados.appendChild(option);

            // Obtener el incidenteId de la sesión
            let id = sessionStorage.getItem("incidenteId");

            // Obtener la lista de estados del incidente específico
            incidenteListaDeEstados(id)
                .then(res => res.json())
                .then(data => {
                    // Recorrer la lista de estados disponibles
                    for (let i = 0; i < estados.length; i++) {
                        
                        // Buscar si el estado está registrado en la lista de estados del incidente
                        let estadoId2 = data.find(function (obj) {
                            return obj.estadoId === estados[i].id;
                        });

                        // Verificar si el estado está registrado en el incidente
                        if (estadoId2) {
                            console.log("Estado Registrado");
                            // Realizar alguna acción específica si el estado está registrado en el incidente
                        } else {
                            // Agregar una opción al elemento select con el estado no registrado en el incidente
                            const option = document.createElement('option');
                            option.value = estados[i].id;
                            option.innerHTML = estados[i].nombre;
                            selectEstados.appendChild(option);
                        }
                    }

                    // Procesar los datos de los estados del incidente
                    
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(final => {
                    // Realizar acciones finales después de completar la obtención y procesamiento de datos
                });
        })
        .catch(err => {
            console.log(err);
        })
        .finally(final => {
            // Realizar acciones finales después de completar la obtención de datos de los estados
            // auxEstadosFecha();
        });
}


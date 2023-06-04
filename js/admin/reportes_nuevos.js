/**
 * Obtiene la lista de estados desde el servidor.
 * @returns {Promise<Response>} Promesa que resuelve con la respuesta de la solicitud.
 */
async function sendEvaluarIncidente(evaluar) {
    let token = localStorage.getItem("token")

    const result = await fetch(urlBasic + "/incidente/evaluar", {
        method: 'POST',
        body: JSON.stringify(evaluar),
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
async function listaReportesEstado(idEstado) {
    let token = localStorage.getItem("token")

    const result = await fetch(urlBasic + "/estado/" + idEstado + "/incidentes", {
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
async function listaIncidentesEstadoReportado() {
    let token = localStorage.getItem("token")

    const result = await fetch(urlBasic + "/estado/registrado/incidentes", {
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + token
        }

    })
    return result;
}
/**
 * Carga las opciones de prioridad en un elemento select del formulario.
 */
function cargarPrioridadesEvaluar() {
    listaPrioridad()
        .then(response => response.json())
        .then(prioridades => {
            // Elemento select
            const selectPrioridad = document.getElementById('selectPrioridad');

            // Agregar opciones al select
            prioridades.forEach(prioridad => {
                if (prioridad.nombre != "-") {
                    const option = document.createElement('option');
                    option.value = prioridad.id;
                    option.innerHTML = `${prioridad.nombre} `;
                    selectPrioridad.appendChild(option);
                }

            });
        })
        .catch(err => {
            console.log(err);
        })
        .finally(final => {
            // Código a ejecutar después de la carga de las prioridades
        });
}

function verIncidentesActivos() {
    mostrarSpinner()
    listaIncidentesEstadoReportado()
        .then(response => response.json())
        .then(data => {
            const newLista = data.filter(item => item.estados.some(e => e.nombre === "Reportado"));
            //Guardo la lista de incidentes en la session 
            sessionStorage.setItem("incidentesU", JSON.stringify(data))
            mostrarListadoIncidentes(newLista)
        })
        .catch(err => {
            console.log(err)
            ocultarSpinner()
        })
        .finally(final => {
            ocultarSpinner()

        })
        cargarCategorias()
        cargarPrioridadesEvaluar()
        
}

function evaluarIncidente(estado) {
    let selectElement = document.getElementById("selectPrioridad");
    let selectedOption = selectElement.value;
    let errorElement = document.getElementById("errorMensaje");
    errorElement.textContent = ""
    if (selectedOption !== "Prioridad") {
        // Se ha seleccionado una opción distinta a la opción por defecto
        let incidenteId = sessionStorage.getItem("incidenteId")
        //Creo el Objecto Evaluar Incidente
        const evaluar = {
            incidenteId,
            prioridad: {
                id: selectedOption
            },
            estado: {
                nombre: estado
            }
        }
        console.log(evaluar)
        sendEvaluarIncidente(evaluar)
            .then(res => res.json())
            .then(data => {
                if (data == true) {
                    verIncidentesActivos()
                    //Cerrar modal
                    let modalElement = document.getElementById('staticBackdrop3');
                    let modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();
                    Swal.fire(
                        'Completado',
                        'El incidente se evaluo con exito',
                        'success'
                    )

                } else {

                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(final => {

            })

        // Realizar las acciones correspondientes al aceptar o rechazar el incidente
    } else {
        // No se ha seleccionado ninguna opción
        errorElement.textContent = "Por favor, seleccione una prioridad antes de continuar.";

    }

}

function limpiarFiltrosNuevos(){
    menuFiltroCategoria.textContent="Categoria"
    selectElement.value=""
    menuFiltroFecha.textContent="Fecha"
    fechaFiltro.value=""
    verIncidentesActivos()
}

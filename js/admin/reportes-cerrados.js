/**
 * Obtiene la lista de estados desde el servidor.
 * @returns {Promise<Response>} Promesa que resuelve con la respuesta de la solicitud.
 */
async function listaIncidentesEstadoCerrado() {
    let token = localStorage.getItem("token")

    const result = await fetch(urlBasic + "/estado/cerrado/incidentes", {
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + token
        }

    })
    return result;
}

/**
 * Función para ver los incidentes cerrados.
 * Realiza una serie de acciones para obtener y mostrar los incidentes cerrados.
 */
function verIncidentesCerrados() {
    mostrarSpinner(); // Muestra el spinner de carga

    // Obtiene la lista de incidentes con estado "Cerrado"
    listaIncidentesEstadoCerrado()
        .then(response => response.json())
        .then(data => {
            // Filtra la lista de incidentes para obtener solo los reportados
            const newLista = data.filter(item => item.estados.some(e => e.nombre === "Reportado"));
            
            // Guarda la lista de incidentes en la sesión
            sessionStorage.setItem("incidentesU", JSON.stringify(data));
            
            // Muestra el listado de incidentes filtrado
            mostrarListadoIncidentes(newLista);
        })
        .catch(err => {
            console.log(err);
            ocultarSpinner(); // Oculta el spinner de carga en caso de error
        })
        .finally(final => {
            ocultarSpinner(); // Oculta el spinner de carga al finalizar, tanto si hay éxito como si hay error
        });

    cargarCategorias(); // Carga las categorías
    cargarPrioridades(); // Carga las prioridades
    cargarEstados(); // Carga los estados
}

/**
 * Función para limpiar los filtros de los incidentes cerrados.
 * Restaura los valores de los filtros y vuelve a mostrar los incidentes cerrados.
 */
function limpiarFiltrosCerrados(){
    selectElement.innerHTML = ` <option selected>Categoría</option>`
    selectEstados.innerHTML = ` <option selected>Estados</option>`
    selectPrioridad.innerHTML = ` <option selected>Prioridad</option>`
    fechaFiltro.value=""
    menuFiltroCategoria.textContent="Categoria"
    menuFiltroEstado.textContent="Estado"
    menuFiltroPrioridad.textContent="Prioridad"
    menuFiltroFecha.textContent="Fecha"
    verIncidentesCerrados(); // Vuelve a mostrar los incidentes cerrados
}

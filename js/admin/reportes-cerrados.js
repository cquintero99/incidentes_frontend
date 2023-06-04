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

function verIncidentesCerrados() {
    mostrarSpinner()
    listaIncidentesEstadoCerrado()
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
    cargarPrioridades()
    cargarEstados()

}
function limpiarFiltrosCerrados(){
    menuFiltroCategoria.textContent="Categoria"
    selectElement.value=""
    menuFiltroFecha.textContent="Fecha"
    fechaFiltro.value=""
    verIncidentesCerrados()
}
//Select categoria
const selectElement = document.getElementById("categoria")
//Menu filtro categoria
const menuFiltroCategoria = document.getElementById("menuFiltroCategoria")
//Select prioridad
const selectPrioridad = document.getElementById("selectPrioridad")
//Menu filtro categoria
const menuFiltroPrioridad = document.getElementById("menuFiltroPrioridad")
//Input Fecha Filtro
const fechaFiltro = document.getElementById("fechaFiltro")
//Menu filtro Fecha
const menuFiltroFecha = document.getElementById("menuFiltroFecha")
//Input Fecha Filtro
const selectEstados = document.getElementById("estados")
//Menu filtro Fecha
const menuFiltroEstado = document.getElementById("menuFiltroEstado")

function vaciarSelect() {
    selectElement.innerHTML = ` <option selected>Categoría</option>`
    selectEstados.innerHTML = ` <option selected>Estados</option>`
    selectPrioridad.innerHTML = ` <option selected>Prioridad</option>`
}

//FILTRAR POR CATEGORIA
try {
    // Obtener el elemento select


    // Agregar un listener al evento change
    selectElement.addEventListener('change', function () {

        // Obtener el valor seleccionado
        const valorSeleccionado = selectElement.value;
        const textoSeleccionado = selectElement.options[selectElement.selectedIndex].text;
        const array = JSON.parse(sessionStorage.getItem("incidentesU"))

        const newLista = array.filter(item => item.categoriaId.id == valorSeleccionado);

        menuFiltroCategoria.textContent = textoSeleccionado
        mostrarListadoIncidentes(newLista)
        // Hacer algo con el valor seleccionado

    });
} catch (error) {

}
//FILTRAR POR PRIORIDAD
try {
    // Obtener el elemento select


    // Agregar un listener al evento change
    selectPrioridad.addEventListener('change', function () {

        // Obtener el valor seleccionado
        const valorSeleccionado = selectPrioridad.value;
        const textoSeleccionado = selectPrioridad.options[selectPrioridad.selectedIndex].text;
        const array = JSON.parse(sessionStorage.getItem("incidentesU"))

        const newLista = array.filter(item => item.prioridadId.id == valorSeleccionado);

        menuFiltroPrioridad.textContent = textoSeleccionado
        mostrarListadoIncidentes(newLista)
        // Hacer algo con el valor seleccionado

    });
} catch (error) {

}
//FILTRAR POR ESTADO
try {
    // Obtener el elemento select


    // Agregar un listener al evento change
    selectEstados.addEventListener('change', function () {

        // Obtener el valor seleccionado
        const valorSeleccionado = selectEstados.value;
        const textoSeleccionado = selectEstados.options[selectEstados.selectedIndex].text;
        const array = JSON.parse(sessionStorage.getItem("incidentesU"))
        //console.log(textoSeleccionado)
        const arrayReturn = []
        for (let i = 0; i < array.length; i++) {
            
            if (array[i].estados[array[i].estados.length - 1].nombre == textoSeleccionado) {
                
                arrayReturn.push(array[i])
            }

        }
        menuFiltroEstado.textContent = textoSeleccionado
        mostrarListadoIncidentes(arrayReturn)
        // Hacer algo con el valor seleccionado

    });
} catch (error) {
    console.log(error)
}
//FILTRAR POR ESTADO URL INICIO

//FILTRAR POR FECHA
try {
    // Obtener el elemento select


    // Agregar un listener al evento change
    fechaFiltro.addEventListener('change', function () {

        let fecha = fechaFiltro.value
        const array = JSON.parse(sessionStorage.getItem("incidentesU"))

        const newLista = array.filter(item => item.fechaRegistro.substring(0, 10) == fecha);

        menuFiltroFecha.textContent = fecha
        mostrarListadoIncidentes(newLista)


    });
} catch (error) {

}


/**
 * Función para limpiar los filtros.
 * Restaura los valores de los filtros y vuelve a mostrar todos los incidentes.
 */
function limpiarFiltros() {
    menuFiltroCategoria.textContent = "Categoría";
    menuFiltroEstado.textContent = "Estado";
    menuFiltroPrioridad.textContent = "Prioridad";
    menuFiltroFecha.textContent = "Fecha";
    selectElement.value = "";
    selectPrioridad.value = "";
    fechaFiltro.value = "";
    selectEstados.value = "";
  //  sessionStorage.clear()
    verIncidentes(); // Vuelve a mostrar todos los incidentes
}

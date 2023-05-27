const urlBasic = "http://localhost:8080"

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
 * Guarda un incidente en el backend.
 * @param {object} incidente - Objeto que representa el incidente a guardar.
 * @returns {Promise} - Promesa que resuelve con la respuesta de la solicitud.
 */
async function saveIncidente(incidente) {
    let token = localStorage.getItem("token");
    const result = await fetch(urlBasic + "/incidente/save", {
        method: 'POST',
        body: JSON.stringify(incidente),
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
 * Crea un nuevo reporte de incidente.
 */
function newReporte() {
    // Obtener los valores de los campos
    mostrarSpinner();

    if (validarDatos()) {
        let categoria = document.getElementById('categoria').value;
        let titulo = document.getElementById('titulo').value;
        let descripcion = document.getElementById('descripcion').value;
        let fecha = document.getElementById('fecha').value;
        let lugar = document.getElementById('lugar').value;
        let evidencia = document.getElementById('evidencia').value;
        let usuarioId = JSON.parse(localStorage.getItem("data")).id;

        const reporte = {
            categoriaId: {
                id: categoria
            },
            titulo,
            descripcion,
            usuarioId,
            fechaIncidente: fecha,
            lugar,
            evidencia: ""
        };

        console.log(reporte);

        saveIncidente(reporte)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                Swal.fire(
                    'Reporte Creado!',
                    'El reporte se envió con éxito!',
                    'success'
                );

                // Limpiar los campos después de enviar el reporte
                document.getElementById('categoria').value = "";
                document.getElementById('titulo').value = "";
                document.getElementById('descripcion').value = "";
                document.getElementById('fecha').value = "";
                document.getElementById('lugar').value = "";
                document.getElementById('evidencia').value = "";
            })
            .catch(err => {
                console.log(err);
                ocultarSpinner();
            })
            .finally(final => {
                ocultarSpinner();
            });
    } else {
        ocultarSpinner();
    }
}

/**
 * Valida los datos ingresados en el formulario de reporte.
 * @returns {boolean} True si todos los campos están llenos y válidos, false si hay algún campo vacío o inválido.
 */
function validarDatos() {
    // Obtener los valores de los campos
    // Obtener los valores de los campos
    let categoria = document.getElementById('categoria').value;
    let titulo = document.getElementById('titulo').value;
    let descripcion = document.getElementById('descripcion').value;
    let fecha = document.getElementById('fecha').value;
    let lugar = document.getElementById('lugar').value;
    let evidencia = document.getElementById('evidencia').value;

    // Reiniciar los mensajes de error
    document.getElementById('categoriaError').innerText = "";
    document.getElementById('tituloError').innerText = "";
    document.getElementById('descripcionError').innerText = "";
    document.getElementById('fechaError').innerText = "";
    document.getElementById('lugarError').innerText = "";
    document.getElementById('evidenciaError').innerText = "";

    // Validar si los campos están vacíos
    var error = false;

    if (categoria === "" || categoria === "Seleccione una Categoria") {
        document.getElementById('categoriaError').innerText = "Por favor, seleccione una categoría.";
        error = true;
    }

    if (titulo === "") {
        document.getElementById('tituloError').innerText = "Por favor, ingrese un título.";
        error = true;
    }

    if (descripcion === "") {
        document.getElementById('descripcionError').innerText = "Por favor, ingrese una descripción.";
        error = true;
    }

    if (fecha === "") {
        document.getElementById('fechaError').innerText = "Por favor, ingrese una fecha y hora.";
        error = true;
    }

    if (lugar === "") {
        document.getElementById('lugarError').innerText = "Por favor, ingrese un lugar del incidente.";
        error = true;
    }


    // Si hay algún campo vacío, detener el envío del formulario
    if (error) {
        return false;
    } else {
        return true;
    }

    // Si todos los campos están llenos, enviar el formulario
    document.getElementById('enviarBtn').disabled = true;
    // Aquí puedes agregar tu código para enviar el formulario o mostrar un mensaje de éxito.
}

//URL BACKEND

const btnRegistrarCuenta = document.getElementById("btnRegistrarCuenta")

async function emailRegistrado(usuario) {
    const result = await fetch(urlBasic + "/usuario/email/register", {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers: {
            "Content-type": "application/json"
        }
    })
    return result;
}
async function saveUsuario(usuario) {
    const result = await fetch(urlBasic + "/usuario/save", {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers: {
            "Content-type": "application/json",
            'Access-Control-Allow-Headers': 'Authorization',
            'Cache-Control': 'no-store'
        },
        cache: 'no-store'
    })
    return result
}
async function saveIntentoRegistro(intento) {
    const result = await fetch(urlBasic + "/intento/registro/save", {
        method: 'POST',
        body: JSON.stringify(intento),
        headers: {
            "Content-type": "application/json",
            'Access-Control-Allow-Headers': 'Authorization',
            'Cache-Control': 'no-store'
        },
        cache: 'no-store'
    })
    return result
}
async function sendEmailCodio(usuario) {

    const result = await fetch(urlBasic + "/mail/new", {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers: {
            "Content-type": "application/json",
            'Access-Control-Allow-Headers': 'Authorization',
            'Cache-Control': 'no-store'
        },
        cache: 'no-store'
    })
    return result
}

function registrarCuenta() {
    let nombre = document.getElementById("nombre").value
    let apellido = document.getElementById("apellido").value
    let cedula = document.getElementById("cedula").value
    let selectElement = document.getElementById("genero")
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    var genero = selectedOption.text;
    let fechaNacimiento = document.getElementById("fechaNacimiento").value
    let email = document.getElementById("email").value
    let pass1 = document.getElementById("pass1").value
    let pass2 = document.getElementById("pass2").value



    // Validar campos vacíos
    var errores = false;

    if (nombre === "") {
        document.getElementById("nombreError").textContent = "Por favor, ingresa tu nombre";
        errores = true;
    } else {
        document.getElementById("nombreError").textContent = "";
    }

    if (apellido === "") {
        document.getElementById("apellidoError").textContent = "Por favor, ingresa tu apellido";
        errores = true;
    } else {
        document.getElementById("apellidoError").textContent = "";
    }

    if (cedula === "") {
        document.getElementById("cedulaError").textContent = "Por favor, ingresa tu cedula";
        errores = true;
    } else if (cedula.length < 8 || cedula.length > 10) {
        document.getElementById("cedulaError").textContent = "La cédula debe tener 8 o 10 dígitos";
        errores = true;
    } else {
        document.getElementById("cedulaError").textContent = "";
    }

    if (genero === "Genero") {
        document.getElementById("generoError").textContent = "Por favor, selecciona tu género";
        errores = true;
    } else {
        document.getElementById("generoError").textContent = "";
    }

    if (fechaNacimiento === "") {
        document.getElementById("fechaNacimientoError").textContent = "Por favor, ingresa tu fecha de nacimiento";
        errores = true;
    } else {
        document.getElementById("fechaNacimientoError").textContent = "";
    }


    if (email === "") {
        document.getElementById("emailError").textContent = "Por favor, ingresa tu email";
        errores = true;
    } else if (!validarEmail(email)) {
        document.getElementById("emailError").textContent = "Por favor, ingresa un email válido";
        errores = true;
    } else {
        document.getElementById("emailError").textContent = "";
    }
    if (pass1 === "") {
        document.getElementById("pass1Error").textContent = "Por favor, ingresa tu contraseña";
        errores = true;
    } else {
        document.getElementById("pass1Error").textContent = "";
    }

    if (pass2 === "") {
        document.getElementById("pass2Error").textContent = "Por favor, repite tu contraseña";
        errores = true;
    } else if (pass1 !== pass2) {
        document.getElementById("pass2Error").textContent = "Las contraseñas no coinciden";
        errores = true;
    } else {
        document.getElementById("pass2Error").textContent = "";
    }

    // Si no hay errores, continuar con el registro
    if (!errores && validarContraseña()) {


        const usuario = {
            nombre,
            apellido,
            cedula,
            fechaNacimiento,
            genero,
            email,
            pass1
        }
        emailRegistrado(usuario)
            .then(response => response.json())
            .then(data => {
                if (data == false) {
                    localStorage.setItem("newUsuario", JSON.stringify(usuario))

                    enviarCodigoEmail(usuario)
                } else {
                    document.getElementById("alert").innerHTML = `<div class="alert alert-danger" role="alert">
                    Email ya esta registrado
                 </div>`;
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(final => {

            })

    }
    //console.log(usuario)
}

function validarContraseña() {
    const pass1 = document.getElementById("pass1").value;
    const pass2 = document.getElementById("pass2").value;
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

    if (pass1 !== pass2) {
        // Las contraseñas no son iguales
        document.getElementById("pass1Error").textContent = "Las contraseñas no coinciden.";
        return false;
    }

    if (!regex.test(pass1)) {
        // La contraseña no cumple con los requisitos
        document.getElementById("pass1Error").textContent = "La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un carácter especial.";
        return false;
    }

    // La contraseña es válida
    return true;
}
const formRegister = document.getElementById("formRegister")
function enviarCodigoEmail(usuario) {
    mostrarSpinner()
    sendEmailCodio(usuario)
        .then(response => response.json())
        .then(data => {
            formCodigo()
        })
        .catch(err => {
            console.log(err)
            ocultarSpinner()
            alert(err)
        })
        .finally(final => {
            ocultarSpinner()
        })

}
function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    const fieldType = field.getAttribute('type');

    if (fieldType === 'password') {
        field.setAttribute('type', 'text');
    } else {
        field.setAttribute('type', 'password');
    }
}

function formCodigo() {
    let email = JSON.parse(localStorage.getItem("newUsuario")).email
    formRegister.innerHTML = `
<div class="form-group row">
    <div class="col-sm-12 mb-3 mb-sm-0">
    <label class="rounded-pill mt-3" for="">Se envio un codigo de 6 digitos a tu email : ${email}</label>
    <hr>
        <label class="rounded-pill mt-3" for="">Ingresa el Codigo</label>
    </div>

    <div id="numeroIntentos">
    </div>
    <div class="col-sm-12">
        <input type="number" class="form-control form-control-user"  id="codigo"
            placeholder="Codigo">
        <small id="codigoIntento" class="form-text text-danger"></small>
    </div>
</div>


<a href="#" onclick="validarCodigo()" id="validarBtn" class="btn btn-primary btn-user btn-block">
    Validar Codigo
</a>
<hr>`

}

var n = 0;

function validarCodigo() {
    mostrarSpinner()
    //alert("validar codigo")
    const numeroIntentos = document.getElementById("numeroIntentos")
    let codigo = document.getElementById("codigo").value
    let email = JSON.parse(localStorage.getItem("newUsuario")).email
    const codigoIntento = document.getElementById("codigoIntento")
    if (codigo.length >= 5) {
        n++;
        const intento = {
            codigo
            , email
        }
        try {


            if (n <= 3) {

                numeroIntentos.innerHTML = `<div class="alert alert-primary" role="alert">
             Numero Intento ${n}
           </div>`
           saveIntentoRegistro(intento)
           .then(res => res.json())
           .then(data => {
               console.log(data)
               if (data == true) {
                   registrarUsuario()

               } else {
                   codigoIntento.textContent = "Codigo Incorrecto"
               }
           })
           .catch(err => {
               ocultarSpinner()
               alert(err)
           })
           .finally(final => {
               ocultarSpinner()

           })

            }

            if (n == 3) {
                document.getElementById("validarBtn").remove()
                sessionStorage.clear()
            }

        } catch (error) {
            alert("err")

        }

        

    } else {
        ocultarSpinner()
    }

}
function registrarUsuario() {
    mostrarSpinner()
    const newUsuario = JSON.parse(localStorage.getItem("newUsuario"))
    const usuario = {
        nombre: newUsuario.nombre,

        apellido: newUsuario.apellido,
        cedula: newUsuario.cedula,
        fechaNacimiento: newUsuario.fechaNacimiento,
        email: newUsuario.email,
        genero: newUsuario.genero,
        password: newUsuario.pass1,
    }

    saveUsuario(usuario)
        .then(res => res.json())
        .then(data => {
            localStorage.clear()
            sessionStorage.clear()
            document.getElementById("formRegister").innerHTML = `<h3>CUENTA REGISTRADA</h3>`

            Swal.fire({
                icon: 'success',
                title: 'USUARIO REGISTRADO',
                text: 'Felicidades ya puedes iniciar sesion!',
                footer: '<a href="">DAFACI.com</a>'
            })
            Swal.fire({
                title: 'USUARIO REGISTRADO',
                text: "Felicidades ya puedes ingresar!",
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Iniciar Sesion!'
            }).then((result) => {
                if (result.isConfirmed) {
                    entrarLogin(usuario)
                }
            })


        })
        .catch(err => {
            ocultarSpinner()
            alert(err)

        })
        .finally(final => {
            ocultarSpinner()
        })

}

function validarEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
function mostrarSpinner() {
    document.getElementById("sppiner").innerHTML = `<div id="spinner-container" class="d-flex justify-content-center align-items-center ">
      <div class="spinner-border text-danger" role="status">
        <span class="sr-only">Cargando...</span>
      </div>
    </div>`
}

function ocultarSpinner() {
    document.getElementById("sppiner").innerHTML = ""
}
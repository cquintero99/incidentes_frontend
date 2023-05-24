//URL BACKEND
const urlBassic = "http://localhost:8080"

const btnRegistrarCuenta = document.getElementById("btnRegistrarCuenta")
async function emailRegistrado(usuario){
    const result=await fetch(urlBassic+"/usuario/email/register",{
        method:'POST',
        body:JSON.stringify(usuario),
        headers:{
            "Content-type":"application/json"
        }
    })
    return result;
}
async function sendEmailCodio(usuario) {
   
    const result = await fetch(urlBassic + "/mail/new", {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers:{
            "Content-type":"application/json",
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
    } else if (cedula.length !== 8) {
        document.getElementById("cedulaError").textContent = "La cédula debe tener 8 o mas dígitos";
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
    if (!errores) {

        const usuario = {
            nombre,
            apellido,
            cedula,
            fechaNacimiento,
            genero,
            email,
            pass1,
            pass2
        }
        emailRegistrado(usuario)
            .then(response => response.json())
            .then(data => {
                if (data == false) {
                    localStorage.setItem("newUsuario", JSON.stringify(usuario))

                    enviarCodigoEmail(usuario)
                }else{
                    document.getElementById("alert") = `<div class="alert alert-danger" role="alert">
                    Email ya esta registrado
                 </div>`;
                }
            })
            .catch(err => {

            })
            .finally(final => {

            })

    }
    //console.log(usuario)
}
const formRegister = document.getElementById("formRegister")
function enviarCodigoEmail(usuario) {
    sendEmailCodio(usuario)
    .then(response=>response.json())
    .then(data=>{
        console.log(data)
        formCodigo()
    })
    .catch(err=>{

    })
    .finally(final=>{

    })
    
}
function formCodigo() {
    formRegister.innerHTML = `
<div class="form-group row">
    <div class="col-sm-6 mb-3 mb-sm-0">
        <label class="rounded-pill mt-3" for="">Ingresa el Codigo</label>
    </div>
    <div class="col-sm-6">
        <input type="number" class="form-control form-control-user"  id="codigo"
            placeholder="Codigo">
        <small id="fechaNacimientoError" class="form-text text-danger"></small>
    </div>
</div>


<a href="#" onclick="validarCodigo()" id="" class="btn btn-primary btn-user btn-block">
    Validar Codigo
</a>
<hr>`

}

function validarCodigo() {
    alert("validar codigo")
}
function validarEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
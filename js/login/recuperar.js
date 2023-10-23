const btnR = document.getElementById("btnR")

async function enviarEmailRecuperarPassword(usuario) {
    const result = await fetch(urlBasic + "/mail/cambio", {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers: {
            "Content-type": "application/json",
            'Access-Control-Allow-Headers': 'Authorization',
            'Cache-Control': 'no-store'
        },
        cache: 'no-store'
    })
    return result;
}
async function enviarIntentoRecuperarPassword(usuario) {
    const result = await fetch(urlBasic + "/intento/password/recuperar", {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers: {
            "Content-type": "application/json",
            'Access-Control-Allow-Headers': 'Authorization',
            'Cache-Control': 'no-store'
        },
        cache: 'no-store'
    })
    return result;
}
async function usuarioUpdatePassword(usuario) {
    const result = await fetch(urlBasic + "/usuario/update/password", {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers: {
            "Content-type": "application/json",
            'Access-Control-Allow-Headers': 'Authorization',
            'Cache-Control': 'no-store'
        },
        cache: 'no-store'
    })
    return result;
}

function btnRE() {
    mostrarSpinner()
    let email = document.getElementById("exampleInputEmail").value


    if (validateEmail()) {
        const usuario = {
            email: email
        }
        emailRegistrado(usuario)
            .then(res => res.json())
            .then(data => {
                if (data == true) {

                    mostrarSpinner()
                    enviarEmailRecuperarPassword(usuario)
                        .then(res => res.json())
                        .then(codigo => {
                            if (codigo == true) {
                                // Obtén el elemento input por su ID
                                let inputElement = document.getElementById('exampleInputEmail');

                                // Bloquea el input
                                inputElement.disabled = true;
                                sessionStorage.setItem("email", email)
                                Swal.fire({
                                    icon: 'success',
                                    title: 'CODIGO ENVIADO',
                                    text: 'Se envio un codigo de 6 digitos a tu email: ' + usuario.email + '  tienes 3 intentos o el codigo se vencera',

                                })
                                document.getElementById("bodyCodigo").innerHTML = `<label for="exampleFormControlInput1" class="form-label">Codigo</label>
                            <input type="number" class="form-control " id="inputCodigo"
                                aria-describedby="emailHelp" >
        
        
                            <span id="codigoError" style="color: blue;">Ingresa el codigo que fue enviado al email</span>`
                                document.getElementById("btnCodigo").innerHTML = ` <a href="#" class="btn btn-primary btn-user btn-block" id="validarBtn" onclick="validarCodigo()">
                            Validar Codigo
                          </a>`

                            } else {
                                ocultarSpinner()

                            }

                        })
                        .catch(err => {
                            console.log(err)
                            ocultarSpinner()

                        })
                        .finally(final => {
                            ocultarSpinner()
                        })

                } else {
                    ocultarSpinner()
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Email no esta registrado!',
                    })
                }
            })
            .catch(err => {
                console.log(err)
                ocultarSpinner()
            })
            .finally(final => {
            })
    } else {
        ocultarSpinner()
    }

}
var n=0;
function validarCodigo() {

    mostrarSpinner()
    
    const codigo = document.getElementById("inputCodigo").value
    const codigoError = document.getElementById("codigoError")
    const expresionRegular = /^\d{6}$/;

    if (expresionRegular.test(codigo)) {
        try {
            n++
            
            
            console.log(n)
            if (Number(n) <= 3) {
    
                numeroIntentos.innerHTML = `<div class="alert alert-primary" role="alert">
                 Numero Intento ${n}
               </div>`
               let email = sessionStorage.getItem("email")
               const intento = {
                   email,
                   codigo
               }
               enviarIntentoRecuperarPassword(intento)
                   .then(response => response.json())
                   .then(data => {
                       //console.log(data)
                       localStorage.setItem("intentoPassword", JSON.stringify(data))
                       if (data.aprobado == true) {
                           codigoError.textContent = "Codigo Incorrecto."
                           Swal.fire({
                               icon: 'success',
                               title: 'Usuario Verificado',
                               text: 'Codigo Correcto!'
                           })
                           document.getElementById("bodyCodigo").innerHTML = `
                       <label for="exampleFormControlInput1" class="form-label">Contraseña nueva</label>
                       <input type="password" class="form-control " id="pass1"  aria-describedby="emailHelp" >
                       <span id="pass1Error" style="color: red;"></span>
       
                       <label for="exampleFormControlInput1" class="form-label">Repetir Contraseña</label>
                       <input type="password" class="form-control " id="pass2"  aria-describedby="emailHelp" >
                       <span id="pass2Error" style="color: red;"></span>`
                           document.getElementById("btnCodigo").innerHTML = ` <a href="#" class="btn btn-primary btn-user btn-block" id="validarBtn" onclick="cambiarContraseña()">
                       Cambiar Contraseña
                     </a>`
                       } else {
                           codigoError.textContent = "Codigo Incorrecto."
                           Swal.fire({
                               icon: 'error',
                               title: 'Oops...',
                               text: 'Codigo Incorrecto!'
                           })
                       }
                   })
                   .catch(err => {
                       ocultarSpinner(
                           console.log(err)
                       )
                   })
                   .finally(final => {
                       ocultarSpinner()
                   })
                
                // if(n==3){
                //     document.getElementById("validarBtn").remove()
                // sessionStorage.clear()
                // }
            } 
             if (n === 3) {
                n=0;
                document.getElementById("validarBtn").remove()
                sessionStorage.clear()
            }
    
        } catch (error) {
            console.log("err")
    
        }

       
    } else {
        ocultarSpinner()
        // El valor no tiene 6 dígitos
        codigoError.textContent = "El codigo no es válido. Debe contener 6 dígitos."
        console.log("El valor no es válido. Debe contener 6 dígitos.");
    }
}

function cambiarContraseña() {
    mostrarSpinner()
    const pass1 = document.getElementById("pass1").value;
    const pass2 = document.getElementById("pass2").value;
    if (validarContraseña()) {
        let intento = JSON.parse(localStorage.getItem("intentoPassword")).intentoPassword.id
        let email = sessionStorage.getItem("email")
        const usuarioUpdatePass = {

            intentoId: intento,
            usuario: {
                email,
                password: pass1
            }

        }
        console.log(usuarioUpdatePass)
        usuarioUpdatePassword(usuarioUpdatePass)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data == true) {
                    formularioR.innerHTML = `<h3>La Contraseña se Actualizo con exito</h3>`
                    Swal.fire({
                        icon: 'success',
                        title: 'COMPLETADO',
                        text: 'Se actualiazo la contraseña!'
                    })

                } else {
                    ocultarSpinner()
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'intenta de nuevo!'
                    })
                }
            })
            .catch(err => {
                ocultarSpinner()
                console.log(err)
            })
            .finally(final => {
                ocultarSpinner()
            })

    } else {
        ocultarSpinner()
    }

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
window.addEventListener("beforeunload", function () {
    sessionStorage.clear();
    localStorage.clear()
});
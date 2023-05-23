//URL BACKEND
const urlBassic="http://localhost:8080"
//
//ALERT LOGIN
const alertLogin=document.getElementById("alertLogin")
//ALERT INPUT EMAIL
const  emailError = document.getElementById("emailError");
//ALERT INPUT PASSWORD
const passwordError = document.getElementById("passwordError"); 

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

async function iniciarSecion(usuario){
    const result=await fetch(urlBassic+"/user/login",{
        method:'POST',
        body:JSON.stringify(usuario),
        headers:{
            "Content-type":"application/json",
            'Access-Control-Allow-Headers': 'Authorization',
            'Cache-Control': 'no-store'
          },
          cache: 'no-store'
    })
    return result;
}
function login(){
    mostrarSpinner()
    //LIMPIO LAS ALERT
    alertLogin.innerHTML=""
    emailError.innerHTML=""
    passwordError.innerHTML=""
    //Obtengo email
    let email=document.getElementById("exampleInputEmail").value
    //Obtengo la contraseña
    let password=document.getElementById("exampleInputPassword").value
    //Creo el objeto usuario
    const user={
        email,
        password
    }
    // se valida el emial
    if (validateEmail()) {
        //Se valida la contraseña
        if(password===""){
            passwordError.textContent = "Por favor, ingrese su correo contraseña.";
            ocultarSpinner()
        }else{
            emailRegistrado(user)
            .then(response=>response.json())
            .then(data=>{
                console.log(data)
                if(data==true){
                    iniciarSecion(user)
                    .then(res=>res)
                    .then(JWT=>{
                        console.log(JWT)
                        if (JWT.status === 200 && JWT.headers.has('Authorization')) {
                            const bearerToken = JWT.headers.get('Authorization');
                            const token = bearerToken.replace('Bearer ', '');
                    
                            
                    
                    
                            localStorage.setItem('token', token);
                            localStorage.setItem("data", JSON.stringify(parseJwt(token)))
                    
                           cargarModuloRol()
                    
                          } else {
                            //ocultarSpinner()
                            body = `<div class="alert alert-danger" role="alert">
                             Contraseña  incorrecta
                          </div>`;
                            alertLogin.innerHTML = body;
                    
                            setTimeout(() => {
                              alertLogin.innerHTML = "";
                            }, 5000);
                          }
                    })
                    .catch(err=>{

                    })
                    .finally(final=>{
                        ocultarSpinner()
                    })

                }else{
                    alertLogin.innerHTML=`<div class="alert alert-warning" role="alert">
                    <a href="#" class="alert-link">Email no registrado</a>
                  </div>`
                  ocultarSpinner()
                }
            })
            .catch(err=>{
                console.log(err)
            })
            .finally(final=>{
                
            })
    
        }

    }else{
        if(password===""){
            passwordError.textContent = "Por favor, ingrese su  contraseña.";
        }
        ocultarSpinner()
    }
   
   
}

//validar email
function validateEmail() {
    //obtengo el valor del email
    let emailInput = document.getElementById("exampleInputEmail");
    
    let email = emailInput.value.trim();

    if (email === "") {
        emailError.textContent = "Por favor, ingrese su correo electrónico.";
        return false;
    }

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        emailError.textContent = "Por favor, ingrese un correo electrónico válido.";
        return false;
    }

    emailError.textContent = ""; // Borrar el mensaje de error si el correo es válido
    return true;
}
function cargarModuloRol() {

    const roles = JSON.parse(localStorage.getItem("data")).roles
    const admin = false
    
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].nombre == "ROLE_ADMIN") {
        window.location.href = "./admin/index.html";
        admin = true
  
      } else if (roles[i].nombre == "ROLE_USER" && admin === false) {
        window.location.href = "./cuenta/usuario.html";
      }
    }
  
  
  
  }
  
  
  
  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
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
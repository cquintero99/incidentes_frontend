const btnR=document.getElementById("btnR")

function btnRE(){
    
    try {
       let  n=sessionStorage.getItem("num")
        console.log(n)
        if(n==null){
            sessionStorage.setItem("num",1)

        }else{
            if(n<3){
                sessionStorage.setItem("num",Number(n)+1)
            }else{
                sessionStorage.clear()
            }
        }
    } catch (error) {
        alert("err")
        
    }
}
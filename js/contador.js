// Contador de visitas
document.addEventListener('DOMContentLoaded', () =>{
    
    let contadorVisitas = document.getElementById('cuentavisitas') 
    
    if(localStorage){
        if(localStorage['visitas'] == undefined){
            localStorage['visitas'] = 0
        }
    
        let n = parseInt(localStorage['visitas'])
        
        localStorage['visitas'] = 1 + n
        
        let contador = localStorage['visitas']
    
        let mensaje = contador
    
        contadorVisitas.innerText = mensaje
    }
})
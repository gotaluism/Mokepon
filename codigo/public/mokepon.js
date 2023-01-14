const seccionSelectAtaque=document.getElementById("seleccionar_ataque");
const reinicio=document.getElementById("boton_reiniciar");
const botonMascotaJugador=document.getElementById("boton_mascotas")

const mascotaAmigo=document.getElementById("mascotaJugador");

const mascotaEnemigo=document.getElementById("mascotaEnemigo");
const seccionSelectMascota=document.getElementById("seleccionar_mascota");

const seccionMensAmigo=document.getElementById("ataques-jugador");
const seccionMensEnemigo=document.getElementById("ataques-enemigo");

const amigo=document.getElementById("vidas-jugador");
const enemigo=document.getElementById("vidas-enemigo");

const mensajeDef=document.getElementById("gano-perdio") ;

const contenedorTargetas=document.getElementById("mokepones");

const botones_ataque = document.getElementById("ataques");

const mapaSecciones = document.getElementById("ver-mapa");
const mapaCanva=document.getElementById("mapa");


let mokepones=[];
let mokeponesEnemigos=[]
let botones=[];
let ataqueJugador=[];
let ataqueEnemigoo=[];
let secAtaqueEnemigo=[];
let ataqueEnemigo;
let ataqueAmigo;    
let ataqueConjunto;
let vidasAmigo=0;
let vidasEnemigo=0;
let mascotaJugador;
let mascotaEnemigoo;
let opcionDeMokepones;
let opcionDeAtaques;
let contadorAtaque=4;
let jugadorId=null
let enemigoId=null
let ataqueEnemigo1
let ataqueAmigo1


let seleccionAmigoFuego;
let seleccionAmigoAgua;
let seleccionAmigoTierra;

let input1;
let input2;
let input3;

let lienzo=mapaCanva.getContext("2d");
let intervalo;
let intervalito;
let mapaBackground= new Image()
mapaBackground.src="./mokemap.png"

let miMokepon

let alturaQueBuscamos
let anchoDelMapa=window.innerWidth-20

const anchoMaxMapa=350

if (anchoDelMapa>anchoMaxMapa){
    anchoDelMapa=anchoMaxMapa-20 
}

alturaQueBuscamos=(anchoDelMapa * 600) / 800 

mapaCanva.width =anchoDelMapa
mapaCanva.height=alturaQueBuscamos




class Mokepon{
    constructor(nombre,foto,vida,fotoMapa, id=null){
        this.id = id
        this.nombre=nombre;
        this.foto=foto;
        this.vida=vida;
        this.ataques=[];
        this.ancho=40;
        this.alto=40;
        this.x=Math.floor(Math.random()* mapaCanva.width)-this.ancho;
        this.y=Math.floor(Math.random()* mapaCanva.height)-this.alto;   
        this.mapaFoto=new Image();
        this.mapaFoto.src=fotoMapa
        this.velocidadX=0;
        this.velocidadY=0;
    }
    pintarMokepon(){
        lienzo.drawImage(this.mapaFoto, this.x, this.y, this.ancho, this.alto)
    }
}       

let ratigueya= new Mokepon("Ratigueya","./mokepons_mokepon_ratigueya_attack.jpg",5,"./ratigueya.jpg");
let hipodoge = new Mokepon("Hipodoge","./mokepons_mokepon_hipodoge_attack.jpg",5,"./hipodoge.jpg");
let capipepo= new Mokepon("Capipepo","./mokepons_mokepon_capipepo_attack.jpg",5,"./capipepo.jpg");



hipodoge.ataques.push(
{nombre:'🧊',id:'boton_agua'},
{nombre:'🧊',id:'boton_agua'},
{nombre:'🧊',id:'boton_agua'},
{nombre:'🔥',id:'boton_fuego'},
{nombre:'🌱',id:'boton_tierra'})

capipepo.ataques.push(
    {nombre:'🧊',id:'boton_agua'},
    {nombre:'🔥',id:'boton_fuego'},
    {nombre:'🌱',id:'boton_tierra'},
    {nombre:'🌱',id:'boton_tierra'},
    {nombre:'🌱',id:'boton_tierra'})

ratigueya.ataques.push(
    {nombre:'🧊',id:'boton_agua'},
    {nombre:'🔥',id:'boton_fuego'},
    {nombre:'🔥',id:'boton_fuego'},
    {nombre:'🔥',id:'boton_fuego'},
    {nombre:'🌱',id:'boton_tierra'})

mokepones.push(hipodoge,capipepo,ratigueya);


function iniciarJuego(){    
    seccionSelectAtaque.style.display="none";
    mapaSecciones.style.display="none"; 

    mokepones.forEach((mokepon)=>{
        opcionDeMokepones=`                <input type="radio" name="mascota" id=${mokepon.nombre} />
        <label class="cuadro-mokepones" for=${mokepon.nombre}>
            <p>${mokepon.nombre}</p>
            <img src=${mokepon.foto}>
        </label>`   

        contenedorTargetas.innerHTML+=opcionDeMokepones;
        input1=document.getElementById("Hipodoge");
        input2=document.getElementById("Capipepo");
        input3=document.getElementById("Ratigueya");
    })
    
    reinicio.style.display="none";
    botonMascotaJugador.addEventListener("click",selecionarMascota);
    reinicio.addEventListener("click",reiniciar);

    unirseAlJuego()
}

function unirseAlJuego(){


    fetch("http://192.168.1.4:8080/unirse" ,{
        method: "GET"
    })
        .then(function (res) {
            //console.log(respuesta)
            if (res.ok){  //Aqui se pregunta asi todo salió bien
                res.text()      //Ent trae el texto, pero ese texto para imprimirlo 
                    .then(function (respuestica){//se hace pues lo mismo que el anterior del .then
                        //console.log(respuestica)
                        jugadorId=respuestica
                    })
            }
    })

    
}

function selecionarMascota(){
    if (input1.checked==true){
        //alert("Has seleccionado un hipodoge");
        mascotaAmigo.innerHTML=input1.id
        mascotaJugador=input1.id
    }
    else if (input2.checked==true){
        //alert("Has seleccionado un capipepo")
        mascotaAmigo.innerHTML=input2.id
        mascotaJugador=input2.id
    }
    else if (input3.checked==true){
        //alert("Has seleccionado una ratigueya")
        mascotaAmigo.innerHTML=input3.id
        mascotaJugador=input3.id
    }
    else{
        alert("Selecciona una mascota")
        seccionSelectMascota.style.display="flex";
    }

    if (input1.checked==true || input2.checked==true || input3.checked==true){
        extraerAtaques(mascotaJugador)
        
        botonMascotaJugador.disabled=true
        input1.disabled=true
        input2.disabled=true
        input3.disabled=true

        seleccionarMokepon(mascotaJugador)
        seccionSelectMascota.style.display="none";
        mapaSecciones.style.display="flex";
        miMokepon=obtenerObjetoMascota()
        iniciarMapa();
    }

    
    

    
}

function seleccionarMokepon(mascotaJugador){
    fetch(`http://192.168.1.4:8080/mokepon/${jugadorId}`
    ,{method: "post"
    ,headers:{"Content-Type":"application/json"} //asi se indica q es un JSON
    ,body: JSON.stringify({mokepon:mascotaJugador})
    
})
    
}

function extraerAtaques(mascotaJugador){
    let ataque
    for (let i = 0; i < mokepones.length; i ++) {
        if (mokepones[i].nombre==mascotaJugador){
            ataque=mokepones[i].ataques;
        }
        
    }
    mostrarAtaques(ataque)     
}

function mostrarAtaques(ataques) {
    for (let i = 0; i < ataques.length; i++) {
        //console.log(ataques[i].id)
                opcionDeAtaques = `
            <button id=${ataques[i].id} class="boton-ataque BAtaque">
                ${ataques[i].nombre}
            </button>
        `;

        botones_ataque.innerHTML+=opcionDeAtaques;
    }


    // ataques.forEach((ataque) => {             //OTRA MANERA DE HACERLO, HACE LO MISMO QUE LO DE ARRIBA
    //     opcionDeAtaques = `
    //         <button id=${ataque.id} class="boton-ataque">
    //             ${ataque.nombre}
    //         </button>
    //     `;

    //     botones_ataque.innerHTML += opcionDeAtaques;
    // });

    



    botones=document.querySelectorAll(".BAtaque");
    //console.log(botones)



}

function secuenciaAtaques(){
    botones.forEach((boton) => {
        boton.addEventListener('click',(e) =>{
            //console.log((e))
            if(e.target.innerText ==='🔥'){   
                ataqueJugador.push('FUEGO');
                ataqueTemporal=['FUEGO']
                boton.disabled=true
                ataqueAmigo="fuego";
                //console.log(ataqueJugador)
                boton.style.background='#112f58'
                
            }else if (e.target.innerText=== '🧊'){
                ataqueJugador.push('AGUA');
                ataqueTemporal=['AGUA']
                boton.disabled=true
                ataqueAmigo="agua";
                //console.log(ataqueJugador)
                boton.style.background='#112f58'
                
            }else if (e.target.innerText=== '🌱'){
                ataqueJugador.push('TIERRA');
                ataqueTemporal=['TIERRA']
                boton.disabled=true
                ataqueAmigo="tierra";
                //console.log(ataqueJugador)
                boton.style.background='#112f58'
                
            }
            // let aleatorio= Math.floor(Math.random()* ataqueEnemigoo.length)
            // let texto=ataqueEnemigoo[aleatorio]
            // secAtaqueEnemigo.push(texto)
            // ataqueEnemigo=texto.toLowerCase()
            // //console.log(secAtaqueEnemigo,ataqueEnemigoo)
            // ataque()
            if (ataqueJugador.length===5){
                console.log(ataqueJugador)
                enviarAtaques()
            }
            
        })
    })
}

// function enviarAtaques(){
//     fetch(`http://192.168.1.4:8080/mokepon/${jugadorId}/ataques`, {
//     method: "post",
//     headers: {"Content-Type": "application/json"},
//     body: JSON.stringify({ataques:ataqueAmigo })
//     })
//     intervalo=setInterval(obtenerAtaques,50)
// }

function enviarAtaques() {
    fetch(`http://192.168.1.4:8080/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    }).then(function(res){
        if(res.ok){
            console.log("HOLAAAAAAAAAAaaa")
        }
    })
    
    intervalito = setInterval(obtenerAtaques, 50)
    
}

function obtenerAtaques(){ //peticion tipo get
    fetch(`http://192.168.1.4:8080/mokepon/${enemigoId}/ataques`)
        .then(function(res){
            if(res.ok){
                res.json()
                    .then(function({ataques}){
                        if (ataques.length===5){
                            
                            ataqueEnemigo=ataques
                            ataque()
                        }
                    })
            }
        })
}


function seleccionarMascotaEnemigo(enemigo){
    // const arrMascotas=["Hipodoge","Capipepo","Ratigueya"]
    //let aleatorio= Math.floor(Math.random()* mokepones.length) 

    mascotaEnemigoo=enemigo.nombre
    mascotaEnemigo.innerHTML=mascotaEnemigoo





    extraerAtaquesEnemigo(mascotaEnemigoo)
    secuenciaAtaques()
}

function extraerAtaquesEnemigo(mascotaEnemigoo){
    //console.log(mascotaEnemigoo)
    let ataquee;
    for (let i= 0; i < mokepones.length; i++) {
        //console.log(mokepones[i])
        if (mokepones[i].nombre==mascotaEnemigoo){
            ataquee=mokepones[i].ataques
            for (let ii= 0; ii < ataquee.length; ii++) {
                if (ataquee[ii].nombre==='🔥'){
                    ataqueEnemigoo.push("FUEGO")
                }
                else if(ataquee[ii].nombre==='🌱'){
                    ataqueEnemigoo.push("TIERRA")
                }else{
                    ataqueEnemigoo.push("AGUA")
                }
            }
        }
    }
}


function parrafoTexto(){
    parrafoAmigo=document.createElement('p')
    parrafoEnemigo=document.createElement('p')
    if(ataqueAmigo1=="fuego"){
        parrafoAmigo.innerHTML= "🔥"
    }
    else if(ataqueAmigo1=="agua"){
        parrafoAmigo.innerHTML= "💧"
    }
    else if(ataqueAmigo1=="tierra"){
        parrafoAmigo.innerHTML= "🌱"
    }

    if(ataqueEnemigo1=="fuego"){
        parrafoEnemigo.innerHTML= "🔥"
    }
    else if(ataqueEnemigo1=="agua"){
        parrafoEnemigo.innerHTML= "💧"
    }
    else if(ataqueEnemigo1=="tierra"){
        parrafoEnemigo.innerHTML= "🌱"
    }

    seccionMensAmigo.appendChild(parrafoAmigo)
    seccionMensEnemigo.appendChild(parrafoEnemigo)
    mensaje(ataqueConjunto)


}

function ataque(){
    
    clearInterval(intervalito)
    for (index=0; index <=contadorAtaque; index++) {
        ataqueAmigo1=ataqueJugador[index].toLowerCase()
        ataqueEnemigo1=ataqueEnemigo[index].toLowerCase()
        
    
    if (ataqueAmigo==ataqueEnemigo){ataqueConjunto="EMPATE"}

    else if(ataqueAmigo1=="fuego" && ataqueEnemigo1=="agua"){ataqueConjunto="PERDISTE"; vidasEnemigo++;enemigo.innerHTML=vidasEnemigo}
    else if(ataqueAmigo1=="fuego" && ataqueEnemigo1=="tierra"){ataqueConjunto="GANASTE";vidasAmigo++;amigo.innerHTML=vidasAmigo} //


    else if(ataqueAmigo1=="agua" && ataqueEnemigo1=="fuego"){ataqueConjunto="GANASTE";vidasAmigo++;amigo.innerHTML=vidasAmigo} //
    else if(ataqueAmigo1=="agua" && ataqueEnemigo1=="tierra"){ataqueConjunto="PERDISTE";vidasEnemigo++;enemigo.innerHTML=vidasEnemigo}
    
    else if (ataqueAmigo1=="tierra" && ataqueEnemigo1=="fuego"){ataqueConjunto="PERDISTE";vidasEnemigo++;enemigo.innerHTML=vidasEnemigo}
    else if (ataqueAmigo1=="tierra" && ataqueEnemigo1=="agua"){ataqueConjunto="GANASTE";vidasAmigo++;amigo.innerHTML=vidasAmigo}//

    parrafoTexto()


    }

        if (vidasAmigo<vidasEnemigo){
            
            mensaje("LOST :(")
            reinicio.style.display="flex";
        }else if(vidasEnemigo<vidasAmigo){
            
            mensaje("WIN :)")
            reinicio.style.display="flex";
        }else{
            
            mensaje("DRAW :/")
            reinicio.style.display="flex";
        }
    }


function mensaje(resultado){ 
    mensajeDef.innerHTML=resultado;
}

function moverDerecha(){
    miMokepon.velocidadX=5
}

function moverIzquierda(){
    miMokepon.velocidadX=-5
}

function moverAbajo(){
    miMokepon.velocidadY=5
}   

function moverArriba(){
    miMokepon.velocidadY=-5
}

function pintarCanvas(){
    miMokepon.x=miMokepon.x+ miMokepon.velocidadX
    miMokepon.y=miMokepon.y+ miMokepon.velocidadY
    lienzo.clearRect(0,0,mapaCanva.width,mapaCanva.height)
    lienzo.drawImage(mapaBackground,0,0,mapaCanva.width,mapaCanva.height)
    miMokepon.pintarMokepon()

    enviarPosicion(miMokepon.x , miMokepon.y);      

    mokeponesEnemigos.forEach(function(mokepon){
        mokepon.pintarMokepon()
        revisarColision(mokepon)
    })

}

function enviarPosicion(x,y){
    
    fetch(`http://192.168.1.4:8080/mokepon/${jugadorId}/posicion`,{
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({x:x , y:y})
    })
    .then(function(res){
        if (res.ok){
            res.json()
                .then(function({enemigos}){
                    //console.log(enemigos)   
                    mokeponesEnemigos=enemigos.map(function(enemigo){
                        console.log(enemigo)
                        
                        let mokeponEnemigo=null 
                        const mokeponNombre = enemigo.mokepon.nombre 
                        if (mokeponNombre==="Hipodoge"){
                            mokeponEnemigo = new Mokepon("Hipodoge","./mokepons_mokepon_hipodoge_attack.jpg",5,"./hipodoge.jpg",enemigo.id);
                        }else if(mokeponNombre==="Capipepo"){
                            mokeponEnemigo= new Mokepon("Capipepo","./mokepons_mokepon_capipepo_attack.jpg",5,"./capipepo.jpg",enemigo.id);
                        }else if(mokeponNombre==="Ratigueya"){
                            mokeponEnemigo= new Mokepon("Ratigueya","./mokepons_mokepon_ratigueya_attack.jpg",5,"./ratigueya.jpg",enemigo.id);
                        }
                        
                        mokeponEnemigo.x=enemigo.x
                        mokeponEnemigo.y=enemigo.y

                        return mokeponEnemigo
                        
                    })
                    
                    
                    
                })
            
        }
    })
}

function detenerMovimiento(){
    miMokepon.velocidadX=0
    miMokepon.velocidadY=0
}

function reiniciar(){
    location.reload()   
}   

function sePresionaBoton(event){
    //console.log(event.key);
    switch (event.key){
        case "ArrowUp":
            moverArriba();
            break;
        
        case "ArrowDown":
            moverAbajo();
            break;
        case "ArrowLeft":
            moverIzquierda();
            break;
        case "ArrowRight":
            moverDerecha();
            break;
    }
}   

function iniciarMapa(){
    intervalo=setInterval(pintarCanvas,50)


    window.addEventListener('keydown',sePresionaBoton);
    window.addEventListener('keyup',detenerMovimiento);
}

function obtenerObjetoMascota(){
    let ataque
    for (let i = 0; i < mokepones.length; i ++) {
        if (mokepones[i].nombre==mascotaJugador){
            return mokepones[i]
        }
        
    }
}

function revisarColision(enemigo){
    const arribaEnemigo=enemigo.y
    const abajoEnemigo=enemigo.y+enemigo.alto
    const derechaEnemigo=enemigo.x+enemigo.ancho
    const izquierdaEnemigo=enemigo.x

    const arribaMascota=miMokepon.y
    const abajoMascota=miMokepon.y+miMokepon.alto
    const derechaMascota=miMokepon.x+miMokepon.ancho
    const izquierdaMascota=miMokepon.x

    if(abajoMascota<arribaEnemigo ||arribaMascota>abajoEnemigo || derechaMascota<izquierdaEnemigo ||izquierdaMascota>derechaEnemigo){
        
    }else{
        detenerMovimiento()
        clearInterval(intervalo)
        alert("Tu "+miMokepon.nombre+" colisionó con "+enemigo.nombre)
        enemigoId=enemigo.id
        seccionSelectAtaque.style.display="flex";
        mapaSecciones.style.display="none";
        seleccionarMascotaEnemigo(enemigo)
    }   

}

window.addEventListener("load",iniciarJuego)




document.addEventListener("DOMContentLoaded", function () {

    //Buscamos con el id al canvas desde el documento para editarlo desde javascript
    const can= document.getElementById("draw");
    can.height= document.documentElement.clientHeight; 
    can.width= document.documentElement.clientWidth ;

    //Buscamos su contexto y lo guardamos en una variable para poder crear nuestros métodos con los cuales dibujar
    /** @type {CanvasRenderingContext2D} */
    const ctx= can.getContext("2d");

    
    //Declaramos las variables que necesitamos. En este caso seteamos en false la variable painting que cambia 
    //de valores booleanos dependiendo si estamos dibujando con nuestro mouse o no. Inicialmente se setea en false ya que
    //no comenzamos dibujando
    
    //variables
    let painting= false;

    function startPosition(e) {
        painting=true;
        draw(e);
    }

    function finishedPosition() {
        painting=false;
        ctx.beginPath();
    }

    //Este método es el que permite dibujar, utiliza los métodos que provee la API del contexto. Se utilizan además
    //las coordenadas del canvas del cliente (browser)
    function draw(e) {
        if(!painting) return; //no hace nada si no pinta
        ctx.lineWidth = 24;
        ctx.lineCap = "round";
        ctx.strokeStyle  ='#801515';

        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    }

    //EventListeners
    can.addEventListener("mousedown", startPosition); //Cuando hacemos click, nos tiene que permitir dibujar, aunque sea un punto
    can.addEventListener("mouseup", finishedPosition); //Este método permite finalizar el trazado el líneas
    can.addEventListener("mousemove", draw); //Cuando se mueve el mouse se activa el método para dibujar en el canvas

});
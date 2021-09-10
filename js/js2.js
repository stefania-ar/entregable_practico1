document.addEventListener("DOMContentLoaded", function () {

    //Buscamos con el id al canvas desde el documento para editarlo desde javascript
    const can = document.getElementById("draw");
    let brush = document.getElementById("brush");
    let eraser = document.getElementById("eraser");
    const cleaner =document.getElementById("cleaner");
    const widthLine = document.getElementById("range_sice_pencil");

    //Buscamos su contexto y lo guardamos en una variable para poder crear nuestros métodos con los cuales dibujar
    /** @type {CanvasRenderingContext2D} */
    const ctx = can.getContext("2d");

    //Declaramos las variables que necesitamos. En este caso seteamos en false la variable painting que cambia 
    //de valores booleanos dependiendo si estamos dibujando con nuestro mouse o no. Inicialmente se setea en false ya que
    //no comenzamos dibujando

    //variables
    let painting = false;
    let eraserb = false;

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function finishedPosition() {
        painting = false;
        ctx.beginPath();
    }

    //Elegir grosor del pincel
    const input = document.getElementById("size");

    function getSize() {
        let size = 10;
        let sizeNum = parseInt(10, size);
        console.log(sizeNum);
        return sizeNum;
    }
    let sizeNum = getSize();
    
    
    //Este método es el que permite dibujar, utiliza los métodos que provee la API del contexto. Se utilizan además
    //las coordenadas del canvas del cliente (browser)
    function draw(e) {
        if (!painting) return; //no hace nada si no pinta
        ctx.lineWidth = widthLine.value;
        let color;

        if(eraserb){
            color= "#FFFFFF";
        }else{
            color = document.getElementById("color").value;
        }
        ctx.lineCap = "round";
        ctx.strokeStyle = color;

        ctx.lineTo(e.clientX -60, e.clientY -70);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX -60, e.clientY-70);
    }

    //EventListeners
    brush.addEventListener("click", function () {
        console.log("hola");
        eraserb= false;
        can.addEventListener("mousedown", startPosition); //Cuando hacemos click, nos tiene que permitir dibujar, aunque sea un punto
        can.addEventListener("mouseup", finishedPosition); //Este método permite finalizar el trazado el líneas
        can.addEventListener("mousemove", draw); //Cuando se mueve el mouse se activa el método para dibujar en el canvas
    });

    eraser.addEventListener("click", function () {
        console.log("goma");
        eraserb=true;
        can.addEventListener("mousedown", startPosition); //Cuando hacemos click, nos tiene que permitir dibujar, aunque sea un punto
        can.addEventListener("mouseup", finishedPosition); //Este método permite finalizar el trazado el líneas
        can.addEventListener("mousemove", draw);
    });

    
    function resetWhite(){
        console.log("borrar");
        var canvasData = ctx.getImageData(0, 0, can.width, can.height);
        var data = canvasData.data;
        for (let i=0; i<data.length; i+=4){
            data[i] = 255;
            data[i+1]= 255;
            data[i+2]=255;
        }
        ctx.putImageData(canvasData, 0, 0);
    };
    
    cleaner.addEventListener("click", resetWhite);

});
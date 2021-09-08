document.addEventListener("DOMContentLoaded", function () {

    const can= document.getElementById("draw");
    can.height= document.documentElement.clientHeight; 
    can.width= document.documentElement.clientWidth ;

    /** @type {CanvasRenderingContext2D} */
    const ctx= can.getContext("2d");

    //variables
    let painting= false;

    function startPosition() {
        painting=true;
        draw(e);
    }

    function finishedPosition() {
        painting=false;
        ctx.beginPath();
    }

    function draw(e) {
        if(!painting) return; //no hace nada si no pinta
        ctx.lineWidth =6;
        ctx.lineCap = "round";
        
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    }

    //EventListeners
    can.addEventListener("mousedown", startPosition);
    can.addEventListener("mouseup", finishedPosition);
    can.addEventListener("mousemove", draw);

});
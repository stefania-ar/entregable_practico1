document.addEventListener("DOMContentLoaded", function () {
    //con esta variable se controla que el filtro sepa se aplique solo si no está aplicado
    //sino aplica el filtro sepia sobre si mismo, la imagen se altera de forma no deseada
    let sepia = false;

    //variable donde se guarda el canvas que se encuentra en el DOM
    var canvas = document.getElementById("draw");

    /** @type {CanvasRenderingContext2D} */
    //variable donde guardo el contecto de dibujo del lienzo(canvas)
    const ctx = canvas.getContext("2d");

    //variables donde guardo el ancho y alto del canvas.
    let width = canvas.width;
    let height = canvas.height;

    //variable del tipo Image donde se guardará la imagen
    var image = new Image();
    //asigno el src de la imagen a uno vacio(no se encuentra con imagen), para comenzar.
    image.src= "";
    //función onload de imagen. una vez cargada la imagen se ejecuta.
    image.onload = function(){
        //dibujo la imagen en el canvas.
        myDrawImageMethod(this, width, height);
    }

    //función que lee una nueva imagen
    //se usa en el evento 'change' del input type:file(evento ubicado al final del código)
    function readImage(file) {
        //se crea una variable donde se va a guardar el objeto FileReader
        //permite que las aplicaciones web lean ficheros
        const reader = new FileReader();
        //El load evento se activa cuando un archivo se ha leído correctamente.
        reader.addEventListener('load', (e) => {
            //retorna el contenido del archivo.
            //y se lo asigna al src de la imagen
            image.src = e.target.result;
        });
        //método que lee el contenido del Blobo especificado File.
        //cuando este finaliza contiene los datos como datos: URL.
        reader.readAsDataURL(file);
    }

    //finción que escala y dibuja imagen dentro del canvas
    function myDrawImageMethod(image, width, height){
        //calcula el margen que debe disminuir o aumentar la imagen, para que entre en el ancho y alto del canvas
        //en caso que los lados de la imagen sean inferiores al canvas, la imagen resulta por agrandarse.
        let hRatio = width / image.width;
        let vRatio = height / image.height;
        //se queda con el menor de las proporciones calculadas, para no perder informacion.
        //la menor de estas dos será el la resultante del lado mas grande de la imagen.
        let ratio  = Math.min ( hRatio, vRatio );
        //A la imagen la multiplica por la proporcion, asi esta adapta su tamaño adecuado
        //si el margen es < 0, la imagen disminuye su tamaño y si es mayor, aumenta su tamaño.
        let imgW = image.width*ratio;
        let imgH = image.height*ratio;
        //CENTRAR IMAGEN
        //calcula el eje X.
        //al canvas le resta la imagen, esto da cuanto espacio no cubre la imagen.
        //luego a este lo divide por 2 para que X se ubique en la mitad de este espacio sin cubrir
        //asi el espacio no cubierto se distribuye de forma equitativa.
        //Lo mismo pasa con el eje Y
        let centerX = ( width - imgW) / 2;
        let centerY= ( height - imgH) / 2;
        //dibuja la imagen dentro del canvas
        ctx.drawImage(image,centerX,centerY,imgW, imgH);
    }

    //filtro escala de grises
    function grey(width, height){
       //trae la imagen con todos los cambios que tenga hasta el momento
        var canvasData = ctx.getImageData(0, 0, width, height);
        //extraigo la informacion de esta, especificamente la matriz con los valores numericos rgba
        var data = canvasData.data;
        //recorro el array(data)
        //calculo y hago los cambios deseados
        for (let i=0; i<data.length; i+=4){
            //calculo el promedio de luz rgb
            let avg = (data[i]+data[i+1]+data[i+2])/3;
            //modifico el array data en las posicione especificas de cada pixel
            //le asigno el promedio de luz a los espacios de rgb.
            //los tres deben tener el mismo valor, asi se genera un gris.
            data[i] = avg; //r
            data[i+1]= avg; //g
            data[i+2]=avg; //b
        }
        //pinto en el canvas los datos
        ctx.putImageData(canvasData, 0, 0);
    }

    //filtro sepia
    function sepiaFilter(width, height){
        //trae la imagen con todos los cambios que tenga hasta el momento
        var canvasData = ctx.getImageData(0, 0, width, height);
        //extraigo la informacion de esta, especificamente la matriz con los valores numericos rgba
        var data = canvasData.data;
        //recorro el array(data)
        //calculo y hago los cambios deseados
        for (var i = 0; i < data.length; i += 4) {
            //calcula la luminosidad percibida para este pixel
            var brightness = .3 * data[i] + .6 * data[i + 1] + .1 * data[i + 2];
            //el filtro debe ser sepia, quiere decir que el rojo va a ser predominante
            data[i] = Math.min(brightness + 40, 255); //r
            data[i + 1] = Math.min(brightness + 15, 255); //g
            data[i + 2] = brightness; //b
        }
        //pinto en el canvas los datos
        ctx.putImageData(canvasData, 0, 0);
    }

    //filtro invertir
    function invert(width, height){
        //trae la imagen con todos los cambios que tenga hasta el momento
        var canvasData = ctx.getImageData(0, 0, width, height);
        //extraigo la informacion de esta, especificamente la matriz con los valores numericos rgba
        var data = canvasData.data;
        //recorro el array(data)
        //calculo y hago los cambios deseados
        for (let i = 0; i < data.length; i += 4) {
            //para invertir el color delpixel
            //se calcula la diferencia entre 255 y el valor que guarda cada canal
            data[i]     = 255 - data[i]; //r
            data[i + 1] = 255 - data[i + 1]; //g
            data[i + 2] = 255 - data[i + 2]; //b
        }
        //pinto en el canvas los datos
        ctx.putImageData(canvasData, 0, 0);
    }

    //filtro binario(blanco y negro)
    function binarization(width, height){
        //trae la imagen con todos los cambios que tenga hasta el momento
        var canvasData = ctx.getImageData(0, 0, width, height);
        //extraigo la informacion de esta, especificamente la matriz con los valores numericos rgba
        var data = canvasData.data;
        //valor que se le va ainsertar al canal del pixel
        let value;
        //promedio con el cual se va a comparar el la luz del pixel
        let avg = 255/3;
        //recorro el array(data)
        //calculo y hago los cambios deseados
        for (let i = 0; i < data.length; i += 4) {
            //si la luz promedio del pixeles menor a avg
            if((data[i]+data[i + 1]+data[i + 2])/3<avg){
                value = 0;
            }else{
                value = 255;
            }
            //inserto el nuevo valor en cada canal elpixel
            data[i]     = value; //r
            data[i + 1] = value; //g
            data[i + 2] = value; //b
        }
        //pinto en el canvas los datos
        ctx.putImageData(canvasData, 0, 0);
    }

    //filtro de brillo
    function brightness(width, height, sumBrightness){
        //trae el canvas con todos los cambios que tenga hasta el momento
        var canvasData = ctx.getImageData(0, 0, width, height);
        //extraigo la informacion de esta, especificamente la matriz con los valores numericos rgba
        var data = canvasData.data;
        //(hsv y rgb) variables donde se va a guardar array resultado del pasaje de rgb hsv y biserversa.
        //(brightness) variable donde se va a guardar el brillo deseado
        let hsv, rgb, rangeBrightness;
        //variable fija que indica cuanto aumenta o disminuye el brillo
        let range = 5;
        //recorro el array(data)
        //calculo y hago los cambios deseados
        for (let i = 0; i < data.length; i += 4) {
            //paso el pixel de rgb a hsv
            hsv = rgbHsv(data[i], data[i + 1], data[i + 2]);
            //pregunata por brightness, un boolean
            //si es true suma brillo, si es false resta brillo
            if(sumBrightness){
                rangeBrightness = hsv[2]+range;
            }else{
                rangeBrightness = hsv[2]-range;
            }
            //paso el piel de hsv a rgb y le inserto el nuevo valor de brillo(rangeBrightness)
            rgb = hsvRgb(hsv[0], hsv[1], rangeBrightness);
            //modifico la data de canvas con los nuevos valores
            data[i]=rgb[0]; //r
            data[i + 1]=rgb[1]; //g
            data[i + 2]= rgb[2]; //b
        }
        //pinto en el canvas los datos
        ctx.putImageData(canvasData, 0, 0);
    }

    //filtro saturación
    function saturar(width, height, range){
        //trae el canvas con todos los cambios que tenga hasta el momento
        var canvasData = ctx.getImageData(0, 0, width, height);
        //extraigo la informacion de esta, especificamente la matriz con los valores numericos rgba
        var data = canvasData.data;
        //(hsv y rgb) variables donde se va a guardar array resultado del pasaje de rgb hsv y biserversa.
        //(brightness) variable donde se va a guardar el brillo deseado
        let hsv, rgb;
        //recorro el array(data)
        //calculo y hago los cambios deseados
        for (let i = 0; i < data.length; i += 4) {
            //paso el pixel de rgb a hsv
            hsv = rgbHsv(data[i], data[i + 1], data[i + 2]);
            //paso de hsv a rgb modificando el campo de la saturación, le inserto elvalor que me traigo del imput range de saturación
            rgb = hsvRgb(hsv[0], range, hsv[2]);
            //modifico la data de canvas con los nuevos valores
            data[i]=rgb[0];
            data[i + 1]=rgb[1];
            data[i + 2]= rgb[2];
        }
        //pinto en el canvas los datos
        ctx.putImageData(canvasData, 0, 0);
    }

    function rgbHsv(r, g, b){
        //variables donde se va a guardar los valores de hsv
        //hay que tener en cuenta que h es de 0 a 360, s y v de 0 a 100.
        let h,s,v;
        //se dividen los valores r, g y b
        r = r/255.0;
        g = g/255.0;
        b = b/255.0;
        //se busca el minimo y el maximo entre r, g y b
        let min = Math.min(r,g,b);
        let max = Math.max(r,g,b);
        //cala ladiferencia entre el maximo y e minimo
        let dif = max-min;

        //calcula el tono
        if(max == min){
            h = 0;
        }else if(max == r){
            //dd es un valor general del pasaje de colores por tono
            //por ejemplo de un rojo a un amarillo se debe aumentar el tono en 60°(6)
            let dd;
            if(g < b){
                dd = 6;
            }else{
                dd = 0;
            }
            h = (g - b) + dif * dd;
            h /= 6 * dif;
            h *= 360;
        }else if(max == g){
            h = (b - r) + dif * 2;
            h /= 6 * dif;
            h *= 360;
        }else if(max == b){
            h = (r - g) + dif * 4;
            h /= 6 * dif;
            h *= 360;
        }
        //calcula la saturacion
        if(max == 0){
            s = 0;
        }else{
            s = (dif/max)*100;
        }
        //calcula el brillo
        v = max*100;
        //retorna un array con los valores en orden(hsv)
        //se hace un redondeo para que la salida sea lo más exacta posible
        return [Math.round(h),Math.round(s), Math.round(v)];
    }

    function hsvRgb(h, s, v) {
        //Se debe dividir h por 360, y S y V son entre 0 y 1.
        h /= 360.0;
        if(s > 100){
            s = 100;
        }
        s /= 100.0;
        v /= 100.0;

        let r, g, b;
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
            break;
            case 1:
                r = q, g = v, b = p;
            break;
            case 2:
                r = p, g = v, b = t;
            break;
            case 3:
                r = p, g = q, b = v;
            break;
            case 4:
                r = t, g = p, b = v;
            break;
            case 5:
                r = v, g = p, b = q;
            break;
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function blur(width, height){
        //trae el canvas con todos los cambios que tenga hasta el momento
        var canvasData = ctx.getImageData(0, 0,  width, height);
        //genero una copia del canvas, este se va a ir modificando
        var canvasDataCopy = ctx.getImageData(0, 0,  width, height);
        //extraigo la informacion de esta, especificamente la matriz con los valores numericos rgba
        var data = canvasData.data;
        //extraigo la info de la copia
        var dataCopy= canvasDataCopy.data;
        //defino la matriz kernel de difuminado
        let k1=[[1, 1, 1],
                [1, 1, 1],
                [1, 1, 1]];

        let w = width;
        let h = height;
        //genero un recorrido igual a la matriz del canvas(ancho x alto)
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                //guarda en una variable el idice de cada pixel vecino al pixel central que se va modificar
                let ul = ((x-1+w)%w + w*((y-1+h)%h))*4; //arriba a la izquierda
                let uc = ((x-0+w)%w + w*((y-1+h)%h))*4; //arriba al centro
                let ur = ((x+1+w)%w + w*((y-1+h)%h))*4; //arriba a la derecha
                let ml = ((x-1+w)%w + w*((y+0+h)%h))*4; //izquierda
                let mc = ((x-0+w)%w + w*((y+0+h)%h))*4; //centro
                let mr = ((x+1+w)%w + w*((y+0+h)%h))*4; //derecha
                let ll = ((x-1+w)%w + w*((y+1+h)%h))*4; //abajo a la izquierda
                let lc = ((x-0+w)%w + w*((y+1+h)%h))*4; //abajo al centro
                let lr = ((x+1+w)%w + w*((y+1+h)%h))*4; //abajo a la derecha

                //convolución sobre canal r del pixel
                let r0 = data[ul]*k1[0][0]; //arriba a la izquierda
                let r1 = data[uc]*k1[0][1]; //arriba al centro
                let r2 = data[ur]*k1[0][2]; //arriba a la derecha
                let r3 = data[ml]*k1[1][0]; //izquierda
                let r4 = data[mc]*k1[1][1]; //centro
                let r5 = data[mr]*k1[1][2]; //derecha
                let r6 = data[ll]*k1[2][0]; //abajo a la izquierda
                let r7 = data[lc]*k1[2][1]; //abajo al centro
                let r8 = data[lr]*k1[2][2]; //abajo a la derecha
                //A r le asigno el promedio
                let r = (r0+r1+r2+r3+r4+r5+r6+r7+r8)/9;

                //convolución sobre canal g del pixel
                let g0 = data[ul+1]*k1[0][0]; //arriba a la izquierda
                let g1 = data[uc+1]*k1[0][1]; //arriba al centro
                let g2 = data[ur+1]*k1[0][2]; //arriba a la derecha
                let g3 = data[ml+1]*k1[1][0]; //izquierda
                let g4 = data[mc+1]*k1[1][1]; //centro
                let g5 = data[mr+1]*k1[1][2]; //derecha
                let g6 = data[ll+1]*k1[2][0]; //abajo a la izquierda
                let g7 = data[lc+1]*k1[2][1]; //abajo al centro
                let g8 = data[lr+1]*k1[2][2]; //abajo a la derecha
                //A g le asigno el promedio
                let g = (g0+g1+g2+g3+g4+g5+g6+g7+g8)/9;

                //convolución sobre canal b del pixel
                let b0 = data[ul+2]*k1[0][0]; //arriba a la izquierda
                let b1 = data[uc+2]*k1[0][1]; //arriba al centro
                let b2 = data[ur+2]*k1[0][2]; //arriba a la derecha
                let b3 = data[ml+2]*k1[1][0]; //izquierda
                let b4 = data[mc+2]*k1[1][1]; //centro
                let b5 = data[mr+2]*k1[1][2]; //derecha
                let b6 = data[ll+2]*k1[2][0]; //abajo a la izquierda
                let b7 = data[lc+2]*k1[2][1]; //abajo al centro
                let b8 = data[lr+2]*k1[2][2]; //abajo a la derecha
                //A b le asigno el promedio
                let b = (b0+b1+b2+b3+b4+b5+b6+b7+b8)/9;

                //gravo los resultados en la copia de la informacion del canvas.
                dataCopy[mc] = r;
                dataCopy[mc+1] = g;
                dataCopy[mc+2] = b;
            }
        }
        //pinto en el canvas los datos, usando la copia modificada del canvas
        ctx.putImageData(canvasDataCopy, 0, 0);
    }

    function sobel(width, height){
        //se pasa el canvas a escala de grises para obtener un resultado más exacto
        grey(width, height);
        //trae el canvas con todos los cambios que tenga hasta el momento
        var canvasData = ctx.getImageData(0, 0,  width, height);
        //genero una copia del canvas, este se va a ir modificando
        var canvasDataCopy = ctx.getImageData(0, 0,  width, height);
        //extraigo la informacion de esta, especificamente la matriz con los valores numericos rgba
        var data = canvasData.data;
        //extraigo la info de la copia
        var dataCopy= canvasDataCopy.data;
        //defino la matriz kernel para bordes horizontales(k1x) y verticales(k1y)
        //se busca aplicar un gradiente(cambio abrupto)
        let k1X = [ [-1, 0, 1],
                    [-2, 0, 2],
                    [-1, 0, 1]];

        let k1Y = [ [-1, -2, -1],
                    [0, 0, 0],
                    [1, 2, 1]];

        let w = width;
        let h = height;
        //genero un recorrido igual a la matriz del canvas(ancho x alto)
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                //guarda en una variable el idice de cada pixel vecino al pixel central que se va modificar
                let ul = ((x-1+w)%w + w*((y-1+h)%h))*4; //arriba a la izquierda
                let uc = ((x-0+w)%w + w*((y-1+h)%h))*4; //arriba al centro
                let ur = ((x+1+w)%w + w*((y-1+h)%h))*4; //arriba a la derecha
                let ml = ((x-1+w)%w + w*((y+0+h)%h))*4; //izquierda
                let mc = ((x-0+w)%w + w*((y+0+h)%h))*4; //centro
                let mr = ((x+1+w)%w + w*((y+0+h)%h))*4; //derecha
                let ll = ((x-1+w)%w + w*((y+1+h)%h))*4; //abajo a la izquierda
                let lc = ((x-0+w)%w + w*((y+1+h)%h))*4; //abajo al centro
                let lr = ((x+1+w)%w + w*((y+1+h)%h))*4; //abajo a la derecha
                //convolución sobre eje horizontal
                let p0x = data[ul]*k1X[0][0]; //arriba a la izquierda
                let p1x = data[uc]*k1X[0][1]; //arriba al centro
                let p2x = data[ur]*k1X[0][2]; //arriba a la derecha
                let p3x = data[ml]*k1X[1][0]; //izquierda
                let p4x = data[mc]*k1X[1][1]; //centro
                let p5x = data[mr]*k1X[1][2]; //derecha
                let p6x = data[ll]*k1X[2][0]; //abajo a la izquierda
                let p7x = data[lc]*k1X[2][1]; //abajo al centro
                let p8x = data[lr]*k1X[2][2]; //abajo a la derecha
                let pixelX = p0x+p1x+p2x+p3x+p4x+p5x+p6x+p7x+p8x;
                //convolución sobre eje vertical
                let r0y = data[ul]*k1Y[0][0]; //arriba a la izquierda
                let r1y = data[uc]*k1Y[0][1]; //arriba al centro
                let r2y = data[ur]*k1Y[0][2]; //arriba a la derecha
                let r3y = data[ml]*k1Y[1][0]; //izquierda
                let r4y = data[mc]*k1Y[1][1]; //centro
                let r5y = data[mr]*k1Y[1][2]; //derecha
                let r6y = data[ll]*k1Y[2][0]; //abajo a la izquierda
                let r7y = data[lc]*k1Y[2][1]; //abajo al centro
                let r8y = data[lr]*k1Y[2][2]; //abajo a la derecha
                let pixelY = r0y+r1y+r2y+r3y+r4y+r5y+r6y+r7y+r8y;
                //convina los gradientes horizontal y vertical para obtener la magnitud del gradiente.
                var magnitude = Math.sqrt(Math.pow(pixelX, 2) + Math.pow(pixelY, 2) );
                //gravo los resultados en la copia de la informacion del canvas.
                dataCopy[mc] = magnitude;
                dataCopy[mc+1] = magnitude;
                dataCopy[mc+2] = magnitude;
            }
        }
        //pinto en el canvas los datos, usando la copia modificada del canvas
        ctx.putImageData(canvasDataCopy, 0, 0);
    }

    function download(){
        //creo un elemento <a>, me permite descargar el canvas devido asu propio comportamiento.
        let link = document.createElement('a');
        //especifica que el destino se descargará cuando un usuario haga clic en el hipervínculo.
        link.download = "CanvasImage.jpg";
        //con este if se conprueba que haya una imagen.
        if(image.width > 0 && image.height > 0){
            //creo el canvas donde se va a escalar el contenido del canvas original.
            var newCanvas = document.createElement('canvas');
            //le asigno el mismo tamaño que el canvas original.
            newCanvas.width = width;
            newCanvas.height = height;
            //escalo el canvas creado y le inserto el contenido del canvas original.
            scaleContent(width, height, newCanvas);
            //especifica la URL de la página a la que va el enlace.
            link.href = newCanvas.toDataURL();
        }else{
            //especifica la URL de la página a la que va el enlace.
            link.href = canvas.toDataURL();
        }
        //acciono sobre el link creado para efectuar a descarga.
        link.click();
    }

    function scaleContent(width, height, newCanvas){
        const newCtx = newCanvas.getContext("2d");
        //calcula cuanto debe medir el canvas para contener la imagen con sus dimenciones originales.
        let hRatio = image.width / width;
        let vRatio = image.height / height;
        //se queda con el mayor de las proporciones calculadas, para no perder informacion.
        let ratio  = Math.max ( hRatio, vRatio );
        //Al tamaño del canvas lo multiplico, asi esta adapta su tamaño adecuado.
        newCanvas.width = newCanvas.width*ratio;
        newCanvas.height= newCanvas.height*ratio;
        //pinto el contenido con el canvas original y con las nuevas dimenciones.
        newCtx.drawImage(canvas,0,0,newCanvas.width, newCanvas.height);
    }

    document.getElementById("imageFile").addEventListener('change',(e) => {
        if(e.target.files[0] != null){//pregunta si se seleciono alguna imagen
            //vacia el canvas, ya que si cargan una imagen png,
            //el fondo se sigue viendo la imagen anterior.
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const file = e.target.files[0];
            readImage(file);
        }
    });
    document.getElementById("btnOrigin").addEventListener("click",function(){
        sepia = false;
        myDrawImageMethod(image, width, height);
    });
    document.getElementById("btnGreyFilter").addEventListener("click",function(){
        sepia = false;
        grey(width, height);
    });
    document.getElementById("btnSepiaFilter").addEventListener("click",function(){
        if(sepia == false){
            sepiaFilter(width, height);
            sepia = true;
        }
    });
    document.getElementById("btnInvertFilter").addEventListener("click",function(){
        sepia = false;
        invert(width, height);
    });
    document.getElementById("btnBinarizationFilter").addEventListener("click",function(){
        sepia = false;
        binarization(width, height);
    });
    document.getElementById("btnBlurFilter").addEventListener("click",function(){
        sepia = false;
        blur(width, height);
    });
    document.getElementById("btnBrightness++Filter").addEventListener("click",function(){
        sepia = false;
        brightness(width, height, true);
    });
    document.getElementById("btnBrightness--Filter").addEventListener("click",function(){
        sepia = false;
        brightness(width, height, false);
    });
    document.getElementById("btnSobelFilter").addEventListener("click",function(){
        sepia = false;
        sobel(width, height);
    });
    //filtro de saturacion
    range.addEventListener("change",function(){
        saturar(width, height, range.value);
    });
    document.getElementById("btnDownload").addEventListener("click",function(){
        download();
    });
});
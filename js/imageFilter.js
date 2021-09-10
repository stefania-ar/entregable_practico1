document.addEventListener("DOMContentLoaded", function () {

    let range = document.getElementById("range");
    //range.value = 50;
    let sepia = false;
    var canvas = document.getElementById("draw");

    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");

    let width = canvas.width;
    let height = canvas.height;

    var image = new Image();
    image.src= "";
    image.onload = function(){
        range.value = avgSaturation();
        myDrawImageMethod(this, width, height);
    }

    function readImage(file) {
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
            image.src = e.target.result;
        });
        reader.readAsDataURL(file);
    }

    function resetWhite(r, g, b){
        var canvasData = ctx.getImageData(0, 0, width, height);
        var data = canvasData.data;
        for (let i=0; i<data.length; i+=4){
                data[i] = r;
                data[i+1]= g;
                data[i+2]=b;
        }
        ctx.putImageData(canvasData, 0, 0);
    }

    function avgSaturation(){
        var canvasData = ctx.getImageData(0, 0, width, height);
        var data = canvasData.data;
        let hsv, div;
        let s=0;
        for (let i = 0; i < data.length; i += 4) {
            hsv = rgbHsv(data[i], data[i + 1], data[i + 2]);
            s += hsv[1];
            div =i;
        }
        return s/div;
    }

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
        ctx.drawImage(image,centerX,centerY,imgW, imgH);
    }

    function grey(width, height){
       //trae la imagen con todos los cambios que tenga hasta el momento
        var canvasData = ctx.getImageData(0, 0, width, height);
        //extraigo la informacion de esta, especificamente la matriz con los valores numericos rgba
        var data = canvasData.data;
        for (let i=0; i<data.length; i+=4){
                //let index = (x+y*imageData.height)*4;
                let avg = (data[i]+data[i+1]+data[i+2])/3;
                data[i] = avg;
                data[i+1]= avg;
                data[i+2]=avg;
        }
        ctx.putImageData(canvasData, 0, 0);
    }
    function sepiaFilter(width, height){
        var canvasData = ctx.getImageData(0, 0, width, height);
        var data = canvasData.data;
        for (var i = 0; i < data.length; i += 4) {
            //calcula la luminosidad percibida para este pixel
            var brightness = .3 * data[i] + .6 * data[i + 1] + .1 * data[i + 2];
            data[i] = Math.min(brightness + 40, 255);
            data[i + 1] = Math.min(brightness + 15, 255);
            data[i + 2] = brightness;
        }
        ctx.putImageData(canvasData, 0, 0);
    }
    function invert(width, height){
        var canvasData = ctx.getImageData(0, 0, width, height);
        var data = canvasData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i]     = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
        ctx.putImageData(canvasData, 0, 0);
    }
    function binarization(width, height){
        var canvasData = ctx.getImageData(0, 0, width, height);
        var data = canvasData.data;
        let value;
        let avg = 255/3;
        for (let i = 0; i < data.length; i += 4) {
            if((data[i]+data[i + 1]+data[i + 2])/3<avg){
                value = 0;
            }else{
                value = 255;
            }
            data[i]     = value;
            data[i + 1] = value;
            data[i + 2] = value;
        }
        ctx.putImageData(canvasData, 0, 0);
    }

    function saturar(width, height, range){
        var canvasData = ctx.getImageData(0, 0, width, height);
        var data = canvasData.data;
        let hsv, rgb;
        for (let i = 0; i < data.length; i += 4) {
            hsv = rgbHsv(data[i], data[i + 1], data[i + 2]);
            rgb = hsvRgb(hsv[0], range, hsv[2]);
            data[i]=rgb[0];
            data[i + 1]=rgb[1];
            data[i + 2]= rgb[2];
        }
        ctx.putImageData(canvasData, 0, 0);
    }

    function rgbHsv(r, g, b){
        let h,s,v;
        r = r/255.0;
        g = g/255.0;
        b = b/255.0;
        let min = Math.min(r,g,b);
        let max = Math.max(r,g,b);
        let dif = max-min;

        if(max == min){
            h = 0;
        }else if(max == r){
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

        if(max == 0){
            s = 0;
        }else{
            s = (dif/max)*100;
        }
        v = max*100;
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
        return [Math.round(r*255), Math.round(g * 255), Math.round(b * 255)];
    }

    function blur(width, height){
        var canvasData = ctx.getImageData(0, 0,  width, height);
        var canvasDataCopy = ctx.getImageData(0, 0,  width, height);
        var data = canvasData.data;
        var dataCopy= canvasDataCopy.data;
        let k1 = [[1, 1, 1],
                [1, 1, 1],
                [1, 1, 1]];

        let w = width;
        let h = height;
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                let ul = ((x-1+w)%w + w*((y-1+h)%h))*4; // UPPER LEFT
                let uc = ((x-0+w)%w + w*((y-1+h)%h))*4; // UPPER CENTER
                let ur = ((x+1+w)%w + w*((y-1+h)%h))*4; // UPPER RIGHT
                let ml = ((x-1+w)%w + w*((y+0+h)%h))*4; // LEFT
                let mc = ((x-0+w)%w + w*((y+0+h)%h))*4; // CENTER PIXEL
                let mr = ((x+1+w)%w + w*((y+0+h)%h))*4; // RIGHT
                let ll = ((x-1+w)%w + w*((y+1+h)%h))*4; // LOWER LEFT
                let lc = ((x-0+w)%w + w*((y+1+h)%h))*4; // LOWER CENTER
                let lr = ((x+1+w)%w + w*((y+1+h)%h))*4; // LOWER RIGHT

                let r0 = data[ul]*k1[0][0]; // upper left
                let r1 = data[uc]*k1[0][1]; // upper mid
                let r2 = data[ur]*k1[0][2]; // upper right
                let r3 = data[ml]*k1[1][0]; // left
                let r4 = data[mc]*k1[1][1]; // center pixel
                let r5 = data[mr]*k1[1][2]; // right
                let r6 = data[ll]*k1[2][0]; // lower left
                let r7 = data[lc]*k1[2][1]; // lower mid
                let r8 = data[lr]*k1[2][2]; // lower right
                let r = (r0+r1+r2+r3+r4+r5+r6+r7+r8)/9;

                let g0 = data[ul+1]*k1[0][0]; // upper left
                let g1 = data[uc+1]*k1[0][1]; // upper mid
                let g2 = data[ur+1]*k1[0][2]; // upper right
                let g3 = data[ml+1]*k1[1][0]; // left
                let g4 = data[mc+1]*k1[1][1]; // center pixel
                let g5 = data[mr+1]*k1[1][2]; // right
                let g6 = data[ll+1]*k1[2][0]; // lower left
                let g7 = data[lc+1]*k1[2][1]; // lower mid
                let g8 = data[lr+1]*k1[2][2]; // lower right
                let g = (g0+g1+g2+g3+g4+g5+g6+g7+g8)/9;

                let b0 = data[ul+2]*k1[0][0]; // upper left
                let b1 = data[uc+2]*k1[0][1]; // upper mid
                let b2 = data[ur+2]*k1[0][2]; // upper right
                let b3 = data[ml+2]*k1[1][0]; // left
                let b4 = data[mc+2]*k1[1][1]; // center pixel
                let b5 = data[mr+2]*k1[1][2]; // right
                let b6 = data[ll+2]*k1[2][0]; // lower left
                let b7 = data[lc+2]*k1[2][1]; // lower mid
                let b8 = data[lr+2]*k1[2][2]; // lower right
                let b = (b0+b1+b2+b3+b4+b5+b6+b7+b8)/9;

                dataCopy[mc] = r;
                dataCopy[mc+1] = g;
                dataCopy[mc+2] = b;
            }
        }
        ctx.putImageData(canvasDataCopy, 0, 0);
    }

    function sobel(width, height){
        grey(width, height);
        var canvasData = ctx.getImageData(0, 0,  width, height);
        var canvasDataCopy = ctx.getImageData(0, 0,  width, height);
        var data = canvasData.data;
        var dataCopy= canvasDataCopy.data;

        let k1X = [ [-1, 0, 1],
                    [-2, 0, 2],
                    [-1, 0, 1]];

        let k1Y = [ [-1, -2, -1],
                    [0, 0, 0],
                    [1, 2, 1]];

        let w = width;
        let h = height;
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                let ul = ((x-1+w)%w + w*((y-1+h)%h))*4; // UPPER LEFT
                let uc = ((x-0+w)%w + w*((y-1+h)%h))*4; // UPPER CENTER
                let ur = ((x+1+w)%w + w*((y-1+h)%h))*4; // UPPER RIGHT
                let ml = ((x-1+w)%w + w*((y+0+h)%h))*4; // LEFT
                let mc = ((x-0+w)%w + w*((y+0+h)%h))*4; // CENTER PIXEL
                let mr = ((x+1+w)%w + w*((y+0+h)%h))*4; // RIGHT
                let ll = ((x-1+w)%w + w*((y+1+h)%h))*4; // LOWER LEFT
                let lc = ((x-0+w)%w + w*((y+1+h)%h))*4; // LOWER CENTER
                let lr = ((x+1+w)%w + w*((y+1+h)%h))*4; // LOWER RIGHT

                let r0x = data[ul]*k1X[0][0]; // upper left
                let r1x = data[uc]*k1X[0][1]; // upper mid
                let r2x = data[ur]*k1X[0][2]; // upper right
                let r3x = data[ml]*k1X[1][0]; // left
                let r4x = data[mc]*k1X[1][1]; // center pixel
                let r5x = data[mr]*k1X[1][2]; // right
                let r6x = data[ll]*k1X[2][0]; // lower left
                let r7x = data[lc]*k1X[2][1]; // lower mid
                let r8x = data[lr]*k1X[2][2]; // lower right
                let pixelX = r0x+r1x+r2x+r3x+r4x+r5x+r6x+r7x+r8x;

                let r0y = data[ul]*k1Y[0][0]; // upper left
                let r1y = data[uc]*k1Y[0][1]; // upper mid
                let r2y = data[ur]*k1Y[0][2]; // upper right
                let r3y = data[ml]*k1Y[1][0]; // left
                let r4y = data[mc]*k1Y[1][1]; // center pixel
                let r5y = data[mr]*k1Y[1][2]; // right
                let r6y = data[ll]*k1Y[2][0]; // lower left
                let r7y = data[lc]*k1Y[2][1]; // lower mid
                let r8y = data[lr]*k1Y[2][2]; // lower right
                let pixelY = r0y+r1y+r2y+r3y+r4y+r5y+r6y+r7y+r8y;

                var magnitude = Math.sqrt(Math.pow(pixelX, 2) + Math.pow(pixelY, 2) );

                dataCopy[mc] = magnitude;
                dataCopy[mc+1] = magnitude;
                dataCopy[mc+2] = magnitude;
            }
        }
        ctx.putImageData(canvasDataCopy, 0, 0);
    }

    function download(){
        //creo
        let link = document.createElement('a');
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
            link.href = newCanvas.toDataURL();
        }else{
            link.href = canvas.toDataURL();
        }
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
            //se seta a blanco ya que si cargan una imagen png,
            //el fondo se sigue viendo la imagen anterior.
            resetWhite(255, 255, 255);
            const file = e.target.files[0];
            readImage(file);
        }
    });
    document.getElementById("btnOrigin").addEventListener("click",function(){
        sepia = false;
        range.value = avgSaturation();
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
    document.getElementById("btnSobelFilter").addEventListener("click",function(){
        sepia = false;
        sobel(width, height);
    });
   /*  document.getElementById("btnfiltroSaturar").addEventListener("click",function(){
        saturar(image, widthImage, heightImage);
    });*/
    range.addEventListener("change",function(){
        saturar(width, height, range.value);
    });
    document.getElementById("btnDownload").addEventListener("click",function(){
        download();
    });

});
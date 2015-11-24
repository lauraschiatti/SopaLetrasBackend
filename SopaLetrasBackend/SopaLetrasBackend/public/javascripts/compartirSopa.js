
function guardarPalabras() {
    var palabrasCompartirSopa = new Array();
    var numeroPalabras = parseInt(document.getElementById("numeroPalabras").value);

    for (var i = 0; i < numeroPalabras; i++) {
        palabrasCompartirSopa.push(document.getElementById(i).innerHTML);
    }

    //Dibujar sopa
    mostrarCompartida(numeroPalabras, palabrasCompartirSopa);

    $("#container").hide();
    $("#container2").show();
}

function mostrarCompartida(n, pals) {
    //Verificar palabra mas larga
    var pl = 0;
    for (var i = 0; i < n; i++) {
        if (pals[i].length > pl) {
            pl = pals[i].length;
            palabraMax = pals[i];
        }
    }

    //determinar tamaño de la matriz
    max = 2 * pl;

    if (max < 6) {
        max = 6;
    }

    //Crea arreglo 2D
    matriz = new Array(max);
    for (c = 0; c < max; c++) {
        matriz[c] = new Array(max);
    }

    //Llenar matriz con 0
    for (var i = 0; i < max; i++) {
        for (var j = 0; j < max; j++) {
            matriz[i][j] = 0;
        }
    }

    //separar palabra en caracteres
    for (var j = 0; j < palabras.length; j++) {
        var palabra = $.trim(palabras[j]);
        acomodarPalabra(palabra);
    }

    llenarLetrasAleatorias();
    mostrarTabla();
    reloj();
}
var palabras = new Array();
var palabras2 = new Array();
var palabraVerifica = new Array();
var letraID = new Array();
var aux = 0;
var gana = 0;
var blanca = 0;
var juega = 0;
var matriz, max;
var palabra = "";
var matrizPos = new Array();
var cercanos = new Array();
var valid = false;
var validSopa = false;
var repetidas = true;
function mostrar() {
    if (valid) {
        var cantidad = parseInt(document.getElementById("numero").value);
        var textHTML = "";
        var buttonHTML = "";

        for (i = 0; i < cantidad; i++) {
            textHTML += "<input type='text' id='palabra" + i + "' required><br/><br/>";
        }

        document.getElementById("mostrar").innerHTML = textHTML;
        buttonHTML += "<input type='submit' onclick='validarSopa();validarRepeticiones();crearMatriz();' value='Crear'>";
        document.getElementById("generar").innerHTML = buttonHTML;
    }
}

function validar() {
    valid = true;
    var x = document.forms["miFormulario"]["titulo"].value;
    var y = document.forms["miFormulario"]["descripcion"].value;

    if (x == null || x == "") {
        alert("Debe tener nombre");
        valid = false;
        return false;
    }

    if (y == null || y == "") {
        alert("Debe tener descripción");
        valid = false;
        return false;
    }
}

function validarSopa() {
    validSopa = true;
    var cantidad = parseInt(document.getElementById("numero").value);
    for (var i = 0; i < cantidad; i++) {
        var p = '#palabra' + i;
        var x = $(p).val();
        if (x == null || x == "") {
            alert("no puede haber campos vacíos");
            validSopa = false;
            return false;
        }

    }
}
function validarRepeticiones() {
    repetidas = false;
    var cantidad = parseInt(document.getElementById("numero").value);
    for (var i = 0; i < cantidad - 1; i++) {
        var p1 = '#palabra' + i;
        var x = $(p1).val();
        for (var j = i + 1; j < cantidad; j++) {
            var p2 = '#palabra' + j;
            var y = $(p2).val();
            if (x == y) {
                alert("no puede haber repeticiones");
                repetidas = true;
                return true;
            }

        }
    }
}

function crearMatriz() {
    if (validSopa && !repetidas) {
        var k = 0;
        var i = 0;
        //obtener número de palabras
        var n = $("#numero").val();

        //leer palabras
        for (var con = 0; con < n; con++) {
            var idPal = '#palabra' + con;
            palabras[con] = $(idPal).val();
            if (k < palabras[con].length) {
                k = palabras[con].length;
                i = con;
            }
        }

        //determinar tamaño de la matriz
        max = 2 * palabras[i].length;

        if (max < 6){
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

        $("#container1").hide();
        $("#container2").show();
        palabras2 = palabras;
        llenarLetrasAleatorias();
        mostrarTitulo();
        mostrarLista();
        mostrarTabla();
    }
}

function mostrarTitulo() {
    var t = $("#titulo").val();;
    var tituloHTML = "";
    tituloHTML += "<h1>" + t + "</h1><br>";
    document.getElementById("sopaT").innerHTML = tituloHTML;

    var d = $("#descripcion").val();;
    var descripcionHTML = "";
    descripcionHTML += "<label>" + d + "</label><br><br>";
    document.getElementById("sopaD").innerHTML = descripcionHTML;
}

function mostrarLista() {
    var listaHTML = "";
    for (var i = 0; i < palabras.length; i++) {
        listaHTML += "<p>" + palabras[i] + "</p>";
    }
    document.getElementById("lista").innerHTML = listaHTML;
}

function acomodarPalabra(palabra) {
    var palabrachars = new Array();
    var tam = 0;

    for (var i = 0; i < palabra.length; i++) {
        palabrachars[i] = palabra.charAt(i).toUpperCase();
    }
    var flag = 0;

    do {
        var x = Math.floor(Math.random() * max - 1) + 1;
        var y = Math.floor(Math.random() * max - 1) + 1;

        var orientacion = Math.floor(Math.random() * 4) + 1;

        switch (orientacion) {
            //hacia abajo
            case 1:
                if (max - x >= palabra.length) {
                    for (var i = 0; i < palabra.length; i++) {
                        if (matriz[x + i][y] === 0) {
                            tam += 1;
                        }
                    }
                    if (tam === palabra.length) {
                        for (var i = 0; i < palabra.length; i++) {
                            if (matriz[x + i][y] === 0) {
                                matriz[x + i][y] = palabrachars[i];
                            }
                        }
                        flag = 1;
                    }
                }
                tam = 0;
                break;
                //hacia la derecha
            case 2:
                if (max - y >= palabra.length) {
                    for (var i = 0; i < palabra.length; i++) {
                        if (matriz[x][y + i] === 0) {
                            tam += 1;
                        }
                    }
                    if (tam === palabra.length) {
                        for (var i = 0; i < palabra.length; i++) {
                            if (matriz[x][y + i] === 0) {
                                matriz[x][y + i] = palabrachars[i];
                            }
                        }
                        flag = 1;
                    }
                }
                tam = 0;
                break;
                //diagonal hacia abajo y derecha
            case 3:
                if ((max - x >= palabra.length) && (max - y >= palabra.length)) {
                    for (var i = 0; i < palabra.length; i++) {
                        if (matriz[x + i][y + i] === 0) {
                            tam += 1;
                        }
                    }
                    if (tam === palabra.length) {
                        for (var i = 0; i < palabra.length; i++) {
                            if (matriz[x + i][y + i] === 0) {
                                matriz[x + i][y + i] = palabrachars[i];
                            }
                        }
                        flag = 1;
                    }
                }
                tam = 0;
                break;
                //hacia arriba
            case 4:
                if (max - x >= palabra.length) {
                    for (var i = 0; i < palabra.length; i++) {
                        if (matriz[x + i][y] === 0) {
                            tam += 1;
                        }
                    }
                    if (tam === palabra.length) {
                        for (var i = 0; i < palabra.length; i++) {
                            if (matriz[x + i][y] === 0) {
                                matriz[x + i][y] = palabrachars[(palabra.length - 1) - i];
                            }
                        }
                        flag = 1;
                    }
                }
                tam = 0;
                break;
                //hacia izquierda
            case 5:
                if (max - y >= palabra.length) {
                    for (var i = 0; i < palabra.length; i++) {
                        if (matriz[x][y + i] === 0) {
                            tam += 1;
                        }
                    }
                    if (tam === palabra.length) {
                        for (var i = 0; i < palabra.length; i++) {
                            if (matriz[x][y + i] === 0) {
                                matriz[x][y + i] = palabrachars[(palabra.length - 1) - i];
                            }
                        }
                        flag = 1;
                    }
                }
                tam = 0;
                break;
                //diagonal hacia arriba y derecha
            case 6:
                if ((max - x >= palabra.length) && (max - y >= palabra.length)) {
                    for (var i = 0; i < palabra.length; i++) {
                        if (matriz[x - i][y + i] === 0) {
                            tam += 1;
                        }
                    }
                    if (tam === palabra.length) {
                        for (var i = 0; i < palabra.length; i++) {
                            if (matriz[x - i][y + i] === 0) {
                                matriz[x - i][y + i] = palabrachars[i];
                            }
                        }
                        flag = 1;
                    }
                }
                tam = 0;
                break;
        }
    } while (flag === 0);
}

function mostrarTabla() {
    //Create a HTML Table element.
    var table = $("<table align='center'> </table>");

    //Add the data rows.
    for (var i = 0; i < max; i++) {
        row = $(table[0].insertRow(-1));
        for (var j = 0; j < max; j++) {
            var cell = $("<td><input id='" + (j + 1) + "," + (i + 1) + "' type='submit' class='btn' value='" + matriz[i][j] + "' onClick='seleccionarLetra(\"" + (j + 1) + "," + (i + 1) + "\")'></input></td>");
            row.append(cell);
        }
    }

    var dvTable = $("#table");
    dvTable.html("");
    dvTable.append(table);
    matPos();
}

function llenarLetrasAleatorias() {
    var abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < max; i++) {
        for (var j = 0; j < max; j++) {
            if (matriz[i][j] === 0) {
                matriz[i][j] = abecedario.charAt(Math.floor(Math.random() * 25) + 1);
            }
        }
    }
}

function seleccionarLetra(id) {
    var boton = document.getElementById(id);

    if (cercanos.length === 0) {
        cercano(id);
        boton.style.backgroundColor = "#FF0000";
        letraID[aux] = id;
        palabraVerifica[aux] = boton.value;
        palabra += palabraVerifica[aux];
        aux++;
    } else {
        for (var i = 0; i < cercanos.length; i++) {
            if (id === cercanos[i]) {
                cercano(id);
                boton.style.backgroundColor = "#FF0000";
                letraID[aux] = id;
                palabraVerifica[aux] = boton.value;
                palabra += palabraVerifica[aux];
                aux++;
                /*for(var j=0; j<letraID.length; j++){
                    if(letraID[i]===id)
                        boton.style.backgroundColor="LightBlue";
                        aux--;
                        letraID.splice(aux,1);
                        palabraVerifica.splice(aux,1);
                        palabra.substring(0,aux);
                }*/
            }
        }
    }
}

function matPos() {
    var k = 0;
    for (var i = 0; i < max; i++) {
        for (var j = 0; j < max; j++) {
            matrizPos[k] = i + "," + j;
            k++;
        }
    }
}

function cercano(id) {
    var nid = id.split(',');
    var cer = new Array();
    cer[0] = [parseInt(nid[0]) - 1, parseInt(nid[1]) - 1];
    cer[1] = [parseInt(nid[0]) - 1, parseInt(nid[1])];
    cer[2] = [parseInt(nid[0]) - 1, parseInt(nid[1]) + 1];
    cer[3] = [parseInt(nid[0]), parseInt(nid[1]) - 1];
    cer[4] = [parseInt(nid[0]), parseInt(nid[1]) + 1];
    cer[5] = [parseInt(nid[0]) + 1, parseInt(nid[1]) - 1];
    cer[6] = [parseInt(nid[0]) + 1, parseInt(nid[1])];
    cer[7] = [parseInt(nid[0]) + 1, parseInt(nid[1]) + 1];

    for (var i = 0; i < cer.length; i++) {
        cercanos[i] = cer[i][0] + "," + cer[i][1];
    }
}

function verifica() {
    var encontro;
    var boton;
    for (var j = 0; j < palabras2.length; j++) {
        if (palabras2[j].toUpperCase() === palabra) {
            encontro = 1;
            palabras2.splice(j, 1);
        }
    }
    if (encontro === 1) {
        alert("Encontraste la palabra: " + palabra);
        for (var k = 0; k < palabra.length; k++) {
            boton = document.getElementById(letraID[k]);
            boton.style.backgroundColor = "#FF0000";
        }
    }
    else {
        alert("La palabra: " + palabra + " no está en la lista");
        for (var k = 0; k < palabra.length; k++) {
            boton = document.getElementById(letraID[k]);
            boton.style.backgroundColor = "LightBlue";
        }
    }

    if (palabras2.length === 0) {
        alert("Ganaste");
        window.location.href = "puntaje.html";
    }

    palabraVerifica = new Array();
    letraID = new Array();
    cercanos = new Array();
    aux = 0;
    palabra = "";
    encontro = 0;
    blanca = 0;
}

function deselecciona(id) {
    for (var i = 0; i < letraID.length; i++) {
        if (letraID[i] === id) {
            blanca = 1;
            letraID.splice(id, 1);
        } else {
            return 0;
            blanca = 0;
        }
    }
}


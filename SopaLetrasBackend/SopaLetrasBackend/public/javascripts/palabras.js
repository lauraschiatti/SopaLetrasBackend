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
var validLetras = false;
var listaPalabras = new Array();
var palLista = new Array();

//Validar titulo y descripcion
$(document).ready(function () {
    var titulo;
    var descripcion;

    titulo = $("#titulo");
    descripcion = $("#descripcion");
    titulo.blur(vTitlulo);
    descripcion.blur(vDescripcion);

    function vTitlulo() {
        var tl = $("#titulo").val();

        if (tl === null || tl === "") {
            $("#titulo").addClass("error");
            $("#avisoT").text("Debe tener nombre");
            return false;
        } else {
            $("#titulo").removeClass("error");
            $("#avisoT").text("");
            return true;

        }
    }

    function vDescripcion() {
        var ds = $("#descripcion").val();

        if (ds === null || ds === "") {
            $("#descripcion").addClass("error");
            $("#avisoD").text("Debe tener descripción");
            return false;
        } else {
            $("#descripcion").removeClass("error");
            $("#avisoD").text("");
            return true;

        }
    }

});

function mostrar() {
    if (valid) {
        var cantidad = parseInt(document.getElementById("numero").value);
        var textHTML = "";
        var buttonHTML = "";

        textHTML += " <form id='miLista'>";
        for (i = 0; i < cantidad; i++) {
            textHTML += "<div><input type='text' name='palabras[]' id='palabra" + i + "'maxlength='10' class='palabra' data=" + i + ">";
            textHTML += "<span id='aviso" + i + "' class='aviso' data="+i+"></span></div><br>";
        }
        textHTML += " </form>";

        document.getElementById("mostrar").innerHTML = textHTML;
        buttonHTML += "<input type='submit' onclick='validarSopa();validarRepeticiones();validarLetras();crearMatriz();' value='Crear'>";
        document.getElementById("generar").innerHTML = buttonHTML;
        document.getElementById("checkbox").style.display = 'block';

        var form = $("#miLista");
        var t;
        var l;
        var texto;
        var letrero;

        t='.palabra';
        l='.aviso';
        texto=$(t);
        letrero=$(l);
        texto.blur(vLetras);
    }
}

function vLetras() {
    var tv = $(this).val();
    var letters = /^[A-Za-z]+$/;
    var data = $(this).attr("data");

    if (tv.match(letters) && tv.length >= 2 && tv.length < 10) {
        $(this).removeClass("error");
        $("#aviso" + data).text("");
        return true;

    }
    else {
        if (!tv.match(letters)) {
            $(this).addClass("error");
            $("#aviso" + data).text("Sólo usar letras");
            return false;
        }

        if (tv.length < 2) {
            $(this).addClass("error");
            $("#aviso" + data).text("Mínimo 2 caracteres");
            return false;
        }

        /*if (tv.length > 10) {
            $(this).addClass("error");
            $("#aviso" + data).text("la palabra es muy larga");
            return false;
        }*/
    }


}

function validar() {
    valid = true;
    var x = document.forms["miFormulario"]["titulo"].value;
    var y = document.forms["miFormulario"]["descripcion"].value;

    if (x == null || x == "") {
        //alert("Debe tener nombre");
        valid = false;
        return false;
    }

    if (y == null || y == "") {
        //alert("Debe tener descripción");
        valid = false;
        return false;
    }
}

function validarLetras(){
    validLetras=true;
    var cantidad = parseInt(document.getElementById("numero").value);
    var letters = /^[A-Za-z]+$/;
    for(var i=0; i < cantidad; i++){
        var p='#palabra'+i;
        var x=$(p).val();
        if(!x.match(letters)){
            //alert("Solo puedes usar letras");  
            validLetras=false;
            return false;
        }
    }
     
}

function validarSopa() {
    validSopa = true;
    var cantidad = parseInt(document.getElementById("numero").value);
    for (var i = 0; i < cantidad; i++) {
        var p = '#palabra' + i;
        var x = $(p).val();
        if (x == null || x == "") {
            //alert("no puede haber campos vacíos");
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
    if (validSopa && !repetidas && validLetras) {
        var k = 0;
        var i = 0;
        //Obtener número de palabras
        var n = $("#numero").val();

        //Leer palabras
        for (var con = 0; con < n; con++) {
            var idPal = '#palabra' + con;
            palabras[con] = $(idPal).val();
            palLista[con] = $(idPal).val();
            if (k < palabras[con].length) {
                k = palabras[con].length;
                i = con;
            }
            listaPalabras[con] = 0;
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
    }
    $("#container1").hide();

    //Reemplazar puntos y nickname por valores de localStorage
    document.getElementById("usuario").innerHTML = localStorage.getItem('usuario');
    document.getElementById("u").innerHTML = localStorage.getItem('usuario');
    document.getElementById("puntos").innerHTML = localStorage.getItem('puntos');
            
    $("#container2").show();

    palabras2 = palabras;
    llenarLetrasAleatorias();
    mostrarTitulo();
    mostrarLista();
    mostrarTabla();
    reloj();
}


function mostrarTitulo() {
    var t = $("#titulo").val();;
    var tituloHTML = "";
    tituloHTML += "<h1>" + t.toUpperCase() + "</h1><br>";
    document.getElementById("sopaT").innerHTML = tituloHTML;

    var d = $("#descripcion").val();;
    var descripcionHTML = "";
    descripcionHTML += "<p>" + d.toUpperCase() + "</p><br><br>";
    document.getElementById("sopaD").innerHTML = descripcionHTML;
}

function cambiarLista(pal) {
    for (var x = 0; x < palLista.length; x++) {
        if (palLista[x] === pal) {
            listaPalabras[x] = 1;
        }
        //alert("Probamos con "+listaPalabras[x]+" "+x+" longitud "+palLista.length+" nuevo");

    }
    // alert("volveremos a mostrar la lista2");
    mostrarLista();
}

function mostrarLista() {
    var listaHTML = "";

    for (var x = 0; x < palLista.length; x++) {
        if (listaPalabras[x] === 1) {

            listaHTML += "<p><strike>" + palLista[x] + "</strike></p>";

        } if (listaPalabras[x] === 0) {
            listaHTML += "<p>" + palLista[x] + "</p>";

        }

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

    if (letraID.length === 0)
        cercanos.splice(0, cercanos.length);

    if (letraID[aux - 1] === id) {
        boton.style.backgroundColor = "LightBlue";
        aux--;
        letraID.splice(aux, 1);
        palabraVerifica.splice(aux, 1);
        palabra = palabra.substring(0, aux);
        cercano(id);

    } else {
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
                }
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
            cambiarLista(palabras2[j]);
            encontro = 1;
            palabras2.splice(j, 1);
        }
    }
    if (encontro === 1) {
        $.bootstrapGrowl("ENCONTRASTE LA PALABRA: " + palabra, {
            ele: 'body', // which element to append to
            type: 'danger', // (null, 'info', 'error', 'success')
            offset: { from: 'top', amount: 20 }, // 'top', or 'bottom'
            align: 'right', // ('left', 'right', or 'center')
            width: 'auto', // (integer, or 'auto')
            delay: 5000,
            allow_dismiss: true,
            stackup_spacing: 7 // spacing between consecutively stacked growls.
        });

        for (var k = 0; k < palabra.length; k++) {
            boton = document.getElementById(letraID[k]);
            boton.style.backgroundColor = "#FF0000";
        }
    }
    else {
        $.bootstrapGrowl("La palabra: " + palabra + " no está en la lista", {
            ele: 'body', // which element to append to
            type: 'danger', // (null, 'info', 'error', 'success')
            offset: { from: 'top', amount: 20 }, // 'top', or 'bottom'
            align: 'right', // ('left', 'right', or 'center')
            width: 'auto', // (integer, or 'auto')
            delay: 5000,
            allow_dismiss: true,
            stackup_spacing: 7 // spacing between consecutively stacked growls.
        });
        for (var k = 0; k < palabra.length; k++) {
            boton = document.getElementById(letraID[k]);
            boton.style.backgroundColor = "LightBlue";
        }
    }

    if (palabras2.length === 0) {
        window.location.href = "/ganaste";
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

function reloj(){
    var timer = new Timer();
    var n = $("#numero").val();
    var segundos = n * 60;
    timer.start({countdown: true, startValues: {seconds: segundos}});
    $('#countdownExample .values').html(timer.getTimeValues().toString());
    timer.addEventListener('secondsUpdated', function (e) {
        $('#countdownExample .values').html(timer.getTimeValues().toString());
    });
    timer.addEventListener('targetAchieved', function (e) {
        $('#countdownExample .values').html('¡Se acabó el tiempo!');
        //Mostrar página de que perdist
        window.location.href = "/perdiste";
    });
}

//Caracteres restantes
function contar(valor, id, contador) {
    var max = valor;
    var cadena = document.getElementById(id).value;
    var longitud = cadena.length;

    if (longitud <= max) {
        document.getElementById(contador).value = max - longitud;
    } else {
        document.getElementById(id).value = cadena.substr(0, max);
    }
}

//Desactivar tecla enter en el form. Tomado de http://www.galisteocantero.com/como-desactivar-enter-en-formulario-html/
function anular(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    return (tecla != 13);
}

function mostrarUsuario() {
    var nickname = document.getElementById("u").innerHTML;
    var puntos = document.getElementById("p").innerHTML;

    localStorage.setItem("usuario", nickname);
    localStorage.setItem("puntos", puntos);
}
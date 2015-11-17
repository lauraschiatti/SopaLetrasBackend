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
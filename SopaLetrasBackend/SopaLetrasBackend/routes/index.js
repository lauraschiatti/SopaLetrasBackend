var connectionProvider = require('./Conexion/mySqlConnectionProvider.js');
var localStorage = require('localStorage');

/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index');
};

/*
 * GET register user.
 */

exports.registrarUsuario = function (req, res) {
    res.render('registrar');
};

/*
 * POST register user.
 */

exports.guardarUsuario = function (req, res) {
    
    // Sacar valores del request body
    var nombre = req.body.name;
    var nickname = req.body.nickname;
    var email = req.body.email;
    var contrasena = req.body.password;
    
    //Validar que no exista ese nickname y/o ni correo    
    var conexion = connectionProvider.mySqlConnectionProvider.getSqlConnection();
    var sql = "SELECT * FROM usuarios WHERE nickname=" + conexion.escape(nickname) + "OR correo =" + conexion.escape(email);
    
    if (conexion) {
        conexion.query(sql, function (error, result) {
            if (error) {
                throw error;
            }
            else {
                if (result == "") {
                    console.log("usuario no existe");
                    
                    var conexion2 = connectionProvider.mySqlConnectionProvider.getSqlConnection();
                    var sql = "INSERT INTO usuarios SET ?";
                    
                    //creamos un objeto con los datos a insertar del usuario
                    var usuario = {
                        id : null,
                        nombre : nombre,
                        nickname : nickname,
                        correo : email,
                        contraseña: contrasena
                    };
                    
                    conexion2.query(sql, usuario, function (error, result) {
                        if (error) {
                            throw error;
                        }
                        else {
                            //Devolvemos la última id insertada
                            console.log("ultimo id insertado", result.insertId);
                            
                            localStorage.setItem("nickname", nickname);
                            localStorage.setItem("correo", email);
                            localStorage.setItem("nombre", nombre);
                            localStorage.setItem("sesion", result.insertId);
                            //console.log(localStorage.getItem("sesion"));
                            //console.log(localStorage.getItem("nombre"));

                            //Pasar a la pagina de sopa
                            res.redirect('/sopa');
                        }
                    });
                    
                } else {
                    //Devolvemos el resultado del query
                    console.log(result);
                    
                    //Devolver a la pagina de registro         
                    req.flash('error', 'El usuario ya esta registrado');
                    res.redirect('back');
                }
            }
        });
    }
    
    connectionProvider.mySqlConnectionProvider.closeSqlConnection(conexion);
};

/*
 * GET login user.
 */

exports.mostrarLogin = function (req, res) {
    res.render('login');
};

/*
 * POST login user.
 */

exports.login = function (req, res) {
    // Sacar valores del request body
    var email = req.body.email;
    var contrasena = req.body.password;
    
    //Validar que no exista ese nickname y/o ni correo    
    var conexion = connectionProvider.mySqlConnectionProvider.getSqlConnection();
    var sql = "SELECT * FROM usuarios WHERE correo=" + conexion.escape(email) + "AND contraseña =" + conexion.escape(contrasena);
    
    if (conexion) {
        conexion.query(sql, function (error, result) {
            if (error) {
                throw error;
            }
            else {
                if (result == "") {
                    console.log("Email o contraseña inválidos");
                    
                    //Devolver a la pagina de registro         
                    req.flash('error', 'Email o contraseña inválidos');
                    res.redirect('back');
                   
                } else {
                    var conexion2 = connectionProvider.mySqlConnectionProvider.getSqlConnection();
                    var sql = "SELECT * FROM puntajes WHERE id_usuario=" + conexion2.escape(result[0].id);
                    
                    if (conexion2) {
                        conexion2.query(sql, function (error, result2) {
                            if (error) {
                                throw error;
                            }
                            else {
                                //console.log("Result query2", result2[0].puntos);
                                res.redirect('/sopa');
                                localStorage.setItem("nickname", result[0].nickname);
                                localStorage.setItem("correo", result[0].correo);
                                localStorage.setItem("nombre", result[0].nombre);
                                localStorage.setItem("sesion", result[0].id);
                                //console.log(localStorage.getItem("correo"));
                                //console.log(localStorage.getItem("nombre"));
                            }
                        });
                    }
                }
            }
        });
    }
    
    connectionProvider.mySqlConnectionProvider.closeSqlConnection(conexion);
};

/*
 * GET sopa page.
 */

exports.mostrarSopa = function (req, res) {
    var correo = localStorage.getItem("correo");
    var nickname = localStorage.getItem("nickname");
    var nombre = localStorage.getItem("nombre");
   
    res.render('sopa', {correo: correo, nickname: nickname, nombre: nombre});
};

/*
 * POST save sopa.
 */

exports.guardarSopa = function (req, res) {
    console.log("Entro a guardarSopa", req.body);
    
    var titulo = req.body.titulo;
    var descripcion = req.body.descripcion;
    var numeroPalabras = parseInt(req.body.numero);
    var usuario = localStorage.getItem("sesion");
    localStorage.setItem("NumPalabras", numeroPalabras);
    var condicion = req.body.condicion;
    
    var publica;
    if (condicion == "si") {
        publica = 'si';
    } else {
        publica = 'no';
    }
    
    var conexion = connectionProvider.mySqlConnectionProvider.getSqlConnection();
    var sql = "INSERT INTO sopas SET ?";
    var id_sopa;
    var sopa = {
        id : null,
        titulo : titulo,
        descripcion : descripcion,
        id_usuario : usuario
    };
    
    conexion.query(sql, sopa, function (error, result) {
        if (error) {
            throw error;
        }
        else {
            console.log("Ultima sopa: ", result.insertId);
            localStorage.setItem("sopaActual", result.insertId);
            id_sopa = result.insertId;
        }
    });
    
    connectionProvider.mySqlConnectionProvider.closeSqlConnection(conexion);
    
    /*var i = 0;
    while (i < numeroPalabras) { 
        var conexion2 = connectionProvider.mySqlConnectionProvider.getSqlConnection();
        var sql = "INSERT INTO palabras SET ?";
        
        var palabra = {
            id : null,
            id_sopa : id_sopa,
            palabra : palabras[i]
        };
        
        conexion2.query(sql, palabra, function (error, result) {
            if (error) {
                throw error;
            }
            else {
            }
        });
        connectionProvider.mySqlConnectionProvider.closeSqlConnection(conexion2);

        i++;
    }

    var i = 0;
    while (i < numeroPalabras) {
        console.log("palabras[", i, "] = ", palabras[i]);
        i++;
    }  */
    
};

/*
 * POST save palabras.
 */

exports.guardarPalabras = function (req, res) {
    console.log("Entra a guardarPalabras", req.body);
    
    var numeroPalabras = localStorage.getItem("NumPalabras");
    console.log("Numero de palabras: " + numeroPalabras);
    var conexion2 = connectionProvider.mySqlConnectionProvider.getSqlConnection();
    var sql = "INSERT INTO palabras SET ?";
    console.log("Sopa con ID: " + localStorage.getItem("sopaActual"));
    var palabras = req.body.palabras;
    
    var i = 0;
    while (i < numeroPalabras) {
        var palabra = {
            id : null,
            id_sopa : localStorage.getItem("sopaActual"),
            palabra : palabras[i]
        };
        conexion2.query(sql, palabra, function (error, result) {
            if (error) {
                throw error;
            }
            else {
                console.log("La palabra se insertó correctamente");
            }
        });
        i++;
    }
    
    connectionProvider.mySqlConnectionProvider.closeSqlConnection(conexion2);
    
    var i = 0;
    while (i < numeroPalabras) {
        console.log("palabras[", i, "] = ", palabras[i]);
        i++;
    }
    
};


/*
 * GET ganaste.
 */

exports.mostrarGanaste = function (req, res) {
    res.render('ganaste');
};

/*
 * GET perdiste.
 */

exports.mostrarPerdiste = function (req, res) {
    res.render('perdiste');
};

/*
 * GET perfil.
 */

exports.mostrarPerfil = function (req, res) {
    var correo = localStorage.getItem("correo");
    var nickname = localStorage.getItem("nickname");
    var nombre = localStorage.getItem("nombre");
    var id = localStorage.getItem("sesion");
    
    var numeroSopas = 0;
    var sopas = [];
    
    var conexion = connectionProvider.mySqlConnectionProvider.getSqlConnection();
       
    var sql = "SELECT * FROM sopas WHERE id_usuario=" + conexion.escape(id);

    conexion.query(sql, function (error, results) {
        if (error) {
            throw error;
        }
        else {
            res.render('perfil', { correo: correo, nickname: nickname, nombre: nombre, results: results });
        }
    });
    
    connectionProvider.mySqlConnectionProvider.closeSqlConnection(conexion); 
};


/*
 * GET draw sopa.
 */

exports.dibujaSopa = function (req, res) {
    //console.log("id= " + req.param("id"));
    
    var id_sopa = req.param("id");
        
    var conexion = connectionProvider.mySqlConnectionProvider.getSqlConnection();
    
    var sql = "SELECT * FROM palabras WHERE id_sopa=" + conexion.escape(id_sopa);
    
    conexion.query(sql, function (error, results) {
        if (error) {
            throw error;
        }
        else {
            var conexion2 = connectionProvider.mySqlConnectionProvider.getSqlConnection();
            var sql2 = "SELECT titulo, descripcion FROM sopas WHERE id=" + id_sopa + ";";
            conexion2.query(sql2, function (error, result) {
                if (error) {
                    throw error;
                }
                else {
                    titulo = result[0].titulo;
                    descripcion = result[0].descripcion;
                    res.render('sopaCompartida', { titulo: titulo, descripcion: descripcion, results: results });
                }
            });            
        }
    });
};


/*
 * GET todas las sopas públicas.
 */

exports.verSopasPublicas = function (req, res) {
    var nickname = localStorage.getItem("nickname");
    var id = localStorage.getItem("sesion");
    
    var numeroSopas = 0;
    var sopas = [];
    
    var conexion = connectionProvider.mySqlConnectionProvider.getSqlConnection();
    
    var sql = "SELECT * FROM sopas WHERE id_usuario=" + conexion.escape(id) + "AND publica = 'si'";
    
    conexion.query(sql, function (error, results) {
        if (error) {
            throw error;
        }
        else {
            res.render('sopasPublicas', { nickname: nickname, results: results });
        }
    });
    
    connectionProvider.mySqlConnectionProvider.closeSqlConnection(conexion);
};

/*
 * GET draw sopa.
 */

exports.guardarPuntaje = function (req, res) {
    var puntos = req.param("puntos");
    /*var usuario = localStorage.getItem("sesion");
    console.log("puntos= " + puntos);

    var conexion = connectionProvider.mySqlConnectionProvider.getSqlConnection();
    var sql = "INSERT INTO puntajes SET ?";
    
    //creamos un objeto con los datos a insertar del usuario
    var usuario = {
        id : null,
        id_usuario : usuario,
        puntos : puntos
    };
    
    conexion.query(sql, usuario, function (error, result) {
        if (error) {
            throw error;
        }
        else {
            //Devolvemos la última id insertada
            console.log("ultimo id insertado en puntajes", result.insertId);
        }
    });
                   
    var sql = "SELECT * FROM puntajes WHERE id_usuario=" + conexion.escape(usuario);
    
    conexion.query(sql, function (error, results) {
        if (error) {
            throw error;
        }
        else {
           res.render('puntajes', { results: results });
        }
    });*/
};
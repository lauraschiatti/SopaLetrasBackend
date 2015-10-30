
var connectionProvider = require('./Conexion/mySqlConnectionProvider.js');

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
    var email= req.body.email;
    var contrasena = req.body.password;
       
    //Validar que no exista ese nickname y/o ni correo    
    var conexion = connectionProvider.mySqlConnectionProvider.getSqlConnection();
    var sql = "SELECT * FROM usuarios WHERE nickname=" + conexion.escape(nickname) + "OR correo ="+ conexion.escape(email);
        
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
    var email= req.body.email;
    var contrasena = req.body.password;
       
    //Validar que no exista ese nickname y/o ni correo    
    var conexion = connectionProvider.mySqlConnectionProvider.getSqlConnection();
    var sql = "SELECT * FROM usuarios WHERE correo=" + conexion.escape(email) + "AND contraseña ="+ conexion.escape(contrasena);
        
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
                    //Pasar a la pagina de sopa
                    res.redirect('/sopa');                    
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
    res.render('sopa');
};

/*
 * POST register user.
 */

exports.guardarSopa = function (req, res) {
    console.log("Entro a guardarSopa", req.body);
    
    // Sacar valores del request body
    var titulo = req.body.titulo;
    var descripcion = req.body.descripcion;
    var numeroPalabras = parseInt(req.body.numero);
    //console.log("numeroPalabras", numeroPalabras);
    var palabras = req.body.palabras;
    //console.log("palabras", palabras);
    
    /*var usuario = "1"//Sacarlo de localStorage... almacenarlo al iniciar sesión y eliminarlo al cerrar sesión

    var conexion = connectionProvider.mySqlConnectionProvider.getSqlConnection();
    var sql = "INSERT INTO sopas SET ?";
    var id_sopa;
    //creamos un objeto con los datos a insertar del usuario
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
            //Devolvemos la última id insertada
            console.log("ultimo id de sopa insertado", result.insertId);
            id_sopa = result.insertId;         
        }
    });
    console.log("id_sopa", id_sopa);
    connectionProvider.mySqlConnectionProvider.closeSqlConnection(conexion);*/
    
    /*var i = 0;
    while (i < numeroPalabras) { 
        var conexion2 = connectionProvider.mySqlConnectionProvider.getSqlConnection();
        var sql = "INSERT INTO palabras SET ?";
        
        //creamos un objeto con los datos a insertar del usuario
        var palabra = {
            id : null,
            id_sopa : 1,
            palabra : palabras[i]
        };
        
        conexion2.query(sql, palabra, function (error, result) {
            if (error) {
                throw error;
            }
            else {
                //Devolvemos la última id insertada
                console.log("ultimo id de sopa insertado", result.insertId);
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
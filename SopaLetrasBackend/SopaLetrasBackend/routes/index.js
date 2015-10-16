
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
        
    // pull the form variables off the request body
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
                    //req.flash('error', 'El usuario ya esta registrado');     
                    res.redirect('back');
                }
            }            
        });
    }
    
    connectionProvider.mySqlConnectionProvider.closeSqlConnection(conexion);
};


/*
 * GET sopa page.
 */

exports.sopa = function (req, res) {
    res.render('sopa');
};

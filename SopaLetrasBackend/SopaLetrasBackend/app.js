
/**
 * Module dependencies.
 */
var flash = require('express-flash')
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var Timer = require('./public/javascripts/easytimer.min.js')

var app = express();

// all environments
app.use(express.cookieParser('keyboard cat'));
app.use(express.session({ cookie: { maxAge: 60000 } }));
app.use(flash());
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/usuarios/registrar', routes.registrarUsuario);
app.post('/usuarios/registrar', routes.guardarUsuario);

app.get('/usuarios/login', routes.mostrarLogin);
app.post('/usuarios/login', routes.login);

app.get('/sopa', routes.mostrarSopa);
app.post('/sopa', routes.guardarSopa);

app.get('/ganaste', routes.mostrarGanaste);
app.get('/perdiste', routes.mostrarPerdiste);
app.get('/usuarios/perfil', routes.mostrarPerfil);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

//importar express
const express = require('express');
const routes = require('./routes')
const path = require('path');
const bodyParser = require('body-parser');
//const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//importar las variables del env
require('dotenv').config({ path: 'variables.env' });

//helpers con algunas funciones
const helpers = require('./helpers');

//crear la conexion a la base de datos
const db = require('./config/db');

//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');


db.sync()
    .then(() => console.log('Conectado al servidor de BD'))
    .catch(error => console.log(error));

//crear una aplicacion de express
const app = express();

//Donde cargar los archivos estaticos (css, js, etc)
app.use(express.static('public'));

//habilitar pug 
app.set('view engine', 'pug');


//habiloyar bodyparser para leer los datos de los forms
app.use(bodyParser.urlencoded({ extended: true }));


//anadir la carpeta de vistas
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

app.use(cookieParser());

//para mantener la session entre diferentes paginas sin vovler a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());


//pasar var dump a la aplicacion
app.use((req, res, next) => {

    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user } || null;

    console.log(res.locals.usuario);

    next();
});




app.use('/', routes());


//app.listen(3000);
//Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando...');
})
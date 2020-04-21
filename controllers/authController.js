const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');

//autenticar al usuario
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Debe ingresar ambos campos'
});


//funcion para ver si el usuario esta logeado o no

exports.usuarioAutenticado = (req, res, next) => {
    //si esta autenticado adelante
    if (req.isAuthenticated()) {
        return next();
    }

    //si no esta logeado, redirigir al form 
    return res.redirect('/iniciar-sesion');
}


//funcion para cerrar sesiones
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}


//genera un token si el usuario es valido
exports.enviarToken = async(req, res) => {
    //verificar que el usuario exista

    const { email } = req.body;
    const usuario = await Usuarios.findOne({ where: { email } });

    //si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta')
            // res.render('reestablecer', {
            //     nombrePagina: 'Reestablecer tu Contrasena',
            //     mensajes: req.flash()
            // })  // es lo mismo que lo siguente:
        res.redirect('/reestablecer');
    }

    //usuario si existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //guardar el token y expiracion en la base de datos con save

    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //console.log(`url generada: ${resetUrl}`);
    //console.log(`usuario ctr: ${usuario}`);
    //envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password' //el archiv pug en views/emails
    });

    //terminar
    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}


exports.validarToken = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    //formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer el password'
    })


}

//cambiar el password por uno nuevo
exports.actualizarPassword = async(req, res) => {

    //verificar el token valido y fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    })

    //verificamos si el usuario existe
    if (!usuario) {
        req.flash('error', 'No Valido');
        res.redirect('/reestablecer');
    }

    //hashear el nuevo passwrd
    usuario.token = null;
    usuario.expiracion = null;
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    //guardar el cambio en la bd
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

}
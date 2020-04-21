// const flash = require('connect-flash')
const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    // res.send("controler usuarios");

    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en UpTask'
    })
}

exports.formIniciarSesion = (req, res) => {
    // res.send("controler usuarios");

    //console.log(res.locals.mensajes);
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Inicia sesion en UpTask',
        error
    })
}



exports.crearCuenta = async(req, res) => {
    // res.send('Enviaste el form de  usuario');
    // console.log(req.body);

    //leer los datos del form'
    const { email, password } = req.body;

    try {
        //crear el usuario
        await Usuarios.create({
            email,
            password
        })

        //crear una url para confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto de usuario pra el mail
        const usuario = {
                email
            }
            //enviar el mail
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask!!!',
            confirmarUrl,
            archivo: 'confirmar-cuenta' //el archiv pug en views/emails
        });

        //redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta')
        res.redirect('iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en UpTask',
            email,
            password
        })
    }

}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contrasena'
    })
}

//cambia el estado de una cuenta
exports.confirmarCuenta = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    //si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No Valido');
        res.redirect('/crear-cuenta');
    }

    //si existe el usuario
    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

}
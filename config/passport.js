const passport = require('passport');
const LocalEstrategy = require('passport-local');


//Referencia al modelode usuarios
const Usuarios = require('../models/Usuarios');

//local strategy :  Login con credenciales propios (usuario y password)


passport.use(
    new LocalEstrategy(
        //por default passport espera usuario y password
        { /* Como se los tiene en el modelo*/
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });

                //el usuario existe, pero passoword incorrecto

                // console.log(usuario);

                if (!usuario.verificarPassword(password)) {
                    // console.log('pass incorecto');
                    return done(null, false, {
                        message: 'El password es incorrecto'
                    })
                }

                //el usuario si existe y el password es correcto
                // console.log('Usr y pass corrctos');

                return done(null, usuario);

            } catch (error) {
                //el usuario no existe
                // console.log('!!!error en catch pass.js');

                return done(null, false, {
                    message: 'La cuenta no existe'
                })
            }
        }
    )
);


//serializar  el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

//desserializar  el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});


module.exports = passport;
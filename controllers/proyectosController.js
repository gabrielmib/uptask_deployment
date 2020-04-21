const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


exports.proyectosHome = async(req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos

    });
}

exports.formularioProyecto = async(req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    res.render('nuevoProyecto', {

        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async(req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Se debe ingresar un nombre al proyecto' })
    }

    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto Post Error',
            errores,
            proyectos
        })
    } else {
        //no hay errores 
        //insertar en la base de datos
        //

        const usuarioId = res.locals.usuario.id;

        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');

    }


}

exports.proyectoPorUrl = async(req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);


    if (!proyecto) return next();

    //Consultar las tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        // include: [
        //     { model: Proyectos }
        // ]
    });



    //render la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del proyecto',
        proyecto,
        proyectos,
        tareas
    });
}


exports.formularioEditar = async(req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}



exports.actualizarProyecto = async(req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Se debe ingresar un nombre al proyecto' })
    }

    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto Post Error',
            errores,
            proyectos
        })
    } else {
        //no hay errores 
        //insertar en la base de datos
        //
        await Proyectos.update({ nombre: nombre }, {
            where: {
                id: req.params.id
            }
        });
        res.redirect('/');

    }


}


exports.eliminarProyecto = async(req, res, next) => {

    // con req se tiene query o params, ambos contienen la informacion
    //console.log(req.query);
    const { urlProyecto } = req.query;

    const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });

    if (!resultado) {
        return next();
    }
    res.status(200).send('Proyecto eliminado correctamente');
}
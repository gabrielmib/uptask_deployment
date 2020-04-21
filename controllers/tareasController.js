const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async(req, res, next) => {
    //se obtiene el proyecto actual
    const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });

    //proyectos para l vista     
    const proyectos = await Proyectos.findAll();
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        // include: [
        //     { model: Proyectos }
        // ]
    });


    //se obtiene el valor del input de tarea
    const { tarea } = req.body;

    //-g code
    let errores = [];

    if (!tarea) {
        errores.push({ 'texto': 'Se debe ingresar un nombre a la tarea' })
    }

    if (errores.length > 0) {
        res.render('tareas', {
            nombrePagina: 'Tareas del proyecto',
            proyecto,
            proyectos,
            errores,
            tareas
        })
    } else {
        //no hay errores 
        //insertar en la base de datos
        //
        //estado 0 = incompleto y id del proyecto
        const estado = 0;
        const proyectoId = proyecto.id;

        //insertar en la bd
        const resultado = await Tareas.create({ tarea, estado, proyectoId });

        if (!resultado) {
            return next();
        }
        //redireccionar
        res.redirect(`/proyectos/${req.params.url}`);
    }

    //--g

}


exports.cambiarEstadoTarea = async(req, res, next) => {

    // console.log(req.params); //para el method patch se deb usar req.params, no req.body
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id: id } })
        //console.log(tarea);

    //cambiar el estado

    let estado = 0;

    if (tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;

    const resultado = await tarea.save();
    if (!resultado) return next();
    res.status(200).send('Registro actualizado');

}

exports.eliminarTarea = async(req, res, next) => {

    //console.log(req.params);

    const { id } = req.params;

    //eliminar la tarea
    const resultado = await Tareas.destroy({ where: { id } });

    if (!resultado) return next();

    res.status(200).send('Se ha eliminado la tarea correctamente.')
}
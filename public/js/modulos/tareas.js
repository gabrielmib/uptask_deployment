import axios from "axios";
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {

            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            console.log(idTarea);

            //request hacia /tareas/:id

            const url = `${location.origin}/tareas/${idTarea}`;

            //console.log(url);
            axios.patch(url, { idTarea })
                .then(function(respuesta) {
                    //console.log(respuesta);
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                })


        }

        if (e.target.classList.contains('fa-trash')) {
            //console.log('Eliminando...');
            const tareaHTML = e.target.parentElement.parentElement,
                idTarea = tareaHTML.dataset.tarea;

            Swal.fire({
                title: '¿Estas seguro de eliminar esta tarea?',
                text: "Una tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'No, cancelar'
            }).then((result) => {
                if (result.value) {
                    // console.log('Eliminando registro...');

                    const url = `${location.origin}/tareas/${idTarea}`;
                    //enviar el delete mediante axios    
                    axios.delete(url, { params: { idTarea } })
                        .then(function(respuesta) {
                            if (respuesta.status === 200) {
                                //eliminar el elemento de la pagina sin recargar
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                //Opcional mandar una alerta

                                Swal.fire(
                                    'Tarea eliminada',
                                    respuesta.data,
                                    'success'
                                )

                                actualizarAvance();
                            }
                        })
                        .catch(() => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Hubo un error',
                                text: 'No se pudo completar la accion.',
                                footer: '<a href="#">Reportar este error</a>'
                            })
                        })
                }
            })

        }


    });
}


export default tareas;
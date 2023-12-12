import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

window.addEventListener('load', initHandlers);
const btnCrear = document.getElementById('btnCrear');
const btnMod = document.getElementById('btnModificar');
const selectCategoriaHora = document.getElementById('selectCategoriaHora');

function initHandlers() {

    getTurnos();
    swiperInit();
    /* Crear turnos POST */
    btnCrear.addEventListener('click', (e) => {
        e.preventDefault();
        crearTurno();
    });

    const fechaSeleccionada = document.getElementById('fechaSeleccionada')
    fechaSeleccionada.min = obtenerFechaActual();

    /* event Change */
    selectCategoriaHora.addEventListener('change', marcarHorarioCeldas);

    fechaSeleccionada.addEventListener('change', () => {
        seleccionarFecha('fechaSeleccionada');
        getHoras();
    });

    /* btnPUT */
    btnMod.addEventListener('click', (e) => {
        e.preventDefault();
        actualizarTurno();

    })
}


function swiperInit() {
    var swiper = new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: ".swiper-pagination",
        },
    });
}


/* Funcion para obtener la fecha actual */
function obtenerFechaActual() {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

/* Funcion que limita la seleccion de fechas sabados y domingos y deja elegir un rango a 15 dias */
function seleccionarFecha(fechaElegida) {

    const fechaSeleccionada = document.getElementById(fechaElegida);
    const horasContainer = document.getElementById('horasContainer');

    const valor = fechaSeleccionada.value;
    const fechaActual = new Date();
    const diaSeleccionado = new Date(valor).getDay();
    const fechaSeleccionadaValue = new Date(fechaSeleccionada.value);
    const diferenciaEnDias = Math.floor((fechaSeleccionadaValue - fechaActual) / (1000 * 60 * 60 * 24));


    if (diaSeleccionado === 5 || diaSeleccionado === 6) {
        message('Error', "No se permite seleccionar sábados ni domingos.", 'error');
        fechaSeleccionada.value = '';
        horasContainer.classList.add('d-none');
    }
    else if (diferenciaEnDias > 15) {
        message('Error', "Solo puedes seleccionar fechas hasta 15 días en el futuro.", 'error');
        fechaSeleccionada.value = '';
        horasContainer.classList.add('d-none');

    } else {
        horasContainer.classList.remove('d-none');

    }
    if (fechaElegida == 'fechaSeleccionada') {
        document.getElementById('fechaMostrada').value = fechaSeleccionada.value;

    }
}

/* Funcion para llenar el select con las option de las horas traidas de la api */
function selectHoras(data, idhora, fecha) {

    const turnos = getFromLocalStorage('turnos');

    const selectCategoriaHora = document.getElementById(idhora);
    selectCategoriaHora.innerHTML = '';

    const fechaSeleccionadaInput = document.getElementById(fecha);
    const fechaSeleccionadaString = fechaSeleccionadaInput.value;

    const fechaSeleccionadaArray = fechaSeleccionadaString.split("-");
    const fechaSeleccionada = new Date(fechaSeleccionadaArray[0], fechaSeleccionadaArray[1] - 1, fechaSeleccionadaArray[2]);
    const fechaActual = new Date();

    data.forEach(item => {
        const horaElemento = parseInt(item.nombre_hora);

        const fechaHoraSeleccionada = new Date(fechaSeleccionada);
        fechaHoraSeleccionada.setHours(horaElemento);
        const option = document.createElement('option');

        const horaYaSeleccionada = turnos.some(turno => {
            const fechaTurno = new Date(turno.fecha_turno);
            return fechaTurno.getDate() === fechaSeleccionada.getDate() && turno.id_hora === item.id_hora;
        });

        if (fechaHoraSeleccionada < fechaActual || horaYaSeleccionada) {
            option.value = `${item.id_hora}`;
            option.textContent = `${item.nombre_hora}`;
            option.disabled = true;

        } else {
            option.value = `${item.id_hora}`;
            option.textContent = `${item.nombre_hora}`;
        }
        selectCategoriaHora.appendChild(option);

    });
}


/* Funcion para marcar el horario en las celdas desde el select */
function marcarHorarioCeldas() {
    const selectCategoriaHora = document.getElementById('selectCategoriaHora');
    const opcionSeleccionada = selectCategoriaHora.options[selectCategoriaHora.selectedIndex];
    const horaSeleccionada = opcionSeleccionada.textContent.trim();

    const celdas = document.getElementsByClassName('cell');
    for (const celda of celdas) {
        celda.classList.remove('bg-success', 'text-white');
    }

    for (const celda of celdas) {
        const horaCelda = celda.querySelector('p').textContent.trim();

        if (horaCelda === horaSeleccionada) {
            celda.classList.add('bg-success', 'text-white');
            break;
        }
    }
}

/* Funcion que genera dinamicamente las horas y verifica si las opciones estan disponibles */
function llenarRangoHorario(data) {
    const horasContainer = document.getElementById('horasContainer');
    horasContainer.innerHTML = '';

    const fechaSeleccionadaInput = document.getElementById('fechaSeleccionada');

    const turnos = getFromLocalStorage('turnos');

    const fechaSeleccionadaString = fechaSeleccionadaInput.value;
    const fechaSeleccionadaArray = fechaSeleccionadaString.split("-");
    const fechaSeleccionada = new Date(fechaSeleccionadaArray[0], fechaSeleccionadaArray[1] - 1, fechaSeleccionadaArray[2]);
    const fechaActual = new Date();

    data.forEach(item => {

        const horaElemento = parseInt(item.nombre_hora);
        const col = document.createElement('div');
        col.classList.add('col-md-3', 'my-1', 'px-2');
        const divHora = document.createElement('div');
        divHora.classList.add('cell', 'py-1');

        const fechaHoraSeleccionada = new Date(fechaSeleccionada);
        fechaHoraSeleccionada.setHours(horaElemento);

        const horaYaSeleccionada = turnos.some(turno => {
            const fechaTurno = new Date(turno.fecha_turno);
            return fechaTurno.getDate() === fechaSeleccionada.getDate() && turno.id_hora === item.id_hora;
        });

        if (fechaHoraSeleccionada < fechaActual || horaYaSeleccionada) {
            divHora.classList.add('disabled');

        } else {
            divHora.addEventListener('click', function () {
                const celdas = document.getElementsByClassName('cell');
                for (const celda of celdas) {
                    celda.classList.remove('bg-success', 'text-white', 'd-none');
                }

                divHora.classList.add('bg-success', 'text-white');

                const selectCategoriaHora = document.getElementById('selectCategoriaHora');
                const horaSeleccionada = `${item.id_hora}`;
                const opcionSeleccionada = selectCategoriaHora.querySelector(`option[value="${horaSeleccionada}"]`);

                if (opcionSeleccionada) {
                    selectCategoriaHora.value = horaSeleccionada;
                }
            })
        }
        divHora.innerHTML = `
                <p>${item.nombre_hora}</p>
            `;
        col.appendChild(divHora);
        horasContainer.appendChild(col);
    })

}

/* POST */
function crearTurno() {

    const form_fecha = document.getElementById('form-fecha');
    const form_turno = document.getElementById('form-turno');
    const celdasContainer = document.getElementById('horasContainer');

    const turno = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        mail: document.getElementById('mail').value,
        fecha_turno: document.getElementById('fechaMostrada').value,
        id_hora: document.getElementById('selectCategoriaHora').value,
        tipo_corte: document.getElementById('selectCategoriaCorte').value
    }

    fetch('http://localhost:8080/web-app/api/turnos', {
        method: 'POST',
        body: JSON.stringify(turno),
    }).then(response => response.json())
        .then(json => {
            console.log(json);
            getTurnos();
            form_fecha.reset();
            form_turno.reset();
            celdasContainer.innerHTML = '';
            message("Turno creado", "El turno fue creado exitosamente", "success")

        })
        .catch(err => message('Hubo un error', `Error al crear el turno, verifique los datos ingresados`, "error"));

}

/* Funcion para crear un mensaje generico */
function message(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

/* GET */
function getHoras() {
    const resp = fetch('http://localhost:8080/web-app/api/horas');

    resp.then(response => response.json())
        .then(data => {
            saveTurnosInLocalStorage('horas', data);
            selectHoras(data, 'selectCategoriaHora', 'fechaSeleccionada');

            llenarRangoHorario(data);
        })
        .catch(err => message('Hubo un error', `${err}`, "error"));
}

function getTurnos() {
    const resp = fetch('http://localhost:8080/web-app/api/turnos');

    resp.then(response => response.json())
        .then(data => {
            mostrarLista(data)
        })
        .catch(err => message('Hubo un error', `${err}`, "error"));
}

function mostrarLista(data) {
    const horas = getFromLocalStorage('horas')
    saveTurnosInLocalStorage('turnos', data);
    const turnos = data;
    console.log(data);
    let rows = '';
    for (let turno of turnos) {
        const fechaTurnoArray = turno.fecha_turno;
        const fechaTurno = `${fechaTurnoArray[2]}/${fechaTurnoArray[1]}/${fechaTurnoArray[0]}`;
        rows += `
        
        <tr>
            <th scope="row">${turno.id}</th>
                <td>${turno.nombre} ${turno.apellido}</td>
                <td>${turno.mail}</td>
                <td>${fechaTurno} ${turno.nombre_hora}</td>
                <td>${turno.tipo_corte}</td>
                <td>
                    <button class="btnEditar btn btn-primary" data-id="${turno.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">Modificar</button>
                    <button class="btnCancelar btn btn-danger" data-id="${turno.id}">Borrar</button>
                </td>
        `
    }
    document.getElementById('turnosRows').innerHTML = rows;

    const btnCancelar = document.getElementsByClassName('btnCancelar');
    for (const btnCancel of btnCancelar) {
        btnCancel.addEventListener('click', () => {
            const idCancelar = btnCancel.getAttribute('data-id');
            console.log(idCancelar);
            cancelarTurno(idCancelar);
        })
    }

    const btnModificar = document.getElementsByClassName('btnEditar');
    for (const btnEditar of btnModificar) {
        btnEditar.addEventListener('click', () => {
            const idEditar = btnEditar.getAttribute('data-id');
            editarTurno(idEditar);
            const fechaSeleccionadaNew = document.getElementById('fechaSeleccionadaNew')
            fechaSeleccionadaNew.min = obtenerFechaActual();

            fechaSeleccionadaNew.addEventListener('change', () => {
                selectHoras(horas, 'selectCategoriaHoraNew', 'fechaSeleccionadaNew')
            })
        })

    }
}

function getFromLocalStorage(data) {
    const obj = localStorage.getItem(data);
    if (obj)
        return JSON.parse(obj);
    return [];
}

function saveTurnosInLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function removerTurnoSelect() {
    localStorage.removeItem('turnoBuscado');
}

function getTurnoSelect() {
    const obj = localStorage.getItem('turnosBuscados');
    if (obj)
        return JSON.parse(obj);
    return [];
}

function actualizarTurno() {
    const turnoSelect = getTurnoSelect();
    console.log(turnoSelect);
    if (!turnoSelect) {
        return;
    }
    const nombre = document.getElementById('nombreNew').value;
    const apellido = document.getElementById('apellidoNew').value;
    const mail = document.getElementById('mailNew').value;
    const fecha_turno = document.getElementById('fechaSeleccionadaNew').value
    const id_hora = document.getElementById('selectCategoriaHoraNew').value;
    console.log(id_hora);
    const nombre_hora = document.getElementById('selectCategoriaHoraNew').textContent;
    const tipo_corte = document.getElementById('selectCategoriaNew').value;

    const turno = {
        nombre,
        apellido,
        mail,
        fecha_turno,
        id_hora,
        nombre_hora,
        tipo_corte,
    }

    Swal.fire({
        title: "Estas seguro?",
        text: "No vas a poder revertir tu decisión!",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Modificar!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:8080/web-app/api/turnos?id=${turnoSelect.id}`, {
                method: 'PUT',
                body: JSON.stringify(turno),
            }).then(response => response)
                .then(json => {
                    removerTurnoSelect();
                    getTurnos();
                })
                .catch(err => message('Hubo un error', `${err}`, "error"));
            Swal.fire({
                title: "Modificado",
                text: `El turno con id ${turnoSelect.id} fue modificado exitosamente`,
                icon: "success"
            });
        }
    });

}
function editarTurno(id) {
    const turnos = getFromLocalStorage('turnos');
    const turnosBuscados = turnos.find(o => o.id == id)
    const fechaSeleccionadaArray = turnosBuscados.fecha_turno;
    const fechaSeleccionada = new Date(fechaSeleccionadaArray[0], fechaSeleccionadaArray[1] - 1, fechaSeleccionadaArray[2]);

    const fechaFormateada = fechaSeleccionada.toISOString().split('T')[0];


    document.getElementById('nombreNew').value = turnosBuscados.nombre;
    document.getElementById('apellidoNew').value = turnosBuscados.apellido;
    document.getElementById('mailNew').value = turnosBuscados.mail;
    document.getElementById('fechaSeleccionadaNew').value = fechaFormateada;
    document.getElementById('selectCategoriaNew').value = turnosBuscados.tipo_corte;

    saveTurnosInLocalStorage('turnosBuscados', turnosBuscados);
}

function cancelarTurno(id) {

    Swal.fire({
        title: "Estas seguro?",
        text: "No vas a poder revertir tu decisión!",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Borralo!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:8080/web-app/api/turnos?id=${id}`, {
                method: 'DELETE',
            }).then(response => response)
                .then(json => {
                    getTurnos();
                })
                .catch(err => message('Hubo un error', `${err}`, "error"));
            Swal.fire({
                title: "Borrado",
                text: `El turno con id ${id} fue borrado exitosamente`,
                icon: "success"
            });
        }
    });
}


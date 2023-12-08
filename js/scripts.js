import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

window.addEventListener('load', initHandlers);
const btnCrear = document.getElementById('btnCrear');

function initHandlers() {
    getTurnos();
    swiperInit();
    btnCrear.addEventListener('click', (e) => {
        e.preventDefault();
        crearTurno();
    });
    const fechaSeleccionada = document.getElementById('fechaSeleccionada')
    fechaSeleccionada.min = obtenerFechaActual();
    

    const selectCategoriaHora = document.getElementById('selectCategoriaHora');

    selectCategoriaHora.addEventListener('change', marcarHoraSeleccionada);
    fechaSeleccionada.addEventListener('change', () => {
        seleccionarFecha();
        llenarRangoHorario();
        selectHoras();
    });

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

function obtenerFechaActual() {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function seleccionarFecha() {

    const fechaSeleccionada = document.getElementById('fechaSeleccionada')
    const valor = fechaSeleccionada.value;
    const fechaActual = new Date();
    const diaSeleccionado = new Date(valor).getDay();
    const fechaSeleccionadaValue = new Date(fechaSeleccionada.value);
    const diferenciaEnDias = Math.floor((fechaSeleccionadaValue - fechaActual) / (1000 * 60 * 60 * 24));

    if (diaSeleccionado === 5 || diaSeleccionado === 6) {
        alert("No se permite seleccionar sábados ni domingos.");
        fechaSeleccionada.value = '';
    }

    if (diferenciaEnDias > 15) {
        alert("Solo puedes seleccionar fechas hasta 15 días en el futuro.");
        fechaSeleccionada.value = '';
    }
    document.getElementById('fechaMostrada').value = valor;
}

function llenarRangoHorario() {
    const horasContainer = document.getElementById('horasContainer');
    horasContainer.innerHTML = '';

    const fechaSeleccionadaInput = document.getElementById('fechaSeleccionada');
    const fechaSeleccionadaString = fechaSeleccionadaInput.value;
    const fechaSeleccionadaArray = fechaSeleccionadaString.split("-");
    const fechaSeleccionada = new Date(fechaSeleccionadaArray[0], fechaSeleccionadaArray[1] - 1, fechaSeleccionadaArray[2]);
    const fechaActual = new Date();

    for (let hora = 9; hora <= 18; hora++) {
        const horaFormato12 = (hora > 12) ? hora - 12 : hora;
        const amPm = (hora >= 12) ? 'PM' : 'AM';

        const col = document.createElement('div');
        col.classList.add('col-md-3', 'col-4', 'my-1', 'px-2');
        const divHora = document.createElement('div');
        divHora.classList.add('cell', 'py-1');

        const fechaHoraSeleccionada = new Date(fechaSeleccionada);
        fechaHoraSeleccionada.setHours(hora);

        if (fechaHoraSeleccionada <= fechaActual) {
            divHora.classList.add('disabled');
        } else {
            divHora.addEventListener('click', function () {
                const celdas = document.getElementsByClassName('cell');
                for (const celda of celdas) {
                    celda.classList.remove('bg-success', 'text-white');
                }

                divHora.classList.add('bg-success', 'text-white');

                const selectCategoriaHora = document.getElementById('selectCategoriaHora');
                const horaSeleccionada = `${horaFormato12}:00 ${amPm}`;
                const opcionSeleccionada = selectCategoriaHora.querySelector(`option[value="${horaSeleccionada}"]`);

                if (opcionSeleccionada) {
                    selectCategoriaHora.value = horaSeleccionada;
                }
            });

        }
        divHora.innerHTML = `
                <p>${horaFormato12}:00 ${amPm}</p>
            `;
        col.appendChild(divHora);
        horasContainer.appendChild(col);
    }
}

function selectHoras() {
    const selectCategoriaHora = document.getElementById('selectCategoriaHora');
    selectCategoriaHora.innerHTML = '';

    const fechaSeleccionadaInput = document.getElementById('fechaSeleccionada');
    const fechaSeleccionadaString = fechaSeleccionadaInput.value;

    const fechaSeleccionadaArray = fechaSeleccionadaString.split("-");
    const fechaSeleccionada = new Date(fechaSeleccionadaArray[0], fechaSeleccionadaArray[1] - 1, fechaSeleccionadaArray[2]);
    const fechaActual = new Date();

    for (let hora = 9; hora <= 18; hora++) {
        const amPm = hora >= 12 ? 'PM' : 'AM';
        const horaFormato12 = hora > 12 ? hora - 12 : hora;

        const fechaHoraSeleccionada = new Date(fechaSeleccionada);
        fechaHoraSeleccionada.setHours(hora);

        if (fechaHoraSeleccionada > fechaActual) {
            const option = document.createElement('option');
            option.value = `${horaFormato12}:00 ${amPm}`;
            option.textContent = `${horaFormato12}:00 ${amPm}`;
            selectCategoriaHora.appendChild(option);
        }
    }
}

function marcarHoraSeleccionada() {
    const selectCategoriaHora = document.getElementById('selectCategoriaHora');
    const horaSeleccionada = selectCategoriaHora.value;

    const celdas = document.getElementsByClassName('cell');
    for (const celda of celdas) {
        celda.classList.remove('bg-success', 'text-white');
    }

    for (const celda of celdas) {
        const horaCelda = celda.querySelector('p').textContent;

        if (horaCelda === horaSeleccionada) {
            celda.classList.add('bg-success', 'text-white');
            break;
        }
    }
}

function crearTurno() {

    const turno = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        mail: document.getElementById('mail').value,
        fecha_turno: document.getElementById('fechaMostrada').value,
        hora_turno: document.getElementById('selectCategoriaHora').value,
        tipo_corte: document.getElementById('selectCategoriaCorte').value
    }

    fetch('http://localhost:8080/web-app/api/turnos', {
        method: 'POST',
        body: JSON.stringify(turno),
    }).then(response => response.json())
        .then(json => {
            alert(`alta exitosa: ${json.id}`)
        })
        .catch(err => console.log(err));

}

function getTurnos() {
    const resp = fetch('http://localhost:8080/web-app/api/turnos');

    resp.then(response => response.json())
        .then(data => mostrarLista(data))
        .catch(err => console.log(err));
}

function mostrarLista(data) {

    saveTurnosInLocalStorage(data);

    const turnos = data;
    //console.log(turnos);
    let rows = '';
    for (let turno of turnos) {
        //console.log(turno);
        rows += `
        <tr>
            <th scope="row">${turno.id}</th>
                <td>${turno.nombre} ${turno.apellido}</td>
                <td>${turno.mail}</td>
                <td>${turno.fecha_turno} ${turno.hora_turno}</td>
                <td>${turno.tipo_corte}</td>
                <td>
                    <button class="btnEditar btn btn-primary" data-id="${turno.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">Modificar</button>
                    <button class="btnCancelar" data-id="${turno.id}">Cancelar</button>
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
            console.log(idEditar);
            editarTurno(idEditar);
        })
    }
}

function getTurnosFromLocalStorage() {
    const turnos = localStorage.getItem('turnos');
    if(turnos)
        return JSON.parse(turnos);
    return [];
}

function saveTurnosInLocalStorage(data) {
    localStorage.setItem('turnos', JSON.stringify(data));
}

function editarTurno(id) {
    const turnos = getTurnosFromLocalStorage();
    console.log(turnos)
    const turnosBuscados = turnos.find(o => o.id == id)

    console.log(turnosBuscados);
    document.getElementById('nombreNew').value = turnosBuscados.nombre;
    document.getElementById('apellidoNew').value = turnosBuscados.apellido;
    document.getElementById('mailNew').value = turnosBuscados.mail;
    const fechaSeleccionadaNew = document.getElementById('fechaSeleccionadaNew');
    fechaSeleccionadaNew.min = obtenerFechaActual();
    
    document.getElementById('selectCategoriaHoraNew').value = turnosBuscados.hora_turno;
    document.getElementById('selectCategoriaCorteNew').value = turnosBuscados.tipo_corte;

}
function cancelarTurno(id) {
    if (!confirm('SEGURO?')) {
        return;
    }

    fetch(`http://localhost:8080/web-app/api/turnos?id=${id}`, {
        method: 'DELETE',
    }).then(response => response)
        .then(json => {
            console.log(json);
            alert(`baja exitosa: ${id}`);
            getTurnos();
        })
        .catch(err => console.log(err));
}


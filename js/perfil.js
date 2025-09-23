import { getUserFromStorage } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();

    const editProfileForm = document.getElementById('edit-profile-form');
    editProfileForm.addEventListener('submit', handleUpdateProfile);

    const changePasswordForm = document.getElementById('change-password-form');
    changePasswordForm.addEventListener('submit', handleChangePassword);
});

function loadProfileData() {
    const session = getUserFromStorage();
    if (!session || !session.user) {
        // Doble seguridad, aunque la página ya está protegida
        window.location.href = 'login.html';
        return;
    }

    const { name, email } = session.user;
    document.getElementById('profile-name').textContent = name;
    document.getElementById('profile-email').textContent = email;
    document.getElementById('newName').value = name;

    // Cargar y mostrar los turnos del usuario
    loadUserAppointments(email);
}

async function loadUserAppointments(userEmail) {
    try {
        // En un caso real, la API debería permitir filtrar por usuario.
        // Aquí, traemos todos y filtramos en el frontend.
        const response = await fetch('http://localhost:8080/web-app/api/turnos');
        if (!response.ok) {
            throw new Error('No se pudieron cargar los turnos.');
        }
        const allTurnos = await response.json();

        const userTurnos = allTurnos.filter(turno => turno.mail === userEmail);

        const turnosTableBody = document.getElementById('turnos-perfil-rows');
        if (userTurnos.length === 0) {
            turnosTableBody.innerHTML = '<tr><td colspan="2">No tienes turnos reservados.</td></tr>';
            return;
        }

        let rows = '';
        for (let turno of userTurnos) {
            const fechaTurnoArray = turno.fecha_turno;
            const fechaTurno = `${fechaTurnoArray[2]}/${fechaTurnoArray[1]}/${fechaTurnoArray[0]}`;
            rows += `
                <tr>
                    <td>${fechaTurno} ${turno.nombre_hora}</td>
                    <td>${turno.tipo_corte}</td>
                </tr>
            `;
        }
        turnosTableBody.innerHTML = rows;

    } catch (error) {
        console.error('Error fetching appointments:', error);
        document.getElementById('turnos-perfil-rows').innerHTML = '<tr><td colspan="2">Error al cargar los turnos.</td></tr>';
    }
}

function handleUpdateProfile(e) {
    e.preventDefault();
    const newName = document.getElementById('newName').value;
    const session = getUserFromStorage();

    if (!session) return;

    // Simulación de llamada a API
    console.log(`Actualizando nombre a: ${newName}`);

    // Actualizar datos en localStorage
    session.user.name = newName;
    localStorage.setItem('jerry_user_session', JSON.stringify(session));

    // Actualizar vista y mostrar mensaje
    document.getElementById('profile-name').textContent = newName;
    Swal.fire('¡Éxito!', 'Tu nombre ha sido actualizado.', 'success');
}

function handleChangePassword(e) {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    // Simulación de llamada a API
    console.log('Intentando cambiar la contraseña.');

    // En una app real, aquí verificaríamos la contraseña actual contra el backend.
    // Por ahora, solo mostramos un mensaje de éxito.
    if (!currentPassword || !newPassword) {
        Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
        return;
    }

    Swal.fire('¡Éxito!', 'Tu contraseña ha sido cambiada.', 'success');
    e.target.reset(); // Limpiar el formulario
}

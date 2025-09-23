// Asumimos que SweetAlert2 (Swal) está disponible globalmente desde el HTML.

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    updateNav();
});

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simulación de una llamada a la API
    // En un caso real, aquí iría un fetch a http://localhost:8080/api/login
    console.log(`Intentando iniciar sesión con ${email}`);

    // Simulación de respuesta del backend
    // Asumimos que la API devuelve un objeto con datos de usuario y un token
    // Y que el email 'admin@jerry.com' es un administrador
    let mockUser, mockToken;
    if (email === 'admin@jerry.com' && password === 'admin123') {
        mockUser = { id: 1, name: 'Admin Jerry', email: 'admin@jerry.com', role: 'Admin' };
        mockToken = 'fake-admin-token-xyz';
    } else if (password === 'user123') { // Para cualquier otro email, asumimos rol de cliente
        mockUser = { id: 2, name: 'Cliente Ejemplo', email: email, role: 'Cliente' };
        mockToken = 'fake-client-token-abc';
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Credenciales incorrectas. Inténtalo de nuevo.',
            icon: 'error'
        });
        return;
    }

    saveUserToStorage({ user: mockUser, token: mockToken });

    await Swal.fire({
        title: '¡Bienvenido!',
        text: `Has iniciado sesión como ${mockUser.name}.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });

    window.location.href = 'index.html';
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    if (password !== passwordConfirm) {
        Swal.fire({
            title: 'Error',
            text: 'Las contraseñas no coinciden.',
            icon: 'error'
        });
        return;
    }

    // Simulación de una llamada a la API de registro
    // En un caso real, aquí iría un fetch a http://localhost:8080/api/register
    console.log(`Registrando a ${name} con el email ${email}`);

    // Aquí asumimos que el registro siempre es exitoso para la demostración
    await Swal.fire({
        title: '¡Registro Exitoso!',
        text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        icon: 'success'
    });

    window.location.href = 'login.html';
}

function saveUserToStorage(userData) {
    localStorage.setItem('jerry_user_session', JSON.stringify(userData));
}

export function getUserFromStorage() {
    const session = localStorage.getItem('jerry_user_session');
    return session ? JSON.parse(session) : null;
}

function logout() {
    localStorage.removeItem('jerry_user_session');
    updateNav(); // Actualiza la barra de navegación inmediatamente
    window.location.href = 'index.html';
}

function updateNav() {
    const userSession = getUserFromStorage();
    const navContainer = document.querySelector('#navbarResponsive .navbar-nav');

    if (!navContainer) return;

    // Limpiar botones de autenticación/acción previos para evitar duplicados
    const oldButtons = document.querySelectorAll('.auth-nav-item');
    oldButtons.forEach(btn => btn.remove());

    if (userSession) {
        // Usuario logueado: Mostrar "Reservá Turno" y "Logout"

        // Botón Reservar Turno
        const reservaItem = document.createElement('li');
        reservaItem.className = 'nav-item auth-nav-item';
        const reservaButton = document.createElement('button');
        reservaButton.className = 'btn btns btn-success btn-radius btn-brd grd1 butn';
        const reservaLink = document.createElement('a');
        reservaLink.className = 'nav-link';
        reservaLink.href = './reservaturno.html';
        reservaLink.textContent = 'Reservá turno';
        reservaButton.appendChild(reservaLink);
        reservaItem.appendChild(reservaButton);

        // Botón Logout
        const logoutItem = document.createElement('li');
        logoutItem.className = 'nav-item auth-nav-item ms-lg-2';
        const logoutButton = document.createElement('button');
        logoutButton.className = 'btn btns btn-danger btn-radius btn-brd grd1 butn';
        logoutButton.textContent = 'Cerrar Sesión';
        logoutButton.onclick = logout;
        logoutItem.appendChild(logoutButton);

        navContainer.appendChild(reservaItem);
        navContainer.appendChild(logoutItem);

    } else {
        // Usuario no logueado: Mostrar botón de Login
        const loginItem = document.createElement('li');
        loginItem.className = 'nav-item auth-nav-item';
        const loginButton = document.createElement('button');
        loginButton.className = 'btn btns btn-primary btn-radius btn-brd grd1 butn';
        const loginLink = document.createElement('a');
        loginLink.className = 'nav-link';
        loginLink.href = './login.html';
        loginLink.textContent = 'Login / Registro';
        loginButton.appendChild(loginLink);
        loginItem.appendChild(loginButton);
        navContainer.appendChild(loginItem);
    }
}

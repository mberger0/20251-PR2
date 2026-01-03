/*Este script debe de gestionar el login de los usuarios.*/


// Referencias a inputs y botones
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const registrationButton = document.getElementById('registration');

/* Añadir las funciones que consideréis necesarias*/

    // Si hay un usuario logeado, redirigimos a la página indice de Pokemons
        const loggedUser = localStorage.getItem('loggedUser');

        if (loggedUser) {
        // Si ya hay usuario logueado, no muestro login
        window.location.href = 'indice.html';
        }

    // Si no hay un usuario logeado, comprobamos datos de login
        loginButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // aqui hago una comprobación básica
        if (!username || !password) {
            alert('Debes introducir usuario y contraseña');
            return;
        }
        // busco el usuario
        const user = User.findByUsername(username);
        // si el usuario existe y la contraseña es correcta
        if (user && user.getPassword() === password) {
        User.setLoggedUser(username); // guardo el usuario logueado
        window.location.href = 'indice.html'; // redirijo a la página principal
        } else {
        alert('Usuario o contraseña incorrectos');
        }
        });

    // Al pulsar el boton redirigimos a la página de registro
        registrationButton.addEventListener('click', () => {
        window.location.href = 'registro.html';
        });

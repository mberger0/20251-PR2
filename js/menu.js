// Función que actualiza el usuario y el número de Pokemons en cada una de las listas

/* Añadir las funciones que consideréis necesarias*/

function updateMenu() {
    const user = User.getLoggedUser();
    if (!user) return;

    const myTeamCount = document.getElementById('myTeamCount');
    const wishesCount = document.getElementById('wishesCount');
    const menuButton = document.getElementById('menuButton');
    // actualizo equipo
    if (myTeamCount) {
        myTeamCount.textContent = user.getMyTeam().getAll().length;
    }
    // actualizo deseos
    if (wishesCount) {
        wishesCount.textContent = user.getWishes().getAll().length;
    }
    // actualizo nombre usuario
    if (menuButton) {
        menuButton.textContent = user.getUsername();
    }
}

// Función para cerrar sesión
function logout() {
    User.logout();
    window.location.href = 'index.html';
}

/* -----------------------
   Inicialización del menú
-------------------------- */
// al cargar el documento actualizo el menú
document.addEventListener('DOMContentLoaded', () => {
    const user = User.getLoggedUser();
    if (!user) return;

    updateMenu();
    // añado el listener al botón de logout
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});
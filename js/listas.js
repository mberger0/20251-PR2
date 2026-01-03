/* Este script gestiona la visualización de las listas de Pokemons del usuario.
    Permite al usuario ver sus equipo de Pokemons y su lista de deseos.
    Debe de permitir eliminar los Pokemon de las listaslas de la lista. */
 
// obtengo el usuario logueado
const user = User.getLoggedUser();
if (!user) location.href = 'index.html';

// referencias DOM
const selector = document.getElementById('listSelector');
const container = document.getElementById('listasContainer');

// evento selector
selector.addEventListener('change', () => {
  displayPokeList(selector.value, user);
});

// render inicial
displayPokeList(selector.value, user);


/* Añadir las funciones que consideréis necesarias*/

// funcion para crear la tarjeta
function createListCard(pokemon, listType, user) {
  const div = document.createElement('div');
  div.className = 'pokemon-card';
  // relleno la tarjeta
  div.innerHTML = `
    <img src="${pokemon.sprites}">
    <h3>${capitalize(pokemon.name)}</h3>
    <button>Eliminar</button>
  `;

    div.querySelector('img').addEventListener('click', () => {
    window.location.href = `detail.html?id=${pokemon.id}`;
  });
  
  // evento botón eliminar
  div.querySelector('button').addEventListener('click', () => {
    user.manageList(pokemon, listType, 'remove');
    user.update();
    updateMenu(user);
    displayPokeList(listType, user);
  });

  return div;
}

// Obtener la lista correspondiente del usuario
function displayPokeList(listType,user) {
  container.innerHTML = '';

  const list = user[listType].getAll();

  list.forEach(pokemon => {
    const card = createListCard(pokemon, listType, user);
    container.appendChild(card);
  });  
}

// botón volver al índice
document.getElementById('backButton')
  ?.addEventListener('click', () => {
    window.location.href = 'indice.html';
  });

// vuelvo a usar esta funcion para poner la primera letra en mayúscula
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

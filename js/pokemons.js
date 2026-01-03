/*Este script permite cargar la información desde la API cuando sea necesario y crear el objeto en el localstorage.*/
/*Tened en cuenta que también debe de gestionar la paginación y los filtros.*/


let allPokemons = [];
let filteredPokemons = [];
let currentIndex = 0;
// Mostramos 12 por página
const pageSize = 12; // Número de pokémons por página que consideréis oportuno
// Total de pokémons a cargar,
const totalPokemons = config.POKEMON_LIMIT; // P.e. 151, los de primera generación, pero podéis cambiarlo (lo he cambiado para que coja el valor de config.js)
const CACHE_KEY = POKEMONS_CACHE_KEY; // POKEMONS_CACHE_KEY está definido en config.js

let currentURL = `${config.apiBaseUrl}`+`${totalPokemons}`; // URL inicial para obtener los pokémons

let user;

async function loadPokemons() {
    // si ya hay cache, la uso
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const parsed = JSON.parse(cached);
        allPokemons = parsed.map(p => Pokemon.fromJSON(p));
        filteredPokemons = [...allPokemons];
        return allPokemons;
    }

    // en caso contrario, lo cargo desde la API
    const pokemons = [];

    try {
        mostrarLoader();
        // cargo los pokémons uno a uno (la API no permite cargar muchos a la vez con todos los detalles)
        for (let i = 1; i <= totalPokemons; i++) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            if (!response.ok) continue;
            
            const data = await response.json();
            // creo el objeto Pokémon
            const pokemon = new Pokemon({
                id: data.id,
                name: data.name,
                height: data.height,
                weight: data.weight,
                baseExperience: data.base_experience,
                abilities: data.abilities.map(a => a.ability.name),
                types: data.types.map(t => t.type.name),
                sprites: data.sprites.other['official-artwork'].front_default,
                stats: data.stats.map(s => ({
                    name: s.stat.name,
                    value: s.base_stat
                }))
            });

            pokemons.push(pokemon);
        }

        // una vez terminado, guardo la cache
        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify(pokemons.map(p => p.toJSON()))
        );
        // actualizo las variables globales
        allPokemons = pokemons;
        filteredPokemons = [...pokemons];
        return pokemons;
    // Si no se puede cargar, muestro error
    } catch (error) {
        console.error('Error cargando pokémons:', error);
        return [];
    } finally {
        ocultarLoader();
    }
}

// He decidido no usar las funciones getPokemons y getPokemonDescription que se pedían, ya que he decidido trabajar directamente sobre cache local.

/*async function getPokemons(url = currentURL) {
    // Debéis de obtener la lista de pokémons desde la API.
    // La URL por defecto es la que se encuentra en currentURL
    // Tened en cuenta que la API devuelve una lista con nombre y URL de detalles de cada pokémon.
    // Por lo tanto deberéis hacer una segunda llamada para obtener los detalles de cada pokémon (imagen, tipos, habilidades, etc).
    // Debéis de manejar errores
    // Uso de try-catch para manejo de errores, ya que es una función asíncrona y puede fallar la llamada a la API
    try {
        mostrarLoader();
        //...
        //Finalmente, debéis de retornar un array con los objetos de los pokémons obtenidos.
        //...
        ocultarLoader();
        return successfulPokemons;
    } catch (error) {
        console.error('Error general obteniendo pokémones:', error);
        ocultarLoader();
        throw error; // O retorna un array vacío: return [];
    }
}

    async function getPokemonDescription(speciesUrl) {
    // Debéis de obtener la descripción en español del Pokémon desde la URL de species obtenida en los detalles del Pokémon.
    // La descripción en español se encuentra en flavor_text_entries donde language.name es "es".
    // Debéis de manejar errores
    // Uso de try-catch para manejo de errores
    try {
        //...
        //...
        if (response.ok) {
            const speciesData = await response.json();
            
            // Busca descripción en español
            const spanishEntry = speciesData.flavor_text_entries.find(
                entry => entry.language.name === 'es'
            );
            
            return spanishEntry ? 
                spanishEntry.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ') : 
                "Descripción no disponible en español";
        }
        //...
        //...
        
    } catch (error) {
        console.error('Error crítico en getPokemonDescription:', error);
        return "Error al cargar descripción";
    }
}*/

// Función para mostrar el loader y desenfocar la pantalla
function mostrarLoader() {
    document.getElementById('loader').style.display = 'block';  // Mostrar el spinner
    document.body.classList.add('loading');  // Añadir clase para desenfocar el contenido
}

// Función para ocultar el loader y eliminar el desenfoque
function ocultarLoader() {
    document.getElementById('loader').style.display = 'none';  // Ocultar el spinner
    document.body.classList.remove('loading');  // Eliminar la clase de desenfoque
}

/* Añadir las funciones que consideréis necesarias*/

// función para ir a la página de detalle de un pokémon (al hacer click en su tarjeta o nombre)
function goToDetail(id) {
  window.location.href = `detail.html?id=${id}`;
}

// función para crear la tarjeta de un pokémon
// devuelve un elemento div con la clase 'pokemon-card'
function createPokemonCard(pokemon) {
    const div = document.createElement('div');
    div.className = 'pokemon-card';
    // relleno el contenido
    div.innerHTML = `
        <img src="${pokemon.sprites}" alt="${pokemon.name}">
        <h4>#${pokemon.id.toString().padStart(3, '0')}</h4>
        <h3>${capitalize(pokemon.name)}</h3>

        <div class="types">
        ${pokemon.types.map(t => `<span class="type ${t}">${capitalize(t)}</span>`).join(', ')}
        </div>

        <div class="actions">
        <button class="team-btn">Mi equipo</button>
        <button class="wish-btn">Deseos</button>
        </div>
    `;

    setupListButtons(div, pokemon);
    // añado los listeners para ir a los detalles del pokémon
    const img = div.querySelector('img');
    const name = div.querySelector('h3');

    img.addEventListener('click', () => goToDetail(pokemon.id));
    name.addEventListener('click', () => goToDetail(pokemon.id));

    return div;
}


// conecto los botones con manageList()
function setupListButtons(card, pokemon) {
    if (!user) return;
    // obtengo los botones
    const teamBtn = card.querySelector('.team-btn');
    const wishBtn = card.querySelector('.wish-btn');
    // asigno los eventos
    teamBtn.addEventListener('click', () => {
        handleListAction(user, pokemon, 'myTeam');
        refreshButtonState(user, pokemon, teamBtn, wishBtn);
    });

    wishBtn.addEventListener('click', () => {
        handleListAction(user, pokemon, 'wishes');
        refreshButtonState(user, pokemon, teamBtn, wishBtn);
    });
    // actualizo el estado inicial
    refreshButtonState(user, pokemon, teamBtn, wishBtn);
}

// funcion para añadir o eliminar pokémon de una lista
function handleListAction(user, pokemon, listName) {
    // compruebo si ya está en la lista
    const exists =
        listName === 'myTeam'
            ? user.getMyTeam().has(pokemon.id)
            : user.getWishes().has(pokemon.id);
    // llamo a manageList
    const ok = user.manageList(
        pokemon,
        listName,
        exists ? 'remove' : 'add'
    );
    // si no se ha podido añadir o eliminar, muestro alerta
    if (!ok) {
        alert(
            listName === 'myTeam'
                ? 'No se puede añadir más de 6 Pokémons al equipo'
                : 'No se ha podido realizar la acción'
        );
        return;
    }
    // actualizo el usuario en localStorage
    user.update();
    // muestro alerta de añadido o eliminado
    alert(
        exists
            ? 'Pokémon eliminado de la lista'
            : 'Pokémon añadido a la lista'
    );

    updateMenu();
}


// función para actualizar el estado de los botones según si el pokémon está en la lista o no
function refreshButtonState(user, pokemon, teamBtn, wishBtn) {
    if (teamBtn) {
        teamBtn.textContent =
            user.getMyTeam().has(pokemon.id)
                ? 'X Quitar'
                : '+ Mi equipo';
    }

    if (wishBtn) {
        wishBtn.textContent =
            user.getWishes().has(pokemon.id)
                ? 'X Quitar'
                : '+ Deseos';
    }
}


// función para renderizar la siguiente página de pokémons
// añade al contenedor 'resultados' las tarjetas de los pokémons
function renderNextPage() {
    const container = document.getElementById('resultados');
    // obtengo el slice de pokémons a renderizar
    const slice = filteredPokemons.slice(
        currentIndex,
        currentIndex + pageSize
    );
    // los añado al contenedor
    slice.forEach(p => {
        container.appendChild(createPokemonCard(p));
    });
    // actualizo el índice
    currentIndex += pageSize;

    // desactivo botón si no quedan
    if (currentIndex >= filteredPokemons.length) {
        document.getElementById('loadMore').disabled = true;
    }
}

//botón para cargar más pokémons
document.getElementById('loadMore').addEventListener('click', () => {
    renderNextPage();
});

// funcion para inicializar los filtros
// añade los tipos al listado de filtros y asigna el evento al botón de búsqueda
function initFilters() {
    const typeList = document.getElementById('typeList');
    // obtengo la lista de tipos únicos
    type_list.forEach(type => {
        const li = document.createElement('li');
        li.innerHTML = `
            <label>
                <input type="checkbox" value="${type.id}">
                ${type.name}
            </label>
        `;
        typeList.appendChild(li);
    });
    // asigno el evento al botón de búsqueda
    document.getElementById('searchButton')
        .addEventListener('click', applyFilters);
}

// función para aplicar los filtros
// actualiza la lista de pokémons filtrados y resetea la paginación
function applyFilters() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const weightMin = Number(document.getElementById('weightMin').value || 0);
    const weightMax = Number(document.getElementById('weightMax').value || Infinity);
    // tipos seleccionados
    const selectedTypes = Array.from(
        document.querySelectorAll('#typeList input:checked')
    ).map(cb => cb.value);
    // filtro los pokémons
    filteredPokemons = allPokemons.filter(pokemon => {

        // nombre o número
        const paddedId = pokemon.id.toString().padStart(3, '0'); // id con ceros a la izquierda (permite buscar 001, 002, etc)
        const matchSearch =
        pokemon.name.includes(search) || // nombre
        pokemon.id.toString().includes(search) || // id normal
        paddedId.includes(search); // id con ceros

        // peso
        const matchWeight =
            pokemon.weight >= weightMin &&
            pokemon.weight <= weightMax;

        // tipos
        const matchType =
            selectedTypes.length === 0 ||
            selectedTypes.some(t => pokemon.types.includes(t));

        return matchSearch && matchWeight && matchType;
    });

    // ordeno según la selección
    const order = document.getElementById('orden').value;
    // ordeno la lista
    filteredPokemons.sort((a, b) => {
    switch (order) {
        case 'idAsc':
        return a.id - b.id;
        case 'idDesc':
        return b.id - a.id;
        case 'nameAsc':
        return a.name.localeCompare(b.name);
        case 'nameDesc':
        return b.name.localeCompare(a.name);
        default:
        return 0;
    }
    });

    resetAndRender();
    saveFiltersState();
}

// funcion para guardar el estado de los filtros en localStorage 
function saveFiltersState() {
  const state = {
    search: document.getElementById('searchInput').value,
    weightMin: document.getElementById('weightMin').value,
    weightMax: document.getElementById('weightMax').value,
    selectedTypes: Array.from(
      document.querySelectorAll('#typeList input:checked')
    ).map(cb => cb.value),
    order: document.getElementById('orden').value
  };

  localStorage.setItem(FILTERS_STATE_KEY, JSON.stringify(state));
}

// función para resetear la paginación y renderizar desde el inicio
function resetAndRender() {
    currentIndex = 0;
    document.getElementById('resultados').innerHTML = '';
    document.getElementById('loadMore').disabled = false;
    renderNextPage();
    // desactivo botón si no hay resultados
    if (filteredPokemons.length === 0) {
    document.getElementById('loadMore').disabled = true;
}
}

// función para restaurar el estado de los filtros desde localStorage
function restoreFiltersState() {
  const saved = localStorage.getItem(FILTERS_STATE_KEY);
  if (!saved) return;

  const state = JSON.parse(saved);
  // restauro los valores
  document.getElementById('searchInput').value = state.search || '';
  document.getElementById('weightMin').value = state.weightMin || '';
  document.getElementById('weightMax').value = state.weightMax || '';
  document.getElementById('orden').value = state.order || 'idAsc';
  // tipos
  document
    .querySelectorAll('#typeList input')
    .forEach(cb => {
      cb.checked = state.selectedTypes?.includes(cb.value);
    });

  applyFilters();
}

// cargo cache, pinto primera página e inicializo filtros al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  //aseguro que hay usuario logueado
  user = User.getLoggedUser();
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
    await loadPokemons();
  initFilters();
  // también guardo cuando cambio el select de orden
  document.getElementById('orden').addEventListener('change', () => {
    applyFilters();
});
  // compruebo si hay filtros guardados
  const hasSavedFilters = localStorage.getItem(FILTERS_STATE_KEY);
  if (hasSavedFilters) {
    restoreFiltersState();
  } else {
    renderNextPage();
  }
});

// funcion para que las tarjetas de pokémons tengan el nombre con la primera letra en mayúscula
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

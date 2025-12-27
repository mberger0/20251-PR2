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

async function getPokemons(url = currentURL) {
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
}

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

// función para crear la tarjeta de un pokémon
// devuelve un elemento div con la clase 'pokemon-card'
function createPokemonCard(pokemon) {
    const div = document.createElement('div');
    div.className = 'pokemon-card';
    // relleno el contenido
    div.innerHTML = `
        <img src="${pokemon.sprites}" alt="${pokemon.name}">
        <h4>#${pokemon.id.toString().padStart(3, '0')}</h4>
        <h3>${pokemon.name}</h3>
        <div class="types">
            ${pokemon.types.map(t => `<span class="type ${t}">${t}</span>`).join('')}
        </div>
    `;

    return div;
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
        const matchSearch =
            pokemon.name.includes(search) ||
            pokemon.id.toString().includes(search);

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

    resetAndRender();
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

// cargo cache, pinto primera página e inicializo filtros al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    await loadPokemons();
    renderNextPage();
    initFilters();
});
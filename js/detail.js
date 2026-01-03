/*Este script carga la información del Pokemon seleccionado y la muestra en la página de detalles.*/

// aseguro que el usuario está logueado
const user = User.getLoggedUser();
if (!user) {
  window.location.href = 'index.html';
}

// Obtener el ID del Pokémon desde la URL
const params = new URLSearchParams(window.location.search);
const pokemonId = Number(params.get('id'));

if (!pokemonId) {
  window.location.href = 'indice.html';
}

/* Añadir las funciones que consideréis necesarias*/

// solo uso localStorage
function getPokemonFromCache(id) {
  const cache = localStorage.getItem(POKEMONS_CACHE_KEY);
  if (!cache) return null;

  const pokemons = JSON.parse(cache).map(p => Pokemon.fromJSON(p));
  return pokemons.find(p => p.id === id);
}

// obtengo la descripción de los pokémons en español.
async function getPokemonDescription(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    if (!response.ok) return 'Descripción no disponible';
    // obtengo la descripción en español
    const data = await response.json();
    const entry = data.flavor_text_entries.find(
      e => e.language.name === 'es'
    );
    // limpio el texto de saltos de línea y caracteres especiales
    return entry
      ? entry.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ')
      : 'Descripción no disponible';
  } catch (error) {
    return 'Error al cargar descripción';
  }
}

// pinto el detalle del Pokémon
function renderPokemonDetail(pokemon, description) {
  const container = document.getElementById('pokemonDetail');
  // ajusto el HTML como lo quiero mostrar
  container.innerHTML = `
    <img src="${pokemon.sprites}" alt="${pokemon.name}">
    <h2>#${pokemon.id.toString().padStart(3, '0')} ${capitalize(pokemon.name)}</h2>

    <p><strong>Descripción:</strong> ${description}</p>

    <p><strong>Altura:</strong> ${pokemon.height}</p>
    <p><strong>Peso:</strong> ${pokemon.weight}</p>
    <p><strong>Experiencia base:</strong> ${pokemon.baseExperience}</p>

    <p><strong>Tipos:</strong>
      ${pokemon.types.map(t => `<span class="type ${t}">${t}</span>`).join(', ')}
    </p>

    <p><strong>Habilidades:</strong> ${pokemon.abilities.join(', ')}</p>

    <h3>Estadísticas</h3>
    <ul>
      ${pokemon.stats.map(s =>
        `<li>${capitalize(s.name)}: ${s.value}</li>`
      ).join('')}
    </ul>
  `;
}

// evento botón volver
document.getElementById('backButton')
  .addEventListener('click', () => {
    window.location.href = 'indice.html';
  });

// carga inicial
  document.addEventListener('DOMContentLoaded', async () => {
  const pokemon = getPokemonFromCache(pokemonId);
  if (!pokemon) {
    window.location.href = 'indice.html';
    return;
  }
 // obtengo la descripción y pinto el detalle
  const description = await getPokemonDescription(pokemon.id);
  renderPokemonDetail(pokemon, description);
});

// vuelvo a usar esta funcion para poner la primera letra en mayúscula
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
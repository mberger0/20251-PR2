const config = {
    apiBaseUrl: 'https://pokeapi.co/api/v2/pokemon?limit=',
    POKEMON_LIMIT: 151 // en caso de querer cambiar el límite de pokémons se hace aquí
};

const cities = [
    { name: 'Madrid', postalCode: "28001" },
    { name: 'Barcelona', postalCode: "08001" },
    { name: 'Valencia', postalCode: "46001" }
    //....
]


const type_list = [
    { id: 'grass', name: 'grass' },
    { id: 'fire', name: 'fire' },
    { id: 'water', name: 'water' },
    { id: 'bug', name: 'bug' },
    { id: 'normal', name: 'normal' },
    { id: 'electric', name: 'electric' },
    { id: 'ground', name: 'ground' },
    { id: 'fairy', name: 'fairy' },
    { id: 'fighting', name: 'fighting' },
    { id: 'psychic', name: 'psychic' },
    { id: 'rock', name: 'rock' },
    { id: 'ghost', name: 'ghost' },
    { id: 'ice', name: 'ice' },
    { id: 'dragon', name: 'dragon' },
    { id: 'poison', name: 'poison' },
    { id: 'flying', name: 'flying' },
]

const listNames = {
    myTeam: "Mi Equipo",
    wishes: "Deseos",
};

// Claves de localStorage (cache y estado)
const POKEMONS_CACHE_KEY = 'pokemonsCache';
const FILTERS_STATE_KEY = 'filtersState';
